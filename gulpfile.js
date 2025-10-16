const { task, src, dest, watch } = require('gulp');

task('build:icons', copyIcons);

function copyIcons() {
	// Copy both node and credential icons in one stream, preserving folder structure under dist/
	// encoding: false is important for binary files like PNG
	return src(['nodes/**/*.{png,svg}', 'credentials/**/*.{png,svg}'], {
		base: '.',
		encoding: false,
	}).pipe(dest('dist'));
}

task('watch:icons', function watchIcons() {
	return watch(['nodes/**/*.{png,svg}', 'credentials/**/*.{png,svg}'], copyIcons);
});
