Ext.define('Vede.controller.AnnotatePanelController', {
    extend: 'Ext.app.Controller',

    onLaunch: function() {
        var ap = Ext.getCmp('AnnotatePanel');
        var box = Ext.create('Ext.draw.Sprite',{
            type: 'rectangle',
            fill: '#79BB3F',
            height: 20,
            width: 20,
            x: 100,
            y: 100
        });

        var drawComponent = Ext.create('Ext.draw.Component', {
            items: [box]
        });
        //ap.add(drawComponent);
    }
});