/**
 * RestrictionEnzymeGroupManager tests.
 * @author Yuri Bendana, Nick Elsbree
 */
/*global describe, expect, it*/

Ext.require("Teselagen.manager.RestrictionEnzymeGroupManager");
Ext.require("Teselagen.manager.UserManager");
Ext.onReady(function() {
    var rem = Teselagen.manager.RestrictionEnzymeGroupManager;
    var UserManager = Teselagen.manager.UserManager;
    describe("Teselagen.manager.RestrictionEnzymeGroupManager", function() {

        it("Can load all groups", function() {
            rem.initialize();

            var sg = rem.getSystemGroups();
            expect(sg.length).toBeGreaterThan(0);

            Ext.each(sg, function(group) {
                expect(group.getEnzymes()[0] instanceof
                        Teselagen.bio.enzymes.RestrictionEnzyme);
            });

            var ug = rem.getUserGroups();
            expect(ug.length).toBe(0);

            var ag = rem.getActiveGroup();
            expect(ag).toEqual(sg[0]);
        });

        it("Create user group", function() {
            var user = UserManager.getUser();
            var userRestrictionEnzymeGroups = user.userRestrictionEnzymeGroups();
            userRestrictionEnzymeGroups.removeAll();
            rem.createUserGroup("group2");
            expect(user.userRestrictionEnzymeGroups().first().get("name")).toBe("group2");
            UserManager.getUserByName(user.get("username"), function(pSuccess, pUser){
                expect(pSuccess).toBe(true);
                var group = pUser.userRestrictionEnzymeGroups().first();
                expect(group).not.toBe(undefined);
                expect(group.get("name")).toBe("group1");
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