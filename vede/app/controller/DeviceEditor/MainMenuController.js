/**
 * Main menu controller
 * @class Vede.controller.DeviceEditor.MainMenuController
 */
Ext.define("Vede.controller.DeviceEditor.MainMenuController", {
    extend: "Ext.app.Controller",
    requires: ["Teselagen.event.DeviceEvent",
        "Teselagen.manager.DeviceDesignExporterManager"
    ],

    preloadResources: function(cb){
        var model = Ext.getCmp("mainAppPanel").getActiveTab().model;
        
        var finishedPreloadingResources = function(){
            console.log("finished preloading resources");
            return cb(model);
        };


        var countParts = 0;

        model.getJ5Collection().bins().each(function (bin, binKey) {
            bin.parts().each(function (part, partIndex) {
                countParts++;
            });
        });

        model.getJ5Collection().bins().each(function (bin, binKey) {
            bin.parts().each(function (part, partIndex) {
                part.getSequenceFile({
                    callback: function (part) {
                        if(countParts === 1) finishedPreloadingResources();
                        countParts--;
                    }
                });
            });
        });
    },

    onExportToJSONClick: function () {
        this.preloadResources(function(model){
            Teselagen.manager.DeviceDesignExporterManager.exportToJSON(model);
        });
    },

    onExportToXMLClick: function () {
        this.preloadResources(function(model){
            Teselagen.manager.DeviceDesignExporterManager.exportToXML(model);
        });
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