/*global before, dbManager, describe, expect, it */

var ProjectManager = require("../manager/ProjectManager")();
var UserManager = require("../manager/UserManager")();
var projectManager, userManager;

describe("ProjectManager tests.", function() {
    var user;
    before(function() {
        projectManager = new ProjectManager(dbManager.mongoose);
        userManager = new UserManager(dbManager.mongoose);
    });
    it("ProjectManager.deleteAll", function(done) {
        projectManager.deleteAll(function(err) {
            expect(err).to.be.null;
            done();
        });
    });
    it("ProjectManager.create", function(done) {
        userManager.getByName("mfero", function(pErr, pUser) {
            expect(pErr).to.be.null;
            var date = new Date().toISOString();
            var project = {name:"MyProject1", dateCreated:date, dateModified:date, user_id:pUser.id};
            projectManager.create(project, function(pErr, pProject) {
                expect(pErr).to.be.null;
                expect(pProject).not.to.be.null;
                expect(pProject.id).not.to.be.null;
                expect(pProject.user_id.toString()).to.equal(pUser.id);
                userManager.getById(pProject.user_id, function(pErr, pUser) {
                    expect(pErr).to.be.null;
                    expect(pUser).not.to.be.null;
                    expect(pUser.projects).not.to.be.null;
                    expect(pUser.projects[0].id).to.equal(pProject.id)
                    done();
                })
            });
        });
    });
    it.skip("ProjectManager.getByName", function(done) {
        userManager.getByName("mfero", function(pErr, pUser) {
            expect(pErr).to.be.null;
            expect(pUser).not.to.be.null;
            expect(pUser.username).to.equal("mfero");
            user = pUser;
            done();
        });
    });
    it.skip("ProjectManager.getById", function(done) {
        userManager.getById(user.id, function(pErr, pUser) {
            expect(pErr).to.be.null;
            expect(pUser).not.to.be.null;
            expect(pUser.username).to.equal("mfero");
            done();
        });
    });
    it.skip("ProjectManager.update", function(done) {
        user.firstName = "Mike";
        user.lastName = "Fero";
        user.email = "mike@teselagen.com";
        var group = {name:"group1", userRestrictionEnzymes:[{name:"enzyme1"}, {name:"enzyme2"}]};
        user.userRestrictionEnzymeGroups.push(group);
        userManager.update(user, function(pErr, pUser) {
            expect(pErr).to.be.null;
            expect(pUser.firstName).to.equal("Mike");
            expect(pUser.lastName).to.equal("Fero");
            expect(pUser.email).to.equal("mike@teselagen.com");
            expect(pUser.userRestrictionEnzymeGroups[0].name).to.equal("group1");
            expect(pUser.userRestrictionEnzymeGroups[0].userRestrictionEnzymes[1].name).to.equal("enzyme2");
            done();
        });
    });
});