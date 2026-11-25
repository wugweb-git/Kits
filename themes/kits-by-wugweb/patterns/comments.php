<?php
/**
 * Title: Comments
 * Slug: kits-by-wugweb/comments
 * Categories: kits-components
 * Inserter: no
 * Description: The comments list, pagination and form used by templates/single.html. One source, so a site can change it in one place.
 */
?>
<!-- wp:comments -->
<div class="wp-block-comments"><!-- wp:comments-title {"level":2} /-->

<!-- wp:comment-template -->
<!-- wp:columns -->
<div class="wp-block-columns"><!-- wp:column {"width":"40px"} -->
<div class="wp-block-column" style="flex-basis:40px"><!-- wp:avatar {"size":40} /--></div>
<!-- /wp:column -->

<!-- wp:column -->
<div class="wp-block-column"><!-- wp:comment-author-name /-->

<!-- wp:group {"layout":{"type":"flex"}} -->
<div class="wp-block-group"><!-- wp:comment-date /-->

<!-- wp:comment-edit-link /--></div>
<!-- /wp:group -->

<!-- wp:comment-content /-->

<!-- wp:comment-reply-link /--></div>
<!-- /wp:column --></div>
<!-- /wp:columns -->
<!-- /wp:comment-template -->

<!-- wp:comments-pagination -->
<!-- wp:comments-pagination-previous /-->

<!-- wp:comments-pagination-numbers /-->

<!-- wp:comments-pagination-next /-->
<!-- /wp:comments-pagination -->

<!-- wp:post-comments-form /-->
</div>
<!-- /wp:comments -->
