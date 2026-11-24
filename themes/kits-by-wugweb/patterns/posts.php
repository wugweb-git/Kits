<?php
/**
 * Title: Posts: single column
 * Slug: kits-by-wugweb/posts
 * Categories: posts, kits-lists
 * Block Types: core/query
 * Description: Latest posts in one column: title, date, author and excerpt, with pagination.
 * Keywords: posts, blog, list, articles
 */
?>
<!-- wp:query {"query":{"perPage":6,"pages":0,"offset":0,"postType":"post","order":"desc","orderBy":"date","inherit":false},"align":"wide"} -->
<div class="wp-block-query alignwide"><!-- wp:post-template -->
<!-- wp:group {"tagName":"article","layout":{"type":"default"}} -->
<article class="wp-block-group"><!-- wp:post-title {"level":2,"isLink":true} /-->

<!-- wp:group {"layout":{"type":"flex","flexWrap":"wrap"}} -->
<div class="wp-block-group"><!-- wp:post-date /-->

<!-- wp:post-author-name /--></div>
<!-- /wp:group -->

<!-- wp:post-excerpt /--></article>
<!-- /wp:group -->
<!-- /wp:post-template -->

<!-- wp:query-pagination -->
<!-- wp:query-pagination-previous /-->

<!-- wp:query-pagination-numbers /-->

<!-- wp:query-pagination-next /-->
<!-- /wp:query-pagination --></div>
<!-- /wp:query -->
