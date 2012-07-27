/**
 * @class Vede.controller.PieController
 * Controller for Pie drawing.
 */
Ext.define('Vede.controller.PieController', {
    extend: 'Ext.app.Controller',

    pieManager: null,

    /**
     * @member Vede.controller.PieController
     */
    init: function() {
        this.control({
            "#Pie" : {
                click : this.onClickPie
            }
        });
    },
    
    onLaunch: function() {
        var pieContainer, pie;
        this.pieManager = Ext.create("Teselagen.manager.PieManager");
        pieContainer = Ext.getCmp('PieContainer');
        pie = this.pieManager.getPie();
        pieContainer.add(pie);
        this.pieManager.initPie();
    },

    onClickPie: function(pEvt, pOpts) {
        var el = this.pieManager.getPie().surface.el;
        var relEvtX = pEvt.getX()-el.getLeft();
        var relEvtY = pEvt.getY()-el.getTop();
        console.log(relEvtX, relEvtY);
    }

});
