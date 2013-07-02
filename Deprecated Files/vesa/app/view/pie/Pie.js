/**
 * @class Vesa.view.pie.Pie
 * Circular DNA drawing
 */
Ext.define('Vesa.view.pie.Pie', {
    extend: 'Ext.draw.Component',
    xtype: "Vesa-pie",
    constructor: function(pConfig) {
        this.callParent([pConfig]);
        this.id = "Pie";
    }
});