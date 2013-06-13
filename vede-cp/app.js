//@require @packageOverrides
var splashscreen;

/*global console*/
Ext.Loader.setConfig({
    enabled: true,
    paths: {
        //Ext: './ext',
        'Ext.ux': './ext/src/ux',
        Teselagen: './app/teselagen',
        Vede: './app',
        'Teselagen.bio': '../biojs/src/teselagen/bio'
    },
    //disableCaching: false
});

Ext.application({
    autoCreateViewport: true,
    name: 'Vede',
    views: [
        'AppViewport',
        've.SimulateDigestionWindow'
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
        'HeaderPanelController',
        'VectorPanelController',
        'VectorEditor.SimulateDigestionController',
        'VectorEditor.ImportSequenceController',
        'AuthWindowController',
        'DeviceEditor.GridController',
        'DeviceEditor.InspectorController',
        'DeviceEditor.J5Controller',
        'DeviceEditor.MainMenuController',
        'DeviceEditor.MainToolbarController',
        'DeviceEditor.DeviceEditorPanelController',
        'AuthEventDispatcherController',
        'ProjectController',
        'DashboardPanelController',
        'VectorEditor.SequenceEditingController',
        'J5ReportController',
        'DeviceEditor.ChangePartDefinitionController'
    ],
    errorHandler: function(err) {
        console.warn(err);
        return true;
    },
    requires: [
        "Teselagen.event.AuthenticationEvent",
        "Teselagen.manager.AuthenticationManager",

        // Stuff that may not be wise to put here
        "Teselagen.constants.Constants",
        "Teselagen.constants.SBOLIcons",
        "Teselagen.models.SequenceFile"
    ],

    init: function(){
        // Start the mask on the body and get a reference to the mask
        splashscreen = Ext.getBody().mask('<span id="splash-text">Loading application</span><span id="splash-retry" style="visibility: hidden;"><button id="retry-btn">Retry</button></span>', 'splashscreen');

        Ext.get('retry-btn').on("click",function(){
            Ext.get('splash-retry').hide();
            Teselagen.manager.AuthenticationManager.Login();
        });

        // Add a new class to this mask as we want it to look different from the default.
        splashscreen.addCls('splashscreen');

        Ext.select('.x-mask-msg').setStyle('top','60px');


        // Insert a new div before the loading icon where we can place our logo.
        Ext.DomHelper.insertFirst(Ext.query('.x-mask-msg')[0], {
            cls: 'x-splash-icon'
        });
    },

    launch: function() {

        Vede.application = this;

        Ext.Ajax.cors = true; // Allow CORS (Cross-Origin Resource Sharing)
        Ext.Ajax.withCredentials = true; // Allow cross-domain cookie-based authentication
        Ext.Ajax.timeout = 100000; // Ajax timeout
        Ext.Error.notify = false; // prevent ie6 and ie7 popup
        Ext.Error.handle = this.errorHandler; // handle errors raised by Ext.Error

        /*
         * autoCredentialsFetch
         * This option enable fetching username and password from /deviceeditor file
         * to be used for automatic login (for testing).
         */
        Vede.application.autoCredentialsFetch = true;

        Teselagen.manager.AuthenticationManager.Login(); // Start Authentication process

        var self = this;

        // Task to fadeOut the splashscreen
        var task = new Ext.util.DelayedTask(function() {
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
                            Teselagen.manager.ProjectManager.loadUser();
                        }
                    }
                });
            }
            else { Teselagen.manager.ProjectManager.loadUser(); }
        });

        // After logged in execute task to fadeOut the splashscreen
        this.on(Teselagen.event.AuthenticationEvent.LOGGED_IN, function(){task.delay(1500);});        

    }
});
