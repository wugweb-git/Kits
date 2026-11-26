# UX discovery: Kits suite wp-admin information architecture

**Date:** 26 Nov 2026
**Status:** Draft, for the owner's review. A proposal only: no code was changed. Owner, 26 Nov: the 25 Nov rule meant InsightWeb and SourceWeb must not be merged into one plugin. Each stays its own standalone plugin and each needs an overhaul, so grouping inside each plugin is allowed.
**Evidence:** the menu and tab code in `plugins/*` on kits-suite `26797bf`, and `docs/architecture/admin-ia-inventory.md`. No user research or live usage data exists, so every claim about people is marked as an assumption.

## 1. Problem

The suite shows 7 top-level menus (Kits, DirectoryWeb, SourceWeb, RankWeb, InsightWeb, MailWeb, PlanWeb) and 43 screens or tabs between them. The same kind of screen has a different name and a different position in each plugin, and two plugins carry far more tabs than the rest. A person who knows one plugin cannot predict where anything is in another.

## 2. What exists today

| Plugin | Shell tabs | Screens outside the shell | Count |
|---|---|---|---|
| Kits | Home, Theme Options, Settings, Tools, Help | Brand Customizer (via Appearance), Setup Wizard and Scripts & Pixels (hidden) | 5 |
| DirectoryWeb | Dashboard, Claims, Listings, Settings, Place intros | Claims review (Fluent Forms menu) | 5 |
| SourceWeb | Dashboard, To review, Enrichment review, Sources, Keywords, Rules, AI models, Workers, Rejected, Relay log, Change log, Settings | none | 12 |
| RankWeb | Dashboard, Insights, Modules, FAQ, Settings | SEO CSV, Internal links, Redirect tools, Images | 5 (+4) |
| InsightWeb | Dashboard, Keywords, Rising, Pages, Clarity, Check list, Sourcing keywords, Links, Server, Settings | none | 10 |
| MailWeb | Dashboard, Inbox, Settings | Site sending | 3 (+1) |
| PlanWeb | Dashboard, Entries, Settings | Calendar | 3 (+1) |

## 3. Insights (from the code, not from users)

1. **Every plugin already has the same two ends:** Dashboard first, Settings last. That is a convention worth keeping.
2. **The middle is unnamed.** What sits between them is a mix of four different kinds of screen: work you do (review, claims, inbox, entries), things you read (insights, keywords, rising, pages), setup (sources, rules, workers, AI models, modules), and logs (rejected, relay log, change log, server).
3. **Counts are lopsided.** SourceWeb (12) and InsightWeb (10) carry 22 of the 43 screens. The other five plugins hold 3 to 5 each.
4. **Same job, different words:** Dashboard / Overview, Settings / Modules / Tools, Help as a card in one plugin, a tab in none, and a contextual help tab in two.
5. **Some screens have no home:** Setup Wizard, Scripts & Pixels and Brand Customizer sit under Kits but are not tabs; four RankWeb screens exist only as server-rendered pages, so they are outside the shell.

## 4. Jobs (assumed, to validate)

| Job | Where it lives today |
|---|---|
| "See how the site is doing" | each plugin's Dashboard; InsightWeb Keywords, Rising, Pages; RankWeb Insights |
| "Clear what needs me" (a queue) | SourceWeb To review and Enrichment review; DirectoryWeb Claims; MailWeb Inbox; PlanWeb Entries |
| "Set it up once" | SourceWeb Sources, Keywords, Rules, AI models, Workers; RankWeb Modules; Kits Theme Options, Settings |
| "Find out why it broke" | SourceWeb Rejected, Relay log, Change log; InsightWeb Server, Check list |
| "Learn how it works" | Kits Help; MailWeb Help card; contextual help tabs |

## 5. Proposed grouping (a naming and order convention)

Use one order and one vocabulary in every plugin. Groups are labels and an order, not a new level of tabs:

| Group | Meaning | Examples (today's name → group) |
|---|---|---|
| **Overview** | read the state | Dashboard; InsightWeb Keywords, Rising, Pages; RankWeb Insights |
| **Work** | a queue a person clears | To review, Enrichment review, Claims, Inbox, Entries, Calendar |
| **Setup** | choose how it behaves | Sources, Keywords (SourceWeb), Rules, AI models, Workers, Modules, Place intros, Theme Options |
| **Logs** | what happened | Rejected, Relay log, Change log, Server, Check list |
| **Settings** | last, always | Settings |

How it applies without changing any screen: the tab order inside each plugin follows Overview, Work, Setup, Logs, Settings. Where the shell later supports groups (it does not today), the same five labels become the group headings.

Per plugin, the order would be:
- **SourceWeb:** Dashboard · To review, Enrichment review · Sources, Keywords, Rules, AI models, Workers · Rejected, Relay log, Change log · Settings (this is the grouping the inventory already proposed).
- **InsightWeb:** Dashboard, Keywords, Rising, Pages · Links, Clarity · Server, Check list · Settings; Sourcing keywords only with SourceWeb.
- **The five small plugins:** already in this order; no change.

## 6. Design principles

1. **Same place, same name.** *Because* the same screen kind has four names today. *Means:* one vocabulary across plugins. *Means not:* a rename of stored data or routes.
2. **Work before setup.** *Because* the queues are what people return to daily (assumption). *Means:* queue screens come right after Overview. *Means not:* hiding setup.
3. **Every screen reachable.** *Because* three screens are reachable only by URL. *Means:* a screen is either a tab, a link from a tab, or retired. *Means not:* adding links to screens with open owner decisions (OD2, OD3).
4. **Stand alone.** *Because* each plugin ships separately. *Means:* grouping is data inside each plugin, with no dependency on a sibling.

## 7. Assumptions and risks

| Assumption | How to check | Risk if wrong |
|---|---|---|
| People return mainly to the queues | usage data on the live site, or ask the owner | the order Work-before-Setup helps nobody |
| One vocabulary is easier than per-plugin names | five-minute test with two staff | churn for no gain |

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| A grouped header needs a change to the shared shell and a rebuilt `build/index.js` | High | Medium | order-only first; groups only when the shell supports them |
| Renaming tabs breaks bookmarks | Low | Low | keep the slugs and URLs; change only labels |

## 8. Click feedback (smooth-ux), not audited in full

The shell's buttons and lists already set `aria-busy` (`kits-core/src/shell/index.js`, `list.js`, `calendar.js`). I did not check optimistic updates, route skeletons, link-pending states or reduced-motion handling, so this report makes no claim about them. That audit is a separate pass.

## 9. Constraints and scope

- **In scope:** the order and names above, as a decision.
- **Out of scope:** new tabs, a shell change, moving screens between plugins, the Tools and Help tabs (waiting on the owner's reference list).
- **Later:** group headings in the shell; shell versions of the four RankWeb server screens; a decision on Setup Wizard and Scripts & Pixels.

## 10. Next steps

- [ ] Owner: approve the five group names and the order, or change them.
- [x] Owner (26 Nov): InsightWeb and SourceWeb stay two separate standalone plugins; grouping inside each is allowed.
- [ ] Re-order the `$order` arrays in `sourceweb-ui.php` and `insightweb-ui.php` and rebuild nothing (labels and order only).
