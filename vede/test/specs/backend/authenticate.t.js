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
    var isUsersDeleted = false;
    var params = {
            username: "mfero",
            password: "",
            server: constants.API_URL
    };

    describe("Authentication tests.", function() {
        beforeEach(function() {
            Ext.Ajax.cors = true; // Allow CORS
            sessionManager.setEnv(constants.ENV_PROD);
        });

       it("Login using mfero/nopassword", function () {
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
                expect(Ext.isDefined(authResponse)).toBe(true);
            });
        });
        it("Clear users", function() {
            waitsFor(function() {
                return isLoggedIn;
            }, "users deleted", 500);
            runs(function() {
                Ext.Ajax.request({
                    url: "/api/users",
                    method: "DELETE",
                    success: function() {
                        isUsersDeleted = true;
                        isLoggedIn = false;
                    }
                });
            });
        });
       it("Login using mfero/nopassword", function () {
            waitsFor(function() {
                return isUsersDeleted;
            }, "users deleted", 500);
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
                expect(Ext.isDefined(authResponse)).toBe(true);
            });
        });
    });
});
