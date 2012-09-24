Ext.define('Vesa.controller.override.VectorPanelController', {
    requires: 'Vesa.controller.VectorPanelController'
}, function() {
    Ext.override(Vesa.controller.VectorPanelController, {
        extend: "Ext.app.Controller",

        isRendered: false,
        
        /**
         * @member Vesa.controller.VectorPanelController
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
                Vesa.application.getController("PieController").initPie();
                Vesa.application.getController("RailController").initRail();
                this.isRendered = true;
            }
        },
    
        onResize: function() {
    //        console.log("resize");
        }

    });
});