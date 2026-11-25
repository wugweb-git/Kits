<?php
/**
 * Title: Footer: minimal
 * Slug: kits-by-wugweb/footer-minimal
 * Categories: footer
 * Block Types: core/template-part/footer
 * Description: A one-row footer: copyright with the site title, and a policies menu. Pick it in the Site Editor to replace the default footer.
 */
?>
<!-- wp:group {"align":"full","className":"kit-dark kit-site-footer","backgroundColor":"secondary","textColor":"background","layout":{"type":"constrained","contentSize":"1200px"}} -->
<div class="wp-block-group alignfull kit-dark kit-site-footer has-background-color has-secondary-background-color has-text-color has-background"><!-- wp:group {"className":"kit-footer-bar","layout":{"type":"flex","flexWrap":"wrap","justifyContent":"space-between"}} -->
<div class="wp-block-group kit-footer-bar"><!-- wp:group {"layout":{"type":"flex","flexWrap":"wrap"}} -->
<div class="wp-block-group"><!-- wp:paragraph -->
<p>&copy; <?php echo esc_html( gmdate( 'Y' ) ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:site-title {"level":0,"isLink":false} /-->

<!-- wp:navigation {"ariaLabel":"Policies","overlayMenu":"never","className":"kit-legal-links","layout":{"type":"flex","flexWrap":"wrap"}} /--></div>
<!-- /wp:group --></div>
<!-- /wp:group --></div>
<!-- /wp:group -->
