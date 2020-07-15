const gulp = require('gulp');
const stylus = require('gulp-stylus');

gulp.task('convert', () => {
    return gulp.src('./styles/main.styl')
        .pipe(stylus({
            compress: true
        }))
        .pipe(gulp.dest('./styles/build'));
});

gulp.task('watch', done => {
    gulp.watch(['./styles/main.styl',],
        gulp.series('convert'));

	done();
});