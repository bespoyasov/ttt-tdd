import fs from "fs";
import gulp from "gulp";
import path from "path";

import fileinclude from "gulp-file-include";
import htmlmin from "gulp-htmlmin";
import typograf from "gulp-typograf";
import importCss from "gulp-import-css";

import imagemin from "gulp-imagemin";
import webp from "gulp-webp";
import avif from "gulp-avif";

import rename from "gulp-rename";
import concat from "gulp-concat";
import watch from "gulp-watch";

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
  return gulp
    .src([
      "./node_modules/ilyabirman-likely/release/likely.min.js",
      "./src/js/*.js",
    ])
    .pipe(gulp.dest("./dist/js/"));
});

gulp.task("minify", function () {
  return gulp
    .src("./src/img/**/*.{jpg,png}")
    .pipe(imagemin())
    .pipe(gulp.dest("./dist/img/"));
});

gulp.task("webp", function () {
  return gulp
    .src("./src/img/**/*.{jpg,png}")
    .pipe(webp())
    .pipe(gulp.dest("./dist/img/"));
});

gulp.task("avif", function () {
  return gulp
    .src("./src/img/**/*.{jpg,png}")
    .pipe(avif())
    .pipe(gulp.dest("./dist/img/"));
});

gulp.task("images", gulp.series("minify", "webp", "avif"));

gulp.task("meta", function () {
  return gulp.src("./src/meta/**/*").pipe(gulp.dest("./dist/meta/"));
});

gulp.task("watch", function () {
  gulp.watch(WATCHERS.html, gulp.series("html"));
  gulp.watch(WATCHERS.styles, gulp.series("css"));
  gulp.watch(WATCHERS.js, gulp.series("js"));
});

gulp.task(
  "default",
  gulp.series("html", "css", "js", "images", "meta", "watch")
);

gulp.task("build", gulp.series("html", "css", "js", "images", "meta"));
