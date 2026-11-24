<?php
/**
 * Automated Theme Validation Suite for Kits by Wugweb
 *
 * Validates:
 * 1. theme.json and all style variation JSON schemas and syntax.
 * 2. HTML block template validity (balanced block comments and valid attribute JSON).
 * 3. Template parts structure and areas.
 * 4. Block patterns syntax, headers (Title, Slug, Categories), and block markup.
 * 5. Asset dependencies and CSS entrypoints.
 *
 * Usage:
 *   php themes/kits-by-wugweb/tests/ThemeValidationTest.php
 *
 * @package kits-by-wugweb
 */

declare(strict_types=1);

$theme_dir = dirname(__DIR__);
$failures  = 0;
$checks    = 0;

function it(string $desc, callable $test) {
    global $checks, $failures;
    $checks++;
    try {
        $test();
        echo "  ✓ $desc\n";
    } catch (\Throwable $e) {
        $failures++;
        echo "  ✗ $desc: " . $e->getMessage() . "\n";
    }
}

echo "=== Kits by Wugweb Theme Validation Test Suite ===\n\n";

// 1. theme.json and Style Variations
echo "1. Validating theme.json and Style Variations...\n";

it('theme.json exists, parses cleanly and has required FSE root keys', function () use ($theme_dir) {
    $file = $theme_dir . '/theme.json';
    if (!file_exists($file)) {
        throw new \RuntimeException("theme.json not found at $file");
    }
    $content = file_get_contents($file);
    $data = json_decode($content, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new \RuntimeException("JSON parse error: " . json_last_error_msg());
    }
    if (($data['version'] ?? 0) !== 3) {
        throw new \RuntimeException("Expected theme.json version 3, got: " . ($data['version'] ?? 'none'));
    }
    foreach (['settings', 'styles', 'templateParts', 'customTemplates'] as $key) {
        if (!isset($data[$key])) {
            throw new \RuntimeException("Missing required top-level key: $key");
        }
    }
    if (empty($data['settings']['layout']['contentSize']) || empty($data['settings']['layout']['wideSize'])) {
        throw new \RuntimeException("Layout contentSize or wideSize missing");
    }
});

it('All style variations in styles/ parse cleanly as version 3 theme.json', function () use ($theme_dir) {
    $files = glob($theme_dir . '/styles/*.json');
    $color_files = glob($theme_dir . '/styles/colours/*.json');
    $all = array_merge($files ?: [], $color_files ?: []);
    if (empty($all)) {
        throw new \RuntimeException("No style variations found in styles/");
    }
    foreach ($all as $file) {
        $content = file_get_contents($file);
        $data = json_decode($content, true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new \RuntimeException("JSON parse error in $file: " . json_last_error_msg());
        }
        if (($data['version'] ?? 0) !== 3) {
            throw new \RuntimeException("Expected version 3 in $file");
        }
        if (empty($data['title'])) {
            throw new \RuntimeException("Missing title in $file");
        }
    }
});

// 2. Block Templates Validity
echo "\n2. Validating FSE Templates and Parts...\n";

function validate_block_markup(string $file_path): void {
    $content = file_get_contents($file_path);
    // Find all block comments: <!-- wp:name {json} -->, <!-- wp:name -->, <!-- /wp:name -->, <!-- wp:name /-->
    $pattern = '/<!--\s+(\/)?wp:([a-z0-9\/-]+)\s*(\{.*?\})?\s*(\/)?-->/s';
    preg_match_all($pattern, $content, $matches, PREG_SET_ORDER);

    $open_stack = [];
    foreach ($matches as $match) {
        $is_closing = !empty($match[1]);
        $block_name = $match[2];
        $json_attrs = $match[3] ?? '';
        $is_self_closing = !empty($match[4]);

        if (!empty($json_attrs)) {
            $attrs = json_decode($json_attrs, true);
            if (json_last_error() !== JSON_ERROR_NONE) {
                throw new \RuntimeException("Invalid block JSON attribute in $block_name: " . json_last_error_msg());
            }
        }

        if ($is_self_closing) {
            continue;
        }

        if ($is_closing) {
            if (empty($open_stack)) {
                throw new \RuntimeException("Unmatched closing tag for block $block_name");
            }
            $last_open = array_pop($open_stack);
            if ($last_open !== $block_name) {
                throw new \RuntimeException("Mismatched block closing tag: expected </$last_open>, got </$block_name>");
            }
        } else {
            $open_stack[] = $block_name;
        }
    }

    if (!empty($open_stack)) {
        throw new \RuntimeException("Unclosed blocks remaining in $file_path: " . implode(', ', $open_stack));
    }
}

it('All 8 HTML templates have balanced block comments and valid JSON attrs', function () use ($theme_dir) {
    $templates = glob($theme_dir . '/templates/*.html');
    if (count($templates) < 8) {
        throw new \RuntimeException("Expected at least 8 templates, found " . count($templates));
    }
    foreach ($templates as $tmpl) {
        validate_block_markup($tmpl);
    }
});

it('All 4 template parts have balanced block comments and valid JSON attrs', function () use ($theme_dir) {
    $parts = glob($theme_dir . '/parts/*.html');
    if (count($parts) < 4) {
        throw new \RuntimeException("Expected at least 4 template parts, found " . count($parts));
    }
    foreach ($parts as $part) {
        validate_block_markup($part);
    }
});

// 3. Block Patterns Validation
echo "\n3. Validating Block Patterns...\n";

it('All 18 block patterns have required headers and valid block markup', function () use ($theme_dir) {
    $patterns = glob($theme_dir . '/patterns/*.php');
    if (count($patterns) < 18) {
        throw new \RuntimeException("Expected at least 18 patterns, found " . count($patterns));
    }
    foreach ($patterns as $pattern_file) {
        $content = file_get_contents($pattern_file);
        if (!preg_match('/\*\s*Title:\s*(.+)/', $content, $m_title) || empty(trim($m_title[1]))) {
            throw new \RuntimeException("Missing or empty Title in $pattern_file");
        }
        if (!preg_match('/\*\s*Slug:\s*(.+)/', $content, $m_slug) || empty(trim($m_slug[1]))) {
            throw new \RuntimeException("Missing or empty Slug in $pattern_file");
        }
        if (!preg_match('/\*\s*Categories:\s*(.+)/', $content, $m_cat) || empty(trim($m_cat[1]))) {
            throw new \RuntimeException("Missing or empty Categories in $pattern_file");
        }
        // Extract block markup after PHP header closing
        $parts = explode('?>', $content, 2);
        if (isset($parts[1])) {
            $markup = trim($parts[1]);
            if (!empty($markup)) {
                // Temporary file to run validator on pure block markup
                $tmp = tempnam(sys_get_temp_dir(), 'pat_');
                file_put_contents($tmp, $markup);
                try {
                    validate_block_markup($tmp);
                } finally {
                    unlink($tmp);
                }
            }
        }
    }
});

// 4. CSS Assets and Tooling
echo "\n4. Validating CSS Assets and Token Engine...\n";

it('All referenced theme CSS assets exist and are non-empty', function () use ($theme_dir) {
    $css_files = [
        'style.css',
        'assets/css/kits-v42.css',
        'assets/css/kit-tokens.css',
        'assets/css/kits.css',
        'assets/css/kit.css',
        'assets/css/kit-primitives.css',
    ];
    foreach ($css_files as $rel) {
        $full = $theme_dir . '/' . $rel;
        if (!file_exists($full) || filesize($full) === 0) {
            throw new \RuntimeException("CSS file missing or empty: $rel");
        }
    }
});

it('Inter Latin WOFF2 font file exists locally', function () use ($theme_dir) {
    $font = $theme_dir . '/assets/fonts/inter/inter-latin.woff2';
    if (!file_exists($font) || filesize($font) === 0) {
        throw new \RuntimeException("Inter font file missing or empty at $font");
    }
});

// 5. Summary
echo "\n===================================================\n";
echo "Theme Validation: $checks checks, $failures failed.\n";
if ($failures > 0) {
    echo "STATUS: FAILED\n";
    exit(1);
} else {
    echo "STATUS: ALL THEME CHECKS PASSED CLEANLY\n";
    exit(0);
}
