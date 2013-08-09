/*global after, before, describe, expect, it, process*/
var browserName = process.env.BROWSER;
var url = process.env.URL || "http://teselagen.local";
var wd = require("../module/wd");
var browser = wd.getBrowser();

describe("Normal login", function(){
    var inputField = "auth-username-field-inputEl";

    before(function(pDone) {
        browser.init(wd.getCapabilities(browserName), function(pErr) {
            expect(pErr).to.be.null;
            browser.get(url, function(pErr) {
                expect(pErr).to.be.null;
                pDone();
            });
        });
    });
    
    it("Given I have opened the homepage", function(pDone) {
        browser.waitForElementById(inputField, 5000, function(pErr) {
            expect(pErr).to.be.null;
            pDone();
        });
    });

    it("When I enter my username", function(pDone) {
        browser.elementById(inputField, function(pErr, pEl) {
            expect(pErr).to.be.null;
            pEl.type("testUser", function(pErr) {
                expect(pErr).to.be.null;
                pDone();
            });
        });
    });

    it("And I enter my password");

    it("And I click on the Login button", function(pDone) {
        browser.elementById("auth-login-btn-btnIconEl", function(pErr, pEl) {
            expect(pErr).to.be.null;
            pEl.click(function(pErr) {
                expect(pErr).to.be.null;
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

    after(function(pDone) {
        browser.quit(pDone);
    });
});
