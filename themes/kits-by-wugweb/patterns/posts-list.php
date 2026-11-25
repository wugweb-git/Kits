<?php
/**
 * Title: Posts: ruled rows
 * Slug: kits-by-wugweb/posts-list
 * Categories: posts, kits-lists
 * Block Types: core/query
 * Description: Latest posts as ruled rows: date, title and excerpt side by side (stacked on small screens), with pagination.
 * Keywords: posts, list, archive, rows, articles
 */
?>
<!-- wp:query {"query":{"perPage":8,"pages":0,"offset":0,"postType":"post","order":"desc","orderBy":"date","inherit":false},"align":"wide"} -->
<div class="wp-block-query alignwide"><!-- wp:post-template -->
<!-- wp:separator {"className":"is-style-kits-hairline"} -->
<hr class="wp-block-separator has-alpha-channel-opacity is-style-kits-hairline"/>
<!-- /wp:separator -->

<!-- wp:columns -->
<div class="wp-block-columns"><!-- wp:column {"width":"20%"} -->
<div class="wp-block-column" style="flex-basis:20%"><!-- wp:post-date /--></div>
<!-- /wp:column -->

<!-- wp:column {"width":"35%"} -->
<div class="wp-block-column" style="flex-basis:35%"><!-- wp:post-title {"level":3,"isLink":true} /--></div>
<!-- /wp:column -->

<!-- wp:column -->
<div class="wp-block-column"><!-- wp:post-excerpt {"excerptLength":24} /--></div>
<!-- /wp:column --></div>
<!-- /wp:columns -->
<!-- /wp:post-template -->

<!-- wp:query-pagination -->
<!-- wp:query-pagination-previous /-->

<!-- wp:query-pagination-numbers /-->

<!-- wp:query-pagination-next /-->
<!-- /wp:query-pagination --></div>
<!-- /wp:query -->
