<?php
/**
 * Title: Call to action: inline
 * Slug: kits-by-wugweb/cta-inline
 * Categories: call-to-action, kits-components
 * Block Types: core/group
 * Description: A Card with one line on the left and a button on the right; wraps on small screens. The compact companion to Call to action (the dark band).
 * Keywords: call to action, button, inline
 * Viewport Width: 1280
 */
?>
<!-- wp:group {"align":"wide","className":"is-style-kits-card","layout":{"type":"flex","flexWrap":"wrap","justifyContent":"space-between"}} -->
<div class="wp-block-group alignwide is-style-kits-card"><!-- wp:paragraph {"fontSize":"large"} -->
<p class="has-large-font-size"><?php esc_html_e( 'Supporting text.', 'kits-by-wugweb' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:buttons -->
<div class="wp-block-buttons"><!-- wp:button {"className":"is-style-kits-brand"} -->
<div class="wp-block-button is-style-kits-brand"><a class="wp-block-button__link wp-element-button"><?php esc_html_e( 'Action', 'kits-by-wugweb' ); ?></a></div>
<!-- /wp:button --></div>
<!-- /wp:buttons --></div>
<!-- /wp:group -->
