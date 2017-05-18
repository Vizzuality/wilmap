const gulp = require('gulp');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const livereload = require('gulp-livereload');
const del = require('del');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');

const CONFIG = {
  dist: './themes/wilmap/dist'
};

gulp.task('imagemin', function () {
  return gulp.src('./themes/wilmap/images/*')
  .pipe(imagemin({
    progressive: true,
    svgoPlugins: [
      {
        removeViewBox: false
      }
    ],
    use: [pngquant()]
  }))
  .pipe(gulp.dest('./themes/wilmap/images'));
});


gulp.task('sass', function () {
  gulp.src('./themes/wilmap/sass/**/*.scss')
    .pipe(sourcemaps.init())
        .pipe(sass({
          outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 7', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./themes/wilmap/css'));
});

gulp.task('clean', () => {
  del.sync(CONFIG.dist);
});

gulp.task('components', () => {
  gulp.src('./themes/wilmap/lib/components/*.js')
    .pipe(babel({ presets: ['latest', 'stage-3'] }))
    .on('error', function (e) {
      console.log('>>> ERROR', e);
      this.emit('end');
    })
    .pipe(concat('components.js'))
    .pipe(gulp.dest(CONFIG.dist));
});

gulp.task('helpers', () => {
  gulp.src('./themes/wilmap/lib/helpers/*.js')
    .pipe(babel({ presets: ['latest', 'stage-3'] }))
    .on('error', function (e) {
      console.log('>>> ERROR', e);
      this.emit('end');
    })
    .pipe(concat('helpers.js'))
    .pipe(gulp.dest(CONFIG.dist));
});

gulp.task('pages', ['clean', 'components', 'helpers'], () => {
  gulp.src(['./themes/wilmap/lib/**/*.js', '!./themes/wilmap/lib/components/*.js', '!./themes/wilmap/lib/helpers/*.js'])
    .pipe(babel({ presets: ['latest', 'stage-3'] }))
    .on('error', function (e) {
      console.log('>>> ERROR', e);
      this.emit('end');
    })
    .pipe(gulp.dest(CONFIG.dist));
});

gulp.task('watch', ['pages', 'sass'], () => {
  livereload.listen();
  gulp.watch('./themes/wilmap/sass/**/*.scss', ['sass']);
  gulp.watch('./themes/wilmap/lib/**/*.js', ['pages']);
  gulp.watch(
    [
      './themes/wilmap/css/style.css',
      './themes/wilmap/**/*.twig',
      './themes/wilmap/js/*.js'
    ], (files) => {
    livereload.changed(files);
  });
});

gulp.task('build', ['pages', 'sass', 'imagemin']);
