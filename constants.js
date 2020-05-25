const DIST = "./dist";
const IMAGES = "assets/images";
const JS = "js";
const SRC = "./src";

const SOURCE = {
  IMG: `${SRC}/${IMAGES}/*`,
  HTML: `${SRC}/**/*.html`,
  SCRIPTS: `${SRC}/${JS}/**/*.js`,
};

const DESTINATION = {
  IMG: `${DIST}/${IMAGES}`,
  SCRIPTS: `${DIST}/${JS}`,
};

const AUTOPREFIXER_BROWSERS = [
  "ie >= 10",
  "ie_mob >= 10",
  "ff >= 30",
  "chrome >= 34",
  "safari >= 7",
  "opera >= 23",
  "ios >= 7",
  "android >= 4.4",
  "bb >= 10",
];

module.exports = {
  AUTOPREFIXER_BROWSERS,
  DESTINATION,
  DIST,
  SOURCE,
};
