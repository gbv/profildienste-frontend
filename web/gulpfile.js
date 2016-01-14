// gulp
var gulp = require('gulp');

// plugins
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var runSequence = require('run-sequence');
var sass = require('gulp-sass');
var rimraf = require('rimraf');
var autoprefixer = require('gulp-autoprefixer');
var es = require('event-stream');
var	concat = require('gulp-concat');
var gulpFilter = require('gulp-filter');
var mainBowerFiles = require('main-bower-files');
var order = require('gulp-order');
var ngHtml2Js = require("gulp-ng-html2js");
var htmlmin = require("gulp-htmlmin");
var cssnano = require('gulp-cssnano');

var srcDir = 'src';
var distDir = 'dist';


var vendor_css = [
  'bower_components/fontawesome/css/font-awesome.css',
  'bower_components/angular-ui-notification/dist/angular-ui-notification.min.css'
];

gulp.task('styles', function() {

  var vendorFiles = gulp.src(vendor_css);

  var appFiles = gulp.src(srcDir+'/styles/**/*.scss')
      .pipe(sass(
          {
            outputStyle: 'compressed',
            includePaths: ['bower_components/bootstrap-sass/assets/stylesheets']
          }
      ).on('error', sass.logError));

  return es.concat(vendorFiles, appFiles)
      .pipe(concat('./bundle.css'))
      .pipe(autoprefixer())
      .pipe(cssnano())
      .pipe(gulp.dest(distDir+'/css'));
});

gulp.task('scripts', function () {

  // Script vendor files
  var jsFilter = gulpFilter('*.js');
  var vendorFiles = gulp.src(mainBowerFiles(['**/*.js', '!bower_components/jquery/dist/jquery.js']).concat(['bower_components/jquery/dist/jquery.js']))
      .pipe(jsFilter)
      .pipe(concat('vendor.js'));

  // App files
  var appFiles = gulp.src(srcDir+'/js/**/*.js')
      //.pipe(jshint())
      //.pipe(jshint.reporter('default'))
      .pipe(order([
        srcDir+'/js/app.module.js',
        srcDir+'/js/app.route.js',
        '*'
      ]))
      .pipe(concat('app.js'));

  // Partials
  var partials = gulp.src(srcDir+'/js/**/*.html')
      .pipe(htmlmin({collapseWhitespace: true}))
      .pipe(ngHtml2Js({
        moduleName: 'Profildienst',
        prefix: '/dist/html/'
      }))
      .pipe(concat('partials.js'));

  return es.concat(vendorFiles, appFiles, partials)
      .pipe(order([
        'vendor.js',
        'app.js',
        'partials.js'
      ]))
      .pipe(concat('bundle.js'))
      .pipe(uglify())
      .pipe(gulp.dest(distDir+'/js'));
});

gulp.task('lint', function() {
  gulp.src([srcDir+'/js/**/*.js', '!./bower_components/**'])
      .pipe(jshint())
      .pipe(jshint.reporter('default'))
      .pipe(jshint.reporter('fail'));
});

gulp.task('clean', function (cb) {
  rimraf(distDir, cb);
});

gulp.task('copy-index', function () {
  gulp.src(srcDir+'/index.html')
      .pipe(htmlmin({collapseWhitespace: true}))
      .pipe(gulp.dest(distDir));
});

gulp.task('copy-config', function () {
  gulp.src(srcDir+'/config.json')
      .pipe(gulp.dest(distDir));
});

gulp.task('build', function() {
  runSequence(
      ['clean'],
      ['lint', 'styles', 'scripts', 'copy-config', 'copy-index']
  );
});

gulp.task('default',
    ['clean', 'build']
);