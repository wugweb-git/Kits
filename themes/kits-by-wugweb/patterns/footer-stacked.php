<?php
/**
 * Title: Footer: stacked
 * Slug: kits-by-wugweb/footer-stacked
 * Categories: footer
 * Block Types: core/template-part/footer
 * Description: A centred footer: heading, line and one action, then the legal bar. Pick it in the Site Editor to replace the default footer.
 */
?>
<!-- wp:group {"align":"full","className":"kit-dark kit-site-footer","backgroundColor":"secondary","textColor":"background","layout":{"type":"constrained","contentSize":"1200px"}} -->
<div class="wp-block-group alignfull kit-dark kit-site-footer has-background-color has-secondary-background-color has-text-color has-background"><!-- wp:group {"layout":{"type":"constrained","contentSize":"640px"}} -->
<div class="wp-block-group"><!-- wp:heading {"textAlign":"center"} -->
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

<!-- wp:group {"className":"kit-footer-bar","layout":{"type":"flex","flexWrap":"wrap","justifyContent":"center"}} -->
<div class="wp-block-group kit-footer-bar"><!-- wp:paragraph -->
<p>&copy; <?php echo esc_html( gmdate( 'Y' ) ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:site-title {"level":0,"isLink":false} /-->

<!-- wp:navigation {"ariaLabel":"Policies","overlayMenu":"never","className":"kit-legal-links","layout":{"type":"flex","flexWrap":"wrap"}} /--></div>
<!-- /wp:group --></div>
<!-- /wp:group -->
