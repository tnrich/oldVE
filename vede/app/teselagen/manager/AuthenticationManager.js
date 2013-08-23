/**
 * @class Teselagen.manager.AuthenticationManager
 * Holds authentication information
 * @author Rodrigo Pavez
 **/

Ext.define("Teselagen.manager.AuthenticationManager", {
    requires: ["Teselagen.event.AuthenticationEvent", "Vede.view.common.ProjectPanelView", "Vede.view.AuthWindow","Teselagen.manager.TasksMonitor",
               "Teselagen.manager.UserManager", "Teselagen.utils.SystemUtils","Ext.util.Cookies"],
    alias: "AuthenticationManager",
    singleton: true,
    mixins: {
        observable: "Ext.util.Observable"
    },
    authResponse: null,
    username: null,
    autoAuthURL : null,

    updateSplashScreenMessage: function(message, stop) {
        if (Ext.get("x-splash-message")) {Ext.get("x-splash-message").update(message); }
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

        Ext.Ajax.request({
            url: Teselagen.manager.SessionManager.buildUrl("users"),
            method: 'GET',
            params: {},
            success: self.continueLogin,
            failure: function(response) {
                if(response.status !== 200) { 
                    var msg = "";
                    try
                    {
                        msg = JSON.parse(response.responseText).msg;
                    }
                    catch(err)
                    {}

                    if(Ext.getCmp('auth-response')) Ext.getCmp('auth-response').setValue(msg);
                    return;
                }
                var response = JSON.parse(response.responseText);
                if(response) Ext.getCmp('auth-response').setValue(response.msg);
                if (cb) {return cb(false, response.statusText); }
            }
        });

        this.updateServerPath();
    },

    continueLogin: function(response) {
        var self = Teselagen.manager.AuthenticationManager;

        self.authResponse = JSON.parse(response.responseText);
        if(!self.authResponse.error) {
            self.username = self.authResponse.user.username;
            Teselagen.manager.SessionManager.setBaseUser(self.username || self.authResponse.user.username);
            self.updateSplashScreenMessage(self.authResponse.msg);
            if (Ext.getCmp("AuthWindow")) { Ext.getCmp("AuthWindow").destroy(); }
            Teselagen.manager.UserManager.setUserFromJson(self.authResponse.user,function(){
                Vede.application.fireEvent(Teselagen.event.AuthenticationEvent.LOGGED_IN);                    
            });
            Teselagen.manager.TasksMonitor.bootMonitoring();
            Teselagen.manager.TasksMonitor.startMonitoring();
        }
    },

    autoAuthAttempt: function(){
        if(!this.autoAuthURL) this.autoAuthURL = "http://dev2.teselagen.com/api";

        var self = this;
        if(Vede.application.autoCredentialsFetch)
        {
            self.updateSplashScreenMessage("Connecting...",false);
            Ext.Ajax.request({
                url: self.autoAuthURL + "?_nocache="+Math.random(),
                params: {
                    cors_url : Teselagen.utils.SystemUtils.getBaseURL()
                },
                method: "GET",
                success: function(response) {
                    //console.log(response);
                    var session = JSON.parse(response.responseText);
                    self.username = session.username;
                    if(session.userId)
                    {
                        self.sendAuthRequest(session, cb);
                    }
                    else
                    {
                        self.updateServerPath();                    
                    }
                },
                failure: function() {
                    self.updateServerPath();
                }
            });
        }
        else
        {
           self.updateServerPath();
        }        
    },

    updateServerPath: function(){
        Ext.create("Vede.view.AuthWindow").show();
        //var baseURL = Teselagen.utils.SystemUtils.getBaseURL();
        //Ext.getCmp('select-server-combo').setValue( baseURL + 'api/' );        
    },

    /**
     *
     *
     * Input parameters.
     * @param {Object} params (required) {username(optional),password(optional),server(optional),session(optional)}
     * For Automatic Auth use params.session
     * For Manual Auth use params.username, params.password, params.server (optional)
     */

    sendAuthRequest: function(params, cb, remember) {
        var self = this;

        //if(params.server) { Teselagen.manager.SessionManager.baseURL = params.server; } // Set base URL 

        self.updateSplashScreenMessage("Authenticating to server");

        // Force cookies
        remember = true;

        Ext.Ajax.request({
            url: Teselagen.manager.SessionManager.buildUrl("login"),
            method: 'POST',
            params: {
                username: params.username || "",
                password: params.password || null,
                sessionId: params.sessionId || "",
                remember: remember
            },
            success: function(response) {
                var result = JSON.parse(response.responseText);

                if(result.success !== false) {
                    self.continueLogin(response);
                } else {
                    Ext.getCmp('auth-response').setValue(result.msg);
                }
            },
            failure: function(response) {
                if(response.status !== 200) { 
                    var msg = "";
                    try
                    {
                        msg = JSON.parse(response.responseText).msg;
                    }
                    catch(err)
                    {}

                    if(Ext.getCmp('auth-response')) Ext.getCmp('auth-response').setValue(msg);
                    return;
                }
                var response = JSON.parse(response.responseText);
                if(response) Ext.getCmp('auth-response').setValue(response.msg);
                if (cb) {return cb(false, response.statusText); }
            }
        });
    }
});
