<?php
/**
 * Standalone compatibility layer for DirectoryWeb when Kits Core is inactive.
 * Provides plugin-specific fallback implementations for UI primitives, formats, and REST permissions.
 *
 * @package directoryweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! defined( 'DIRECTORYWEB_FF_SOCIAL' ) ) {
	define(
		'DIRECTORYWEB_FF_SOCIAL',
		array(
			'l_instagram' => array( 'aw_instagram', 'https://www.instagram.com/%s/' ),
			'l_facebook'  => array( 'aw_facebook', 'https://www.facebook.com/%s' ),
			'l_x'         => array( 'aw_x', 'https://x.com/%s' ),
			'l_youtube'   => array( 'aw_youtube', 'https://www.youtube.com/@%s' ),
			'l_linkedin'  => array( 'aw_linkedin', 'https://www.linkedin.com/company/%s' ),
		)
	);
}

if ( ! defined( 'DIRECTORYWEB_FF_DATES' ) ) {
	define( 'DIRECTORYWEB_FF_DATES', defined( 'KITS_FF_DATES' ) ? KITS_FF_DATES : array( 'l_reg_date', 'l_awbi_rec', 'l_awbi_ren', 'l_awbi_valid' ) );
}

if ( ! defined( 'DIRECTORYWEB_FF_SOCIAL_HOSTS' ) ) {
	define(
		'DIRECTORYWEB_FF_SOCIAL_HOSTS',
		array(
			'l_instagram' => array( 'instagram\.com', '' ),
			'l_facebook'  => array( '(?:facebook|fb)\.com', '' ),
			'l_x'         => array( '(?:x|twitter)\.com', '' ),
			'l_youtube'   => array( 'youtube\.com', '@' ),
			'l_linkedin'  => array( 'linkedin\.com', 'company/' ),
		)
	);
}

if ( ! function_exists( 'directoryweb_count' ) ) {
	/**
	 * Formats a count badge.
	 *
	 * @param int|float|string $n Count.
	 * @return string
	 */
	function directoryweb_count( $n ) {
		if ( function_exists( 'kits_count' ) ) {
			return kits_count( $n );
		}
		return '<span class="kit-count">' . esc_html( number_format_i18n( (int) $n ) ) . '</span>';
	}
}

if ( ! function_exists( 'directoryweb_icon' ) ) {
	/**
	 * Renders an icon span.
	 *
	 * @param string $name  Icon name.
	 * @param string $class Additional CSS classes.
	 * @return string
	 */
	function directoryweb_icon( $name, $class = '' ) {
		if ( function_exists( 'kits_icon' ) ) {
			return kits_icon( $name, $class );
		}
		return '<span class="kit-ico kit-ico--' . esc_attr( $name ) . ( '' !== $class ? ' ' . esc_attr( $class ) : '' ) . '" aria-hidden="true"></span>';
	}
}

if ( ! function_exists( 'directoryweb_date' ) ) {
	/**
	 * Formats a date with standard calendar markup.
	 *
	 * @param string|int  $when  Timestamp or date string.
	 * @param string|null $fmt   Date format (null for site default).
	 * @param string      $class CSS class.
	 * @return string
	 */
	function directoryweb_date( $when, $fmt = null, $class = '' ) {
		if ( function_exists( 'kits_date' ) ) {
			return kits_date( $when, $fmt, $class );
		}
		$when = preg_match( '/^\d{8}$/', (string) $when ) ? substr( $when, 0, 4 ) . '-' . substr( $when, 4, 2 ) . '-' . substr( $when, 6, 2 ) : $when;
		$ts   = is_numeric( $when ) ? (int) $when : strtotime( (string) $when );
		if ( ! $ts ) {
			return '';
		}
		$fmt = null === $fmt ? (string) get_option( 'date_format', 'Y-m-d' ) : (string) $fmt;
		return '<span class="kit-date' . ( '' !== $class ? ' ' . esc_attr( $class ) : '' ) . '">' . directoryweb_icon( 'calendar' ) . '<time datetime="' . esc_attr( wp_date( 'Y-m-d', $ts ) ) . '">' . esc_html( wp_date( $fmt, $ts ) ) . '</time></span>';
	}
}

if ( ! function_exists( 'directoryweb_simple_table' ) ) {
	/**
	 * Fallback table renderer when Kits_Simple_Table is absent.
	 *
	 * @param string $plural Table identifier.
	 * @param array  $cols   Columns (key => label).
	 * @param array  $rows   Data rows (array of key => html).
	 * @param array  $opts   Options (empty, caption, etc.).
	 */
	function directoryweb_simple_table( $plural, array $cols, array $rows, array $opts = array() ) {
		if ( function_exists( 'kits_simple_table' ) ) {
			kits_simple_table( $plural, $cols, $rows, $opts );
			return;
		}
		echo '<table class="widefat striped ' . esc_attr( $plural ) . '">';
		if ( ! empty( $opts['caption'] ) ) {
			echo '<caption class="screen-reader-text">' . esc_html( $opts['caption'] ) . '</caption>';
		}
		echo '<thead><tr>';
		foreach ( $cols as $key => $label ) {
			echo '<th scope="col" class="manage-column column-' . esc_attr( $key ) . '">' . $label . '</th>';
		}
		echo '</tr></thead><tbody>';
		if ( empty( $rows ) ) {
			$msg = $opts['empty'] ?? __( 'No items found.', 'directoryweb' );
			echo '<tr><td colspan="' . esc_attr( (string) count( $cols ) ) . '">' . esc_html( $msg ) . '</td></tr>';
		} else {
			foreach ( $rows as $row ) {
				echo '<tr>';
				foreach ( $cols as $key => $label ) {
					$val = $row[ $key ] ?? '';
					echo '<td>' . $val . '</td>';
				}
				echo '</tr>';
			}
		}
		echo '</tbody></table>';
	}
}

if ( ! function_exists( 'directoryweb_use_component_style' ) ) {
	/**
	 * Fallback for component style registration.
	 *
	 * @param string $handle Style handle.
	 */
	function directoryweb_use_component_style( string $handle ): void {
		if ( function_exists( 'kits_use_component_style' ) ) {
			kits_use_component_style( $handle );
		}
	}
}

if ( ! function_exists( 'directoryweb_ff_phone10' ) ) {
	/**
	 * Extracts 10 digits from an Indian phone number string.
	 *
	 * @param mixed $v Value.
	 * @return string
	 */
	function directoryweb_ff_phone10( $v ) {
		if ( function_exists( 'kits_ff_phone10' ) ) {
			return kits_ff_phone10( $v );
		}
		$d = preg_replace( '/\D+/', '', (string) $v );
		if ( 12 === strlen( $d ) && 0 === strpos( $d, '91' ) ) {
			$d = substr( $d, 2 );
		} elseif ( 11 === strlen( $d ) && '0' === $d[0] ) {
			$d = substr( $d, 1 );
		}
		return preg_match( '/^[1-9]\d{9}$/', $d ) ? $d : '';
	}
}

if ( ! function_exists( 'directoryweb_ff_phone_store' ) ) {
	/**
	 * Normalizes a phone number for storage: "+91 98765 43210".
	 *
	 * @param mixed $v Value.
	 * @return string
	 */
	function directoryweb_ff_phone_store( $v ) {
		if ( function_exists( 'kits_ff_phone_store' ) ) {
			return kits_ff_phone_store( $v );
		}
		$d = directoryweb_ff_phone10( $v );
		return '' !== $d ? '+91 ' . substr( $d, 0, 5 ) . ' ' . substr( $d, 5 ) : trim( (string) $v );
	}
}

if ( ! function_exists( 'directoryweb_ff_social_user' ) ) {
	/**
	 * Extracts a social platform username.
	 *
	 * @param string $field Field key.
	 * @param mixed  $v     Value.
	 * @return string
	 */
	function directoryweb_ff_social_user( $field, $v ) {
		if ( function_exists( 'kits_ff_social_user' ) ) {
			return kits_ff_social_user( $field, $v );
		}
		$v = trim( (string) $v );
		if ( preg_match( '#^(?:https?://)?(?:[a-z]+\.)?[a-z.]+\.[a-z]+/#i', $v ) ) {
			$hosts = defined( 'KITS_FF_SOCIAL_HOSTS' ) ? KITS_FF_SOCIAL_HOSTS : ( defined( 'DIRECTORYWEB_FF_SOCIAL_HOSTS' ) ? DIRECTORYWEB_FF_SOCIAL_HOSTS : array() );
			$h     = $hosts[ $field ] ?? null;
			if ( ! $h || ! preg_match( '#^(?:https?://)?(?:[a-z]+\.)?' . $h[0] . '/' . preg_quote( $h[1], '#' ) . '([A-Za-z0-9._-]{1,100})/?(?:[?\#].*)?$#i', $v, $m ) ) {
				return '';
			}
			$v = $m[1];
		}
		$v = ltrim( $v, '@' );
		return preg_match( '/^[A-Za-z0-9._-]{1,100}$/', $v ) ? $v : '';
	}
}

if ( ! function_exists( 'directoryweb_ff_form' ) ) {
	/**
	 * Renders a Fluent Forms form.
	 *
	 * @param string $key Form key.
	 * @param array  $ctx Context.
	 * @return string
	 */
	function directoryweb_ff_form( $key, $ctx = array() ) {
		if ( function_exists( 'kits_ff_form' ) ) {
			return kits_ff_form( $key, $ctx );
		}
		$id = function_exists( 'kits_ff_id' ) ? (int) kits_ff_id( $key ) : 0;
		if ( ! $id ) {
			$forms = get_option( 'aw_ff_forms', array() );
			$id    = absint( $forms[ $key ] ?? 0 );
		}
		if ( ! $id && 'claim' === $key && function_exists( 'dw_claim_native_form' ) ) {
			$listing = $ctx['listing'] ?? 0;
			return dw_claim_native_form( is_object( $listing ) ? (int) $listing->ID : (int) $listing ); // no Fluent Forms form: the built-in claim form
		}
		if ( ! $id ) {
			return current_user_can( 'manage_options' ) ? '<p class="notice notice-warning">' . esc_html__( 'Claim form not configured. Select a form in DirectoryWeb Settings.', 'directoryweb' ) . '</p>' : '';
		}
		return do_shortcode( '[fluentform id="' . $id . '"]' );
	}
}

if ( ! function_exists( 'directoryweb_private_dir' ) ) {
	/**
	 * Returns the private upload directory path.
	 *
	 * @return string
	 */
	function directoryweb_private_dir(): string {
		if ( function_exists( 'kits_private_dir' ) ) {
			return kits_private_dir();
		}
		$upload = wp_upload_dir();
		$dir    = $upload['basedir'] . '/kits-private';
		if ( ! is_dir( $dir ) ) {
			wp_mkdir_p( $dir );
		}
		return $dir;
	}
}

if ( ! function_exists( 'directoryweb_preview_only_ids' ) ) {
	/**
	 * Preview IDs fallback.
	 *
	 * @return array
	 */
	function directoryweb_preview_only_ids(): array {
		if ( function_exists( 'kits_preview_only_ids' ) ) {
			return kits_preview_only_ids();
		}
		return array();
	}
}

if ( ! function_exists( 'directoryweb_scf_active' ) ) {
	/**
	 * Checks if SCF or ACF is active.
	 *
	 * @return bool
	 */
	function directoryweb_scf_active(): bool {
		if ( function_exists( 'kits_scf_active' ) ) {
			return (bool) kits_scf_active();
		}
		return function_exists( 'acf_add_local_field_group' );
	}
}

if ( ! function_exists( 'directoryweb_rest_can' ) ) {
	/**
	 * Permission callback for DirectoryWeb REST routes.
	 * Delegates to Kits Core when present, or native WP check.
	 *
	 * @param string $cap Capability.
	 * @return callable
	 */
	function directoryweb_rest_can( string $cap ): callable {
		if ( function_exists( 'kits_shell_rest_can' ) ) {
			return kits_shell_rest_can( $cap );
		}
		return function ( $request ) use ( $cap ) {
			if ( ! is_user_logged_in() ) {
				return new WP_Error( 'rest_not_logged_in', __( 'Sign in to use this.', 'directoryweb' ), array( 'status' => 401 ) );
			}
			$app = function_exists( 'rest_get_authenticated_app_password' ) && null !== rest_get_authenticated_app_password();
			if ( ! $app ) {
				$nonce = '';
				if ( $request instanceof WP_REST_Request ) {
					$nonce = (string) ( $request->get_header( 'X-WP-Nonce' ) ?? $request->get_param( '_wpnonce' ) ?? '' );
				} elseif ( is_object( $request ) && isset( $request->headers ) && is_array( $request->headers ) ) {
					$nonce = (string) ( $request->headers['X-WP-Nonce'] ?? '' );
				}
				if ( ! wp_verify_nonce( $nonce, 'wp_rest' ) ) {
					return new WP_Error( 'rest_cookie_invalid_nonce', __( 'The page has expired. Reload it and try again.', 'directoryweb' ), array( 'status' => 403 ) );
				}
			}
			if ( ! current_user_can( $cap ) ) {
				return new WP_Error( 'rest_forbidden', __( 'You are not allowed to do this.', 'directoryweb' ), array( 'status' => 403 ) );
			}
			return true;
		};
	}
}
