# Kits Core: Pending & Roadmap

## Active Scope & Responsibilities
The foundational companion plugin owns:
- Multi-tenant Brand Customizer (`Appearance > Brand Tokens` / `admin.php?page=kits-brand`).
- 4-Layer `theme.json` cascade baseline injector (`wp_theme_json_data_theme`).
- Onboarding Wizard (`admin.php?page=kits-onboarding`).
- Scripts Manager (safe header/footer tracking script injection).
- Cloudflare Worker relay integration & Foundry token sync.
- Custom blocks (`hero`, `theme-options`).
- Action list shell part for admin buttons.

---

## Open Tasks & Enhancements

0. **Standalone Test Hardening & CI Integration (23 Nov 2026)**:
   - ✅ Wrapped external site-layer `admin.php` require in `tests/admin-layer-tests.php` with `file_exists()` guard to ensure tests execute cleanly in decoupled monorepo environments without crashing.
   - ✅ Integrated `plugins/kits-core/tests/*-tests.php` into `.github/workflows/ci-suite.yml` path-based PHP matrix.

1. **4-Layer Theme.json Injection**:
   - Verify tenant brand tokens injected into Layer 3 (`wp_theme_json_data_theme`) so Site Editor "Reset styles" restores tenant brand defaults, not generic core defaults.
   - Cache merged theme data in transients (`kits_brand_theme_data`) with automatic invalidation on option save.

2. **Cloudflare Worker Two-Way Relay**:
   - Implement `save_post_wp_block` hook in `Kits Core` dispatching pattern payloads to Cloudflare Worker relay.
   - Worker validates tenant API key, sanitizes pattern markup, opens GitHub PR in `wugweb-git/kits`, and triggers preview.
   - Strict zero GitHub token exposure in WordPress plugin code.

3. **Onboarding Wizard Multi-Tenant Flow**:
   - 4-step wizard: Site Identity $\rightarrow$ Typography Preset $\rightarrow$ Color Palette $\rightarrow$ Telemetry Activation.
   - Cloudflare Worker key verification check step.
   - Nonce-protected AJAX / REST endpoints for seamless onboarding step saves.

4. **Scripts Manager Hardening**:
   - Ensure header and footer injected tags are sanitized to prevent unclosed tags or invalid HTML.
   - Capability gate strictly restricted to `manage_options` / `manage_kits`.

5. **Form Engine Polish & Multi-Step Validation (Forwarded from Tenant Roadmap, 24 Nov 2026)**:
   - **Upload Limits & Granular File Diagnostics (B2)**: Raise limit to 8 MB (`kits_ff_upload()` in `includes/forms/fluentforms.php`), replacing generic errors with specific diagnostics (file size vs unsupported formats like HEIC), displaying selected file name, size indicator, and a Remove button.
   - **Multi-Step Validation Error Summary Banner (B3)**: In `assets/js/forms.js`, when step validation fails on a previous step, display a top-level error summary banner on the active step with direct links that jump to and focus the invalid fields.
   - **About Field Prefill Sanitization (B1)**: Ensure `kits_ff_form()` textarea value population strips raw HTML tags, decodes entities, and converts date markup (`<span class="kit-date">`) into plain text before rendering.
