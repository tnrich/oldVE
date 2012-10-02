/**
 * @class Vesa.view.rail.Rail
 * Linear DNA drawing
 */
Ext.define('Vesa.view.rail.Rail', {
    extend: 'Ext.draw.Component',
    constructor: function(pConfig) {
        this.callParent([pConfig]);
        this.id = "Rail";
    }
});