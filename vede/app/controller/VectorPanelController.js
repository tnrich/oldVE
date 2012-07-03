Ext.define('Vede.controller.VectorPanelController', {
    extend: 'Ext.app.Controller',

    onLaunch: function() {
        var vp = Ext.getCmp('VectorPanel');
        var pie = Ext.create('Ext.draw.Sprite',{
            type: 'circle',
            fill: '#79BB3F',
            radius: 100,
            x: 100,
            y: 100
        });
        var caret = Ext.create('Ext.draw.Sprite',{
            type: 'path',
            path: 'M 10 10 L 100 100',
            stroke: 'black',
            listeners: {
                mouseover: this.onMouseoverCaret
            }
        });
        var drawComponent = Ext.create('Ext.draw.Component', {
            items: [pie, caret]
        });
        vp.add(drawComponent);
    },

    onMouseoverCaret: function onMouseoverCaret() {
        console.log('Mouseover');
        console.log(this);
    }

});
