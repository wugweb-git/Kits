<?php
/**
 * Structured data for the types Google's search gallery supports, built from a form's values. Pure PHP, no WordPress, so
 * tests/SchemaGalleryTest.php runs it. One spec per type says each field's label, kind, where it goes in the JSON-LD and
 * whether Google requires it; the form, the check and the markup all read that one spec. A node whose required fields are
 * not all filled is not printed (Google ignores or flags incomplete markup), and the form says what is missing.
 *
 * Field kinds: text, longtext, url, date (any date or date-time text strtotime reads; stored ISO 8601), number, lines
 * (one value per line), steps (one instruction per line, written as HowToStep), items (one address per line, written as
 * ListItem), variants (one product variant per line as name | sku | price | currency | image address, written as Product), select (options). A spec may also hold 'nest' (types for paths that differ from NEST), 'const' (fixed values) and
 * 'any_of'.
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
		'offers.shippingDetails'                          => 'OfferShippingDetails',
		'offers.shippingDetails.shippingRate'             => 'MonetaryAmount',
		'offers.shippingDetails.shippingDestination'      => 'DefinedRegion',
		'offers.hasMerchantReturnPolicy'                  => 'MerchantReturnPolicy',
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
						array( 'offers.itemCondition', 'Condition', 'select', false, array( '' => '', 'https://schema.org/NewCondition' => 'New', 'https://schema.org/UsedCondition' => 'Used', 'https://schema.org/RefurbishedCondition' => 'Refurbished' ) ),
						array( 'offers.priceValidUntil', 'Price valid until', 'date', false ),
						array( 'gtin', 'GTIN or barcode', 'text', false ),
						array( 'mpn', 'Manufacturer part number', 'text', false ),
						array( 'offers.shippingDetails.shippingRate.value', 'Shipping cost (0 for free)', 'number', false ),
						array( 'offers.shippingDetails.shippingRate.currency', 'Shipping currency (e.g. INR)', 'text', false ),
						array( 'offers.shippingDetails.shippingDestination.addressCountry', 'Ships to (country, two letters)', 'text', false ),
						array( 'offers.hasMerchantReturnPolicy.returnPolicyCategory', 'Returns', 'select', false, array( '' => '', 'https://schema.org/MerchantReturnFiniteReturnWindow' => 'Returns accepted for a set time', 'https://schema.org/MerchantReturnNotPermitted' => 'No returns', 'https://schema.org/MerchantReturnUnlimitedWindow' => 'Returns accepted any time' ) ),
						array( 'offers.hasMerchantReturnPolicy.merchantReturnDays', 'Return window (days)', 'number', false ),
						array( 'offers.hasMerchantReturnPolicy.applicableCountry', 'Returns from (country, two letters)', 'text', false ),
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
			'Dataset'             => array(
				'label'  => 'Dataset',
				'type'   => 'Dataset',
				'fields' => array(
					array( 'name', 'Name', 'text', true ),
					array( 'description', 'Description (at least 50 characters)', 'longtext', true ),
					array( 'url', 'Address of the dataset page', 'url', false ),
					array( 'creator.name', 'Creator', 'text', false ),
					array( 'license', 'Licence address', 'url', false ),
					array( 'keywords', 'Keywords (one per line)', 'lines', false ),
					array( 'temporalCoverage', 'Period covered (e.g. 2020-01-01/2026-12-31)', 'text', false ),
					array( 'distribution.contentUrl', 'Download address', 'url', false ),
					array( 'distribution.encodingFormat', 'Download format (e.g. text/csv)', 'text', false ),
				),
				'nest'   => array( 'creator' => 'Organization', 'distribution' => 'DataDownload' ),
			),
			'QAPage'              => array(
				'label'  => 'Question and answer page',
				'type'   => 'QAPage',
				'fields' => array(
					array( 'mainEntity.name', 'The question', 'text', true ),
					array( 'mainEntity.text', 'More detail on the question', 'longtext', false ),
					array( 'mainEntity.answerCount', 'Number of answers', 'number', true ),
					array( 'mainEntity.dateCreated', 'Asked', 'date', false ),
					array( 'mainEntity.author.name', 'Asked by', 'text', false ),
					array( 'mainEntity.acceptedAnswer.text', 'The best answer', 'longtext', true ),
					array( 'mainEntity.acceptedAnswer.url', 'Address of that answer', 'url', false ),
					array( 'mainEntity.acceptedAnswer.upvoteCount', 'Its votes', 'number', false ),
					array( 'mainEntity.acceptedAnswer.author.name', 'Answered by', 'text', false ),
				),
				'nest'   => array( 'mainEntity' => 'Question', 'mainEntity.author' => 'Person', 'mainEntity.acceptedAnswer' => 'Answer', 'mainEntity.acceptedAnswer.author' => 'Person' ),
			),
			'DiscussionForumPosting' => array(
				'label'  => 'Discussion forum post',
				'type'   => 'DiscussionForumPosting',
				'fields' => array(
					array( 'headline', 'Title of the post', 'text', false ),
					array( 'text', 'The post', 'longtext', true ),
					array( 'author.name', 'Author', 'text', true ),
					array( 'datePublished', 'Posted', 'date', true ),
					array( 'dateModified', 'Last edited', 'date', false ),
					array( 'url', 'Address of the post', 'url', false ),
				),
			),
			'Quiz'                => array(
				'label'  => 'Education Q&A (flashcard)',
				'type'   => 'Quiz',
				'fields' => array(
					array( 'about.name', 'Subject', 'text', true ),
					array( 'educationalLevel', 'Level (e.g. high school)', 'text', false ),
					array( 'hasPart.name', 'The question', 'text', true ),
					array( 'hasPart.acceptedAnswer.text', 'The answer', 'longtext', true ),
				),
				'nest'   => array( 'about' => 'Thing', 'hasPart' => 'Question', 'hasPart.acceptedAnswer' => 'Answer' ),
				'const'  => array( 'hasPart.eduQuestionType' => 'Flashcard' ),
			),
			'EmployerAggregateRating' => array(
				'label'  => 'Employer rating',
				'type'   => 'EmployerAggregateRating',
				'fields' => array(
					array( 'itemReviewed.name', 'Employer', 'text', true ),
					array( 'itemReviewed.sameAs', 'Employer website', 'url', false ),
					array( 'ratingValue', 'Average rating', 'number', true ),
					array( 'ratingCount', 'Number of ratings', 'number', true ),
					array( 'bestRating', 'Best possible rating (default 5)', 'number', false ),
					array( 'worstRating', 'Worst possible rating (default 1)', 'number', false ),
				),
				'nest'   => array( 'itemReviewed' => 'Organization' ),
			),
			'MathSolver'          => array(
				'label'  => 'Math solver',
				'type'   => 'MathSolver',
				'fields' => array(
					array( 'name', 'Name', 'text', true ),
					array( 'url', 'Address of the solver', 'url', true ),
					array( 'usageInfo', 'Address of the terms or usage page', 'url', false ),
					array( 'potentialAction.target', 'Address that takes the problem (ends with ?q={math_expression_string})', 'text', true ),
					array( 'assesses', 'Topics it solves (one per line)', 'lines', false ),
				),
				'nest'   => array( 'potentialAction' => 'SolveMathAction' ),
				'const'  => array( 'potentialAction.mathExpression-input' => 'required name=math_expression_string' ),
			),
			'VacationRental'      => array(
				'label'  => 'Vacation rental',
				'type'   => 'VacationRental',
				'fields' => array_merge(
					array(
						array( 'name', 'Name', 'text', true ),
						array( 'identifier', 'Your ID for it', 'text', true ),
						array( 'image', 'Image addresses (one per line; Google wants at least 8)', 'lines', true ),
						array( 'latitude', 'Latitude', 'number', true ),
						array( 'longitude', 'Longitude', 'number', true ),
						array( 'url', 'Address of the listing', 'url', false ),
						array( 'description', 'Description', 'longtext', false ),
						array( 'containsPlace.additionalType', 'What the guest rents', 'select', true, array( '' => '', 'EntirePlace' => 'The whole place', 'PrivateRoom' => 'A private room', 'SharedRoom' => 'A shared room' ) ),
						array( 'containsPlace.occupancy.value', 'Most guests', 'number', true ),
						array( 'containsPlace.numberOfBedrooms', 'Bedrooms', 'number', false ),
						array( 'containsPlace.numberOfBathroomsTotal', 'Bathrooms', 'number', false ),
					),
					$addr( 'address' ),
					$rate
				),
				'nest'   => array( 'containsPlace' => 'Accommodation', 'containsPlace.occupancy' => 'QuantitativeValue' ),
			),
			'ImageObject'         => array(
				'label'  => 'Image licence',
				'type'   => 'ImageObject',
				'fields' => array(
					array( 'contentUrl', 'Image address', 'url', true ),
					array( 'license', 'Licence address', 'url', true ),
					array( 'acquireLicensePage', 'Where to get a licence', 'url', true ),
					array( 'creator.name', 'Creator', 'text', false ),
					array( 'creditText', 'Credit line', 'text', false ),
					array( 'copyrightNotice', 'Copyright notice', 'text', false ),
				),
				'nest'   => array( 'creator' => 'Person' ),
			),
			'PaywalledContent'    => array(
				'label'  => 'Paywalled content',
				'type'   => 'CreativeWork',
				'fields' => array(
					array( 'name', 'Title', 'text', true ),
					array( 'hasPart.cssSelector', 'The paywalled part (a CSS selector, e.g. .paywall)', 'text', true ),
				),
				'nest'   => array( 'hasPart' => 'WebPageElement' ),
				'const'  => array( 'isAccessibleForFree' => false, 'hasPart.isAccessibleForFree' => false ),
			),
			'ItemList'            => array(
				'label'  => 'Carousel (list of pages)',
				'type'   => 'ItemList',
				'fields' => array(
					array( 'itemListElement', 'Addresses of the pages in the list (one per line, at least two)', 'items', true ),
				),
			),
			'ProductGroup'        => array(
				'label'  => 'Product with variants',
				'type'   => 'ProductGroup',
				'fields' => array(
					array( 'name', 'Name', 'text', true ),
					array( 'productGroupID', 'Your ID for the group', 'text', true ),
					array( 'variesBy', 'What varies (one per line, e.g. https://schema.org/color, https://schema.org/size)', 'lines', true ),
					array( 'description', 'Description', 'longtext', false ),
					array( 'brand.name', 'Brand', 'text', false ),
					array( 'url', 'Address of the product page', 'url', false ),
					array( 'hasVariant', 'Variants (one per line: name | SKU | price | currency | image address)', 'variants', true ),
				),
			),
			'MemberProgram'       => array(
				'label'  => 'Loyalty program',
				'type'   => 'MemberProgram',
				'fields' => array(
					array( 'name', 'Name of the program', 'text', true ),
					array( 'description', 'Description', 'longtext', true ),
					array( 'url', 'Address of the program page', 'url', false ),
					array( 'hasTiers.name', 'A tier (e.g. Gold)', 'text', true ),
					array( 'hasTiers.hasTierBenefit', 'Its benefit', 'select', true, array( '' => '', 'https://schema.org/TierBenefitLoyaltyPoints' => 'Loyalty points', 'https://schema.org/TierBenefitLoyaltyPrice' => 'Member prices', 'https://schema.org/TierBenefitLoyaltyReturns' => 'Better returns', 'https://schema.org/TierBenefitLoyaltyShipping' => 'Better shipping' ) ),
					array( 'hasTiers.membershipPointsEarned.value', 'Points earned per unit spent', 'number', false ),
				),
				'nest'   => array( 'hasTiers' => 'MemberProgramTier', 'hasTiers.membershipPointsEarned' => 'QuantitativeValue' ),
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
		$nest    = array_merge( self::NEST, (array) ( $spec['nest'] ?? array() ) );
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
			} elseif ( 'items' === $f[2] ) {
				$urls = array_values( array_filter( array_map( 'trim', preg_split( '/[\r\n]+/', $v ) ), static fn( $u ) => (bool) preg_match( '#^https?://\S+$#i', $u ) ) );
				$val  = array();
				foreach ( $urls as $i => $u ) {
					$val[] = array( '@type' => 'ListItem', 'position' => $i + 1, 'url' => $u );
				}
				if ( count( $val ) < 2 ) {
					if ( $f[3] ) {
						$missing[] = $f[1];
					}
					continue;
				}
			} elseif ( 'variants' === $f[2] ) {
				$val = array();
				foreach ( array_filter( array_map( 'trim', preg_split( '/[\r\n]+/', $v ) ) ) as $line ) {
					$c = array_map( 'trim', explode( '|', $line ) );
					if ( '' === ( $c[0] ?? '' ) || ! is_numeric( $c[2] ?? '' ) || ! preg_match( '/^[A-Z]{3}$/', strtoupper( $c[3] ?? '' ) ) ) {
						continue; // a variant needs a name, a price and a three-letter currency
					}
					$var = array( '@type' => 'Product', 'name' => $c[0] );
					if ( '' !== ( $c[1] ?? '' ) ) {
						$var['sku'] = $c[1];
					}
					if ( preg_match( '#^https?://\S+$#i', $c[4] ?? '' ) ) {
						$var['image'] = $c[4];
					}
					$var['offers'] = array( '@type' => 'Offer', 'price' => 0 + $c[2], 'priceCurrency' => strtoupper( $c[3] ) );
					$val[]         = $var;
				}
				if ( ! $val ) {
					if ( $f[3] ) {
						$missing[] = $f[1];
					}
					continue;
				}
			} elseif ( 'number' === $f[2] ) {
				$val = 0 + $v;
			} else {
				$val = $v;
			}
			self::put( $node, $f[0], $val, $nest );
		}
		foreach ( (array) ( $spec['const'] ?? array() ) as $path => $val ) {
			self::put( $node, $path, $val, $nest );
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
	private static function put( array &$node, string $path, $value, array $nest ): void {
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
				$ref[ $p ] = isset( $nest[ $at ] ) ? array( '@type' => $nest[ $at ] ) : array();
			}
			$ref = &$ref[ $p ];
		}
	}
}
