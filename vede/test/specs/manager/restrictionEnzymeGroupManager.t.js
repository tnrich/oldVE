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

        it("Initialize user groups", function() {
            var groups = regm.getUserEnzymeGroups();
            groups.removeAll();
            regm.initActiveUserGroup();
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
            var userRestrictionEnzymeGroups = user.userRestrictionEnzymeGroups();
            userRestrictionEnzymeGroups.removeAll();
            regm.createUserGroup("group1", ["AatII", "BamHI"]);
            UserManager.update(function(pSuccess) {
                expect(pSuccess).to.be.true;
                UserManager.loadUser(function(pSuccess, pUser){
                    expect(pSuccess).to.be.true;
                    var group = pUser.userRestrictionEnzymeGroups().first();
                    expect(group).not.to.be.undefined;
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
                    expect(pUser.userRestrictionEnzymeGroups().count()).to.equal(0);
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
        
            //        var user;
//        var group;

        // This test should not be relevant to the JS version.
        /*it("loadUserRestrictionEnzymes works", function() {
                group = Ext.create("Teselagen.models.UserRestrictionEnzymeGroup", {
                    groupName: "mygroup",
                    enzymeNames: ["AatII", "BglII"]
                });

                user = Ext.create("Teselagen.models.UserRestrictionEnzyme", {
                    groups: [group],
                    activeEnzymeNames: ["AatII, BglII"]
                });

                rem.setIsInitialized(true);
                rem.loadUserRestrictionEnzymes(user);

                var ug = rem.getUserGroups();
                expect(ug.length).toBe(1);
                expect(ug[0].getEnzymes().length).toBe(2);
                expect(ug[0].getEnzymes()[0] instanceof Teselagen.bio.enzymes.RestrictionEnzyme).toBeTruthy();
            });

            it("removeGroup works", function() {
                rem.setIsInitialized(true);
                rem.loadUserRestrictionEnzymes(user);

                rem.removeGroup(rem.getUserGroups()[0]);
                expect(rem.getUserGroups()).toEqual([]);
            });

            it("groupByName works", function() {
                rem.setIsInitialized(true);
                rem.loadUserRestrictionEnzymes(user);

                var testGroup = rem.groupByName("mygroup");

                expect(testGroup.getEnzymes()[0].getName()).toBe("AatII");
                expect(testGroup.getEnzymes()[1].getName()).toBe("BglII");
            });*/
    });
});