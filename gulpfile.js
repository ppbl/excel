const gulp = require("gulp");
const uglify = require("gulp-uglify");
const concat = require("gulp-concat");
const pump = require('pump');
// 压缩任务    
gulp.task('compress', function (cb) {
    pump([
        gulp.src('./pptable.js'), // 源文件名
        concat("pptable.min.js"), // 合并后文件名
        uglify(), // 执行压缩
        gulp.dest('dist') // 压缩后文件放置目录
    ],
    cb
    );
});

gulp.task("default",["compress"]);//执行任务
// 实时压缩 (只要文件改变就会执行一次)
// 1. 监听什么文件 2. 执行什么任务
/* gulp.watch("./*.js",["js"]);
gulp.watch("./*.css",["css"]); */