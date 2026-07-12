const gulp = require("gulp");
const imagemin = require("gulp-imagemin");
const jasmine = require("gulp-jasmine");
const open = require("gulp-open");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const archiver = require("archiver");
const connect = require("gulp-connect");
const sass = require("gulp-sass")(require("sass"));
const jshint = require("gulp-jshint");
const clean = require("gulp-clean");
const copy = require("gulp-copy");
const inline = require("gulp-inline");
const terser = require("gulp-terser");
const minifyCSS = require("gulp-clean-css");
const replace = require("gulp-replace");
const htmlmin = require("gulp-htmlmin");
const zip = require("gulp-zip");

const srcDir = "./src";
const sassDir = "./sass";
const distDir = "./dist";
const port = 8000 + Math.floor(Math.random() * 1000);
const uri = "http://localhost:" + port;

const TARGET_ZIP_SIZE_KB = 300;
const MIN_IMAGE_QUALITY = 30;

function compileSass() {
  return gulp
    .src(sassDir + "/*.scss")
    .pipe(sass({ silenceDeprecations: ['legacy-js-api'] }).on("error", sass.logError))
    .pipe(gulp.dest(srcDir + "/css"))
    .pipe(connect.reload());
}

function reloadHtml() {
  return gulp.src(srcDir + "/*.html").pipe(connect.reload());
}

function lintJs() {
  return gulp
    .src(srcDir + "/js/*.js")
    .pipe(jshint())
    .pipe(jshint.reporter("default"))
    .pipe(connect.reload());
}

function startServer(done) {
  connect.server({
    root: srcDir,
    livereload: true,
    port,
    host: "localhost",
  });
  console.log("Banner dev server:", uri);
  done();
}

function openBrowser() {
  return gulp.src(__filename).pipe(open({ uri: uri }));
}

function watchFiles() {
  gulp.watch([srcDir + "/*.html"], reloadHtml);
  gulp.watch([sassDir + "/*.scss"], compileSass);
  gulp.watch([srcDir + "/js/*.js"], lintJs);
}

function cleanDist() {
  return gulp.src([distDir + "/**/*"], { read: false, allowEmpty: true }).pipe(clean());
}

function copyFonts() {
  return gulp.src(srcDir + "/fonts/**/*", { allowEmpty: true }).pipe(gulp.dest(distDir));
}

function copyAssets() {
  return gulp
    .src([
      srcDir + "/*.{jpg,png}",
      srcDir + "/img/**/*.{jpg,png,gif,svg}",
      srcDir + "/manifest.js",
      srcDir + "/config.js",
    ], { allowEmpty: true })
    .pipe(imagemin())
    .pipe(copy(distDir, { prefix: 2 }));
}

function inlineHtml() {
  return gulp
    .src(srcDir + "/index.html")
    .pipe(
      inline({
        base: srcDir,
        disabledTypes: ["img"],
      })
    )
    .pipe(gulp.dest(distDir));
}

function replacePaths() {
  return gulp
    .src([distDir + "/index.html"], { allowEmpty: true })
    .pipe(replace("../img/", "img/"))
    .pipe(replace("img/", "./"))
    .pipe(replace("../fonts/", "./"))
    .pipe(replace("http://", "https://"))
    .pipe(gulp.dest(distDir));
}

function minifyHtml() {
  return gulp
    .src(distDir + "/index.html", { allowEmpty: true })
    .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
    .pipe(gulp.dest(distDir));
}

function getAllImages(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllImages(filePath, fileList);
    } else if (/\.(jpg|jpeg|png|webp)$/i.test(filePath)) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

function createZipArchive() {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream('./300x250.zip');
    const archive = archiver('zip', { zlib: { level: 9 } });
    output.on('close', () => resolve(archive.pointer()));
    archive.on('error', err => reject(err));
    archive.pipe(output);
    archive.directory(distDir + '/', false);
    archive.finalize();
  });
}

async function enforceSizeLimit() {
  let quality = 90;
  let zipBytes = await createZipArchive();
  
  while (zipBytes > TARGET_ZIP_SIZE_KB * 1024 && quality >= MIN_IMAGE_QUALITY) {
    console.log(`[Compression Loop] Zip is ${Math.round(zipBytes/1024)}kb. Squeezing images at ${quality}% quality...`);
    const images = getAllImages(distDir);
    
    for (const imgPath of images) {
      const buffer = fs.readFileSync(imgPath);
      let processed = sharp(buffer);
      
      if (/\.(jpg|jpeg)$/i.test(imgPath)) {
        processed = processed.jpeg({ quality, force: true });
      } else if (/\.png$/i.test(imgPath)) {
        processed = processed.png({ quality, effort: 8, palette: true, force: true });
      } else if (/\.webp$/i.test(imgPath)) {
        processed = processed.webp({ quality, force: true });
      }
      
      const newBuffer = await processed.toBuffer();
      // Only keep the squashed version if it actually saved space
      if (newBuffer.length < buffer.length) {
        fs.writeFileSync(imgPath, newBuffer);
      }
    }
    
    zipBytes = await createZipArchive();
    quality -= 5;
  }
  
  if (zipBytes > TARGET_ZIP_SIZE_KB * 1024) {
    console.warn(`[WARNING] Failed to reduce 300x250.zip under ${TARGET_ZIP_SIZE_KB}kb even at minimum quality floor! Result: ${Math.round(zipBytes/1024)}kb.`);
  } else {
    console.log(`[SUCCESS] Output 300x250.zip size: ${Math.round(zipBytes/1024)}kb`);
  }
}

function runTests() {
  return gulp.src("tests/test.js", { allowEmpty: true }).pipe(jasmine({ verbose: true }));
}

const serve = gulp.series(compileSass, startServer, openBrowser, watchFiles);
const build = gulp.series(cleanDist, copyFonts, copyAssets, compileSass, inlineHtml, replacePaths, enforceSizeLimit, runTests);

gulp.task("sass", compileSass);
gulp.task("html", reloadHtml);
gulp.task("lint", lintJs);
gulp.task("serve", serve);
gulp.task("build", build);
gulp.task("default", serve);
