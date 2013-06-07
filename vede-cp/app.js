var splashscreen;

/*global console*/
Ext.Loader.setConfig({
    enabled: true,
    paths: {
        Ext: '.',
        'Ext.ux': '../extjs/examples/ux',
        Teselagen: './app/teselagen',
        Vede: './app',
        'Teselagen.bio': '../biojs/src/teselagen/bio'
    }
});

/*Ext.Loader.syncRequire([
        //Sync requires
        'Ext.Error'
        ,'Teselagen.constants.Constants'
        ,'Teselagen.bio.sequence.symbols.GapSymbol'
        ,'Teselagen.bio.sequence.symbols.NucleotideSymbol'
        ,'Teselagen.bio.sequence.symbols.AminoAcidSymbol'
        ,'Ext.layout.container.Border'
        ,'Ext.toolbar.Spacer'
        ,'Ext.tree.Panel'
        ,'Ext.toolbar.TextItem'
        ,'Ext.form.field.ComboBox'
        ,'Ext.layout.container.Column'
        ,'Ext.form.Panel'
        ,'Ext.form.RadioGroup'
        ,'Ext.form.field.Radio'
        ,'Ext.grid.Panel'
        ,'Ext.grid.plugin.RowEditing'
        ,'Ext.grid.column.Number'
        ,'Ext.grid.column.Boolean'
        ,'Ext.form.Label'
        ,'Ext.button.Split'
        ,'Ext.grid.column.Date'
        ,'Ext.form.FieldSet'
        ,'Teselagen.manager.ActionStackManager'
        ,'Teselagen.models.RestrictionEnzymeGroup'
        ,'Teselagen.event.MapperEvent'
        ,'Teselagen.manager.ORFManager'
        ,'Teselagen.manager.RestrictionEnzymeManager'
        ,'Teselagen.manager.SequenceAnnotationManager'
        ,'Teselagen.renderer.annotate.LineRenderer'
        ,'Teselagen.manager.RowManager'
        ,'Vede.view.annotate.Annotator'
        ,'Teselagen.renderer.annotate.SequenceRenderer'
        ,'Vede.view.annotate.Caret'
        ,'Teselagen.renderer.annotate.SelectionLayer'
        ,'Teselagen.manager.FindManager'
        ,'Teselagen.manager.PieManager'
        ,'Vede.view.pie.Frame'
        ,'Vede.view.pie.Pie'
        ,'Teselagen.renderer.pie.CutSiteRenderer'
        ,'Teselagen.renderer.pie.FeatureRenderer'
        ,'Teselagen.renderer.pie.ORFRenderer'
        ,'Teselagen.renderer.pie.WireframeSelectionLayer'
        ,'Teselagen.renderer.pie.SelectionLayer'
        ,'Teselagen.manager.RailManager'
        ,'Vede.view.rail.Frame'
        ,'Vede.view.rail.Rail'
        ,'Teselagen.renderer.rail.CutSiteRenderer'
        ,'Teselagen.renderer.rail.FeatureRenderer'
        ,'Teselagen.renderer.rail.ORFRenderer'
        ,'Teselagen.renderer.rail.WireframeSelectionLayer'
        ,'Teselagen.renderer.rail.SelectionLayer'
        ,'Teselagen.manager.AAManager'
]);
*/
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
        'HeaderPanelController',
        'VectorPanelController',
        'SimulateDigestionController',
        'VectorEditor.ImportSequenceWindowController',
        'Vede.controller.AuthWindowController',
        'DeviceEditor.GridController',
        'DeviceEditor.InspectorController',
        'DeviceEditor.J5Controller',
        'DeviceEditor.MainMenuController',
        'DeviceEditor.MainToolbarController',
        'DeviceEditor.DeviceEditorPanelController',
        'Vede.controller.AuthEventDispatcherController',
        'ProjectController',
        'DashboardPanelController',
        'Vede.controller.VectorEditor.SequenceEditingController',
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

        Ext.Ajax.cors = true; // Allow CORS
        Ext.Ajax.withCredentials = true;
        Ext.Ajax.timeout = 100000;
        Ext.Error.notify = false; // prevent ie6 and ie7 popup
        Ext.Error.handle = this.errorHandler; // handle errors raised by Ext.Error

        Teselagen.manager.AuthenticationManager.Login(); // Start Auth process

        var self = this;

        // Setup a task to fadeOut the splashscreen
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

        this.on(Teselagen.event.AuthenticationEvent.LOGGED_IN, function(){task.delay(1500);});

    }
});
