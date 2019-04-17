const gulp = require('gulp');
const zip = require('gulp-zip');
const gcopy = require('gulp-copy');
const clean = require('gulp-clean');

function cleanDist() {
    return gulp.src('dist', { 'read': false })
        .pipe(clean({ 'force': true }))

}

function prepareSrc() {
    return gulp.src(['src/*',
        'node_modules/webextension-polyfill/dist/browser-polyfill.min.js'])
        .pipe(gulp.dest('dist'))
};

function prepareIcons() {
    return gulp.src(['icons/**.*'])
        .pipe(gulp.dest('dist/icons'))
}

function pack() {
    return gulp.src(['dist/**'])
        .pipe(zip('ff_ext_fps_meter.zip'))
        .pipe(gulp.dest('dist'))
};

exports.clean = cleanDist;
exports.prepare = gulp.series(cleanDist, prepareSrc, prepareIcons);
exports.default = gulp.series(exports.prepare, pack);
