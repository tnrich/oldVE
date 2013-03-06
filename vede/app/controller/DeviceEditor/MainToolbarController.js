/**
 * Main toolbar controller
 * @class Vede.controller.DeviceEditor.MainToolbarController
 */
Ext.define('Vede.controller.DeviceEditor.MainToolbarController', {
    extend: 'Ext.app.Controller',

    requires: ["Teselagen.event.DeviceEvent",
               "Teselagen.manager.DeviceDesignManager"],

    DeviceDesignManager: null,
    DeviceEvent: null,

    onAddRowClick: function() {
        this.application.fireEvent(this.DeviceEvent.ADD_ROW, null);
    },

    onAddColumnClick: function() {
        this.application.fireEvent(this.DeviceEvent.ADD_COLUMN);
    },

    onOpenj5Click: function(button, e, options) {
        Vede.application.fireEvent("openj5");
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

        this.DeviceDesignManager = Teselagen.manager.DeviceDesignManager;
        this.DeviceEvent = Teselagen.event.DeviceEvent;
    }
});
