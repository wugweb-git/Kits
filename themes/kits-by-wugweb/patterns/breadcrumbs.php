<?php
/**
 * Title: Breadcrumbs
 * Slug: kits-by-wugweb/breadcrumbs
 * Categories: kits-components
 * Block Types: core/group
 * Description: Accessible breadcrumb navigation trail. Integrates with RankWeb's native breadcrumbs block when available, with semantic HTML fallback.
 * Keywords: breadcrumbs, navigation, hierarchy, rankweb
 *
 * @package kits-by-wugweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>
<!-- wp:group {"tagName":"nav","ariaLabel":"Breadcrumb","className":"kit-breadcrumbs","layout":{"type":"flex","flexWrap":"wrap"}} -->
<nav class="wp-block-group kit-breadcrumbs" aria-label="Breadcrumb">
<!-- wp:paragraph {"fontSize":"small"} -->
<p class="has-small-font-size"><a href="/">Home</a> <span class="kit-sep" aria-hidden="true">/</span> <a href="/category/">Category</a> <span class="kit-sep" aria-hidden="true">/</span> <span aria-current="page">Current Page</span></p>
<!-- /wp:paragraph -->
</nav>
<!-- /wp:group -->
