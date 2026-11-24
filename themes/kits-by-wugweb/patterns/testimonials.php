<?php
/**
 * Title: Testimonials: three cards
 * Slug: kits-by-wugweb/testimonials
 * Categories: testimonials, kits-components
 * Block Types: core/columns
 * Description: Three quotes in Card groups, each with an optional round photo. The text is a placeholder: replace it with real words from real people. Add a photo by choosing an image in the slot; a slot left empty shows nothing on the site (delete it in the editor if you do not want it).
 * Keywords: testimonials, quotes, reviews, social proof
 * Viewport Width: 1280
 */
?>
<!-- wp:columns {"align":"wide"} -->
<div class="wp-block-columns alignwide"><?php for ( $i = 0; $i < 3; $i++ ) : ?><!-- wp:column -->
<div class="wp-block-column"><!-- wp:group {"className":"is-style-kits-card","layout":{"type":"default"}} -->
<div class="wp-block-group is-style-kits-card"><!-- wp:quote -->
<blockquote class="wp-block-quote"><!-- wp:paragraph -->
<p><?php esc_html_e( 'Quote text.', 'kits-by-wugweb' ); ?></p>
<!-- /wp:paragraph --></blockquote>
<!-- /wp:quote -->

<!-- wp:group {"layout":{"type":"flex","flexWrap":"nowrap","verticalAlignment":"center"}} -->
<div class="wp-block-group"><!-- wp:image {"width":"56px","sizeSlug":"thumbnail","linkDestination":"none","className":"is-style-rounded"} -->
<figure class="wp-block-image size-thumbnail is-resized is-style-rounded"><img alt="" style="width:56px"/></figure>
<!-- /wp:image -->

<!-- wp:paragraph {"className":"is-style-kits-label"} -->
<p class="is-style-kits-label"><?php esc_html_e( 'Name, role', 'kits-by-wugweb' ); ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group --></div>
<!-- /wp:group --></div>
<!-- /wp:column -->
<?php endfor; ?></div>
<!-- /wp:columns -->
