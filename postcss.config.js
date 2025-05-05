module.exports = {
  plugins: [
    require('cssnano')({
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
    })
  ]
};
