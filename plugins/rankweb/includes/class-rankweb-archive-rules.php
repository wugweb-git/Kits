<?php
/**
 * Which kinds of archive page stay out of search results (author archives, date archives, paginated pages after the
 * first, attachment pages, and category or tag archives with no items). Pure PHP, no WordPress, so
 * tests/ArchiveRulesTest.php runs it; includes/standalone-seo.php feeds it the page being viewed.
 *
 * @package rankweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** Archive noindex rules. */
final class RankWeb_Archive_Rules {

	/** The rules and their labels, for the settings screen. */
	const RULES = array(
		'author'     => 'Author archives',
		'date'       => 'Date archives',
		'paged'      => 'Page 2 and later of any list',
		'attachment' => 'Attachment pages',
		'empty'      => 'Category and tag archives with no items',
	);

	/**
	 * Whether the page should be noindex.
	 *
	 * @param array $page  Facts: author, date, attachment (bool), paged (int, 1 = first page), empty_term (bool).
	 * @param array $rules Rule key => bool (on).
	 */
	public static function noindex( array $page, array $rules ): bool {
		if ( ! empty( $rules['author'] ) && ! empty( $page['author'] ) ) {
			return true;
		}
		if ( ! empty( $rules['date'] ) && ! empty( $page['date'] ) ) {
			return true;
		}
		if ( ! empty( $rules['attachment'] ) && ! empty( $page['attachment'] ) ) {
			return true;
		}
		if ( ! empty( $rules['paged'] ) && (int) ( $page['paged'] ?? 1 ) > 1 ) {
			return true;
		}
		return ! empty( $rules['empty'] ) && ! empty( $page['empty_term'] );
	}
}
