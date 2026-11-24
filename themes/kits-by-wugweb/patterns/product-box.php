<?php
/**
 * Title: Product box
 * Slug: kits-by-wugweb/product-box
 * Categories: call-to-action, kits-components
 * Block Types: core/group
 * Description: A Card with an image beside a heading, a line and a button. Choose the image in the editor; it keeps its own aspect ratio and rounded corners.
 * Keywords: product, feature, image, box
 * Viewport Width: 1280
 */
?>
<!-- wp:group {"align":"wide","className":"is-style-kits-card","layout":{"type":"default"}} -->
<div class="wp-block-group alignwide is-style-kits-card"><!-- wp:columns {"verticalAlignment":"center"} -->
<div class="wp-block-columns are-vertically-aligned-center"><!-- wp:column {"verticalAlignment":"center"} -->
<div class="wp-block-column is-vertically-aligned-center"><!-- wp:image {"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img alt=""/></figure>
<!-- /wp:image --></div>
<!-- /wp:column -->

<!-- wp:column {"verticalAlignment":"center"} -->
<div class="wp-block-column is-vertically-aligned-center"><!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading"><?php esc_html_e( 'Heading', 'kits-by-wugweb' ); ?></h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p><?php esc_html_e( 'Supporting text.', 'kits-by-wugweb' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:buttons -->
<div class="wp-block-buttons"><!-- wp:button -->
<div class="wp-block-button"><a class="wp-block-button__link wp-element-button"><?php esc_html_e( 'Action', 'kits-by-wugweb' ); ?></a></div>
<!-- /wp:button --></div>
<!-- /wp:buttons --></div>
<!-- /wp:column --></div>
<!-- /wp:columns --></div>
<!-- /wp:group -->
