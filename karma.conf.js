
var path = require('path');
require('babel-core/register');


module.exports = function (config) {
  config.set({
    // base path used to resolve all patterns
    basePath: __dirname,

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'chai-as-promised', 'chai'],

    // list of files/patterns to load in the browser
    files: [
      { pattern: 'dist/js/crypto.js', include: false },
      './node_modules/phantomjs-polyfill/bind-polyfill.js',
      'src/index.spec.js'
    ],

    // files to exclude
    exclude: [],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'src/index.spec.js': ['webpack', 'sourcemap']
    },

    proxies:  {
      '/js/crypto.js': '/base/dist/js/crypto.js'
    },

    webpack: require('./webpack.config.babel'),

    webpackServer: {
      noInfo: true
    },

    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['mocha'],

    // web server port
    port: 9876,

    // enable colors in the output
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // toggle whether to watch files and rerun tests upon incurring changes
    autoWatch: false,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],

    // if true, Karma runs tests once and exits
    singleRun: true
  });
};
