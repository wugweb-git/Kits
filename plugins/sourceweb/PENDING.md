# SourceWeb: Pending & Roadmap

## Active Scope & Responsibilities
The content ingestion and syndication plugin owns:
- Feed ingestion (RSS, Atom, JSON feeds).
- External news scrapers and content reprint engine.
- Duplicate detection and content fingerprinting.
- Ingestion review queue and source rejection logic.

---

## Built & Operational (24 Nov 2026)

1. **Reprint Engine Controls**:
   - ✅ Canonical URL enforcement linking back to original sources (`attribution.php`).
   - ✅ Author attribution cards and syndication notices (`attribution.php`).
   - ✅ Automated keyword tagging based on incoming content analysis (`relevance.php`, `keywords-model.php`).

2. **Ingestion Queue & Source Rules**:
   - ✅ Rule engine for auto-discarding rejected or already applied rows (`rules-model.php`, `auto-review.php`).
   - ✅ Domain whitelisting and blacklisting (`source-sites.php`, `sources-model.php`).
   - ✅ Rate limiting external fetches with `wp_safe_remote_get` (`ingest.php`).
   - ✅ Automated worker retry backoff with exponential backoff on rate limits / 502 / 503 timeouts (`aw_worker_retry_backoff`, `aw_worker_is_in_backoff`, `aw_worker_clear_backoff` in `workers.php` and `sourcing-lists.php`).
   - ✅ Domain trust overrides (`aw_rules_domain_override_save`, `delete`, `aw_rules_domain_overrides`) and custom feed tag exclusions (`aw_rules_feed_excluded_tags_save`, `aw_rules_feed_excluded_tags` in `auto-review.php`).
   - ✅ Native fallback WP Admin screens with empty states and single-item review action handler (`sourceweb-ui.php`, `review-queue.php`).
   - ✅ Complete standalone operation without mandatory DirectoryWeb or InsightWeb boot halt. All 480 checks passing.

---

## Open Tasks & Enhancements

1. **AI Model Router Parity**:
   - Free/open model integration when gated by owner consent.
   - Ongoing evaluation of feed sources against quality thresholds.
