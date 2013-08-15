/*global exports */

var btoa = require("btoa");
var Webdriver = require("selenium-webdriver");
exports.getBrowser = function(pBrowserName) {
    var browserName = pBrowserName || "phantomjs";
    return new Webdriver.Builder().
        usingServer('http://localhost:4444/wd/hub').
//        usingServer("http://localhost:8910").
        withCapabilities({
            "browserName": browserName,
            "phantomjs.page.settings.userName":"dev",
            "phantomjs.page.settings.password":"dev#rocks",
//            "phantomjs.page.customHeaders": {"Authorization": "Basic " + btoa("dev:dev#rocks")}
        }).build();
};


