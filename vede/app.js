
// Loading Mask
var myMask;
Ext.onReady(function() {
myMask = new Ext.LoadMask(Ext.getBody(), {msg:"Please wait..."});
myMask.show();
});

Ext.Loader.setConfig({
    enabled: true,
    paths: {
        Ext: '.',
        'Ext.ux': '../extjs/examples/ux',
        Teselagen: './app/teselagen',
        'Teselagen.bio':'../biojs/src/teselagen/bio'
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
        /*
        'AppController',
        'AnnotatePanelController',
        'MainMenuController',
        'MainToolbarController',
        'PieController',
        'RailController',
        'RestrictionEnzymeController',
        'SequenceController',
        'VectorPanelController',
        'SimulateDigestionController'
        */
        
        'Vede.controller.DeviceEditor.MainMenuController',
        'Vede.controller.DeviceEditor.MainToolbarController',
        'Vede.controller.DeviceEditor.DeviceEditorPanelController'
        
    ],
    errorHandler: function(err) {
        console.warn(err);
        return true;
    },
    launch: function() {
        Ext.Error.notify = false; // prevent ie6 and ie7 popup
        Ext.Error.handle = this.errorHandler; // handle errors raised by Ext.Error
    }
});
