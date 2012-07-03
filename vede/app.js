Ext.Loader.setConfig({
    enabled: true,
    paths: {
        Ext: '.',
        Teselagen: './app/teselagen',
        'Teselagen.bio':'../biojs/src/teselagen/bio'
    }
});

Ext.application({
    views: [
        'AppViewport',
        'FileImportWindow'
    ],
    autoCreateViewport: true,
    name: 'MyApp',
    controllers: [
        'AnnotatePanelController',
        'MainMenuController',
        'MainToolbarController',
        'VectorPanelController'
    ]
});
