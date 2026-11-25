<?php
/**
 * Title: Page: links starter
 * Slug: kits-by-wugweb/page-link
 * Categories: kits-pages
 * Description: A single-column links page (a "link in bio" page): an image slot, a heading, a line and a stack of full-width buttons, then social icons. Placeholder text; add your own links, image and networks.
 * Keywords: links, bio, profile, starter, page
 * Viewport Width: 600
 */
?>
<!-- wp:group {"align":"wide","style":{"spacing":{"padding":{"top":"var:preset|spacing|70","bottom":"var:preset|spacing|70"}}},"layout":{"type":"constrained","contentSize":"600px"}} -->
<div class="wp-block-group alignwide" style="padding-top:var(--wp--preset--spacing--70);padding-bottom:var(--wp--preset--spacing--70)"><!-- wp:image {"align":"center","sizeSlug":"medium","linkDestination":"none"} -->
<figure class="wp-block-image aligncenter size-medium"><img alt=""/></figure>
<!-- /wp:image -->

<!-- wp:heading {"textAlign":"center","level":1} -->
<h1 class="wp-block-heading has-text-align-center"><?php esc_html_e( 'Name', 'kits-by-wugweb' ); ?></h1>
<!-- /wp:heading -->

<!-- wp:paragraph {"align":"center"} -->
<p class="has-text-align-center"><?php esc_html_e( 'Short description.', 'kits-by-wugweb' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:buttons {"layout":{"type":"flex","orientation":"vertical","justifyContent":"stretch"}} -->
<div class="wp-block-buttons"><!-- wp:button {"width":100} -->
<div class="wp-block-button has-custom-width wp-block-button__width-100"><a class="wp-block-button__link wp-element-button"><?php esc_html_e( 'Link one', 'kits-by-wugweb' ); ?></a></div>
<!-- /wp:button -->

<!-- wp:button {"width":100,"className":"is-style-kits-secondary"} -->
<div class="wp-block-button has-custom-width wp-block-button__width-100 is-style-kits-secondary"><a class="wp-block-button__link wp-element-button"><?php esc_html_e( 'Link two', 'kits-by-wugweb' ); ?></a></div>
<!-- /wp:button -->

<!-- wp:button {"width":100,"className":"is-style-kits-secondary"} -->
<div class="wp-block-button has-custom-width wp-block-button__width-100 is-style-kits-secondary"><a class="wp-block-button__link wp-element-button"><?php esc_html_e( 'Link three', 'kits-by-wugweb' ); ?></a></div>
<!-- /wp:button --></div>
<!-- /wp:buttons -->

<!-- wp:social-links {"className":"is-style-logos-only","layout":{"type":"flex","justifyContent":"center"}} -->
<ul class="wp-block-social-links is-style-logos-only"></ul>
<!-- /wp:social-links --></div>
<!-- /wp:group -->
