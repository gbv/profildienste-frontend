var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    less = require('gulp-less'),
    minifycss = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    path = require('path'),
    notify = require('gulp-notify'),
    del = require('del');

var vendor_css = [
  'bower_components/fontawesome/css/font-awesome.css'
];

gulp.task('vendorcss', function() {
  return gulp.src(vendor_css)
    .pipe(concat('vendor.css'))
    .pipe(gulp.dest('dist/css/'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('dist/css/'))
    .pipe(notify({ message: 'Vendor CSS compiled!'}));
});

gulp.task('fa-font', function() {
  return gulp.src('bower_components/fontawesome/fonts/**.*') 
    .pipe(gulp.dest('dist/fonts')); 
});

gulp.task('less', function() {
  return gulp.src('src/less/*.less')
    .pipe(less({
      paths: [path.join(__dirname, 'bower_components', 'bootstrap', 'less')]
    }))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(concat('main.css'))
    .pipe(gulp.dest('dist/css/'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('dist/css/'))
    .pipe(notify({ message: 'LESS compiled!'}));
});

var vendor = [
  'bower_components/jquery/dist/jquery.min.js',
  'bower_components/angular/angular.min.js',
  'bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js', 
  'bower_components/jquery-ui/jquery-ui.min.js',
  'bower_components/bootstrap/dist/js/bootstrap.min.js',
  'bower_components/ngInfiniteScroll/build/ng-infinite-scroll.min.js'
];

gulp.task('js', function() {
  return gulp.src('src/js/**/*.js')
    .pipe(concat('main.js'))
    .pipe(gulp.dest('dist/js/'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js/'))
    .pipe(notify({ message: 'JavaScript compiled!'}));
});

gulp.task('vendorjs', function() {
  return gulp.src(vendor)
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('dist/js/'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js/'))
    .pipe(notify({ message: 'Vendor JS compiled!'}));
});

gulp.task('clean', function(callback) {
    del(['css/', 'js/'], callback);
});

gulp.task('build', ['clean'] ,function(){
  gulp.start('less', 'js', 'vendorjs' ,'vendorcss', 'fa-font');
});

gulp.task('default', ['clean'], function() {
  gulp.start('build');

  gulp.watch('src/less/**/*.less', ['less']);

  gulp.watch('src/js/**/*.js', ['js']);
});
