# Audit remediation matrix

Rules: see `baseline-report.md` section 0. Status values: Open, In progress, Fixed (test + commit), Blocked (decision), Verified-no-defect.

| ID | Class | Sev | Pri | Finding | Evidence | Fix | Test | Status |
|---|---|---|---|---|---|---|---|---|
| G23 | MI | S2 | P0 | ThemeValidationTest not in CI | `.github/workflows/ci-suite.yml` theme job | wired into `ci-theme` (556af75) | suite exits 1 on failure; CI run not observed (nothing pushed) | Fixed locally |
| G17 | CD | S1 | P0 | Dark variation body stays light, 1.40:1 | `kit.css` body rule, `kit-tokens.css --kit-surface-page` | `surface-page` now resolves to the canvas-bound token (be976d9) | 2 tests; rendered: Dark body #0D1117, 12.26:1 | Fixed |
| SWEEP | CD | S2 | P0 | Rendered contrast sweep (4 palettes x home, styles page, all patterns) found: `.kit-ed-act` tiles 1.22:1 in Dark; `.kit-ico--theme` had no mask (solid square in every palette) | rendered runs | Ink-panel tints from ink/on-ink tokens; added icon mask (3429b3d) | 2 tests; sweep after fix: 0 failures in 12 combinations | Fixed. Not changed: header turns light in Dark because `secondary`/ink flips (design consequence, contrast passes); other fixed-neutral uses (kit.css 463, 772, 803, 864) unproven, no failure found |
| G3 | CD | S2 | P0 | Brand defaults differ from theme (`#FFBE1A` vs `#C6D2E0`), stale-default skip | `brand-customizer-model.php:28,337` | defaults from resolved theme.json | model test against real theme.json | Open |
| G1/G2 | MI | S2 | P1 | Brand layer is CSS at wp_head 100, no theme.json filter | `brand-customizer.php:30-62` | Core filter after API probe | probe + tests | Open |
| RESET | CD | S2 | P1 | Reset deletes the option | `brand-customizer.php:110` | restore tenant preset | reset test | Open |
| G21 | CD | S2 | P1 | Uninstall omits brand + 8 options | `uninstall.php` | add options, backup, transfer | lifecycle tests | Open |
| G4 | MI | S2 | P1 | No contrast validation or dark rule for tenant colours | model | validate on save, dark rule | tests | Open |
| WP-MIN | DD | S3 | P1 | readme says WordPress 6.6, headers say 7.1 | `readme.txt:60` | correct | doc check | Open |
| NAME | CD | S4 | P1 | Reference name in 5 files | grep | neutral wording | test needles value-based | Open |
| RE | MI | S2 | P1 | Reverse engineering incomplete | `reverse-engineering-matrix.md` | complete matrix | n/a | Open |
| G9 | UV | S3 | P3 | Core readers of theme files | demo/system-screen guarded; Core runs on Twenty Twenty-Five | none needed; extend matrix | standalone matrix | Verified-no-defect (partial) |
| G22/G20/G18/OD* | OD | - | P2 | see `owner-decisions.md` | | | | Blocked |
