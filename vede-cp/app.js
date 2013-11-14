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
    }
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
        'ProjectExplorerController',
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
        'VectorEditor.PropertiesWindowController',
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
    /*
    errorHandler: function(err) {
        console.warn(err);
        return true;
    },
    */
    requires: [
        "Teselagen.event.AuthenticationEvent",
        "Teselagen.manager.AuthenticationManager",

        // Stuff that may not be wise to put here
        "Teselagen.constants.Constants",
        "Teselagen.constants.SBOLIcons",
        "Teselagen.models.SequenceFile",
        "Teselagen.manager.SessionManager",
        "Teselagen.manager.ProjectManager"
    ],

    init: function(){
        Teselagen.manager.SessionManager.maskApp();
    },

    launch: function() {

        Vede.application = this;

        Ext.Ajax.cors = true; // Allow CORS (Cross-Origin Resource Sharing)
        Ext.Ajax.withCredentials = true; // Allow cross-domain cookie-based authentication
        Ext.Ajax.timeout = 5000; // Ajax timeout
        Ext.Error.notify = false; // prevent ie6 and ie7 popup
        Ext.Error.handle = this.errorHandler; // handle errors raised by Ext.Error

        /*
        Vede.application.autoCredentialsFetch = true;

        //if (document.location.href.split('?').length > 0 && Ext.Object.fromQueryString(document.location.href.split('?')[1]).autoauth === "false") Vede.application.autoCredentialsFetch = false;
        if (document.location.href.split('?').length > 1 && Ext.Object.fromQueryString(document.location.href.split('?')[1]).authurl)
            {
                Vede.application.autoCredentialsFetch = true;
                Teselagen.manager.AuthenticationManager.autoAuthURL = Ext.Object.fromQueryString(document.location.href.split('?')[1]).authurl;
            }
        */

        var params = Ext.urlDecode(location.search.substring(1));
        if(params && params.host) Vede.application.paramsHost = params.host;


        Teselagen.manager.AuthenticationManager.Login(); // Start Authentication process

        var self = this;

        // Task to fadeOut the splashscreen
        var task = new Ext.util.DelayedTask(function() {
            Teselagen.manager.SessionManager.unmaskApp();
            Teselagen.manager.ProjectManager.loadUser(function(){
                Teselagen.manager.TasksMonitor.bootMonitoring();
            });
        });

        // After logged in execute task to fadeOut the splashscreen
        this.on(Teselagen.event.AuthenticationEvent.LOGGED_IN, function(){
            Teselagen.manager.ProjectExplorerManager.load();
            task.delay(500);
        });        

    }
});
