const gulp = require('gulp');
const stylus = require('gulp-stylus');

gulp.task('convert', done => {
	gulp.src('./styles/main.styl')
		.pipe(stylus({
			compress: true
		}))
		.pipe(gulp.dest('./styles/build'));

	gulp.src('./styles/fontfaces.styl')
		.pipe(stylus({
			compress: true
		}))
		.pipe(gulp.dest('./styles/build'));

	done();
});

gulp.task('watch', done => {
	gulp.watch(['./styles/main.styl', './styles/fontfaces.styl'],
		gulp.series('convert'));

	done();
});