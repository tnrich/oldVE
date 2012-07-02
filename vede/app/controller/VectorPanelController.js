Ext.define('MyApp.controller.VectorPanelController', {
    extend: 'Ext.app.Controller',

    onLaunch: function() {
        var vp = Ext.getCmp("VectorPanel");
        var drawComponent = Ext.create('Ext.draw.Component', {
            items: [{
                type: 'circle',
                fill: '#79BB3F',
                radius: 100,
                x: 100,
                y: 100
            }, {
                type: 'path',
                path: 'M 0 0 L 100 100',
                stroke: 'black' 
            }]
        });
        vp.add(drawComponent);
        //drawComponent.surface.add({
        //    type: 'path',
        //    path: 'M 10 10 L 100 100'
        //});
        //drawComponent.surface.redraw();
    }

});
