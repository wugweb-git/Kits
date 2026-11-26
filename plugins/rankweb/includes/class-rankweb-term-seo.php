<?php
/**
 * SEO fields for a category, tag or other term: a title, a description and noindex. Pure PHP, no WordPress, so
 * tests/TermSeoTest.php runs it. RankWeb's own fields come first; Rank Math's stored term fields are read when RankWeb's
 * are empty, so a site that leaves Rank Math keeps what it wrote.
 *
 * @package rankweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** Term SEO values. */
final class RankWeb_Term_Seo {

	/** Meta keys. */
	const KEYS = array(
		'title'       => '_rankweb_term_title',
		'description' => '_rankweb_term_description',
		'noindex'     => '_rankweb_term_noindex',
	);

	/**
	 * The values to use for a term.
	 *
	 * @param array $own RankWeb's stored values (title, description, noindex).
	 * @param array $rm  Rank Math's stored values (title, description, robots as list or string).
	 * @return array{title:string,description:string,noindex:bool}
	 */
	public static function resolve( array $own, array $rm ): array {
		$robots = $rm['robots'] ?? '';
		$words  = array_map( 'trim', explode( ',', strtolower( is_array( $robots ) ? implode( ',', $robots ) : (string) $robots ) ) );
		$pick   = static function ( string $k ) use ( $own, $rm ): string {
			$a = trim( (string) ( $own[ $k ] ?? '' ) );
			return '' !== $a ? $a : trim( (string) ( $rm[ $k ] ?? '' ) );
		};
		return array(
			'title'       => $pick( 'title' ),
			'description' => $pick( 'description' ),
			'noindex'     => '1' === (string) ( $own['noindex'] ?? '' ) || in_array( 'noindex', $words, true ),
		);
	}

	/**
	 * The meta to store from a submitted form.
	 *
	 * @param array $in title, description, noindex.
	 * @return array<string,string> Meta key => value ('' = remove).
	 */
	public static function clean_form( array $in ): array {
		$one = static fn( $v ) => trim( preg_replace( '/\s+/u', ' ', strip_tags( (string) $v ) ) );
		return array(
			self::KEYS['title']       => $one( $in['title'] ?? '' ),
			self::KEYS['description'] => $one( $in['description'] ?? '' ),
			self::KEYS['noindex']     => ! empty( $in['noindex'] ) ? '1' : '',
		);
	}
}
