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
    }
  ]
};

export default cssnanoConfig;
