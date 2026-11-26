# MailWeb: Pending & Roadmap

## Active Scope & Responsibilities
The email and delivery management plugin owns:
- Transactional and outbound email routing.
- Hostinger Mail API PHP SDK (`hostinger/mail-api-php-sdk`) integration.
- SMTP / IMAP / POP3 protocol configurations.
- Real-time DKIM (`hostingermail1._domainkey`) and SPF DNS deliverability verification card.
- FluentCRM campaign sending safety check integration.

---

## Built & Operational (22 Nov 2026)

1. **Hostinger Mail API Transport**:
   - ✅ Seamless fallback from Hostinger Mail API SDK (`hostinger/mail-api-php-sdk`) to native `wp_mail` / SMTP SSL (port 465).
   - ✅ Test email utility directly from `MailWeb > Settings > Site sending` (`do=test`) with instant error feedback.

2. **DNS & Deliverability Telemetry**:
   - ✅ Real-time DKIM (`hostingermail1._domainkey`) and SPF DNS verification card.
   - ✅ Background cron (`mailweb_daily_dns_check`) checking DKIM records every 24 hours, alerting administrators if DNS verification fails.

3. **FluentSMTP-Parity Enhancements & Plan Completion (25 Nov 2026)**:
   - ✅ Site Health direct test (`mailweb_email_sending`), per-user `mailweb_pause_dismissed` meta + REST route.
   - ✅ Email logging + queue resend (`mailweb-fluentsmtp.php`, `GET /mailweb/v1/logs`, `POST /mailweb/v1/queue/resend`).
   - ✅ Fallback SMTP connection (`mailweb_smtp_fallback`, encrypted password, `/mailweb/v1/services/smtp-fallback`).
   - ✅ Throttled failure alert webhooks (`/mailweb/v1/services/alerts`) and WP-CLI commands (`wp mailweb health|stats|test|prune-logs`).

---

## Open Tasks & Enhancements (Resolved 26 Nov 2026)

1. **Multi-Tenant Mail Sending**:
   - ✅ Added tenant sender profiles (`includes/tenant-profiles.php`, `mailweb_tenant_sender_profiles()`, `X-Mailweb-Profile` routing, `/mailweb/v1/services/sender-profiles`).
   - ✅ Added per-profile daily rate limiting (`mailweb_tenant_rate_allow()`) and outbound retry queue with exponential backoff (`mailweb_retry_queue_push()`, `mailweb_retry_queue_process()`, `/mailweb/v1/services/retry-queue`).

## Carried over from docs/org (26 Nov 2026)

Open items from the retired plan docs, each checked against the code on 26 Nov. The full old text is in git history (kits-suite `9f81e36` and earlier, `docs/org/`).

- Phase 4: remove the simple-table helper (`class-mailweb-simple-table.php`, `admin-table.php`) and the classic fallback handlers.
- IMAP adapter: skeleton only (`providers.php:175`).
- Multi-tenant sender profiles; (the daily DNS check already existed: 26 Nov it also checks SPF, shows its warning on MailWeb screens and is removed on uninstall).
- Menu order: the plan says Dashboard first, the code opens on Inbox; owner to decide.
- No tests for the Hostinger API transport, flush and retry, or inbox. A live check needs the Hostinger token and SMTP credentials.
