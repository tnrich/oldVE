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
        'AppController',
        'AuthWindowController',
        'DashboardPanelController',
        'HeaderPanelController',
        'MainPanelController',
        'PartLibraryController',
        'ProjectController',
        //'SelectWindowController',
        //'SequenceController',
        'HeaderPanelController',
        //'VectorPanelController',
        'VectorEditor.SimulateDigestionController',
        'VectorEditor.ImportSequenceController',
        'VectorEditor.CreateNewFeatureWindowController',
        'VectorEditor.EditSequenceFeatureWindowController',
        'VectorEditor.PieContextMenuController',
        'VectorEditor.RestrictionEnzymeController',
        'VectorEditor.SaveAsWindowController',
        'AuthWindowController',
        'DeviceEditor.DeviceEditorPanelController',
        'DeviceEditor.GridController',
        'DeviceEditor.InspectorController',
        'DeviceEditor.J5Controller',
        'DeviceEditor.MainMenuController',
        'DeviceEditor.MainToolbarController',
        'VectorEditor.ActionStackController',
        'VectorEditor.AnnotatePanelController',
        'VectorEditor.CreateNewFeatureWindowController',
        'VectorEditor.EditSequenceFeatureWindowController',
        'VectorEditor.FindPanelController',
        'VectorEditor.ImportSequenceController',
        'VectorEditor.MainMenuController',
        'VectorEditor.MainToolbarController',
        'VectorEditor.PieController',
        'VectorEditor.RailController',
        'VectorEditor.SelectWindowController',
        'VectorEditor.SequenceController',
        'VectorEditor.SequenceEditingController',
        'VectorEditor.SimulateDigestionController',
        'VectorEditor.StatusBarController',
        'VectorEditor.VectorPanelController',
        'Vede.controller.AuthEventDispatcherController',
        'Vede.controller.J5ReportController',
        'Vede.controller.DeviceEditor.ChangePartDefinitionController'
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

        //if (document.location.href.split('?').length > 0 && Ext.Object.fromQueryString(document.location.href.split('?')[1]).autoauth === "false") Vede.application.autoCredentialsFetch = false;
        if (document.location.href.split('?').length > 1 && Ext.Object.fromQueryString(document.location.href.split('?')[1]).authurl)
            {
                Vede.application.autoCredentialsFetch = true;
                Teselagen.manager.AuthenticationManager.autoAuthURL = Ext.Object.fromQueryString(document.location.href.split('?')[1]).authurl;
            }


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
