<?php
/**
 * Title: Call to action
 * Slug: kits-by-wugweb/cta
 * Categories: kits-components
 * Block Types: core/group
 * Description: A dark band with a heading, a supporting line and one action, centred. The background and alignment are ordinary Group settings: change them in the block sidebar or in Styles.
 * Keywords: call to action, button, band
 * Viewport Width: 1280
 */
?>
<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"var:preset|spacing|70","bottom":"var:preset|spacing|70"}}},"backgroundColor":"secondary","textColor":"background","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull has-background-color has-secondary-background-color has-text-color has-background" style="padding-top:var(--wp--preset--spacing--70);padding-bottom:var(--wp--preset--spacing--70)"><!-- wp:heading {"textAlign":"center"} -->
<h2 class="wp-block-heading has-text-align-center"><?php esc_html_e( 'Heading', 'kits-by-wugweb' ); ?></h2>
<!-- /wp:heading -->

<!-- wp:paragraph {"align":"center"} -->
<p class="has-text-align-center"><?php esc_html_e( 'Supporting text.', 'kits-by-wugweb' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"}} -->
<div class="wp-block-buttons"><!-- wp:button {"className":"is-style-kits-brand"} -->
<div class="wp-block-button is-style-kits-brand"><a class="wp-block-button__link wp-element-button"><?php esc_html_e( 'Action', 'kits-by-wugweb' ); ?></a></div>
<!-- /wp:button --></div>
<!-- /wp:buttons --></div>
<!-- /wp:group -->
