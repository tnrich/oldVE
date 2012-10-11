var splashscreen;
var session;

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
        'DeviceEditor.J5Controller',
        'DeviceEditor.MainMenuController',
        'DeviceEditor.MainToolbarController',
        'DeviceEditor.DeviceEditorPanelController',
        'Vede.controller.AuthEventDispatcherController'
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
        this.authenticationManager.login(); // Start Auth process

        // Setup a task to fadeOut the splashscreen
        var task = new Ext.util.DelayedTask(function() {
            // Fade out the body mask
            splashscreen.fadeOut({
                duration: 1000,
                remove: true
            });
            // Fade out the icon and message
            splashscreen.next().fadeOut({
                duration: 1000,
                remove: true,
                listeners: {
                    afteranimate: function() {
                        // Set the body as unmasked after the animation
                        console.log('Execute app');
                        var store = Ext.create("Teselagen.store.ProjectStore");
                        store.load();
                        Ext.getBody().unmask();
                    }
                }
            });
        });

        this.on(Teselagen.event.AuthenticationEvent.LOGGED_IN, function(){task.delay(1500);});

    }
});