/**
 * The official Selenium driver uses Promises.  A promise listener is added with then().
 */

/*global after, before, describe, expect, it*/

var Webdriver = require("selenium-webdriver");
// This is a wrapper for Mocha functions so they work with the Promise control flow without using then().
//var test = require('selenium-webdriver/testing');
var driver = require("../../module/sel_webdriver").driver;

describe("Regression test", function(){

    before(function(pDone) {
        driver.get("http://teselagen.local/").then(function() {
            pDone();
        });
     });
    
    it("Login", function(pDone) {
        driver.findElement(Webdriver.By.id("auth-username-field-inputEl")).then(function(elem) {
            elem.clear().then(function() {
                elem.sendKeys("testUser").then(function() {
                    driver.findElement(Webdriver.By.id("auth-login-btn-btnIconEl")).then(function(elem) {
                        elem.click().then(function() {
                            pDone();
                        });
                    });
                });
            });
        });
    });

    after(function() {
        driver.quit();
    });
});

//driver.wait(function() {
//    return driver.findElement(locator).isDisplayed();
//}, timeout);
