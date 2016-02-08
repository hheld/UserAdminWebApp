var gulp        = require('gulp'),
    uglify      = require('gulp-uglify'),
    htmlReplace = require('gulp-html-replace'),
    source      = require('vinyl-source-stream'),
    browserify  = require('browserify'),
    watchify    = require('watchify'),
    streamify   = require('gulp-streamify'),
    babelify    = require('babelify'),
    del         = require('del');

var path = {
  HTML: './index.html',
  CSS: ['./css/app.css'],
  MINIFIED_OUT: 'build.min.js',
  OUT: 'build.js',
  DEST: '../client',
  DEST_BUILD: '../client',
  DEST_SRC: '../client',
  ENTRY_POINT: './index.js',
};

gulp.task('clean', function() {
  del.sync(['../client/**/*'], {force: true});
});

gulp.task('watch', function() {
  gulp.watch(path.HTML, ['copyHtml']);
  gulp.watch(path.CSS, ['copyCss']);

  process.env.NODE_ENV = 'development';

  var watcher = watchify(browserify({
    entries: [path.ENTRY_POINT],
    debug: true,
    cache: {}, packageCache: {}, fullPaths: true,
  }).transform(babelify, {presets: ['es2015', 'react']}));

  return watcher.on('update', function() {
    watcher.bundle()
        .on('error', swallowError)
        .pipe(source(path.OUT))
        .pipe(gulp.dest(path.DEST_SRC));
    console.log('Updated');
  }).bundle()
      .pipe(source(path.OUT))
      .pipe(gulp.dest(path.DEST_SRC));
});

gulp.task('build', ['replaceHtml'], function() {
  process.env.NODE_ENV = 'production';

  browserify({
    entries: [path.ENTRY_POINT]
  })
  .transform(babelify, {presets: ['es2015', 'react']})
  .bundle()
  .pipe(source(path.MINIFIED_OUT))
  .pipe(streamify(uglify()))
  .pipe(gulp.dest(path.DEST_BUILD));
});

gulp.task('replaceHtml', ['copy', 'clean'], function() {
  gulp.src(path.HTML)
        .pipe(htmlReplace({
          js: '/' + path.MINIFIED_OUT,
        }))
        .pipe(gulp.dest(path.DEST));
});

gulp.task('production', ['build']);
gulp.task('default', ['clean', 'watch', 'copy']);

gulp.task('copyHtml', function() {
  gulp.src(path.HTML)
      .pipe(gulp.dest(path.DEST));
});

gulp.task('copyCss', function() {
  gulp.src(path.CSS)
      .pipe(gulp.dest(path.DEST + '/css'));
});

gulp.task('copyBootstrap', function() {
  gulp.src('./node_modules/bootstrap/dist/css/bootstrap.min.css')
      .pipe(gulp.dest(path.DEST + '/css'));
});

gulp.task('copy', ['copyHtml', 'copyCss', 'copyBootstrap']);

function swallowError(error) {
  console.log(error.toString());
  this.emit('end');
}
