// Karma configuration
// http://karma-runner.github.io/0.12/config/configuration-file.html
// Generated on 2015-10-24 using
// generator-karma 1.0.0

module.exports = function (config) {
    'use strict';

    config.set({
        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,

        // base path, that will be used to resolve files and exclude
        basePath: '',

        // testing framework to use (jasmine/mocha/qunit/...)
        // as well as any additional frameworks (requirejs/chai/sinon/...)
        frameworks: [
            "jasmine"
        ],

        // list of files / patterns to load in the browser
        files: [

            "client/public/bower_components/jquery/dist/jquery.js",
            "client/public/bower_components/angular/angular.js",
            "client/public/bower_components/angular-animate/angular-animate.js",
            "client/public/bower_components/angular-cookies/angular-cookies.js",
            "client/public/bower_components/angular-resource/angular-resource.js",
            "client/public/bower_components/angular-route/angular-route.js",
            "client/public/bower_components/angular-sanitize/angular-sanitize.js",
            "client/public/bower_components/angular-touch/angular-touch.js",
            "client/public/bower_components/angular-ui-router/release/angular-ui-router.js",
            "client/public/bower_components/angular-bootstrap/ui-bootstrap-tpls.js",
            "client/public/bower_components/angular-jwt/dist/angular-jwt.js",
            "client/public/bower_components/angular-storage/dist/angular-storage.js",
            "client/public/bower_components/a0-angular-storage/dist/angular-storage.js",
            "node_modules/angular-mocks/angular-mocks.js",

            "client/public/app/**/*.js",
            "test/client/**/*.spec.js"
        ],

        // list of files / patterns to exclude
        exclude: [],

        // web server port
        port: 8080,

        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        browsers: [
            "Chrome"
        ],

        // Which plugins to enable
        plugins: [
            "karma-chrome-launcher",
            "karma-jasmine"
        ],

        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: true,

        colors: true,

        // level of logging
        // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
        logLevel: config.LOG_INFO,

        // Uncomment the following lines if you are using grunt's server to run the tests
        // proxies: {
        //   '/': 'http://localhost:9000/'
        // },
        // URL root prevent conflicts with the site root
        // urlRoot: '_karma_'
    });
};
