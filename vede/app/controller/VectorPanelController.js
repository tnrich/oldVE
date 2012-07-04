Ext.define('Vede.controller.VectorPanelController', {
    extend: 'Ext.app.Controller',

    init: function() {
        this.control({
            '#ViewPanel' : {
                click : this.onClickPie
            }
        })
    },
    
    onLaunch: function() {
        var vp = Ext.getCmp('VectorPanel');
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
        var drawComponent = Ext.create('Ext.draw.Component', {
            items: [pie, caret]
        });
        vp.add(drawComponent);
    },

    onClickPie: function() {
        console.log('Click');
    }

});
