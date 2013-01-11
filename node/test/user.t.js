/*global before, dbManager, describe, expect, it */

var UserManager, userManager;

describe("User tests.", function() {
    before(function(pDone) {
        UserManager = require("../manager/UserManager")(dbManager.mongoose);
        userManager = new UserManager();
        pDone();
    });
    it("User.deleteAll", function(done) {
        userManager.deleteAll(function(err) {
            expect(err).to.be.null;
            done();
        });
    });
});