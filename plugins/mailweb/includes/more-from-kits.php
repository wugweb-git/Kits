<?php
/**
 * More from Kits: one quiet page in this plugin's menu that lists the other Kits plugins, says which are installed on this
 * site, and (in the direct-download build) installs or activates one when an administrator presses the button.
 * It is the only place the plugins promote each other: no banner, no notice, no link on any other screen, and it makes
 * no request when the page is viewed. Generated from tools/build/gen-more-page.py; change the template, not this copy.
 *
 * @package mailweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * The plugins: folder => name, one line, address.
 *
 * @return array<string, array{0:string,1:string,2:string}>
 */
function mailweb_more_products(): array {
	$all = array(
		'kits-core'    => array( 'Kits Core', __( 'The shared admin, brand and settings layer the other plugins plug into.', 'mailweb' ), 'https://wugweb.com/plugins/kits-core/' ),
		'directoryweb' => array( 'DirectoryWeb', __( 'A searchable directory of places and listings, with claims and review.', 'mailweb' ), 'https://wugweb.com/plugins/directoryweb/' ),
		'rankweb'      => array( 'RankWeb', __( 'SEO on top of Rank Math: sitemaps, redirects, FAQ, internal links and checks.', 'mailweb' ), 'https://wugweb.com/plugins/rankweb/' ),
		'insightweb'   => array( 'InsightWeb', __( 'Search and visitor insights from Google, in one place.', 'mailweb' ), 'https://wugweb.com/plugins/insightweb/' ),
		'sourceweb'    => array( 'SourceWeb', __( 'Finds, checks and queues news and sources for review before anything is published.', 'mailweb' ), 'https://wugweb.com/plugins/sourceweb/' ),
		'mailweb'      => array( 'MailWeb', __( 'Mailboxes, sending and a team inbox inside WordPress.', 'mailweb' ), 'https://wugweb.com/plugins/mailweb/' ),
		'planweb'      => array( 'PlanWeb', __( 'A content and team calendar with reminders and a weekly digest.', 'mailweb' ), 'https://wugweb.com/plugins/planweb/' ),
	);
	unset( $all['mailweb'] ); // Not this one.
	return $all;
}

/**
 * Installed (with its plugin file), active or none, for one folder.
 *
 * @param string $folder Plugin folder.
 * @return array{0:string,1:string} State (active, installed, none) and the plugin file ('' when none).
 */
function mailweb_more_state( string $folder ): array {
	if ( ! function_exists( 'get_plugins' ) ) {
		require_once ABSPATH . 'wp-admin/includes/plugin.php';
	}
	foreach ( array_keys( get_plugins() ) as $file ) {
		if ( dirname( (string) $file ) === $folder ) {
			return array( is_plugin_active( $file ) ? 'active' : 'installed', (string) $file );
		}
	}
	return array( 'none', '' );
}

/**
 * Whether this is the direct-download build, the only one that installs anything: its plugin file carries an Update URI
 * header. The WordPress.org build has no such header (and does not ship this file at all).
 */
function mailweb_more_can_install(): bool {
	$data = get_file_data( dirname( __DIR__ ) . '/mailweb.php', array( 'uri' => 'Update URI' ) );
	return '' !== trim( (string) $data['uri'] ) && ! defined( 'KITS_NO_PLUGIN_INSTALLS' ) && (bool) apply_filters( 'mailweb_more_can_install', true );
}

add_action(
	'admin_menu',
	function () {
		if ( 'mailweb' !== 'kits' && function_exists( 'kits_more_page' ) ) {
			return; // Kits Core's page is the one page.
		}
		add_submenu_page( 'mailweb', __( 'More from Kits', 'mailweb' ), __( 'More from Kits', 'mailweb' ), 'install_plugins', 'mailweb-more', 'mailweb_more_page', 90 );
	},
	101 // After the plugin's own menu (priority 100 at the latest), so the parent exists and the first item stays the plugin's own screen.
);

add_action(
	'admin_init',
	function () {
		// A link to this plugin's copy goes to Kits Core's page when Core is active.
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- a read-only page name.
		if ( 'mailweb' !== 'kits' && function_exists( 'kits_more_page' ) && isset( $_GET['page'] ) && 'mailweb-more' === $_GET['page'] ) {
			wp_safe_redirect( admin_url( 'admin.php?page=kits-core-more' ) );
			exit;
		}
	}
);

/** The page: a card for each of the other plugins. */
function mailweb_more_page(): void {
	if ( ! current_user_can( 'install_plugins' ) ) {
		wp_die( esc_html__( 'You are not allowed to access this page.', 'mailweb' ), 403 );
	}
	$words   = array(
		'active'    => __( 'Active on this site', 'mailweb' ),
		'installed' => __( 'Installed, not active', 'mailweb' ),
		'none'      => __( 'Not installed', 'mailweb' ),
	);
	$can     = mailweb_more_can_install();
	$results = array(
		'installed' => array( 'success', __( 'Installed. It is not active yet: press Activate.', 'mailweb' ) ),
		'activated' => array( 'success', __( 'Activated.', 'mailweb' ) ),
		'failed'    => array( 'error', __( 'That did not work. Nothing was changed.', 'mailweb' ) ),
	);
	wp_register_style( 'mailweb-more', false, array(), '1' );
	wp_enqueue_style( 'mailweb-more' );
	wp_add_inline_style( 'mailweb-more', '.mailweb-more h1{font-size:28px;font-weight:700;letter-spacing:-.02em}.mailweb-more__grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:16px;margin-top:16px;max-width:1000px}.mailweb-more__card{background:#fff;border:1px solid #dcdcde;border-radius:8px;padding:16px 20px}.mailweb-more__card h2{margin:0 0 8px;font-size:18px}.mailweb-more__state{font-weight:600}.mailweb-more__acts{display:flex;gap:8px;align-items:center;flex-wrap:wrap}.mailweb-more__acts form{margin:0}' );
	echo '<div class="wrap mailweb-more"><h1>' . esc_html__( 'More from Kits', 'mailweb' ) . '</h1>';
	// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- a result word only; nothing is changed by reading it.
	$done = isset( $_GET['mailweb_more'] ) ? sanitize_key( wp_unslash( $_GET['mailweb_more'] ) ) : '';
	if ( isset( $results[ $done ] ) ) {
		wp_admin_notice(
			esc_html( $results[ $done ][1] ),
			array(
				'type'        => $results[ $done ][0],
				'dismissible' => true,
			)
		);
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- the reason is shown as text, escaped.
		if ( 'failed' === $done && isset( $_GET['mailweb_why'] ) ) {
			echo '<p class="description">' . esc_html( sanitize_text_field( wp_unslash( $_GET['mailweb_why'] ) ) ) . '</p>'; // phpcs:ignore WordPress.Security.NonceVerification.Recommended -- the reason is shown as escaped text.
		}
	}
	echo '<p class="description">' . esc_html__( 'The other Kits plugins. Each works on its own, and they work better together.', 'mailweb' ) . '</p>';
	if ( ! $can ) {
		echo '<p class="description">' . esc_html__( 'This copy of the plugin does not install other plugins. Use the links to find them.', 'mailweb' ) . '</p>';
	}
	echo '<div class="mailweb-more__grid">';
	foreach ( mailweb_more_products() as $folder => $p ) {
		list( $state, $file ) = mailweb_more_state( $folder );
		echo '<div class="mailweb-more__card"><h2>' . esc_html( $p[0] ) . '</h2><p>' . esc_html( $p[1] ) . '</p>';
		echo '<p class="mailweb-more__state">' . esc_html( $words[ $state ] ) . '</p><div class="mailweb-more__acts">';
		if ( $can && 'none' === $state ) {
			echo '<form method="post" action="' . esc_url( admin_url( 'admin-post.php' ) ) . '"><input type="hidden" name="action" value="mailweb_more_install"><input type="hidden" name="folder" value="' . esc_attr( $folder ) . '">';
			wp_nonce_field( 'mailweb_more_install_' . $folder );
			/* translators: %s: plugin name. */
			echo '<button type="submit" class="button button-primary" aria-label="' . esc_attr( sprintf( __( 'Install %s', 'mailweb' ), $p[0] ) ) . '">' . esc_html__( 'Install', 'mailweb' ) . '</button></form>';
		}
		if ( 'installed' === $state && current_user_can( 'activate_plugins' ) ) {
			echo '<form method="post" action="' . esc_url( admin_url( 'admin-post.php' ) ) . '"><input type="hidden" name="action" value="mailweb_more_activate"><input type="hidden" name="folder" value="' . esc_attr( $folder ) . '">';
			wp_nonce_field( 'mailweb_more_activate_' . $folder );
			/* translators: %s: plugin name. */
			echo '<button type="submit" class="button button-primary" aria-label="' . esc_attr( sprintf( __( 'Activate %s', 'mailweb' ), $p[0] ) ) . '">' . esc_html__( 'Activate', 'mailweb' ) . '</button></form>';
		}
		echo '<a class="button" href="' . esc_url( $p[2] ) . '" target="_blank" rel="noopener noreferrer">' . esc_html__( 'Learn more', 'mailweb' ) . '</a></div></div>';
	}
	echo '</div>';
	if ( $can ) {
		echo '<p class="description">' . esc_html__( 'Install downloads the plugin from its public release on GitHub and checks its checksum first. Nothing is downloaded until you press the button.', 'mailweb' ) . '</p>';
	}
	echo '</div>';
}

/**
 * Back to the page with a result word.
 *
 * @param string $result installed, activated or failed.
 * @param string $why    A short reason for a failure.
 */
function mailweb_more_back( string $result, string $why = '' ): void {
	$args = array( 'page' => 'mailweb-more' );

	$args['mailweb_more'] = $result;
	if ( '' !== $why ) {
		$args['mailweb_why'] = mb_substr( $why, 0, 200 );
	}
	wp_safe_redirect( add_query_arg( $args, admin_url( 'admin.php' ) ) );
	exit;
}

/**
 * The folder a form named, if it is one of the plugins on this page.
 *
 * @param string $key The nonce action prefix.
 * @param string $cap The capability needed.
 * @return string Folder.
 */
function mailweb_more_folder( string $key, string $cap ): string {
	if ( 'POST' !== strtoupper( (string) ( $_SERVER['REQUEST_METHOD'] ?? '' ) ) ) {
		wp_die( esc_html__( 'This action needs a form post.', 'mailweb' ), 405 );
	}
	if ( ! current_user_can( $cap ) ) {
		wp_die( esc_html__( 'You are not allowed to do that.', 'mailweb' ), 403 );
	}
	$folder = isset( $_POST['folder'] ) ? sanitize_key( wp_unslash( $_POST['folder'] ) ) : ''; // phpcs:ignore WordPress.Security.NonceVerification.Missing -- checked on the next line.
	check_admin_referer( $key . $folder );
	if ( ! isset( mailweb_more_products()[ $folder ] ) ) {
		wp_die( esc_html__( 'That is not one of the Kits plugins.', 'mailweb' ), 400 );
	}
	return $folder;
}

/**
 * The registry's release for a plugin folder: its package address and SHA-256, or a reason it cannot be installed.
 * Only a file attached to a release of the Kits repository is accepted.
 *
 * @param string $folder Plugin folder.
 * @return array{url:string,sha256:string}|WP_Error
 */
function mailweb_more_release( string $folder ) {
	$url = defined( 'KITS_REGISTRY_URL' ) ? (string) KITS_REGISTRY_URL : 'https://wugweb-git.github.io/Kits/registry/index.json';
	$res = wp_remote_get(
		esc_url_raw( $url ),
		array(
			'timeout'    => 10,
			'user-agent' => 'Kits-registry/1',
		)
	);
	if ( is_wp_error( $res ) || 200 !== (int) wp_remote_retrieve_response_code( $res ) ) {
		return new WP_Error( 'more_registry', __( 'The list of releases could not be reached.', 'mailweb' ) );
	}
	$json = json_decode( (string) wp_remote_retrieve_body( $res ), true );
	$p    = is_array( $json ) && isset( $json['products'][ $folder ] ) && is_array( $json['products'][ $folder ] ) ? $json['products'][ $folder ] : array();
	$pkg  = (string) ( $p['download']['commercial'] ?? '' );
	$sum  = strtolower( (string) ( $p['sha256']['commercial'] ?? '' ) );
	if ( empty( $p['released'] ) || ! empty( $p['prerelease'] ) || 'plugin' !== ( $p['type'] ?? 'plugin' ) ) {
		return new WP_Error( 'more_unreleased', __( 'There is no stable release of that plugin yet.', 'mailweb' ) );
	}
	if ( 0 !== strpos( $pkg, 'https://github.com/wugweb-git/Kits/releases/download/' ) || ! preg_match( '/^[a-f0-9]{64}$/', $sum ) ) {
		return new WP_Error( 'more_untrusted', __( 'The release is not one this plugin trusts.', 'mailweb' ) );
	}
	return array(
		'url'    => $pkg,
		'sha256' => $sum,
	);
}

/** Install: an administrator, a nonce, a release from the registry, the checksum, then WordPress's own installer. */
function mailweb_more_install(): void {
	$folder = mailweb_more_folder( 'mailweb_more_install_', 'install_plugins' );
	if ( ! mailweb_more_can_install() ) {
		mailweb_more_back( 'failed', __( 'This copy does not install plugins.', 'mailweb' ) );
	}
	if ( 'none' !== mailweb_more_state( $folder )[0] ) {
		mailweb_more_back( 'failed', __( 'It is already installed.', 'mailweb' ) );
	}
	$rel = mailweb_more_release( $folder );
	if ( is_wp_error( $rel ) ) {
		mailweb_more_back( 'failed', $rel->get_error_message() );
	}
	require_once ABSPATH . 'wp-admin/includes/file.php';
	require_once ABSPATH . 'wp-admin/includes/misc.php';
	require_once ABSPATH . 'wp-admin/includes/class-wp-upgrader.php';
	$tmp = download_url( $rel['url'], 60 );
	if ( is_wp_error( $tmp ) ) {
		mailweb_more_back( 'failed', __( 'The download failed.', 'mailweb' ) );
	}
	if ( ! hash_equals( $rel['sha256'], strtolower( (string) hash_file( 'sha256', $tmp ) ) ) ) {
		wp_delete_file( $tmp );
		mailweb_more_back( 'failed', __( 'The download did not match its checksum, so it was not installed.', 'mailweb' ) );
	}
	$upgrader = new Plugin_Upgrader( new Automatic_Upgrader_Skin() );
	$result   = $upgrader->install( $tmp );
	wp_delete_file( $tmp );
	if ( true !== $result ) {
		mailweb_more_back( 'failed', is_wp_error( $result ) ? $result->get_error_message() : __( 'WordPress could not install it.', 'mailweb' ) );
	}
	mailweb_more_back( 'installed' );
}
add_action( 'admin_post_mailweb_more_install', 'mailweb_more_install' );

/** Activate a plugin that is installed. */
function mailweb_more_activate(): void {
	$folder               = mailweb_more_folder( 'mailweb_more_activate_', 'activate_plugins' );
	list( $state, $file ) = mailweb_more_state( $folder );
	if ( 'installed' !== $state ) {
		mailweb_more_back( 'failed', __( 'It is not installed, or it is already active.', 'mailweb' ) );
	}
	$res = activate_plugin( $file );
	if ( is_wp_error( $res ) ) {
		mailweb_more_back( 'failed', $res->get_error_message() );
	}
	mailweb_more_back( 'activated' );
}
add_action( 'admin_post_mailweb_more_activate', 'mailweb_more_activate' );
