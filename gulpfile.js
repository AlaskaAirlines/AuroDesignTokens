const gulp = require('gulp');
const StyleDictionary = require('style-dictionary').extend('./config.json');



gulp.task('buildTokens', function() {
  StyleDictionary.buildAllPlatforms();
});
