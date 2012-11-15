/*global beforeEach, describe, it, expect, runs, waitsFor*/
/**
 * @author Yuri Bendana
 */

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

    describe("Authentication tests.", function() {
        beforeEach(function() {
            Ext.Ajax.cors = true; // Allow CORS
            sessionManager.setEnv(constants.ENV_PROD);
        });

        it("Checking server " + constants.API_URL + " is running", function () {
            var success = false;
            runs(function() {
                Ext.Ajax.request({
                    url: constants.API_URL,
                    method: "GET",
                    success: function () {
                        success = true;
                    }
                });
            });
            waitsFor(function() {
               return success;
            }, "connection", 1000);
            runs(function() {
                expect(success).toBe(true);
            });
        });

        it("Login using rpavez/nopassword", function () {
            var params = {
                    username: "rpavez",
                    password: "",
                    server: constants.API_URL
            };
            runs(function() {
                authenticationManager.sendAuthRequest(params);
            });
            waitsFor(function() {
                return !Ext.isEmpty(authenticationManager.authResponse);
            }, "authentication", 1000);
            runs(function() {
                authResponse = authenticationManager.authResponse;
                expect(authResponse.firstTime).toBe(false);
                expect(authResponse.msg).toBe("Welcome back rpavez!");
            });
        });
    });
});
