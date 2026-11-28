# Decisions

Each decision is final unless a later entry replaces it. Newest facts win.

1. **One repository, independent artifacts.** All plugins, the theme, shared packages, tooling and the design system live in `wugweb-git/Kits`. Every product builds, versions and releases alone.
2. **Plugins stand alone.** No plugin requires another at runtime. Kits Core is optional and adds the shared shell and extras when present.
3. **Site-specific code stays out of plugins.** It lives in `sites/<tenant>/<plugin>/` as must-use plugins. Plugins expose neutral filters. A CI check fails on a site's name in plugin strings.
4. **Stored `aw_` keys are not renamed.** Option, meta and REST names keep their prefix so stored data keeps working.
5. **Two builds.** Commercial keeps `Update URI` and updates from the registry; the WordPress.org build omits it. The Update URI header stays on the commercial build.
6. **The More from Kits page is commercial-only.** It makes no request on view; Install fetches the registry and the release zip and checks the SHA-256. It is not in the WordPress.org build.
7. **Releases come from `kits-suite`.** CI must be green on the exact commit; one product is released at a time; the registry rebuilds from the tags.
8. **Branches.** No pull requests for this repository; work merges directly. `kits-suite` is the default and `main` is kept equal to it by fast-forward. Merged branches are deleted.
9. **SourceWeb workers stay in their own repository** (`wugweb-git/sourceweb-workers`). SourceWeb starts them through the GitHub API with a token and repository set in `wp-config.php`. There is no `workers/` folder and no `animal-writes-core` plugin in this repository.
10. **No workspace tooling.** Each plugin owns its `package.json` and, where needed, `composer.json`.
11. **InsightWeb country figures come through Site Kit's `dimensions`.** The daily run stores clicks and impressions by country; the Country view appears once rows exist.
12. **PlanWeb drag to reschedule is deferred.** The Timeline and date range ship instead.
13. **Staging is changed only after the owner's go.** Nothing is deployed to staging or production on assumption.
14. **Animal Writes admin-layer values** (menu order, labels, edit-screen map) are not in this repository.
