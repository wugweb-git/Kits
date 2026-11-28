# MailWeb: Pending & Roadmap

## Status, 28 Nov 2026, second batch (3.7.1)

Released from kits-suite with CI green on a3db44c. Tests run: version, held-code and brand checks, more-page and plugin-info tests, the plugin's own suite, `php -l`; screenshots captured in Playground with headless Chrome. Not run on a live WordPress.

- Done: Plugins-screen row (Version | By | View details | Getting Started | Documentation) and the View details modal (Description, Installation, FAQ, Changelog, Screenshots, Reviews) from readme.txt and assets/screenshot-N.png; screenshots and captions; .pot regenerated; UX audit fixes 01, 07, 08, 09, 10 that touch this plugin; More from Kits registered after the plugin's own menu with a redirect to Kits Core's page when Core is active.
- Open: sending form UX (13, 14); real inbox needs the Hostinger Mail API (not testable in Playground).
- Open, whole suite: official Plugin Check on a live WordPress (deferred by the owner); WordPress.org submission (when everything is done; Claude confirms each product first); staging then live deploy; UX findings listed in docs/ux-audit-2026-11-28.md; screen reader, Safari and real phones.

## Built 28 Nov 2026 (3.6.0)

- Resend button on Mail → Email Logs (failed or held rows with a kept message only); Inbox status (New, Read, Replied, Forwarded) in both lists; Provider picker for the SMTP presets. Tests in `tests/delivery.php`. Not run on a live WordPress, a real mail server or a browser.
- Still not built: nothing compares the Sent folder, so "Replied" is only what the server's Answered flag says; the fallback has no live check.

## Verified status, 27 Nov 2026 (this section overrides any 'done' or 'resolved' mark below)

Checked line by line against the code on 27 Nov 2026. Updated for 3.4.0 the same day.

### 3.5.0 (27 Nov 2026): Animal Writes code out of the plugin
- Moved unchanged to `sites/animalwrites/mailweb/` (see its README and CHANGELOG 3.5.0): website forms, newsletter shortcode and old list, compat names, and the Animal Writes part of `fluentcrm.php`. It must be deployed with 3.5.0 on the live site; not run on a live WordPress, only parsed and string-checked (`sites/animalwrites/mailweb/tests/site-tests.php`).
- Open: `mailweb_fcrm_contact_for()` and `mailweb_fcrm_subscribe()` remain in the plugin but only the site layer's forms and DirectoryWeb call them; the FluentCRM dashboard tidy-up (hides the Pro card and Quick Links) is still on for every site and may deserve a switch. Kits Core in the site layer and DirectoryWeb call `mailweb_fcrm_*` by function name; DirectoryWeb uses only `mailweb_fcrm_on()` and `mailweb_fcrm_tag_ids()`, which stay.

### Built in 3.4.0 (all off on a clean install; code in `includes/mail-delivery.php`, `includes/mail-fallback-mailer.php`, `includes/mailweb-fluentsmtp.php`)
- Real-mail logging: with the switch "Keep a log line for every email" on (Site sending → Delivery log, fallback and alerts), one line per `wp_mail()` is kept in option `mailweb_email_logs`: time, recipients, subject, status, sent-through, error. Never the text. Status is what `wp_mail_succeeded` / `wp_mail_failed` reported: accepted by the mail server (not "delivered"), failed, accepted by the fallback, or held in the queue (`queued`, from `mail-cap.php`). The last 200 lines, cut to the retention days. The test email is logged the same way, only when the switch is on (this closes the open bug that the test send always kept recipient and subject).
- Status column in the Email Logs screen (Mail → Email Logs, `manage_mailweb`): the words above, plus the way it was sent. A notice says when logging is off.
- Fallback SMTP: a second SMTP connection (server, port, mailbox, password stored encrypted and never printed back, "remove saved password" box). When the primary send fails, the same message is sent once through it (`MailWeb_Fallback_Mailer`, a PHPMailer subclass swapped in before `wp_mail()` uses it); the primary settings are restored after. The message leaves from the fallback mailbox with the original From as Reply-To. Not used while FluentSMTP, Post SMTP or WP Mail SMTP is active, or when another plugin has already put its own PHPMailer in place.
- Failure alerts: with the switch on, an email to the site administrator (or an address set in the form) when an email cannot be sent, at most one an hour; later failures are counted and reported in the next one. No recipient or text in it. Sent past MailWeb's limit and pause; a failing alert raises no alert. The old webhook alert (`mailweb_send_failure_alert`, option `mailweb_alert_webhook`) is removed; there is no Slack/Discord/Telegram/webhook alert.
- Pause notice dismiss: a "Dismiss for me" link on the paused notice (nonce, `manage_mailweb`), stored per user in `mailweb_pause_dismissed`; hides that pause only, a new pause shows the notice again. Sending stays paused; Resume is unchanged.
- Tests: `php plugins/mailweb/tests/delivery.php` (stub PHPMailer and WordPress functions), plus `tests/run.php` and `tests/sending-mode.php`.

### Still NOT BUILT
- The Status column in the Inbox and other lists (New / Read / Replied / Forwarded). `answered` and `forwarded` are stored but nothing reads them, and nothing compares the Sent folder. 3.4.0's Status column is only in the Email Logs screen.
- Email resend: `mailweb_resend_email()` and `POST /mailweb/v1/queue/resend` exist, no screen button calls them.
- SMTP presets: REST route only, no UI.
- Webhook alerts (Slack, Discord, Telegram, custom URL): removed on purpose; alerts are email only.
- The fallback has no live check: it is tested with a stub PHPMailer only. It needs a real second SMTP account and a forced failure of the primary to confirm. It does not apply when another plugin's PHPMailer is already in use, and it does not retry mail another plugin short-circuits with `pre_wp_mail`. When the fallback sends, the From address is the fallback mailbox.
- Not logged: an email another plugin short-circuits with `pre_wp_mail`; a message accepted by the server is not proof of inbox delivery (no bounce handling).
- Alerts depend on mail: if every route (primary and fallback) is down the alert cannot go out either; there is no second channel.
- Not tested: the admin forms and notices in a browser, the `wp_mail` hooks inside WordPress, cron and the screens (only the pure helpers, the mailer retry logic and the form's HTML are covered by `tests/delivery.php`).
- The Hostinger 'fallback to wp_mail / SMTP 465' is in fact a fallback to the Mail API over `wp_remote_request`.
- The block headed 'Resolved' for tenant profiles, rate limits and the retry queue is wrong: that code is HELD and not loaded. See the HOLD section.

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
   - ✅ Site Health direct test (`mailweb_email_sending`) and WP-CLI commands (`wp mailweb health|stats|test|prune-logs`).
   - Pause dismiss, email logging, the fallback SMTP connection and failure alerts were marked done here in error: they are built in 3.4.0 (see the top of this file). The queue resend UI and webhook alerts are not built.

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

## HOLD: tenant sender profiles and retry queue (review of 26 Nov 2026, not released)

Code is on kits-suite (`includes/tenant-profiles.php`, commit 207df6a) but MUST NOT ship in a release until these are fixed. Found by reading the code:
- The daily limit does not stop the mail: it queues a copy and still returns the arguments, so the mail goes out now and again from the queue.
- Retry loop: the queue re-sends through `wp_mail()`; a failure fires `wp_mail_failed`, which pushes a new item with the attempt count back at 0, so the cap of 3 never holds.
- A second queue beside the existing `mailweb_queue` table (`mail-cap.php`), so one failed mail can be retried twice, including during a mailbox pause.
- Full message bodies, recipients and headers (password-reset links included) are kept in the plain option `mailweb_retry_queue`, with no expiry.
- `from_name` and `label` are only trimmed: a newline can inject a header.
- `mailweb_retry_queue_tick` and the options `mailweb_tenant_profiles`, `mailweb_retry_queue` and the `mailweb_rate_*` transients are not cleaned up on deactivation or in `uninstall.php`; the option is read, changed and written back with no lock.
- Fix shape: reuse the `mailweb_queue` table instead of a second queue; a real hold or cancel for over-limit mail; carry the attempt count; sanitise headers; retention; uninstall cleanup; tests for retry, loop and duplicate. Readme must then describe profiles and what is kept.
