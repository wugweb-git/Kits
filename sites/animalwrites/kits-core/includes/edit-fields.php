<?php
/**
 * Edit fields that only the Animal Writes site uses, moved out of Kits Core 1.4.1 (includes/admin-layer/edit-fields.php),
 * code unchanged apart from where the hooks are added:
 *
 * - Library item (Document box): Dated (aw_legal_dated, item-head.php).
 * - Campaign (Outcome box): Metrics (aw_campaign_metrics JSON, campaign-record.php), one line per metric.
 *
 * Both are off unless a site names the types: kits_library_post_type (this file's filter, 'aw_legal' by default at priority 5, so a
 * later filter can change or empty it) and kits_campaign_post_type (Kits Core's). The filter animalwrites_edit_fields
 * (default: dated and metrics) switches either one off. Loaded by kits-core-site.php only with Kits Core 1.4.1 or later:
 * older Kits Cores still carry these functions themselves.
 *
 * @package animalwrites-kits-core
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** The site's Library post type ('' when it has none). */
function kits_library_post_type(): string {
	return (string) apply_filters( 'kits_library_post_type', '' );
}

/**
 * Which of this file's fields the site wants: 'dated', 'metrics'.
 *
 * @return string[]
 */
function kits_edit_fields_site_enabled(): array {
	return array_map( 'strval', (array) apply_filters( 'animalwrites_edit_fields', array( 'dated', 'metrics' ) ) );
}

// 'aw_legal' is the Library type; a site layer or the tenant's own filter can still change it.
add_filter( 'kits_library_post_type', fn( $type ) => '' === (string) $type ? 'aw_legal' : $type, 5 );

// The hooks named after the site's types are added once the types are known (the filters are set while the plugins load).
add_action(
	'init',
	function () {
		$on      = kits_edit_fields_site_enabled();
		$library = kits_library_post_type();
		if ( '' !== $library && in_array( 'dated', $on, true ) ) {
			add_action( 'save_post_' . $library, 'kits_edit_fields_dated_save' );
		}
		$campaign = function_exists( 'kits_campaign_post_type' ) ? kits_campaign_post_type() : '';
		if ( '' !== $campaign && in_array( 'metrics', $on, true ) ) {
			add_action( 'save_post_' . $campaign, 'kits_edit_fields_metrics_save', 20 );
		}
	},
	1
);

/* ---------- Library item: Dated ---------- */

add_action(
	'acf/render_field/key=field_aw_legal_msg_item',
	function () {
		global $post;
		if ( ! $post instanceof WP_Post || '' === kits_library_post_type() || kits_library_post_type() !== $post->post_type || ! in_array( 'dated', kits_edit_fields_site_enabled(), true ) ) {
			return;
		}
		wp_nonce_field( 'kits_edit_fields_dated', 'kits_edit_fields_dated_nonce' );
		printf(
			'<p><label for="aw-legal-dated">%1$s</label><br><input type="date" id="aw-legal-dated" name="aw_legal_dated" value="%2$s"></p>',
			esc_html( 'Dated (the document\'s own date, when it differs from its publication date). Empty: none' ),
			esc_attr( (string) get_post_meta( $post->ID, 'aw_legal_dated', true ) )
		);
	},
	20
);

/**
 * Library item: saves Dated.
 *
 * @param int $post_id Post ID.
 */
function kits_edit_fields_dated_save( $post_id ): void {
	if ( wp_is_post_revision( $post_id ) || ! isset( $_POST['kits_edit_fields_dated_nonce'] ) || ! wp_verify_nonce( sanitize_key( wp_unslash( $_POST['kits_edit_fields_dated_nonce'] ) ), 'kits_edit_fields_dated' ) || ! current_user_can( 'edit_post', $post_id ) ) {
		return;
	}
		$v   = sanitize_text_field( wp_unslash( $_POST['aw_legal_dated'] ?? '' ) );
		$now = (string) get_post_meta( $post_id, 'aw_legal_dated', true );
	if ( $v === $now ) {
		return;
	}
	if ( '' === $v ) {
		delete_post_meta( $post_id, 'aw_legal_dated' );
	} elseif ( kits_edit_fields_is_day( $v ) ) {
		update_post_meta( $post_id, 'aw_legal_dated', $v );
	}
}

/**
 * Whether a text is a real day as Y-m-d.
 *
 * @param string $v Text.
 */
function kits_edit_fields_is_day( string $v ): bool {
	$d = DateTime::createFromFormat( '!Y-m-d', $v );
	return $d && $d->format( 'Y-m-d' ) === $v;
}

/* ---------- Campaign: metrics ---------- */

/** The fields of one metric line, in order. */
const KITS_EDIT_METRIC_FIELDS = array( 'key', 'label', 'value', 'count', 'threshold', 'verified', 'stale_days', 'attribution', 'source_label', 'source_url' );

/**
 * A campaign's metrics as lines: "key | label | value | count | threshold | verified | stale days | attribution |
 * source | source link".
 *
 * @param int $id Campaign ID.
 */
function kits_edit_fields_metric_lines( $id ): string {
	$list  = json_decode( (string) get_post_meta( $id, 'aw_campaign_metrics', true ), true );
	$lines = array();
	foreach ( is_array( $list ) ? $list : array() as $m ) {
		$lines[] = implode( ' | ', array_map( fn( $k ) => (string) ( ( (array) $m )[ $k ] ?? '' ), KITS_EDIT_METRIC_FIELDS ) );
	}
	return implode( "\n", $lines );
}

/**
 * Lines back to the metric list, or null when a line cannot be read.
 *
 * @param string $text Posted lines.
 * @return array|null
 */
function kits_edit_fields_metric_list( string $text ) {
	$out = array();
	foreach ( preg_split( '/\R/', $text ) as $line ) {
		if ( '' === trim( $line ) ) {
			continue;
		}
		$p = array_map( 'trim', explode( '|', $line ) );
		if ( count( $p ) > 10 ) {
			return null;
		}
		$m = array_combine( KITS_EDIT_METRIC_FIELDS, array_pad( $p, 10, '' ) );
		if ( '' === sanitize_key( $m['key'] ) || ( '' !== $m['verified'] && ! kits_edit_fields_is_day( $m['verified'] ) ) || ( '' !== $m['source_url'] && ! wp_http_validate_url( $m['source_url'] ) ) ) {
			return null;
		}
		$row = array();
		foreach ( KITS_EDIT_METRIC_FIELDS as $k ) {
			if ( '' === $m[ $k ] ) {
				continue; // a field left empty is not stored, as before
			}
			if ( in_array( $k, array( 'threshold', 'stale_days' ), true ) ) {
				$row[ $k ] = (int) $m[ $k ];
			} elseif ( 'count' === $k ) {
				$row[ $k ] = 0 + (float) $m[ $k ];
			} elseif ( 'source_url' === $k ) {
				$row[ $k ] = esc_url_raw( $m[ $k ] );
			} else {
				$row[ $k ] = 'key' === $k ? sanitize_key( $m[ $k ] ) : sanitize_text_field( $m[ $k ] );
			}
		}
		$out[] = $row;
	}
	return $out;
}

/**
 * The Metrics field, inside the Outcome box after Real-world impact (campaign-record.php aw_camp_record_box()).
 *
 * @param WP_Post $post Campaign.
 */
function kits_edit_fields_metrics_box( $post ): void {
	wp_nonce_field( 'kits_edit_fields_metrics', 'kits_edit_fields_metrics_nonce' );
	printf(
		'<p><label for="aw-camp-metrics">%1$s</label><br><textarea class="large-text code" rows="4" wrap="off" spellcheck="false" id="aw-camp-metrics" name="aw_campaign_metrics_lines">%2$s</textarea></p><p class="description">%3$s</p>',
		esc_html( 'Metrics' ),
		esc_textarea( kits_edit_fields_metric_lines( $post->ID ) ),
		esc_html( 'One per line: key | label | value | count | threshold | verified (YYYY-MM-DD) | stale after days | attribution | source | source link. A metric shows only once verified, and only when its count reaches the threshold. A line that cannot be read keeps all metrics as they were.' )
	);
}

/**
 * Campaign: saves the Metrics lines.
 *
 * @param int $id Post ID.
 */
function kits_edit_fields_metrics_save( $id ): void {
	if ( wp_is_post_revision( $id ) || ! isset( $_POST['kits_edit_fields_metrics_nonce'], $_POST['aw_campaign_metrics_lines'] ) || ! wp_verify_nonce( sanitize_key( wp_unslash( $_POST['kits_edit_fields_metrics_nonce'] ) ), 'kits_edit_fields_metrics' ) || ! current_user_can( 'edit_post', $id ) ) {
		return;
	}
		$text = str_replace( "\r\n", "\n", (string) wp_unslash( $_POST['aw_campaign_metrics_lines'] ) ); // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- each field is cleaned in kits_edit_fields_metric_list()
	if ( trim( $text ) === trim( kits_edit_fields_metric_lines( $id ) ) ) {
		return; // unchanged: the stored JSON stays byte for byte
	}
		$list = kits_edit_fields_metric_list( $text );
	if ( null === $list ) {
		return; // a line could not be read: nothing changes
	}
		$list ? update_post_meta( $id, 'aw_campaign_metrics', wp_slash( (string) wp_json_encode( $list ) ) ) : delete_post_meta( $id, 'aw_campaign_metrics' );
}
