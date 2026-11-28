=== MailWeb ===
Contributors: wugweb
Tags: email, inbox, hostinger, smtp, signature
Requires at least: 7.1
Tested up to: 7.1
Requires PHP: 8.0
Stable tag: 3.7.5
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Hostinger Mail inside WordPress: read, reply and send from your mailboxes, plus optional SMTP sending with a daily limit and queue.

== Description ==

MailWeb puts a site's Hostinger mailboxes inside WordPress, so the team reads and answers mail where they already work. Everything is read from and written to the mailboxes through the Hostinger Mail API, so webmail and WordPress always show the same messages, folders and read state. Nothing from the mailboxes is copied into WordPress.

= Inbox =

* Every mailbox the API token can see, with its aliases, in one list or one at a time ("All mailboxes" mixes them, newest first).
* Folders: Inbox, Sent, Archive, Spam and Trash, with unread counts. A site can add a Website forms folder for its own form messages (filter `mailweb_forms_source`).
* WordPress list table: checkboxes, bulk actions (mark read or unread, archive, spam, move to Trash), row actions, search and pagination.
* Reading view in the edit-screen layout. Messages show in a sandboxed frame with scripts removed and pictures from the internet hidden until you choose to show them. Attachments download from the mailbox.
* Reply, Reply all, Forward and New message, sent from the mailbox itself: replies keep the thread, the original is marked answered, and a copy is kept in Sent.
* Delete only moves to Trash; nothing is removed for good.
* Unread badge on the Mail menu and a Mail dashboard widget.

= Profiles and signatures =

* Each mailbox and alias has a display name, a signature and a picture.
* The signature is added to replies and to the emails the site sends, laid out in a simple card.
* A site can add its own block under the signature (a banner, a notice) with the `mailweb_after_signature` filter.

= Sending =

* Activating MailWeb changes nothing about how the site sends email. Three things are separate switches in Mail → Settings → Site sending → "How MailWeb handles the site's email", all off on a new install: force the From address and sender name, the daily sending limit and queue, and keeping the text of sent emails. A site that already had MailWeb settings saved before 3.3.4 keeps the first two on, as before.
* With a mailbox password saved, the site's own email (notices, confirmations, newsletters) is sent through that SMTP mailbox, with the sender name and a default Reply-To. Until a password is saved, WordPress sends the default way. A test email can be sent from the settings.
* MailWeb stands down while FluentSMTP, Post SMTP or WP Mail SMTP is active: it does not change the From address, send through its own SMTP settings, limit or queue. Developers can change this with the filter `mailweb_defer_to_external_smtp`.
* The daily sending limit with a queue (off until you switch it on), for mailboxes that allow a fixed number of emails a day: priorities, retries, a pause when the mail server refuses mail, and pacing for FluentCRM campaigns. While it is on, an email over the limit waits in the queue table with its text until it can be sent.
* Delivery log, fallback SMTP and failure alerts (Mail → Settings → Site sending → "Delivery log, fallback and alerts"), each a switch that is off on a new install:
  * Delivery log: one line per email with its recipients, subject, status and error (never the text), shown in Mail → Email Logs. The status is what WordPress reported: accepted by the mail server (not the same as delivered to the inbox), failed, accepted by the fallback, or held in MailWeb's queue.
  * Fallback SMTP: a second SMTP mailbox. If the primary send fails, the same email is sent once through it, from the fallback mailbox with your usual From address as Reply-To. The password is stored encrypted and never shown again. Not used while another SMTP plugin is active.
  * Failure alerts: an email to the site administrator (or an address you choose) when an email cannot be sent, at most one an hour, with a count and the last error but no recipient or text. It goes out through the same mail system, so it cannot report a total outage of every route.
* The "Email sending is paused" notice can be dismissed per user ("Dismiss for me"); sending stays paused until you resume it.
* Not built yet: a Status column (New, Read, Replied, Forwarded) in the Inbox lists, and a resend button.
* All mail settings in one place: Mail, then Settings.

= Without Kits Core =

Kits Core is optional. Without it MailWeb draws the Dashboard (a status table), the Inbox (folders, search, paging, reading, replying, forwarding and writing) and Settings (Mail API token, which mailboxes may send, default From, aliases, Site sending) with plain WordPress screens. The richer layout, bulk actions in the Inbox list and the Profiles editor (names, signatures, pictures) need Kits Core.

= FluentCRM =

* Incoming email from people is noted on their FluentCRM contact (found, or made as "transactional" so they get no marketing), with a tag you choose, the full text and an "Open in Mail" link; replies sent from Mail are noted as "Reply sent". Choose the mailboxes in Mail → Settings.
* A site can keep a sender out of FluentCRM with the `mailweb_crm_skip_email` filter (return true for that address).

= Who can use it =

Administrators only: reading, replying to and deleting (to Trash) the site's mailboxes needs the capability `manage_mailweb`, which only administrators hold. A site that wants editors to read mail can return `array( 'edit_others_posts' )` from the filter `mailweb_caps_from`. Editors who had access through MailWeb 3.3.3 or earlier lose it when 3.3.4 first runs, unless the filter is set. Settings need `manage_options`. Every action checks a nonce and the user's capability, and sending from Mail is limited to 30 messages an hour.

= What MailWeb keeps in the database =

* Always: settings, the profiles and, in the queue table, a row for each email the site sends (time, priority, status, error; no recipient, subject or text).
* Only while "Keep a log line for every email" (delivery log) is on: a list of the last 200 emails with recipients, subject, status and error (never the text), trimmed to the retention below. Emails sent from the settings as tests are in it too, only while it is on.
* Only while "Keep the text of sent emails" is on: the recipients, subject and text of each sent email, for the number of days you choose (1 to 365, default 30), then deleted by a daily job. Password reset links are among the emails. A held email that never went out loses its text after the same time. With the daily limit on, an email that is waiting or being retried keeps its text until it is sent, then it is cleared.
* Messages in the mailboxes are not copied; they are read live.

= Secrets =

The Mail API token, webhook secrets and SMTP password can be set in `wp-config.php` (`MAILWEB_API_TOKEN`, `MAILWEB_SECRET_<MAILBOX>`, `MAILWEB_SMTP_PASSWORD`). Values saved on the settings screen are stored encrypted with a key made from the site's salts; if the salts change, enter them again.

= Source code =

The JavaScript in `build/` is compiled with `@wordpress/scripts`. Its unminified source is in the `src/` folder of this plugin and is public at https://github.com/wugweb-git/Kits/tree/kits-suite/plugins/mailweb. To rebuild it, run `npm install` and then `npm run build` in that folder.

== Installation ==

1. Upload the `mailweb` folder to `/wp-content/plugins/` and activate MailWeb.
2. In hPanel, create a Mail API token for the domain's mailboxes. Save it in Mail → Settings, or add it to `wp-config.php`: `define( 'MAILWEB_API_TOKEN', '...' );`
3. In Mail → Settings, choose which mailboxes may send and the default From, add aliases, and fill in the profiles.
4. Optional: in hPanel, add a webhook for "message.received" on each mailbox pointing to `/wp-json/mailweb/v1/mail-in`, and save each webhook's secret in Mail → Settings, so unread counts refresh as soon as mail arrives.
5. Optional: set the SMTP mailbox and the daily limit in Mail → Settings → Site sending.

== Frequently Asked Questions ==

= Does it store my email in WordPress? =

No. Messages are read live from the mailboxes. For the site's own outgoing emails MailWeb keeps metadata only (time, priority, status, error) in its queue table, plus a recipient and subject log only if you switch on the delivery log, unless you switch on "Keep the text of sent emails" (then also recipients, subject and text, for the days you set), and an email waits in a queue table with its text while the daily limit is on and reached.

= Will it take over my site's email when I activate it? =

No. The forced From address, the daily limit and the logging of email text are each a switch, off on a new install. It also stands down when FluentSMTP, Post SMTP or WP Mail SMTP is active.

= Does it need Kits Core? =

No. Without it the Dashboard, Inbox and Settings are drawn by WordPress itself (see "Without Kits Core"). FluentCRM and Fluent Forms are optional: the code for them loads only when they are active.

= Can it send as an alias? =

No. The Hostinger Mail API sends only as a real mailbox, so choose a mailbox in the From field.

= What happens on uninstall? =

By default nothing is deleted: settings, the queue table and saved secrets stay in place. If "Delete MailWeb's data when the plugin is deleted" is ticked (Mail → Settings → Site sending), deleting the plugin first writes a backup file to wp-content/uploads/wugweb-backups and then removes MailWeb's options, queue table, logs, transients, the capability and its scheduled jobs. Mailbox contents, FluentCRM contacts and notes are never touched. Deactivating the plugin always stops its scheduled jobs and deletes no data.

== External services ==

MailWeb connects to external services only when configured by the site administrator:

* **Hostinger Mail API (`https://api.mail.hostinger.com`):** When a Hostinger Mail API token is configured, reads mailbox folders/messages and sends replies/outbound mail through your Hostinger mailboxes. Terms & Privacy: [https://www.hostinger.com/privacy-policy](https://www.hostinger.com/privacy-policy).
* **Configured SMTP Server:** When SMTP credentials are configured under **Mail → Settings → Site sending**, delivers site emails via that SMTP host (Hostinger Mail by default). The SMTP presets for Hostinger, Gmail, Outlook, SendGrid, Mailgun, Postmark, Amazon SES and a custom server are only a list of host names and ports offered in the settings; MailWeb connects to a preset's host only if you save that host with a password. Sent email, including recipients and text, goes to that server. Terms and privacy are those of the provider you choose.
* **Fallback SMTP Server:** Only when you switch on the fallback and save a server, mailbox and password under **Mail → Settings → Site sending**. If the primary send fails, the email, including recipients and text, is sent to that server. Terms and privacy are those of the provider you choose. Failure alerts and the delivery log send nothing outside the site: the alert is an ordinary WordPress email.
* **DNS lookups (your DNS resolver):** The Site sending screen and a daily job look up the DKIM (`hostingermail1._domainkey`) and SPF TXT records of the site's mail domain, through the server's own DNS resolver, to warn when email authentication is not set up. No data about your visitors or email is sent; the lookups name the domain only.
* **FluentCRM and Fluent Forms (local WordPress plugins, optional):** When active (and, for the mailbox feed, enabled in settings), MailWeb writes contact notes, tags and list changes in your own site's FluentCRM and shows form entries in the Inbox. Nothing leaves the site.
* **More from Kits install (direct build only, only when you click Install):** the "More from Kits" page makes no request when it is viewed. When an administrator clicks Install, WordPress fetches the Wugweb registry (`https://wugweb-git.github.io/Kits/registry/index.json`, GitHub Pages) and then downloads that plugin's zip from the project's GitHub releases (`https://github.com/wugweb-git/Kits/releases/`), checked against the registry's SHA-256 before it installs. No site data is sent. This page is not in the WordPress.org build. Turn the Install button off with `define( 'KITS_NO_PLUGIN_INSTALLS', true );`. Terms: https://docs.github.com/en/site-policy/github-terms/github-terms-of-service. Privacy: https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement

== Upgrade Notice ==

= 3.7.5 =
Hook names and variables now carry the plugin prefix.

= 3.7.4 =
Checks for its own updates from the registry. Log lines go through one helper and are written only with WP_DEBUG_LOG on. The bundled vendor/ ships with its composer.json.

= 3.5.0 =
Site-specific code left the plugin. A site that relied on it (website forms in the Inbox, the newsletter shortcode, volunteer fields, `wp aw crm-setup`) needs its own site layer loaded; nothing changes for other sites.

= 3.4.1 =
Wording fixes only: the sender name in FluentCRM emails and setup is the site's name, the Inbox names Hostinger only on a Hostinger mailbox, and an empty Inbox no longer asks you to choose a message.

= 3.4.0 =
Adds a delivery log, a fallback SMTP connection and failure alerts by email, all off until you switch them on, and a dismiss link on the paused notice. Failure alerts are by email only; the unused webhook alert code is gone.

= 3.3.0 =
Adds a Site Health email sending check and WP-CLI commands (`wp mailweb health|stats|test|prune-logs`). Logging, fallback and alerts arrived in 3.4.0.

== Bundled libraries ==

MailWeb ships these Composer libraries in `vendor/`, all under the MIT licence (GPL-compatible). Their licence texts are in each package folder.

* Hostinger Mail API PHP SDK (`hostinger/mail-api-php-sdk`) and, for it: Guzzle (`guzzlehttp/guzzle`, `guzzlehttp/promises`, `guzzlehttp/psr7`), PSR interfaces (`psr/container`, `psr/http-client`, `psr/http-factory`, `psr/http-message`), `ralouphie/getallheaders`.
* Symfony components used by the SDK: `serializer`, `property-access`, `property-info`, `type-info`, `string`, `deprecation-contracts`, and the `polyfill-ctype`, `polyfill-intl-grapheme`, `polyfill-intl-normalizer`, `polyfill-mbstring` and `polyfill-php80` packages.
* Type and docblock helpers: `phpdocumentor/reflection-common`, `reflection-docblock` and `type-resolver`, `phpstan/phpdoc-parser`, `doctrine/deprecations`, `webmozart/assert`.

Sources: https://packagist.org/packages/hostinger/mail-api-php-sdk and each package's page on Packagist.

== Screenshots ==

1. The Dashboard, with unread mail, website forms, the daily sending limit, the queue and what is waiting to send.
2. The Inbox on the Website forms folder, showing six demo messages with unread ones in bold and a reading pane.
3. Settings, Sending: the number of emails allowed in 24 hours and how many are kept back from campaigns.
4. Email Logs: recent messages with time, recipient, subject, delivery status and the route they were sent through.
5. A website form message open in the Inbox, with the sender's fields and Reply, Mark unread and Move to Trash.

== Changelog ==

= 3.7.5 =
* Plugin Check clean-up: hook names, variables and request-method reads carry each plugin's own prefix (hooks named aw_si_*, aw_enrich_* and similar are now insightweb_*, sourceweb_*, kits_*, rankweb_*, directoryweb_*), and the update code no longer touches WordPress's update cache.

= 3.7.4 =
* Checks for its own updates from the registry. Log lines go through one helper and are written only with WP_DEBUG_LOG on. The bundled vendor/ ships with its composer.json.

= 3.7.3 =
* The first screens read Inbox, Dashboard, Settings in the menu and the header, and the Overview item reads Dashboard. Checkboxes and radios in labels have a 24px hit area.

= 3.7.2 =
* The Dashboard and queue show "No limit" instead of a huge number when the daily limit is off. The provider picker preselects the saved provider. DNS values are visible text. Inbox and Email Logs empty states link to the setting that fixes them. Resend buttons are named for the message. The More from Kits link of a plugin goes to Kits Core's page when Core is active.

= 3.7.1 =
* The Plugins screen now shows Version, By, View details (Description, Installation, FAQ, Changelog, Screenshots, Reviews), Getting Started and Documentation for this plugin, and the plugin carries its screenshots. The More from Kits page registers after the plugin's own menu and a deep link goes to Kits Core's page when Core is active. The Dashboard says "No daily limit set" instead of a huge number when the limit is off.

= 3.7.0 =
* A new More from Kits page lists the other Wugweb plugins with their release version and lets an administrator install and activate one (direct build only; nothing is requested until Install is clicked; the download is checked against its SHA-256; not in the WordPress.org build).

= 3.6.0 =
* Resend button on Email Logs for mail waiting to be retried (failed or held). The log keeps the queue row id.
* Inbox shows New, Read, Replied or Forwarded for each message.
* A Provider picker on Site sending fills the SMTP server and port.

= 3.5.0 =
* MailWeb no longer carries anything for one site. The code that served only the Animal Writes site is removed from the plugin and kept in that site's own layer (`sites/animalwrites/mailweb/`, outside the plugin package): the Website forms folder and its Fluent Forms entries, the `[aw_newsletter]` shortcode and old list links, the volunteer fields, update link and `{{aw.*}}` smart code, the contact-form and claim notes, `wp aw crm-setup`, a block list of junk addresses, the old `aw_*` function names and the `AW_HOSTINGER_MAIL_TOKEN` bridge.
* The generic FluentCRM helpers stay (`includes/fluentcrm.php`): the Newsletter list, tags, subscribing a person, a contact for an address, UTM tags on campaign links and the dashboard tidy-up. The block list is empty by default and is added through the filter `mailweb_fcrm_blocked_emails`; tag titles come from `mailweb_fcrm_tag_titles` (DirectoryWeb's two organisation tags are built in).
* The `mailweb_forms_source` filter is unchanged, so any site can still add a Website forms folder.
* Needs the Animal Writes site layer on that site: MailWeb 3.5.0 alone does not restore the above there. The sending switches, delivery log, fallback SMTP and alerts are untouched.

= 3.4.1 =
* The FluentCRM Reply-To name, the {{aw.*}} smart-code group name and the `wp aw crm-setup` sender and business name use the site's name instead of a fixed one (a site called Animal Writes reads exactly as before).
* The Inbox line "In step with Hostinger webmail" names Hostinger only when the mailbox is Hostinger's; otherwise it reads "In step with your webmail".
* An empty Inbox says "No messages yet." and no longer also says "Choose a message to read it.".
* The Inbox page heading is "MailWeb", with "Inbox" as a section heading under it.

= 3.4.0 =
* New, all off on a clean install (Mail → Settings → Site sending → "Delivery log, fallback and alerts"): a delivery log with a Status column in Mail → Email Logs (accepted by the mail server, failed, accepted by the fallback, held in the queue; never the text), a fallback SMTP connection used once when the primary send fails, and failure alerts by email to the site administrator (at most one an hour, no recipient or text).
* The "Email sending is paused" notice has a "Dismiss for me" link (per user, until the next pause).
* The webhook alert code, which was never called, is removed; alerts are email only.
* Still not built: the Status column in the Inbox lists (New, Read, Replied, Forwarded), a resend button and an SMTP presets screen.

= 3.3.6 =
* The 'Email sending is paused' notice now shows only on the Dashboard and the MailWeb screens. It used to show on every admin screen with no way to dismiss it.

= 3.3.5 =
* Corrects release notes that described work not yet built: the Status column in lists (3.3.0), email logging for real mail (only test emails are logged), the fallback SMTP connection (saved but not used to send), failure alert webhooks (the setting exists, nothing sends an alert), the per-user pause-notice dismissal (no button), and a resend control. The Failure Alert Webhook entry is removed from External services because MailWeb never calls it.
* Nothing else changes.

= 3.3.4 =
* Activating MailWeb no longer takes over the site's email. Forcing the From address, the daily limit and queue, and keeping the text of sent emails are separate switches in Mail → Settings → Site sending, off on a new install. A site that already had MailWeb settings keeps the From address and limit on; the text of sent emails is kept only if you turn that on, for 1 to 365 days (default 30), and a daily job deletes older text.
* MailWeb stands down while FluentSMTP, Post SMTP or WP Mail SMTP is active (filter `mailweb_defer_to_external_smtp`).
* Without Kits Core the Dashboard, Inbox and Settings are drawn by WordPress itself instead of showing an error.
* The FluentCRM helpers load only when FluentCRM or Fluent Forms is active, and the "New form entries" notice on every admin screen is gone (the Mail menu badge still counts them).
* Only administrators can read the mailboxes; editors need the filter `mailweb_caps_from`. Editors who had access lose it on this update unless the filter is set.
* Uninstall with "delete data" ticked now also removes the sending switches, email log, fallback SMTP and alert webhook settings, the capability, the pause marker and every scheduled job; deactivation stops all jobs. The readme now matches the code on uninstall, logging and who can read mailboxes, and lists the SMTP presets and DNS lookups under External services.
* Admin screens use style sheets instead of inline styles and script.

= 3.3.3 =
* Fix: 3.3.2 loaded the sender-profile and retry-queue code, which is not ready. It is no longer loaded, and the failed mail it kept in the database, its schedule and its profiles are removed once.

= 3.3.2 =
* The "Upgrade to Premium" link is gone from the Plugins screen (there is no premium product).

= 3.3.1 =

* The direct (non-WordPress.org) build now carries an Update URI header, so the site checks the Kits registry for new versions. The WordPress.org build still omits it.

= 3.3.0 =
* Lists: a Status column (New, Read, Replied, Forwarded) was announced here. It was never built; see 3.3.5.

= 3.2.1 =
* Shown as MailWeb (was Mailweb). The folder, text domain, settings, webhook address and everything saved stay the same.
* With Kits Core: a MailWeb tab on the Kits screens and a MailWeb row in Kits → Welcome → System Status.
* Update URI header, so WordPress.org never offers another plugin as an update.

= 3.2.0 =
* Message view: no remote content loads while pictures are hidden (a Content-Security-Policy in the frame; protocol-relative and escaped URLs included), and an email's own CSS cannot break out of its style tag.
* Replying or forwarding always flags the original Answered / Forwarded.
* All mailboxes: paging reads deeper into each mailbox, so later pages no longer skip messages or come up empty; dates are compared as dates.
* The mailbox lookup runs once per request and waits 5 minutes after a failure, so admin pages do not stall when the Mail API is down.
* Mailboxes with the same name on different domains get their own key.
* Queue: an email with no confirmation from the server is held after 4 tries instead of being resent; only errors about our own mailbox pause sending, not a refused recipient.
* FluentCRM: the sync no longer marks mail unread, runs one at a time and does not duplicate notes.
* Overview and dashboard: read and unread shown as in the inbox. No PHP warnings from crafted URLs.

= 3.1.1 =
* Opening a message marks it read, and replying to or forwarding a message marks the original read. The Mail API does not do this when the text is fetched.
* Translation template (languages/mailweb.pot) brought up to date.

= 3.1.0 =
* Mail menu: Inbox, Overview and Settings; Settings and Overview links on the Plugins screen.
* Mail lists are WordPress list tables: checkboxes, bulk actions, row actions, search and pagination.
* One address parser for every input; the 5-minute schedule is registered once.
* Unused functions removed.

= 3.0.0 =
* Now a standalone product: slug, folder and text domain `mailweb`; functions, options, hooks and the queue table renamed to `mailweb_`.
* Mailboxes come only from the API token; choose which may send and the default From in Mail → Settings. Webhook secrets per mailbox.
* Webhook address is now `/wp-json/mailweb/v1/mail-in`.
* Secrets saved on the settings screen are encrypted.
* Uploaded attachments are checked against the 10 MB total before they are read.
* FluentCRM feed settings: on/off, tag and mailboxes.
* Website forms folder and the block under signatures are now extension points (`mailweb_forms_source`, `mailweb_after_signature`).
* All text translatable (text domain `mailweb`, `languages/mailweb.pot`).
* Removed: copying mail into WordPress posts, and the old reply screen (both had been switched off).

= 2.9.3 =
* FluentCRM's dashboard no longer shows the "Set Up FluentSMTP" card; Mailweb sends the site's email.

= 2.9.2 =
* Removed the 2.9.1 change (no second signature on emails with their own); back to 2.9.0 behaviour.

= 2.9.0 =
* FluentCRM sync for mail is back: each incoming email from a person finds or creates their contact (tag "Emailed us") with a note holding the full text and an "Open in Mail" link; replies sent from Mail are noted too. Checked every 5 minutes and when the webhook fires; `wp mailweb crm-sync --all` catches up.

= 2.8.0 =
* Renamed from Wug Mail to Mailweb. The folder, settings, webhook address and everything saved stay the same.

= 2.7.0 =
* The SMTP connection (mailbox, password, server, port, sender name, default Reply-To) moved here from Kits Core: all of a site's mail is now in Mailweb. Same saved settings; nothing to re-enter.

= 2.6.0 =
* Plugin Check fixes: output escaped where it is printed, request values sanitised, nonce checks where uploads are read, translator comment for the unread count.
* Plugin information and this readme.

= 2.5.2 =
* Countdown campaign strip under signatures, with a line on what the campaign is about.

= 2.4.0 =
* Campaign strip under signatures.

= 2.3.0 =
* Signatures keep their line breaks. Replies go from a chosen mailbox.

= 2.2.0 =
* Inbox redesigned with the WordPress list table, an "All mailboxes" view and edit-screen layouts.

= 2.0.0 =
* A real inbox in WordPress through the Hostinger Mail API.

= 1.0.0 =
* Incoming mail, Mail menu with unread count, dashboard widget.
