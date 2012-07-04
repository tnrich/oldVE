Ext.define('Vede.controller.AnnotatePanelController', {
    extend: 'Ext.app.Controller',

    onLaunch: function() {
        var ap = Ext.getCmp('AnnotatePanel');
        var box = Ext.create('Ext.draw.Sprite',{
            type: 'rect',
            fill: '#79BB3F',
            height: 20,
            width: 30,
            x: 0,
            y: 0,
            listeners: {
                mouseover: this.onMouseoverBox
            }
        });

        var drawComponent = Ext.create('Ext.draw.Component', {
            items: [box]
        });
        ap.add(drawComponent);
    },
    onMouseoverBox: function onMouseoverBox() {
        console.log('Mouseover');
        console.log(this);
    }
});