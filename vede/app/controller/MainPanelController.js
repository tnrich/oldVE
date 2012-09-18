/**
 * @class Vede.controller.MainPanelController
 * Controller for Main Panel
 */
Ext.define("Vede.controller.MainPanelController", {
    extend: "Ext.app.Controller",

    deMainMenuBar: null,
    deMainToolBar: null,
    veMainMenuBar: null,
    veMainToolBar: null,
    
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
        // Todo: Match with ComponentQuery.is() instead of id after views are given xtypes
        if (pNewcard.id.indexOf("VectorEditor") === 0) {
            Ext.getCmp("DeviceEditorMainMenuBar").hide();
            Ext.getCmp("DeviceEditorMainToolBar").hide();
            Ext.getCmp("VectorEditorMainMenuBar").show();
            Ext.getCmp("VectorEditorMainToolBar").show();
        }
        else if (pNewcard.id.indexOf("DeviceEditor") === 0) {
            Ext.getCmp("VectorEditorMainMenuBar").hide();
            Ext.getCmp("VectorEditorMainToolBar").hide();
            Ext.getCmp("DeviceEditorMainMenuBar").show();
            Ext.getCmp("DeviceEditorMainToolBar").show();
        }
    }

});
