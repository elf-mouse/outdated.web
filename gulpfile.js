/* global -$ */

//var config = require('./config.json');
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync');
var reload = browserSync.reload;

gulp.task('sass', function() {
  return gulp.src('sass/main.scss')
    .pipe($.sass({
      outputStyle: 'nested', // libsass doesn't support expanded yet
      precision: 10,
      includePaths: ['.'],
      onError: console.error.bind(console, 'Sass error:')
    }))
    .pipe($.postcss([
      require('autoprefixer-core')({
        browsers: ['last 1 version']
      })
    ]))
    .pipe(gulp.dest('.tmp/css'))
    .pipe($.rename('wario.css'))
    .pipe(gulp.dest('dist/css'))
    .pipe($.csso())
    .pipe($.rename('wario.min.css'))
    .pipe(gulp.dest('dist/css'))
    .pipe(reload({
      stream: true
    }));
});

gulp.task('clean', require('del').bind(null, ['.tmp', 'dist']));

gulp.task('serve', ['sass'], function() {
  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['.tmp', 'dist', 'test'],
      routes: {
        '/dist': 'dist'
      }
    }
  });
  // watch for changes
  gulp.watch([
    'test/*.html',
    '{test,dist}/**/*.{css,js}'
  ]).on('change', reload);
  gulp.watch('sass/**/*.scss', ['sass']);
});

gulp.task('build', ['sass'], function() {
  return gulp.src('dist/**/*').pipe($.size({
    title: 'build',
    gzip: true
  }));
});

gulp.task('default', ['clean'], function() {
  gulp.start('build');
});
