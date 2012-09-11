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
        'AppController',
        'AnnotatePanelController',
        'MainMenuController',
        'MainToolbarController',
        'PieController',
        'RailController',
        'RestrictionEnzymeController',
//        'SelectWindowController',
        'SequenceController',
        'VectorPanelController',
        'SimulateDigestionController'
    ],
    errorHandler: function(err) {
        console.warn(err);
        return true;
    },
    launch: function() {
        Ext.Error.notify = false; // prevent ie6 and ie7 popup
        Ext.Error.handle = this.errorHandler; // handle errors raised by Ext.Error
    },
});

