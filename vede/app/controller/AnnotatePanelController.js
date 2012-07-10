Ext.define('Vede.controller.AnnotatePanelController', {
    extend: 'Ext.app.Controller',

    onLaunch: function() {
        var ap = Ext.getCmp('AnnotatePanel');
        var box = Ext.create('Ext.draw.Sprite',{
            type: 'rect',
            fill: '#79BB3F',
            width: 100,
            height: 30,
            x: 10,
            y: 10,
            listeners: {
                //click: this.onClickPie
            }
        });
        
        var drawComponent2 = Ext.create('Ext.draw.Component', {
            items: [box]
        });
        ap.add(drawComponent2);
        console.log(ap);
        
    }

});
