/**
 * Main menu controller
 * @class Vede.controller.DeviceEditor.MainMenuController
 */
Ext.define("Vede.controller.DeviceEditor.MainMenuController", {
    extend: "Ext.app.Controller",
    requires: ["Teselagen.event.DeviceEvent",
        "Teselagen.manager.DeviceDesignExporterManager"
    ],

    onExportToJSONClick: function () {
        var currentTab = Ext.getCmp("mainAppPanel").getActiveTab();
        Teselagen.manager.DeviceDesignExporterManager.exportToJSON(currentTab.model);
    },

    onExportToXMLClick: function () {
        var currentTab = Ext.getCmp("mainAppPanel").getActiveTab();
        Teselagen.manager.DeviceDesignExporterManager.exportToXML(currentTab.model);
    },

    onNewDesignClick: function() {
        Teselagen.manager.ProjectManager.createNewDeviceEditorProject();
    },
//    onOpenDEProjectClick: function() {
//
//    },
//    onSaveDesignClick: function() {
//
//    },
    init: function() {
        this.control({
            "button[cls='newDesign']": {
                click: this.onNewDesignClick
            },
//            "#openDEProject": {
//                click: this.onOpenDEProjectClick
//            },
//            "#saveDesign": {
//                click: this.onSaveDesignClick
//            },
            "button[cls='exportMenu'] > menu > menuitem[text='JSON file']": {
                click: this.onExportToJSONClick
            },
            "button[cls='exportMenu'] > menu > menuitem[text='XML file']": {
                click: this.onExportToXMLClick
            },
        });

    }

});