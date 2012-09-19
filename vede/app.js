/*global console*/
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
        'ActionStackController',
        'AppController',
        'AnnotatePanelController',
        'MainMenuController',
        'MainPanelController',
        'MainToolbarController',
        'PieController',
//        'RailController',
        'RestrictionEnzymeController',
        'SelectWindowController',
        'SequenceController',
        'VectorPanelController',
        'SimulateDigestionController',
        'DeviceEditor.MainMenuController',
        'DeviceEditor.MainToolbarController',
        'DeviceEditor.DeviceEditorPanelController'
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

