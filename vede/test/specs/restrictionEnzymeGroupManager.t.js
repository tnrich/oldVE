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

        it("Create user group", function(pDone) {
            user = UserManager.getUser();
            var userRestrictionEnzymeGroups = user.userRestrictionEnzymeGroups();
            userRestrictionEnzymeGroups.removeAll();
            regm.createUserGroup("group2", ["AatII", "BamHI"]);
            UserManager.update(user, function(pSuccess) {
                expect(pSuccess).to.be.true;
                UserManager.getLoggedInUser(function(pSuccess, pUser){
                    expect(pSuccess).to.be.true;
                    var group = pUser.userRestrictionEnzymeGroups().first();
                    expect(group).not.to.be.undefined;
                    expect(group.get("name")).to.equal("group2");
                    var enzymes = group.userRestrictionEnzymes();
                    expect(enzymes.first().get("name")).to.equal("AatII");
                    expect(enzymes.last().get("name")).to.equal("BamHI");
                    pDone();
                });
            });
        });
        
        it("Remove user group", function(pDone) {
            user = UserManager.getUser();
            regm.removeUserGroup("group2");
            UserManager.update(user, function(pSuccess) {
                expect(pSuccess).to.be.true;
                UserManager.getLoggedInUser(function(pSuccess, pUser){
                    expect(pSuccess).to.be.true;
                    expect(pUser.userRestrictionEnzymeGroups().count()).to.equal(0);
                    pDone();
                });
            });
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