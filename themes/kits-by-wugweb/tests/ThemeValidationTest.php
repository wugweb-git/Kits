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

it('Ink colour set keeps its links readable in dark mode (the panel inverts, so the link takes the set text colour)', function () use ($theme_dir) {
    $css = file_get_contents($theme_dir . '/assets/css/kits.css');
    if (!preg_match('/data-theme="dark"\]\s+\.is-style-kits-colours-ink a[^{]*\{[^}]*on-ink/s', $css)) {
        throw new \RuntimeException('no dark-mode link rule for the Ink colour set');
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
