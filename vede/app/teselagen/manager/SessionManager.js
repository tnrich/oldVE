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
    
    constants: Teselagen.constants.Constants,
    
    constructor: function() {
        this.baseURL = location.href.substring(0,location.href.indexOf("/",7)+1) + "api/";
        this.env = this.constants.ENV_DEV;
//        console.log(this.baseURL);
    }

});