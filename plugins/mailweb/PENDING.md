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

## Open Tasks & Enhancements

1. **Multi-Tenant Mail Sending**:
   - Allow tenants to define separate sender profiles (e.g. `alerts@tenant.com` vs `newsletter@tenant.com`).
   - Rate limiting and retry queue in database for failed outbound emails.
