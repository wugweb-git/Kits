# Owner decision register

Status: **open** unless marked. Nothing here is started. Each entry: current implementation, alternatives, implications, recommendation.

## Decided (recorded for traceability)
- Tenancy is per installation; Multisite isolates per site; no network or SaaS layer now; keep extensible.
- Kits Core owns the tenant brand layer through `wp_theme_json_data_theme`; the theme never owns tenant branding and works without Core.
- Reset restores the tenant preset (does not delete it); Site Editor changes stay authoritative until reset.
- Both WordPress.org and commercial distribution from one architecture.

## OD1. Canonical accent colour (open)
- Now: theme `primary` `#C6D2E0` (what renders), Brand Customizer default `#FFBE1A`, admin shell `#FFC300`, documentation `#f59e0b`.
- Alternatives: keep `#C6D2E0`; adopt `#FFBE1A` as the product default; define per-surface roles.
- Implication: the mechanism fix (defaults come from the theme's `theme.json`) does not depend on the answer; only the value does.
- Recommendation: `theme.json` is the source of truth, so keep `#C6D2E0` unless the brand says otherwise, and make the Brand Customizer, shell and docs read or cite it.

## OD2. Setup Wizard (open)
- Now: 3 steps, one POST; saves `kits_active_style_variation`, which nothing reads; swatches do not match `styles/*.json`; `ink` listed as a variation; `dark` missing.
- Alternatives: repair (apply the chosen variation through the Global Styles record, correct swatches); remove; build the 4-step flow described in older docs.
- Implication: today the variation step has no effect.
- Recommendation: repair to 3 steps that really apply a variation, or remove. Do not build the 4-step flow (tied to the Cloudflare plan, see OD4).

## OD3. Scripts & Pixels (open)
- Now: raw script text saved under `manage_options`; docs promise sanitising and `manage_kits`.
- Alternatives: keep raw but require `unfiltered_html` (WordPress's own rule for who may place scripts) and document it; sanitise to an allow-list; restrict to `manage_kits`.
- Implication: stripping scripts defeats the feature; Multisite non-super-admins lack `unfiltered_html`.
- Recommendation: gate on `unfiltered_html`, keep raw, correct the docs, add a test.

## OD4. Cloudflare relay and Foundry (open)
- Now: described in `plugins/kits-core/PENDING.md` and three architecture docs; no code exists.
- Alternatives: abandon; keep as roadmap in an archived plan.
- Recommendation: move to `docs/archive/` as "not planned" and remove from PENDING unless a date exists.

## OD5. Duplicate documents (open)
- Done 25 Nov 2026 at the owner's instruction: `wugweb-monorepo-delivery-architecture.md` (byte-identical copy) deleted; `monorepo-delivery-architecture.md` stays. `block-theme-and-plugins-plan.md` archived under `docs/archive/` with a banner. Still open: the pair `theme/kits-theme-admin-ui-spec.md` and `design-system/admin-ui-spec.md`.
- Was: two byte-identical pairs: `monorepo-delivery-architecture.md` and `wugweb-monorepo-delivery-architecture.md`; `theme/kits-theme-admin-ui-spec.md` and `design-system/admin-ui-spec.md`.
- Recommendation: keep one of each, replace the other with a one-line pointer for a release, then archive. Archive the Animal Writes-authored documents under `docs/archive/` with a banner. No deletions.

## OD6. Update URI (open)
- Now: `kits-core.php` has `Update URI`, a custom theme updater exists; older docs disagree.
- Alternatives: keep for direct channel only; remove everywhere.
- Recommendation: one source tree, build channel decides: WordPress.org build omits `Update URI` and the updater file; direct build includes them.

## OD7. Commit history naming (open)
- Now: 3 commit messages name the reference theme.
- Recommendation: leave history alone; rewriting published history has a cost and no product effect. Clean the working tree only.

## OD8. Fluent Forms claims and the claim state table (open)
- Now: DirectoryWeb has two claim intakes. Native claims (`claim-native.php`) use the state machine; claims sent through Fluent Forms (`claims-review.php`) keep their own `aw_c_status` meta (pending, approved, rejected) and screen.
- Alternatives: leave both (Fluent Forms claims stay as they are, native is for sites without Fluent Forms); migrate existing Fluent Forms claims onto the state table with a one-time, reversible copy; stop accepting new Fluent Forms claims.
- Implication: a migration touches decided, stored claims on the live directory; finished decisions must not change.
- Recommendation: leave both. Do not migrate stored claims; new sites use the native form.

## OD9. Animal Writes defaults inside RankWeb (decided 25 Nov 2026: decouple; partly done)
- Done: the schema contact email, contact point, address country, founding date and area served are no longer written for other sites (the Organization node passes through the `rankweb_organization_node` filter, the email through `rankweb_contact_email`); the WebSite alternate names default to none; the `animalwrites.in` redirect is now the site's own host plus any added through `rankweb_own_hosts`; the Google News publication name is the site name (`rankweb_news_publication_name`); the sitemap-watchdog email names the site.
- Effect on the live Animal Writes site until its site layer carries the old values: the Organization node loses the contact email and contact point, address country, founding date and area served; the alternate names are empty; the old-domain redirect stops; the news publication name is the site name. The site layer restores all of it with `add_filter` calls on the filters above (values are in git history: commit 32d7177's parent, `schema.php`, `settings.php`, `redirects.php`, `sitemap.php`).
- Done 25 Nov 2026 (second pass): all tenant data is out of RankWeb and DirectoryWeb code: social profile fallbacks, editorial team name, country names, the old-URL redirect rules, the 410 list, the media caption copy, geocoding identity (Nominatim user agent, contact email and India-only country filter are now neutral, with `directoryweb_geocode_contact` and `directoryweb_geocode_countries`), settings defaults (post-type lists, hub titles and descriptions, category and tag titles, directory index list, brand words). `tests/no-tenant-data-test.php` fails CI on any return.
- Still open (copy, not data): title and description templates and settings defaults in `settings.php`, `titles.php` and `programmatic.php` still say "Animal Writes" and "India" (about 60 strings), and `breadcrumbs-render.php` registers an `animal-writes/breadcrumb` block name. Neutralising them is the same kind of change and needs the same site-layer hand-over.

## OD10. RankWeb loads InsightWeb's bootstrap by folder path (decided 25 Nov 2026: decouple; done)
- The bridge is removed. RankWeb no longer loads any file of another plugin. Search Insights' scheduled jobs run only while InsightWeb is active: confirm InsightWeb is active on the live site before deploying this.
