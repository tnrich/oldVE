/**
 * @class Vede.controller.PieController
 * Controller for Pie drawing.
 */
Ext.define('Vede.controller.PieController', {
    extend: 'Ext.app.Controller',

    drawComponent: null,
    
    /**
     * @member Vede.controller.PieController
     */
    init: function() {
        this.control({
//            '#ViewPanel' : {
//                click : this.onClickPie
//            }
//        })
    },
    
    onLaunch: function() {
    },

//    onClickPie: function(pT, pE, pOpts) {
//        var el = pT.surface.el;
//        var relEvtX = pE.getX()-el.getLeft();
//        var relEvtY = pE.getY()-el.getTop();
//        console.log(relEvtX, relEvtY);
//        console.log(pT.x, pT.y);
//    }

});
