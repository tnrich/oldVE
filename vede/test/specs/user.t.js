/**
 * UserManager tests.
 * @author Yuri Bendana
 */
/*global describe, expect, it, runs, waitsFor*/

Ext.require("Teselagen.manager.SessionManager");
Ext.require("Teselagen.manager.UserManager");
Ext.require("Teselagen.models.User");
Ext.onReady(function() {
//    var SessionManager = Teselagen.manager.SessionManager;
    var UserManager = Teselagen.manager.UserManager;
    var User = Teselagen.models.User;
    describe("Teselagen.models.User", function() {
        var user;
        it("Get user", function() {
            runs(function() {
                var username = "mfero";
                var proxy = User.getProxy();
                proxy.url = "";
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
    });
});