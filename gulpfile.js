// npm install --save-dev gulp gulp-util gulp-concat gulp-uglify
var gulp    = require('gulp'),
    concat  = require('gulp-concat'),
    uglify  = require('gulp-uglify');

var paths = {
  scripts: ['src/js/*'],
};

gulp.task('scripts', function() {
    // Minify and copy all JavaScript (except vendor scripts)
    return gulp.src(paths.scripts)
        .pipe(uglify())
        .pipe(concat('phyz.min.js'))
        .pipe(gulp.dest('build/js'));
});

// Rerun the task when a file changes
gulp.task('watch', function () {
    gulp.watch(paths.scripts, ['scripts']);
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['scripts', 'watch']);