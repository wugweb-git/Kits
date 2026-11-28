<?php
/**
 * Directory map and "Near me" (owner, 20 Oct 2026: built natively instead of Web Directory Free).
 *
 * - The list stays the default on every Directory view (all, state, district, district × type, ?tag= filters); a
 *   List / Map switch above it shows the same organisations on a map (MapLibre GL with OpenStreetMap data from
 *   OpenFreeMap: no key, no Google), clustered, one marker per listing with its type icon, a popup with name, type,
 *   district and a link. Points: the listing's own Google Maps location (aw_lat / aw_lng), else the geocoded point
 *   (geocode.php), shown as approximate unless it was a street match. Listings with no point are counted, not shown.
 * - Near me: the visitor's location (asked only when they press the button) or, where a site supports it, a postal code
 *   (the filters directoryweb_near_from_code and directoryweb_near_code_input; the district centre is the starting point) → listings within 5 / 10 / 25 / 50 km, nearest first.
 *   Only street, locality and PIN points are ranked (locality and PIN distances shown as "~N km"); listings placed
 *   only at their district's centre are never ranked: they follow as "In your district (location approximate)". The
 *   nearest district's Directory page is always offered.
 * - REST: GET /aw/v1/dir-points (filtered points for the map), GET /aw/v1/dir-near (nearest listings). Both read one
 *   cached list of every published listing's point (12 hours; cleared when a listing is saved or geocoded).
 * The map's text alternative is the list itself (the switch returns to it; the map says so).
 *
 * @package directoryweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

const DIRECTORYWEB_DIR_MAP_LIB = 'assets/vendor/maplibre-gl-4.7.1/'; // MapLibre GL, served from this plugin (npm package files; see its README)
const DIRECTORYWEB_DIR_STYLE   = 'https://tiles.openfreemap.org/styles/liberty';

/**
 * A district's centre [lat, lng] by LGD district code, from the file the `directoryweb_district_centroids_file`
 * filter names (JSON code => [lat, lng]; the plugin ships none). The same as Core's aw_district_centroid(), which read this file too.
 *
 * @param int|string $code LGD district code.
 * @return array|null
 */
function directoryweb_district_centroid( $code ) {
	static $c = null;
	if ( null === $c ) {
		$f = apply_filters( 'directoryweb_district_centroids_file', '' ); // the plugin ships none; a site gives its own
		$c = is_string( $f ) && '' !== $f && is_readable( $f ) ? (array) json_decode( (string) file_get_contents( $f ), true ) : array(); // phpcs:ignore WordPress.WP.AlternativeFunctions
	}
	return $c[ (string) (int) $code ] ?? null;
}

/**
 * Distance in km between two districts' centres; null when either is not known.
 *
 * @param int|string $a LGD district code.
 * @param int|string $b LGD district code.
 * @return float|null
 */
function directoryweb_district_km( $a, $b ) {
	$p = directoryweb_district_centroid( $a );
	$q = directoryweb_district_centroid( $b );
	if ( ! $p || ! $q ) {
		return null;
	}
	$r = M_PI / 180;
	$h = sin( ( $q[0] - $p[0] ) * $r / 2 ) ** 2 + cos( $p[0] * $r ) * cos( $q[0] * $r ) * sin( ( $q[1] - $p[1] ) * $r / 2 ) ** 2;
	return 12742 * asin( min( 1, sqrt( $h ) ) );
}

/**
 * Every published listing as a compact row, cached: [id, lat|null, lng|null, approx 0/1, primary type slug, name,
 * district name, path, state codes, district codes, tag slugs, claimed 0/1 (aw_verified), precision (own, address,
 * locality, pin, district), Verified 0/1 (government documents)].
 */
function directoryweb_dir_points_all() {
	$all = get_transient( 'aw_dir_points' );
	if ( is_array( $all ) ) {
		return $all;
	}
	$all = array();
	$ids = get_posts( array( 'post_type' => 'aw_listing', 'post_status' => 'publish', 'numberposts' => -1, 'fields' => 'ids', 'orderby' => 'title', 'order' => 'ASC' ) );
	update_meta_cache( 'post', $ids );
	update_object_term_cache( $ids, 'aw_listing' );
	$type_slugs = directoryweb_listing_type_slugs();
	foreach ( $ids as $id ) {
		$pt                 = function_exists( 'directoryweb_geo_point' ) ? directoryweb_geo_point( $id ) : null;
		list( $st, $dt )    = directoryweb_item_codes( $id );
		$tags               = wp_list_pluck( (array) get_the_terms( $id, 'post_tag' ), 'slug' );
		$types              = array_values( array_intersect( $tags, $type_slugs ) );
		list( , $district ) = directoryweb_item_place_names( $id );
		$all[]              = array(
			$id,
			$pt ? round( $pt[0], 5 ) : null,
			$pt ? round( $pt[1], 5 ) : null,
			$pt && ! in_array( $pt[2], array( 'own', 'address' ), true ) ? 1 : 0,
			$types ? $types[0] : '',
			html_entity_decode( get_the_title( $id ), ENT_QUOTES ),
			$district,
			wp_make_link_relative( get_permalink( $id ) ),
			$st,
			$dt,
			$tags,
			'1' === (string) get_post_meta( $id, 'aw_verified', true ) ? 1 : 0,
			$pt ? (string) $pt[2] : '',
			'' !== (string) get_post_meta( $id, 'aw_gov_verified_on', true ) ? 1 : 0,
		);
	}
	set_transient( 'aw_dir_points', $all, 12 * HOUR_IN_SECONDS );
	return $all;
}

add_action( 'save_post_aw_listing', fn() => delete_transient( 'aw_dir_points' ) );

/**
 * The rows matching a Directory view's filters.
 *
 * @param WP_REST_Request $r place (state or district slug), type (comma list), service (comma list), verified (claimed), gov (Verified), q.
 * @return array
 */
function directoryweb_dir_points_filter( WP_REST_Request $r ) {
	$place    = directoryweb_place_by_slug( sanitize_title( (string) $r->get_param( 'place' ) ) );
	$types    = array_filter( array_map( 'sanitize_title', explode( ',', (string) $r->get_param( 'type' ) ) ) );
	foreach ( directoryweb_type_groups() as $group => $g ) { // a type group stands for all its types
		if ( in_array( $group, $types, true ) ) {
			$types = array_merge( array_diff( $types, array( $group ) ), (array) $g['types'] );
		}
	}
	$services = array_filter( array_map( 'sanitize_title', explode( ',', (string) $r->get_param( 'service' ) ) ) );
	$verified = (bool) $r->get_param( 'verified' );
	$gov      = (bool) $r->get_param( 'gov' );
	$q        = strtolower( trim( sanitize_text_field( (string) $r->get_param( 'q' ) ) ) );
	$out      = array();
	foreach ( directoryweb_dir_points_all() as $row ) {
		if ( $place && ! in_array( (int) $place->code, 'district' === $place->kind ? $row[9] : $row[8], true ) ) {
			continue;
		}
		if ( $types && ! array_intersect( $types, $row[10] ) ) {
			continue;
		}
		if ( $services && array_diff( $services, $row[10] ) ) {
			continue;
		}
		if ( ( $verified && ! $row[11] ) || ( $gov && empty( $row[13] ) ) || ( '' !== $q && false === strpos( strtolower( $row[5] ), $q ) ) ) {
			continue;
		}
		$out[] = $row;
	}
	return $out;
}

/** A row as the browser gets it. */
function directoryweb_dir_point_out( $row, $km = null ) {
	$o = array(
		'id' => $row[0],
		'y'  => $row[1],
		'x'  => $row[2],
		'a'  => $row[3],
		't'  => $row[4],
		'n'  => $row[5],
		'd'  => $row[6],
		'u'  => $row[7],
		'p'  => (string) ( $row[12] ?? '' ),
	);
	if ( null !== $km ) {
		$o['km'] = round( $km, 1 );
	}
	return $o;
}

/** Type names by slug, for popups and the Near me list. */
function directoryweb_dir_type_names() {
	$out = array();
	foreach ( directoryweb_listing_type_slugs() as $slug ) {
		$t            = get_term_by( 'slug', $slug, 'post_tag' );
		$out[ $slug ] = $t ? $t->name : $slug;
	}
	return $out;
}

add_action(
	'rest_api_init',
	function () {
		$args = array(
			'place'    => array( 'type' => 'string' ),
			'type'     => array( 'type' => 'string' ),
			'service'  => array( 'type' => 'string' ),
			'verified' => array( 'type' => 'string' ),
			'gov'      => array( 'type' => 'string' ),
			'q'        => array( 'type' => 'string' ),
		);
		register_rest_route(
			'aw/v1',
			'/dir-points',
			array(
				'methods'             => 'GET',
				'permission_callback' => '__return_true', // public listings only
				'args'                => $args,
				'callback'            => function ( WP_REST_Request $r ) {
					$rows = directoryweb_dir_points_filter( $r );
					$pts  = array_values( array_filter( $rows, fn( $x ) => null !== $x[1] ) );
					$res  = new WP_REST_Response(
						array(
							'total'  => count( $rows ),
							'approx' => count( array_filter( $pts, fn( $x ) => $x[3] ) ),
							'types'  => directoryweb_dir_type_names(),
							'points' => array_map( 'directoryweb_dir_point_out', $pts ),
						)
					);
					$res->header( 'Cache-Control', 'public, max-age=3600' );
					return $res;
				},
			)
		);
		register_rest_route(
			'aw/v1',
			'/dir-near',
			array(
				'methods'             => 'GET',
				'permission_callback' => '__return_true',
				'args'                => $args + array(
					'lat' => array( 'type' => 'number' ),
					'lng' => array( 'type' => 'number' ),
					'pin' => array( 'type' => 'string' ),
					'km'  => array( 'type' => 'integer' ),
				),
				'callback'            => 'directoryweb_dir_near',
			)
		);
	}
);

/** GET /aw/v1/dir-near: the nearest listings to a point or a PIN code. */
function directoryweb_dir_near( WP_REST_Request $r ) {
	$km     = in_array( (int) $r->get_param( 'km' ), array( 5, 10, 25, 50 ), true ) ? (int) $r->get_param( 'km' ) : 10;
	$pin    = trim( sanitize_text_field( (string) $r->get_param( 'pin' ) ) );
	$lat    = (float) $r->get_param( 'lat' );
	$lng    = (float) $r->get_param( 'lng' );
	$origin = '';
	$pin_district = 0;
	if ( '' !== $pin ) {
		/**
		 * A site that knows its postal codes turns one into a point: array( 'lat' => , 'lng' => , 'origin' => text, 'district' => code ),
		 * a WP_Error, or null when postal codes are not supported (the default).
		 *
		 * @param array|WP_Error|null $found Answer.
		 * @param string              $pin   The code as sent.
		 */
		$found = apply_filters( 'directoryweb_near_from_code', null, $pin );
		if ( is_wp_error( $found ) ) {
			return $found;
		}
		if ( ! is_array( $found ) ) {
			return new WP_Error( 'aw_pin', 'Search by postal code is not available.', array( 'status' => 400 ) );
		}
		$lat          = (float) $found['lat'];
		$lng          = (float) $found['lng'];
		$origin       = (string) $found['origin'];
		$pin_district = (int) ( $found['district'] ?? 0 );
	} else {
		/**
		 * The area Near me accepts, as [ min lat, max lat, min lng, max lng ]. The default is the whole world; a site
		 * that covers one country narrows it (for example array( 6, 37.5, 68, 97.5 ) for India).
		 *
		 * @param array $bounds Bounds.
		 */
		$b = apply_filters( 'directoryweb_near_bounds', array( -90, 90, -180, 180 ) );
		$b = is_array( $b ) && 4 === count( $b ) ? array_map( 'floatval', array_values( $b ) ) : array( -90.0, 90.0, -180.0, 180.0 );
		if ( $lat < $b[0] || $lat > $b[1] || $lng < $b[2] || $lng > $b[3] || ( 0.0 === $lat && 0.0 === $lng ) ) {
			return new WP_Error( 'aw_where', 'That location is outside the area this directory covers.', array( 'status' => 400 ) );
		}
	}
	// The nearest district (by centre): the PIN's own district, else the closest centre to the point.
	$best = null;
	if ( '' !== $pin && $pin_district ) {
		$best = array( 0, directoryweb_place_district( $pin_district ) );
	} else {
		foreach ( directoryweb_place_states() as $s ) {
			foreach ( directoryweb_place_districts( $s->code ) as $dist ) {
				$c = directoryweb_district_centroid( $dist->code );
				if ( $c ) {
					$d = directoryweb_geo_km( $lat, $lng, $c[0], $c[1] );
					if ( ! $best || $d < $best[0] ) {
						$best = array( $d, $dist );
					}
				}
			}
		}
	}
	$dcode = $best && $best[1] ? (int) $best[1]->code : 0;
	$near  = array();
	$inds  = array();
	foreach ( directoryweb_dir_points_filter( $r ) as $row ) {
		if ( null === $row[1] ) {
			continue;
		}
		$prec = (string) ( $row[12] ?? ( $row[3] ? 'district' : 'own' ) );
		if ( 'district' === $prec ) {
			if ( $dcode && in_array( $dcode, $row[9], true ) ) {
				$inds[] = $row; // never ranked by distance
			}
			continue;
		}
		$d = directoryweb_geo_km( $lat, $lng, $row[1], $row[2] );
		if ( $d <= $km ) {
			$near[] = array( $d, $row );
		}
	}
	usort( $near, fn( $a, $b ) => $a[0] <=> $b[0] );
	$district = $best && $best[1] ? array( 'name' => $best[1]->name, 'url' => wp_make_link_relative( directoryweb_directory_url( $best[1]->slug ) ), 'count' => function_exists( 'directoryweb_place_count' ) ? (int) directoryweb_place_count( $best[1] ) : 0 ) : null;
	return array(
		'origin'   => $origin,
		'lat'      => round( $lat, 4 ),
		'lng'      => round( $lng, 4 ),
		'km'       => $km,
		'count'    => count( $near ),
		'types'    => directoryweb_dir_type_names(),
		'results'  => array_map( fn( $x ) => directoryweb_dir_point_out( $x[1], $x[0] ), array_slice( $near, 0, 50 ) ),
		'in_district' => array_map( 'directoryweb_dir_point_out', array_slice( $inds, 0, 50 ) ),
		'in_district_count' => count( $inds ),
		'district' => $district,
	);
}

/* ---------- The switch, Near me and the map, above the Directory list ---------- */

/** The current Directory view's filters, for the browser. */
function directoryweb_dir_view_filters() {
	$place = directoryweb_current_place();
	$type  = (string) get_query_var( 'aw_dir_type' );
	if ( '' === $type ) {
		$type = directoryweb_request_type();
	}
	return array_filter(
		array(
			'place'    => $place ? $place->slug : '',
			'type'     => $type,
			'service'  => implode( ',', directoryweb_request_services() ),
			'verified' => empty( $_GET['verified'] ) ? '' : '1', // phpcs:ignore WordPress.Security.NonceVerification
			'gov'      => empty( $_GET['gov'] ) ? '' : '1', // phpcs:ignore WordPress.Security.NonceVerification
			'q'        => sanitize_text_field( wp_unslash( $_GET['q'] ?? '' ) ), // phpcs:ignore WordPress.Security.NonceVerification
		)
	);
}

/** The view controls in the Directory toolbar (aw_block_result_head()): List / Map and Near me. */
function directoryweb_dir_tools_html() {
	wp_enqueue_script( 'aw-dir-map' );
	wp_enqueue_style( 'aw-dir-map' );
	return '<div class="aw-dir-tools" data-filters="' . esc_attr( wp_json_encode( (object) directoryweb_dir_view_filters() ) ) . '">'
		. '<div class="kit-segment" role="group" aria-label="View"><button type="button" data-view="list" aria-pressed="true">List</button><button type="button" data-view="map" aria-pressed="false">Map</button></div>'
		. '<button type="button" class="kit-btn kit-btn--sm kit-btn--ghost kit-btn--ico-map-pin aw-near-open" aria-expanded="false" aria-controls="aw-near">Near me</button>'
		. '</div>';
}

/** The panels the toolbar opens, under it: Near me and the map (hidden until asked for). */
function directoryweb_dir_panels_html() {
	$icons = ''; // one icon per type; dir-map.js reads each one's picture (--i) for the map's markers
	foreach ( directoryweb_listing_type_slugs() as $slug ) {
		directoryweb_use_style( 'aw-type-icons' ); // the type pictures (aw-type-icons.css)
		$icons .= directoryweb_icon( 'type-' . $slug, 'kit-ico--type' ); // as Core's aw_type_icon(): kit-ico--type keeps its 1em size, spacing and the text colour
	}
	return '<section id="aw-near" class="aw-near" hidden aria-label="Near me">'
		. '<form class="aw-near-form"><button type="button" class="kit-btn aw-near-locate">Use my location</button>'
		. (string) apply_filters( 'directoryweb_near_code_input', '' )
		. '<label class="screen-reader-text" for="aw-near-km">Distance</label><select id="aw-near-km" class="aw-near-km"><option value="5">Within 5 km</option><option value="10" selected>Within 10 km</option><option value="25">Within 25 km</option><option value="50">Within 50 km</option></select>'
		. '<button type="submit" class="kit-btn kit-btn--brand">Find</button></form>'
		. '<p class="aw-near-note">Your location is used only to sort this list, in your browser and on this request; it is not stored.</p>'
		. '<div class="aw-near-results" role="status" aria-live="polite"></div></section>'
		. '<section class="aw-dir-map" hidden aria-label="Map"><p class="aw-dir-map-note"></p><div class="aw-dir-map-canvas" aria-hidden="true"></div></section>'
		. '<div class="aw-dir-icons" hidden>' . $icons . '</div>';
}

/**
 * Render the directory map block and shortcode.
 *
 * @param array $attributes Block attributes.
 * @return string HTML output.
 */
function directoryweb_render_map_block( $attributes = array() ): string {
	$align    = ! empty( $attributes['align'] ) ? ' align' . sanitize_html_class( $attributes['align'] ) : ' alignwide';
	$radius   = isset( $attributes['radius'] ) ? (int) $attributes['radius'] : 25;
	$zoom     = isset( $attributes['zoom'] ) ? (int) $attributes['zoom'] : 11;
	$near_me  = ! isset( $attributes['showNearMe'] ) || ! empty( $attributes['showNearMe'] );
	$height   = ! empty( $attributes['height'] ) ? esc_attr( $attributes['height'] ) : '500px';

	$custom_attrs = ' data-radius="' . esc_attr( $radius ) . '" data-zoom="' . esc_attr( $zoom ) . '" data-near-me="' . ( $near_me ? '1' : '0' ) . '" style="--aw-map-height:' . esc_attr( $height ) . ';"';

	return '<div class="directoryweb-block-map' . esc_attr( $align ) . '"' . $custom_attrs . '>'
		. directoryweb_dir_tools_html()
		. directoryweb_dir_panels_html()
		. '</div>';
}
add_shortcode( 'directoryweb_map', 'directoryweb_render_map_block' );

add_action(
	'init',
	function () {
		if ( function_exists( 'register_block_type' ) ) {
			register_block_type(
				'directoryweb/map',
				array(
					'title'           => __( 'Directory Map', 'directoryweb' ),
					'description'     => __( 'Interactive directory map with markers, clustering, and Near me geolocation.', 'directoryweb' ),
					'category'        => 'widgets',
					'render_callback' => 'directoryweb_render_map_block',
					'attributes'      => array(
						'align'      => array(
							'type'    => 'string',
							'default' => 'wide',
						),
						'radius'     => array(
							'type'    => 'number',
							'default' => 25,
						),
						'zoom'       => array(
							'type'    => 'number',
							'default' => 11,
						),
						'showNearMe' => array(
							'type'    => 'boolean',
							'default' => true,
						),
						'height'     => array(
							'type'    => 'string',
							'default' => '500px',
						),
					),
				)
			);
		}
	}
);

add_action(
	'wp_enqueue_scripts',
	function () {
		$base = plugin_dir_url( __DIR__ ) . 'assets/';
		wp_register_script( 'aw-dir-map', $base . 'js/dir-map.js', array(), DIRECTORYWEB_VERSION . '-' . (string) filemtime( dirname( __DIR__ ) . '/assets/js/dir-map.js' ), array( 'in_footer' => true, 'strategy' => 'defer' ) );
		wp_register_style( 'aw-dir-map', $base . 'css/dir-map.css', array(), DIRECTORYWEB_VERSION . '-' . (string) filemtime( dirname( __DIR__ ) . '/assets/css/dir-map.css' ) );
		wp_localize_script(
			'aw-dir-map',
			'awDirMap',
			array(
				'points' => rest_url( 'aw/v1/dir-points' ),
				'near'   => rest_url( 'aw/v1/dir-near' ),
				'lib'    => plugin_dir_url( __DIR__ ) . DIRECTORYWEB_DIR_MAP_LIB, // loaded by dir-map.js only when the map opens
				'style'  => DIRECTORYWEB_DIR_STYLE,
			)
		);
	}
);
