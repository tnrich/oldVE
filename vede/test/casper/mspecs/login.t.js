/*global casper*/
var system = require("system");
var url = system.env.URL || "http://teselagen.local";
if (system.env.URL) {
    casper.options.pageSettings = {
            userName: "dev",
            password: "dev#rocks"
    };
}

describe("Regression test", function () {
    it("Open url", function() {
        casper.open(url);
        casper.then(function() {
            expect(true).to.be.true;
            casper.waitForSelector("#AuthWindow", function() {
                expect(casper.exists("#AuthWindow")).to.be.true;
            });
        });
    });
    it("Login", function() {
        casper.then(function() {
            casper.sendKeys("#auth-username-field-inputEl", "testUser");
            casper.click("#auth-login-btn-btnIconEl");
        });
    });
    it("Splashscreen disappears", function() {
        casper.then(function() {
            casper.waitWhileVisible("div.splashscreen", function() {
                expect(casper.exists("div.splashscreen")).to.be.false;
                console.log("Taking screenshot");
                casper.capture("screenshot.png");
            });
        });
    })
});
