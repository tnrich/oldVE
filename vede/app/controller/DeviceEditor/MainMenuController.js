/**
 * Main menu controller
 * @class Vede.controller.DeviceEditor.MainMenuController
 */
Ext.define('Vede.controller.DeviceEditor.MainMenuController', {
    extend: 'Ext.app.Controller',

    onNewDesignClick: function(button, e, options) {
        Teselagen.manager.ProjectManager.createNewDeviceEditorProject();
    },
    onOpenDEProjectClick: function(button, e, options) {

    },
    onSaveDesignClick: function(button, e, options) {

    },

    init: function() {
        this.control({
            'button[cls="newDesign"]': {
                click: this.onNewDesignClick
            },
            "#openDEProject": {
                click: this.onOpenDEProjectClick
            },
            "#saveDesign": {
                click: this.onSaveDesignClick
            }
        });

    }

});
