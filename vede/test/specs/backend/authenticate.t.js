/**
 * Tests authentication.
 * @author Yuri Bendana
 */

/*global describe, it, expect*/

Ext.require([
     "Teselagen.constants.Constants",
     "Teselagen.manager.AuthenticationManager"]);

Ext.onReady(function () {
    var authResponse;
    var authenticationManager = Teselagen.manager.AuthenticationManager;
    var constants = Teselagen.constants.Constants;
    var params = {
            username: "mfero",
            password: "",
            server: constants.API_URL
    };

    describe("Authentication", function() {
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
