const gulp = require('gulp');
const sass = require('gulp-sass');
const gulpautoprefixer = require('gulp-autoprefixer');
const StyleDictionary = require('style-dictionary').extend('./config.json');



gulp.task('buildTokens', function() {
  StyleDictionary.buildAllPlatforms();
});

gulp.task('buildCss', function() {
  gulp.src('./example/src/{,*/}*.{scss,sass}')
    .pipe(sass({
      errLogToConsole: true,
      outputStyle: 'expanded', //alt options: nested, compact, compressed
    }))
    .pipe(gulpautoprefixer({ browsers: ['last 4 versions'], cascade: false }))
    .pipe(gulp.dest('./example/build/css'));
});

gulp.task('default', ['buildTokens', 'buildCss']);
