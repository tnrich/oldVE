/*
 * File: app.js
 *
 * This file was generated by Sencha Architect version 2.1.0.
 * http://www.sencha.com/products/architect/
 *
 * This file requires use of the Ext JS 4.0.x library, under independent license.
 * License of Sencha Architect does not include license for Ext JS 4.0.x. For more
 * details see http://www.sencha.com/license or contact license@sencha.com.
 *
 * This file will be auto-generated each and everytime you save your project.
 *
 * Do NOT hand edit this file.
 */

Ext.Loader.setConfig({
    enabled: true,
    paths: {
        Ext: '.',
        'Ext.ux': '../extjs/examples/ux',
        Teselagen: './app/teselagen',
        'Teselagen.bio': '../biojs/src/teselagen/bio'
    }
});

Ext.application({

    requires: [
        'Vesa.view.override.RestrictionEnzymesManagerWindow',
        'Vesa.view.override.SimulateDigestionWindow'
    ],
    views: [
        'AppViewport',
        'FileImportWindow',
        'SimulateDigestionWindow',
        'RestrictionEnzymesManagerWindow'
    ],
    autoCreateViewport: true,
    name: 'Vesa',
    controllers: [
        'MainToolbarController',
        'MainMenuController',
        'VectorPanelController',
        'AppTabController',
        'ActionStackController',
        'AppController',
        'MainPanelController',
        'PieController',
        'RailController',
        'SequenceController',
        'RestrictionEnzymeController',
        'AnnotatePanelController',
        'SimulateDigestionController'
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
