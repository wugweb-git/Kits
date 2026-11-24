<?php
/**
 * Title: 404 content
 * Slug: kits-by-wugweb/404
 * Categories: kits-components
 * Inserter: no
 * Description: The "page not found" heading, line and search used by templates/404.html. One source, so a site can change it in one place.
 */
?>
<!-- wp:heading {"level":1} -->
<h1 class="wp-block-heading"><?php esc_html_e( '404', 'kits-by-wugweb' ); ?></h1>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p><?php esc_html_e( 'Page not found.', 'kits-by-wugweb' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:search {"label":"Search","showLabel":false,"buttonText":"Search"} /-->
