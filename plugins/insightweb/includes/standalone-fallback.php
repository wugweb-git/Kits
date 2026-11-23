<?php
/**
 * Standalone compatibility layer for InsightWeb when Kits Core is inactive.
 * Provides fallback implementations for REST permissions.
 *
 * @package insightweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'kits_shell_rest_can' ) ) {
	/**
	 * Fallback REST permission callback for InsightWeb routes.
	 *
	 * @param string $cap Capability.
	 * @return callable
	 */
	function kits_shell_rest_can( string $cap ): callable {
		return function ( $request ) use ( $cap ) {
			if ( ! is_user_logged_in() ) {
				return new WP_Error( 'rest_not_logged_in', __( 'Sign in to use this.', 'insightweb' ), array( 'status' => 401 ) );
			}
			$app = function_exists( 'rest_get_authenticated_app_password' ) && null !== rest_get_authenticated_app_password();
			if ( ! $app && $request instanceof WP_REST_Request ) {
				$nonce = (string) ( $request->get_header( 'X-WP-Nonce' ) ?? $request->get_param( '_wpnonce' ) ?? '' );
				if ( $nonce && ! wp_verify_nonce( $nonce, 'wp_rest' ) ) {
					return new WP_Error( 'rest_cookie_invalid_nonce', __( 'The page has expired. Reload it and try again.', 'insightweb' ), array( 'status' => 403 ) );
				}
			}
			if ( ! current_user_can( $cap ) ) {
				return new WP_Error( 'rest_forbidden', __( 'You are not allowed to do this.', 'insightweb' ), array( 'status' => 403 ) );
			}
			return true;
		};
	}
}
