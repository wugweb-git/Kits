<?php

namespace Wugweb\Kits\Tests;

use Wugweb\Kits\Kits;
use Wugweb\Kits\Tokens\TokenEngine;
use Wugweb\Kits\Services\ExternalServiceRegistry;

/**
 * Standalone test runner verifying TokenEngine, Registry, and SDK Facade without WordPress.
 */
class TokenEngineTest
{
    public static function run(): bool
    {
        $sampleTokens = [
            'color' => [
                'primary' => '#0F172A',
                'accent' => '#38BDF8',
            ],
            'spacing' => [
                'base' => '16px',
            ],
        ];

        // 1. Test direct TokenEngine resolution
        $engine = new TokenEngine($sampleTokens);
        assert($engine->get('color.primary') === '#0F172A', 'TokenEngine failed to resolve color.primary');
        assert($engine->get('spacing.base') === '16px', 'TokenEngine failed to resolve spacing.base');
        assert($engine->get('nonexistent', 'fallback') === 'fallback', 'TokenEngine fallback failed');

        // 2. Test CSS Custom Property generation
        $css = $engine->toCssCustomProperties('--test-');
        assert(str_contains($css, '--test-color-primary: #0F172A;'), 'CSS variable compilation failed');
        assert(str_contains($css, '--test-spacing-base: 16px;'), 'CSS variable spacing compilation failed');

        // 3. Test theme.json mapping
        $themeJson = $engine->toThemeJsonSettings();
        assert(isset($themeJson['color']['palette']), 'theme.json palette generation failed');
        assert(count($themeJson['color']['palette']) === 2, 'theme.json palette count mismatch');

        // 4. Test Service Registry
        $registry = new ExternalServiceRegistry();
        $registry->registerService('hostinger_mail', [
            'name' => 'Hostinger Mail API',
            'host' => 'https://api.mail.hostinger.com',
            'purpose' => 'Transactional email sending',
        ]);
        assert($registry->hasService('hostinger_mail'), 'ServiceRegistry hasService failed');
        $readme = $registry->toReadmeMarkdown();
        assert(str_contains($readme, 'Hostinger Mail API'), 'Readme markdown generation failed');

        // 5. Test Facade
        $facadeEngine = Kits::tokens($sampleTokens);
        assert($facadeEngine->get('color.accent') === '#38BDF8', 'Kits facade failed');

        echo "All 5 SDK test suites passed cleanly!\n";
        return true;
    }
}

// Allow direct CLI execution: php tests/TokenEngineTest.php
if (php_sapi_name() === 'cli' && basename(__FILE__) === basename($_SERVER['SCRIPT_FILENAME'] ?? '')) {
    require_once __DIR__ . '/../vendor/autoload.php';
    TokenEngineTest::run();
}
