/**
 * UserManager tests.
 * @author Yuri Bendana
 */
/*global describe, expect, it*/

Ext.require("Teselagen.manager.UserManager");
Ext.onReady(function() {
    var UserManager = Teselagen.manager.UserManager;
    var username = "mfero";
    describe("Teselagen.manager.UserManager", function() {
        it("Get user from database", function(pDone) {
            UserManager.getUserFromDb(function(pSuccess, pUser){
                expect(pSuccess).to.be.true;
                expect(pUser).to.be.defined;
                expect(pUser.get("username")).to.equal(username);
                pDone();
            });
        });
        it("Update user", function(pDone) {
            UserManager.getUser().set("username", "dummy");
            UserManager.update(function(pSuccess) {
                expect(pSuccess).to.be.true;
                UserManager.getUserFromDb(function(pSuccess, pUser){
                    expect(pSuccess).to.be.true;
                    expect(pUser.get("username")).to.equal("dummy");
                    pUser.set("username", username);
                    UserManager.update(function(pSuccess) {
                        expect(pSuccess).to.be.true;
                        pDone();
                    });
                });
            });
        });
        it("Set user", function() {
            var groupname = "group1";
            var userdata = {"username":username, "userRestrictionEnzymeGroups": [{"name":groupname}]};
            UserManager.setUserFromJson(userdata);
            var user = UserManager.getUser();
            expect(user).not.to.be.null;
            expect(user.get("username")).to.equal(username);
            var userRestrictionEnzymeGroups = user.userRestrictionEnzymeGroups();
            expect(userRestrictionEnzymeGroups).not.to.be.undefined;
            expect(userRestrictionEnzymeGroups.first().get("name")).to.equal(groupname);
        });
    });
});