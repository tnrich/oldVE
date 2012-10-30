Ext.require("Ext.app.Application");

var application = null;
Ext.onReady(function() {
    application = Ext.create("Ext.app.Application", {
        name: "Vede",
        appFolder: "../app",
        
        requires: ["Teselagen.manager.SessionManager"],
        
        sessionManager: null,
        
        controllers: [
            "AppController"
        ],

        launch: function() {
            this.sessionManager = Teselagen.manager.SessionManager;
            this.sessionManager.setEnv(Teselagen.constants.Constants.ENV_TEST);
        }
    });
});
