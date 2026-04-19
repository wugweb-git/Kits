module.exports = {
  source: ['design-system/tokens/**/*.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'design-system/build/css/',
      files: [{ destination: 'variables.css', format: 'css/variables' }],
    },
    js: {
      transformGroup: 'js',
      buildPath: 'design-system/build/js/',
      files: [{ destination: 'tokens.js', format: 'javascript/es6' }],
    },
  },
};
