// support ES6 in this config file
require('babel-core/register');
const HtmlScreenshotReporter = require('protractor-jasmine2-screenshot-reporter');
const SpecReporter = require('jasmine-spec-reporter');

const webpackConfig = require('./webpack.config');
const helper = require('./source/test/e2e/helper');

const e2eBaseFolder = './source/test/e2e';

exports.config = {
    baseUrl: `http://${webpackConfig.devServer.host}:${webpackConfig.devServer.port}`,
    framework: 'jasmine2',
    jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 30000,
        // remove ugly protractor dot reporter
        print: () => {}
    },
    specs: `${e2eBaseFolder}/specs/*.spec.js`,
    suites: {
        home: `${e2eBaseFolder}/specs/home.spec.js`,
        login: `${e2eBaseFolder}/specs/login.spec.js`,
        dashboard: `${e2eBaseFolder}/specs/dashboard.spec.js`,
        phone: `${e2eBaseFolder}/specs/phone.spec.js`,
        notfound: `${e2eBaseFolder}/specs/404.spec.js`
    },
    capabilities: {
        browserName: 'chrome'
    },
    onPrepare: () => {
        browser._BasePageObject = helper.BasePageObject;
        browser._ = new helper.E2EHelper();
        // screenshot reporter
        jasmine.getEnv().addReporter(new HtmlScreenshotReporter({
            dest: `${e2eBaseFolder}/screenshots`,
            filename: 'e2e-report.html',
            captureOnlyFailedSpecs: true,
            reportOnlyFailedSpecs: false,
            pathBuilder: (currentSpec) => {
                // TODO: can not get browser name due to
                // https://github.com/mlison/protractor-jasmine2-screenshot-reporter/issues/4
                return currentSpec.description.replace(/[ :]/g, '-');
            }
        }));
        // add jasmine spec reporter
        jasmine.getEnv().addReporter(new SpecReporter({
            displayStacktrace: 'all',
            displayFailuresSummary: false
        }));
        beforeEach(() => {
            // add custom matchers
            jasmine.addMatchers(helper.customMatchers);
        });
    },
    params: {
        timeout: 10000
    }
};
