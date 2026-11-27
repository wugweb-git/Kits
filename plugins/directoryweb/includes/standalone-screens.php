<?php
/**
 * Plain WordPress admin screens for the places where DirectoryWeb's React screens need Kits Core's shell: Listing Types,
 * Schema & Fields, Form Integrations, Import / Export and the Claims list.
 *
 * They use core markup only (tables, forms, notices), the same functions the React screens call through REST
 * (schema.php, csv.php, integrations-model.php, directoryweb-shape.php), and every save is a POST through admin-post.php
 * with a nonce and a capability check (manage_options; Claims: manage_directoryweb). No script, no style tag.
 *
 * Not built here: the interactive filtering of the Claims list (it shows the status tabs and 20 rows a page), and a drag
 * and drop file box for imports (a file input and a text box).
 *
 * @package directoryweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** The screens drawn here, by screen name. */
function directoryweb_native_screens(): array {
	return array(
		'types'    => __( 'Listing Types', 'directoryweb' ),
		'schema'   => __( 'Schema & Fields', 'directoryweb' ),
		'forms'    => __( 'Form Integrations', 'directoryweb' ),
		'transfer' => __( 'Import / Export', 'directoryweb' ),
	);
}

/**
 * Draws one of the four settings screens.
 *
 * @param string $screen types, schema, forms or transfer.
 */
function directoryweb_native_screen( string $screen ): void {
	$titles = directoryweb_native_screens();
	if ( ! isset( $titles[ $screen ] ) ) {
		return;
	}
	if ( ! current_user_can( 'manage_options' ) ) {
		wp_die( esc_html__( 'You are not allowed to do this.', 'directoryweb' ), 403 );
	}
	echo '<div class="wrap"><h1>' . esc_html( $titles[ $screen ] ) . '</h1>';
	directoryweb_native_flash( $screen );
	switch ( $screen ) {
		case 'types':
			directoryweb_native_types_form();
			break;
		case 'schema':
			directoryweb_native_schema_form();
			break;
		case 'forms':
			directoryweb_native_forms_form();
			break;
		default:
			directoryweb_native_transfer();
	}
	echo '</div>';
}

/** The notice after a save, and the report of an import, shown once. */
function directoryweb_native_flash( string $screen ): void {
	$done = sanitize_key( wp_unslash( $_GET['dw_done'] ?? '' ) ); // phpcs:ignore WordPress.Security.NonceVerification.Recommended -- which notice to show; nothing is saved here
	$key  = 'directoryweb_native_flash_' . get_current_user_id();
	$flash = get_transient( $key );
	if ( '' === $done || ! is_array( $flash ) || ( $flash['screen'] ?? '' ) !== $screen ) {
		return;
	}
	delete_transient( $key );
	wp_admin_notice( esc_html( (string) ( $flash['message'] ?? '' ) ), array( 'type' => 'error' === ( $flash['tone'] ?? '' ) ? 'error' : 'success', 'dismissible' => true ) );
	if ( ! empty( $flash['report'] ) ) {
		directoryweb_native_report( (array) $flash['report'] );
	}
}

/**
 * Keeps a message (and an import report) for the next page load, then goes back to the screen.
 *
 * @param string $screen  Screen.
 * @param string $tone    success or error.
 * @param string $message Plain text.
 * @param array  $report  Optional import report.
 */
function directoryweb_native_back( string $screen, string $tone, string $message, array $report = array() ): void {
	set_transient(
		'directoryweb_native_flash_' . get_current_user_id(),
		array(
			'screen'  => $screen,
			'tone'    => $tone,
			'message' => $message,
			'report'  => $report,
		),
		5 * MINUTE_IN_SECONDS
	);
	wp_safe_redirect( add_query_arg( 'dw_done', 'error' === $tone ? 'error' : 'saved', directoryweb_ui_url( $screen ) ) );
	exit;
}

/** The hidden fields every form here carries. */
function directoryweb_native_form_open( string $screen, string $op = '', string $enctype = '' ): void {
	echo '<form method="post" action="' . esc_url( admin_url( 'admin-post.php' ) ) . '"' . ( '' !== $enctype ? ' enctype="' . esc_attr( $enctype ) . '"' : '' ) . '>';
	echo '<input type="hidden" name="action" value="directoryweb_native_save">';
	echo '<input type="hidden" name="dw_screen" value="' . esc_attr( $screen ) . '">';
	echo '<input type="hidden" name="dw_op" value="' . esc_attr( $op ) . '">';
	wp_nonce_field( 'directoryweb_native_save_' . $screen );
}

/** The posted array called $name, unslashed (values are sanitised one by one where they are used). */
function directoryweb_native_post_rows( string $name ): array {
	// phpcs:ignore WordPress.Security.NonceVerification.Missing, WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- the nonce is checked in directoryweb_native_save(); every value is sanitised where it is read.
	$rows = isset( $_POST[ $name ] ) && is_array( $_POST[ $name ] ) ? wp_unslash( $_POST[ $name ] ) : array();
	return array_values( array_filter( $rows, 'is_array' ) );
}

/** A comma or line separated list as trimmed, sanitised items. */
function directoryweb_native_list( $text ): array {
	$out = array();
	foreach ( preg_split( '/[,\r\n]+/', (string) $text ) as $item ) {
		$item = sanitize_text_field( $item );
		if ( '' !== $item ) {
			$out[] = $item;
		}
	}
	return $out;
}

/* ---------- Schema & Fields ---------- */

function directoryweb_native_schema_form(): void {
	$fields = array_values( directoryweb_schema_fields() );
	for ( $i = 0; $i < 3; $i++ ) {
		$fields[] = array(
			'key'      => '',
			'label'    => '',
			'type'     => 'text',
			'required' => false,
			'help'     => '',
			'options'  => array(),
			'min'      => null,
			'max'      => null,
			'pattern'  => '',
		);
	}
	echo '<p>' . esc_html__( 'The fields every listing type draws from. A key is letters, numbers and underscores. A choice field needs choices, separated by commas. Tick Remove to drop a field; the stored values on listings are not deleted.', 'directoryweb' ) . '</p>';
	directoryweb_native_form_open( 'schema' );
	echo '<table class="wp-list-table widefat striped"><thead><tr>';
	foreach ( array( __( 'Key', 'directoryweb' ), __( 'Label', 'directoryweb' ), __( 'Type', 'directoryweb' ), __( 'Required', 'directoryweb' ), __( 'Choices', 'directoryweb' ), __( 'Help', 'directoryweb' ), __( 'Min', 'directoryweb' ), __( 'Max', 'directoryweb' ), __( 'Pattern', 'directoryweb' ), __( 'Remove', 'directoryweb' ) ) as $th ) {
		echo '<th scope="col">' . esc_html( $th ) . '</th>';
	}
	echo '</tr></thead><tbody>';
	foreach ( $fields as $n => $f ) {
		$existing = '' !== $f['key'];
		$p        = 'fields[' . $n . ']';
		echo '<tr>';
		echo '<td><label class="screen-reader-text" for="dw-f-key-' . (int) $n . '">' . esc_html__( 'Key', 'directoryweb' ) . '</label><input type="text" class="regular-text code" id="dw-f-key-' . (int) $n . '" name="' . esc_attr( $p ) . '[key]" value="' . esc_attr( $f['key'] ) . '"' . ( $existing ? ' readonly' : '' ) . '></td>';
		echo '<td><label class="screen-reader-text" for="dw-f-label-' . (int) $n . '">' . esc_html__( 'Label', 'directoryweb' ) . '</label><input type="text" class="regular-text" id="dw-f-label-' . (int) $n . '" name="' . esc_attr( $p ) . '[label]" value="' . esc_attr( $f['label'] ) . '"></td>';
		echo '<td><label class="screen-reader-text" for="dw-f-type-' . (int) $n . '">' . esc_html__( 'Type', 'directoryweb' ) . '</label><select id="dw-f-type-' . (int) $n . '" name="' . esc_attr( $p ) . '[type]">';
		foreach ( DIRECTORYWEB_FIELD_TYPES as $t ) {
			echo '<option value="' . esc_attr( $t ) . '"' . selected( $f['type'], $t, false ) . '>' . esc_html( $t ) . '</option>';
		}
		echo '</select></td>';
		echo '<td><label class="screen-reader-text" for="dw-f-req-' . (int) $n . '">' . esc_html__( 'Required', 'directoryweb' ) . '</label><input type="checkbox" id="dw-f-req-' . (int) $n . '" name="' . esc_attr( $p ) . '[required]" value="1"' . checked( ! empty( $f['required'] ), true, false ) . '></td>';
		echo '<td><label class="screen-reader-text" for="dw-f-opt-' . (int) $n . '">' . esc_html__( 'Choices', 'directoryweb' ) . '</label><input type="text" id="dw-f-opt-' . (int) $n . '" name="' . esc_attr( $p ) . '[options]" value="' . esc_attr( implode( ', ', (array) $f['options'] ) ) . '"></td>';
		echo '<td><label class="screen-reader-text" for="dw-f-help-' . (int) $n . '">' . esc_html__( 'Help', 'directoryweb' ) . '</label><input type="text" id="dw-f-help-' . (int) $n . '" name="' . esc_attr( $p ) . '[help]" value="' . esc_attr( $f['help'] ) . '"></td>';
		echo '<td><label class="screen-reader-text" for="dw-f-min-' . (int) $n . '">' . esc_html__( 'Min', 'directoryweb' ) . '</label><input type="text" class="small-text" id="dw-f-min-' . (int) $n . '" name="' . esc_attr( $p ) . '[min]" value="' . esc_attr( null === $f['min'] ? '' : (string) $f['min'] ) . '"></td>';
		echo '<td><label class="screen-reader-text" for="dw-f-max-' . (int) $n . '">' . esc_html__( 'Max', 'directoryweb' ) . '</label><input type="text" class="small-text" id="dw-f-max-' . (int) $n . '" name="' . esc_attr( $p ) . '[max]" value="' . esc_attr( null === $f['max'] ? '' : (string) $f['max'] ) . '"></td>';
		echo '<td><label class="screen-reader-text" for="dw-f-pat-' . (int) $n . '">' . esc_html__( 'Pattern', 'directoryweb' ) . '</label><input type="text" class="code" id="dw-f-pat-' . (int) $n . '" name="' . esc_attr( $p ) . '[pattern]" value="' . esc_attr( $f['pattern'] ) . '"></td>';
		echo '<td>' . ( $existing ? '<label class="screen-reader-text" for="dw-f-rm-' . (int) $n . '">' . esc_html__( 'Remove', 'directoryweb' ) . '</label><input type="checkbox" id="dw-f-rm-' . (int) $n . '" name="' . esc_attr( $p ) . '[remove]" value="1">' : '' ) . '</td>';
		echo '</tr>';
	}
	echo '</tbody></table>';
	echo '<p class="submit"><button type="submit" class="button button-primary">' . esc_html__( 'Save fields', 'directoryweb' ) . '</button></p></form>';
}

/** Saves the fields. @return array{0:string,1:string} tone, message */
function directoryweb_native_schema_save(): array {
	$raw = array();
	foreach ( directoryweb_native_post_rows( 'fields' ) as $row ) {
		if ( ! empty( $row['remove'] ) ) {
			continue;
		}
		$raw[] = array(
			'key'      => sanitize_text_field( (string) ( $row['key'] ?? '' ) ),
			'label'    => sanitize_text_field( (string) ( $row['label'] ?? '' ) ),
			'type'     => sanitize_key( (string) ( $row['type'] ?? 'text' ) ),
			'required' => ! empty( $row['required'] ),
			'help'     => sanitize_text_field( (string) ( $row['help'] ?? '' ) ),
			'options'  => directoryweb_native_list( $row['options'] ?? '' ),
			'min'      => trim( (string) ( $row['min'] ?? '' ) ),
			'max'      => trim( (string) ( $row['max'] ?? '' ) ),
			'pattern'  => trim( (string) ( $row['pattern'] ?? '' ) ),
		);
	}
	$fields = directoryweb_fields_clean( $raw );
	if ( ! $fields ) {
		return array( 'error', __( 'A schema needs at least one valid field. Nothing was saved.', 'directoryweb' ) );
	}
	update_option( DIRECTORYWEB_FIELDS_OPTION, array_values( $fields ), false );
	/* translators: %d: number of fields. */
	return array( 'success', sprintf( _n( 'Saved %d field.', 'Saved %d fields.', count( $fields ), 'directoryweb' ), count( $fields ) ) );
}

/* ---------- Listing Types ---------- */

function directoryweb_native_types_form(): void {
	$types  = array_values( directoryweb_schema_types() );
	$labels = array();
	foreach ( directoryweb_schema_fields() as $k => $f ) {
		$labels[ $k ] = $f['label'];
	}
	$types[] = array(
		'id'        => '',
		'label'     => '',
		'fields'    => array(),
		'post_type' => '',
	);
	echo '<p>' . esc_html__( 'A listing type chooses which fields it uses. The id is letters, numbers, hyphens and underscores and cannot change once saved. Leave Post type empty to use the directory\'s own. Tick Remove to drop a type (at least one stays).', 'directoryweb' ) . '</p>';
	directoryweb_native_form_open( 'types' );
	foreach ( $types as $n => $t ) {
		$existing = '' !== $t['id'];
		$p        = 'types[' . $n . ']';
		echo '<div class="card" style="max-width:none">';
		echo '<h2>' . esc_html( $existing ? $t['label'] : __( 'Add a listing type', 'directoryweb' ) ) . '</h2>';
		echo '<table class="form-table" role="presentation"><tbody>';
		echo '<tr><th scope="row"><label for="dw-t-id-' . (int) $n . '">' . esc_html__( 'Id', 'directoryweb' ) . '</label></th><td><input type="text" class="regular-text code" id="dw-t-id-' . (int) $n . '" name="' . esc_attr( $p ) . '[id]" value="' . esc_attr( $t['id'] ) . '"' . ( $existing ? ' readonly' : '' ) . '></td></tr>';
		echo '<tr><th scope="row"><label for="dw-t-label-' . (int) $n . '">' . esc_html__( 'Label', 'directoryweb' ) . '</label></th><td><input type="text" class="regular-text" id="dw-t-label-' . (int) $n . '" name="' . esc_attr( $p ) . '[label]" value="' . esc_attr( $t['label'] ) . '"></td></tr>';
		echo '<tr><th scope="row"><label for="dw-t-pt-' . (int) $n . '">' . esc_html__( 'Post type', 'directoryweb' ) . '</label></th><td><input type="text" class="regular-text code" id="dw-t-pt-' . (int) $n . '" name="' . esc_attr( $p ) . '[post_type]" value="' . esc_attr( $t['post_type'] ) . '"></td></tr>';
		echo '<tr><th scope="row">' . esc_html__( 'Fields', 'directoryweb' ) . '</th><td><fieldset><legend class="screen-reader-text">' . esc_html__( 'Fields this type uses', 'directoryweb' ) . '</legend>';
		foreach ( $labels as $k => $label ) {
			echo '<label style="display:inline-block;min-width:14em;margin:0 1em 4px 0"><input type="checkbox" name="' . esc_attr( $p ) . '[fields][]" value="' . esc_attr( $k ) . '"' . checked( in_array( $k, (array) $t['fields'], true ), true, false ) . '> ' . esc_html( $label ) . '</label>';
		}
		echo '</fieldset></td></tr>';
		if ( $existing ) {
			echo '<tr><th scope="row">' . esc_html__( 'Remove', 'directoryweb' ) . '</th><td><label><input type="checkbox" name="' . esc_attr( $p ) . '[remove]" value="1"> ' . esc_html__( 'Remove this type', 'directoryweb' ) . '</label></td></tr>';
		}
		echo '</tbody></table></div>';
	}
	echo '<p class="submit"><button type="submit" class="button button-primary">' . esc_html__( 'Save listing types', 'directoryweb' ) . '</button></p></form>';
}

/** Saves the listing types. @return array{0:string,1:string} */
function directoryweb_native_types_save(): array {
	$raw = array();
	foreach ( directoryweb_native_post_rows( 'types' ) as $row ) {
		if ( ! empty( $row['remove'] ) ) {
			continue;
		}
		$raw[] = array(
			'id'        => sanitize_text_field( (string) ( $row['id'] ?? '' ) ),
			'label'     => sanitize_text_field( (string) ( $row['label'] ?? '' ) ),
			'post_type' => sanitize_text_field( (string) ( $row['post_type'] ?? '' ) ),
			'fields'    => array_map( 'sanitize_text_field', array_map( 'strval', (array) ( $row['fields'] ?? array() ) ) ),
		);
	}
	$types = directoryweb_listing_types_clean( $raw, array_keys( directoryweb_schema_fields() ) );
	if ( ! $types ) {
		return array( 'error', __( 'Keep at least one listing type. Nothing was saved.', 'directoryweb' ) );
	}
	update_option( DIRECTORYWEB_TYPES_OPTION, array_values( $types ), false );
	/* translators: %d: number of listing types. */
	return array( 'success', sprintf( _n( 'Saved %d listing type.', 'Saved %d listing types.', count( $types ), 'directoryweb' ), count( $types ) ) );
}

/* ---------- Form Integrations ---------- */

function directoryweb_native_forms_form(): void {
	$types    = directoryweb_schema_types();
	$maps     = directoryweb_form_mappings();
	$adapters = directoryweb_form_adapters();
	echo '<p>' . esc_html__( 'Map a form from another plugin to a listing type. A submission to a mapped and enabled form arrives as a pending (or draft) listing. One line per field: the form field name, an equals sign, then the field key from Schema & Fields.', 'directoryweb' ) . '</p>';
	echo '<h2>' . esc_html__( 'Form providers', 'directoryweb' ) . '</h2><table class="wp-list-table widefat striped"><thead><tr><th scope="col">' . esc_html__( 'Provider', 'directoryweb' ) . '</th><th scope="col">' . esc_html__( 'Status', 'directoryweb' ) . '</th><th scope="col">' . esc_html__( 'Forms', 'directoryweb' ) . '</th></tr></thead><tbody>';
	$choices = array();
	foreach ( $adapters as $a ) {
		$on    = (bool) call_user_func( $a['active'] );
		$forms = array();
		if ( $on ) {
			foreach ( (array) call_user_func( $a['forms'] ) as $f ) {
				$forms[] = array( (string) $f[0], (string) $f[1] );
				$choices[] = array( $a['id'], (string) $f[0], $a['label'] . ': #' . $f[0] . ' ' . $f[1] );
			}
		}
		$names = array_map( static fn( $f ) => '#' . $f[0] . ' ' . $f[1], $forms );
		echo '<tr><td>' . esc_html( $a['label'] ) . '</td><td>' . esc_html( $on ? __( 'Active', 'directoryweb' ) : __( 'Not active', 'directoryweb' ) ) . '</td><td>' . esc_html( $names ? implode( ', ', $names ) : '—' ) . '</td></tr>';
	}
	echo '</tbody></table>';

	$rows   = $maps;
	$rows[] = array(
		'provider' => '',
		'form'     => '',
		'type'     => (string) array_key_first( $types ),
		'fields'   => array(),
		'status'   => 'pending',
		'enabled'  => false,
	);
	echo '<h2>' . esc_html__( 'Mappings', 'directoryweb' ) . '</h2>';
	directoryweb_native_form_open( 'forms' );
	foreach ( $rows as $n => $m ) {
		$existing = '' !== $m['provider'];
		$p        = 'maps[' . $n . ']';
		$lines    = array();
		foreach ( $m['fields'] as $from => $to ) {
			$lines[] = $from . '=' . $to;
		}
		echo '<div class="card" style="max-width:none"><h3>' . esc_html( $existing ? $m['provider'] . ' #' . $m['form'] : __( 'Add a mapping', 'directoryweb' ) ) . '</h3><table class="form-table" role="presentation"><tbody>';
		if ( $existing ) {
			echo '<input type="hidden" name="' . esc_attr( $p ) . '[provider]" value="' . esc_attr( $m['provider'] ) . '"><input type="hidden" name="' . esc_attr( $p ) . '[form]" value="' . esc_attr( $m['form'] ) . '">';
		} else {
			echo '<tr><th scope="row"><label for="dw-m-form-' . (int) $n . '">' . esc_html__( 'Form', 'directoryweb' ) . '</label></th><td><select id="dw-m-form-' . (int) $n . '" name="' . esc_attr( $p ) . '[pick]"><option value="">' . esc_html__( 'Choose a form', 'directoryweb' ) . '</option>';
			foreach ( $choices as $c ) {
				echo '<option value="' . esc_attr( $c[0] . '|' . $c[1] ) . '">' . esc_html( $c[2] ) . '</option>';
			}
			echo '</select></td></tr>';
		}
		echo '<tr><th scope="row"><label for="dw-m-type-' . (int) $n . '">' . esc_html__( 'Listing type', 'directoryweb' ) . '</label></th><td><select id="dw-m-type-' . (int) $n . '" name="' . esc_attr( $p ) . '[type]">';
		foreach ( $types as $id => $t ) {
			echo '<option value="' . esc_attr( $id ) . '"' . selected( $m['type'], $id, false ) . '>' . esc_html( $t['label'] ) . '</option>';
		}
		echo '</select></td></tr>';
		echo '<tr><th scope="row"><label for="dw-m-status-' . (int) $n . '">' . esc_html__( 'New listings are', 'directoryweb' ) . '</label></th><td><select id="dw-m-status-' . (int) $n . '" name="' . esc_attr( $p ) . '[status]"><option value="pending"' . selected( $m['status'], 'pending', false ) . '>' . esc_html__( 'Pending review', 'directoryweb' ) . '</option><option value="draft"' . selected( $m['status'], 'draft', false ) . '>' . esc_html__( 'Draft', 'directoryweb' ) . '</option></select></td></tr>';
		echo '<tr><th scope="row">' . esc_html__( 'Enabled', 'directoryweb' ) . '</th><td><label><input type="checkbox" name="' . esc_attr( $p ) . '[enabled]" value="1"' . checked( ! empty( $m['enabled'] ), true, false ) . '> ' . esc_html__( 'Make a listing from each submission', 'directoryweb' ) . '</label></td></tr>';
		echo '<tr><th scope="row"><label for="dw-m-fields-' . (int) $n . '">' . esc_html__( 'Field map', 'directoryweb' ) . '</label></th><td><textarea class="large-text code" rows="6" id="dw-m-fields-' . (int) $n . '" name="' . esc_attr( $p ) . '[fields]">' . esc_textarea( implode( "\n", $lines ) ) . '</textarea></td></tr>';
		if ( $existing ) {
			echo '<tr><th scope="row">' . esc_html__( 'Remove', 'directoryweb' ) . '</th><td><label><input type="checkbox" name="' . esc_attr( $p ) . '[remove]" value="1"> ' . esc_html__( 'Remove this mapping', 'directoryweb' ) . '</label></td></tr>';
		}
		echo '</tbody></table></div>';
	}
	echo '<p class="submit"><button type="submit" class="button button-primary">' . esc_html__( 'Save mappings', 'directoryweb' ) . '</button></p></form>';
}

/** Saves the mappings. @return array{0:string,1:string} */
function directoryweb_native_forms_save(): array {
	$types = directoryweb_schema_types();
	$save  = array();
	foreach ( directoryweb_native_post_rows( 'maps' ) as $row ) {
		if ( ! empty( $row['remove'] ) ) {
			continue;
		}
		$provider = sanitize_text_field( (string) ( $row['provider'] ?? '' ) );
		$form     = sanitize_text_field( (string) ( $row['form'] ?? '' ) );
		if ( '' === $provider && ! empty( $row['pick'] ) ) {
			list( $provider, $form ) = array_pad( explode( '|', sanitize_text_field( (string) $row['pick'] ), 2 ), 2, '' );
		}
		$map = array();
		foreach ( preg_split( '/\r\n|\r|\n/', (string) ( $row['fields'] ?? '' ) ) as $line ) {
			$bits = explode( '=', $line, 2 );
			if ( 2 === count( $bits ) ) {
				$from = sanitize_text_field( $bits[0] );
				$to   = sanitize_text_field( $bits[1] );
				if ( '' !== $from && '' !== $to ) {
					$map[ $from ] = $to;
				}
			}
		}
		$c = directoryweb_mapping_clean(
			array(
				'provider' => $provider,
				'form'     => $form,
				'type'     => sanitize_text_field( (string) ( $row['type'] ?? '' ) ),
				'fields'   => $map,
				'status'   => 'draft' === ( $row['status'] ?? '' ) ? 'draft' : 'pending',
				'enabled'  => ! empty( $row['enabled'] ),
			),
			$types
		);
		if ( $c ) {
			$save[] = $c;
		}
	}
	update_option( DIRECTORYWEB_MAPPINGS_OPTION, $save, false );
	/* translators: %d: number of mappings. */
	return array( 'success', sprintf( _n( 'Saved %d mapping.', 'Saved %d mappings.', count( $save ), 'directoryweb' ), count( $save ) ) );
}

/* ---------- Import / Export ---------- */

function directoryweb_native_transfer(): void {
	$types  = directoryweb_schema_types();
	$export = static fn( array $args ) => wp_nonce_url( add_query_arg( array_merge( array( 'action' => 'directoryweb_native_export' ), $args ), admin_url( 'admin-post.php' ) ), 'directoryweb_native_export' );

	echo '<h2>' . esc_html__( 'Export the structure', 'directoryweb' ) . '</h2>';
	echo '<p>' . esc_html__( 'Fields, listing types and form mappings as one file, to move to another site. Listings themselves are not in it.', 'directoryweb' ) . '</p>';
	echo '<p><a class="button" href="' . esc_url( $export( array( 'what' => 'structure' ) ) ) . '">' . esc_html__( 'Download the structure', 'directoryweb' ) . '</a></p>';

	echo '<h2>' . esc_html__( 'Import a structure', 'directoryweb' ) . '</h2>';
	echo '<p>' . esc_html__( 'Paste an exported file. It replaces this site\'s fields, listing types and form mappings.', 'directoryweb' ) . '</p>';
	directoryweb_native_form_open( 'transfer', 'structure' );
	echo '<p><label class="screen-reader-text" for="dw-structure">' . esc_html__( 'Structure file contents', 'directoryweb' ) . '</label><textarea class="large-text code" rows="8" id="dw-structure" name="dw_structure"></textarea></p>';
	echo '<p class="submit"><button type="submit" class="button button-primary">' . esc_html__( 'Import the structure', 'directoryweb' ) . '</button></p></form>';

	echo '<h2>' . esc_html__( 'Export listings (CSV)', 'directoryweb' ) . '</h2><ul>';
	foreach ( $types as $id => $t ) {
		echo '<li><a href="' . esc_url( $export( array( 'what' => 'csv', 'type' => $id ) ) ) . '">' . esc_html( sprintf( /* translators: %s: listing type label. */ __( 'Download %s as CSV', 'directoryweb' ), $t['label'] ) ) . '</a></li>';
	}
	echo '</ul>';

	echo '<h2>' . esc_html__( 'Import listings (CSV)', 'directoryweb' ) . '</h2>';
	echo '<p>' . esc_html__( 'The first row names the columns, which are field keys of the chosen listing type. Every row is checked like a form submission. At most 500 rows. Leave "Only check" ticked to see what would happen first.', 'directoryweb' ) . '</p>';
	directoryweb_native_form_open( 'transfer', 'csv', 'multipart/form-data' );
	echo '<table class="form-table" role="presentation"><tbody>';
	echo '<tr><th scope="row"><label for="dw-csv-type">' . esc_html__( 'Listing type', 'directoryweb' ) . '</label></th><td><select id="dw-csv-type" name="dw_csv_type">';
	foreach ( $types as $id => $t ) {
		echo '<option value="' . esc_attr( $id ) . '">' . esc_html( $t['label'] ) . '</option>';
	}
	echo '</select></td></tr>';
	echo '<tr><th scope="row"><label for="dw-csv-file">' . esc_html__( 'CSV file', 'directoryweb' ) . '</label></th><td><input type="file" id="dw-csv-file" name="dw_csv_file" accept=".csv,text/csv"></td></tr>';
	echo '<tr><th scope="row"><label for="dw-csv-text">' . esc_html__( 'Or paste the CSV', 'directoryweb' ) . '</label></th><td><textarea class="large-text code" rows="6" id="dw-csv-text" name="dw_csv_text"></textarea></td></tr>';
	echo '<tr><th scope="row"><label for="dw-csv-status">' . esc_html__( 'New listings are', 'directoryweb' ) . '</label></th><td><select id="dw-csv-status" name="dw_csv_status"><option value="pending">' . esc_html__( 'Pending review', 'directoryweb' ) . '</option><option value="draft">' . esc_html__( 'Draft', 'directoryweb' ) . '</option></select></td></tr>';
	echo '<tr><th scope="row">' . esc_html__( 'Only check', 'directoryweb' ) . '</th><td><label><input type="checkbox" name="dw_csv_dry" value="1" checked> ' . esc_html__( 'Check every row but create nothing', 'directoryweb' ) . '</label></td></tr>';
	echo '</tbody></table>';
	echo '<p class="submit"><button type="submit" class="button button-primary">' . esc_html__( 'Check or import', 'directoryweb' ) . '</button></p></form>';
}

/** The report of a CSV import, as a notice and a list of the problem rows. */
function directoryweb_native_report( array $r ): void {
	echo '<div class="card" style="max-width:none">';
	/* translators: 1: rows read, 2: rows that passed, 3: listings created. */
	echo '<p>' . esc_html( sprintf( __( 'Rows read: %1$d. Rows that passed: %2$d. Listings created: %3$d.', 'directoryweb' ), (int) ( $r['rows'] ?? 0 ), (int) ( $r['ok'] ?? 0 ), count( (array) ( $r['created'] ?? array() ) ) ) ) . '</p>';
	if ( ! empty( $r['ignored'] ) ) {
		echo '<p>' . esc_html( __( 'Columns that are not fields of this type were ignored:', 'directoryweb' ) . ' ' . implode( ', ', array_map( 'strval', (array) $r['ignored'] ) ) ) . '</p>';
	}
	if ( ! empty( $r['problems'] ) ) {
		echo '<ul>';
		foreach ( (array) $r['problems'] as $row => $list ) {
			/* translators: %d: row number. */
			echo '<li>' . esc_html( sprintf( __( 'Row %d:', 'directoryweb' ), (int) $row ) . ' ' . implode( ' ', array_map( 'strval', (array) $list ) ) ) . '</li>';
		}
		echo '</ul>';
	}
	echo '</div>';
}

/** The structure as the REST route /config gives it. */
function directoryweb_native_structure(): array {
	return array(
		'fields'   => array_values( directoryweb_schema_fields() ),
		'types'    => array_values( directoryweb_schema_types() ),
		'mappings' => directoryweb_form_mappings(),
	);
}

/** Imports a structure (the same rules as POST directoryweb/v1/config). @return array{0:string,1:string} */
function directoryweb_native_structure_import( string $text ): array {
	$data = json_decode( $text, true );
	if ( ! is_array( $data ) ) {
		return array( 'error', __( 'That is not valid JSON.', 'directoryweb' ) );
	}
	$fields = directoryweb_fields_clean( (array) ( $data['fields'] ?? array() ) );
	if ( ! $fields ) {
		return array( 'error', __( 'That file has no valid fields.', 'directoryweb' ) );
	}
	$types = directoryweb_listing_types_clean( (array) ( $data['types'] ?? array() ), array_keys( $fields ) );
	if ( ! $types ) {
		return array( 'error', __( 'That file has no valid listing types.', 'directoryweb' ) );
	}
	$maps = array();
	foreach ( (array) ( $data['mappings'] ?? array() ) as $m ) {
		$c = is_array( $m ) ? directoryweb_mapping_clean( $m, $types ) : null;
		if ( $c ) {
			$maps[] = $c;
		}
	}
	update_option( DIRECTORYWEB_FIELDS_OPTION, array_values( $fields ), false );
	update_option( DIRECTORYWEB_TYPES_OPTION, array_values( $types ), false );
	update_option( DIRECTORYWEB_MAPPINGS_OPTION, $maps, false );
	/* translators: 1: fields, 2: listing types, 3: mappings. */
	return array( 'success', sprintf( __( 'Imported %1$d fields, %2$d listing types and %3$d mappings.', 'directoryweb' ), count( $fields ), count( $types ), count( $maps ) ) );
}

/* ---------- The one save handler, and the download handler ---------- */

add_action(
	'admin_post_directoryweb_native_save',
	static function (): void {
		$screen = sanitize_key( wp_unslash( $_POST['dw_screen'] ?? '' ) ); // phpcs:ignore WordPress.Security.NonceVerification.Missing -- checked just below, once the screen is known
		if ( ! isset( directoryweb_native_screens()[ $screen ] ) ) {
			wp_die( esc_html__( 'Unknown screen.', 'directoryweb' ), 400 );
		}
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( esc_html__( 'You are not allowed to do this.', 'directoryweb' ), 403 );
		}
		check_admin_referer( 'directoryweb_native_save_' . $screen );
		$op     = sanitize_key( wp_unslash( $_POST['dw_op'] ?? '' ) );
		$report = array();
		if ( 'schema' === $screen ) {
			$res = directoryweb_native_schema_save();
		} elseif ( 'types' === $screen ) {
			$res = directoryweb_native_types_save();
		} elseif ( 'forms' === $screen ) {
			$res = directoryweb_native_forms_save();
		} elseif ( 'structure' === $op ) {
			$res = directoryweb_native_structure_import( (string) wp_unslash( $_POST['dw_structure'] ?? '' ) ); // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- JSON text, decoded and cleaned field by field
		} else {
			list( $res, $report ) = directoryweb_native_csv_run();
		}
		directoryweb_native_back( $screen, $res[0], $res[1], $report );
	}
);

/** Reads the posted CSV (file or text) and checks or imports it. @return array{0:array{0:string,1:string},1:array} */
function directoryweb_native_csv_run(): array {
	$type = sanitize_key( wp_unslash( $_POST['dw_csv_type'] ?? '' ) ); // phpcs:ignore WordPress.Security.NonceVerification.Missing -- the nonce was checked by the caller
	$text = '';
	// phpcs:ignore WordPress.Security.NonceVerification.Missing, WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- as above; the upload is validated below
	$file = isset( $_FILES['dw_csv_file'] ) && is_array( $_FILES['dw_csv_file'] ) ? $_FILES['dw_csv_file'] : array();
	if ( ! empty( $file['name'] ) ) {
		$tmp = (string) ( $file['tmp_name'] ?? '' );
		$ext = strtolower( pathinfo( sanitize_file_name( (string) $file['name'] ), PATHINFO_EXTENSION ) );
		if ( UPLOAD_ERR_OK !== (int) ( $file['error'] ?? 1 ) || '' === $tmp || ! is_uploaded_file( $tmp ) ) {
			return array( array( 'error', __( 'The file could not be uploaded.', 'directoryweb' ) ), array() );
		}
		if ( ! in_array( $ext, array( 'csv', 'txt' ), true ) || (int) ( $file['size'] ?? 0 ) > 2 * MB_IN_BYTES ) {
			return array( array( 'error', __( 'Use a .csv file of 2 MB or less.', 'directoryweb' ) ), array() );
		}
		$text = (string) file_get_contents( $tmp ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents -- an uploaded temporary file
	} else {
		$text = (string) wp_unslash( $_POST['dw_csv_text'] ?? '' ); // phpcs:ignore WordPress.Security.NonceVerification.Missing, WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- CSV text, read by the importer and checked per field
	}
	if ( '' === trim( $text ) ) {
		return array( array( 'error', __( 'Choose a CSV file or paste the CSV.', 'directoryweb' ) ), array() );
	}
	if ( wp_check_invalid_utf8( $text ) !== $text ) {
		return array( array( 'error', __( 'The CSV must be UTF-8.', 'directoryweb' ) ), array() );
	}
	$dry    = ! empty( $_POST['dw_csv_dry'] ); // phpcs:ignore WordPress.Security.NonceVerification.Missing -- as above
	$status = 'draft' === sanitize_key( wp_unslash( $_POST['dw_csv_status'] ?? '' ) ) ? 'draft' : 'pending'; // phpcs:ignore WordPress.Security.NonceVerification.Missing -- as above
	$report = directoryweb_import_csv( $type, $text, $dry, $status );
	if ( '' !== $report['error'] ) {
		return array( array( 'error', $report['error'] ), $report );
	}
	return array( array( 'success', $dry ? __( 'Checked. Nothing was created.', 'directoryweb' ) : __( 'Import finished.', 'directoryweb' ) ), $report );
}

add_action(
	'admin_post_directoryweb_native_export',
	static function (): void {
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( esc_html__( 'You are not allowed to do this.', 'directoryweb' ), 403 );
		}
		check_admin_referer( 'directoryweb_native_export' );
		$what = sanitize_key( wp_unslash( $_GET['what'] ?? '' ) );
		if ( 'csv' === $what ) {
			$type = sanitize_key( wp_unslash( $_GET['type'] ?? '' ) );
			$csv  = directoryweb_export_csv( $type );
			if ( null === $csv ) {
				wp_die( esc_html__( 'Unknown listing type.', 'directoryweb' ), 404 );
			}
			nocache_headers();
			header( 'Content-Type: text/csv; charset=utf-8' );
			header( 'Content-Disposition: attachment; filename="directoryweb-' . sanitize_file_name( $type ) . '.csv"' );
			echo $csv; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- a CSV download, cells are formula-escaped by directoryweb_csv_build()
			exit;
		}
		nocache_headers();
		header( 'Content-Type: application/json; charset=utf-8' );
		header( 'Content-Disposition: attachment; filename="directoryweb-schema.json"' );
		echo wp_json_encode( directoryweb_native_structure(), JSON_PRETTY_PRINT ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- a JSON download
		exit;
	}
);

/* ---------- Claims list ---------- */

/**
 * The Claims list as a plain table: status tabs and 20 rows a page, read through the same functions the React screen uses.
 * Opens a claim on its own review screen. Needs manage_directoryweb.
 */
function directoryweb_native_claims_list(): void {
	if ( ! current_user_can( DIRECTORYWEB_CAP ) ) { // phpcs:ignore WordPress.WP.Capabilities.Unknown -- DirectoryWeb's own capability
		wp_die( esc_html__( 'You are not allowed to do this.', 'directoryweb' ), 403 );
	}
	$status = sanitize_key( wp_unslash( $_GET['status'] ?? 'pending' ) ); // phpcs:ignore WordPress.Security.NonceVerification.Recommended -- a filter on a list; nothing is saved
	$status = in_array( $status, array( 'pending', 'approved', 'rejected', 'all' ), true ) ? $status : 'pending';
	$paged  = max( 1, absint( wp_unslash( $_GET['paged'] ?? 1 ) ) ); // phpcs:ignore WordPress.Security.NonceVerification.Recommended -- same
	$light  = directoryweb_claim_light_rows();
	$ids    = array_values( array_unique( array_filter( wp_list_pluck( $light, 'listing' ) ) ) );
	if ( $ids ) {
		_prime_post_caches( $ids, true, true );
	}
	foreach ( $light as &$r ) {
		$lid                = directoryweb_post_type() === get_post_type( $r['listing'] ) ? (int) $r['listing'] : 0;
		$r['listing']       = $lid;
		$r['listing_title'] = $lid ? html_entity_decode( get_the_title( $lid ), ENT_QUOTES, 'UTF-8' ) : '';
		$r['state']         = 0;
		$r['types']         = array();
	}
	unset( $r );
	$q = directoryweb_claims_query(
		$light,
		array(
			'status' => $status,
			'page'   => $paged,
			'per'    => 20,
			'sort'   => 'sent',
			'dir'    => 'desc',
			'now'    => time(),
		)
	);

	echo '<div class="wrap"><h1>' . esc_html__( 'Claims', 'directoryweb' ) . '</h1>';
	$base = directoryweb_ui_url( 'claims' );
	$tabs = array(
		'pending'  => __( 'Waiting', 'directoryweb' ),
		'approved' => __( 'Approved', 'directoryweb' ),
		'rejected' => __( 'Rejected', 'directoryweb' ),
		'all'      => __( 'All', 'directoryweb' ),
	);
	echo '<ul class="subsubsub">';
	$last = array_key_last( $tabs );
	foreach ( $tabs as $key => $label ) {
		echo '<li><a href="' . esc_url( add_query_arg( 'status', $key, $base ) ) . '"' . ( $key === $status ? ' class="current" aria-current="page"' : '' ) . '>' . esc_html( $label ) . ' <span class="count">(' . esc_html( number_format_i18n( (int) ( $q['counts'][ $key ] ?? 0 ) ) ) . ')</span></a>' . ( $key === $last ? '' : ' |' ) . '</li> ';
	}
	echo '</ul><br class="clear">';

	echo '<table class="wp-list-table widefat striped"><thead><tr>';
	foreach ( array( __( 'Listing', 'directoryweb' ), __( 'From', 'directoryweb' ), __( 'Status', 'directoryweb' ), __( 'Sent', 'directoryweb' ), __( 'Review', 'directoryweb' ) ) as $th ) {
		echo '<th scope="col">' . esc_html( $th ) . '</th>';
	}
	echo '</tr></thead><tbody>';
	if ( ! $q['rows'] ) {
		echo '<tr><td colspan="5">' . esc_html__( 'No claims here.', 'directoryweb' ) . '</td></tr>';
	}
	foreach ( $q['rows'] as $r ) {
		if ( ! empty( $r['native'] ) || ! empty( $r['old'] ) ) {
			$url = (string) get_edit_post_link( (int) $r['entry'], 'raw' );
		} else {
			$url = add_query_arg(
				array(
					'post_type' => directoryweb_post_type(),
					'page'      => 'aw-claims',
					'entry'     => (int) $r['entry'],
				),
				admin_url( 'edit.php' )
			);
		}
		$row  = directoryweb_claim_row( $r );
		$from = trim( $row['name'] . ( '' !== $row['role'] ? ', ' . $row['role'] : '' ) );
		echo '<tr>';
		echo '<td>' . ( $row['listingUrl'] ? '<a href="' . esc_url( $row['listingUrl'] ) . '">' . esc_html( $row['title'] ) . '</a>' : esc_html( $row['title'] ) ) . ( '' !== $row['ref'] ? '<br><span class="description">' . esc_html( $row['ref'] ) . '</span>' : '' ) . '</td>';
		echo '<td>' . esc_html( '' !== $from ? $from : '—' ) . ( '' !== $row['email'] ? '<br><span class="description">' . esc_html( $row['email'] ) . '</span>' : '' ) . '</td>';
		echo '<td>' . esc_html( $row['statusText'] ) . '</td>';
		echo '<td>' . esc_html( $row['sentText'] ) . '</td>';
		echo '<td>' . ( '' !== $url ? '<a class="button button-small" href="' . esc_url( $url ) . '">' . esc_html__( 'Open', 'directoryweb' ) . '</a>' : '—' ) . '</td>';
		echo '</tr>';
	}
	echo '</tbody></table>';
	if ( $q['pages'] > 1 ) {
		echo '<div class="tablenav"><div class="tablenav-pages">' . wp_kses_post(
			paginate_links(
				array(
					'base'      => add_query_arg( 'paged', '%#%', add_query_arg( 'status', $status, $base ) ),
					'format'    => '',
					'current'   => (int) $q['page'],
					'total'     => (int) $q['pages'],
					'prev_text' => '&laquo;',
					'next_text' => '&raquo;',
				)
			)
		) . '</div></div>';
	}
	echo '</div>';
}
