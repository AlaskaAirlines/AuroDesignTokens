const gulp = require('gulp'),
  sass = require('gulp-sass'),
  gulpautoprefixer = require('gulp-autoprefixer'),
  StyleDictionary = require('style-dictionary').extend('./config.json'),
  postcssCustomProperties = require('postcss-custom-properties'),
  postcss = require('gulp-postcss'),
  concat = require('gulp-concat');

const tokensDir = './build/cssTokens/_TokenVariables.css';
const tempResources = './example/temp/css';


// Gulp task to process Design Tokens to Sass variable file
// See config.json for Style Dictionary process settings
gulp.task('buildTokens', function() {
  StyleDictionary.buildAllPlatforms();
});


// Gulp task to build CSS file
gulp.task('processCss', function() {
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
        importFrom: tokensDir
      })
    ]))

    // Output final CSS in destination
    .pipe(gulp.dest(tempResources));
});

gulp.task('concatResources', function () {
  return gulp.src([tokensDir, tempResources + '/*.css'])
    .pipe(concat("build.css"))
    .pipe(gulp.dest('./example/build/css'));
});


// Task(s)
gulp.task('default', ['buildTokens', 'processCss', 'concatResources']);
