Ext.require('Ext.app.Application');

var application = null;
Ext.onReady(function() {
    application = Ext.create('Ext.app.Application', {
        name: 'Vede',
        appFolder: '../app',
        
        controllers: [
            'AppController'
        ],

        launch: function() {
        }
    });
});