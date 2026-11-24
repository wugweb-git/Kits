<?php
/**
 * Title: Portfolio
 * Slug: kits-by-wugweb/portfolio
 * Categories: portfolio, kits-components
 * Block Types: core/group
 * Description: A heading and line beside a gallery of work, with a link to more. Add the images in the editor; the gallery keeps each image's aspect ratio.
 * Keywords: portfolio, gallery, work, projects
 * Viewport Width: 1280
 */
?>
<!-- wp:columns {"align":"wide"} -->
<div class="wp-block-columns alignwide"><!-- wp:column {"width":"33.33%"} -->
<div class="wp-block-column" style="flex-basis:33.33%"><!-- wp:heading -->
<h2 class="wp-block-heading"><?php esc_html_e( 'Heading', 'kits-by-wugweb' ); ?></h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p><?php esc_html_e( 'Supporting text.', 'kits-by-wugweb' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:buttons -->
<div class="wp-block-buttons"><!-- wp:button {"className":"is-style-kits-secondary"} -->
<div class="wp-block-button is-style-kits-secondary"><a class="wp-block-button__link wp-element-button"><?php esc_html_e( 'See all', 'kits-by-wugweb' ); ?></a></div>
<!-- /wp:button --></div>
<!-- /wp:buttons --></div>
<!-- /wp:column -->

<!-- wp:column {"width":"66.66%"} -->
<div class="wp-block-column" style="flex-basis:66.66%"><!-- wp:gallery {"columns":2,"linkTo":"none"} -->
<figure class="wp-block-gallery has-nested-images columns-2 is-cropped"></figure>
<!-- /wp:gallery --></div>
<!-- /wp:column --></div>
<!-- /wp:columns -->
