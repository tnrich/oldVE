/**
 * RestrictionEnzymeGroupManager tests.
 * @author Yuri Bendana, Nick Elsbree
 */
/*global describe, expect, it*/

Ext.require("Teselagen.manager.RestrictionEnzymeGroupManager");
Ext.require("Teselagen.manager.UserManager");
Ext.onReady(function() {
    var regm = Teselagen.manager.RestrictionEnzymeGroupManager;
    var UserManager = Teselagen.manager.UserManager;
    var user;

    describe("Teselagen.manager.RestrictionEnzymeGroupManager", function() {

        it("Can load all groups", function() {
            regm.initialize();

            var sg = regm.getSystemGroups();
            expect(sg.length).to.be.above(0);

            Ext.each(sg, function(group) {
                expect(group.getEnzymes()[0] instanceof
                        Teselagen.bio.enzymes.RestrictionEnzyme).to.be.true;
            });

            var ug = regm.getUserGroups();
            expect(ug.length).to.equal(0);

            var ag = regm.getActiveGroup();
            expect(ag).to.equal(sg[0]);
        });

        it("Default active group exists", function() {
            var groups = regm.getUserEnzymeGroups();
            var activeGroup = groups.findRecord("name", "Active");
            expect(activeGroup).to.be.defined;
            expect(activeGroup.userRestrictionEnzymes().count()).to.equal(regm.COMMON_ENZYMES.length);
        });
        
        it("Get user enzyme group by name", function() {
            var group = regm.getUserEnzymeGroupByName(regm.ACTIVE);
            expect(group.get("name")).to.equal(regm.ACTIVE);
        });

        it("Create user group", function(pDone) {
            user = UserManager.getUser();
            regm.createUserGroup("group1", ["AatII", "BamHI"]);
            UserManager.update(function(pSuccess) {
                expect(pSuccess).to.be.true;
                UserManager.loadUser(function(pSuccess, pUser){
                    expect(pSuccess).to.be.true;
                    var group = pUser.userRestrictionEnzymeGroups().findRecord("name", "group1");
                    expect(group).not.to.be.null;
                    expect(group.get("name")).to.equal("group1");
                    var enzymes = group.userRestrictionEnzymes();
                    expect(enzymes.first().get("name")).to.equal("AatII");
                    expect(enzymes.last().get("name")).to.equal("BamHI");
                    pDone();
                });
            });
        });
        
        it("Remove user group", function(pDone) {
            regm.removeUserGroup("group1");
            UserManager.update(function(pSuccess) {
                expect(pSuccess).to.be.true;
                UserManager.loadUser(function(pSuccess, pUser){
                    expect(pSuccess).to.be.true;
                    expect(pUser.userRestrictionEnzymeGroups().findExact("name", "group1")).to.equal(-1);
                    pDone();
                });
            });
        });

        it("Copy a user group", function() {
            regm.initActiveUserGroup();
            var groups = regm.getUserEnzymeGroups();
            regm.copyUserGroup("Active", "NewActive");
            var oldGroup = groups.first();
            var newGroup = groups.last();
            expect(oldGroup.get("name")).to.equal("Active");
            expect(newGroup.get("name")).to.equal("NewActive");
            expect(oldGroup.userRestrictionEnzymes().count()).to.equal(newGroup.userRestrictionEnzymes().count());
            expect(oldGroup.id).not.to.equal(newGroup.id);
        });
        
        it("Make a group active", function() {
            regm.createUserGroup("group2", ["AatII", "BamHI"]);
            var active = regm.getUserEnzymeGroupByName(regm.ACTIVE);
            var activeEnzymes = active.userRestrictionEnzymes();
            expect(activeEnzymes.count()).to.equal(regm.COMMON_ENZYMES.length);
            regm.makeActive("group2");
            expect(activeEnzymes.count()).to.equal(2);
        });
     });
});