/**
 * Tests authentication.
 * @author Yuri Bendana
 */

/*global beforeEach, describe, it, expect, runs, waitsFor*/

Ext.require([
     "Ext.Ajax",
     "Teselagen.constants.Constants",
     "Teselagen.manager.AuthenticationManager",
     "Teselagen.manager.SessionManager"]);

Ext.onReady(function () {
    var authResponse;
    var authenticationManager = Teselagen.manager.AuthenticationManager;
    var constants = Teselagen.constants.Constants;
    var sessionManager = Teselagen.manager.SessionManager;
    var isLoggedIn = false;

    describe("Authentication tests.", function() {
        beforeEach(function() {
            Ext.Ajax.cors = true; // Allow CORS
            sessionManager.setEnv(constants.ENV_PROD);
        });

        it("Checking server " + constants.API_URL + " is running", function () {
            var success, response;
            runs(function() {
                Ext.Ajax.request({
                    url: constants.API_URL+"user",
                    method: "GET",
                    callback: function(pReq, pSuccess, pResp) {
                        success = pSuccess;
                        response = pResp;
                    }
                });
            });
            waitsFor(function() {
               return Ext.isDefined(success);
            }, "connection", 500);
            runs(function() {
                if (success) {
                    expect(response.status).toBe(200);
                }
                else {
                    expect(response.status).toBe(401);
                }
            });
        });

        it("Login using rpavez/nopassword", function () {
            var params = {
                    username: "rpavez",
                    password: "",
                    server: constants.API_URL
            };
            runs(function() {
                authenticationManager.sendAuthRequest(params,  function(pSuccess) {
                    if (pSuccess) {
                        isLoggedIn = true;
                    }
                });
            });
            waitsFor(function() {
                return isLoggedIn;
            }, "authentication", 500);
            runs(function() {
                authResponse = authenticationManager.authResponse;
                expect(authResponse.firstTime).toBe(false);
                expect(authResponse.msg).toBe("Welcome back rpavez!");
            });
        });
    });
});
