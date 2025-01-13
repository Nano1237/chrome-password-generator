let {series, dest, src} = require("gulp"),
	browserify = require("browserify"),
	source = require('vinyl-source-stream'),
	tsify = require("tsify"),
	glob = require('glob'),
	uglify = require('gulp-uglify'),
	buffer = require('vinyl-buffer'),
	sass = require('gulp-sass')(require('sass-embedded'));
sass.compiler = require('sass-embedded');


// Build JS
function scripts () {
	return browserify({
		basedir: '.',
		debug: true,
		entries: glob.sync('src/main.ts'),
		cache: {},
		packageCache: {}
	}).plugin(tsify, {
		"module": "commonjs",
		"target": "ES6",
		"noImplicitAny": false,
		"sourceMap": false,
		"outDir": "public",
		types: ["node", "chrome"],
		"noEmitOnError": true,
		"typeRoots": ["node_modules/@types"],
		"experimentalDecorators": true
	})
	  .bundle()
	  .pipe(source('build.js'))
	  .pipe(buffer())
	  .pipe(uglify())
	  .pipe(dest("public"));
}

function scss () {
	return src('./scss/**/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(dest('public'));
}

exports.sass = scss;
exports.scripts = scripts;
exports.default = series(scripts, scss);
