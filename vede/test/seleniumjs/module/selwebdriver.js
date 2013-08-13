/*global exports */

var Webdriver = require("selenium-webdriver");
exports.getBrowser = function(pBrowserName) {
    var browserName = pBrowserName || "phantomjs";
    return new Webdriver.Builder().
        usingServer('http://localhost:4444/wd/hub').
        withCapabilities({
            "browserName": browserName,
            "phantomjs.page.settings.userName":"dev",
            "phantomjs.page.settings.password":"dev#rocks"
        }).build();
};


