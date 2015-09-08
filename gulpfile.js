var gulp        = require('gulp'),
    stylus      = require('gulp-stylus'),
    csso        = require('gulp-csso'),
    jade        = require('gulp-jade'),
    coffee      = require('gulp-coffee'),
    sourcemaps  = require('gulp-sourcemaps'),
    uglify      = require('gulp-uglify'),
    concat      = require('gulp-concat'),
    util        = require('gulp-util'),
    path        = require('path'),
    filelog     = require('gulp-filelog'), // better task output
    es          = require('event-stream'),
    plumber     = require('gulp-plumber'),
    jeet        = require('jeet'),
    nib         = require('nib'),
    browserSync = require('browser-sync').create();

gulp.task('browser-sync', function() { 
    browserSync.init({server: {baseDir: "dist/"}}); // browser auto-update on save
});

gulp.task('css', function() {
  return es.merge(
      gulp.src('src/assets/*.styl'). 
        pipe(plumber( {handleError: errorHandler})). // prevents parse errors from breaking "watch" task
        pipe(stylus({use: [nib(), jeet()]})), // compiles stylus files, adding plugins
      gulp.src('src/assets/*.css')
    ).
    pipe(csso()). // css compressor
    pipe(gulp.dest('dist/assets/')).
    pipe(browserSync.stream()); 
});

// see https://www.npmjs.com/package/gulp-sourcemaps to setup sourcemaps
gulp.task('js', function() {
  return es.merge(
      gulp.src('src/assets/*.coffee').pipe(coffee()), 
      gulp.src('src/assets/*.js')
    ).
    pipe(uglify()). // minifier etc.
    pipe(concat('all.min.js')).
    pipe(gulp.dest('dist/assets/')).
    pipe(browserSync.stream());
});
 
gulp.task('html', function() {
  return gulp.src('src/*.jade').
    pipe(plumber( {handleError: errorHandler})).  // prevents parse errors from breaking "watch" task
    pipe(jade({ pretty: true })). // compiles jade files
    // add minifier?
    pipe(gulp.dest('dist/')). 
    pipe(browserSync.stream());
});
 
gulp.task('watch', function () {
  gulp.watch('src/assets/*.styl',['css']);
  gulp.watch('src/assets/*.js',['js']);
  gulp.watch('src/assets/*.coffee',['js']);
  gulp.watch('src/*.jade',['html']);
});
 
gulp.task('default', ['watch','js','css','html','browser-sync']);

/* Helpers */
function errorHandler(err){
  console.log(err.message);
  this.end();
}
