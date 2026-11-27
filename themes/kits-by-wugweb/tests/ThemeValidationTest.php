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
        define("ABSPATH", "/"); function esc_html($s) { return htmlspecialchars((string) $s); } function esc_url($s) { return (string) $s; }
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
        define("ABSPATH", "/"); function esc_html($s) { return htmlspecialchars((string) $s); } function esc_url($s) { return (string) $s; }
        ob_start();
        include "' . $theme_dir . '/patterns/breadcrumbs.php";
        $out = ob_get_clean();
        if (strpos($out, "kit-crumbs") === false || strpos($out, "<!-- wp:list {") === false || strpos($out, "<!-- wp:list-item -->") === false || strpos($out, "Home") === false) {
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

it('Breadcrumbs fallback is Gutenberg-valid: balanced blocks, and every ol/li sits inside a list/list-item block', function () use ($theme_dir) {
    $out = shell_exec('php -r \'define("ABSPATH", "/"); function esc_html($s) { return htmlspecialchars((string) $s); } function esc_url($s) { return (string) $s; } include "' . $theme_dir . '/patterns/breadcrumbs.php";\'');
    if (!is_string($out) || strpos($out, 'kit-crumbs') === false) {
        throw new \RuntimeException('Breadcrumbs fallback produced no markup');
    }
    $tmp = tempnam(sys_get_temp_dir(), 'crumb_');
    file_put_contents($tmp, $out);
    try {
        validate_block_markup($tmp);
    } finally {
        unlink($tmp);
    }
    // Raw HTML inside a block is the cause of the editor's "invalid content" state: lists must be list blocks.
    preg_match_all('/<!-- wp:list \{[^}]*\} -->\s*<ol class="wp-block-list">/', $out, $lists);
    if (count($lists[0]) !== substr_count($out, '<ol')) {
        throw new \RuntimeException('Found an <ol> that is not a core/list block');
    }
    if (substr_count($out, '<!-- wp:list-item -->') !== substr_count($out, '<li>')) {
        throw new \RuntimeException('Found an <li> that is not a core/list-item block');
    }
});

it('Breadcrumbs pattern is registered with the pattern categories the theme registers', function () use ($theme_dir) {
    $src = file_get_contents($theme_dir . '/patterns/breadcrumbs.php');
    if (!preg_match('/\*\s*Slug:\s*kits-by-wugweb\/breadcrumbs\b/', $src)) {
        throw new \RuntimeException('breadcrumbs slug is wrong');
    }
    if (!preg_match('/\*\s*Categories:\s*kits-components\b/', $src)) {
        throw new \RuntimeException('breadcrumbs is not in kits-components');
    }
    if (strpos(file_get_contents($theme_dir . '/inc/blocks.php'), "'kits-components'") === false) {
        throw new \RuntimeException("kits-components is not registered in inc/blocks.php");
    }
});

it('Every template-part area theme.json declares is registered: the sidebar area exists once with Kits Core and once without', function () use ($theme_dir) {
    $data  = json_decode(file_get_contents($theme_dir . '/theme.json'), true);
    $areas = array_unique(array_column($data['templateParts'], 'area'));
    $core  = ['header', 'footer', 'uncategorized', 'navigation-overlay'];
    $script = <<<'PHP'
define("ABSPATH", "/");
$GLOBALS["f"] = [];
function add_filter($t, $cb, $p = 10, $n = 1) { $GLOBALS["f"][$t][$p][] = $cb; }
function add_action($t, $cb, $p = 10, $n = 1) { add_filter($t, $cb, $p, $n); }
function __($s, $d = "") { return $s; }
function apply($tag, $v) { ksort($GLOBALS["f"][$tag]); foreach ($GLOBALS["f"][$tag] as $cbs) { foreach ($cbs as $cb) { $v = $cb($v); } } return $v; }
include $argv[1];
$count = function ($areas) { return count(array_filter($areas, fn($a) => ($a["area"] ?? "") === "sidebar")); };
$without = apply("default_wp_template_part_areas", []);
// Kits Core's registration (plugins/kits-core/includes/landmarks.php): priority 10, appends unconditionally.
add_filter("default_wp_template_part_areas", function ($a) { $a[] = ["area" => "sidebar", "label" => "Sidebar"]; return $a; });
$with = apply("default_wp_template_part_areas", []);
echo json_encode(["without" => $count($without), "with" => $count($with)]);
PHP;
    $tmp = tempnam(sys_get_temp_dir(), 'area_');
    file_put_contents($tmp, '<?php ' . $script);
    $out = json_decode((string) shell_exec('php ' . escapeshellarg($tmp) . ' ' . escapeshellarg($theme_dir . '/inc/blocks.php')), true);
    unlink($tmp);
    if (($out['without'] ?? null) !== 1) {
        throw new \RuntimeException('Without Kits Core the theme must register the sidebar area exactly once, got ' . var_export($out['without'] ?? null, true));
    }
    if (($out['with'] ?? null) !== 1) {
        throw new \RuntimeException('With Kits Core the sidebar area must not be registered twice, got ' . var_export($out['with'] ?? null, true));
    }
    foreach ($areas as $area) {
        if (!in_array($area, $core, true) && $area !== 'sidebar') {
            throw new \RuntimeException("theme.json declares template-part area '$area', which WordPress does not know and the theme does not register");
        }
    }
});

it('Every block style the theme registers has CSS or theme.json styling behind it, and is namespaced kits-*', function () use ($theme_dir) {
    $php   = file_get_contents($theme_dir . '/inc/blocks.php');
    $css   = file_get_contents($theme_dir . '/assets/css/kits.css') . file_get_contents($theme_dir . '/assets/css/kit.css');
    $theme = file_get_contents($theme_dir . '/theme.json');
    // Styles with their behaviour in the stylesheet (the rest are theme.json styles.blocks variations).
    $css_backed = ['kits-reverse' => '.is-style-kits-reverse', 'kits-plain' => '.is-style-kits-plain', 'kits-outline' => '.is-style-kits-outline', 'kits-sources' => '.is-style-kits-sources'];
    foreach ($css_backed as $name => $selector) {
        if (strpos($php, "'$name'") === false) {
            throw new \RuntimeException("block style $name is not registered in inc/blocks.php");
        }
        if (strpos($css, $selector) === false) {
            throw new \RuntimeException("block style $name has no CSS ($selector)");
        }
    }
    preg_match_all("/'(kits-[a-z-]+)'\s*=>\s*__\(/", $php, $m);
    foreach ($m[1] as $name) {
        if (!isset($css_backed[$name]) && strpos($theme, '"' . $name . '"') === false && strpos($css, 'is-style-' . $name) === false && strpos($php, 'is-style-' . $name) === false) {
            throw new \RuntimeException("block style $name is registered but has no styling");
        }
    }
});

it('theme.json block styling for code, preformatted, quote and pullquote uses tokens only (no raw colours, fonts or Frost values)', function () use ($theme_dir) {
    $data = json_decode(file_get_contents($theme_dir . '/theme.json'), true);
    foreach (['core/code', 'core/preformatted', 'core/quote', 'core/pullquote'] as $block) {
        if (empty($data['styles']['blocks'][$block])) {
            throw new \RuntimeException("styles.blocks.$block is missing");
        }
        $json = json_encode($data['styles']['blocks'][$block]);
        if (preg_match('/#[0-9a-fA-F]{3,8}\b|rgba?\(|\b\d+px\b/', $json)) {
            throw new \RuntimeException("$block has a raw colour or px value: use a preset or a token");
        }
    }
    $slugs = array_column($data['settings']['typography']['fontFamilies'], 'slug');
    if (!in_array('mono', $slugs, true)) {
        throw new \RuntimeException('the mono font-family preset that code and preformatted use is missing');
    }
});

it('No Frost palette, font or brand values anywhere in the theme source', function () use ($theme_dir) {
    $needles = ['#0000ff', '#000099', '#cc0000', '#7a0000', 'Outfit', 'frostwp', 'wpengine', 'frost/'];
    $files   = array_merge(
        glob($theme_dir . '/*.{php,json,css,txt}', GLOB_BRACE),
        glob($theme_dir . '/{inc,patterns,templates,parts,styles,styles/colours}/*.{php,html,json}', GLOB_BRACE),
        glob($theme_dir . '/assets/css/{kits,kit,kit-tokens,kit-primitives}.css', GLOB_BRACE)
    );
    foreach ($files as $f) {
        $src = strtolower(file_get_contents($f));
        foreach ($needles as $n) {
            if (strpos($src, strtolower($n)) !== false) {
                throw new \RuntimeException(basename($f) . " contains '$n'");
            }
        }
    }
});

it('Every translatable string in theme PHP uses the kits-by-wugweb text domain', function () use ($theme_dir) {
    $files = array_merge(glob($theme_dir . '/functions.php'), glob($theme_dir . '/inc/*.php'), glob($theme_dir . '/patterns/*.php'));
    foreach ($files as $f) {
        preg_match_all('/\b(?:__|_e|_x|_n|esc_html__|esc_html_e|esc_attr__|esc_attr_e)\s*\(\s*(?:\'(?:[^\'\\\\]|\\\\.)*\'|"(?:[^"\\\\]|\\\\.)*")[^;]*?,\s*\'([a-z0-9-]+)\'\s*\)/', file_get_contents($f), $m);
        foreach ($m[1] as $domain) {
            if ($domain !== 'kits-by-wugweb') {
                throw new \RuntimeException(basename($f) . " uses text domain '$domain'");
            }
        }
    }
    $pot = file_get_contents($theme_dir . '/languages/kits-by-wugweb.pot');
    if (strpos($pot, '"X-Domain: kits-by-wugweb\n"') === false) {
        throw new \RuntimeException('POT X-Domain is not kits-by-wugweb');
    }
    foreach (['Reverse on mobile', 'Plain (no bullets)', 'Footer: minimal', 'Progress bars', 'Kits: Pages'] as $s) {
        if (strpos($pot, 'msgid "' . $s . '"') === false) {
            throw new \RuntimeException("POT is stale: it lacks \"$s\" (regenerate with wp i18n make-pot)");
        }
    }
});

it('Every pattern is in a kits-* category, or is a header/footer template-part variant, or is hidden from the inserter', function () use ($theme_dir) {
    foreach (glob($theme_dir . '/patterns/*.php') as $f) {
        $src = file_get_contents($f);
        preg_match('/\*\s*Categories:\s*(.+)/', $src, $cat);
        $variant = preg_match('/\*\s*Block Types:\s*core\/template-part\/(header|footer)\b/', $src);
        $hidden  = preg_match('/\*\s*Inserter:\s*no\b/', $src);
        if (strpos($cat[1] ?? '', 'kits-') === false && !$variant && !$hidden) {
            throw new \RuntimeException(basename($f) . ' is in no kits-* category and is neither a template-part variant nor hidden');
        }
        foreach (array_map('trim', explode(',', $cat[1] ?? '')) as $c) {
            if (strpos($c, 'kits-') === 0 && !in_array($c, ['kits-components', 'kits-lists', 'kits-pages'], true)) {
                throw new \RuntimeException(basename($f) . " uses the unregistered category $c");
            }
        }
    }
});

it('Every template-part slug a template calls exists in parts/ and is declared in theme.json', function () use ($theme_dir) {
    $data     = json_decode(file_get_contents($theme_dir . '/theme.json'), true);
    $declared = array_column($data['templateParts'], 'name');
    foreach (glob($theme_dir . '/templates/*.html') as $f) {
        preg_match_all('/<!-- wp:template-part \{"slug":"([^"]+)"/', file_get_contents($f), $m);
        foreach ($m[1] as $slug) {
            if (!file_exists($theme_dir . "/parts/$slug.html")) {
                throw new \RuntimeException(basename($f) . " calls part $slug, which has no file");
            }
            if (!in_array($slug, $declared, true)) {
                throw new \RuntimeException("$slug is not declared in theme.json templateParts");
            }
        }
    }
});

it('The testimonials image slot and the card grid pagination are present, and no pattern forces a fixed height', function () use ($theme_dir) {
    if (strpos(file_get_contents($theme_dir . '/patterns/testimonials.php'), 'wp:image') === false) {
        throw new \RuntimeException('testimonials has no image slot');
    }
    if (strpos(file_get_contents($theme_dir . '/patterns/card-grid.php'), 'wp:query-pagination') === false) {
        throw new \RuntimeException('card-grid has no pagination');
    }
    foreach (glob($theme_dir . '/patterns/*.php') as $f) {
        if (preg_match('/(?<!min-)height:\s*\d+(px|rem|em|vh)/', file_get_contents($f)) && basename($f) !== 'banner.php') {
            throw new \RuntimeException(basename($f) . ' sets a fixed height');
        }
    }
});

it('Standalone Frost-derived content patterns do not open on a heading deeper than h2 (no skipped level under the page h1)', function () use ($theme_dir) {
    // Existing Kits card, query and band patterns use h3 by design (they sit under a heading the editor already wrote).
    $standalone = ['boxes-two', 'boxes-three', 'product-box', 'pricing-two', 'pricing-three', 'pricing-four', 'team', 'hero-centered', 'hero-split', 'cta', 'testimonials', 'author-box', 'portfolio', 'progress-bars', 'page-home', 'page-about', 'page-pricing', 'page-link', '404'];
    foreach ($standalone as $slug) {
        $src = file_get_contents($theme_dir . "/patterns/$slug.php");
        if (preg_match('/<h([1-6])\b/', $src, $m) && (int) $m[1] > 2) {
            throw new \RuntimeException("$slug opens on an h{$m[1]}: it skips a level when placed under the page title");
        }
    }
});

it('Ink colour set: link, heading and text colours read on the Ink panel in every palette (base, Dark, Forest, Slate), links underlined', function () use ($theme_dir) {
    $ink  = json_decode(file_get_contents($theme_dir . '/styles/colours/ink.json'), true);
    $base = [];
    foreach (json_decode(file_get_contents($theme_dir . '/theme.json'), true)['settings']['color']['palette'] as $c) {
        $base[$c['slug']] = $c['color'];
    }
    $lum = function ($hex) {
        $hex = ltrim($hex, '#');
        $v   = array_map(fn($i) => hexdec(substr($hex, $i, 2)) / 255, [0, 2, 4]);
        $v   = array_map(fn($x) => $x <= 0.03928 ? $x / 12.92 : pow(($x + 0.055) / 1.055, 2.4), $v);
        return 0.2126 * $v[0] + 0.7152 * $v[1] + 0.0722 * $v[2];
    };
    $ratio = fn($a, $b) => (max($lum($a), $lum($b)) + 0.05) / (min($lum($a), $lum($b)) + 0.05);
    $slug  = fn($v) => preg_match('/--color--([a-z-]+)\)/', $v, $m) ? $m[1] : null;
    $bg    = $slug($ink['styles']['color']['background']);
    $uses  = [
        'text'    => $slug($ink['styles']['color']['text']),
        'heading' => $slug($ink['styles']['elements']['heading']['color']['text']),
        'link'    => $slug($ink['styles']['elements']['link']['color']['text']),
    ];
    if (($ink['styles']['elements']['link']['typography']['textDecoration'] ?? '') !== 'underline') {
        throw new \RuntimeException('Ink links must be underlined (colour alone is not enough)');
    }
    foreach (['base' => $base] + array_combine(['dark', 'forest', 'slate'], array_map(function ($f) use ($base, $theme_dir) {
        $p = $base;
        foreach ((json_decode(file_get_contents($theme_dir . "/styles/$f.json"), true)['settings']['color']['palette'] ?? []) as $c) {
            $p[$c['slug']] = $c['color'];
        }
        return $p;
    }, ['dark', 'forest', 'slate'])) as $name => $pal) {
        foreach ($uses as $role => $s) {
            $r = $ratio($pal[$s], $pal[$bg]);
            if ($r < 4.5) {
                throw new \RuntimeException(sprintf('Ink %s (%s) on %s is %s:1 in the %s palette, below 4.5:1', $role, $s, $bg, round($r, 2), $name));
            }
        }
    }
});

it('Progress bars: fill against track meets 3:1 (WCAG non-text contrast), using palette tokens, and the value is in text', function () use ($theme_dir) {
    $src  = file_get_contents($theme_dir . '/patterns/progress-bars.php');
    $data = json_decode(file_get_contents($theme_dir . '/theme.json'), true);
    $pal  = [];
    foreach ($data['settings']['color']['palette'] as $c) {
        $pal[$c['slug']] = $c['color'];
    }
    $lum = function ($hex) {
        $hex = ltrim($hex, '#');
        $v   = array_map(fn($i) => hexdec(substr($hex, $i, 2)) / 255, [0, 2, 4]);
        $v   = array_map(fn($x) => $x <= 0.03928 ? $x / 12.92 : pow(($x + 0.055) / 1.055, 2.4), $v);
        return 0.2126 * $v[0] + 0.7152 * $v[1] + 0.0722 * $v[2];
    };
    preg_match_all('/"backgroundColor":"([a-z-]+)"/', $src, $m);
    $slugs = array_values(array_unique($m[1]));
    if (count($slugs) !== 2) {
        throw new \RuntimeException('expected exactly a track and a fill colour, found: ' . implode(',', $slugs));
    }
    foreach ($slugs as $slug) {
        if (!isset($pal[$slug])) {
            throw new \RuntimeException("$slug is not a palette token");
        }
    }
    [$a, $b] = [$lum($pal[$slugs[0]]), $lum($pal[$slugs[1]])];
    $ratio = (max($a, $b) + 0.05) / (min($a, $b) + 0.05);
    if ($ratio < 3.0) {
        throw new \RuntimeException(sprintf('progress bar fill and track are %s:1, below 3:1', round($ratio, 2)));
    }
    if (!preg_match('/\d+%/', $src) || strpos($src, 'role="progressbar"') !== false) {
        throw new \RuntimeException('the value must be written in text, and no ARIA role may be faked on an empty block');
    }
});


it('Page background follows the canvas preset: the body rule resolves to --wp--preset--color--canvas, so Global Styles and style variations control it', function () use ($theme_dir) {
    $tokens = file_get_contents($theme_dir . '/assets/css/kit-tokens.css');
    $kit    = file_get_contents($theme_dir . '/assets/css/kit.css');
    if (!preg_match('/\bbody\s*\{\s*background:\s*var\((--kit-[a-z-]+)\)\s*;?\s*\}/', $kit, $m)) {
        return; // no theme rule sets the page background: Global Styles owns it
    }
    $name = $m[1];
    for ($i = 0; $i < 8; $i++) {
        if (!preg_match('/' . preg_quote($name, '/') . ':\s*([^;]+);/', $tokens, $d)) {
            throw new \RuntimeException("$name is not defined in kit-tokens.css");
        }
        if (!preg_match('/var\((--[a-z0-9-]+)/', $d[1], $v)) {
            throw new \RuntimeException("$name resolves to a fixed value ({$d[1]}), not the canvas preset");
        }
        if ($v[1] === '--wp--preset--color--canvas') {
            return;
        }
        if (strpos($v[1], '--neutral-') === 0) {
            throw new \RuntimeException("The page background resolves to {$v[1]}, a fixed neutral: the Dark variation and any Site Editor canvas change cannot reach the body");
        }
        $name = $v[1];
    }
    throw new \RuntimeException('The page background never reaches the canvas preset');
});

it('Page text, headings, muted text and links read at 4.5:1 or better on the canvas in every palette (base, Dark, Forest, Slate)', function () use ($theme_dir) {
    $base_json = json_decode(file_get_contents($theme_dir . '/theme.json'), true);
    $palette   = [];
    foreach ($base_json['settings']['color']['palette'] as $c) {
        $palette[$c['slug']] = $c['color'];
    }
    $lum = function ($hex) {
        $hex = ltrim($hex, '#');
        $v   = array_map(fn($i) => hexdec(substr($hex, $i, 2)) / 255, [0, 2, 4]);
        $v   = array_map(fn($x) => $x <= 0.03928 ? $x / 12.92 : pow(($x + 0.055) / 1.055, 2.4), $v);
        return 0.2126 * $v[0] + 0.7152 * $v[1] + 0.0722 * $v[2];
    };
    $ratio = fn($a, $b) => (max($lum($a), $lum($b)) + 0.05) / (min($lum($a), $lum($b)) + 0.05);
    $slug  = fn($v) => is_string($v) && preg_match('/--color--([a-z-]+)\)/', $v, $m) ? $m[1] : null;
    $sets  = ['base' => $base_json];
    foreach (['dark', 'forest', 'slate'] as $f) {
        $sets[$f] = json_decode(file_get_contents($theme_dir . "/styles/$f.json"), true);
    }
    foreach ($sets as $name => $json) {
        $pal = $palette;
        foreach (($json['settings']['color']['palette'] ?? []) as $c) {
            $pal[$c['slug']] = $c['color'];
        }
        $st      = $json['styles'] ?? [];
        $bgslug  = $slug($st['color']['background'] ?? null) ?? $slug($base_json['styles']['color']['background']);
        $txtslug = $slug($st['color']['text'] ?? null) ?? $slug($base_json['styles']['color']['text']);
        $headsl  = $slug($st['elements']['heading']['color']['text'] ?? null) ?? $slug($base_json['styles']['elements']['heading']['color']['text']);
        $linksl  = $slug($st['elements']['link']['color']['text'] ?? null) ?? $txtslug; // base links inherit the text colour
        $roles   = ['text' => $txtslug, 'heading' => $headsl, 'link' => $linksl, 'muted text' => 'text-muted'];
        foreach ($roles as $role => $s) {
            $r = $ratio($pal[$s], $pal[$bgslug]);
            if ($r < 4.5) {
                throw new \RuntimeException(sprintf('%s (%s %s) on the page background (%s %s) is %s:1 in the %s palette, below 4.5:1', $role, $s, $pal[$s], $bgslug, $pal[$bgslug], round($r, 2), $name));
            }
        }
    }
});


it('Components that sit on the Ink panel take their tints from the ink and on-ink tokens, not fixed neutrals (the Dark variation flips ink to a light panel)', function () use ($theme_dir) {
    foreach (['kit.css', 'kit.min.css'] as $file) {
        $css = file_get_contents($theme_dir . '/assets/css/' . $file);
        foreach (['.kit-ed-act', '.kit-ed-act:not(:first-child):hover', '.kit-ed-help-note'] as $selector) {
            if (!preg_match('/(?:^|[}\n])\s*' . preg_quote($selector, '/') . '\s*\{([^}]*)\}/', $css, $m)) {
                throw new \RuntimeException("$file: rule $selector not found");
            }
            if (preg_match('/--neutral-\d/', $m[1])) {
                throw new \RuntimeException("$file: $selector uses a fixed neutral ({$m[1]}); on the flipped Ink panel its text (on-ink) is unreadable. Mix --kit-color-ink with --kit-color-on-ink instead");
            }
        }
    }
});


it('Every kit-ico--* icon the theme uses has a mask (--i) defined in kit.css and kit.min.css, so no icon renders as a solid square', function () use ($theme_dir) {
    $used = [];
    foreach (array_merge(glob($theme_dir . '/patterns/*.php'), glob($theme_dir . '/parts/*.html'), glob($theme_dir . '/templates/*.html'), glob($theme_dir . '/inc/*.php'), glob($theme_dir . '/assets/js/*.js')) as $f) {
        if (preg_match_all('/kit-ico--([a-z0-9-]+)/', file_get_contents($f), $m)) {
            $used = array_merge($used, $m[1]);
        }
    }
    foreach (['kit.css', 'kit.min.css'] as $file) {
        $css = file_get_contents($theme_dir . '/assets/css/' . $file);
        $missing = [];
        foreach (array_unique($used) as $name) {
            if (!preg_match('/\.kit-ico--' . preg_quote($name, '/') . '[^{}]*\{[^}]*--i\s*:/', $css)) {
                $missing[] = $name;
            }
        }
        if ($missing) {
            throw new \RuntimeException("$file has no mask for: " . implode(', ', $missing));
        }
    }
});

// 7. Release files: readme.txt (checked the way the wordpress.org readme parser reads it), changelog, screenshot, tags
echo "\n7. Validating readme.txt, CHANGELOG.md, screenshot and style.css tags...\n";

$style_css = file_get_contents($theme_dir . '/style.css');
$style_get = function (string $key) use ($style_css) {
    return preg_match('/^[ \t\/*#]*' . preg_quote($key, '/') . ':[ \t]*(.+?)[ \t]*$/mi', $style_css, $m) ? trim($m[1]) : '';
};

it('readme.txt has the title line, the header fields the wordpress.org parser reads, and they agree with style.css', function () use ($theme_dir, $style_get) {
    $readme = file_get_contents($theme_dir . '/readme.txt');
    $lines  = preg_split('/\r?\n/', $readme);
    if (!preg_match('/^===\s*(.+?)\s*===\s*$/', $lines[0] ?? '', $m)) {
        throw new \RuntimeException('First line must be "=== Theme Name ===", got: ' . ($lines[0] ?? ''));
    }
    if ($m[1] !== $style_get('Theme Name')) {
        throw new \RuntimeException("readme title '{$m[1]}' differs from the style.css Theme Name '{$style_get('Theme Name')}'");
    }
    // Header block: "Key: value" lines up to the first blank line after the title, then a blank line and the short description.
    $head = [];
    $i    = 1;
    for (; $i < count($lines) && trim($lines[$i]) === ''; $i++) {
    }
    for (; $i < count($lines) && preg_match('/^([A-Za-z ]+):\s*(.*)$/', $lines[$i], $kv); $i++) {
        $head[strtolower(trim($kv[1]))] = trim($kv[2]);
    }
    foreach (['contributors', 'requires at least', 'tested up to', 'requires php', 'stable tag', 'license', 'license uri'] as $k) {
        if (($head[$k] ?? '') === '') {
            throw new \RuntimeException("readme.txt header lacks '$k'");
        }
    }
    foreach (['requires at least', 'tested up to', 'requires php', 'stable tag'] as $k) {
        if (!preg_match('/^\d+(\.\d+){1,2}$/', $head[$k])) {
            throw new \RuntimeException("readme.txt '$k' is not a plain version number: {$head[$k]}");
        }
    }
    if (version_compare($head['tested up to'], $head['requires at least'], '<')) {
        throw new \RuntimeException('Tested up to is lower than Requires at least');
    }
    foreach (['requires at least' => 'Requires at least', 'tested up to' => 'Tested up to', 'requires php' => 'Requires PHP'] as $k => $cssk) {
        if ($head[$k] !== $style_get($cssk)) {
            throw new \RuntimeException("readme.txt $cssk {$head[$k]} differs from style.css {$style_get($cssk)}");
        }
    }
    if ($head['stable tag'] !== $style_get('Version')) {
        throw new \RuntimeException("readme.txt Stable tag {$head['stable tag']} differs from style.css Version {$style_get('Version')}");
    }
    if (!preg_match('/^(GPL-?(v?2|v?3)|GPLv2|GPLv3|GNU General Public License)/i', $head['license'])) {
        throw new \RuntimeException('readme.txt License is not a GPL-compatible string: ' . $head['license']);
    }
    if (!preg_match('#^https?://#', $head['license uri'])) {
        throw new \RuntimeException('License URI is not a URL');
    }
    if (preg_match('/^[a-z0-9-]+(,\s*[a-z0-9-]+)*$/i', $head['contributors']) !== 1) {
        throw new \RuntimeException('Contributors must be a comma-separated list of wordpress.org usernames');
    }
    // Short description: the first non-empty line after the header, at most 150 characters, no Markdown.
    for (; $i < count($lines) && trim($lines[$i]) === ''; $i++) {
    }
    $short = trim($lines[$i] ?? '');
    if ($short === '' || str_starts_with($short, '==')) {
        throw new \RuntimeException('No short description under the header');
    }
    if (strlen($short) > 150) {
        throw new \RuntimeException('Short description is ' . strlen($short) . ' characters; the limit is 150');
    }
    if (preg_match('/[*`#\[]/', $short)) {
        throw new \RuntimeException('Short description contains markup');
    }
});

it('readme.txt sections are the ones the parser knows, Description, FAQ, Changelog and Installation exist, and no "= x =" heading is empty', function () use ($theme_dir) {
    $readme = file_get_contents($theme_dir . '/readme.txt');
    preg_match_all('/^==\s*([^=\n]+?)\s*==\s*$/m', $readme, $m);
    $names = array_map('strtolower', $m[1]);
    foreach (['description', 'installation', 'frequently asked questions', 'changelog'] as $need) {
        if (!in_array($need, $names, true)) {
            throw new \RuntimeException("readme.txt has no '== $need ==' section");
        }
    }
    $known = ['description', 'installation', 'frequently asked questions', 'screenshots', 'changelog', 'upgrade notice', 'copyright'];
    foreach ($names as $n) {
        if (!in_array($n, $known, true)) {
            throw new \RuntimeException("readme.txt section '$n' is not one the parser maps");
        }
    }
    if (count($names) !== count(array_unique($names))) {
        throw new \RuntimeException('readme.txt repeats a section');
    }
    $faq = preg_split('/^==\s*Frequently Asked Questions\s*==\s*$/mi', $readme)[1] ?? '';
    $faq = preg_split('/^==[^=]/m', $faq)[0];
    if (!preg_match('/^=\s*\S.*\s*=\s*$/m', $faq)) {
        throw new \RuntimeException('FAQ has no "= Question =" entries');
    }
});

it('readme.txt and CHANGELOG.md list the same versions, newest first, and the current version has an entry in both', function () use ($theme_dir, $style_get) {
    $readme = file_get_contents($theme_dir . '/readme.txt');
    $body   = preg_split('/^==\s*Changelog\s*==\s*$/mi', $readme)[1] ?? '';
    $body   = preg_split('/^==\s*[^=\n]+==\s*$/m', $body)[0];
    preg_match_all('/^=\s*(\d+\.\d+\.\d+)\s*=\s*$/m', $body, $r);
    $md = file_get_contents($theme_dir . '/CHANGELOG.md');
    preg_match_all('/^##\s*(\d+\.\d+\.\d+)\b/m', $md, $c);
    if ($r[1] !== $c[1]) {
        throw new \RuntimeException('readme.txt changelog versions [' . implode(', ', $r[1]) . '] differ from CHANGELOG.md [' . implode(', ', $c[1]) . ']');
    }
    if (($r[1][0] ?? '') !== $style_get('Version')) {
        throw new \RuntimeException('Newest changelog entry ' . ($r[1][0] ?? 'none') . ' is not the style.css Version ' . $style_get('Version'));
    }
    $sorted = $r[1];
    usort($sorted, fn($a, $b) => version_compare($b, $a));
    if ($sorted !== $r[1]) {
        throw new \RuntimeException('Changelog is not newest first');
    }
    // Each readme bullet for the current version has a counterpart in CHANGELOG.md (same leading words).
    preg_match('/^=\s*' . preg_quote($r[1][0], '/') . '\s*=\s*\n(.*?)(?=^=\s|\z)/ms', $body, $cur);
    foreach (preg_split('/\r?\n/', trim($cur[1] ?? '')) as $line) {
        $words = preg_replace('/[^a-z0-9 ]/i', '', substr(ltrim($line, '* '), 0, 24));
        if ($words !== '' && stripos(preg_replace('/[^a-z0-9 ]/i', '', $md), $words) === false) {
            throw new \RuntimeException("CHANGELOG.md lacks the readme entry starting '$words'");
        }
    }
});

it('screenshot.png is a 1200 x 900 PNG under 1 MB, screenshot.jpg is gone, and nothing points at a missing screenshot', function () use ($theme_dir) {
    $png = $theme_dir . '/screenshot.png';
    if (!is_file($png)) {
        throw new \RuntimeException('screenshot.png is missing');
    }
    $info = getimagesize($png);
    if (!$info || $info[2] !== IMAGETYPE_PNG) {
        throw new \RuntimeException('screenshot.png is not a PNG');
    }
    if ($info[0] !== 1200 || $info[1] !== 900) {
        throw new \RuntimeException("screenshot.png is {$info[0]}x{$info[1]}; the theme directory wants 1200x900");
    }
    if (filesize($png) > 1048576) {
        throw new \RuntimeException('screenshot.png is over 1 MB');
    }
    if (file_exists($theme_dir . '/screenshot.jpg')) {
        throw new \RuntimeException('screenshot.jpg still exists next to screenshot.png');
    }
    $iter = new \RecursiveIteratorIterator(new \RecursiveDirectoryIterator($theme_dir, \FilesystemIterator::SKIP_DOTS));
    foreach ($iter as $f) {
        if (!in_array($f->getExtension(), ['php', 'css', 'json', 'html', 'js', 'txt'], true) || str_contains($f->getPathname(), '/tests/')) {
            continue;
        }
        if (str_contains(file_get_contents($f->getPathname()), 'screenshot.jpg')) {
            throw new \RuntimeException($f->getPathname() . ' still refers to screenshot.jpg');
        }
    }
});

it('style.css Tags are all on the wordpress.org theme tag list, at most 15, and the header names no tenant', function () use ($style_get, $style_css) {
    $allowed = ['accessibility-ready', 'block-patterns', 'block-styles', 'custom-background', 'custom-colors', 'custom-header', 'custom-logo', 'custom-menu', 'editor-style', 'featured-image-header', 'featured-images', 'flexible-header', 'footer-widgets', 'front-page-post-form', 'full-site-editing', 'grid-layout', 'microformats', 'post-formats', 'rtl-language-support', 'sticky-post', 'style-variations', 'template-editing', 'theme-options', 'threaded-comments', 'translation-ready', 'wide-blocks', 'one-column', 'two-columns', 'three-columns', 'four-columns', 'left-sidebar', 'right-sidebar'];
    $tags    = array_map('trim', explode(',', $style_get('Tags')));
    foreach ($tags as $t) {
        if (!in_array($t, $allowed, true)) {
            throw new \RuntimeException("Tag '$t' is not on the wordpress.org theme tag list");
        }
    }
    if (count($tags) > 15) {
        throw new \RuntimeException('More than 15 tags; the directory ignores the rest');
    }
    if (preg_match('/animal\s*writes/i', $style_css . file_get_contents(dirname(__DIR__) . '/readme.txt'))) {
        throw new \RuntimeException('A tenant name is in the theme header or readme');
    }
});

// 8. Accessibility that can be measured from the files
echo "\n8. Validating accessibility: contrast for every style variation, focus, headings...\n";

$contrast_sets = function () use ($theme_dir) {
    $base = json_decode(file_get_contents($theme_dir . '/theme.json'), true);
    $pal0 = [];
    foreach ($base['settings']['color']['palette'] as $c) {
        $pal0[$c['slug']] = $c['color'];
    }
    $sets = ['base' => $pal0];
    foreach (glob($theme_dir . '/styles/*.json') as $f) {
        $j   = json_decode(file_get_contents($f), true);
        $pal = $pal0;
        foreach (($j['settings']['color']['palette'] ?? []) as $c) {
            $pal[$c['slug']] = $c['color'];
        }
        $sets[basename($f, '.json')] = $pal;
    }
    return $sets;
};
$wcag_lum   = function ($hex) {
    $hex = ltrim($hex, '#');
    $v   = array_map(fn($i) => hexdec(substr($hex, $i, 2)) / 255, [0, 2, 4]);
    $v   = array_map(fn($x) => $x <= 0.03928 ? $x / 12.92 : pow(($x + 0.055) / 1.055, 2.4), $v);
    return 0.2126 * $v[0] + 0.7152 * $v[1] + 0.0722 * $v[2];
};
$wcag_ratio = fn($a, $b, $lum = null) => (max($wcag_lum($a), $wcag_lum($b)) + 0.05) / (min($wcag_lum($a), $wcag_lum($b)) + 0.05);

it('Every style variation (base, Dark, Forest, Slate): text and muted text on page, surface and raised read at 4.5:1; the focus colour reaches 3:1 on all three', function () use ($contrast_sets, $wcag_ratio) {
    foreach ($contrast_sets() as $name => $p) {
        foreach (['canvas', 'surface', 'background'] as $bg) {
            foreach (['foreground', 'text-muted'] as $fg) {
                $r = $wcag_ratio($p[$fg], $p[$bg]);
                if ($r < 4.5) {
                    throw new \RuntimeException(sprintf('%s: %s %s on %s %s is %.2f:1, below 4.5:1', $name, $fg, $p[$fg], $bg, $p[$bg], $r));
                }
            }
            $r = $wcag_ratio($p['focus'], $p[$bg]);
            if ($r < 3) {
                throw new \RuntimeException(sprintf('%s: focus %s on %s %s is %.2f:1, below the 3:1 non-text minimum', $name, $p['focus'], $bg, $p[$bg], $r));
            }
        }
    }
});

it('Every style variation: the content link colour (primary-dark) reads at 4.5:1 on the page, surface and raised colours', function () use ($contrast_sets, $wcag_ratio) {
    foreach ($contrast_sets() as $name => $p) {
        foreach (['canvas', 'surface', 'background'] as $bg) {
            $r = $wcag_ratio($p['primary-dark'], $p[$bg]);
            if ($r < 4.5) {
                throw new \RuntimeException(sprintf('%s: link colour primary-dark %s on %s %s is %.2f:1, below 4.5:1', $name, $p['primary-dark'], $bg, $p[$bg], $r));
            }
        }
    }
});

it('Every style variation: the default button (on-ink on ink), the Brand button (dark ash on the accent) and the status colours on the page and on their tints read at 4.5:1', function () use ($contrast_sets, $wcag_ratio, $theme_dir) {
    $ash = '#191919'; // --color-ash, the text colour of the Brand button on the accent (kits-v42.css)
    if (strpos(file_get_contents($theme_dir . '/assets/css/kits-v42.css'), '--color-ash: ' . $ash) === false) {
        throw new \RuntimeException('--color-ash is no longer ' . $ash . '; update this test with the new value');
    }
    foreach ($contrast_sets() as $name => $p) {
        $pairs = [
            'button on-ink on ink' => [$p['on-ink'], $p['secondary']],
            'Brand button ash on accent' => [$ash, $p['primary']],
        ];
        foreach (['error', 'success', 'warning'] as $s) {
            $pairs["$s on page"]     = [$p[$s], $p['canvas']];
            $pairs["$s on its tint"] = [$p[$s], $p[$s . '-soft']];
        }
        foreach ($pairs as $label => [$a, $b]) {
            $r = $wcag_ratio($a, $b);
            if ($r < 4.5) {
                throw new \RuntimeException(sprintf('%s: %s (%s on %s) is %.2f:1, below 4.5:1', $name, $label, $a, $b, $r));
            }
        }
    }
});

it('Dark mode runtime tokens in kits.css (html[data-theme=dark]) carry the same primary-dark as styles/dark.json', function () use ($theme_dir) {
    $j = json_decode(file_get_contents($theme_dir . '/styles/dark.json'), true);
    $dark = '';
    foreach ($j['settings']['color']['palette'] as $c) {
        if ($c['slug'] === 'primary-dark') {
            $dark = $c['color'];
        }
    }
    $css = file_get_contents($theme_dir . '/assets/css/kits.css');
    if (strpos($css, '--wp--preset--color--primary-dark: ' . $dark) === false || strpos($css, '--kit-color-accent-ink: ' . $dark) === false) {
        throw new \RuntimeException("kits.css dark tokens do not use styles/dark.json primary-dark $dark");
    }
});

it('Focus: one global :focus-visible outline exists, every outline:none on a focus rule has a replacement, and form fields keep an outline in forced-colors mode', function () use ($theme_dir) {
    foreach (['kit.css', 'kit.min.css'] as $file) {
        $css = file_get_contents($theme_dir . '/assets/css/' . $file);
        if (!preg_match('/:where\(a, ?button, ?input, ?select, ?textarea, ?summary, ?\[tabindex\]\):focus-visible\s*\{[^}]*outline:[^;}]*solid/', $css)) {
            throw new \RuntimeException("$file: the global :focus-visible outline rule is missing");
        }
        if (!preg_match('/@media \(forced-colors: ?active\)\s*\{[^}]*\.kit-form[^}]*focus-visible[^}]*outline/', $css)) {
            throw new \RuntimeException("$file: no forced-colors outline for form fields (their ring is a box-shadow, which Windows high contrast removes)");
        }
        if (!preg_match('/\.kit-site-header \.wp-block-navigation__submenu-container\s*\{[^}]*--kit-color-focus/', $css)) {
            throw new \RuntimeException("$file: the header submenu panel does not set its own focus colour (yellow is 1.5:1 on its light panel)");
        }
    }
});

it('The theme toggle sits beside the header menu: the header navigation does not wrap (kit.css and kit.min.css)', function () use ($theme_dir) {
    foreach (['kit.css', 'kit.min.css'] as $file) {
        $css = file_get_contents($theme_dir . '/assets/css/' . $file);
        if (!preg_match('/\.kit-header-right\s*>\s*\.wp-block-navigation\s*\{[^}]*flex-wrap:\s*nowrap/', $css)) {
            throw new \RuntimeException("$file: .kit-header-right > .wp-block-navigation must be flex-wrap: nowrap, or the injected toggle drops under the menu on desktop");
        }
    }
});

it('Landmarks and headings in templates: each template has one main, header and footer parts, a skip target, and lists under the page h1 use h2 titles (no h1 to h3 jump)', function () use ($theme_dir) {
    foreach (glob($theme_dir . '/templates/*.html') as $f) {
        $name = basename($f, '.html');
        $html = file_get_contents($f);
        if (substr_count($html, '"tagName":"main"') !== 1) {
            throw new \RuntimeException("$name: expected exactly one main group");
        }
        if (!in_array($name, ['blank'], true) && (strpos($html, '"slug":"header"') === false || strpos($html, '"slug":"footer"') === false)) {
            throw new \RuntimeException("$name: header or footer part missing");
        }
        if (preg_match('/wp:post-title \{"level":([3-6])/', $html, $m) && !preg_match('/wp:heading \{[^}]*"level":2/', $html)) {
            throw new \RuntimeException("$name: a post title is an h{$m[1]} with no h2 above it (skipped heading level)");
        }
    }
    foreach (['empty-state'] as $p) {
        if (preg_match('/<h3\b/', file_get_contents($theme_dir . "/patterns/$p.php"))) {
            throw new \RuntimeException("$p opens on an h3 under the page h1");
        }
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
