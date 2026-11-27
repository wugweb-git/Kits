<?php
/**
 * Content Web
 *
 * @package           contentweb
 * @author            Wugweb
 * @copyright         2026 Wugweb
 * @license           GPL-2.0-or-later
 *
 * @wordpress-plugin
 * Plugin Name:       Content Web
 * Plugin URI:        https://wugweb-git.github.io/Kits/plugins/contentweb/
 * Description:       The wugweb.com content model: case study and client post types, taxonomies (sector, country, tool stack, discipline, industry and more), Notion master fields as post and term meta, Notion directory tables, admin list columns and the Master menu. SEO is left to Rank Math and RankWeb.
 * Version:           1.0.0
 * Requires at least: 6.4
 * Requires PHP:      8.0
 * Author:            Wugweb
 * Author URI:        https://wugweb.com/
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       contentweb
 */

defined( 'ABSPATH' ) || exit;
define( 'CONTENTWEB_VERSION', '1.0.0' );

foreach ( array( 'post-types', 'blog-fields', 'notion-schema', 'page-fields', 'db-tables', 'admin-columns', 'master-menu', 'admin-icons' ) as $contentweb_file ) {
	require_once __DIR__ . '/includes/' . $contentweb_file . '.php';
}
