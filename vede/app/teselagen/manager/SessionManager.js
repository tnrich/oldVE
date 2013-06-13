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

    /**
     * @member Teselagen.manager.SessionManager
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
        if (pDefault && this.getEnv() === this.constants.ENV_TEST) {
            url = pDefault;
        }
        return url;
    },

    /**
     * Builds a URL for User specific Resources
     * @param {String} pAction The action to be added to base URL.
     * @param {String} pDefault The default URL used for testing environment.
     */
    buildUserResUrl: function(pAction, pDefault) {
        var url = this.baseURL + "users/" + this.getBaseUser() + pAction;
        if (pDefault && this.getEnv() === this.constants.ENV_TEST) {
            url = pDefault;
        }
        return url;
    }

});