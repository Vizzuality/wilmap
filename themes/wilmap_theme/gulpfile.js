const gulp = require('gulp');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const sass = require('gulp-sass');
const compass = require('gulp-compass');
const plumber = require('gulp-plumber');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const clean = require('gulp-clean');

gulp.task('sass', function () {
  gulp.src('sass/*.scss')
      .pipe(plumber())
      .pipe(sourcemaps.init())
      .pipe(sass({
        outputStyle: 'extend'
      }).on('error', sass.logError))
      .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 7', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest('dis/css/'))
});

gulp.task('compass', function () {
  gulp.src('sass/*.scss')
    .pipe(plumber())
    .pipe(compass({
      config_file: 'config.rb',
      css: 'dist/css',
      sass: 'sass'
    }))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 7', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(gulp.dest('dist/css/'));
});

gulp.task('clean-js', function () {
  gulp.src('dist/js', {read: false})
      .pipe(plumber())
      .pipe(clean())
});

gulp.task('clean-css', function () {
  gulp.src('dist/css', {read: false})
      .pipe(plumber())
      .pipe(clean())
});


gulp.task('clean', ['clean-js', 'clean-css']);

gulp.task('watch', ['javascript', 'compass'], () => {
  gulp.watch('sass/*.scss', ['compass']);
  gulp.watch('js/*.js', ['javascript']);
});

gulp.task('javascript', function() {
  console.log('building js ...');

  return gulp.src('js/*.js')
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'));
});

gulp.task('default', function() {
  console.log('Hello world!');
});

gulp.task('build', ['clean', 'compass', 'javascript']);
