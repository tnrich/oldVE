/*global casper*/
var system = require("system");
var url = system.env.URL || "http://teselagen.local";
if (system.env.URL) {
    casper.options.pageSettings = {
            userName: "dev",
            password: "dev#rocks"
    };
}

describe("Normal login", function () {
    it("Given I have opened the home page", function() {
        casper.open(url);
        casper.then(function() {
            expect(true).to.be.true;
            casper.waitForSelector("#AuthWindow", function() {
                expect(casper.exists("#AuthWindow")).to.be.true;
            });
        });
    });
    it("When I enter my username", function() {
        casper.then(function() {
            casper.sendKeys("#auth-username-field-inputEl", "testUser");
            casper.click("#auth-login-btn-btnIconEl");
        });
    });
    it("And I enter my password");
    it("And I click on the Login button", function() {
        casper.then(function() {
            casper.click("#auth-login-btn-btnIconEl");
        });
    });
    it("Then I am logged in", function() {
        casper.then(function() {
            casper.waitWhileVisible("div.splashscreen", function() {
                expect(casper.exists("div.splashscreen")).to.be.false;
                //casper.capture("screenshot.png");
            });
        });
    })
});
