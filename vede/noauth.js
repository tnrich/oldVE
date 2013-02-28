var splashscreen;
var session;

Ext.define('sessionData', { 
          singleton: true, 
          data: null,
          baseURL: null
}); 


/*global console*/
Ext.Loader.setConfig({
    enabled: true,
    paths: {
        Ext: '.',
        'Ext.ux': '../extjs/examples/ux',
        Teselagen: './app/teselagen',
        'Teselagen.bio': '../biojs/src/teselagen/bio'
    }
});

Ext.application({
    autoCreateViewport: true,
    name: 'Vede',
    views: [
        'AppViewport',
        'SimulateDigestionWindow'
    ],
    controllers: [
        'ActionStackController',
        'AppController',
        'AnnotatePanelController',
        'FindPanelController',
        'MainMenuController',
        'MainPanelController',
        'MainToolbarController',
        'PieController',
        'RailController',
        'RestrictionEnzymeController',
        'SelectWindowController',
        'SequenceController',
        'VectorPanelController',
        'SimulateDigestionController',
        'Vede.controller.AuthWindowController',
        'DeviceEditor.J5Controller',
        'DeviceEditor.MainMenuController',
        'DeviceEditor.MainToolbarController',
        'DeviceEditor.DeviceEditorPanelController'
    ],
    errorHandler: function(err) {
        console.warn(err);
        return true;
    },
    require: ["Teselagen.event.AuthenticationEvent", "Teselagen.manager.AuthenticationManager"],
    launch: function() {

        Ext.Ajax.cors = true; // Allow CORS
        Ext.Ajax.method = 'POST'; // Set POST as default Method
        sessionData.baseURL = location.href.substring(0,location.href.indexOf("/",7)+1) + 'api/';

        Ext.Error.notify = false; // prevent ie6 and ie7 popup
        Ext.Error.handle = this.errorHandler; // handle errors raised by Ext.Error

        this.authenticationManager = Ext.create("Teselagen.manager.AuthenticationManager"); // Created Auth manager
        //this.authenticationManager.login(); // Start Auth process

    }
});