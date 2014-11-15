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

gulp.task('less', function() {
  return gulp.src('src/less/*.less')
    .pipe(less({
      paths: [path.join(__dirname, 'bower_components', 'bootstrap', 'less')]
    }))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(concat('main.css'))
    .pipe(gulp.dest('css/'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('css/'))
    .pipe(notify({ message: 'LESS compiled!'}));
});

var vendor = [
  'bower_components/angular/angular.js',
  'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
  'bower_components/angular-route/angular-route.js',
  'bower_components/jquery/dist/jquery.js',
  'bower_components/bootstrap/dist/js/bootstrap.js'
];

gulp.task('js', function() {
  return gulp.src(vendor.concat(['src/js/**/*.js']))
    .pipe(concat('main.js'))
    .pipe(gulp.dest('js/'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('js/'))
    .pipe(notify({ message: 'JavaScript compiled!'}));
});

gulp.task('clean', function(callback) {
    del(['css/', 'js/'], callback);
});

gulp.task('build', ['clean'] ,function(){
  gulp.start('less', 'js');
});

gulp.task('default', ['clean'], function() {
  gulp.start('build');

  gulp.watch('src/less/**/*.less', ['less']);

  gulp.watch('src/js/**/*.js', ['js']);
});
