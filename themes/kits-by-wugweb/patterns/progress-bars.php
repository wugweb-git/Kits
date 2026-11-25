<?php
/**
 * Title: Progress bars
 * Slug: kits-by-wugweb/progress-bars
 * Categories: featured, kits-components
 * Block Types: core/group
 * Description: Labelled bars for skills or goals, made of core blocks only. The value is written in the label ("Label, 90%") so it reads the same to everyone; the bar repeats it visually. Change the text, then set the inner group's flex size to the same percentage.
 * Keywords: progress, skills, bars, goals
 * Viewport Width: 1280
 */
?>
<!-- wp:group {"align":"wide","layout":{"type":"constrained","contentSize":"720px"}} -->
<div class="wp-block-group alignwide"><!-- wp:paragraph -->
<p><?php esc_html_e( 'Label one, 90%', 'kits-by-wugweb' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:group {"backgroundColor":"border","layout":{"type":"flex","flexWrap":"nowrap"}} -->
<div class="wp-block-group has-border-background-color has-background"><!-- wp:group {"backgroundColor":"secondary","style":{"dimensions":{"minHeight":"var:preset|spacing|20"},"layout":{"selfStretch":"fixed","flexSize":"90%"}},"layout":{"type":"default"}} -->
<div class="wp-block-group has-secondary-background-color has-background" style="min-height:var(--wp--preset--spacing--20)"></div>
<!-- /wp:group --></div>
<!-- /wp:group -->

<!-- wp:paragraph -->
<p><?php esc_html_e( 'Label two, 75%', 'kits-by-wugweb' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:group {"backgroundColor":"border","layout":{"type":"flex","flexWrap":"nowrap"}} -->
<div class="wp-block-group has-border-background-color has-background"><!-- wp:group {"backgroundColor":"secondary","style":{"dimensions":{"minHeight":"var:preset|spacing|20"},"layout":{"selfStretch":"fixed","flexSize":"75%"}},"layout":{"type":"default"}} -->
<div class="wp-block-group has-secondary-background-color has-background" style="min-height:var(--wp--preset--spacing--20)"></div>
<!-- /wp:group --></div>
<!-- /wp:group -->

<!-- wp:paragraph -->
<p><?php esc_html_e( 'Label three, 60%', 'kits-by-wugweb' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:group {"backgroundColor":"border","layout":{"type":"flex","flexWrap":"nowrap"}} -->
<div class="wp-block-group has-border-background-color has-background"><!-- wp:group {"backgroundColor":"secondary","style":{"dimensions":{"minHeight":"var:preset|spacing|20"},"layout":{"selfStretch":"fixed","flexSize":"60%"}},"layout":{"type":"default"}} -->
<div class="wp-block-group has-secondary-background-color has-background" style="min-height:var(--wp--preset--spacing--20)"></div>
<!-- /wp:group --></div>
<!-- /wp:group --></div>
<!-- /wp:group -->
