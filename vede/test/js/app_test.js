Ext.require("Ext.app.Application");

var application = null;
Ext.onReady(function() {
    application = Ext.create("Ext.app.Application", {
        name: "Vede",
        appFolder: "../app",
        
        requires: ["Teselagen.manager.SessionManager"],
        
        sessionManager: Teselagen.manager.SessionManager,
        
        controllers: [
            "AppController"
        ],

        launch: function() {
            this.sessionManager.setEnv(Teselagen.constants.Constants.ENV_TEST)
        }
    });
});
