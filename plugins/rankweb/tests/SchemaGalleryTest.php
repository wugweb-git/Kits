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
}
