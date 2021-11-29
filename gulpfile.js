const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const browserSync = require('browser-sync');
const scss = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const babel = require('gulp-babel');
const del = require('del');

gulp.task('script', () => {
  return gulp
    .src('./src/assets/scripts' + '/*.js')
    .pipe(babel({ presets: ['@babel/preset-env'] }))
    .pipe(gulp.dest('./dist/assets/scripts'))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('image', () => {
  return gulp
    .src('./src/assets/images' + '/*.*')
    .pipe(gulp.dest('./dist/assets/images'))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('scss', () => {
  const options = {
    indentType: 'space',
    indentWidth: 2,
    precision: 8,
    sourceComments: true,
  };

  return gulp
    .src('./src/assets/styles' + '/*.scss')
    .pipe(sourcemaps.init())
    .pipe(scss(options))
    .pipe(autoprefixer({ cascade: false }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./dist/assets/styles'))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('html', () => {
  return gulp
    .src('./src' + '/*.html')
    .pipe(gulp.dest('./dist'))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('clean', () => {
  return del('./dist');
});

gulp.task('nodemon', (cb) => {
  let started = false;
  return nodemon({
    script: 'server.js',
  }).on('start', () => {
    if (!started) {
      cb();
      started = true;
    }
  });
});

gulp.task(
  'browserSync',
  gulp.series('nodemon', () => {
    browserSync.init(null, {
      proxy: 'http://localhost:5020',
      port: 5021,
    });
  })
);

gulp.task('watch', () => {
  gulp.watch('./src' + '/**/*.html', gulp.series(['html']));
  gulp.watch('./src/assets/styles' + '/**/*.scss', gulp.series(['scss']));
  gulp.watch('./src/assets/scripts' + '/**/*.js', gulp.series(['script']));
  gulp.watch('./src/assets/images' + '/**/*.*', gulp.series(['image']));
});

const series = gulp.series([
  'clean',
  'image',
  'html',
  'scss',
  'script',
  gulp.parallel('browserSync', 'watch'),
]);

gulp.task('default', series);
