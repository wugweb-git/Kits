<?php
/** Blog post schema: structured fields that mirror uat.wugweb.com articles. */
defined('ABSPATH') || exit;

/** Every column of the Notion "Blogs" master table, stored as post meta (type, description). */
function wugweb_core_blog_fields() {
    return array(
        'wugweb_post_id'             => array('string', 'Notion Post ID, e.g. POST-0001'),
        'wugweb_subtitle'            => array('string', 'Subtitle'),
        'wugweb_ai_summary'          => array('string', 'AI summary'),
        'wugweb_cover_url'           => array('string', 'Cover image URL (R2)'),
        'wugweb_featured'            => array('boolean', 'Featured post'),
        'wugweb_word_count'          => array('integer', 'Word count'),
        'wugweb_read_time'           => array('integer', 'Read time in minutes (merged with reading time label)'),
        'wugweb_publish_date'        => array('string', 'Publish date (YYYY-MM-DD)'),
        'wugweb_last_updated'        => array('string', 'Last updated (YYYY-MM-DD)'),
        'wugweb_primary_category' => array('string', 'Primary category name'),
        'wugweb_author_name'         => array('string', 'Author display name'),
        'wugweb_owner'               => array('string', 'Owner'),
        'wugweb_related_slugs'       => array('string', 'Related post slugs, comma separated'),
        'wugweb_related_case_studies'=> array('string', 'Related case study slugs, comma separated'),
        'wugweb_published_at'        => array('string', 'Syndicated on (Medium, LinkedIn, Dev.to, Hashnode), comma separated'),
        'wugweb_publications'        => array('string', 'Publication links, comma separated'),
        'wugweb_assets'              => array('string', 'Linked assets, comma separated'),
        'wugweb_filter_category'     => array('string', 'Filter Category (rollup from Category)'),
        'wugweb_published_on'        => array('string', 'Published On (rollup from Publications)'),
    );
}

add_action('init', function () {
    foreach (wugweb_core_blog_fields() as $key => $f) {
        $type = $f[0];
        $san = $type === 'integer' ? 'absint' : ($type === 'boolean' ? 'rest_sanitize_boolean' : (strpos($key, '_url') !== false || strpos($key, 'og_image') !== false ? 'esc_url_raw' : 'sanitize_text_field'));
        register_post_meta('post', $key, array(
            'type' => $type, 'single' => true, 'show_in_rest' => true,
            'description' => $f[1], 'sanitize_callback' => $san,
            'auth_callback' => function () { return current_user_can('edit_posts'); },
        ));
    }
    // Notion ids and descriptions for taxonomy terms (categories, tags).
    foreach (array('category', 'post_tag', 'industry', 'discipline') as $tax) {
        foreach (array('wugweb_term_id' => 'Notion id, e.g. CAT-001', 'wugweb_term_level' => 'CMS level (Standard or Filter)', 'wugweb_term_type' => 'Category type', 'wugweb_term_parent' => 'Parent term slug') as $k => $d) {
            register_term_meta($tax, $k, array('type' => 'string', 'single' => true, 'show_in_rest' => true, 'description' => $d, 'sanitize_callback' => 'sanitize_text_field', 'auth_callback' => function () { return current_user_can('manage_categories'); }));
        }
    }
    add_post_type_support('post', 'custom-fields');
    add_post_type_support('post', 'excerpt');
});

