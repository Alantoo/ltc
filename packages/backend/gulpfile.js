/* eslint-disable @typescript-eslint/no-var-requires */
const gulp = require('gulp');
const clean = require('gulp-clean');

gulp.task('dist.clear-migration', function () {
  return gulp
    .src(['dist/migrations/*.d.ts', 'dist/migrations/*.map'])
    .pipe(clean());
});

gulp.task('postbuild', gulp.parallel('dist.clear-migration'));
