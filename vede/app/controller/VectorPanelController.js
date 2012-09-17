/*global Vede*/
/**
 * @class Vede.controller.VectorPanelController
 * Controller for Vector Panel
 */
Ext.define("Vede.controller.VectorPanelController", {
    extend: "Ext.app.Controller",

    isRendered: false,
    
    /**
     * @member Vede.controller.VectorPanelController
     */
    init: function() {
        this.control({
            "#VectorPanel" : {
                afterrender : this.onRender,
                resize : this.onResize
            }
        });
    },
    
    onLaunch: function() {
    },

    onRender: function() {
        if (!this.isRendered) {
//            console.log("render");
            Vede.application.getController("PieController").initPie();
            this.isRendered = true;
        }
    },

    onResize: function() {
//        console.log("resize");
    }

});
