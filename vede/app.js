Ext.Loader.setConfig({
    enabled: true,
    paths: {
        Ext: '.',
        Teselagen: './app/teselagen'
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
        'MainMenuController',
        'MainToolbarController',
        'VectorPanelController'
    ]
});
