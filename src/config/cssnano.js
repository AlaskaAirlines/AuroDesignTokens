/**
 * Shared cssnano configuration for PostCSS
 */

const cssnanoConfig = {
  preset: [
    'default',
    {
      discardComments: {
        removeAll: false, // Preserve license/copyright comments
        removeAllButFirst: true
      },
      normalizeWhitespace: true,
      minifyParams: true,
      colormin: true,
      minifyFontValues: {
        removeQuotes: false // Prevent font family quotes from being removed
      }
    }
  ]
};

export default cssnanoConfig;
