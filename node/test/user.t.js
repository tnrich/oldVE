/*global before, dbManager, describe, expect, it */

var UserManager = require("../manager/UserManager")();
var userManager;

describe("User tests.", function() {
    before(function() {
        userManager = new UserManager(dbManager.mongoose);
    });
    it("User.deleteAll", function(done) {
        userManager.deleteAll(function(err) {
            expect(err).to.be.null;
            done();
        });
    });
});