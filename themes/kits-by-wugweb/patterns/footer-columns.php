<?php
/**
 * Title: Footer: four columns
 * Slug: kits-by-wugweb/footer-columns
 * Categories: footer
 * Block Types: core/template-part/footer
 * Description: A footer with a brand column, two link columns and a column with a line and an action, above the legal bar. Pick it in the Site Editor to replace the default footer.
 */
?>
<!-- wp:group {"align":"full","className":"kit-dark kit-site-footer","backgroundColor":"secondary","textColor":"background","layout":{"type":"constrained","contentSize":"1200px"}} -->
<div class="wp-block-group alignfull kit-dark kit-site-footer has-background-color has-secondary-background-color has-text-color has-background"><!-- wp:columns -->
<div class="wp-block-columns"><!-- wp:column -->
<div class="wp-block-column"><!-- wp:site-logo {"width":48} /-->

<!-- wp:site-tagline /--></div>
<!-- /wp:column -->

<!-- wp:column -->
<div class="wp-block-column"><!-- wp:paragraph {"className":"kit-footer-head"} -->
<p class="kit-footer-head"><?php esc_html_e( 'Explore', 'kits-by-wugweb' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:navigation {"ariaLabel":"Footer links 1","overlayMenu":"never","className":"kit-footer-list","layout":{"type":"flex","orientation":"vertical"}} /--></div>
<!-- /wp:column -->

<!-- wp:column -->
<div class="wp-block-column"><!-- wp:paragraph {"className":"kit-footer-head"} -->
<p class="kit-footer-head"><?php esc_html_e( 'About', 'kits-by-wugweb' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:navigation {"ariaLabel":"Footer links 2","overlayMenu":"never","className":"kit-footer-list","layout":{"type":"flex","orientation":"vertical"}} /--></div>
<!-- /wp:column -->

<!-- wp:column -->
<div class="wp-block-column"><!-- wp:paragraph {"className":"kit-footer-head"} -->
<p class="kit-footer-head"><?php esc_html_e( 'Get in touch', 'kits-by-wugweb' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p><?php esc_html_e( 'Supporting text.', 'kits-by-wugweb' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:buttons -->
<div class="wp-block-buttons"><!-- wp:button {"className":"is-style-kits-brand"} -->
<div class="wp-block-button is-style-kits-brand"><a class="wp-block-button__link wp-element-button"><?php esc_html_e( 'Action', 'kits-by-wugweb' ); ?></a></div>
<!-- /wp:button --></div>
<!-- /wp:buttons --></div>
<!-- /wp:column --></div>
<!-- /wp:columns -->

<!-- wp:group {"className":"kit-footer-bar","layout":{"type":"flex","flexWrap":"wrap","justifyContent":"space-between"}} -->
<div class="wp-block-group kit-footer-bar"><!-- wp:group {"layout":{"type":"flex","flexWrap":"wrap"}} -->
<div class="wp-block-group"><!-- wp:paragraph -->
<p>&copy; <?php echo esc_html( gmdate( 'Y' ) ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:site-title {"level":0,"isLink":false} /-->

<!-- wp:navigation {"ariaLabel":"Policies","overlayMenu":"never","className":"kit-legal-links","layout":{"type":"flex","flexWrap":"wrap"}} /--></div>
<!-- /wp:group --></div>
<!-- /wp:group --></div>
<!-- /wp:group -->
