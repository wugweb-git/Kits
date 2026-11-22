# Wugweb Kits PHP SDK

Lightweight, zero-dependency PHP SDK providing core contracts, design token resolution, and external service registries for the **Kits by Wugweb** theme and modular companion plugins (`DirectoryWeb`, `RankWeb`, `MailWeb`, `PlanWeb`, `SourceWeb`, `InsightWeb`).

## Installation

```bash
composer require wugweb/kits-php-sdk
```

## Features

- **Contracts:** Interfaces for plugin lifecycles (`PluginInterface`), token engines (`TokenEngineInterface`), and external services (`ServiceRegistryInterface`).
- **Token Engine (`TokenEngine`):** Parses W3C Design Tokens and `tokens.json`, generates CSS variables (`--kit-*`), and compiles directly to Gutenberg `theme.json` color palettes.
- **External Service Registry (`ExternalServiceRegistry`):** Enforces explicit registration of outbound HTTP endpoints and generates standard WordPress.org `== External services ==` readme sections.
- **Security (`NonceGuard`):** Type-safe capability checks and nonces.

## Usage

```php
use Wugweb\Kits\Kits;

// 1. Resolve Design Tokens
$tokens = Kits::tokens([
    'color' => [
        'primary' => '#0F172A',
        'accent'  => '#38BDF8',
    ]
]);

$primaryColor = $tokens->get('color.primary'); // '#0F172A'
$cssVars      = $tokens->toCssCustomProperties('--kit-');
$themeJson    = $tokens->toThemeJsonSettings();

// 2. Register External Services (WordPress.org Review Compliance)
$services = Kits::services();
$services->registerService('hostinger_mail', [
    'name'        => 'Hostinger Mail API',
    'host'        => 'https://api.mail.hostinger.com',
    'purpose'     => 'Transactional email routing and inbox syncing',
    'privacy_url' => 'https://www.hostinger.com/legal/privacy-policy',
]);

// 3. Generate README External Services Disclosure
$markdown = $services->toReadmeMarkdown();
```

## Testing

Run standalone without WordPress:

```bash
composer install
php tests/TokenEngineTest.php
```
