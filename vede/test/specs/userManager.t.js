/**
 * UserManager tests.
 * @author Yuri Bendana
 */
/*global describe, expect, it, runs, waitsFor*/

Ext.require("Teselagen.manager.UserManager");
Ext.require("Teselagen.models.User");
Ext.onReady(function() {
    var UserManager = Teselagen.manager.UserManager;
    var User = Teselagen.models.User;
    describe("Teselagen.manager.UserManager", function() {
        var user;
        it("Get user", function() {
            runs(function() {
                var username = "mfero";
                UserManager.getUserByName(username, function(pSuccess, pUser){
                    expect(pSuccess).toBe(true);
                    expect(Ext.isDefined(pUser)).toBe(true);
                    expect(pUser.get("username")).toBe("mfero");
                    user = pUser;
                });
            });
        });
        it("Put user", function() {
            waitsFor(function() {
                return user;
            });
            runs(function() {
                user.set("username", "dummy");
                UserManager.update(user, function(pSuccess) {
                    expect(pSuccess).toBe(true);
                });
            });
        });
        it("Set user", function() {
            var userdata = {user: {username:"mfero", userRestrictionEnzymeGroups: [{name:"group1"}]}};
            UserManager.setUserFromJson(userdata);
            var user = UserManager.user;
            expect(user).not.toBe(null);
            expect(user.get("username")).toBe("mfero");
            var userRestrictionEnzymeGroups = user.userRestrictionEnzymeGroups();
            expect(userRestrictionEnzymeGroups).not.toBe(undefined);
            expect(userRestrictionEnzymeGroups.first().get("name")).toBe("group1");
        });
    });
});