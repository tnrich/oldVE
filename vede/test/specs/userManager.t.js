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
    var username = "mfero";
    describe("Teselagen.manager.UserManager", function() {
        var user;
        it("Get user", function() {
            runs(function() {
                UserManager.getLoggedInUser(function(pSuccess, pUser){
                    expect(pSuccess).toBe(true);
                    expect(Ext.isDefined(pUser)).toBe(true);
                    expect(pUser.get("username")).toBe(username);
                    user = pUser;
                });
            });
        });
        xit("Put user", function() { // Create a separate user to avoid problem with other test or use Mocha
            waitsFor(function() {
                return user;
            });
            runs(function() {
                user.set("username", "dummy");
                UserManager.update(user, function(pSuccess) {
                    expect(pSuccess).toBe(true);
                    UserManager.getLoggedInUser(function(pSuccess, pUser){
                        expect(pSuccess).toBe(true);
                        expect(pUser.get("username")).toBe("dummy");
                        pUser.set("username", username);
                        UserManager.update(pUser);
                    });
                });
            });
        });
        it("Set user", function() {
            var groupname = "group1";
            var userdata = {user: {username:username, userRestrictionEnzymeGroups: [{name:groupname}]}};
            UserManager.setUserFromJson(userdata);
            var user = UserManager.getUser();
            expect(user).not.toBe(null);
            expect(user.get("username")).toBe(username);
            var userRestrictionEnzymeGroups = user.userRestrictionEnzymeGroups();
            expect(userRestrictionEnzymeGroups).not.toBe(undefined);
            expect(userRestrictionEnzymeGroups.first().get("name")).toBe(groupname);
        });
    });
});