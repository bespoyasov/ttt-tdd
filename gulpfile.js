const fs = require('fs')
const gulp = require('gulp')
const path = require('path')

const include = require('gulp-include')
const htmlmin = require('gulp-htmlmin')
const typograf = require('gulp-typograf')

const postcss = require('gulp-postcss')
const autoprefixer = require('autoprefixer')
const importCss = require('gulp-import-css')

const rename = require('gulp-rename')
const concat = require('gulp-concat')
const watch = require('gulp-watch')


const NON_BREAKING_HYPHEN = '‑'
const WATCHERS = {
  html: ['./src/**/*.html'],
  styles: ['./src/**/*.css'],
}

const typografRules = [{
  name: 'common/other/nonBreakingHyphen',
  handler: text => text.replace(/\-/g, NON_BREAKING_HYPHEN)
}]


gulp.task('default', ['html', 'css', 'watch'])
gulp.task('build', ['html', 'css'])

gulp.task('html', function() {
  return gulp.src('./src/*.html')
    .pipe(include())
      .on('error', console.log)
    .pipe(typograf({ 
      locale: ['ru', 'en-US'],
      enableRule: ['ru/optalign/*'],
      disableRule: ['ru/nbsp/afterNumberSign'],
      rules: typografRules
    }))
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('./dist/'))
})

gulp.task('css', function() {
  return gulp.src('./src/css/style.css')
    .pipe(importCss())
    .pipe(postcss([ autoprefixer({
      browsers: ['last 4 versions', 'ios 7']
    }) ]))
    .pipe(gulp.dest('./dist/css/'))
})

gulp.task('watch', function() {
  gulp.watch(WATCHERS.html, ['html'])
  gulp.watch(WATCHERS.styles, ['css'])
})