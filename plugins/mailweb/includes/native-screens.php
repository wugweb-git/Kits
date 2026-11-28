<?php
/**
 * MailWeb's screens drawn by WordPress itself, for a site without Kits Core (or without Kits Core's build): the
 * Dashboard (the status table), the Inbox list (folders, search, paging, open a message) and Settings (Mail API token,
 * mailboxes, default From, aliases, and a link to Site sending). Core markup, nonces, capability checks and escaping
 * only. With Kits Core the shell screens (mailweb-ui.php) are used instead.
 *
 * What the plain screens do not have: bulk actions in the list (open a message to archive, move or delete it),
 * the Profiles editor (names, signatures, pictures) and the FluentCRM feed switches; those need Kits Core.
 *
 * @package mailweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * The top of a plain screen: wrap, title, the three screens as tabs and a short notice.
 *
 * @param string $title   Screen title.
 * @param string $current dashboard, inbox or settings.
 */
function mailweb_native_open( string $title, string $current ): void {
	echo '<div class="wrap" id="mailweb-native"><h1 class="wp-heading-inline">' . esc_html( $title ) . '</h1><hr class="wp-header-end">';
	$tabs = array(
		'dashboard' => __( 'Dashboard', 'mailweb' ),
		'inbox'     => __( 'Inbox', 'mailweb' ),
	);
	if ( current_user_can( 'manage_options' ) ) {
		$tabs['settings'] = __( 'Settings', 'mailweb' );
	}
	echo '<nav class="nav-tab-wrapper mailweb-native-nav" aria-label="' . esc_attr__( 'MailWeb screens', 'mailweb' ) . '">';
	foreach ( $tabs as $slug => $label ) {
		echo '<a class="nav-tab' . ( $slug === $current ? ' nav-tab-active' : '' ) . '" href="' . esc_url( mailweb_ui_url( $slug ) ) . '"' . ( $slug === $current ? ' aria-current="page"' : '' ) . '>' . esc_html( $label ) . '</a>';
	}
	echo '</nav>';
	wp_admin_notice(
		esc_html__( 'Kits Core is not active, so this is the plain version of the screen. Everything on it works; Kits Core adds the richer layout, bulk actions in the Inbox and the Profiles editor.', 'mailweb' ),
		array( 'type' => 'info', 'additional_classes' => array( 'inline' ) )
	);
}

/** The Dashboard without Kits Core: the status table (no mailbox call is made). */
function mailweb_native_dashboard(): void {
	mailweb_native_open( __( 'MailWeb', 'mailweb' ), 'dashboard' );
	$other = function_exists( 'mailweb_external_smtp_plugin' ) ? mailweb_external_smtp_plugin() : '';
	if ( function_exists( 'mailweb_defer_to_external_smtp' ) && mailweb_defer_to_external_smtp() ) {
		wp_admin_notice(
			esc_html(
				'' !== $other
					/* translators: %s: name of the other SMTP plugin. */
					? sprintf( __( '%s sends this site\'s email, so MailWeb is not changing the From address, limiting or queuing it.', 'mailweb' ), $other )
					: __( 'Another plugin sends this site\'s email, so MailWeb is not changing the From address, limiting or queuing it.', 'mailweb' )
			),
			array( 'type' => 'info', 'additional_classes' => array( 'inline' ) )
		);
	}
	if ( function_exists( 'mailweb_home_body' ) ) {
		mailweb_home_body();
	}
	echo '</div>';
}

/** The URL of one list view. */
function mailweb_native_list_url( array $args = array() ): string {
	return add_query_arg( array_merge( array( 'page' => 'mailweb' ), $args ), admin_url( 'admin.php' ) );
}

/**
 * The Inbox list without Kits Core: folder links, mailbox choice, search, the page of messages and paging.
 *
 * @param array $s The state (mailweb_state()).
 */
function mailweb_native_inbox( array $s ): void {
	mailweb_native_open( __( 'MailWeb inbox', 'mailweb' ), 'inbox' );
	$boxes = mailweb_all_boxes();
	if ( ! $boxes ) {
		wp_admin_notice( esc_html__( 'No mailbox yet. An administrator saves the Mail API token in MailWeb → Settings.', 'mailweb' ), array( 'type' => 'warning', 'additional_classes' => array( 'inline' ) ) );
		echo '</div>';
		return;
	}
	if ( function_exists( 'mailweb_notice' ) ) {
		mailweb_notice();
	}
	$keep = array( 'box' => $s['box'], 'folder' => $s['folder'] );
	echo '<p><a class="button button-primary" href="' . esc_url( mailweb_native_list_url( array( 'compose' => 'new' ) ) ) . '">' . esc_html__( 'New message', 'mailweb' ) . '</a></p>';
	$links = array();
	foreach ( mailweb_roles() as $role => $r ) {
		$links[] = array( mailweb_native_list_url( array( 'box' => $s['box'], 'folder' => $role ) ), $r[0], $role === $s['folder'] );
	}
	if ( mailweb_forms() ) {
		$links[] = array( mailweb_native_list_url( array( 'folder' => MAILWEB_FORMS ) ), (string) mailweb_forms()['label'], MAILWEB_FORMS === $s['folder'] );
	}
	echo '<ul class="subsubsub">';
	foreach ( $links as $i => $l ) {
		echo '<li><a href="' . esc_url( $l[0] ) . '"' . ( $l[2] ? ' class="current" aria-current="page"' : '' ) . '>' . esc_html( $l[1] ) . '</a>' . ( $i < count( $links ) - 1 ? ' |' : '' ) . '</li>';
	}
	echo '</ul><div class="clear"></div>';

	echo '<form method="get" action="' . esc_url( admin_url( 'admin.php' ) ) . '"><input type="hidden" name="page" value="mailweb"><input type="hidden" name="folder" value="' . esc_attr( $s['folder'] ) . '">';
	echo '<p class="search-box"><label for="mailweb-box" class="screen-reader-text">' . esc_html__( 'Mailbox', 'mailweb' ) . '</label><select id="mailweb-box" name="box"><option value="all"' . selected( 'all', $s['box'], false ) . '>' . esc_html__( 'All mailboxes', 'mailweb' ) . '</option>';
	foreach ( $boxes as $k => $addr ) {
		echo '<option value="' . esc_attr( $k ) . '"' . selected( $k, $s['box'], false ) . '>' . esc_html( $addr ) . '</option>';
	}
	echo '</select> <label for="mailweb-q" class="screen-reader-text">' . esc_html__( 'Search messages', 'mailweb' ) . '</label><input type="search" id="mailweb-q" name="s" value="' . esc_attr( $s['q'] ) . '"> <button type="submit" class="button">' . esc_html__( 'Search', 'mailweb' ) . '</button></p></form>';

	$res = mailweb_list_rows( $s );
	if ( ! empty( $res['failed'] ) ) {
		wp_admin_notice( esc_html__( 'The Mail API could not be reached (token missing, not scoped to this mailbox, or the service is down).', 'mailweb' ), array( 'type' => 'error', 'additional_classes' => array( 'inline' ) ) );
	}
	$cells = array();
	foreach ( (array) $res['items'] as $m ) {
		$args = isset( $m['uid'] )
			? array( 'box' => $m['box'], 'folder' => $s['folder'], 'uid' => (int) $m['uid'], 'view' => $s['box'] )
			: array( 'folder' => MAILWEB_FORMS, 'item' => (int) $m['item'] );
		$subj = '' !== $m['subject'] ? $m['subject'] : __( '(no subject)', 'mailweb' );
		$t    = (int) ( $m['ts'] ?? 0 );
		$cells[] = array(
			'from'    => ! empty( $m['unseen'] ) ? '<strong>' . esc_html( $m['from'] ) . '</strong>' : esc_html( $m['from'] ),
			'subject' => '<a href="' . esc_url( mailweb_native_list_url( $args ) ) . '">' . esc_html( $subj ) . '</a>' . ( ! empty( $m['unseen'] ) ? ' <span class="screen-reader-text">' . esc_html__( '(unread)', 'mailweb' ) . '</span>' : '' ),
			'status'  => esc_html( mailweb_row_status_label( mailweb_row_status( $m ) ) ),
			'date'    => $t ? esc_html( wp_date( 'j M Y H:i', $t ) ) : '–',
		);
	}
	$total = (int) $res['total'];
	mailweb_simple_table(
		'mailweb-native-list',
		array( 'from' => 'sent' === $s['folder'] ? __( 'To', 'mailweb' ) : __( 'From', 'mailweb' ), 'subject' => __( 'Subject', 'mailweb' ), 'status' => __( 'Status', 'mailweb' ), 'date' => __( 'Date', 'mailweb' ) ),
		$cells,
		array( 'primary' => 'subject', 'foot' => false, 'empty' => __( 'No messages here.', 'mailweb' ) )
	);
	$pages = (int) ceil( $total / MAILWEB_PER_PAGE );
	if ( $pages > 1 ) {
		echo '<div class="tablenav"><div class="tablenav-pages">' . wp_kses_post(
			paginate_links(
				array(
					'base'      => add_query_arg( array_merge( $keep, array( 'page' => 'mailweb', 's' => $s['q'], 'paged' => '%#%' ) ), admin_url( 'admin.php' ) ),
					'format'    => '',
					'current'   => (int) $s['page'],
					'total'     => $pages,
					'prev_text' => '&lsaquo;',
					'next_text' => '&rsaquo;',
				)
			)
		) . '</div></div>';
	}
	echo '</div>';
}

/** The fields of the plain Settings screen: the saved state, never a secret. */
function mailweb_native_settings(): void {
	mailweb_native_open( __( 'MailWeb settings', 'mailweb' ), 'settings' );
	$note = sanitize_key( wp_unslash( $_GET['mailweb_saved'] ?? '' ) ); // phpcs:ignore WordPress.Security.NonceVerification.Recommended -- a notice after the nonced save
	if ( '1' === $note ) {
		wp_admin_notice( esc_html__( 'Saved.', 'mailweb' ), array( 'type' => 'success', 'dismissible' => true ) );
	}
	$boxes    = mailweb_all_boxes();
	$set      = mailweb_box_settings();
	$fixed    = mailweb_setting_fixed( 'api_token' );
	$has      = '' !== mailweb_setting( 'api_token' );
	$default  = (string) get_option( 'mailweb_default_from', '' );
	echo '<form method="post" class="mailweb-native-form" action="' . esc_url( admin_url( 'admin-post.php' ) ) . '">';
	wp_nonce_field( 'mailweb_native_settings' );
	echo '<input type="hidden" name="action" value="mailweb_native_settings"><table class="form-table" role="presentation"><tbody>';
	echo '<tr><th scope="row"><label for="mailweb-token">' . esc_html__( 'Mail API token', 'mailweb' ) . '</label></th><td>';
	if ( $fixed ) {
		echo '<p>' . esc_html__( 'Set in wp-config.php or the server environment (MAILWEB_API_TOKEN).', 'mailweb' ) . '</p>';
	} else {
		echo '<input type="password" id="mailweb-token" name="api_token" class="regular-text" value="" autocomplete="new-password" placeholder="' . esc_attr( $has ? __( 'Saved (leave empty to keep it)', 'mailweb' ) : '' ) . '">';
		echo '<p class="description">' . esc_html__( 'Create it in hPanel for the domain\'s mailboxes. It is stored encrypted and never shown again.', 'mailweb' ) . '</p>';
	}
	echo '</td></tr>';
	if ( $boxes ) {
		echo '<tr><th scope="row">' . esc_html__( 'Send from these mailboxes', 'mailweb' ) . '</th><td><fieldset>';
		foreach ( $boxes as $k => $addr ) {
			$on = ! isset( $set[ $k ]['send'] ) || $set[ $k ]['send'];
			echo '<label><input type="checkbox" name="send[' . esc_attr( $k ) . ']" value="1"' . checked( $on, true, false ) . '> ' . esc_html( $addr ) . '</label><br>';
		}
		echo '</fieldset></td></tr>';
		echo '<tr><th scope="row"><label for="mailweb-default-from">' . esc_html__( 'Default From', 'mailweb' ) . '</label></th><td><select id="mailweb-default-from" name="default_from"><option value="">' . esc_html__( 'First mailbox that may send', 'mailweb' ) . '</option>';
		foreach ( $boxes as $k => $addr ) {
			echo '<option value="' . esc_attr( $k ) . '"' . selected( $k, $default, false ) . '>' . esc_html( $addr ) . '</option>';
		}
		echo '</select></td></tr>';
	}
	echo '<tr><th scope="row"><label for="mailweb-aliases">' . esc_html__( 'Aliases', 'mailweb' ) . '</label></th><td><textarea id="mailweb-aliases" name="aliases" rows="4" class="large-text code">' . esc_textarea( mailweb_aliases_text( mailweb_aliases() ) ) . '</textarea><p class="description">' . esc_html__( 'One per line: alias@example.com = mailbox@example.com. A copy of hPanel; aliases cannot be sent from.', 'mailweb' ) . '</p></td></tr>';
	echo '</tbody></table><p><button type="submit" class="button button-primary">' . esc_html__( 'Save', 'mailweb' ) . '</button></p></form>';
	echo '<p>' . esc_html__( 'Sending (SMTP, the From address, the daily limit, what is logged and for how long) is on its own screen:', 'mailweb' ) . ' <a href="' . esc_url( mailweb_settings_url( 'sending' ) ) . '">' . esc_html__( 'Site sending', 'mailweb' ) . '</a>.</p>';
	echo '</div>';
}

/** Save the plain Settings form. Only what the form shows: the token (when typed), the mailboxes, default From, aliases. */
add_action(
	'admin_post_mailweb_native_settings',
	function () {
		if ( ! current_user_can( 'manage_options' ) || ! check_admin_referer( 'mailweb_native_settings' ) ) {
			wp_die( esc_html__( 'Not allowed.', 'mailweb' ), 403 );
		}
		$token = isset( $_POST['api_token'] ) ? trim( sanitize_text_field( wp_unslash( $_POST['api_token'] ) ) ) : '';
		if ( '' !== $token && ! mailweb_setting_fixed( 'api_token' ) ) {
			mailweb_save_setting( 'api_token', $token );
			delete_transient( 'mailweb_box_ids_wait' );
			if ( function_exists( 'mailweb_box_ids' ) ) {
				mailweb_box_ids( true );
			}
		}
		$keys = array_keys( mailweb_all_boxes() );
		if ( $keys ) {
			$send = array();
			foreach ( (array) ( $_POST['send'] ?? array() ) as $k => $v ) { // phpcs:ignore WordPress.Security.ValidatedSanitizedInput -- keys are matched against the known mailboxes below
				$send[ sanitize_key( (string) $k ) ] = 1;
			}
			update_option( 'mailweb_mailboxes', mailweb_mailboxes_clean( $send, $keys ), false );
			$from = sanitize_key( wp_unslash( $_POST['default_from'] ?? '' ) );
			update_option( 'mailweb_default_from', in_array( $from, $keys, true ) ? $from : '', false );
		}
		update_option( 'mailweb_aliases', mailweb_aliases_clean( sanitize_textarea_field( wp_unslash( $_POST['aliases'] ?? '' ) ) ), false );
		wp_safe_redirect( add_query_arg( array( 'page' => 'mailweb-settings', 'mailweb_saved' => 1 ), admin_url( 'admin.php' ) ) );
		exit;
	}
);
