const gulp = require('gulp');
const del = require('del');
const ts = require('gulp-typescript');
const runSequence = require('run-sequence');

// TODO: Sort out the filesets for build, lib, and common instead of including all

// Main project to compile everything to ES6 modules for lib (/dist/lib)
const tsProjectLib = ts.createProject('tsconfig.json');

// Secondary project to compile build-time code to run in node (/dist/build)
const tsProjectBuild = ts.createProject('tsconfig.build.json');

gulp.task('clean', () =>
    del('dist')
);

// Compile the TypeScript lib code
gulp.task('ts-lib', () =>
    tsProjectLib.src()
        .pipe(tsProjectLib())
        .pipe(gulp.dest('./dist/lib'))
);

// Compile the TypeScript build-time code
gulp.task('ts-build', () =>
    tsProjectBuild.src()
        .pipe(tsProjectBuild())
        .pipe(gulp.dest('./dist/build'))
);

// Create the inner package.json within /dist for publishing
gulp.task('make-dist-package', () => {
    const { createDistPackage } = require('./dist/build/distPackage');
    return createDistPackage('./package.json', './dist/package.json')
});

// All the tasks we can do in parallel after clean, before make-dist-package
gulp.task('build-all', ['ts-lib', 'ts-build']);

// Main sequence for clean-building /dist ready for publish
gulp.task('dist', done =>
    runSequence('clean', 'build-all', 'make-dist-package', done)
);