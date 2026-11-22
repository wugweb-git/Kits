<?php

namespace Wugweb\Kits\Support;

/**
 * Cross-environment sanitization utilities.
 */
class Sanitizer
{
    /**
     * Sanitize a string for safe text display.
     */
    public static function text(string $input): string
    {
        if (function_exists('sanitize_text_field')) {
            return sanitize_text_field($input);
        }
        return htmlspecialchars(strip_tags(trim($input)), ENT_QUOTES, 'UTF-8');
    }

    /**
     * Sanitize a slug / key.
     */
    public static function key(string $input): string
    {
        if (function_exists('sanitize_key')) {
            return sanitize_key($input);
        }
        return preg_replace('/[^a-z0-9_-]/', '', strtolower($input));
    }
}
