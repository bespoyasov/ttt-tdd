const fs = require("fs");
const gulp = require("gulp");
const path = require("path");

const fileinclude = require("gulp-file-include");
const htmlmin = require("gulp-htmlmin");
const typograf = require("gulp-typograf");

const postcss = require("gulp-postcss");
const importCss = require("gulp-import-css");

const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");

const rename = require("gulp-rename");
const concat = require("gulp-concat");
const watch = require("gulp-watch");

const NON_BREAKING_HYPHEN = "‑";
const WATCHERS = {
  html: ["./src/**/*.html"],
  styles: ["./src/**/*.css"],
  js: ["./src/**/*.js"],
};

const typografRules = [
  {
    name: "common/other/nonBreakingHyphen",
    handler: (text) => text.replace(/\-/g, NON_BREAKING_HYPHEN),
  },
];

gulp.task("html", function () {
  return gulp
    .src("./src/index.html")
    .pipe(
      fileinclude({
        prefix: "@@",
        basepath: "@file",
      })
    )
    .pipe(
      typograf({
        locale: ["ru", "en-US"],
        enableRule: ["ru/optalign/*"],
        disableRule: ["ru/nbsp/afterNumberSign"],
        rules: typografRules,
      })
    )
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest("./dist/"));
});

gulp.task("css", function () {
  return gulp
    .src("./src/css/style.css")
    .pipe(importCss())
    .pipe(gulp.dest("./dist/css/"));
});

gulp.task("js", function () {
  return gulp.src("./src/js/*.js").pipe(gulp.dest("./dist/js/"));
});

gulp.task("images", function () {
  // minify
  gulp
    .src("./src/img/**/*.{jpg,png}")
    .pipe(imagemin())
    .pipe(gulp.dest("./dist/img/"));

  // convert to webp
  return gulp
    .src("./src/img/**/*.{jpg,png}")
    .pipe(webp())
    .pipe(gulp.dest("./dist/img/"));
});

gulp.task("favicons", function () {
  return gulp.src("./src/favicons/**/*").pipe(gulp.dest("./dist/favicons/"));
});

gulp.task("watch", function () {
  gulp.watch(WATCHERS.html, gulp.series("html"));
  gulp.watch(WATCHERS.styles, gulp.series("css"));
  gulp.watch(WATCHERS.js, gulp.series("js"));
});

gulp.task(
  "default",
  gulp.series("html", "css", "js", "images", "favicons", "watch")
);
gulp.task("build", gulp.series("html", "css", "js", "images", "favicons"));
