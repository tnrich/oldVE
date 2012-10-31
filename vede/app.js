var splashscreen;

Ext.define('sessionData', { 
          singleton: true, 
          data: null,
          baseURL: null
}); 

Ext.onReady(function() {
    // Start the mask on the body and get a reference to the mask
    splashscreen = Ext.getBody().mask('<span id="splash-text">Loading application</span>', 'splashscreen');
    // Add a new class to this mask as we want it to look different from the default.
    splashscreen.addCls('splashscreen');

    Ext.select('.x-mask-msg').setStyle('top','60px');


    // Insert a new div before the loading icon where we can place our logo.
    Ext.DomHelper.insertFirst(Ext.query('.x-mask-msg')[0], {
        cls: 'x-splash-icon'
    });
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
        'FileImportWindow',
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
        'DeviceEditor.GridController',
        'DeviceEditor.InspectorController',
        'DeviceEditor.J5Controller',
        'DeviceEditor.MainMenuController',
        'DeviceEditor.MainToolbarController',
        'DeviceEditor.DeviceEditorPanelController',
        'Vede.controller.AuthEventDispatcherController',
        'ProjectController',
        'DashboardPanelController'
    ],
    errorHandler: function(err) {
        console.warn(err);
        return true;
    },
    require: [
        "Teselagen.event.AuthenticationEvent", 
        "Teselagen.manager.AuthenticationManager", 
        "Teselagen.models.SequenceFile"
    ],
    launch: function() {

        Ext.Ajax.cors = true; // Allow CORS
        Ext.Ajax.method = 'POST'; // Set POST as default Method
        sessionData.baseURL = location.href.substring(0,location.href.indexOf("/",7)+1) + 'api/';

        Ext.Error.notify = false; // prevent ie6 and ie7 popup
        Ext.Error.handle = this.errorHandler; // handle errors raised by Ext.Error

        this.authenticationManager = Ext.create("Teselagen.manager.AuthenticationManager"); // Created Auth manager
        this.authenticationManager.login(this); // Start Auth process

        var self = this;

        // Setup a task to fadeOut the splashscreen
        var task = new Ext.util.DelayedTask(function() {
            splashscreen.fadeOut({
                duration: 1000,
                remove: true
            });
            splashscreen.next().fadeOut({
                duration: 1000,
                remove: true,
                listeners: {
                    afteranimate: function() {
                        self.projectManager = Ext.create("Teselagen.manager.ProjectManager"); // Created Project Manager
                        self.projectManager.loadUser();
                        //Ext.getBody().unmask();
                    }
                }
            });
        });

        this.on(Teselagen.event.AuthenticationEvent.LOGGED_IN, function(){task.delay(1500);});

    }
});
