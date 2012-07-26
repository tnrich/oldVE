/**
 * @class Vede.view.pie.Pie
 * Circular DNA drawing
 */
Ext.define('Vede.view.pie.Pie', {
    extend: 'Ext.draw.Component',
    constructor: function() {
        this.callParent();
        var pie = Ext.create('Ext.draw.Sprite',{
            type: 'circle',
            fill: '#79BB3F',
            radius: 100,
            x: 100,
            y: 100,
        });
        var caret = Ext.create('Ext.draw.Sprite',{
            type: 'path',
            path: 'M 10 10 L 100 100',
            stroke: 'black',
        });
        this.surface.add(pie);
//        this.surface.add(pie, caret);
    }
});