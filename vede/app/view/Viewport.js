Ext.define('Vede.view.Viewport', {
    extend: 'Vede.view.AppViewport',
    renderTo: Ext.getBody(),
    requires: [
        'Vede.view.AppViewport',
        'Vede.view.FileImportWindow'    ]
});