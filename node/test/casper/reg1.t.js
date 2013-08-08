/*global casper*/
var system = require("system");
var url = system.env.URL || "http://teselagen.local";
if (system.env.URL) {
    casper.options.pageSettings = {
            userName: "dev",
            password: "dev#rocks"
    };
}

casper.test.begin("Regression test", function suite(test) {
    casper.start(url, function() {
        this.waitForSelector("#AuthWindow", function() {
            test.assertExists("#AuthWindow", "Authentication Window exists");
        });
    });
    
    casper.then(function() {
        this.sendKeys("#auth-username-field-inputEl", "testUser");
        this.click("#auth-login-btn-btnIconEl");
    });
    
    casper.then(function() {
        this.waitWhileVisible("div.splashscreen", function() {
            test.assertTrue(true, "Should log in");
            this.capture("screenshot.png");
        });
    });
    
    casper.run(function() {
        test.done();
    });
});
