const del = require("del");
const gulp = require("gulp");
const autoprefixer = require("gulp-autoprefixer");
const csso = require("gulp-csso");
const htmlmin = require("gulp-htmlmin");
const image = require("gulp-image");
const uglify = require("gulp-uglify");
const inlineSource = require("gulp-inline-source");

const DIST = "./dist";
const SRC = "./src";

const IMAGES = "assets/images";
const FAVICON = "assets/favicon";
const JS = "js";
const CSS = "css";

const SOURCE = {
  IMG: `${SRC}/${IMAGES}/*`,
  HTML: `${SRC}/**/*.html`,
  SCRIPTS: `${SRC}/${JS}/**/*.js`,
  STYLES: `${SRC}/${CSS}/styles.css`,
  FAVICON: `${SRC}/${FAVICON}/*`,
};

const DESTINATION = {
  IMG: `${DIST}/${IMAGES}`,
  SCRIPTS: `${DIST}/${JS}`,
  STYLES: `${DIST}/${CSS}`,
  FAVICON: `${DIST}/${FAVICON}`,
  HTML: `${DIST}/**/*.html`,
};

const TASK = {
  CLEAN: {
    SOURCE: "clean_source",
    DESTINATION: "clean_destination",
  },
  ASSETS: {
    MOVE_ICONS: "move_icons",
    MINIFY_ICONS: "minify_icons",
  },
  MINIFY: {
    IMAGES: "image",
    HTML: "html",
    SCRIPTS: "scripts",
    STYLES: "styles",
    FAVICON: "favicon",
  },
  INLINE: {
    SCRIPTS: "inline_scripts",
  },
};

gulp.task(TASK.CLEAN.SOURCE, () =>
  del([DIST])
    .then((deleted) => console.log(`Deletions: ${deleted}`))
    .catch(console.error)
);

gulp.task(TASK.CLEAN.DESTINATION, () =>
  del([DESTINATION.STYLES, DESTINATION.SCRIPTS])
    .then((deleted) => console.log(`Deletions: ${deleted}`))
    .catch(console.error)
);

gulp.task(TASK.ASSETS.MOVE_ICONS, (done) =>
  gulp
    .src(SOURCE.FAVICON)
    .pipe(gulp.dest(DESTINATION.FAVICON))
    .on("finish", () => done())
);

gulp.task(TASK.ASSETS.MINIFY_ICONS, (done) =>
  gulp
    .src(`${DESTINATION.FAVICON}/*`)
    .pipe(image())
    .pipe(gulp.dest(DESTINATION.FAVICON))
    .on("finish", () => done())
);

gulp.task(
  TASK.MINIFY.FAVICON,
  gulp.series(TASK.ASSETS.MOVE_ICONS, TASK.ASSETS.MINIFY_ICONS)
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

gulp.task(TASK.INLINE.SCRIPTS, (done) =>
  gulp
    .src(DESTINATION.HTML)
    .pipe(inlineSource({ compress: false, saveRemote: false }))
    .pipe(gulp.dest(DIST))
    .on("finish", () => done())
);

const DEFAULT = gulp.series(
  TASK.CLEAN.SOURCE,
  gulp.series(gulp.parallel(Object.values(TASK.MINIFY)), TASK.INLINE.SCRIPTS),
  TASK.CLEAN.DESTINATION
);

gulp.task("default", DEFAULT);
