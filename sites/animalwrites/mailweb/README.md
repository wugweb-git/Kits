# Animal Writes site layer: MailWeb

What MailWeb carried for this one site until 3.4.1. MailWeb 3.5.0 is neutral and does not ship it. Not packaged (the build only reads `themes/` and `plugins/`).

Deploy this alongside MailWeb 3.5.0. Without it the live site loses its Website forms in the Inbox, the volunteer fields, update link and `{{aw.update_link}}` smart code, the Contact and Claim notes on contacts, `wp aw crm-setup`, the `[aw_newsletter]` shortcode with the old list's confirm and unsubscribe links, its block list of junk addresses, its tag names and the old `aw_*` function names that Kits Core still calls.

Install: copy this folder to `wp-content/mu-plugins/animalwrites-mailweb/` and add a one-line loader `wp-content/mu-plugins/animalwrites-mailweb.php` containing `<?php require __DIR__ . '/animalwrites-mailweb/site.php';`. `site.php` waits for `plugins_loaded` priority 6 (after MailWeb's own 5) and does nothing unless MailWeb's FluentCRM helpers are loaded, that is, MailWeb active with FluentCRM or Fluent Forms active.

Moved unchanged from `plugins/mailweb/includes/`:

- `website-forms.php`: Mail → Website forms (Contact, Volunteer, Claim, Report entries and the older `aw_message` messages) through the `mailweb_forms_source` filter, the `AW_HOSTINGER_MAIL_TOKEN` to `MAILWEB_API_TOKEN` bridge, the unread badge and the site-check hooks.
- `newsletter.php`: `[aw_newsletter]`, the `{prefix}aw_subscribers` backup table and the old confirm and unsubscribe links, the phone sync (`aw_nl_ff_phone_sync`).
- `fluentcrm-compat.php`: the old `aw_crm_*` and related names and constants.
- `fluentcrm-aw.php`: the Animal Writes part of the old `fluentcrm.php`, cut out at the same lines: the block list of junk addresses (`MAILWEB_FCRM_BLOCKED_EMAILS`), `MAILWEB_FCRM_TAG_TITLES`, the unticked-box and Claim handling, the FluentCRM Pro one-off email headers (`X-AW-Priority`) and its retry, volunteer and form custom fields, the update link and `{{aw.*}}` smart code, the newsletter-box and Contact-form notes, the campaign signer, the unsubscribe sync to `aw_subscribers`, `wp aw crm-setup` and the Fluent Forms submission hook.

`site.php` loads these four and gives the generic plugin the site's block list (filter `mailweb_fcrm_blocked_emails`, with the old `aw_crm_blocked_emails` filter still applied) and tag titles (filter `mailweb_fcrm_tag_titles`).

Notes: deactivating MailWeb no longer clears the `aw_nl_ff_phone_sync` cron events (they are harmless: they run `mailweb_nl_ff_phone_sync` from `newsletter.php` here, and nothing when this layer is not loaded). Stored options, table, meta keys, tags and hooks keep their names.

`tests/site-tests.php`: checks that this layer's files parse and carry the moved functions. Run `php sites/animalwrites/mailweb/tests/site-tests.php` from the repo root.
