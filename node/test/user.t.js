/*global before, dbManager, describe, expect, it */

var UserManager = require("../manager/UserManager")();
var userManager;

describe("User tests.", function() {
    var user;
    before(function() {
        userManager = new UserManager(dbManager.mongoose);
    });
    it("User.getUserByName", function(done) {
        userManager.getUserByName("mfero", function(pErr, pUser) {
            expect(pErr).to.be.null;
            expect(pUser).not.to.be.null;
            expect(pUser.username).to.equal("mfero");
            user = pUser;
            done();
        });
    });
    it("User.getUserById", function(done) {
        userManager.getUserById(user.id, function(pErr, pUser) {
            expect(pErr).to.be.null;
            expect(pUser).not.to.be.null;
            expect(pUser.username).to.equal("mfero");
            done();
        });
    });
    xit("User.deleteAll", function(done) {
        userManager.deleteAll(function(err) {
            expect(err).to.be.null;
            done();
        });
    });
});