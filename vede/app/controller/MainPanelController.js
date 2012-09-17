/**
 * @class Vede.controller.MainPanelController
 * Controller for Main Panel
 */
Ext.define("Vede.controller.MainPanelController", {
    extend: "Ext.app.Controller",

    /**
     * @member Vede.controller.MainPanelController
     */
    init: function() {
        this.control({
            "#MainPanel" : {
                tabchange : this.onTabChange
            }
        });
    },
    
    onLaunch: function() {
    },

    onTabChange: function(pTabpanel, pNewcard) {
        if (pNewcard.id.indexOf("VectorEditor") === 0) {
            Ext.getCmp("DeviceEditorMainMenuBar").hide();
            Ext.getCmp("DeviceEditorMainToolBar").hide();
            Ext.getCmp("VectorEditorMainMenuBar").show();
            Ext.getCmp("VectorEditorMainToolBar").show();
        }
        if (pNewcard.id.indexOf("DeviceEditor") === 0) {
            Ext.getCmp("VectorEditorMainMenuBar").hide();
            Ext.getCmp("VectorEditorMainToolBar").hide();
            Ext.getCmp("DeviceEditorMainMenuBar").show();
            Ext.getCmp("DeviceEditorMainToolBar").show();
        }
    }

});
