/**
 * Tests authentication.
 * @author Yuri Bendana
 */

/*global describe, it, expect*/

Ext.require([
     "Ext.Ajax",
     "Teselagen.constants.Constants",
     "Teselagen.manager.AuthenticationManager",
     "Teselagen.manager.SessionManager"]);

Ext.onReady(function () {
    var authResponse;
    var authenticationManager = Teselagen.manager.AuthenticationManager;
    var constants = Teselagen.constants.Constants;
    var params = {
            username: "mfero",
            password: "",
            server: constants.API_URL
    };

    describe("Authentication tests.", function() {
       it("Login using mfero/nopassword", function (pDone) {
           authenticationManager.sendAuthRequest(params,  function(pSuccess) {
               if (pSuccess) {
                   authResponse = authenticationManager.authResponse;
                   expect(authResponse).to.be.defined;
                   pDone();
               }
           });
        });
        it("Clear users", function(pDone) {
            Ext.Ajax.request({
                url: "/api/users",
                method: "DELETE",
                success: function() {
                    pDone();
                }
            });
        });
       it("Login using mfero/nopassword", function (pDone) {
           authenticationManager.sendAuthRequest(params,  function(pSuccess) {
               if (pSuccess) {
                   authResponse = authenticationManager.authResponse;
                   expect(authResponse).to.be.defined;
                   pDone();
               }
           });
       });
    });
});
