<?php

namespace Wugweb\Kits\Security;

/**
 * Type-safe security utility for capability checks and nonces.
 */
class NonceGuard
{
    /**
     * Verify a WordPress nonce safely, returning false if invalid or not running in WP context.
     */
    public static function verify(mixed $nonce, string $action): bool
    {
        if (!is_string($nonce) || '' === trim($nonce)) {
            return false;
        }

        if (function_exists('wp_verify_nonce')) {
            return (bool) wp_verify_nonce($nonce, $action);
        }

        return false;
    }

    /**
     * Check current user capability safely.
     */
    public static function can(string $capability): bool
    {
        if (function_exists('current_user_can')) {
            return current_user_can($capability);
        }

        return false;
    }
}
