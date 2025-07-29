import gulp from 'gulp';
import svg2png from 'gulp-svg2png';
import rename from 'gulp-rename';
import brotli from 'gulp-brotli';
import gzip from 'gulp-gzip';
import htmlmin from 'gulp-htmlmin';
import rev from 'gulp-rev';
import revRewrite from 'gulp-rev-rewrite';
import terser from 'gulp-terser';
import { readFileSync, writeFileSync } from 'node:fs';
import connect from 'gulp-connect';
import { resolve } from 'path';
import { existsSync } from 'fs';

gulp.task('svg-to-png', function () {
    return gulp
        .src('./_cdn/assets/images/**/*.svg') // Adjust to match SVG files in all subdirectories
        .pipe(svg2png({
            width: 1200,
            height: 675
        }))
        .pipe(rename(function (path) {
            path.basename += ".svg.g"; 
            path.extname = ".png";
        }))
        .pipe(gulp.dest(function (file) {
            return file.base; // Output to the original directory
        }));
});

// Task to create Brotli-compressed assets and pages.
gulp.task('brotli', function () {
    return gulp.src(['./_cdn/assets/images/**/*.svg', './_cdn/assets/**/*.json', './_cdn/**/*.html',  './_cdn/**/*.xml' ])
        .pipe(brotli.compress({
            extension: 'br',
            quality: 11
        }))
        .pipe(gulp.dest(function (file) {
            return file.base;
        }));
});

// Task to create Gzip-compressed assets and pages.
gulp.task('gzip', function () {
    return gulp
        .src(['./_cdn/assets/images/**/*.svg', './_cdn/**/*.json', './_cdn/**/*.html',  './_cdn/**/*.xml' ])
        .pipe(gzip())
        .pipe(gulp.dest(function (file) {
            return file.base;
        }));
});

// Task to minify HTML and XML files produced by Jekyll
gulp.task('htmlmin', () => {
    return gulp
      .src('_site/**/*.html')
      .pipe(htmlmin({ collapseWhitespace: true }))
      .pipe(gulp.dest('_site'));
});

// Task to minify JavaScript files
gulp.task('jsmin', function () {
    return gulp.src('_cdn/**/*.js')
        .pipe(terser())
        .pipe(gulp.dest('_cdn'));
});

gulp.task("rev-assets", function () {
    return gulp
        .src([ "_site/assets/**/*.{png,jpg,jpeg,gif,svg,css,js,woff,woff2,ttf,eot}" ], { encoding: false })
        .pipe(rev())
        .pipe(gulp.dest("_cdn/assets"))
        .pipe(rev.manifest())
        .pipe(gulp.dest("_cdn/assets"));
});

gulp.task("rev-rewrite", function () {
    const manifest = readFileSync("_cdn/assets/rev-manifest.json");

    return gulp
        .src(["_cdn/**/*.{html,css,js}"])
        .pipe(revRewrite({ manifest }))
        .pipe(gulp.dest("_cdn"));
});

// Copy files that are not renamed.
gulp.task('copy-html', function () {
    return gulp
        .src('_site/**/*.{html,xml,json,ico,webmanifest}') 
        .pipe(gulp.dest('_cdn'));
});

gulp.task('generate-redirects', function (done) {
    const manifestPath = '_cdn/assets/rev-manifest.json';
    const staticWebAppConfigSource = 'staticwebapp.config.json';
    const staticWebAppConfigDest = '_cdn/staticwebapp.config.json';

    // Check if the manifest file exists
    if (!existsSync(manifestPath)) {
        console.error(`Manifest file not found: ${manifestPath}`);
        done();
        return;
    }

    // Read and parse the manifest file
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));

    // Generate redirection rules for .css and .js files only
    const redirects = Object.entries(manifest)
        .filter(([original]) => original.endsWith('.css') || original.endsWith('.js') || original.endsWith('.woff') || original.endsWith('.woff2'))
        .map(([original, hashed]) => ({
            route: `/assets/${original}`,
            redirect: `/assets/${hashed}`,
            statusCode: 302 //  Found (Moved Temporarily)
        }));

    // Copy and modify the staticwebapp.config.json file
    if (existsSync(staticWebAppConfigSource)) {
        const configContent = JSON.parse(readFileSync(staticWebAppConfigSource, 'utf-8'));

        // Prepend redirects to the routes array
        if (!Array.isArray(configContent.routes)) {
            configContent.routes = [];
        }
        configContent.routes = [...redirects, ...configContent.routes];

        writeFileSync(staticWebAppConfigDest, JSON.stringify(configContent, null, 2), 'utf-8');
        console.log(`Static Web App configuration updated and written to: ${staticWebAppConfigDest}`);
    } else {
        console.error(`Static Web App configuration source file not found: ${staticWebAppConfigSource}`);
    }

    done();
});

gulp.task('default', gulp.series(
    'htmlmin',
    'rev-assets', 
    'copy-html',
    'rev-rewrite',
    'generate-redirects', 
    'jsmin',
    gulp.parallel('brotli', 'gzip', 'svg-to-png')
));

// Task to serve the _cdn directory over HTTP on port 8080
gulp.task('serve', gulp.series('default', function () {
    connect.server({
        root: '_cdn',
        port: 8080,
        https: false,
        middleware: function () {
            return [
                function (req, res, next) {
                    const url = req.url;
                    const root = '_cdn';
                    if (!url.includes('.')) {
                        const htmlPath = resolve(root, `.${url}.html`);
                        const indexPath = resolve(root, `.${url}/index.html`);
                        if (existsSync(htmlPath)) {
                            req.url += '.html';
                        } else if (existsSync(indexPath)) {
                            req.url += '/index.html';
                        }
                    }
                    next();
                }
            ];
        }
    });
}));
