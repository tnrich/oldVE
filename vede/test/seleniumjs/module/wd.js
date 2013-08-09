/*global exports */

var Webdriver = require("wd");

exports.getBrowser = function() {
    var browser = Webdriver.remote();
    return browser;
};

exports.getCapabilities = function(pBrowserName) {
    var browserName = pBrowserName || "phantomjs";
    return {
        browserName: browserName,
        "phantomjs.page.settings.userName":"dev",
        "phantomjs.page.settings.password":"dev#rocks"
    };
};

