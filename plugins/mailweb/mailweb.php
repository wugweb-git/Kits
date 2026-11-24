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
 * Description:       Hostinger Mail inside WordPress: read, reply and send from your mailboxes, website form messages in the same inbox, plus SMTP sending with a daily limit and queue and a FluentCRM feed. Own menu: Mail (Inbox, Overview, Settings).
 * Version:           3.3.0
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

define( 'MAILWEB_VERSION', '3.3.0' );
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

// Website forms in the Inbox, the old webhook address and the API token from AW_HOSTINGER_MAIL_TOKEN (first: the token
// constant is set before anything reads it).
require_once MAILWEB_DIR . 'includes/website-forms.php';
require_once MAILWEB_DIR . 'includes/mailweb-caps.php'; // MailWeb's own capability, MAILWEB_CAP = manage_mailweb (granted from edit_others_posts).
require_once MAILWEB_DIR . 'includes/admin-table.php';
require_once MAILWEB_DIR . 'includes/help-tab.php';
require_once MAILWEB_DIR . 'includes/plugin-info.php';
require_once MAILWEB_DIR . 'includes/crypto.php';
require_once MAILWEB_DIR . 'includes/addresses.php';
require_once MAILWEB_DIR . 'includes/mailweb-settings-save.php';
require_once MAILWEB_DIR . 'includes/providers.php'; // the mail-provider seam; the default adapter is the Hostinger Mail API.
require_once MAILWEB_DIR . 'includes/mail-in.php';
require_once MAILWEB_DIR . 'includes/smtp.php';
require_once MAILWEB_DIR . 'includes/mail-cap.php';
require_once MAILWEB_DIR . 'includes/mailboxes.php';
require_once MAILWEB_DIR . 'includes/profiles.php';
require_once MAILWEB_DIR . 'includes/utm.php'; // the site's own links in its emails tagged (utm_source=site-email).
require_once MAILWEB_DIR . 'includes/inbox.php';
require_once MAILWEB_DIR . 'includes/settings-tab.php';
require_once MAILWEB_DIR . 'includes/crm-sync.php';
require_once MAILWEB_DIR . 'includes/fluentcrm.php'; // the site's FluentCRM: Newsletter list, tags, notes, volunteer fields, update link, UTM tags.
require_once MAILWEB_DIR . 'includes/newsletter.php'; // [aw_newsletter] (Fluent Forms) and the old list's confirm and unsubscribe links.
require_once MAILWEB_DIR . 'includes/fluentcrm-compat.php'; // the old aw_ names of the three files above.
require_once MAILWEB_DIR . 'includes/overview.php';
require_once MAILWEB_DIR . 'includes/home.php';
require_once MAILWEB_DIR . 'includes/mailweb-ui.php'; // the screens on the Kits shell.
require_once MAILWEB_DIR . 'includes/mailweb-rest.php';
require_once MAILWEB_DIR . 'includes/mailweb-dashboard.php';
require_once MAILWEB_DIR . 'includes/kits-hub.php'; // a tab and a status row in the Kits admin, when Kits Core is loaded.

// Deactivation stops MailWeb's scheduled jobs; settings, the queue and the mailboxes are left as they are.
register_deactivation_hook(
	__FILE__,
	function () {
		foreach ( array( 'mailweb_flush', 'mailweb_crm_sync', 'mailweb_dashboard_build' ) as $hook ) {
			wp_unschedule_hook( $hook ); // Every event of the hook, with or without arguments.
		}
	}
);
