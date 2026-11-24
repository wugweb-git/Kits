<?php
/**
 * Title: Theme Toggle
 * Slug: kits-by-wugweb/theme-toggle
 * Categories: kits-components
 * Block Types: core/group
 * Description: Accessible Day/Night theme toggle button component for header or navigation.
 * Keywords: theme, dark mode, toggle, light, dark
 *
 * @package kits-by-wugweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>
<!-- wp:group {"className":"kit-theme-toggle-wrap","layout":{"type":"flex","flexWrap":"nowrap"}} -->
<div class="wp-block-group kit-theme-toggle-wrap">
<!-- wp:html -->
<button type="button" class="kit-theme-toggle" data-kit-theme-toggle aria-label="<?php esc_attr_e( 'Toggle dark/light theme', 'kits-by-wugweb' ); ?>" aria-pressed="false" style="background:none;border:none;color:inherit;cursor:pointer;padding:6px 8px;display:inline-flex;align-items:center;min-height:36px;font-size:16px;">
<span class="kit-ico kit-ico--theme" aria-hidden="true">◐</span>
</button>
<!-- /wp:html -->
</div>
<!-- /wp:group -->
