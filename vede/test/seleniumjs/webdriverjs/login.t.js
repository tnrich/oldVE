/*global after, before, describe, expect, it, process*/
var browser = process.env.BROWSER || "phantomjs";
var url = process.env.URL || "http://teselagen.local";
var driver = require("../module/webdriverjs").getDriver(browser);

describe("Normal login", function(){
    var inputField = "#auth-username-field-inputEl";

    before(function(pDone) {
        driver.init();
        driver.url(url, pDone);
    });
 
    it("Given I have opened the homepage", function(pDone) {
        driver.waitFor(inputField, 5000, function(err) {
            expect(err).to.be.null;
            pDone();
        });
    });

    it("When I enter my username", function(pDone) {
        driver.setValue(inputField, "testUser", function(err) {
            expect(err).to.be.null;
            pDone();
        });
    });

    it("And I enter my password");

    it("And I click on the Login button", function(pDone) {
        driver.click("#auth-login-btn-btnIconEl", function(err) {
            expect(err).to.be.null;
            pDone();
        });
    });

    it("Then I am logged in", function() {
//        casper.then(function() {
//            casper.waitWhileVisible("div.splashscreen", function() {
//                expect(casper.exists("div.splashscreen")).to.be.false;
//            });
//        });
    });

    after(function(pDone) {
        driver.end(pDone);
    });
});
