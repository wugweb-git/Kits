<?php
/**
 * Title: Pricing: four plans
 * Slug: kits-by-wugweb/pricing-four
 * Categories: kits-components
 * Block Types: core/columns
 * Description: Four plans in Cards: name, price line, a real list of features and a button. Placeholder text only: write your own plans and prices.
 * Keywords: pricing, plans, tiers
 * Viewport Width: 1280
 */
?>
<!-- wp:columns {"align":"wide"} -->
<div class="wp-block-columns alignwide"><?php for ( $i = 0; $i < 4; $i++ ) : ?><!-- wp:column -->
<div class="wp-block-column"><!-- wp:group {"className":"is-style-kits-card","layout":{"type":"default"}} -->
<div class="wp-block-group is-style-kits-card"><!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading"><?php esc_html_e( 'Plan name', 'kits-by-wugweb' ); ?></h3>
<!-- /wp:heading -->

<!-- wp:paragraph {"fontSize":"large"} -->
<p class="has-large-font-size"><?php esc_html_e( 'Price line', 'kits-by-wugweb' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:separator {"className":"is-style-kits-hairline"} -->
<hr class="wp-block-separator has-alpha-channel-opacity is-style-kits-hairline"/>
<!-- /wp:separator -->

<!-- wp:list -->
<ul class="wp-block-list"><!-- wp:list-item -->
<li><?php esc_html_e( 'Feature', 'kits-by-wugweb' ); ?></li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li><?php esc_html_e( 'Feature', 'kits-by-wugweb' ); ?></li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li><?php esc_html_e( 'Feature', 'kits-by-wugweb' ); ?></li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:buttons -->
<div class="wp-block-buttons"><!-- wp:button -->
<div class="wp-block-button"><a class="wp-block-button__link wp-element-button"><?php esc_html_e( 'Choose plan', 'kits-by-wugweb' ); ?></a></div>
<!-- /wp:button --></div>
<!-- /wp:buttons --></div>
<!-- /wp:group --></div>
<!-- /wp:column -->
<?php endfor; ?></div>
<!-- /wp:columns -->
