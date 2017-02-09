var gulp        = require('gulp');
var browserSync = require('browser-sync').create();
var sass        = require('gulp-sass');
var reload      = browserSync.reload;
var babel = require('gulp-babel');
var sourcemaps = require('gulp-sourcemaps');


// 静态服务器 + 监听 scss/html 文件
gulp.task('serve', ['sass'], function() {

    browserSync.init({
        server: {
            baseDir:'./',
            index:'index.html'
        }
    });

    gulp.watch("src/scss/*.scss", ['sass']);
    gulp.watch("src/js/*.js", ['babel']);
    gulp.watch("example/*.html").on('change', browserSync.reload);
});

// scss编译后的css将注入到浏览器里实现更新
gulp.task('sass', function() {
    return gulp.src("src/scss/*.scss")
        .pipe(sass())
        .pipe(gulp.dest("dist/css"))
        .pipe(reload({stream: true}));
});

gulp.task('babel', () => {
    return gulp.src('src/js/*.js')
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/js'))
        .pipe(reload({stream:true}))
});
 


gulp.task('default', ['serve']);