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
            '#PieContainer' : {
                click : this.onClickPie
            }
        })
    },
    
    onLaunch: function() {
        var pc = Ext.getCmp('PieContainer');
        var pie = Ext.create('Ext.draw.Sprite',{
            type: 'circle',
            fill: '#79BB3F',
            radius: 100,
            x: 100,
            y: 100,
            listeners: {
                click: this.onClickPie
            }
        });
        var caret = Ext.create('Ext.draw.Sprite',{
            type: 'path',
            path: 'M 10 10 L 100 100',
            stroke: 'black',
            listeners: {
                click: this.onClickPie
            }
        });
        drawComponent = Ext.create('Ext.draw.Component', {
            items: [pie, caret]
        });
        pc.add(drawComponent);
    },

    onClickPie: function(pT, pE, pOpts) {
        var el = pT.surface.el;
        var relEvtX = pE.getX()-el.getLeft();
        var relEvtY = pE.getY()-el.getTop();
        console.log(relEvtX, relEvtY);
        console.log(pT.x, pT.y);
    }

});
