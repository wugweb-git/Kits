<?php
/**
 * Title: Breadcrumbs
 * Slug: kits-by-wugweb/breadcrumbs
 * Categories: kits-components
 * Block Types: core/group
 * Description: Accessible breadcrumbs navigation trail. Consumes RankWeb's rankweb/breadcrumbs block when RankWeb is active, with a dynamic WordPress-native fallback trail when RankWeb is inactive.
 * Keywords: breadcrumbs, navigation, hierarchy, rankweb
 *
 * @package kits-by-wugweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// When RankWeb is active and has registered its breadcrumbs block, delegate directly to the block.
if ( function_exists( 'rankweb_breadcrumbs_block' ) || ( function_exists( 'has_block' ) && class_exists( 'WP_Block_Type_Registry' ) && WP_Block_Type_Registry::get_instance()->is_registered( 'rankweb/breadcrumbs' ) ) ) {
	?>
	<!-- wp:rankweb/breadcrumbs /-->
	<?php
	return;
}

// Dynamic WordPress-native fallback when RankWeb is inactive.
$home_url   = function_exists( 'home_url' ) ? home_url( '/' ) : '/';
$home_title = function_exists( 'get_bloginfo' ) ? get_bloginfo( 'name' ) : 'Home';
$trail      = array();

$trail[] = array(
	'name' => function_exists( 'esc_html__' ) ? esc_html__( 'Home', 'kits-by-wugweb' ) : 'Home',
	'url'  => $home_url,
);

if ( function_exists( 'is_front_page' ) && ( is_front_page() || is_home() ) ) {
	// Already at home.
} elseif ( function_exists( 'is_category' ) && ( is_category() || is_tag() || is_tax() ) ) {
	$term = get_queried_object();
	if ( $term && isset( $term->name ) ) {
		$trail[] = array(
			'name' => $term->name,
			'url'  => '',
		);
	}
} elseif ( function_exists( 'is_singular' ) && is_singular() ) {
	$post = get_queried_object();
	if ( $post && isset( $post->post_type ) && 'page' === $post->post_type ) {
		// Ancestor pages if hierarchical.
		if ( ! empty( $post->ancestors ) ) {
			$ancestors = array_reverse( (array) $post->ancestors );
			foreach ( $ancestors as $ancestor_id ) {
				$trail[] = array(
					'name' => get_the_title( $ancestor_id ),
					'url'  => get_permalink( $ancestor_id ),
				);
			}
		}
	} elseif ( $post && isset( $post->post_type ) && 'post' === $post->post_type ) {
		$cats = function_exists( 'get_the_category' ) ? get_the_category( $post->ID ) : array();
		if ( ! empty( $cats ) ) {
			$trail[] = array(
				'name' => $cats[0]->name,
				'url'  => function_exists( 'get_category_link' ) ? get_category_link( $cats[0]->term_id ) : '',
			);
		}
	}
	if ( $post && isset( $post->post_title ) ) {
		$trail[] = array(
			'name' => get_the_title( $post ),
			'url'  => '',
		);
	}
} elseif ( function_exists( 'is_search' ) && is_search() ) {
	$trail[] = array(
		'name' => 'Search: "' . get_search_query() . '"',
		'url'  => '',
	);
} elseif ( function_exists( 'is_404' ) && is_404() ) {
	$trail[] = array(
		'name' => '404 Not Found',
		'url'  => '',
	);
} elseif ( function_exists( 'is_archive' ) && is_archive() ) {
	$trail[] = array(
		'name' => function_exists( 'get_the_archive_title' ) ? get_the_archive_title() : 'Archive',
		'url'  => '',
	);
}
?>
<!-- wp:group {"tagName":"nav","ariaLabel":"Breadcrumb","className":"kit-crumbs","layout":{"type":"flex","flexWrap":"wrap"}} -->
<nav class="wp-block-group kit-crumbs" aria-label="Breadcrumb"><!-- wp:list {"ordered":true} -->
<ol class="wp-block-list"><?php
$count = count( $trail );
foreach ( $trail as $idx => $item ) :
	$is_last = ( $idx === $count - 1 );
	?><!-- wp:list-item -->
<li><?php if ( ! empty( $item['url'] ) && ! $is_last ) : ?><a href="<?php echo esc_url( $item['url'] ); ?>"><?php echo esc_html( $item['name'] ); ?></a><?php else : ?><span<?php echo $is_last ? ' aria-current="page"' : ''; ?>><?php echo esc_html( $item['name'] ); ?></span><?php endif; ?></li>
<!-- /wp:list-item -->
<?php endforeach; ?></ol>
<!-- /wp:list --></nav>
<!-- /wp:group -->
