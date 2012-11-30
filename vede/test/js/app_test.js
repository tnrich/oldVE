Ext.application({
    name: "Vede",
    appFolder: "../app",

    requires: ["Teselagen.constants.Constants",
               "Teselagen.constants.SBOLIcons",
               "Teselagen.manager.SessionManager"],

    sessionManager: null,

    controllers: ["AppController"],

    launch: function() {
        this.sessionManager = Teselagen.manager.SessionManager;
        this.sessionManager.setEnv(Teselagen.constants.Constants.ENV_TEST);
    }
});

