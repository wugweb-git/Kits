/**
 * Optional Style Dictionary v4 config for design-system/tokens (W3C DTCG format).
 *
 * The canonical build is `npm run ds:tokens:build` (scripts/build-design-tokens.mjs),
 * which needs no dependency and also writes the media-query modes in
 * design-system/tokens/modes. Style Dictionary is not a dependency of this repo;
 * this config exists for tools that expect it and builds the base :root only.
 *
 * Names match the canonical build: path joined with "-", "_" segments dropped.
 * No value transforms, so values are written exactly as stored.
 */
module.exports = {
  source: ['design-system/tokens/*.json'],
  usesDtcg: true,
  hooks: {
    transforms: {
      'name/wugweb': {
        type: 'name',
        transform: (token) => token.path.filter((p) => p !== '_').join('-'),
      },
    },
  },
  platforms: {
    css: {
      transforms: ['name/wugweb'],
      buildPath: 'design-system/build/sd/',
      files: [{ destination: 'variables.css', format: 'css/variables', options: { outputReferences: true } }],
    },
  },
};
