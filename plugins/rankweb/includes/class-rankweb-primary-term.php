<?php
/**
 * The primary category of a post: the one the editor chose among the post's categories, used for the address
 * (%category% in the permalink) and the breadcrumb trail. Pure PHP, no WordPress, so tests/PrimaryTermTest.php runs it.
 *
 * @package rankweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** Primary term choice. */
final class RankWeb_Primary_Term {

	/** The post meta key. */
	const KEY = '_rankweb_primary_category';

	/**
	 * The chosen term, only when the post still has it.
	 *
	 * @param mixed $chosen   The stored value.
	 * @param int[] $assigned IDs of the post's categories.
	 */
	public static function resolve( $chosen, array $assigned ): int {
		$id = (int) $chosen;
		return $id > 0 && in_array( $id, array_map( 'intval', $assigned ), true ) ? $id : 0;
	}

	/** A stored value cleaned: a positive whole number as text, else ''. */
	public static function clean( $v ): string {
		$id = (int) $v;
		return $id > 0 ? (string) $id : '';
	}
}
