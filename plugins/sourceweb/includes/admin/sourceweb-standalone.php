<?php
/**
 * SourceWeb without Kits Core: two small native screens, Sources (the list of feeds) and AI models (the keys), in core
 * WordPress admin markup. Each form posts to admin-post.php with a nonce and a capability check (manage_options, the
 * same as the screens on the Kits shell). Nothing here fetches anything: SourceWeb does not read feeds inside WordPress.
 * The external workers read the lists saved here and push the items to the ingest routes.
 *
 * @package sourceweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** The kinds and types the small form offers (the workers know more; those stay as stored). */
function sourceweb_standalone_source_types(): array {
	return array(
		'news'     => __( 'News', 'sourceweb' ),
		'legal'    => __( 'Legal', 'sourceweb' ),
		'research' => __( 'Research', 'sourceweb' ),
	);
}

/**
 * Where a standalone form goes back to, with a notice code.
 *
 * @param string $tab    Tab to return to.
 * @param string $notice Notice code.
 */
function sourceweb_standalone_back( string $tab, string $notice ): void {
	wp_safe_redirect( add_query_arg( 'sw_notice', rawurlencode( $notice ), admin_url( sourceweb_src_tab_path( $tab ) ) ) );
	exit;
}

/** The notice a form left, as one line. */
function sourceweb_standalone_notice(): void {
	$code  = isset( $_GET['sw_notice'] ) ? sanitize_key( wp_unslash( $_GET['sw_notice'] ) ) : ''; // phpcs:ignore WordPress.Security.NonceVerification.Recommended -- a message code only; nothing is saved.
	$texts = array(
		'source_added'   => array( 'success', __( 'Source added. The workers read it from their next run.', 'sourceweb' ) ),
		'source_bad'     => array( 'error', __( 'A source needs a name and a web address (http or https).', 'sourceweb' ) ),
		'source_dupe'    => array( 'warning', __( 'That web address is already in the list.', 'sourceweb' ) ),
		'source_removed' => array( 'success', __( 'Source removed.', 'sourceweb' ) ),
		'source_toggled' => array( 'success', __( 'Source updated.', 'sourceweb' ) ),
		'key_added'      => array( 'success', __( 'Key saved. It is checked in the background.', 'sourceweb' ) ),
		'key_none'       => array( 'warning', __( 'No new key was saved (empty, or already in the list).', 'sourceweb' ) ),
		'key_removed'    => array( 'success', __( 'Key removed.', 'sourceweb' ) ),
	);
	if ( isset( $texts[ $code ] ) ) {
		wp_admin_notice( esc_html( $texts[ $code ][1] ), array( 'type' => $texts[ $code ][0] ) );
	}
}

/** Sources: the list, with add, switch on or off, and remove. */
function sourceweb_standalone_sources_screen(): void {
	sourceweb_standalone_notice();
	$cfg     = function_exists( 'sourceweb_sources_config' ) ? sourceweb_sources_config() : array();
	$sources = array_values( array_filter( (array) ( $cfg['sources'] ?? array() ), 'is_array' ) );
	$types   = sourceweb_standalone_source_types();

	echo '<p>' . esc_html__( 'These are the feeds your workers read. WordPress does not fetch them: an external worker reads this list and sends each item to this site (SourceWeb → Workers).', 'sourceweb' ) . '</p>';
	echo '<table class="widefat striped"><thead><tr>';
	foreach ( array( __( 'Name', 'sourceweb' ), __( 'Type', 'sourceweb' ), __( 'Address', 'sourceweb' ), __( 'Status', 'sourceweb' ), __( 'Actions', 'sourceweb' ) ) as $h ) {
		echo '<th scope="col">' . esc_html( $h ) . '</th>';
	}
	echo '</tr></thead><tbody>';
	if ( ! $sources ) {
		echo '<tr><td colspan="5">' . esc_html__( 'No sources yet. Add one below.', 'sourceweb' ) . '</td></tr>';
	}
	foreach ( $sources as $s ) {
		$id = (string) ( $s['id'] ?? '' );
		echo '<tr><td>' . esc_html( (string) ( $s['name'] ?? $id ) ) . '</td>';
		echo '<td>' . esc_html( (string) ( $s['type'] ?? '' ) ) . '</td>';
		echo '<td>' . ( ! empty( $s['url'] ) ? '<a href="' . esc_url( (string) $s['url'] ) . '" target="_blank" rel="noopener noreferrer">' . esc_html( (string) $s['url'] ) . '</a>' : '–' ) . '</td>';
		echo '<td>' . esc_html( ! empty( $s['on'] ) ? __( 'On', 'sourceweb' ) : __( 'Off', 'sourceweb' ) ) . '</td><td>';
		foreach ( array( 'toggle' => ! empty( $s['on'] ) ? __( 'Turn off', 'sourceweb' ) : __( 'Turn on', 'sourceweb' ), 'remove' => __( 'Remove', 'sourceweb' ) ) as $op => $label ) {
			echo '<form method="post" action="' . esc_url( admin_url( 'admin-post.php' ) ) . '">';
			echo '<input type="hidden" name="action" value="sourceweb_sa_source_op"><input type="hidden" name="op" value="' . esc_attr( $op ) . '"><input type="hidden" name="id" value="' . esc_attr( $id ) . '">';
			wp_nonce_field( 'sourceweb_sa_source_op' );
			echo '<button type="submit" class="button button-small' . ( 'remove' === $op ? ' button-link-delete' : '' ) . '">' . esc_html( $label ) . '</button></form> ';
		}
		echo '</td></tr>';
	}
	echo '</tbody></table>';

	echo '<h2>' . esc_html__( 'Add a source', 'sourceweb' ) . '</h2>';
	echo '<form method="post" action="' . esc_url( admin_url( 'admin-post.php' ) ) . '">';
	echo '<input type="hidden" name="action" value="sourceweb_sa_source_add">';
	wp_nonce_field( 'sourceweb_sa_source_add' );
	echo '<table class="form-table" role="presentation"><tbody>';
	echo '<tr><th scope="row"><label for="sw_src_name">' . esc_html__( 'Name', 'sourceweb' ) . '</label></th><td><input type="text" id="sw_src_name" name="name" class="regular-text" required></td></tr>';
	echo '<tr><th scope="row"><label for="sw_src_url">' . esc_html__( 'Feed address', 'sourceweb' ) . '</label></th><td><input type="url" id="sw_src_url" name="url" class="regular-text code" placeholder="https://example.com/feed" required></td></tr>';
	echo '<tr><th scope="row"><label for="sw_src_type">' . esc_html__( 'Type', 'sourceweb' ) . '</label></th><td><select id="sw_src_type" name="type">';
	foreach ( $types as $v => $l ) {
		echo '<option value="' . esc_attr( $v ) . '">' . esc_html( $l ) . '</option>';
	}
	echo '</select></td></tr></tbody></table>';
	submit_button( __( 'Add source', 'sourceweb' ) );
	echo '</form>';
}

/** AI models: the saved keys (never more than their last 4 characters), add, remove. */
function sourceweb_standalone_ai_screen(): void {
	sourceweb_standalone_notice();
	$rows = function_exists( 'sourceweb_ai_key_records' ) ? sourceweb_ai_key_records() : array();
	echo '<p>' . esc_html__( 'Keys for the AI services your workers use to check relevance and write summaries. A key is sent to the provider it belongs to and to your workers when they ask for it; it is shown here only as its last four characters. Stored in the WordPress database as saved (not encrypted).', 'sourceweb' ) . '</p>';
	echo '<table class="widefat striped"><thead><tr>';
	foreach ( array( __( 'Key', 'sourceweb' ), __( 'Provider', 'sourceweb' ), __( 'Status', 'sourceweb' ), __( 'Actions', 'sourceweb' ) ) as $h ) {
		echo '<th scope="col">' . esc_html( $h ) . '</th>';
	}
	echo '</tr></thead><tbody>';
	$any = false;
	foreach ( $rows as $r ) {
		if ( ! empty( $r['secret'] ) ) {
			continue; // a key only the workers hold (GitHub secrets): not editable here
		}
		$any   = true;
		$prov  = (string) $r['provider'];
		$label = '' !== $prov ? ( defined( 'AW_AI_PROVIDERS' ) && isset( AW_AI_PROVIDERS[ $prov ] ) ? AW_AI_PROVIDERS[ $prov ][0] : $prov ) : __( 'Not known yet', 'sourceweb' );
		echo '<tr><td><code>…' . esc_html( (string) $r['last4'] ) . '</code></td><td>' . esc_html( $label ) . '</td><td>' . esc_html( (string) $r['status'] ) . '</td><td>';
		echo '<form method="post" action="' . esc_url( admin_url( 'admin-post.php' ) ) . '">';
		echo '<input type="hidden" name="action" value="sourceweb_sa_key_remove"><input type="hidden" name="id" value="' . esc_attr( (string) $r['id'] ) . '">';
		wp_nonce_field( 'sourceweb_sa_key_remove' );
		echo '<button type="submit" class="button button-small button-link-delete">' . esc_html__( 'Remove', 'sourceweb' ) . '</button></form></td></tr>';
	}
	if ( ! $any ) {
		echo '<tr><td colspan="4">' . esc_html__( 'No keys saved yet.', 'sourceweb' ) . '</td></tr>';
	}
	echo '</tbody></table>';

	echo '<h2>' . esc_html__( 'Add a key', 'sourceweb' ) . '</h2>';
	echo '<form method="post" action="' . esc_url( admin_url( 'admin-post.php' ) ) . '">';
	echo '<input type="hidden" name="action" value="sourceweb_sa_key_add">';
	wp_nonce_field( 'sourceweb_sa_key_add' );
	echo '<p><label for="sw_ai_keys">' . esc_html__( 'Paste one key, or several separated by spaces or new lines', 'sourceweb' ) . '</label><br>';
	echo '<textarea id="sw_ai_keys" name="keys" rows="3" class="large-text code" autocomplete="off" spellcheck="false"></textarea></p>';
	submit_button( __( 'Save keys', 'sourceweb' ) );
	echo '</form>';
}

// Add a source.
add_action(
	'admin_post_sourceweb_sa_source_add',
	function () {
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( esc_html__( 'Sorry, you are not allowed to do that.', 'sourceweb' ), 403 );
		}
		check_admin_referer( 'sourceweb_sa_source_add' );
		$name  = isset( $_POST['name'] ) ? sanitize_text_field( wp_unslash( $_POST['name'] ) ) : '';
		$url   = isset( $_POST['url'] ) ? esc_url_raw( trim( wp_unslash( $_POST['url'] ) ), array( 'http', 'https' ) ) : ''; // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- esc_url_raw() cleans it; trimmed first so a trailing space does not become %20
		$type  = isset( $_POST['type'] ) ? sanitize_key( wp_unslash( $_POST['type'] ) ) : 'news';
		$type  = isset( sourceweb_standalone_source_types()[ $type ] ) ? $type : 'news';
		$cfg   = (array) sourceweb_sources_config();
		$list  = array_values( (array) ( $cfg['sources'] ?? array() ) );
		if ( '' === $name || '' === $url ) {
			sourceweb_standalone_back( 'sources', 'source_bad' );
		}
		if ( in_array( $url, array_column( $list, 'url' ), true ) ) {
			sourceweb_standalone_back( 'sources', 'source_dupe' );
		}
		$id = sanitize_key( sanitize_title( $name ) );
		$id = '' === $id ? 'source-' . substr( md5( $url ), 0, 8 ) : $id;
		while ( in_array( $id, array_column( $list, 'id' ), true ) ) {
			$id .= '-' . substr( md5( $url . $id ), 0, 4 );
		}
		$list[]          = array( 'id' => $id, 'name' => $name, 'kind' => 'rss', 'type' => $type, 'url' => $url, 'on' => true, 'filter' => false );
		$cfg['sources']  = $list;
		update_option( 'aw_sources', $cfg, false );
		sourceweb_src_log( 'sources', 'added source ' . $name );
		sourceweb_standalone_back( 'sources', 'source_added' );
	}
);

// Switch a source on or off, or remove it.
add_action(
	'admin_post_sourceweb_sa_source_op',
	function () {
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( esc_html__( 'Sorry, you are not allowed to do that.', 'sourceweb' ), 403 );
		}
		check_admin_referer( 'sourceweb_sa_source_op' );
		$id  = isset( $_POST['id'] ) ? sanitize_key( wp_unslash( $_POST['id'] ) ) : '';
		$op  = isset( $_POST['op'] ) ? sanitize_key( wp_unslash( $_POST['op'] ) ) : '';
		$cfg = (array) sourceweb_sources_config();
		$out = array();
		$did = '';
		foreach ( array_values( (array) ( $cfg['sources'] ?? array() ) ) as $s ) {
			if ( is_array( $s ) && (string) ( $s['id'] ?? '' ) === $id && '' !== $id ) {
				if ( 'remove' === $op ) {
					$did = 'removed source ' . (string) ( $s['name'] ?? $id );
					continue;
				}
				if ( 'toggle' === $op ) {
					$s['on'] = empty( $s['on'] );
					$did     = ( $s['on'] ? 'turned on source ' : 'turned off source ' ) . (string) ( $s['name'] ?? $id );
				}
			}
			$out[] = $s;
		}
		if ( '' !== $did ) {
			$cfg['sources'] = $out;
			update_option( 'aw_sources', $cfg, false );
			sourceweb_src_log( 'sources', $did );
		}
		sourceweb_standalone_back( 'sources', 'remove' === $op ? 'source_removed' : 'source_toggled' );
	}
);

// Add keys.
add_action(
	'admin_post_sourceweb_sa_key_add',
	function () {
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( esc_html__( 'Sorry, you are not allowed to do that.', 'sourceweb' ), 403 );
		}
		check_admin_referer( 'sourceweb_sa_key_add' );
		$pasted = isset( $_POST['keys'] ) ? sanitize_textarea_field( wp_unslash( $_POST['keys'] ) ) : '';
		$res    = function_exists( 'sourceweb_ai_keys_add' ) ? sourceweb_ai_keys_add( $pasted, '', array() ) : array( 'added' => array() );
		sourceweb_standalone_back( 'ai', ! empty( $res['added'] ) ? 'key_added' : 'key_none' );
	}
);

// Remove a key.
add_action(
	'admin_post_sourceweb_sa_key_remove',
	function () {
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( esc_html__( 'Sorry, you are not allowed to do that.', 'sourceweb' ), 403 );
		}
		check_admin_referer( 'sourceweb_sa_key_remove' );
		$id = isset( $_POST['id'] ) ? sanitize_key( wp_unslash( $_POST['id'] ) ) : '';
		if ( '' !== $id && function_exists( 'sourceweb_ai_keys_list_op' ) ) {
			sourceweb_ai_keys_list_op( 'remove', array( $id ) );
		}
		sourceweb_standalone_back( 'ai', 'key_removed' );
	}
);
