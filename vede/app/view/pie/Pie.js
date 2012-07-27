/**
 * @class Vede.view.pie.Pie
 * Circular DNA drawing
 */
Ext.define('Vede.view.pie.Pie', {
    extend: 'Ext.draw.Component',
    constructor: function(pConfig) {
        this.callParent([pConfig]);
        this.id = "Pie";
    }
});