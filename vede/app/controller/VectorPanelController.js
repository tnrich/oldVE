/**
 * @class Vede.controller.VectorPanelController
 * Controller for Vector Panel
 */
Ext.define("Vede.controller.VectorPanelController", {
    extend: "Ext.app.Controller",

    /**
     * @member Vede.controller.VectorPanelController
     */
    init: function() {
        this.control({
            "#VectorPanel" : {
                resize : this.onResize
            }
        });
    },
    
    onLaunch: function() {
    },
    onResize: function() {
        console.log("resize");
    }

});
