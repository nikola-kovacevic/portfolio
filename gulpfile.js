const del = require("del");
const gulp = require("gulp");

const autoprefixer = require("gulp-autoprefixer");
const csso = require("gulp-csso");
const htmlmin = require("gulp-htmlmin");
const image = require("gulp-image");
const uglify = require("gulp-uglify-es").default;
const inlineSource = require("gulp-inline-source");

const sitemap = require("gulp-sitemap");
const robots = require("gulp-robots");

const DIST = "./dist";
const SRC = "./src";

const TEMP = `${DIST}/temp`;
const ASSETS = "assets";
const IMAGES = `${ASSETS}/images`;
const FAVICON = `${ASSETS}/favicon`;
const SITE_URL = "https://kovacevic.dev";
const JS = "js";
const CSS = "css";

const GULP = {
  FINISH: "finish",
  DEFAULT: "default",
};

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
  INDEX: `${DIST}/index.html`,
  ASSETS: `${DIST}/${ASSETS}`,
  SW: {
    ORIGINAL: `${DIST}/sw.js`,
    TEMP_FILE: `${TEMP}/sw.js`,
  },
};

const TASK = {
  CLEAN: {
    SOURCE: "clean_source",
    DESTINATION: "clean_destination",
    TEMP: "clean_temp",
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
  CREATE: {
    SITEMAP: "create_sitemap",
    ROBOTS: "create_robots",
  },
};

const clean = (...filesAndFolders) =>
  del(filesAndFolders)
    .then((deleted) => console.log(`Deletions: ${deleted}`))
    .catch(console.error);

gulp.task(TASK.CLEAN.SOURCE, () => clean(DIST));

gulp.task(TASK.CLEAN.DESTINATION, () =>
  clean(DESTINATION.STYLES, DESTINATION.SCRIPTS)
);

gulp.task(TASK.ASSETS.MOVE_ICONS, (done) =>
  gulp
    .src(SOURCE.FAVICON)
    .pipe(gulp.dest(DESTINATION.FAVICON))
    .on(GULP.FINISH, () => done())
);

gulp.task(TASK.ASSETS.MINIFY_ICONS, (done) =>
  gulp
    .src(`${DESTINATION.FAVICON}/*`)
    .pipe(image())
    .pipe(gulp.dest(DESTINATION.FAVICON))
    .on(GULP.FINISH, () => done())
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
    .on(GULP.FINISH, () => done())
);

gulp.task(TASK.MINIFY.HTML, (done) =>
  gulp
    .src(SOURCE.HTML)
    .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
    .pipe(gulp.dest(DIST))
    .on(GULP.FINISH, () => done())
);

gulp.task(TASK.MINIFY.SCRIPTS, (done) =>
  gulp
    .src(SOURCE.SCRIPTS)
    .pipe(uglify())
    .pipe(gulp.dest(DESTINATION.SCRIPTS))
    .on(GULP.FINISH, () => done())
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
    .on(GULP.FINISH, () => done())
);

gulp.task(TASK.CLEAN.TEMP, () => clean(TEMP));

gulp.task(TASK.CREATE.SITEMAP, () =>
  gulp
    .src(DESTINATION.HTML, { read: false })
    .pipe(sitemap({ siteUrl: SITE_URL }))
    .pipe(gulp.dest(DIST))
);

gulp.task(TASK.CREATE.ROBOTS, () =>
  gulp
    .src(DESTINATION.INDEX)
    .pipe(
      robots({
        useragent: "*",
        allow: ["/*"],
        disallow: [],
      })
    )
    .pipe(gulp.dest(DIST))
);

const DEFAULT = gulp.series(
  TASK.CLEAN.SOURCE,
  gulp.series(
    gulp.parallel(Object.values(TASK.MINIFY)),
    TASK.INLINE.SCRIPTS,
    TASK.CREATE.SITEMAP,
    TASK.CREATE.ROBOTS
  ),
  TASK.CLEAN.DESTINATION
);

gulp.task(GULP.DEFAULT, DEFAULT);
