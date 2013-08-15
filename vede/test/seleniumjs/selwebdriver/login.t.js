/**
 * The official Selenium driver uses Promises.  A promise listener is added with then().
 */

/*global after, before, describe, expect, it*/

var fs = require("fs");
var Webdriver = require("selenium-webdriver");
// This is a wrapper for Mocha functions so they work with the Promise control flow without using then().
//var test = require('selenium-webdriver/testing');
var browserName = process.env.BROWSER;
var browser = require("../module/selwebdriver").getBrowser(browserName);
var url = process.env.URL || "http://teselagen.local";

describe("Normal login", function(){
    var inputFieldEl;
    
    before(function(pDone) {
        browser.get(url).then(function() {
//            browser.takeScreenshot().then(function(img) {
//                fs.writeFileSync("screenshot.png", img, {encoding:"base64"});
//            browser.getPageSource().then(function(pSource) {
//                fs.writeFileSync("source.html", pSource);
                pDone();
//            });
        });
     });
    
    it("Given I have opened the homepage", function(pDone) {
        browser.findElement(Webdriver.By.id("auth-username-field-inputEl")).then(function(el) {
            inputFieldEl = el;
            pDone();
        });
    });
    
    it("When I enter my username", function(pDone) {
        inputFieldEl.clear().then(function() {
            inputFieldEl.sendKeys("testUser").then(function() {
                pDone();
            });
        });
    });
    
    it("And I enter my password");

    it("And I click on the Login button", function(pDone) {
        browser.findElement(Webdriver.By.id("auth-login-btn-btnIconEl")).then(function(el) {
            el.click().then(function() {
                pDone();
            });
        });
    });

    it("Then I am logged in", function() {
//        casper.then(function() {
//            casper.waitWhileVisible("div.splashscreen", function() {
//                expect(casper.exists("div.splashscreen")).to.be.false;
//            });
//        });
    });

    after(function() {
        browser.quit();
    });
});

//browser.wait(function() {
//    return browser.findElement(locator).isDisplayed();
//}, timeout);
