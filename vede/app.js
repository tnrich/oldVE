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
        'AnnotatePanelController',
        'MainMenuController',
        'MainToolbarController',
        'VectorPanelController'
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

// Handle errors that are not thrown using Ext.Error
window.onerror = function(pMsg) {
    console.error(pMsg);
    return true;
}
