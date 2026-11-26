<?php
/**
 * RankWeb → Convert to WebP: makes a .webp copy next to each JPEG and PNG in the media library (and each size), so
 * "Serve WebP copies of images" has something to serve. Originals are never changed. Dry run by default, a batch at a time.
 * The planning is in class-rankweb-webp.php.
 *
 *   GET  rankweb/v1/webp       whether the server can write WebP, and how many images there are
 *   POST rankweb/v1/webp/run   { apply, after } one batch; the report says where the next starts
 *
 * @package rankweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

require_once __DIR__ . '/class-rankweb-webp.php';

const RANKWEB_WEBP_BATCH = 15;

add_action(
	'admin_menu',
	function () {
		add_submenu_page( AW_SEO_MENU, __( 'Convert to WebP', 'rankweb' ), __( 'Convert to WebP', 'rankweb' ), 'manage_options', 'aw-webp', 'rankweb_webp_screen' );
	}
);

/** RankWeb → Convert to WebP. */
function rankweb_webp_screen(): void {
	if ( ! current_user_can( 'manage_options' ) ) {
		wp_die( esc_html__( 'You are not allowed to see this.', 'rankweb' ), '', array( 'response' => 403 ) );
	}
	rankweb_ui_page( 'webp' );
}

/** Whether this server's image library can write WebP. */
function rankweb_webp_ready(): bool {
	return function_exists( 'wp_image_editor_supports' ) && wp_image_editor_supports( array( 'mime_type' => 'image/webp' ) );
}

/** What the screen shows first. */
function rankweb_webp_payload(): array {
	global $wpdb;
	$mimes = RankWeb_Webp::MIMES;
	$n     = (int) $wpdb->get_var( $wpdb->prepare( "SELECT COUNT(*) FROM {$wpdb->posts} WHERE post_type = 'attachment' AND post_mime_type IN (%s,%s)", $mimes[0], $mimes[1] ) ); // phpcs:ignore WordPress.DB.DirectDatabaseQuery -- a count for the screen
	return array( 'ready' => rankweb_webp_ready(), 'images' => $n, 'serving' => defined( 'RANKWEB_WEBP_SERVE' ) && (bool) RANKWEB_WEBP_SERVE );
}

/**
 * One batch.
 *
 * @param bool $apply False: a dry run (counts what is missing, writes nothing).
 * @param int  $after The last attachment ID of the batch before.
 */
function rankweb_webp_run( bool $apply, int $after = 0 ): array {
	global $wpdb;
	if ( ! rankweb_webp_ready() ) {
		return array( 'dry' => ! $apply, 'error' => __( 'This server cannot write WebP files (its image library has no WebP support).', 'rankweb' ) );
	}
	$mimes = RankWeb_Webp::MIMES;
	$ids   = array_map( 'intval', (array) $wpdb->get_col( $wpdb->prepare( "SELECT ID FROM {$wpdb->posts} WHERE post_type = 'attachment' AND post_mime_type IN (%s,%s) AND ID > %d ORDER BY ID ASC LIMIT %d", $mimes[0], $mimes[1], $after, RANKWEB_WEBP_BATCH + 1 ) ) ); // phpcs:ignore WordPress.DB.DirectDatabaseQuery
	$next  = 0;
	if ( count( $ids ) > RANKWEB_WEBP_BATCH ) {
		$ids  = array_slice( $ids, 0, RANKWEB_WEBP_BATCH );
		$next = (int) end( $ids );
	}
	$exists  = static fn( $p ) => is_file( $p );
	$updated = 0;
	$made    = 0;
	$failed  = array();
	$changes = array();
	foreach ( $ids as $id ) {
		$file  = (string) get_attached_file( $id );
		$meta  = wp_get_attachment_metadata( $id );
		$files = RankWeb_Webp::missing( RankWeb_Webp::files( $file, is_array( $meta ) && is_array( $meta['sizes'] ?? null ) ? $meta['sizes'] : array() ), $exists );
		if ( ! $files ) {
			continue;
		}
		++$updated;
		if ( count( $changes ) < 25 ) {
			/* translators: 1: image title, 2: number of files. */
			$changes[] = sprintf( __( '%1$s: %2$d files', 'rankweb' ), get_the_title( $id ) ?: '#' . $id, count( $files ) );
		}
		if ( ! $apply ) {
			continue;
		}
		foreach ( $files as $f ) {
			$ed = wp_get_image_editor( $f );
			if ( is_wp_error( $ed ) || is_wp_error( $ed->save( $f . '.webp', 'image/webp' ) ) ) {
				$failed[] = basename( $f );
			} else {
				++$made;
			}
		}
	}
	return array( 'dry' => ! $apply, 'updated' => $updated, 'made' => $made, 'scanned' => count( $ids ), 'kept' => 0, 'changes' => $changes, 'skipped' => array_slice( $failed, 0, 25 ), 'next' => $next );
}

add_action(
	'rest_api_init',
	function () {
		register_rest_route(
			RANKWEB_REST,
			'/webp',
			array(
				'methods'             => 'GET',
				'permission_callback' => rankweb_rest_can( 'manage_options' ),
				'callback'            => fn() => rest_ensure_response( rankweb_webp_payload() ),
			)
		);
		register_rest_route(
			RANKWEB_REST,
			'/webp/run',
			array(
				'methods'             => 'POST',
				'permission_callback' => rankweb_rest_can( 'manage_options' ),
				'args'                => array(
					'apply' => array( 'type' => 'boolean', 'default' => false ),
					'after' => array( 'type' => 'integer', 'default' => 0 ),
				),
				'callback'            => fn( WP_REST_Request $req ) => rest_ensure_response( rankweb_webp_run( (bool) $req['apply'], max( 0, (int) $req['after'] ) ) ),
			)
		);
	}
);

/** The classic page's body (no Kits Core): one form, dry run by default. */
function rankweb_webp_body(): void {
	echo '<p>' . esc_html__( 'Makes a .webp copy next to each JPEG and PNG in the media library. Originals are never changed. Turn on "Serve WebP copies of images" in Settings → Page speed to use them.', 'rankweb' ) . '</p>';
	if ( ! rankweb_webp_ready() ) {
		wp_admin_notice( esc_html__( 'This server cannot write WebP files.', 'rankweb' ), array( 'type' => 'warning' ) );
		return;
	}
	$sum = null;
	if ( 'POST' === ( $_SERVER['REQUEST_METHOD'] ?? '' ) && current_user_can( 'manage_options' ) && check_admin_referer( 'rankweb_webp' ) ) {
		$apply = ! empty( $_POST['apply'] );
		$sum   = array( 'dry' => ! $apply, 'updated' => 0, 'made' => 0, 'scanned' => 0 );
		$after = 0;
		$loops = 0;
		do {
			$r = rankweb_webp_run( $apply, $after );
			if ( ! empty( $r['error'] ) ) {
				$sum = $r;
				break;
			}
			foreach ( array( 'updated', 'made', 'scanned' ) as $k ) {
				$sum[ $k ] += (int) $r[ $k ];
			}
			$after = (int) $r['next'];
		} while ( $after > 0 && ++$loops < 40 ); // a long library is finished by running it again
	}
	if ( $sum ) {
		/* translators: 1: images that need copies, 2: files made, 3: images looked at. */
		$line = ! empty( $sum['error'] ) ? $sum['error'] : sprintf( __( '%1$d images need copies; %2$d files made; %3$d images looked at.', 'rankweb' ), $sum['updated'], $sum['made'], $sum['scanned'] );
		wp_admin_notice( esc_html( ( ! empty( $sum['dry'] ) ? __( 'Dry run, nothing was written. ', 'rankweb' ) : '' ) . $line ), array( 'type' => 'success' ) );
	}
	echo '<form method="post">';
	wp_nonce_field( 'rankweb_webp' );
	echo '<p><label><input type="checkbox" name="apply" value="1" /> ' . esc_html__( 'Write the copies (leave empty for a dry run)', 'rankweb' ) . '</label></p>';
	submit_button( __( 'Run', 'rankweb' ), 'primary', 'submit', false );
	echo '</form>';
}
