<?php

namespace Wugweb\Kits\Contracts;

/**
 * Contract for the Design Token resolution engine.
 */
interface TokenEngineInterface
{
    /** Resolve a token value by path (e.g. 'color.primary' or 'spacing.base'). */
    public function get(string $tokenPath, mixed $default = null): mixed;

    /** Return all resolved design tokens as a flat key-value array. */
    public function all(): array;

    /** Compile resolved tokens into CSS custom property declarations. */
    public function toCssCustomProperties(string $prefix = '--kit-'): string;

    /** Map tokens to Gutenberg theme.json schema settings. */
    public function toThemeJsonSettings(): array;
}
