/*global exports */

var Webdriver = require('selenium-webdriver');
// Create a Selenium client
var driver = new Webdriver.Builder().
    withCapabilities({'browserName': 'phantomjs'}).
    build();
console.log(driver.By);
exports.driver = driver;

