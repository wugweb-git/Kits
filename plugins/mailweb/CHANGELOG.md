# MailWeb changelog

Each version's notes also sit in `readme.txt`. Newest first.

## 3.4.0

- New, all off on a clean install (Mail → Settings → Site sending → "Delivery log, fallback and alerts"):
  - Delivery log: one line per email (time, recipients, subject, status, error; never the text) with the status WordPress reported: accepted by the mail server (not "delivered"), failed, accepted by the fallback, or held in the queue. The Email Logs screen has a Status column. The test email is logged the same way, and only when the switch is on.
  - Fallback SMTP: a second SMTP connection (password stored encrypted, never shown again). When the primary send fails, the message is sent once through it. Not used while another SMTP plugin is active.
  - Failure alerts: an email to the site administrator (or an address you set) when an email cannot be sent, at most one an hour, with the count and the last error but no recipient or text.
- The "Email sending is paused" notice has a "Dismiss for me" link (per user, until the next pause). Sending stays paused.
- The webhook alert code (never called) is removed; alerts are email only.
- Still not built: the Status column in the Inbox lists (New / Read / Replied / Forwarded), a resend button, an SMTP presets screen.

## 3.3.6

- The 'Email sending is paused' notice now shows only on the Dashboard and the MailWeb screens. It used to show on every admin screen with no way to dismiss it.

## 3.3.5

- Corrects release notes that described work not yet built: the Status column in lists (3.3.0), email logging for real mail (only test emails are logged), the fallback SMTP connection (saved but not used to send), failure alert webhooks (the setting exists, nothing sends an alert), the per-user pause-notice dismissal (no button), and a resend control. The Failure Alert Webhook entry is removed from External services because MailWeb never calls it.
- Nothing else changes.

## 3.3.4

- Activating MailWeb no longer takes over the site's email. Forcing the From address, the daily limit and queue, and keeping the text of sent emails are separate switches in Mail → Settings → Site sending, off on a new install. A site that already had MailWeb settings keeps the From address and limit on; the text of sent emails is kept only if you turn that on, for 1 to 365 days (default 30), and a daily job deletes older text.
- MailWeb stands down while FluentSMTP, Post SMTP or WP Mail SMTP is active (filter `mailweb_defer_to_external_smtp`).
- Without Kits Core the Dashboard, Inbox and Settings are drawn by WordPress itself instead of showing an error.
- The FluentCRM, Fluent Forms and newsletter code loads only when FluentCRM or Fluent Forms is active, and the "New form entries" notice on every admin screen is gone (the Mail menu badge still counts them).
- Only administrators can read the mailboxes; editors need the filter `mailweb_caps_from`. Editors who had access lose it on this update unless the filter is set.
- Uninstall with "delete data" ticked now also removes the sending switches, email log, fallback SMTP and alert webhook settings, the capability, the pause marker and every scheduled job; deactivation stops all jobs. The readme now matches the code on uninstall, logging and who can read mailboxes, and lists the SMTP presets and DNS lookups under External services.
- Admin screens use style sheets instead of inline styles and script.

## 3.3.3

- Fix: 3.3.2 loaded the sender-profile and retry-queue code, which is not ready. It is no longer loaded, and the failed mail it kept in the database, its schedule and its profiles are removed once.

## 3.3.2

- The "Upgrade to Premium" link is gone from the Plugins screen (there is no premium product).

## 3.3.1

- The direct (non-WordPress.org) build now carries an Update URI header, so the site checks the Kits registry for new versions. The WordPress.org build still omits it.

## 3.3.0

- Lists: a Status column (New, Read, Replied, Forwarded) was announced here. It was never built; see 3.3.5.

## 3.2.1

- Shown as MailWeb (was Mailweb). The folder, text domain, settings, webhook address and everything saved stay the same.
- With Kits Core: a MailWeb tab on the Kits screens and a MailWeb row in Kits → Welcome → System Status.
- Update URI header, so WordPress.org never offers another plugin as an update.

## 3.2.0

- Message view: no remote content loads while pictures are hidden (a Content-Security-Policy in the frame; protocol-relative and escaped URLs included), and an email's own CSS cannot break out of its style tag.
- Replying or forwarding always flags the original Answered / Forwarded.
- All mailboxes: paging reads deeper into each mailbox, so later pages no longer skip messages or come up empty; dates are compared as dates.
- The mailbox lookup runs once per request and waits 5 minutes after a failure, so admin pages do not stall when the Mail API is down.
- Mailboxes with the same name on different domains get their own key.
- Queue: an email with no confirmation from the server is held after 4 tries instead of being resent; only errors about our own mailbox pause sending, not a refused recipient.
- FluentCRM: the sync no longer marks mail unread, runs one at a time and does not duplicate notes.
- Overview and dashboard: read and unread shown as in the inbox. No PHP warnings from crafted URLs.

## 3.1.1

- Opening a message marks it read, and replying to or forwarding a message marks the original read. The Mail API does not do this when the text is fetched.
- Translation template (languages/mailweb.pot) brought up to date.

## 3.1.0

- Mail menu: Inbox, Overview and Settings; Settings and Overview links on the Plugins screen.
- Mail lists are WordPress list tables: checkboxes, bulk actions, row actions, search and pagination.
- One address parser for every input; the 5-minute schedule is registered once.
- Unused functions removed.

## 3.0.0

- Now a standalone product: slug, folder and text domain `mailweb`; functions, options, hooks and the queue table renamed to `mailweb_`.
- Mailboxes come only from the API token; choose which may send and the default From in Mail → Settings. Webhook secrets per mailbox.
- Webhook address is now `/wp-json/mailweb/v1/mail-in`.
- Secrets saved on the settings screen are encrypted.
- Uploaded attachments are checked against the 10 MB total before they are read.
- FluentCRM feed settings: on/off, tag and mailboxes.
- Website forms folder and the block under signatures are now extension points (`mailweb_forms_source`, `mailweb_after_signature`).
- All text translatable (text domain `mailweb`, `languages/mailweb.pot`).
- Removed: copying mail into WordPress posts, and the old reply screen (both had been switched off).

## 2.9.3

- FluentCRM's dashboard no longer shows the "Set Up FluentSMTP" card; Mailweb sends the site's email.

## 2.9.2

- Removed the 2.9.1 change (no second signature on emails with their own); back to 2.9.0 behaviour.

## 2.9.0

- FluentCRM sync for mail is back: each incoming email from a person finds or creates their contact (tag "Emailed us") with a note holding the full text and an "Open in Mail" link; replies sent from Mail are noted too. Checked every 5 minutes and when the webhook fires; `wp mailweb crm-sync --all` catches up.

## 2.8.0

- Renamed from Wug Mail to Mailweb. The folder, settings, webhook address and everything saved stay the same.

## 2.7.0

- The SMTP connection (mailbox, password, server, port, sender name, default Reply-To) moved here from Kits Core: all of a site's mail is now in Mailweb. Same saved settings; nothing to re-enter.

## 2.6.0

- Plugin Check fixes: output escaped where it is printed, request values sanitised, nonce checks where uploads are read, translator comment for the unread count.
- Plugin information and this readme.

## 2.5.2

- Countdown campaign strip under signatures, with a line on what the campaign is about.

## 2.4.0

- Campaign strip under signatures.

## 2.3.0

- Signatures keep their line breaks. Replies go from a chosen mailbox.

## 2.2.0

- Inbox redesigned with the WordPress list table, an "All mailboxes" view and edit-screen layouts.

## 2.0.0

- A real inbox in WordPress through the Hostinger Mail API.

## 1.0.0

- Incoming mail, Mail menu with unread count, dashboard widget.
