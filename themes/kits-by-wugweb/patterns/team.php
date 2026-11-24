<?php
/**
 * Title: Team: four people
 * Slug: kits-by-wugweb/team
 * Categories: team, kits-components
 * Block Types: core/columns
 * Description: Four people, each with a photo, a name, a role and a link. Choose the photos in the editor; they keep their own aspect ratio and rounded corners.
 * Keywords: team, people, staff, about
 * Viewport Width: 1280
 */
?>
<!-- wp:columns {"align":"wide"} -->
<div class="wp-block-columns alignwide"><?php for ( $i = 0; $i < 4; $i++ ) : ?><!-- wp:column -->
<div class="wp-block-column"><!-- wp:image {"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img alt=""/></figure>
<!-- /wp:image -->

<!-- wp:heading -->
<h2 class="wp-block-heading"><?php esc_html_e( 'Name', 'kits-by-wugweb' ); ?></h2>
<!-- /wp:heading -->

<!-- wp:paragraph {"className":"is-style-kits-label"} -->
<p class="is-style-kits-label"><?php esc_html_e( 'Role', 'kits-by-wugweb' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:buttons -->
<div class="wp-block-buttons"><!-- wp:button {"className":"is-style-kits-ghost"} -->
<div class="wp-block-button is-style-kits-ghost"><a class="wp-block-button__link wp-element-button"><?php esc_html_e( 'Profile', 'kits-by-wugweb' ); ?></a></div>
<!-- /wp:button --></div>
<!-- /wp:buttons --></div>
<!-- /wp:column -->
<?php endfor; ?></div>
<!-- /wp:columns -->
