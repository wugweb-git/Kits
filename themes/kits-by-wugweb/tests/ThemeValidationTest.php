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
 * 6. Dark mode runtime CSS variable mapping and toggle functionality.
 * 7. Dynamic Breadcrumbs resolution (with and without RankWeb).
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
    // Verify layout contentSize is 1200px
    if ($data['settings']['layout']['contentSize'] !== '1200px') {
        throw new \RuntimeException("Expected contentSize 1200px, got: " . $data['settings']['layout']['contentSize']);
    }
    // Verify primary accent color is #C6D2E0 (Slate neutral)
    $palette = $data['settings']['color']['palette'] ?? [];
    $primary = null;
    foreach ($palette as $p) {
        if ($p['slug'] === 'primary') {
            $primary = $p['color'];
            break;
        }
    }
    if ($primary !== '#C6D2E0') {
        throw new \RuntimeException("Expected primary color #C6D2E0, got: $primary");
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

it('All 10 HTML templates have balanced block comments and valid JSON attrs', function () use ($theme_dir) {
    $templates = glob($theme_dir . '/templates/*.html');
    if (count($templates) < 10) {
        throw new \RuntimeException("Expected at least 10 templates, found " . count($templates));
    }
    foreach ($templates as $tmpl) {
        validate_block_markup($tmpl);
    }
});

it('blank and no-title templates exist and are declared as custom templates in theme.json', function () use ($theme_dir) {
    $data     = json_decode(file_get_contents($theme_dir . '/theme.json'), true);
    $declared = array_column($data['customTemplates'] ?? [], 'name');
    foreach (['blank', 'no-title', 'page-wide'] as $name) {
        if (!file_exists($theme_dir . "/templates/$name.html")) {
            throw new \RuntimeException("templates/$name.html is missing");
        }
        if (!in_array($name, $declared, true)) {
            throw new \RuntimeException("$name is not in theme.json customTemplates");
        }
    }
    if (strpos(file_get_contents($theme_dir . '/templates/blank.html'), 'template-part') !== false) {
        throw new \RuntimeException('templates/blank.html must not include the header or footer');
    }
});

it('Every wp:pattern slug that a template, part or pattern calls is a pattern file in this theme', function () use ($theme_dir) {
    $slugs = [];
    foreach (glob($theme_dir . '/patterns/*.php') as $f) {
        if (preg_match('/\*\s*Slug:\s*(\S+)/', file_get_contents($f), $m)) {
            $slugs[] = $m[1];
        }
    }
    $files = array_merge(glob($theme_dir . '/templates/*.html'), glob($theme_dir . '/parts/*.html'), glob($theme_dir . '/patterns/*.php'));
    foreach ($files as $f) {
        preg_match_all('/<!-- wp:pattern \{"slug":"([^"]+)"/', file_get_contents($f), $m);
        foreach ($m[1] as $slug) {
            if (!in_array($slug, $slugs, true)) {
                throw new \RuntimeException(basename($f) . " calls pattern $slug, which has no file");
            }
        }
    }
});

it('Header and footer variant patterns bound to template parts match the default parts', function () use ($theme_dir) {
    foreach (['header', 'footer'] as $area) {
        $pattern = file_get_contents($theme_dir . "/patterns/$area-default.php");
        if (!preg_match('/\*\s*Block Types:\s*core\/template-part\/' . $area . '\b/', $pattern)) {
            throw new \RuntimeException("patterns/$area-default.php is not bound to the $area template part");
        }
        $body = substr($pattern, strpos($pattern, '?>') + 3);
        if ($body !== file_get_contents($theme_dir . "/parts/$area.html")) {
            throw new \RuntimeException("patterns/$area-default.php drifted from parts/$area.html: change both");
        }
    }
});

it('Footer variants are bound to the footer template part; 404 and comments are hidden from the inserter', function () use ($theme_dir) {
    foreach (['footer-minimal', 'footer-columns', 'footer-stacked', 'footer-social'] as $name) {
        if (!preg_match('/\*\s*Block Types:\s*core\/template-part\/footer\b/', file_get_contents($theme_dir . "/patterns/$name.php"))) {
            throw new \RuntimeException("patterns/$name.php is not bound to the footer template part");
        }
    }
    foreach (['404', 'comments'] as $name) {
        if (!preg_match('/\*\s*Inserter:\s*no\b/', file_get_contents($theme_dir . "/patterns/$name.php"))) {
            throw new \RuntimeException("patterns/$name.php must have Inserter: no");
        }
    }
});

it('The Frost-derived patterns use core blocks only (no Custom HTML) and no raw colours', function () use ($theme_dir) {
    $names = ['footer-minimal', 'footer-columns', 'footer-stacked', 'footer-social', 'hero-centered', 'author-box', 'testimonials',
        'boxes-two', 'boxes-three', 'cta-inline', 'product-box', 'team', 'portfolio', 'progress-bars',
        'pricing-two', 'pricing-three', 'pricing-four', 'posts', 'posts-list', '404', 'comments',
        'page-home', 'page-about', 'page-pricing', 'page-link'];
    foreach ($names as $name) {
        $src = file_get_contents($theme_dir . "/patterns/$name.php");
        if (strpos($src, 'wp:html') !== false) {
            throw new \RuntimeException("patterns/$name.php embeds Custom HTML");
        }
        if (preg_match('/#[0-9a-fA-F]{3,8}\b|rgba?\(/', $src)) {
            throw new \RuntimeException("patterns/$name.php has a raw colour: use a palette preset");
        }
    }
});

it('Block style Reverse on mobile is registered and its CSS is in kits.css', function () use ($theme_dir) {
    if (strpos(file_get_contents($theme_dir . '/inc/blocks.php'), "'kits-reverse'") === false) {
        throw new \RuntimeException('kits-reverse is not registered in inc/blocks.php');
    }
    if (strpos(file_get_contents($theme_dir . '/assets/css/kits.css'), '.is-style-kits-reverse') === false) {
        throw new \RuntimeException('kits.css has no .is-style-kits-reverse rule');
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

it('All block patterns have required headers and valid block markup', function () use ($theme_dir) {
    $patterns = glob($theme_dir . '/patterns/*.php');
    if (count($patterns) < 47) {
        throw new \RuntimeException("Expected at least 47 patterns, found " . count($patterns));
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
        $parts = explode('?>', $content, 2);
        if (isset($parts[1])) {
            $markup = trim($parts[1]);
            if (!empty($markup)) {
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

// 4. CSS Assets and Token Engine
echo "\n4. Validating CSS Assets and Dark Mode Inversion...\n";

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

it('kits.css contains [data-theme="dark"] variable mappings matching styles/dark.json', function () use ($theme_dir) {
    $css = file_get_contents($theme_dir . '/assets/css/kits.css');
    if (strpos($css, '[data-theme="dark"]') === false) {
        throw new \RuntimeException('Missing [data-theme="dark"] selector in kits.css');
    }
    $required_vars = [
        '--wp--preset--color--canvas: #0D1117',
        '--wp--preset--color--surface: #161B22',
        '--wp--preset--color--foreground: #C9D1D9',
        '--wp--preset--color--primary: #79B8FF',
        '--kit-color-bg: #0D1117',
        '--kit-color-text: #C9D1D9',
    ];
    foreach ($required_vars as $v) {
        if (strpos($css, $v) === false) {
            throw new \RuntimeException("Missing dark mode token mapping in kits.css: $v");
        }
    }
});

it('Inter Latin WOFF2 font file exists locally', function () use ($theme_dir) {
    $font = $theme_dir . '/assets/fonts/inter/inter-latin.woff2';
    if (!file_exists($font) || filesize($font) === 0) {
        throw new \RuntimeException("Inter font file missing or empty at $font");
    }
});

// 5. Dynamic Breadcrumbs Evaluation
echo "\n5. Validating Dynamic Breadcrumbs Pattern Resolution...\n";

it('Breadcrumbs pattern outputs rankweb/breadcrumbs when RankWeb block function exists', function () use ($theme_dir) {
    $cmd = 'php -r \'
        function rankweb_breadcrumbs_block() { return "OK"; }
        ob_start();
        include "' . $theme_dir . '/patterns/breadcrumbs.php";
        $out = ob_get_clean();
        if (strpos($out, "wp:rankweb/breadcrumbs") === false) {
            exit(1);
        }
        exit(0);
    \'';
    exec($cmd, $out, $code);
    if ($code !== 0) {
        throw new \RuntimeException("Breadcrumbs pattern failed to output wp:rankweb/breadcrumbs when RankWeb is active");
    }
});

it('Breadcrumbs pattern outputs dynamic accessible fallback when RankWeb is inactive', function () use ($theme_dir) {
    $cmd = 'php -r \'
        ob_start();
        include "' . $theme_dir . '/patterns/breadcrumbs.php";
        $out = ob_get_clean();
        if (strpos($out, "kit-crumbs") === false || strpos($out, "<ol>") === false || strpos($out, "Home") === false) {
            exit(1);
        }
        if (strpos($out, "/category/") !== false || strpos($out, "Current Page") !== false) {
            exit(2);
        }
        exit(0);
    \'';
    exec($cmd, $out, $code);
    if ($code === 2) {
        throw new \RuntimeException("Breadcrumbs pattern still outputs static dummy /category/ or Current Page strings");
    }
    if ($code !== 0) {
        throw new \RuntimeException("Breadcrumbs pattern fallback output is invalid or incomplete");
    }
});

// 6. Summary
echo "\n===================================================\n";
echo "Theme Validation: $checks checks, $failures failed.\n";
if ($failures > 0) {
    echo "STATUS: FAILED\n";
    exit(1);
} else {
    echo "STATUS: ALL THEME CHECKS PASSED CLEANLY\n";
    exit(0);
}
