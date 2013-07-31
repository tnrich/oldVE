/*global after, before, describe, expect, it*/
var client = require("../module/webdriverjs").client;

xdescribe("Regression test", function(){
    before(function(done) {
        client.init();
        client.url("http://teselagen.local/", done);
    });
 
    it('Login', function(done) {
        client.setValue("#auth-username-field-inputEl", "testUser", function(err) {
            expect(err).to.be.null;
            client.click("#auth-login-btn-btnIconEl", function(err) {
                expect(err).to.be.null;
                done();
            });
        });
    });

    after(function(done) {
        client.end();
        done();
    });
});
