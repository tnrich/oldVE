/*global exports */

var Webdriver = require("webdriverjs");
exports.getDriver = function(pBrowser) {
    var browser = pBrowser || "phantomjs";
    return Webdriver.remote({
    desiredCapabilities: {
        browserName: browser
        },
    logLevel: "silent"
    });
};

