/*global after, before, describe, expect, it*/
var driver = require("../module/sel_webdriver").driver;

describe("Regression test", function(){
    before(function() {
        driver.get("http://teselagen.local/");
    });
 
    xit('Login', function() {
        var userName = driver.findElement(driver.By.name("#auth-username-field-inputEl"));
        userName.clear()
        userName.sendKeys("testUser");
        driver.findElement("#auth-login-btn-btnIconEl").click()
    });

    xit("Create new project", function(done) {
        client.waitFor("span:nodeValue('Create project')", 5000, function(err){
            expect(err).to.be.null;
            client.saveScreenshot('/tmp/screenshot.png');
            done();
        });
    });
 
    after(function() {
        driver.quit();
    });
});

//driver.wait(function() {
//    return driver.findElement(locator).isDisplayed();
//}, timeout);
