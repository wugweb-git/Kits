# @wugweb-git/kits-tokens

The Wugweb Kits design tokens, built from `design-system/tokens` in this repo.

## Install

GitHub Packages needs a token to install, even for a public package. Create a
classic personal access token with only `read:packages`, then:

```ini
# .npmrc in the consuming project
@wugweb-git:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NPM_TOKEN}
```

```bash
npm install --save-exact @wugweb-git/kits-tokens
```

Set `NPM_TOKEN` in the environment of every place that installs (local shell,
Cloudflare Pages build variables).

## Use

```css
@import '@wugweb-git/kits-tokens/variables.css';
```

```js
import { tokens } from '@wugweb-git/kits-tokens/tokens.js';
tokens.base['color-yellow']; // '#FFBE1A'
```

The JSON source is at `@wugweb-git/kits-tokens/tokens/*`.

## Release

1. Change tokens in `design-system/tokens` (by PR, or by Tokens Studio sync).
2. Bump `version` in this `package.json`.
3. Merge, then push a tag `tokens-v<version>` (for example `tokens-v1.0.1`).

The `Release tokens` workflow builds, checks and publishes that version. A tag
that does not match `version` fails the run.
