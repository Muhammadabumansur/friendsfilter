var gulp = require('gulp');
// var minifyImg = require('gulp-imagemin');
// var uglifyJs = require('gulp-uglify');
// var minifyCss= require('gulp-minify-css');
// var concat = require('gulp-concat');
var jade = require('gulp-jade');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

gulp.task('jade', function() {
    return gulp.src('./app/*.jade')
        .pipe(jade({
        	pretty: true
        	}))
        .pipe(gulp.dest('./prod/'))
});

gulp.task('jade-watch', ['jade'], reload);

gulp.task('sass', function () {
    return gulp.src('./app/sass/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./prod/css'))
        .pipe(reload({stream: true}));
});

gulp.task('js', function() {
    gulp.src('./app/js/*.js')
        .pipe(gulp.dest('./prod/js/'))
        .pipe(reload({
            stream: true
        }));
});

gulp.task('vendorjs', function() {
    gulp.src('./node_modules/handlebars/dist/handlebars.js')
        .pipe(gulp.dest('./prod/js/'));
});

gulp.task('image', function() {
    gulp.src('./app/img/*.*')
        .pipe(gulp.dest('./prod/img'))
        .pipe(reload({
            stream: true
        }));
});

gulp.task('default', ['sass', 'jade', 'js', 'vendorjs', 'image'], function () {

    browserSync({server: './prod'});

    gulp.watch('./app/sass/*.scss', ['sass']);
    gulp.watch('./app/*.jade', ['jade-watch']);
    gulp.watch('./app/js/*.js', ['js']);
});