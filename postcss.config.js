import cssnanoConfig from './src/config/cssnano.js';

export default {
  plugins: [
    require('cssnano')(cssnanoConfig)
  ]
};
