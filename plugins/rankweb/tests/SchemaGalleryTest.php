<?php
/**
 * PHPUnit tests for the gallery structured data builder (includes/class-rankweb-schema-gallery.php). No WordPress.
 *
 * @package rankweb
 */

// phpcs:disable WordPress.Files.FileName, WordPress.NamingConventions.ValidFunctionName, Squiz.Commenting.FunctionComment.Missing -- PHPUnit naming.

if ( ! defined( 'ABSPATH' ) && 'cli' !== PHP_SAPI ) {
	exit;
}
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

require_once dirname( __DIR__ ) . '/includes/class-rankweb-schema-gallery.php';

/** The gallery builder. */
final class SchemaGalleryTest extends PHPUnit\Framework\TestCase {

	private function node( string $type, array $in ): array {
		return RankWeb_Schema_Gallery::build( $type, RankWeb_Schema_Gallery::clean( $type, $in ) );
	}

	public function testEveryTypeHasUniqueFieldPathsAndALabel(): void {
		foreach ( RankWeb_Schema_Gallery::types() as $key => $spec ) {
			$paths = array_column( $spec['fields'], 0 );
			$this->assertSame( count( $paths ), count( array_unique( $paths ) ), "$key repeats a path" );
			$this->assertTrue( '' !== $spec['label'] && '' !== $spec['type'] );
		}
	}

	public function testARecipeNeedsANameAndAnImage(): void {
		$r = $this->node( 'Recipe', array( 'name' => 'Dal' ) );
		$this->assertSame( null, $r['node'] );
		$this->assertSame( array( 'Image address' ), $r['missing'] );
		$r = $this->node( 'Recipe', array( 'name' => 'Dal', 'image' => 'https://example.org/dal.jpg', 'recipeIngredient' => "1 cup dal\n2 cups water", 'recipeInstructions' => "Boil\nServe", 'nutrition__calories' => '270 calories' ) );
		$this->assertSame( 'Recipe', $r['node']['@type'] );
		$this->assertSame( array( '1 cup dal', '2 cups water' ), $r['node']['recipeIngredient'] );
		$this->assertSame( 'HowToStep', $r['node']['recipeInstructions'][0]['@type'] );
		$this->assertSame( 'NutritionInformation', $r['node']['nutrition']['@type'] );
	}

	public function testAProductNeedsAPriceOrARating(): void {
		$this->assertSame( array( 'a price or a rating' ), $this->node( 'Product', array( 'name' => 'Collar' ) )['missing'] );
		$r = $this->node( 'Product', array( 'name' => 'Collar', 'offers__price' => '499', 'offers__priceCurrency' => 'INR' ) );
		$this->assertSame( 499, $r['node']['offers']['price'] );
		$this->assertSame( 'Offer', $r['node']['offers']['@type'] );
		$this->assertSame( array( 'the currency' ), $this->node( 'Product', array( 'name' => 'Collar', 'offers__price' => '499' ) )['missing'] );
	}

	public function testARatingNeedsItsCount(): void {
		$r = $this->node( 'Product', array( 'name' => 'Collar', 'aggregateRating__ratingValue' => '4.5' ) );
		$this->assertSame( array( 'both the average rating and the number of ratings' ), $r['missing'] );
	}

	public function testANestedAddressGetsItsType(): void {
		$r = $this->node( 'Event', array( 'name' => 'Adoption day', 'startDate' => '2026-12-05 10:00', 'location__name' => 'Town hall', 'location__address__streetAddress' => '1 Main Rd', 'location__address__addressLocality' => 'Pune', 'location__address__addressCountry' => 'IN' ) );
		$this->assertSame( 'Place', $r['node']['location']['@type'] );
		$this->assertSame( 'PostalAddress', $r['node']['location']['address']['@type'] );
		$this->assertSame( '2026-12-05T10:00:00+00:00', $r['node']['startDate'] );
	}

	public function testBadValuesAreDropped(): void {
		$c = RankWeb_Schema_Gallery::clean( 'Course', array( 'name' => '<b>Care</b>', 'provider__sameAs' => 'javascript:alert(1)', 'description' => 'x' ) );
		$this->assertSame( 'Care', $c['name'] );
		$this->assertSame( '', $c['provider.sameAs'] );
		$c = RankWeb_Schema_Gallery::clean( 'Event', array( 'startDate' => 'not a date', 'eventStatus' => 'nonsense' ) );
		$this->assertSame( '', $c['startDate'] );
		$this->assertSame( '', $c['eventStatus'] );
		$c = RankWeb_Schema_Gallery::clean( 'Review', array( 'reviewRating__ratingValue' => 'five' ) );
		$this->assertSame( '', $c['reviewRating.ratingValue'] );
	}

	public function testAFactCheckAndAReviewBuild(): void {
		$r = $this->node( 'ClaimReview', array( 'claimReviewed' => 'Dogs cannot see colour', 'reviewRating__alternateName' => 'False', 'url' => 'https://example.org/check' ) );
		$this->assertSame( 'ClaimReview', $r['node']['@type'] );
		$this->assertSame( 'Rating', $r['node']['reviewRating']['@type'] );
		$r = $this->node( 'Review', array( 'itemReviewed__name' => 'Shelter', 'reviewRating__ratingValue' => '4', 'author__name' => 'Asha' ) );
		$this->assertSame( 4, $r['node']['reviewRating']['ratingValue'] );
		$this->assertSame( 'Person', $r['node']['author']['@type'] );
	}

	public function testAnUnknownTypeBuildsNothing(): void {
		$this->assertSame( null, RankWeb_Schema_Gallery::build( 'Nope', array() )['node'] );
	}

	public function testQaPageAndQuizUseTheirOwnNesting(): void {
		$r = $this->node( 'QAPage', array( 'mainEntity__name' => 'How do I help a stray?', 'mainEntity__answerCount' => '1', 'mainEntity__acceptedAnswer__text' => 'Call a rescue.' ) );
		$this->assertSame( 'Question', $r['node']['mainEntity']['@type'] );
		$this->assertSame( 'Answer', $r['node']['mainEntity']['acceptedAnswer']['@type'] );
		$q = $this->node( 'Quiz', array( 'about__name' => 'Dog care', 'hasPart__name' => 'Q?', 'hasPart__acceptedAnswer__text' => 'A.' ) );
		$this->assertSame( 'Flashcard', $q['node']['hasPart']['eduQuestionType'] );
		$p = $this->node( 'ProfilePage', array( 'mainEntity__name' => 'Asha' ) );
		$this->assertSame( 'Person', $p['node']['mainEntity']['@type'], 'ProfilePage keeps its own mainEntity type' );
	}

	public function testNewTypesNeedTheirRequiredFields(): void {
		$this->assertSame( array( 'Name', 'Description (at least 50 characters)' ), $this->node( 'Dataset', array() )['missing'] );
		$this->assertSame( 'EmployerAggregateRating', $this->node( 'EmployerAggregateRating', array( 'itemReviewed__name' => 'Acme', 'ratingValue' => '4', 'ratingCount' => '20' ) )['node']['@type'] );
		$m = $this->node( 'MathSolver', array( 'name' => 'Solver', 'url' => 'https://example.org/s', 'potentialAction__target' => 'https://example.org/s?q={math_expression_string}' ) );
		$this->assertSame( 'SolveMathAction', $m['node']['potentialAction']['@type'] );
		$this->assertSame( 'required name=math_expression_string', $m['node']['potentialAction']['mathExpression-input'] );
		$v = $this->node( 'VacationRental', array( 'name' => 'Cottage', 'identifier' => 'c1', 'image' => "https://example.org/1.jpg\nhttps://example.org/2.jpg", 'latitude' => '18.5', 'longitude' => '73.8', 'containsPlace__additionalType' => 'EntirePlace', 'containsPlace__occupancy__value' => '4', 'address__streetAddress' => '1 Hill Rd', 'address__addressLocality' => 'Pune', 'address__addressCountry' => 'IN' ) );
		$this->assertSame( 'Accommodation', $v['node']['containsPlace']['@type'] );
		$this->assertSame( 'QuantitativeValue', $v['node']['containsPlace']['occupancy']['@type'] );
		$this->assertSame( 2, count( $v['node']['image'] ) );
	}

	public function testPaywallAndCarousel(): void {
		$r = $this->node( 'PaywalledContent', array( 'name' => 'Report', 'hasPart__cssSelector' => '.paywall' ) );
		$this->assertSame( false, $r['node']['isAccessibleForFree'] );
		$this->assertSame( false, $r['node']['hasPart']['isAccessibleForFree'] );
		$c = $this->node( 'ItemList', array( 'itemListElement' => "https://example.org/a\nnot a url\nhttps://example.org/b" ) );
		$this->assertSame( 2, count( $c['node']['itemListElement'] ) );
		$this->assertSame( 2, $c['node']['itemListElement'][1]['position'] );
		$this->assertSame( array( 'Addresses of the pages in the list (one per line, at least two)' ), $this->node( 'ItemList', array( 'itemListElement' => 'junk' ) )['missing'] );
	}

	public function testProductShippingAndReturnsGetTheirTypes(): void {
		$r = $this->node( 'Product', array( 'name' => 'Collar', 'offers__price' => '499', 'offers__priceCurrency' => 'INR', 'offers__shippingDetails__shippingRate__value' => '0', 'offers__shippingDetails__shippingRate__currency' => 'INR', 'offers__hasMerchantReturnPolicy__merchantReturnDays' => '7' ) );
		$this->assertSame( 'OfferShippingDetails', $r['node']['offers']['shippingDetails']['@type'] );
		$this->assertSame( 'MonetaryAmount', $r['node']['offers']['shippingDetails']['shippingRate']['@type'] );
		$this->assertSame( 'MerchantReturnPolicy', $r['node']['offers']['hasMerchantReturnPolicy']['@type'] );
	}

	public function testProductGroupBuildsVariantsAndSkipsBadLines(): void {
		$r = $this->node( 'ProductGroup', array( 'name' => 'Collar', 'productGroupID' => 'c1', 'variesBy' => 'https://schema.org/size', 'hasVariant' => "Small | c1-s | 499 | inr | https://example.org/s.jpg\nno price | x | | INR\nLarge | c1-l | 549 | INR" ) );
		$this->assertSame( 'ProductGroup', $r['node']['@type'] );
		$this->assertSame( 2, count( $r['node']['hasVariant'] ) );
		$this->assertSame( 'INR', $r['node']['hasVariant'][0]['offers']['priceCurrency'] );
		$this->assertSame( 549, $r['node']['hasVariant'][1]['offers']['price'] );
		$this->assertSame( 'Variants (one per line: name | SKU | price | currency | image address)', $this->node( 'ProductGroup', array( 'name' => 'C', 'productGroupID' => 'c', 'variesBy' => 'x', 'hasVariant' => 'junk' ) )['missing'][0] );
	}

	public function testLoyaltyProgramNestsItsTier(): void {
		$r = $this->node( 'MemberProgram', array( 'name' => 'Paws Club', 'description' => 'Earn points', 'hasTiers__name' => 'Gold', 'hasTiers__hasTierBenefit' => 'https://schema.org/TierBenefitLoyaltyPoints', 'hasTiers__membershipPointsEarned__value' => '2' ) );
		$this->assertSame( 'MemberProgramTier', $r['node']['hasTiers']['@type'] );
		$this->assertSame( 'QuantitativeValue', $r['node']['hasTiers']['membershipPointsEarned']['@type'] );
	}
}
