<?php
/**
 * Claim evidence: the logo, photos and proof of ownership that come with a claim.
 *
 * DirectoryWeb owns this store. It does not use Kits Core's private folder or any legacy Core helper. Every claim path
 * ends here: the built-in form posts files to dw_evidence_store_upload(); a form provider (Fluent Forms today) has its
 * uploaded files copied in by dw_evidence_import_path() when the claim is submitted. A file that is not accepted is
 * refused with a reason the claimant sees; nothing is dropped silently.
 *
 * Files live in wp-content/uploads/directoryweb-private/ under random names, behind a deny-all rule and an empty index,
 * and are served only by admin-post.php?action=dw_evidence_file to a DirectoryWeb manager with a nonce.
 * They are also ENCRYPTED at rest (libsodium secretbox, key derived from the site's secret salts). A web server that
 * ignores the deny rule (nginx without the location block, a host that disables .htaccess) therefore serves ciphertext,
 * not the document. Keep wp-config's salts: changing them makes earlier evidence unreadable.
 * The proof is never published. A logo and photos reach the media library only when a reviewer approves them.
 *
 * @package directoryweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * What each kind of evidence may be.
 * kind => [ label, allowed types (ext => mime), max bytes, max files, re-encode images to PNG ].
 *
 * @return array
 */
function dw_evidence_kinds(): array {
	$img = array( 'jpg|jpeg' => 'image/jpeg', 'png' => 'image/png', 'webp' => 'image/webp' );
	return (array) apply_filters(
		'directoryweb_evidence_kinds',
		array(
			'logo'   => array( 'label' => 'Logo', 'types' => $img, 'max' => 5 * MB_IN_BYTES, 'files' => 1, 'reencode' => true ),
			'photos' => array( 'label' => 'Photos', 'types' => $img, 'max' => 5 * MB_IN_BYTES, 'files' => 5, 'reencode' => true ),
			'proof'  => array( 'label' => 'Proof of connection', 'types' => $img + array( 'pdf' => 'application/pdf' ), 'max' => 8 * MB_IN_BYTES, 'files' => 3, 'reencode' => false ),
		)
	);
}

/**
 * The private folder, created on first use and closed to the web server.
 *
 * @return string Absolute path, or '' when it cannot be made.
 */
function dw_evidence_dir(): string {
	$up  = wp_upload_dir( null, false );
	$dir = untrailingslashit( $up['basedir'] ) . '/directoryweb-private';
	if ( ! is_dir( $dir ) && ! wp_mkdir_p( $dir ) ) {
		return '';
	}
	dw_evidence_protect_dir( $dir );
	return $dir;
}

/**
 * Put the deny rules in a folder (Apache 2.2 and 2.4 syntax, an empty index for listings). Idempotent.
 *
 * @param string $dir Folder.
 */
function dw_evidence_protect_dir( string $dir ): void {
	if ( ! is_dir( $dir ) ) {
		return;
	}
	if ( ! is_file( $dir . '/.htaccess' ) ) {
		file_put_contents( $dir . '/.htaccess', "# Private claim evidence: never served directly.\n<IfModule mod_authz_core.c>\nRequire all denied\n</IfModule>\n<IfModule !mod_authz_core.c>\nOrder allow,deny\nDeny from all\n</IfModule>\n" ); // phpcs:ignore WordPress.WP.AlternativeFunctions
	}
	if ( ! is_file( $dir . '/index.php' ) ) {
		file_put_contents( $dir . '/index.php', "<?php\n// Silence is golden.\n" ); // phpcs:ignore WordPress.WP.AlternativeFunctions
	}
}

/**
 * The stored name pattern: 24 random characters and an accepted extension.
 *
 * @param string $name File name.
 * @return bool
 */
function dw_evidence_name_ok( string $name ): bool {
	return (bool) preg_match( '/^[a-z0-9]{24}\.(png|jpg|webp|pdf)\z/', $name );
}

/**
 * The key that seals stored evidence: 32 bytes from the site's secret salts.
 *
 * @return string
 */
function dw_evidence_key(): string {
	return hash( 'sha256', wp_salt( 'auth' ) . '|' . wp_salt( 'secure_auth' ) . '|directoryweb-evidence-v1', true );
}

/**
 * Seal bytes for storage: 24-byte nonce then the secretbox.
 *
 * @param string $plain Bytes.
 * @return string
 */
function dw_evidence_seal( string $plain ): string {
	$nonce = random_bytes( SODIUM_CRYPTO_SECRETBOX_NONCEBYTES );
	return 'DWE1' . $nonce . sodium_crypto_secretbox( $plain, $nonce, dw_evidence_key() );
}

/**
 * Open sealed bytes. '' when they were not sealed by this site (or the salts changed).
 *
 * @param string $blob Stored bytes.
 * @return string
 */
function dw_evidence_unseal( string $blob ): string {
	$n = SODIUM_CRYPTO_SECRETBOX_NONCEBYTES;
	if ( 'DWE1' !== substr( $blob, 0, 4 ) || strlen( $blob ) < 4 + $n + SODIUM_CRYPTO_SECRETBOX_MACBYTES ) {
		return '';
	}
	$plain = sodium_crypto_secretbox_open( substr( $blob, 4 + $n ), substr( $blob, 4, $n ), dw_evidence_key() );
	return false === $plain ? '' : $plain;
}

/**
 * A stored file's content, decrypted, or '' when it is missing or cannot be opened.
 *
 * @param string $name Stored name.
 * @return string
 */
function dw_evidence_read( string $name ): string {
	$p = dw_evidence_path( $name );
	return '' === $p ? '' : dw_evidence_unseal( (string) file_get_contents( $p ) ); // phpcs:ignore WordPress.WP.AlternativeFunctions
}

/**
 * The path of a stored file, or '' when the name is not one of ours or the file is gone.
 *
 * @param string $name Stored name.
 * @return string
 */
function dw_evidence_path( string $name ): string {
	if ( ! dw_evidence_name_ok( $name ) ) {
		return '';
	}
	$dir = dw_evidence_dir();
	$p   = '' !== $dir ? $dir . '/' . $name : '';
	return '' !== $p && is_file( $p ) ? $p : '';
}

/**
 * A link only a DirectoryWeb manager can open.
 *
 * @param string $name Stored name.
 * @return string
 */
function dw_evidence_link( string $name ): string {
	if ( ! dw_evidence_name_ok( $name ) ) {
		return '';
	}
	return wp_nonce_url( add_query_arg( array( 'action' => 'dw_evidence_file', 'f' => $name ), admin_url( 'admin-post.php' ) ), 'dw_evidence_' . $name );
}

/**
 * Check one file against a kind, by its real content, not its name. '' when it is acceptable, else the reason.
 *
 * @param string $path Temporary path.
 * @param string $orig Original file name.
 * @param int    $size Size in bytes.
 * @param string $kind logo | photos | proof.
 * @return string Reason, or ''.
 */
function dw_evidence_problem( string $path, string $orig, int $size, string $kind ): string {
	$k = dw_evidence_kinds()[ $kind ] ?? null;
	if ( ! $k ) {
		return 'Unknown kind of file.';
	}
	$label = (string) $k['label'];
	if ( $size <= 0 || ! is_file( $path ) ) {
		return sprintf( '%s: the file is empty or did not arrive.', $label );
	}
	if ( $size > (int) $k['max'] ) {
		return sprintf( '%s: %s is over the %s limit.', $label, size_format( $size, 1 ), size_format( (int) $k['max'] ) );
	}
	$ext = strtolower( pathinfo( $orig, PATHINFO_EXTENSION ) );
	if ( in_array( $ext, array( 'heic', 'heif' ), true ) ) {
		return sprintf( '%s: this is a HEIC file. Use %s.', $label, strtoupper( implode( ', ', array_map( fn( $e ) => explode( '|', $e )[0], array_keys( $k['types'] ) ) ) ) );
	}
	$ft = wp_check_filetype_and_ext( $path, $orig, $k['types'] );
	if ( empty( $ft['ext'] ) || empty( $ft['type'] ) || ! in_array( $ft['type'], $k['types'], true ) ) {
		return sprintf( '%s: this file type is not accepted. Use %s.', $label, strtoupper( implode( ', ', array_map( fn( $e ) => str_replace( '|', '/', $e ), array_keys( $k['types'] ) ) ) ) );
	}
	if ( 'application/pdf' === $ft['type'] ) {
		$head = (string) file_get_contents( $path, false, null, 0, 5 ); // phpcs:ignore WordPress.WP.AlternativeFunctions
		return '%PDF-' === $head ? '' : sprintf( '%s: this is not a PDF.', $label );
	}
	return false === @getimagesize( $path ) ? sprintf( '%s: this is not an image.', $label ) : ''; // phpcs:ignore WordPress.PHP.NoSilencedErrors
}

/**
 * Move one checked file into the private folder. Images are re-encoded (as PNG, at most 800 px for a logo, 1600 px for
 * photos), which removes embedded data; a PDF is kept as sent.
 *
 * @param string $path Source path.
 * @param string $orig Original name.
 * @param string $kind logo | photos | proof.
 * @return string|WP_Error The stored name.
 */
function dw_evidence_commit( string $path, string $orig, string $kind ) {
	$k   = dw_evidence_kinds()[ $kind ] ?? null;
	$dir = dw_evidence_dir();
	if ( ! $k || '' === $dir ) {
		return new WP_Error( 'dw_evidence_dir', 'The private folder for claim files could not be created.' );
	}
	$is_pdf = 'pdf' === strtolower( pathinfo( $orig, PATHINFO_EXTENSION ) ) && 'application/pdf' === ( wp_check_filetype_and_ext( $path, $orig, $k['types'] )['type'] ?? '' );
	$name   = strtolower( wp_generate_password( 24, false, false ) ) . ( $is_pdf ? '.pdf' : '.png' );
	if ( $is_pdf ) {
		$bytes = (string) file_get_contents( $path ); // phpcs:ignore WordPress.WP.AlternativeFunctions
		return false !== file_put_contents( $dir . '/' . $name, dw_evidence_seal( $bytes ) ) ? $name : new WP_Error( 'dw_evidence_write', 'The file could not be saved.' ); // phpcs:ignore WordPress.WP.AlternativeFunctions
	}
	wp_raise_memory_limit( 'image' );
	$ed = wp_get_image_editor( $path );
	if ( is_wp_error( $ed ) ) {
		return new WP_Error( 'dw_evidence_image', 'The image could not be read.' );
	}
	$max = 'logo' === $kind ? 800 : 1600;
	$ed->resize( $max, $max, false );
	$tmp   = wp_tempnam( 'dw-evidence.png' );
	$saved = $tmp ? $ed->save( $tmp, 'image/png' ) : new WP_Error( 'dw_evidence_tmp', 'No temporary file.' );
	if ( is_wp_error( $saved ) ) {
		return new WP_Error( 'dw_evidence_write', 'The image could not be saved.' );
	}
	$png = (string) file_get_contents( $saved['path'] ); // phpcs:ignore WordPress.WP.AlternativeFunctions
	wp_delete_file( $saved['path'] );
	if ( $tmp !== $saved['path'] ) {
		wp_delete_file( $tmp );
	}
	return false !== file_put_contents( $dir . '/' . $name, dw_evidence_seal( $png ) ) ? $name : new WP_Error( 'dw_evidence_write', 'The image could not be saved.' ); // phpcs:ignore WordPress.WP.AlternativeFunctions
}

/**
 * Normalise a $_FILES entry (single or multiple) into a list of [ tmp_name, name, size, error ].
 *
 * @param mixed $f One $_FILES element.
 * @return array[]
 */
function dw_evidence_files_list( $f ): array {
	if ( ! is_array( $f ) || ! isset( $f['name'] ) ) {
		return array();
	}
	$out = array();
	foreach ( (array) $f['name'] as $i => $n ) {
		$get   = fn( $key ) => is_array( $f[ $key ] ) ? ( $f[ $key ][ $i ] ?? null ) : $f[ $key ];
		$err   = (int) $get( 'error' );
		$out[] = array( 'tmp_name' => (string) $get( 'tmp_name' ), 'name' => (string) $n, 'size' => (int) $get( 'size' ), 'error' => $err );
	}
	return array_values( array_filter( $out, fn( $x ) => UPLOAD_ERR_NO_FILE !== $x['error'] && '' !== $x['name'] ) );
}

/** The built-in form's file fields: post field => kind. */
const DW_EVIDENCE_FIELDS = array(
	'evidence_logo'   => 'logo',
	'evidence_photos' => 'photos',
	'evidence_proof'  => 'proof',
);

/**
 * Check every file the built-in form posted, before anything is stored. Returns every reason, so the claimant can fix
 * them all at once. An upload the server itself rejected (too large for PHP) is reported too.
 *
 * @param array $files $_FILES.
 * @return string[]
 */
function dw_evidence_validate_post( array $files ): array {
	$errors = array();
	foreach ( DW_EVIDENCE_FIELDS as $field => $kind ) {
		$list = dw_evidence_files_list( $files[ $field ] ?? null );
		$k    = dw_evidence_kinds()[ $kind ];
		if ( count( $list ) > (int) $k['files'] ) {
			$errors[] = sprintf( '%s: at most %d file(s).', $k['label'], (int) $k['files'] );
			$list     = array_slice( $list, 0, (int) $k['files'] );
		}
		foreach ( $list as $f ) {
			if ( UPLOAD_ERR_OK !== $f['error'] ) {
				$errors[] = sprintf( '%s: %s', $k['label'], in_array( $f['error'], array( UPLOAD_ERR_INI_SIZE, UPLOAD_ERR_FORM_SIZE ), true ) ? 'the file is too large for this server.' : 'the upload did not finish. Try again.' );
				continue;
			}
			$why = dw_evidence_problem( $f['tmp_name'], $f['name'], $f['size'], $kind );
			if ( '' !== $why ) {
				$errors[] = $why;
			}
		}
	}
	return array_values( array_unique( $errors ) );
}

/**
 * Store the built-in form's files (already validated) and attach them to a claim.
 *
 * @param int   $claim_id aw_claim ID.
 * @param array $files    $_FILES.
 * @return string[] Problems met while storing (a full disk, say). Empty when all was kept.
 */
function dw_evidence_store_post( int $claim_id, array $files ): array {
	$have = array();
	$errs = array();
	foreach ( DW_EVIDENCE_FIELDS as $field => $kind ) {
		$k = dw_evidence_kinds()[ $kind ];
		foreach ( array_slice( dw_evidence_files_list( $files[ $field ] ?? null ), 0, (int) $k['files'] ) as $f ) {
			$name = dw_evidence_commit( $f['tmp_name'], $f['name'], $kind );
			if ( is_wp_error( $name ) ) {
				$errs[] = $k['label'] . ': ' . $name->get_error_message();
				continue;
			}
			$have[ $kind ][] = $name;
		}
	}
	if ( $have ) {
		dw_evidence_set( $claim_id, $have );
	}
	return $errs;
}

/**
 * A claim's evidence: kind => list of stored names.
 *
 * @param int $claim_id aw_claim ID.
 * @return array
 */
function dw_evidence_get( int $claim_id ): array {
	$e = (array) json_decode( (string) get_post_meta( $claim_id, '_dw_claim_evidence', true ), true );
	$o = array();
	foreach ( array( 'logo', 'photos', 'proof' ) as $kind ) {
		$o[ $kind ] = array_values( array_filter( (array) ( $e[ $kind ] ?? array() ), 'is_string' ) );
	}
	return $o;
}

/**
 * Save a claim's evidence.
 *
 * @param int   $claim_id aw_claim ID.
 * @param array $have     kind => names.
 */
function dw_evidence_set( int $claim_id, array $have ): void {
	update_post_meta( $claim_id, '_dw_claim_evidence', wp_json_encode( $have ) );
}

/**
 * The folders under uploads where a form provider saves the files its fields collect. Fluent Forms uses
 * uploads/fluentform. A provider that uses another folder adds it with this filter.
 *
 * @return string[]
 */
function dw_evidence_provider_dirs(): array {
	return array_values( array_filter( array_map( 'strval', (array) apply_filters( 'directoryweb_evidence_provider_dirs', array( 'fluentform' ) ) ) ) );
}

/**
 * Copy a file a form provider saved into the private folder, after the same checks as a direct upload. The path must
 * lie inside the site's uploads folder: a provider URL is mapped to a path, never fetched over HTTP.
 *
 * @param string $url_or_path URL under the uploads folder, or a path inside it.
 * @param string $kind        logo | photos | proof.
 * @return string|WP_Error Stored name.
 */
function dw_evidence_import_path( string $url_or_path, string $kind ) {
	$up   = wp_upload_dir( null, false );
	$base = wp_normalize_path( untrailingslashit( $up['basedir'] ) );
	$src  = $url_or_path;
	if ( 0 === strpos( $src, untrailingslashit( $up['baseurl'] ) . '/' ) ) {
		$src = $base . '/' . substr( $src, strlen( untrailingslashit( $up['baseurl'] ) ) + 1 );
	}
	$real = realpath( wp_normalize_path( rawurldecode( $src ) ) );
	$real = false === $real ? '' : wp_normalize_path( $real );
	// Only the folders a form provider saves uploads in. Any other file under uploads (the media library, another
	// plugin's files, our own private folder) is refused, so a claimant cannot name one in a text field.
	$ok = false;
	foreach ( dw_evidence_provider_dirs() as $sub ) {
		if ( '' !== $real && 0 === strpos( $real, $base . '/' . trim( $sub, '/' ) . '/' ) ) {
			$ok = true;
			break;
		}
	}
	if ( ! $ok || false !== strpos( $real, '/directoryweb-private/' ) ) {
		return new WP_Error( 'dw_evidence_path', 'That file is not in a form plugin\'s upload folder.' );
	}
	$why = dw_evidence_problem( $real, basename( $real ), (int) filesize( $real ), $kind );
	return '' !== $why ? new WP_Error( 'dw_evidence_refused', $why ) : dw_evidence_commit( $real, basename( $real ), $kind );
}

/**
 * Serve a stored file to a DirectoryWeb manager.
 */
function dw_evidence_serve(): void {
	$f = isset( $_GET['f'] ) ? sanitize_file_name( wp_unslash( $_GET['f'] ) ) : ''; // phpcs:ignore WordPress.Security.NonceVerification -- checked below
	if ( ! current_user_can( DIRECTORYWEB_CAP ) || ! isset( $_GET['_wpnonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_GET['_wpnonce'] ) ), 'dw_evidence_' . $f ) ) { // phpcs:ignore WordPress.WP.Capabilities.Unknown
		wp_die( esc_html__( 'Not allowed.', 'directoryweb' ), '', array( 'response' => 403 ) );
	}
	$bytes = dw_evidence_read( $f );
	if ( '' === $bytes ) {
		$gone = '' === dw_evidence_path( $f );
		wp_die( esc_html( $gone ? __( 'File not found.', 'directoryweb' ) : __( 'This file cannot be opened. It was saved with different site security keys (the salts in wp-config.php changed) or it is damaged.', 'directoryweb' ) ), '', array( 'response' => $gone ? 404 : 500 ) );
	}
	$pdf = '.pdf' === substr( $f, -4 );
	nocache_headers();
	header( 'X-Content-Type-Options: nosniff' );
	header( 'Content-Security-Policy: default-src \'none\'; img-src \'self\'; style-src \'unsafe-inline\'; sandbox' );
	header( 'Content-Type: ' . ( $pdf ? 'application/pdf' : 'image/png' ) );
	header( 'Content-Disposition: ' . ( $pdf ? 'attachment' : 'inline' ) . '; filename="' . $f . '"' );
	header( 'Content-Length: ' . strlen( $bytes ) );
	echo $bytes; // phpcs:ignore WordPress.Security.EscapeOutput -- a stored image or PDF, sent with nosniff and a sandboxing CSP
	exit;
}
add_action( 'admin_post_dw_evidence_file', 'dw_evidence_serve' );

/**
 * The evidence as review rows: one link per file, a thumbnail for an image.
 *
 * @param array $ev dw_evidence_get().
 * @return string HTML (escaped).
 */
function dw_evidence_review_html( array $ev ): string {
	$out = '';
	foreach ( dw_evidence_kinds() as $kind => $k ) {
		foreach ( (array) ( $ev[ $kind ] ?? array() ) as $i => $name ) {
			$link = dw_evidence_link( $name );
			if ( '' === $link ) {
				continue;
			}
			$pdf  = '.pdf' === substr( $name, -4 );
			$out .= '<p><strong>' . esc_html( $k['label'] ) . ' ' . ( (int) $i + 1 ) . '</strong>: '
				. ( $pdf ? '<a href="' . esc_url( $link ) . '" target="_blank" rel="noopener">' . esc_html__( 'Open the PDF', 'directoryweb' ) . '</a>' : '<a href="' . esc_url( $link ) . '" target="_blank" rel="noopener"><img src="' . esc_url( $link ) . '" alt="" width="80" height="80" style="object-fit:contain;vertical-align:middle"></a>' )
				. '</p>';
		}
	}
	return '' !== $out ? $out : '<p>' . esc_html__( 'No files were sent with this claim.', 'directoryweb' ) . '</p>';
}

/**
 * Remove a claim's stored files (a deleted claim leaves no evidence behind).
 *
 * @param int $post_id Deleted post ID.
 */
function dw_evidence_purge( $post_id ): void {
	if ( 'aw_claim' !== get_post_type( (int) $post_id ) ) {
		return;
	}
	foreach ( dw_evidence_get( (int) $post_id ) as $names ) {
		foreach ( $names as $n ) {
			$p = dw_evidence_path( $n );
			if ( '' !== $p ) {
				wp_delete_file( $p );
			}
		}
	}
}
add_action( 'before_delete_post', 'dw_evidence_purge' );
