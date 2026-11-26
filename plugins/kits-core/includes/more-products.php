<?php
/**
 * Kits → More from Wugweb: one page that lists the other Wugweb plugins, says which are installed here, and links to each.
 * It is the only place the products promote each other (owner, 26 Nov 2026): no banner, no notice, no link on other screens.
 *
 * @package kits-core
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** The products: folder => name, one line, address. */
function kits_more_products(): array {
	return array(
		'directoryweb' => array( 'DirectoryWeb', 'A searchable directory of places and listings, with claims and review.', 'https://wugweb.com/plugins/directoryweb/' ),
		'rankweb'      => array( 'RankWeb', 'SEO on top of Rank Math: sitemaps, redirects, FAQ, internal links and checks.', 'https://wugweb.com/plugins/rankweb/' ),
		'insightweb'   => array( 'InsightWeb', 'Search and visitor insights from Google, in one place.', 'https://wugweb.com/plugins/insightweb/' ),
		'sourceweb'    => array( 'SourceWeb', 'Finds, checks and queues news and sources for review before anything is published.', 'https://wugweb.com/plugins/sourceweb/' ),
		'mailweb'      => array( 'MailWeb', 'Mailboxes, sending and a team inbox inside WordPress.', 'https://wugweb.com/plugins/mailweb/' ),
		'planweb'      => array( 'PlanWeb', 'A content and team calendar with reminders and a weekly digest.', 'https://wugweb.com/plugins/planweb/' ),
	);
}

/** installed, active or none, for one folder. */
function kits_more_state( string $folder ): string {
	if ( ! function_exists( 'get_plugins' ) ) {
		require_once ABSPATH . 'wp-admin/includes/plugin.php';
	}
	foreach ( array_keys( get_plugins() ) as $file ) {
		if ( dirname( (string) $file ) === $folder ) {
			return is_plugin_active( $file ) ? 'active' : 'installed';
		}
	}
	return 'none';
}

add_action(
	'admin_menu',
	function () {
		add_submenu_page( KITS_MENU, __( 'More from Wugweb', 'kits-core' ), __( 'More from Wugweb', 'kits-core' ), 'install_plugins', 'kits-more', 'kits_more_page' );
	},
	30
);

/** The page. */
function kits_more_page(): void {
	$words = array(
		'active'    => __( 'Active on this site', 'kits-core' ),
		'installed' => __( 'Installed, not active', 'kits-core' ),
		'none'      => __( 'Not installed', 'kits-core' ),
	);
	echo '<div class="wrap kits-more"><h1>' . esc_html__( 'More from Wugweb', 'kits-core' ) . '</h1>';
	echo '<p class="description">' . esc_html__( 'The other Wugweb plugins. Each works on its own and they work better together.', 'kits-core' ) . '</p><div class="kits-more__grid">';
	foreach ( kits_more_products() as $folder => $p ) {
		$state = kits_more_state( $folder );
		echo '<div class="kits-more__card"><h2>' . esc_html( $p[0] ) . '</h2><p>' . esc_html( $p[1] ) . '</p>';
		echo '<p class="kits-more__state kits-more__state--' . esc_attr( $state ) . '">' . esc_html( $words[ $state ] ) . '</p>';
		echo '<a class="button' . ( 'none' === $state ? ' button-primary' : '' ) . '" href="' . esc_url( $p[2] ) . '" target="_blank" rel="noopener noreferrer">' . esc_html__( 'Learn more', 'kits-core' ) . '</a></div>';
	}
	echo '</div></div>';
	echo '<style>.kits-more h1{font-size:28px;font-weight:700;letter-spacing:-.02em;color:#0a0a0a}.kits-more__grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:16px;margin-top:16px;max-width:1000px}.kits-more__card{background:#fff;border:1px solid #e6e6e6;border-radius:14px;padding:20px;display:flex;flex-direction:column;gap:6px}.kits-more__card h2{margin:0;font-size:18px;color:#0a0a0a}.kits-more__card p{margin:0;color:#6b6b6b}.kits-more__state{font-size:12px;font-weight:600;color:#0a0a0a!important}.kits-more__state--none{color:#6b6b6b!important}.kits-more__card .button{align-self:flex-start;margin-top:8px;border-radius:8px}.kits-more__card .button-primary{background:#0a0a0a;border-color:#0a0a0a}</style>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- fixed text.
}
