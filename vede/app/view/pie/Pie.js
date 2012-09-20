/**
 * @class Vede.view.pie.Pie
 * Circular DNA drawing
 */
Ext.define('Vede.view.pie.Pie', {
    extend: 'Ext.draw.Component',
    xtype: "vede-pie",
    constructor: function(pConfig) {
        this.callParent([pConfig]);
        this.id = "Pie";
    }
});