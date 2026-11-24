<?php
/**
 * Title: Boxes: three
 * Slug: kits-by-wugweb/boxes-three
 * Categories: featured, kits-components
 * Block Types: core/columns
 * Description: Three Card boxes, each with a heading, a line and a button. The light companion to Three big actions (the dark band).
 * Keywords: boxes, cards, columns, features
 * Viewport Width: 1280
 */
?>
<!-- wp:columns {"align":"wide"} -->
<div class="wp-block-columns alignwide"><?php for ( $i = 0; $i < 3; $i++ ) : ?><!-- wp:column -->
<div class="wp-block-column"><!-- wp:group {"className":"is-style-kits-card","layout":{"type":"default"}} -->
<div class="wp-block-group is-style-kits-card"><!-- wp:heading -->
<h2 class="wp-block-heading"><?php esc_html_e( 'Heading', 'kits-by-wugweb' ); ?></h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p><?php esc_html_e( 'Supporting text.', 'kits-by-wugweb' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:buttons -->
<div class="wp-block-buttons"><!-- wp:button {"className":"is-style-kits-secondary"} -->
<div class="wp-block-button is-style-kits-secondary"><a class="wp-block-button__link wp-element-button"><?php esc_html_e( 'Action', 'kits-by-wugweb' ); ?></a></div>
<!-- /wp:button --></div>
<!-- /wp:buttons --></div>
<!-- /wp:group --></div>
<!-- /wp:column -->
<?php endfor; ?></div>
<!-- /wp:columns -->
