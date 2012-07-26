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
            '#PieContainer' : {
                click : this.onClickPie
            }
        });
    },
    
    onLaunch: function() {
        this.pieManager = Ext.create("Teselagen.manager.PieManager");
        var pc = Ext.getCmp('PieContainer');
        //pc.add(this.pieManager.getPie());
        //this.pieManager.initPie();
    },

    onClickPie: function(pT, pE, pOpts) {
        var el = pT.surface.el;
        var relEvtX = pE.getX()-el.getLeft();
        var relEvtY = pE.getY()-el.getTop();
        console.log(relEvtX, relEvtY);
        console.log(pT.x, pT.y);
    }

});
