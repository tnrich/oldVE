Ext.define('MyApp.view.Viewport', {
    extend: 'MyApp.view.AppViewport',
    renderTo: Ext.getBody(),
    requires: [
        'MyApp.view.AppViewport',
        'MyApp.view.FileImportWindow'
    ]
});