<?php
/**
 * Structured data for the types Google's search gallery supports, built from a form's values. Pure PHP, no WordPress, so
 * tests/SchemaGalleryTest.php runs it. One spec per type says each field's label, kind, where it goes in the JSON-LD and
 * whether Google requires it; the form, the check and the markup all read that one spec. A node whose required fields are
 * not all filled is not printed (Google ignores or flags incomplete markup), and the form says what is missing.
 *
 * Field kinds: text, longtext, url, date (any date or date-time text strtotime reads; stored ISO 8601), number, lines
 * (one value per line), steps (one instruction per line, written as HowToStep), select (options).
 *
 * @package rankweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** The gallery types and their nodes. */
final class RankWeb_Schema_Gallery {

	/** The @type of an object a dotted path creates (the longest matching prefix wins). */
	const NEST = array(
		'address'              => 'PostalAddress',
		'location'             => 'Place',
		'location.address'     => 'PostalAddress',
		'jobLocation'          => 'Place',
		'jobLocation.address'  => 'PostalAddress',
		'geo'                  => 'GeoCoordinates',
		'offers'               => 'Offer',
		'aggregateRating'      => 'AggregateRating',
		'reviewRating'         => 'Rating',
		'review'               => 'Review',
		'review.reviewRating'  => 'Rating',
		'review.author'        => 'Person',
		'author'               => 'Person',
		'brand'                => 'Brand',
		'provider'             => 'Organization',
		'hiringOrganization'   => 'Organization',
		'organizer'            => 'Organization',
		'nutrition'            => 'NutritionInformation',
		'baseSalary'           => 'MonetaryAmount',
		'baseSalary.value'     => 'QuantitativeValue',
		'itemReviewed'         => 'Thing',
		'itemReviewed.author'  => 'Person',
		'mainEntity'           => 'Person',
		'director'             => 'Person',
	);

	/**
	 * The types: key => label, schema type, fields. A field is [ path, label, kind, required, options|help ].
	 *
	 * @return array<string,array>
	 */
	public static function types(): array {
		$addr = static fn( string $p ): array => array(
			array( "$p.streetAddress", 'Street address', 'text', true ),
			array( "$p.addressLocality", 'City or district', 'text', true ),
			array( "$p.addressRegion", 'State or region', 'text', false ),
			array( "$p.postalCode", 'Postal code', 'text', false ),
			array( "$p.addressCountry", 'Country (two letters, e.g. IN)', 'text', true ),
		);
		$rate = array(
			array( 'aggregateRating.ratingValue', 'Average rating', 'number', false ),
			array( 'aggregateRating.reviewCount', 'Number of ratings', 'number', false ),
		);
		return array(
			'Recipe'              => array(
				'label'  => 'Recipe',
				'type'   => 'Recipe',
				'fields' => array_merge(
					array(
						array( 'name', 'Name', 'text', true ),
						array( 'image', 'Image address', 'url', true ),
						array( 'author.name', 'Author', 'text', false ),
						array( 'datePublished', 'Published', 'date', false ),
						array( 'description', 'Short description', 'longtext', false ),
						array( 'prepTime', 'Preparation time (e.g. PT15M)', 'text', false ),
						array( 'cookTime', 'Cooking time (e.g. PT30M)', 'text', false ),
						array( 'recipeYield', 'Makes (e.g. 4 servings)', 'text', false ),
						array( 'recipeCategory', 'Category', 'text', false ),
						array( 'recipeCuisine', 'Cuisine', 'text', false ),
						array( 'nutrition.calories', 'Calories (e.g. 270 calories)', 'text', false ),
						array( 'recipeIngredient', 'Ingredients (one per line)', 'lines', false ),
						array( 'recipeInstructions', 'Steps (one per line)', 'steps', false ),
					),
					$rate
				),
			),
			'Product'             => array(
				'label'  => 'Product',
				'type'   => 'Product',
				'any_of' => array( 'offers.price', 'aggregateRating.ratingValue' ),
				'fields' => array_merge(
					array(
						array( 'name', 'Name', 'text', true ),
						array( 'image', 'Image address', 'url', false ),
						array( 'description', 'Description', 'longtext', false ),
						array( 'brand.name', 'Brand', 'text', false ),
						array( 'sku', 'SKU', 'text', false ),
						array( 'offers.price', 'Price', 'number', false ),
						array( 'offers.priceCurrency', 'Currency (e.g. INR)', 'text', false ),
						array( 'offers.availability', 'Availability', 'select', false, array( '' => '', 'https://schema.org/InStock' => 'In stock', 'https://schema.org/OutOfStock' => 'Out of stock', 'https://schema.org/PreOrder' => 'Pre-order' ) ),
					),
					$rate
				),
			),
			'LocalBusiness'       => array(
				'label'  => 'Local business',
				'type'   => 'LocalBusiness',
				'fields' => array_merge(
					array(
						array( 'name', 'Name', 'text', true ),
						array( 'image', 'Image address', 'url', false ),
						array( 'telephone', 'Phone', 'text', false ),
						array( 'url', 'Website', 'url', false ),
						array( 'priceRange', 'Price range (e.g. ₹₹)', 'text', false ),
						array( 'openingHours', 'Opening hours (one per line, e.g. Mo-Fr 09:00-17:00)', 'lines', false ),
						array( 'geo.latitude', 'Latitude', 'number', false ),
						array( 'geo.longitude', 'Longitude', 'number', false ),
					),
					$addr( 'address' ),
					$rate
				),
			),
			'Event'               => array(
				'label'  => 'Event',
				'type'   => 'Event',
				'fields' => array_merge(
					array(
						array( 'name', 'Name', 'text', true ),
						array( 'startDate', 'Starts', 'date', true ),
						array( 'endDate', 'Ends', 'date', false ),
						array( 'eventAttendanceMode', 'Attendance', 'select', false, array( '' => '', 'https://schema.org/OfflineEventAttendanceMode' => 'In person', 'https://schema.org/OnlineEventAttendanceMode' => 'Online', 'https://schema.org/MixedEventAttendanceMode' => 'Both' ) ),
						array( 'eventStatus', 'Status', 'select', false, array( '' => '', 'https://schema.org/EventScheduled' => 'Scheduled', 'https://schema.org/EventCancelled' => 'Cancelled', 'https://schema.org/EventPostponed' => 'Postponed' ) ),
						array( 'location.name', 'Venue name', 'text', true ),
						array( 'description', 'Description', 'longtext', false ),
						array( 'image', 'Image address', 'url', false ),
						array( 'organizer.name', 'Organiser', 'text', false ),
					),
					$addr( 'location.address' )
				),
			),
			'JobPosting'          => array(
				'label'  => 'Job posting',
				'type'   => 'JobPosting',
				'fields' => array_merge(
					array(
						array( 'title', 'Job title', 'text', true ),
						array( 'description', 'Description', 'longtext', true ),
						array( 'datePosted', 'Posted', 'date', true ),
						array( 'validThrough', 'Apply by', 'date', false ),
						array( 'employmentType', 'Employment type', 'select', false, array( '' => '', 'FULL_TIME' => 'Full time', 'PART_TIME' => 'Part time', 'CONTRACTOR' => 'Contract', 'INTERN' => 'Internship', 'VOLUNTEER' => 'Volunteer' ) ),
						array( 'hiringOrganization.name', 'Organisation', 'text', true ),
						array( 'hiringOrganization.sameAs', 'Organisation website', 'url', false ),
					),
					$addr( 'jobLocation.address' )
				),
			),
			'Course'              => array(
				'label'  => 'Course',
				'type'   => 'Course',
				'fields' => array(
					array( 'name', 'Name', 'text', true ),
					array( 'description', 'Description', 'longtext', true ),
					array( 'provider.name', 'Provider', 'text', true ),
					array( 'provider.sameAs', 'Provider website', 'url', false ),
				),
			),
			'ClaimReview'         => array(
				'label'  => 'Fact check',
				'type'   => 'ClaimReview',
				'fields' => array(
					array( 'claimReviewed', 'The claim checked', 'text', true ),
					array( 'reviewRating.alternateName', 'The verdict (e.g. False, Mostly true)', 'text', true ),
					array( 'url', 'Address of this fact check', 'url', true ),
					array( 'author.name', 'Fact checker', 'text', false ),
					array( 'itemReviewed.author.name', 'Who made the claim', 'text', false ),
					array( 'datePublished', 'Published', 'date', false ),
				),
			),
			'ProfilePage'         => array(
				'label'  => 'Profile page',
				'type'   => 'ProfilePage',
				'fields' => array(
					array( 'mainEntity.name', 'Person or organisation', 'text', true ),
					array( 'mainEntity.url', 'Their website', 'url', false ),
					array( 'mainEntity.image', 'Image address', 'url', false ),
					array( 'mainEntity.description', 'About them', 'longtext', false ),
					array( 'dateCreated', 'Profile created', 'date', false ),
				),
			),
			'SoftwareApplication' => array(
				'label'  => 'Software app',
				'type'   => 'SoftwareApplication',
				'any_of' => array( 'aggregateRating.ratingValue' ),
				'fields' => array_merge(
					array(
						array( 'name', 'Name', 'text', true ),
						array( 'applicationCategory', 'Category (e.g. UtilitiesApplication)', 'text', false ),
						array( 'operatingSystem', 'Runs on (e.g. Android, Windows)', 'text', false ),
						array( 'offers.price', 'Price (0 for free)', 'number', false ),
						array( 'offers.priceCurrency', 'Currency (e.g. INR)', 'text', false ),
					),
					$rate
				),
			),
			'Book'                => array(
				'label'  => 'Book',
				'type'   => 'Book',
				'fields' => array(
					array( 'name', 'Title', 'text', true ),
					array( 'author.name', 'Author', 'text', true ),
					array( 'url', 'Address of the book page', 'url', true ),
					array( 'isbn', 'ISBN', 'text', false ),
				),
			),
			'Movie'               => array(
				'label'  => 'Movie',
				'type'   => 'Movie',
				'fields' => array(
					array( 'name', 'Name', 'text', true ),
					array( 'image', 'Poster address', 'url', true ),
					array( 'dateCreated', 'Released', 'date', false ),
					array( 'director.name', 'Director', 'text', false ),
				),
			),
			'Review'              => array(
				'label'  => 'Review',
				'type'   => 'Review',
				'fields' => array(
					array( 'itemReviewed.name', 'What is reviewed', 'text', true ),
					array( 'reviewRating.ratingValue', 'Rating', 'number', true ),
					array( 'reviewRating.bestRating', 'Best possible rating (default 5)', 'number', false ),
					array( 'author.name', 'Reviewer', 'text', true ),
					array( 'datePublished', 'Published', 'date', false ),
				),
			),
		);
	}

	/**
	 * Clean a form's values for a type: only the type's fields, trimmed, tags removed, dates and numbers checked.
	 *
	 * @param string $type   Type key.
	 * @param array  $values Path => raw value.
	 * @return array Path => clean value ('' = empty).
	 */
	public static function clean( string $type, array $values ): array {
		$spec = self::types()[ $type ] ?? null;
		$out  = array();
		if ( ! $spec ) {
			return $out;
		}
		foreach ( $spec['fields'] as $f ) {
			$path = $f[0];
			$raw  = $values[ self::key( $path ) ] ?? ( $values[ $path ] ?? '' );
			$raw  = is_string( $raw ) ? trim( strip_tags( $raw ) ) : '';
			switch ( $f[2] ) {
				case 'url':
					$raw = filter_var( $raw, FILTER_VALIDATE_URL ) && preg_match( '#^https?://#i', $raw ) ? $raw : '';
					break;
				case 'date':
					$t   = '' === $raw ? false : strtotime( $raw );
					$raw = false === $t ? '' : ( preg_match( '/\d:\d/', $raw ) ? gmdate( 'c', $t ) : gmdate( 'Y-m-d', $t ) );
					break;
				case 'number':
					$raw = is_numeric( $raw ) ? (string) ( 0 + $raw ) : '';
					break;
				case 'select':
					$raw = isset( $f[4][ $raw ] ) ? $raw : '';
					break;
			}
			$out[ $path ] = $raw;
		}
		return $out;
	}

	/** A field path as a form field name (dots are not safe in PHP request keys). */
	public static function key( string $path ): string {
		return str_replace( '.', '__', $path );
	}

	/**
	 * The node for a type and its clean values.
	 *
	 * @param string $type   Type key.
	 * @param array  $values From clean().
	 * @return array{node:?array,missing:string[]} The node, or null with the labels of what is missing.
	 */
	public static function build( string $type, array $values ): array {
		$spec = self::types()[ $type ] ?? null;
		if ( ! $spec ) {
			return array( 'node' => null, 'missing' => array() );
		}
		$missing = array();
		$node    = array( '@type' => $spec['type'] );
		foreach ( $spec['fields'] as $f ) {
			$v = trim( (string) ( $values[ $f[0] ] ?? '' ) );
			if ( '' === $v ) {
				if ( $f[3] ) {
					$missing[] = $f[1];
				}
				continue;
			}
			if ( 'lines' === $f[2] || 'steps' === $f[2] ) {
				$lines = array_values( array_filter( array_map( 'trim', preg_split( '/[\r\n]+/', $v ) ) ) );
				$val   = 'steps' === $f[2] ? array_map( static fn( $t ) => array( '@type' => 'HowToStep', 'text' => $t ), $lines ) : $lines;
			} elseif ( 'number' === $f[2] ) {
				$val = 0 + $v;
			} else {
				$val = $v;
			}
			self::put( $node, $f[0], $val );
		}
		if ( ! empty( $spec['any_of'] ) ) {
			$has = false;
			foreach ( $spec['any_of'] as $p ) {
				if ( '' !== trim( (string) ( $values[ $p ] ?? '' ) ) ) {
					$has = true;
				}
			}
			if ( ! $has ) {
				$missing[] = 'a price or a rating';
			}
		}
		if ( isset( $node['aggregateRating'] ) && ( ! isset( $node['aggregateRating']['ratingValue'] ) || ! isset( $node['aggregateRating']['reviewCount'] ) ) ) {
			$missing[] = 'both the average rating and the number of ratings';
		}
		if ( isset( $node['offers']['price'] ) && ! isset( $node['offers']['priceCurrency'] ) ) {
			$missing[] = 'the currency';
		}
		return $missing ? array( 'node' => null, 'missing' => array_values( array_unique( $missing ) ) ) : array( 'node' => $node, 'missing' => array() );
	}

	/** Set a dotted path in a node, giving each created object its @type. */
	private static function put( array &$node, string $path, $value ): void {
		$parts = explode( '.', $path );
		$ref   = &$node;
		$at    = '';
		foreach ( $parts as $i => $p ) {
			$at .= ( '' === $at ? '' : '.' ) . $p;
			if ( $i === count( $parts ) - 1 ) {
				$ref[ $p ] = $value;
				break;
			}
			if ( ! isset( $ref[ $p ] ) ) {
				$ref[ $p ] = isset( self::NEST[ $at ] ) ? array( '@type' => self::NEST[ $at ] ) : array();
			}
			$ref = &$ref[ $p ];
		}
	}
}
