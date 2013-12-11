/**
 * @singleton
 * @class Teselagen.manager.SessionManager
 * Manages user session data.
 *
 * @author Yuri Bendana
 */
Ext.define("Teselagen.manager.SessionManager", {
    singleton: true,

    requires: ["Teselagen.constants.Constants"],

    config: {
        baseURL: null,
        baseUser: null,
        data: null,
        env: null
    },

    constants: null,


    maskApp: function(){
        // Start the mask on the body and get a reference to the mask
        splashscreen = Ext.getBody().mask();
        // $(".loader").html("<span class='c'></span><span class='d spin'><span class='e'></span></span><span class='r r1'></span><span class='r r2'></span><span class='r r3'></span><span class='r r4'></span>");

        // Ext.get('retry-btn').on("click",function(){
        //     Ext.get('splash-retry').hide();
        //     Teselagen.manager.AuthenticationManager.Login();
        // });

        // Add a new class to this mask as we want it to look different from the default.
        splashscreen.addCls('splashscreen');

        // Ext.select('.x-mask-msg').setStyle('top','60px');


        Ext.DomHelper.insertFirst(Ext.query('.splashscreen')[0], {
            id: 'x-splash-message'
        });  
        // Insert a new div before the loading icon where we can place our logo.
        Ext.DomHelper.insertFirst(Ext.query('.splashscreen')[0], {
            cls: 'x-splash-icon'
        });    
    },

    unmaskApp: function(){
            if(splashscreen)
                {
                splashscreen.fadeOut({
                    duration: 1000,
                    remove: true
                });
                splashscreen.next().fadeOut({
                    duration: 1000,
                    remove: true,
                    listeners: {
                        afteranimate: function() {
                            splashscreen = null;
                            //Teselagen.manager.ProjectManager.loadUser();
                        }
                    }
                });
            }
            //else { Teselagen.manager.ProjectManager.loadUser(); }       
    },

    /**
     * @member Teselagen.manager.SessionManager
     */
    constructor: function() {
        this.constants = Teselagen.constants.Constants;
        this.setBaseURL( location.href.substring(0,location.href.indexOf("/",8)+1) );
        //this.setBaseURL("http://app.teselagen.com/api/");
        this.setEnv(this.constants.ENV_DEV);
    },

    /**
     * Builds a URL for Proxies.
     * @param {String} pAction The action to be added to base URL.
     * @param {String} [pDefault] The default URL used for testing environment.
     */
    buildUrl: function(pAction, pDefault) {
        var url = this.getBaseURL() + pAction;
        return url;
    },

    /**
     * Builds a URL for User specific Resources
     * @param {String} pAction The action to be added to base URL.
     * @param {String} [pDefault] The default URL used for testing environment.
     */
    buildUserResUrl: function(pAction, pDefault) {
        var url = this.getBaseURL() + "users/" + this.getBaseUser() + pAction;
        if (pDefault && this.getEnv() === this.constants.ENV_TEST) {
            url = pDefault;
        }
        return url;
    }

});
