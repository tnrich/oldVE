/*
 * File: app/controller/MainMenuController.js
 *
 * This file was generated by Sencha Architect version 2.0.0.
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

Ext.define('Vede.controller.DeviceEditor.MainToolbarController', {
    extend: 'Ext.app.Controller',

    requires: ["Teselagen.event.DeviceEvent"],

    DeviceEvent: null,

    onAddRowClick: function() {
        this.application.fireEvent(this.DeviceEvent.ADD_ROW, null);
    },

    onAddColumnClick: function() {
        this.application.fireEvent(this.DeviceEvent.ADD_COLUMN, null);
    },

    onOpenj5Click: function(button, e, options) {
        Ext.create('Vede.view.de.j5Controls').show();
    },

    onSaveDesignClick: function(button, e, options) {
        console.log('Trying to save design!');
        $(document).trigger('saveDesign');
    },

    init: function() {
        this.control({
            "button[cls='add_row_Btn']": {
                click: this.onAddRowClick
            },
            "button[cls='add_column_Btn']": {
                click: this.onAddColumnClick
            },
            "button[cls='j5_init_Btn']": {
                click: this.onOpenj5Click
            }
        });

        this.DeviceEvent = Teselagen.event.DeviceEvent;
    }
});
