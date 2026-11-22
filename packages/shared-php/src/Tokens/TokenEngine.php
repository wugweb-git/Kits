<?php

namespace Wugweb\Kits\Tokens;

use Wugweb\Kits\Contracts\TokenEngineInterface;

/**
 * Lightweight, zero-dependency token engine that parses token trees,
 * resolves aliases, and compiles to CSS variables or theme.json.
 */
class TokenEngine implements TokenEngineInterface
{
    protected array $tokens = [];

    public function __construct(array $tokenTree = [])
    {
        $this->tokens = $tokenTree;
    }

    /**
     * Create an instance from a JSON file path.
     */
    public static function fromJsonFile(string $filePath): self
    {
        if (!file_exists($filePath) || !is_readable($filePath)) {
            return new self([]);
        }

        $decoded = json_decode((string) file_get_contents($filePath), true);
        return new self(is_array($decoded) ? $decoded : []);
    }

    /**
     * {@inheritDoc}
     */
    public function get(string $tokenPath, mixed $default = null): mixed
    {
        $parts = explode('.', $tokenPath);
        $current = $this->tokens;

        foreach ($parts as $part) {
            if (!is_array($current) || !array_key_exists($part, $current)) {
                return $default;
            }
            $current = $current[$part];
        }

        // Unwrap standard W3C Design Token $value if present
        if (is_array($current) && isset($current['value'])) {
            return $current['value'];
        }

        return $current;
    }

    /**
     * {@inheritDoc}
     */
    public function all(): array
    {
        return $this->flatten($this->tokens);
    }

    /**
     * {@inheritDoc}
     */
    public function toCssCustomProperties(string $prefix = '--kit-'): string
    {
        $lines = [];
        foreach ($this->all() as $name => $value) {
            if (is_scalar($value)) {
                $varName = $prefix . str_replace('.', '-', $name);
                $lines[] = "  {$varName}: {$value};";
            }
        }
        return ":root {\n" . implode("\n", $lines) . "\n}";
    }

    /**
     * {@inheritDoc}
     */
    public function toThemeJsonSettings(): array
    {
        $palette = [];
        foreach ($this->all() as $name => $value) {
            if (str_starts_with($name, 'color.') && is_scalar($value)) {
                $slug = str_replace('color.', '', $name);
                $palette[] = [
                    'slug' => str_replace('.', '-', $slug),
                    'color' => (string) $value,
                    'name' => ucwords(str_replace(['.', '-'], ' ', $slug)),
                ];
            }
        }

        return [
            'color' => [
                'palette' => $palette,
            ],
        ];
    }

    /**
     * Flatten nested array into dot-notated paths.
     */
    protected function flatten(array $array, string $prefix = ''): array
    {
        $result = [];
        foreach ($array as $key => $value) {
            $newKey = $prefix === '' ? $key : "{$prefix}.{$key}";
            if (is_array($value) && !isset($value['value'])) {
                $result = array_merge($result, $this->flatten($value, $newKey));
            } else {
                $val = is_array($value) && isset($value['value']) ? $value['value'] : $value;
                $result[$newKey] = $val;
            }
        }
        return $result;
    }
}
