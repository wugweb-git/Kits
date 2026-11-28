<?php
/**
 * Kits by Wugweb Onboarding & Setup Wizard.
 *
 * Benchmark: Astra, Kadence, GeneratePress, Create Block Theme.
 * Provides a 1-click guided setup flow for:
 * 1. Site Identity (Logo upload via wp.media, Site Title, Tagline).
 * 2. Style Variations & Palettes (default, slate, forest, dark).
 * 3. Typography Pairings.
 * 4. Starter Patterns Ingestion & Activation.
 *
 * @package kits-core
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action( 'admin_menu', 'kits_onboarding_menu', 20 );

/**
 * Register Onboarding wizard page in admin menu.
 */
function kits_onboarding_menu() {
	add_submenu_page(
		KITS_MENU,
		__( 'Setup Wizard', 'kits-core' ),
		__( 'Setup Wizard', 'kits-core' ),
		'manage_options',
		'kits-onboarding',
		'kits_onboarding_page'
	);
}

/**
 * Enqueue media and styles for onboarding screen.
 */
add_action(
	'admin_enqueue_scripts',
	function ( $hook ) {
		if ( false === strpos( $hook, 'kits-onboarding' ) ) {
			return;
		}
		wp_enqueue_media();
		if ( wp_style_is( 'kits-shell', 'registered' ) ) {
			wp_enqueue_style( 'kits-shell' );
		}
		// The wizard in the Kits look (black, white, greys): cards, big step titles, black buttons.
		wp_register_style( 'kits-onboarding-look', false, array(), KITS_CORE_LOADED );
		wp_enqueue_style( 'kits-onboarding-look' );
		wp_add_inline_style(
			'kits-onboarding-look',
			implode(
				"\n",
				array(
					'.kits-onboarding-wrap{max-width:980px;color:#2b2b2b}',
					'.kits-onboarding-wrap>h1{font-size:28px;font-weight:700;letter-spacing:-.02em;color:#0a0a0a;margin:8px 0 6px}',
					'.kits-onboarding-wrap>.description{font-size:14px;color:#6b6b6b;margin:0 0 8px}',
					'.kits-onboarding-wrap .kits-action-row{background:#fff;border:1px solid #e6e6e6;border-radius:14px;padding:24px;margin:0 0 16px;box-shadow:none}',
					'.kits-onboarding-wrap .kits-action-row__title{display:block;font-size:18px!important;font-weight:700;color:#0a0a0a;letter-spacing:-.01em}',
					'.kits-onboarding-wrap .kits-action-row__desc{color:#6b6b6b;margin:4px 0 0}',
					'.kits-onboarding-wrap input[type=text]{border:1px solid #d6d6d6;border-radius:8px;padding:8px 12px;min-height:40px}',
					'.kits-onboarding-wrap input[type=text]:focus{border-color:#0a0a0a;box-shadow:0 0 0 1px #0a0a0a}',
					'.kits-onboarding-wrap .button{border-radius:8px;border-color:#d6d6d6;color:#0a0a0a;background:#fff}',
					'.kits-onboarding-wrap .button-primary{background:#0a0a0a;border-color:#0a0a0a;color:#fff}',
					'.kits-onboarding-wrap .button-primary:hover{background:#2b2b2b;border-color:#2b2b2b;color:#fff}',
					'.kits-onboarding-wrap input[type=radio]:checked::before{background-color:#0a0a0a!important}',
					'.kits-onboarding-wrap input[type=radio]:focus{border-color:#0a0a0a;box-shadow:0 0 0 1px #0a0a0a}',
				)
			)
		);
	}
);

/**
 * Handle Onboarding POST submission.
 */
add_action(
	'admin_init',
	function () {
		if ( ! isset( $_POST['kits_onboarding_nonce'] ) ) {
			return;
		}
		if ( ! wp_verify_nonce( sanitize_key( wp_unslash( $_POST['kits_onboarding_nonce'] ) ), 'kits_onboarding_save' ) ) {
			wp_die( esc_html__( 'Security check failed.', 'kits-core' ) );
		}
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( esc_html__( 'Permission denied.', 'kits-core' ) );
		}

		if ( isset( $_POST['blogname'] ) ) {
			update_option( 'blogname', sanitize_text_field( wp_unslash( $_POST['blogname'] ) ) );
		}
		if ( isset( $_POST['blogdescription'] ) ) {
			update_option( 'blogdescription', sanitize_text_field( wp_unslash( $_POST['blogdescription'] ) ) );
		}
		if ( isset( $_POST['site_logo'] ) ) {
			$logo_id = (int) $_POST['site_logo'];
			set_theme_mod( 'custom_logo', $logo_id );
		}
		if ( isset( $_POST['kits_style_variation'] ) ) {
			$variation = sanitize_key( wp_unslash( $_POST['kits_style_variation'] ) );
			if ( in_array( $variation, array( 'default', 'slate', 'forest', 'dark' ), true ) ) {
				$confirmed = ! empty( $_POST['kits_confirm_default'] );
				if ( 'default' === $variation && ! $confirmed ) {
					$variation = ''; // Kits Default would wipe the saved styles: only with the confirmation box ticked.
				}
				if ( '' !== $variation ) {
					update_option( 'kits_active_style_variation', $variation );
					kits_onboarding_apply_style_variation( $variation );
				}
			}
		}

		wp_safe_redirect(
			add_query_arg(
				array(
					'page'    => 'kits-onboarding',
					'updated' => '1',
				),
				admin_url( 'admin.php' )
			)
		);
		exit;
	}
);

/**
 * Render Onboarding Wizard.
 */
function kits_onboarding_page() {
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}

	$logo_id  = (int) get_theme_mod( 'custom_logo' );
	$logo_url = $logo_id ? wp_get_attachment_image_url( $logo_id, 'full' ) : '';
	$active_v = get_option( 'kits_active_style_variation', 'default' );
	if ( 'ink' === $active_v ) {
		$active_v = 'dark'; // The variation was called ink before 1.3.0.
	}
	$site_name = get_option( 'blogname' );
	$site_desc = get_option( 'blogdescription' );

	$variations = array(
		'default' => array(
			'title'       => __( 'Kits Default', 'kits-core' ),
			'description' => __( 'Clean neutral palette with cool slate-blue accent.', 'kits-core' ),
			'colors'      => array( '#191919', '#2E2E2E', '#C6D2E0', '#F4F4F4' ),
		),
		'slate'   => array(
			'title'       => __( 'Executive Slate', 'kits-core' ),
			'description' => __( 'Crisp slate-blue ink and neutral canvas for editorial publications.', 'kits-core' ),
			'colors'      => array( '#191919', '#334E68', '#C6D2E0', '#F4F4F4' ),
		),
		'forest'  => array(
			'title'       => __( 'Deep Forest', 'kits-core' ),
			'description' => __( 'Nature and wildlife oriented earthy tones with emerald accents.', 'kits-core' ),
			'colors'      => array( '#191919', '#1E6B43', '#A8D5B5', '#F4F4F4' ),
		),
		'dark'    => array(
			'title'       => __( 'Dark', 'kits-core' ),
			'description' => __( 'High-contrast dark canvas with bright sky-blue accents.', 'kits-core' ),
			'colors'      => array( '#0D1117', '#21262D', '#79B8FF', '#F0F6FC' ),
		),
	);

	echo '<div class="wrap kits-onboarding-wrap">';
	echo '<h1>' . esc_html__( 'Kits by Wugweb — 1-Click Setup Wizard', 'kits-core' ) . '</h1>';

	if ( isset( $_GET['updated'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended
		echo '<div class="notice notice-success is-dismissible"><p>' . esc_html__( 'Site setup options updated successfully!', 'kits-core' ) . '</p></div>';
	}

	echo '<p class="description">' . esc_html__( 'Configure your site brand identity, choose your design system palette variation, and launch starter templates in seconds.', 'kits-core' ) . '</p>';

	echo '<form method="post" action="" class="kits-action-list" style="margin-top:20px;max-width:960px;">';
	wp_nonce_field( 'kits_onboarding_save', 'kits_onboarding_nonce' );

	// Step 1: Site Identity.
	echo '<div class="kits-action-row" style="flex-direction:column;align-items:flex-start;gap:16px;">';
	echo '<div class="kits-action-row__main">';
	echo '<span class="kits-action-row__title" style="font-size:16px;">' . esc_html__( 'Step 1: Brand Identity & Logo', 'kits-core' ) . '</span>';
	echo '<p class="kits-action-row__desc">' . esc_html__( 'Set your publication name, tagline and upload your high-resolution SVG or PNG logo.', 'kits-core' ) . '</p>';
	echo '</div>';

	echo '<div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;width:100%;">';
	echo '<div>';
	echo '<label style="display:block;font-weight:600;margin-bottom:6px;">' . esc_html__( 'Site Title', 'kits-core' ) . '</label>';
	echo '<input type="text" name="blogname" value="' . esc_attr( $site_name ) . '" class="regular-text" style="width:100%;">';
	echo '</div>';
	echo '<div>';
	echo '<label style="display:block;font-weight:600;margin-bottom:6px;">' . esc_html__( 'Tagline', 'kits-core' ) . '</label>';
	echo '<input type="text" name="blogdescription" value="' . esc_attr( $site_desc ) . '" class="regular-text" style="width:100%;">';
	echo '</div>';
	echo '</div>';

	echo '<div style="margin-top:10px;">';
	echo '<label style="display:block;font-weight:600;margin-bottom:6px;">' . esc_html__( 'Site Logo', 'kits-core' ) . '</label>';
	echo '<input type="hidden" name="site_logo" id="kits_site_logo_id" value="' . esc_attr( $logo_id ) . '">';
	echo '<div id="kits_logo_preview" style="margin-bottom:10px;' . ( $logo_url ? '' : 'display:none;' ) . '">';
	echo '<img id="kits_logo_img" src="' . esc_url( $logo_url ) . '" style="max-height:60px;background:#f8fafc;padding:8px;border:1px solid #cbd5e1;border-radius:4px;">';
	echo '</div>';
	echo '<button type="button" class="button" id="kits_upload_logo_btn">' . esc_html__( 'Select or Upload Logo', 'kits-core' ) . '</button> ';
	if ( $logo_id ) {
		echo '<button type="button" class="button button-link-delete" id="kits_remove_logo_btn">' . esc_html__( 'Remove Logo', 'kits-core' ) . '</button>';
	}
	echo '</div>';
	echo '</div>';

	// Step 2: Design System Style Variation.
	echo '<div class="kits-action-row" style="flex-direction:column;align-items:flex-start;gap:16px;">';
	echo '<div class="kits-action-row__main">';
	echo '<span class="kits-action-row__title" style="font-size:16px;">' . esc_html__( 'Step 2: Theme Style Variation & Color Palette', 'kits-core' ) . '</span>';
	echo '<p class="kits-action-row__desc">' . esc_html__( 'Choose one of the curated theme.json v3 style variations. Fully switchable at any time.', 'kits-core' ) . '</p>';
	echo '</div>';

	echo '<p class="description">' . esc_html__( 'Choosing a variation replaces your saved Global Styles. The previous styles are kept once, and can be restored below.', 'kits-core' ) . '</p>';
	echo '<div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:16px;width:100%;">';
	foreach ( $variations as $slug => $var ) {
		$checked = ( $slug === $active_v ) ? 'checked' : '';
		$border  = ( $slug === $active_v ) ? '#0a0a0a' : '#e6e6e6';
		echo '<label style="border:2px solid ' . esc_attr( $border ) . ';padding:16px;border-radius:12px;cursor:pointer;background:#fff;display:block;">';
		echo '<input type="radio" name="kits_style_variation" value="' . esc_attr( $slug ) . '" ' . esc_attr( $checked ) . ' style="margin-right:8px;">';
		echo '<strong>' . esc_html( $var['title'] ) . '</strong>';
		echo '<div style="display:flex;gap:6px;margin:10px 0;">';
		foreach ( $var['colors'] as $c ) {
			echo '<span style="display:inline-block;width:22px;height:22px;border-radius:50%;background:' . esc_attr( $c ) . ';border:1px solid rgba(0,0,0,0.1);"></span>';
		}
		echo '</div>';
		echo '<p style="margin:0;font-size:12px;color:#64748b;">' . esc_html( $var['description'] ) . '</p>';
		echo '</label>';
	}
	echo '</div>';
	echo '</div>';

	echo '<label style="display:block;margin-top:-4px;"><input type="checkbox" name="kits_confirm_default" value="1"> ' . esc_html__( 'Confirm: Kits Default clears all saved Global Styles changes.', 'kits-core' ) . '</label>';

	// Step 3: Starter Block Patterns & Full Site Editor.
	echo '<div class="kits-action-row" style="align-items:center;justify-content:space-between;">';
	echo '<div class="kits-action-row__main">';
	echo '<span class="kits-action-row__title" style="font-size:16px;">' . esc_html__( 'Step 3: Starter Patterns & Site Editor', 'kits-core' ) . '</span>';
	echo '<p class="kits-action-row__desc">' . esc_html__( 'Launch Full Site Editing to customize headers, footers, query loops, and banner block patterns.', 'kits-core' ) . '</p>';
	echo '</div>';
	echo '<a href="' . esc_url( admin_url( 'site-editor.php' ) ) . '" class="button button-secondary" target="_blank">' . esc_html__( 'Open Site Editor ↗', 'kits-core' ) . '</a>';
	echo '</div>';

	echo '<div style="margin-top:20px;display:flex;gap:12px;align-items:center;">';
	echo '<button type="submit" class="button button-primary button-hero">' . esc_html__( 'Save & Apply Setup', 'kits-core' ) . '</button>';
	echo '<a href="' . esc_url( admin_url( 'admin.php?page=kits' ) ) . '" class="button button-secondary button-hero">' . esc_html__( 'Return to Kits Home', 'kits-core' ) . '</a>';
	echo '</div>';

	echo '</form>';

	if ( kits_onboarding_has_backup() ) {
		echo '<form method="post" action="' . esc_url( admin_url( 'admin-post.php' ) ) . '" style="margin-top:12px;">';
		echo '<input type="hidden" name="action" value="kits_restore_global_styles">';
		wp_nonce_field( 'kits_restore_global_styles', 'kits_restore_nonce' );
		echo '<button type="submit" class="button">' . esc_html__( 'Restore previous Global Styles', 'kits-core' ) . '</button> ';
		echo '<span class="description">' . esc_html__( 'Puts back the styles as they were before the last change here.', 'kits-core' ) . '</span>';
		echo '</form>';
	}
	echo '</div>';

	// Media upload JS script.
	ob_start();
	?>
	jQuery(document).ready(function($){
		var frame;
		$('#kits_upload_logo_btn').on('click', function(e){
			e.preventDefault();
			if (frame) { frame.open(); return; }
			frame = wp.media({
				title: '<?php echo esc_js( __( 'Select or Upload Site Logo', 'kits-core' ) ); ?>',
				button: { text: '<?php echo esc_js( __( 'Use this Logo', 'kits-core' ) ); ?>' },
				multiple: false
			});
			frame.on('select', function(){
				var attachment = frame.state().get('selection').first().toJSON();
				$('#kits_site_logo_id').val(attachment.id);
				$('#kits_logo_img').attr('src', attachment.url);
				$('#kits_logo_preview').show();
			});
			frame.open();
		});
		$('#kits_remove_logo_btn').on('click', function(e){
			e.preventDefault();
			$('#kits_site_logo_id').val('');
			$('#kits_logo_preview').hide();
			$(this).hide();
		});
	});
	<?php
	wp_register_script( 'kits-onboarding-logo', false, array( 'jquery' ), KITS_CORE_VERSION, true );
	wp_enqueue_script( 'kits-onboarding-logo' );
	wp_add_inline_script( 'kits-onboarding-logo', (string) ob_get_clean() );
}

/**
 * Applies a theme style variation (default, slate, forest, dark) to the active theme's Global Styles record.
 *
 * @param string $slug Variation slug matching styles/<slug>.json, or 'default'.
 * @return bool Whether Global Styles was updated.
 */
function kits_onboarding_apply_style_variation( string $slug ): bool {
	if ( ! class_exists( 'WP_Theme_JSON_Resolver' ) || ! function_exists( 'wp_get_theme' ) ) {
		return false;
	}
	$post = WP_Theme_JSON_Resolver::get_user_data_from_wp_global_styles( wp_get_theme(), true );
	if ( empty( $post['ID'] ) ) {
		return false;
	}

	$payload = array(
		'version'                     => class_exists( 'WP_Theme_JSON' ) ? WP_Theme_JSON::LATEST_SCHEMA : 3,
		'isGlobalStylesUserThemeJSON' => true,
	);

	if ( 'default' !== $slug ) {
		$file = get_template_directory() . '/styles/' . sanitize_file_name( $slug ) . '.json';
		if ( ! is_readable( $file ) ) {
			return false;
		}
		$raw = json_decode( (string) file_get_contents( $file ), true ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents -- local theme style variation JSON
		if ( ! is_array( $raw ) ) {
			return false;
		}
		if ( ! empty( $raw['settings'] ) && is_array( $raw['settings'] ) ) {
			$payload['settings'] = $raw['settings'];
		}
		if ( ! empty( $raw['styles'] ) && is_array( $raw['styles'] ) ) {
			$payload['styles'] = $raw['styles'];
		}
	}

	// One-level backup of what is about to be overwritten.
	$current = get_post( (int) $post['ID'] );
	if ( $current && '' !== (string) $current->post_content ) {
		update_option( 'kits_global_styles_backup', (string) $current->post_content, false );
	}

	$res = wp_update_post(
		array(
			'ID'           => (int) $post['ID'],
			'post_content' => wp_slash( wp_json_encode( $payload ) ), // wp_update_post() expects slashed data; without it a backslash in the JSON is lost.
		)
	);
	WP_Theme_JSON_Resolver::clean_cached_data();
	return ! is_wp_error( $res ) && $res > 0;
}

/** Whether a Global Styles backup is stored. */
function kits_onboarding_has_backup(): bool {
	return '' !== (string) get_option( 'kits_global_styles_backup', '' );
}

/**
 * Puts the backed-up Global Styles back (one level: the backup is replaced by what was just overwritten).
 *
 * @return bool Whether Global Styles was restored.
 */
function kits_onboarding_restore_global_styles(): bool {
	$backup = (string) get_option( 'kits_global_styles_backup', '' );
	if ( '' === $backup || ! class_exists( 'WP_Theme_JSON_Resolver' ) || ! function_exists( 'wp_get_theme' ) ) {
		return false;
	}
	$post = WP_Theme_JSON_Resolver::get_user_data_from_wp_global_styles( wp_get_theme(), true );
	if ( empty( $post['ID'] ) ) {
		return false;
	}
	$current = get_post( (int) $post['ID'] );
	$res     = wp_update_post(
		array(
			'ID'           => (int) $post['ID'],
			'post_content' => wp_slash( $backup ),
		)
	);
	WP_Theme_JSON_Resolver::clean_cached_data();
	if ( is_wp_error( $res ) || $res < 1 ) {
		return false;
	}
	update_option( 'kits_global_styles_backup', $current ? (string) $current->post_content : '', false );
	return true;
}

add_action(
	'admin_post_kits_restore_global_styles',
	function () {
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( esc_html__( 'Permission denied.', 'kits-core' ), 403 );
		}
		check_admin_referer( 'kits_restore_global_styles', 'kits_restore_nonce' );
		kits_onboarding_restore_global_styles();
		wp_safe_redirect(
			add_query_arg(
				array(
					'page'     => 'kits-onboarding',
					'restored' => '1',
				),
				admin_url( 'admin.php' )
			)
		);
		exit;
	}
);
