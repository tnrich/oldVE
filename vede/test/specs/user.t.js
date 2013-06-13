/**
 * User model tests.
 * @author Yuri Bendana
 */

/*global describe, expect, it, runs, waitsFor*/
Ext.onReady(function() {
    describe("Teselagen.models.User", function() {
        var user;
       it("Get user", function() {
           runs(function() {
               var proxy = Teselagen.models.User.getProxy();
               proxy.url = "";
               Teselagen.manager.SessionManager.setBaseUser("mfero");
               Teselagen.models.User.load(null, {
                   callback: function(pUser, pOp){
                       user = pUser;
                       expect(pOp.wasSuccessful()).toBe(true);
                       expect(Ext.isDefined(pUser)).toBe(true);
                       expect(pUser.get("username")).toBe("mfero");
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
                    callback: function(pUser, pOp){
                        expect(pOp.wasSuccessful()).toBe(true);
                    }
                });
            });
        });
    });
});