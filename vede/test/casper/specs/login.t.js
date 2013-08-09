/*global casper*/
var url = casper.cli.get("url");
if (url) {
    casper.options.pageSettings = {
            userName: "dev",
            password: "dev#rocks"
    };
}
else {
    url = "http://teselagen.local";
}

casper.test.begin("Normal login", function suite(test) {
    casper.start(url, function() {
        this.waitForSelector("#AuthWindow", function() {
            test.assertExists("#AuthWindow", "Given I have opened the home page");
        });
    });
    
    casper.then(function() {
        test.assertExists("#auth-username-field-inputEl", "When I enter my username");
        this.sendKeys("#auth-username-field-inputEl", "testUser");
    });
    
    casper.then(function() {
        test.info("And I enter my password");
    });
    
    casper.then(function() {
        test.assertExists("#auth-login-btn-btnIconEl", "And I click on the Login button");
        this.click("#auth-login-btn-btnIconEl");
    });
    
    casper.then(function() {
        this.waitWhileVisible("div.splashscreen", function() {
            test.assertNotVisible("div.splashscreen", "Then I am logged in");
            //this.capture("screenshot.png");
        });
    });
    
    casper.run(function() {
        test.done();
    });
});
