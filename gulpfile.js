// =====================================================================

/*
  This is an EXAMPLE GULP PIPELINE for the purpose of building
  usable Sass and CSS resources from DesignToken.json file resources.

  This is NOT used for src build management!
*/

// =====================================================================

const gulp = require('gulp'),
  gulpSequence = require('gulp-sequence'),
  sass = require('gulp-sass'),
  gulpautoprefixer = require('gulp-autoprefixer'),
  StyleDictionary = require('style-dictionary').extend('./example/config.json'),
  postcssCustomProperties = require('postcss-custom-properties'),
  postcss = require('gulp-postcss'),
  concat = require('gulp-concat'),
  clean = require('gulp-clean');

const cssTokens = './example/tokensBuild/TokenVariables.css';
const tempResources = './example/temp/';
const destination = './example/prodBuild/';


// Gulp task to process Design Tokens to Sass variable file
// See config.json for Style Dictionary process settings
gulp.task('buildTokens', function() {
  StyleDictionary.buildAllPlatforms();
});


// Gulp task to build CSS file
gulp.task('processCss', ['cleanTemp'], function () {
  // set path to where Sass files are located to be processed
  return gulp.src('./example/src/{,*/}*.{scss,sass}')

    // Sass pipeline
    .pipe(sass({
      errLogToConsole: true,
      outputStyle: 'expanded', //alt options: nested, compact, compressed
    }))

    // Post Sass to CSS process for addressing proprietary prefixes
    .pipe(gulpautoprefixer({ browsers: ['last 10 versions'], cascade: false }))

    // PostCss polyfill pipeline for CSS Custom Properties (CSS variables)
    .pipe(postcss([

      // Boolean flag determines if CSS Custom Property code is in final output
      // or only outputs legacy supported version CSS
      postcssCustomProperties({
        preserve: true,

        // Import CSS Custom Properties for token variable use
        importFrom: cssTokens
      })
    ]))

    // Output final CSS in destination
    .pipe(gulp.dest(tempResources));
});


// Gulp task to concatenate out CSS from Sass and the Tokens CSS Custom Props file
gulp.task('concatResources', function () {
  return gulp.src([cssTokens, tempResources + '*.css'])
    .pipe(concat('prodBuild.css'))
    .pipe(gulp.dest(destination));
});


// Utility task to clean up processed resources
gulp.task('cleanTemp', function () {
  return gulp.src(tempResources, {read: false})
    .pipe(clean());
});


// Task(s)
// Gulp Sequence is used to force Gulp to address tasks in specific build order
gulp.task('default', gulpSequence('buildTokens', 'processCss', 'concatResources'))
