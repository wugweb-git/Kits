<?php
/**
 * Title: Author box
 * Slug: kits-by-wugweb/author-box
 * Categories: kits-components
 * Block Types: core/group
 * Description: The post author's photo, name and biography in a Card group. Place it in a post template or in the post content; it reads the author of the post it sits in.
 * Keywords: author, bio, byline, post
 */
?>
<!-- wp:group {"className":"is-style-kits-card","layout":{"type":"flex","flexWrap":"nowrap","verticalAlignment":"top"}} -->
<div class="wp-block-group is-style-kits-card"><!-- wp:avatar {"size":64} /-->

<!-- wp:group {"layout":{"type":"default"}} -->
<div class="wp-block-group"><!-- wp:post-author-name {"isLink":true} /-->

<!-- wp:post-author-biography /--></div>
<!-- /wp:group --></div>
<!-- /wp:group -->
