/**
 * User model tests.
 * @author Yuri Bendana
 */

/*global describe, expect, it, runs, waitsFor*/
Ext.onReady(function() {
    describe("Teselagen.models.User", function() {
        var user;
        var isUsersDeleted = false, isTestDataDeleted=false;
        it("Clear test data", function() {
            runs(function() {
                Ext.Ajax.request({
                    url: "/api/users",
                    method: "DELETE",
                    success: function() {
                        isUsersDeleted = true;
                    }
                });
                waitsFor(function() {
                    isTestDataDeleted = isUsersDeleted;
                    return isTestDataDeleted;
                }, "test data deleted", 500);
            });
        });
       it("Get user", function() {
           waitsFor(function() {
              return isTestDataDeleted;
           });
           runs(function() {
               var proxy = Teselagen.models.User.getProxy();
               proxy.url = "";
               Teselagen.manager.SessionManager.setBaseUser("mfero");
               Teselagen.models.User.load(null, {
                   success: function(pUser){
                       user = pUser;
                       expect(Ext.isDefined(pUser)).toBe(true);
                       expect(pUser.get("username")).toBe("mfero");
                       console.log(pUser.get("username"));
                   }
               });
           });
       });
        it("Put user", function() {
            waitsFor(function() {
               return user;
            });
            runs(function() {
                user.set("username", "dummy");
                user.save({
                    success: function(pUser){
                        expect(Ext.isDefined(pUser)).toBe(true);
                    }
                });
            });
        });
    });
});