const gulp = require("gulp");
const ts = require("gulp-typescript");
var browserSync = require("browser-sync").create();

gulp.task("compile", function () {
    return gulp.src("src/*.ts")
        .pipe(ts({ module: "es6" }))
        .pipe(gulp.dest("dest/static/js"))
        .pipe(browserSync.stream());
});

gulp.task("copy", function () {
    return gulp.src("src/**/!(*.ts)")
        .pipe(gulp.dest("dest"))
        .pipe(browserSync.stream());
});

gulp.task("watch", function () {
    gulp.watch("src/**/*", gulp.series(["compile", "copy"]))
});

gulp.task('browser-sync', function (callback) {
    browserSync.init({
        server: {
            baseDir: "./dest"
        }
    });
    callback();
});


gulp.task("default", gulp.series(["compile", "copy", "browser-sync", "watch"]))
