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
        'Teselagen.bio':'../../biojs/src/teselagen/bio'
    }
});

Ext.application({
    views: [
        'GenbankCleanerUtil'
    ],
    autoCreateViewport: true,
    name: 'TeselagenUtils',
    controllers: [
        'TeselagenUtils.controller.GenbankCleanerUtil'
    ],
    require: [
        "TeselagenUtils.manager.gbCleanerManager", 
    ],
    launch: function() {
       Ext.create('TeselagenUtils.view.GenbankCleanerUtil').show();
    }
});
