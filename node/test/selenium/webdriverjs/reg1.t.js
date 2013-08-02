/*global after, before, describe, expect, it, process*/
var browser = process.env.BROWSER || "phantomjs";
var driver = require("../../module/webdriverjs").getDriver(browser);

describe("Regression test", function(){
    before(function(pDone) {
        driver.init();
        driver.url("http://teselagen.local/", pDone);
    });
 
    it("should login", function(pDone) {
        var inputField = "#auth-username-field-inputEl";
        driver.waitFor(inputField, 5000, function(err) {
            expect(err).to.be.null;
            driver.setValue(inputField, "testUser", function(err) {
                expect(err).to.be.null;
                driver.click("#auth-login-btn-btnIconEl", function(err) {
                    expect(err).to.be.null;
                    pDone();
                });
            });
        });
    });

    it("should create new project", function(pDone) {
        driver.waitFor("span.x-tree-node-text", 5000, function(err){
            expect(err).to.be.null;
            driver.saveScreenshot("/tmp/screenshot.png", function(err) {
                expect(err).to.be.null;
                pDone();
            });
        });
    });

    after(function(pDone) {
        driver.end(pDone);
    });
});
