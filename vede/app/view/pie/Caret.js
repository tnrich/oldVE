/**
 * @class Vede.view.pie.Caret
 * Selection line for circular DNA drawing
 */
Ext.define('Vede.view.pie.Caret', {
    extend: 'Ext.draw.Sprite',
    constructor: function() {
        this.callParent([{
            type: 'path',
            path: 'M 10 10 L 100 100',
            stroke: 'black',
        }]);
    }
});
