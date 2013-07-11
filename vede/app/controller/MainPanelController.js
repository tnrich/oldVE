/**
 * @class Vede.controller.MainPanelController
 * Controller for Main Panel
 */
Ext.define("Vede.controller.MainPanelController", {
    extend: "Ext.app.Controller",

    requires: ["Teselagen.event.SequenceManagerEvent"],
    
    oldTab: null,
    refs: [
        {ref: "deMainMenuBar", selector:"#DeviceEditorMainMenuBar"},
        {ref: "deMainToolBar", selector:"#DeviceEditorMainToolBar"},
        {ref: "veMainMenuBar", selector:"#VectorEditorMainMenuBar"},
        {ref: "veMainToolBar", selector:"#VectorEditorMainToolBar"}
    ],
    
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
            this.getDeMainMenuBar().hide();
            this.getDeMainToolBar().hide();
            this.getVeMainMenuBar().show();
            this.getVeMainToolBar().show();

            this.application.fireEvent(Teselagen.event.SequenceManagerEvent.SEQUENCE_MANAGER_CHANGED, pNewcard.model);
        }
        else if (pNewcard.id.indexOf("DeviceEditor") === 0) {
        	this.getVeMainMenuBar().hide();
            this.getVeMainToolBar().hide();
            this.getDeMainMenuBar().show();
            this.getDeMainToolBar().show();
        }
    }
});






