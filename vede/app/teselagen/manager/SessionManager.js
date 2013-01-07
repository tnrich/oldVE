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
        data: null,
        env: null
    },
    
    constants: null,
    
    /**
     * @memberOf Teselagen.manager.SessionManager
     */
    constructor: function() {
        this.constants = Teselagen.constants.Constants;
        this.baseURL = location.href.substring(0,location.href.indexOf("/",7)+1) + "api/";
        this.env = this.constants.ENV_DEV;
    },
    
    /**
     * Builds a URL for Proxies.
     * @param {String} pAction The action to be added to base URL.
     * @param {String} pDefault The default URL used for testing environment.
     */
    buildUrl: function(pAction, pDefault) {
        var url = this.baseURL + pAction;
        if (this.getEnv() === this.constants.ENV_TEST) {
            url = pDefault;
        }
        return url;
    }

});