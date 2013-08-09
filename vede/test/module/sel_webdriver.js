/*global exports */

var Webdriver = require("selenium-webdriver");
exports.getDriver = function(pBrowser) {
    var browser = pBrowser || "phantomjs";
    new Webdriver.Builder().
    withCapabilities({"browserName": browser}).build();
};


