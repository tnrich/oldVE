/**
 * @class Teselagen.manager.AuthenticationManager
 * Holds authentication information
 * @author Rodrigo Pavez
 **/

Ext.define("Teselagen.manager.AuthenticationManager", {
    requires: ["Teselagen.event.AuthenticationEvent", "Vede.view.common.ProjectPanelView", "Vede.view.AuthWindow","Teselagen.manager.TasksMonitor"],
    alias: "AuthenticationManager",
    singleton: true,
    mixins: {
        observable: "Ext.util.Observable"
    },
    authResponse: null,
    username: null,

    updateSplashScreenMessage: function(message, stop) {
        if (splashscreen) {Ext.get("splash-text").update(message); }
        if (stop) {
            Ext.select(".x-mask-msg.splashscreen div:nth(2)").setStyle("background-image", "url()");
            if (splashscreen) Ext.get("splash-retry").show();
        }
    },

    /*
     * Login
     *
     * This method init the auth process by trying to fetchVariables from
     * /deviceeditor (JSON file containing variables) for automatic authentication
     * If fail proceed to manual authentication process
     */

    Login: function(cb) {
        var self = this;
        if(Vede.application.autoCredentialsFetch)
        {
            self.updateSplashScreenMessage("Getting authentication parameters");
            Ext.Ajax.request({
                url: "deviceeditor",
                params: {},
                method: "GET",
                success: function(response) {
                    var session = JSON.parse(response.responseText);
                    self.username = session.username;
                    self.sendAuthRequest(session, cb);
                },
                failure: function() {
                    Ext.create("Vede.view.AuthWindow").show();
                }
            });
        }
        else
        {
           Ext.create("Vede.view.AuthWindow").show();
        }
    },

    /**
     *
     *
     * Input parameters.
     * @param {Object} params (required) {username(optional),password(optional),server(optional),session(optional)}
     * For Automatic Auth use params.session
     * For Manual Auth use params.username, params.password, params.server (optional)
     */

    sendAuthRequest: function(params, cb) {
        var self = this;

        if(params.server) { Teselagen.manager.SessionManager.baseURL = params.server; } // Set base URL 
        if(params.username) {Teselagen.manager.SessionManager.config.baseUser = params.username; } //Set base Username
        else {console.warn("Warning, username not defined"); }

        self.updateSplashScreenMessage("Authenticating to server");

        Ext.Ajax.request({
            url: Teselagen.manager.SessionManager.buildUrl("login"),
            params: {
                username: params.username || "",
                password: params.password || "",
                sessionId: params.sessionId || ""
            },
            success: function(response) {
                if (params.username) {self.username = params.username; }
                self.authResponse = JSON.parse(response.responseText);
                self.updateSplashScreenMessage(self.authResponse.msg);
                if (Ext.getCmp("AuthWindow")) { Ext.getCmp("AuthWindow").destroy(); }
                Vede.application.fireEvent(Teselagen.event.AuthenticationEvent.LOGGED_IN);
                Teselagen.manager.TasksMonitor.bootMonitoring();
                Teselagen.manager.TasksMonitor.startMonitoring();
                if (cb) { return cb(true); }// for Testing
            },
            failure: function(response) {
                self.updateSplashScreenMessage(response.statusText, true);
                if (cb) { return cb(false, response.statusText); }
            }
        });
    }
});