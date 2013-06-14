/*global before, dbManager, describe, expect, it */

var UserManager = require("../manager/UserManager")();
var userManager;

describe("UserManager tests.", function() {
    var user;
    before(function() {
        userManager = new UserManager(dbManager.mongoose);
    });
    it("UserManager.deleteAll", function(done) {
        userManager.deleteAll(function(err) {
            expect(err).to.be.null;
            done();
        });
    });
    it("UserManager.create", function(done) {
        var user = {username:"mfero"};
        userManager.create(user, function(pErr, pUser) {
            expect(pErr).to.be.null;
            expect(pUser).not.to.be.null;
            expect(pUser.id).not.to.be.null;
            done();
        });
    });
    it("UserManager.getUserByName", function(done) {
        userManager.getUserByName("mfero", function(pErr, pUser) {
            expect(pErr).to.be.null;
            expect(pUser).not.to.be.null;
            expect(pUser.username).to.equal("mfero");
            user = pUser;
            done();
        });
    });
    it("UserManager.getUserById", function(done) {
        userManager.getUserById(user.id, function(pErr, pUser) {
            expect(pErr).to.be.null;
            expect(pUser).not.to.be.null;
            expect(pUser.username).to.equal("mfero");
            done();
        });
    });
    it("UserManager.update", function(done) {
        user.username = "mike.fero";
        user.firstName = "Mike";
        user.lastName = "Fero";
        user.email = "mike@teselagen.com";
        var group = {name:"group1", userRestrictionEnzymes:[{name:"enzyme1"}, {name:"enzyme2"}]};
        user.userRestrictionEnzymeGroups.push(group);
        userManager.update(user, function(pErr, pUser) {
            expect(pErr).to.be.null;
            expect(pUser.username).to.equal("mike.fero");
            expect(pUser.firstName).to.equal("Mike");
            expect(pUser.lastName).to.equal("Fero");
            expect(pUser.email).to.equal("mike@teselagen.com");
            expect(pUser.userRestrictionEnzymeGroups[0].name).to.equal("group1");
            expect(pUser.userRestrictionEnzymeGroups[0].userRestrictionEnzymes[1].name).to.equal("enzyme2");
            done();
        });
    });
});