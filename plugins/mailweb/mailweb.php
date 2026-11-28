<?php
/**
 * MailWeb
 *
 * @package           mailweb
 * @author            Wugweb
 * @copyright         2026 Wugweb
 * @license           GPL-2.0-or-later
 *
 * @wordpress-plugin
 * Plugin Name:       MailWeb
 * Plugin URI:        https://wugweb-git.github.io/Kits/plugins/mailweb/
 * Description:       Hostinger Mail inside WordPress: read, reply and send from your mailboxes, website form messages in the same inbox, plus SMTP sending with a daily limit and queue and a FluentCRM feed. Own menu: Mail (Inbox, Overview, Settings).
 * Version:           3.7.0
 * Update URI:           https://wugweb.com/plugins/mailweb/
 * Requires at least: 7.1
 * Requires PHP:      8.0
 * Author:            Wugweb
 * Author URI:        https://wugweb.com/
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       mailweb
 * Domain Path:       /languages
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Standalone compatibility layer: provides fallback implementations when Kits Core is inactive.
require_once __DIR__ . '/includes/standalone-fallback.php';

// Track standalone mode dynamically on plugins_loaded so boot order between plugins does not matter.
add_action(
	'plugins_loaded',
	function () {
		if ( ! defined( 'MAILWEB_STANDALONE' ) ) {
			define( 'MAILWEB_STANDALONE', ! defined( 'KITS_CORE_LOADED' ) );
		}
	},
	1
);

define( 'MAILWEB_VERSION', '3.7.0' );
define( 'MAILWEB_FILE', __FILE__ );
define( 'MAILWEB_DIR', plugin_dir_path( __FILE__ ) );
define( 'MAILWEB_WEBMAIL', 'https://mail.hostinger.com' );
define( 'MAILWEB_API_HOST', 'https://api.mail.hostinger.com' );

// Hostinger Mail API PHP SDK (hostinger/mail-api-php-sdk) autoload if bundled. The SDK needs PHP 8.2+;
// MailWeb itself runs on PHP 8.0+, so older hosts use the built-in REST transport and never load vendor/.
define( 'MAILWEB_SDK_MIN_PHP_ID', 80200 );
if ( PHP_VERSION_ID >= MAILWEB_SDK_MIN_PHP_ID && is_readable( MAILWEB_DIR . 'vendor/autoload.php' ) ) {
	require_once MAILWEB_DIR . 'vendor/autoload.php';
}

// The 5-minute schedule the queue and the FluentCRM feed use.
add_filter(
	'cron_schedules',
	function ( $s ) {
		$s['mailweb_5min'] = $s['mailweb_5min'] ?? array(
			'interval' => 300,
			'display'  => __( 'Every 5 minutes', 'mailweb' ),
		);
		return $s;
	}
);

add_action(
	'init',
	function () {
		load_plugin_textdomain( 'mailweb', false, dirname( plugin_basename( MAILWEB_FILE ) ) . '/languages' ); // phpcs:ignore PluginCheck.CodeAnalysis.DiscouragedFunctions.load_plugin_textdomainFound -- sold outside WordPress.org: translations ship in /languages
	}
);

// How far MailWeb takes over the site's email, and standing down for another SMTP plugin (first: smtp.php and
// mail-cap.php ask it on every email).
require_once MAILWEB_DIR . 'includes/sending-mode.php';
require_once MAILWEB_DIR . 'includes/mailweb-caps.php'; // MailWeb's own capability, MAILWEB_CAP = manage_mailweb (granted from edit_others_posts).
require_once MAILWEB_DIR . 'includes/admin-table.php';
require_once MAILWEB_DIR . 'includes/help-tab.php';
require_once MAILWEB_DIR . 'includes/plugin-info.php';
require_once MAILWEB_DIR . 'includes/crypto.php';
require_once MAILWEB_DIR . 'includes/addresses.php';
require_once MAILWEB_DIR . 'includes/mailweb-settings-save.php';
require_once MAILWEB_DIR . 'includes/providers.php'; // the mail-provider seam; the default adapter is the Hostinger Mail API.
require_once MAILWEB_DIR . 'includes/mail-in.php';
require_once MAILWEB_DIR . 'includes/dns-status.php';
require_once MAILWEB_DIR . 'includes/smtp.php';
require_once MAILWEB_DIR . 'includes/mail-cap.php';
require_once MAILWEB_DIR . 'includes/mailboxes.php';
require_once MAILWEB_DIR . 'includes/profiles.php';
// Sender profiles and the retry queue (includes/tenant-profiles.php) are on HOLD and not loaded. Version 3.3.2 loaded them by mistake:
// remove the failed mail it kept in the database, its schedule and its profiles, once.
add_action(
	'admin_init',
	function () {
		if ( get_option( 'mailweb_held_retry_removed' ) ) {
			return;
		}
		wp_clear_scheduled_hook( 'mailweb_retry_queue_tick' );
		delete_option( 'mailweb_retry_queue' );
		delete_option( 'mailweb_tenant_profiles' );
		update_option( 'mailweb_held_retry_removed', 1, false );
	}
);
require_once MAILWEB_DIR . 'includes/utm.php'; // the site's own links in its emails tagged (utm_source=site-email).
require_once MAILWEB_DIR . 'includes/inbox.php';
require_once MAILWEB_DIR . 'includes/settings-tab.php';
require_once MAILWEB_DIR . 'includes/crm-sync.php';
// The FluentCRM helpers (list, tags, subscribe, contact for an address, block list, UTM tags) are loaded only on a site
// where FluentCRM or Fluent Forms is active, on plugins_loaded once those have loaded.
add_action(
	'plugins_loaded',
	function () {
		if ( ! defined( 'FLUENTCRM' ) && ! defined( 'FLUENTFORM' ) && ! function_exists( 'FluentCrmApi' ) && ! function_exists( 'wpFluent' ) ) {
			return;
		}
		require_once MAILWEB_DIR . 'includes/fluentcrm.php'; // FluentCRM: Newsletter list, tags, subscribe, contact for an address, block list, UTM tags.
	},
	5
);
require_once MAILWEB_DIR . 'includes/overview.php';
require_once MAILWEB_DIR . 'includes/home.php';
require_once MAILWEB_DIR . 'includes/mailweb-ui.php'; // the screens on the Kits shell.
require_once MAILWEB_DIR . 'includes/native-screens.php'; // the same screens drawn by WordPress alone, without Kits Core.
require_once MAILWEB_DIR . 'includes/mailweb-rest.php';
require_once MAILWEB_DIR . 'includes/mailweb-dashboard.php';
require_once MAILWEB_DIR . 'includes/mailweb-fluentsmtp.php';
require_once MAILWEB_DIR . 'includes/mail-delivery.php'; // the delivery log, the fallback SMTP connection, failure alerts, the pause-notice dismiss.
require_once MAILWEB_DIR . 'includes/kits-hub.php'; // a tab and a status row in the Kits admin, when Kits Core is loaded.

// Deactivation stops MailWeb's scheduled jobs; settings, the queue and the mailboxes are left as they are. Deleting
// the plugin with "Delete MailWeb's data" ticked removes the data too (uninstall.php).
register_deactivation_hook(
	__FILE__,
	function () {
		foreach ( array( 'mailweb_flush', 'mailweb_crm_sync', 'mailweb_dashboard_build', 'mailweb_daily_dns_check', 'mailweb_purge_log' ) as $hook ) {
			wp_unschedule_hook( $hook ); // Every event of the hook, with or without arguments.
		}
	}
);

// More from Kits: one quiet page that lists the other Kits plugins. The WordPress.org build leaves this file out.
if ( file_exists( __DIR__ . '/includes/more-from-kits.php' ) ) {
	require_once __DIR__ . '/includes/more-from-kits.php';
}
