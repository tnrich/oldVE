/**
 * @class Vede.view.pie.Frame
 * Base of circular DNA drawing
 */
Ext.define('Vede.view.pie.Frame', {
    extend: 'Ext.draw.Sprite',
    constructor: function() {
        this.callParent([{
            type: 'circle',
            fill: '#79BB3F',
            radius: 100,
            x: 100,
            y: 100,  
        }]);
    }
});
