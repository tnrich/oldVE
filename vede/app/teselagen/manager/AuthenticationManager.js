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
        if (Ext.get("splash-text")) {Ext.get("splash-text").update(message); }
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
        //if(Ext.util.Cookies.get("last_server"))
        //{
        //    this.autoAuthURL = Ext.util.Cookies.get("last_server");
        //}


        if(Ext.util.Cookies.get("sessionname"))
        {
            console.log("Authenticating using cookies");
            return this.sendAuthRequest({}, cb, true);
        }


        if(!this.autoAuthURL) this.autoAuthURL = "http://dev2.teselagen.com/api";

        var updateServerPath = function(){
            //if(Ext.util.Cookies.get("last_server"))
            //{
            //    Ext.getCmp('select-server-combo').setValue( Ext.util.Cookies.get("last_server") );
            //}
            //else
            //{
            //    var baseURL = Teselagen.utils.SystemUtils.getBaseURL();
            //    Ext.getCmp('select-server-combo').setValue( baseURL + 'api/' );
            //}


            var baseURL = Teselagen.utils.SystemUtils.getBaseURL();
            Ext.getCmp('select-server-combo').setValue( baseURL + 'api/' );

        };

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
                        Ext.create("Vede.view.AuthWindow").show();
                        updateServerPath();                        
                    }
                },
                failure: function() {
                    Ext.create("Vede.view.AuthWindow").show();
                    updateServerPath();
                }
            });
        }
        else
        {
           Ext.create("Vede.view.AuthWindow").show();
           updateServerPath();
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

    sendAuthRequest: function(params, cb, remember) {
        var self = this;

        if(params.server) { Teselagen.manager.SessionManager.baseURL = params.server; } // Set base URL 

        self.updateSplashScreenMessage("Authenticating to server");

        Ext.Ajax.request({
            url: Teselagen.manager.SessionManager.buildUrl("login"),
            params: {
                username: params.username || "",
                password: params.password || "",
                sessionId: params.sessionId || "",
                remember: remember
            },
            success: function(response) {
                self.authResponse = JSON.parse(response.responseText);
                self.username = self.authResponse.user.username;
                Teselagen.manager.SessionManager.setBaseUser(self.username);
                self.updateSplashScreenMessage(self.authResponse.msg);
                if (Ext.getCmp("AuthWindow")) { Ext.getCmp("AuthWindow").destroy(); }
                Teselagen.manager.UserManager.setUserFromJson(self.authResponse.user);
                Vede.application.fireEvent(Teselagen.event.AuthenticationEvent.LOGGED_IN);
                Teselagen.manager.TasksMonitor.bootMonitoring();
                Teselagen.manager.TasksMonitor.startMonitoring();

                //Ext.util.Cookies.set("last_server",Teselagen.manager.SessionManager.baseURL);

                if (cb) { return cb(true); }// for Testing
            },
            failure: function(response) {
                //self.updateSplashScreenMessage(response.statusText, true);
                var response = JSON.parse(response.responseText);
                if(response) Ext.getCmp('auth-response').update(response.msg);
                if (cb) {return cb(false, response.statusText); }
            }
        });
    }
});