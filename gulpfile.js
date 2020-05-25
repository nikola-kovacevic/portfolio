const del = require("del");
const gulp = require("gulp");
const autoprefixer = require("gulp-autoprefixer");
const csso = require("gulp-csso");
const htmlmin = require("gulp-htmlmin");
const image = require("gulp-image");
const uglify = require("gulp-uglify");

const DIST = "./dist";
const SRC = "./src";

const IMAGES = "assets/images";
const JS = "js";
const CSS = "css";

const SOURCE = {
  IMG: `${SRC}/${IMAGES}/*`,
  HTML: `${SRC}/**/*.html`,
  SCRIPTS: `${SRC}/${JS}/**/*.js`,
  STYLES: `${SRC}/${CSS}/styles.css`,
};

const DESTINATION = {
  IMG: `${DIST}/${IMAGES}`,
  SCRIPTS: `${DIST}/${JS}`,
  STYLES: `${DIST}/${CSS}`,
};

const TASK = {
  CLEAN: "clean",
  MINIFY: {
    IMAGES: "image",
    HTML: "html",
    SCRIPTS: "scripts",
    STYLES: "styles",
  },
};

gulp.task(TASK.CLEAN, () =>
  del([DIST])
    .then((deleted) => console.log(`Deletions: ${deleted}`))
    .catch(console.error)
);

gulp.task(TASK.MINIFY.IMAGES, (done) =>
  gulp
    .src(SOURCE.IMG)
    .pipe(image())
    .pipe(gulp.dest(DESTINATION.IMG))
    .on("finish", () => done())
);

gulp.task(TASK.MINIFY.HTML, (done) =>
  gulp
    .src(SOURCE.HTML)
    .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
    .pipe(gulp.dest(DIST))
    .on("finish", () => done())
);

gulp.task(TASK.MINIFY.SCRIPTS, (done) =>
  gulp
    .src(SOURCE.SCRIPTS)
    .pipe(uglify())
    .pipe(gulp.dest(DESTINATION.SCRIPTS))
    .on("finish", () => done())
);

gulp.task(TASK.MINIFY.STYLES, () =>
  gulp
    .src(SOURCE.STYLES)
    .pipe(autoprefixer())
    .pipe(csso())
    .pipe(gulp.dest(DESTINATION.STYLES))
);

gulp.task(
  "default",
  gulp.series("clean", gulp.parallel(Object.values(TASK.MINIFY)))
);
