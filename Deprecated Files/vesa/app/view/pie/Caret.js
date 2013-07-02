/**
 * @class Vesa.view.pie.Caret
 * Selection line for circular DNA drawing
 */
Ext.define("Vesa.view.pie.Caret", {
    extend: "Ext.draw.Sprite",
    config: {
    	angle: null,
    	center: null,
    	radius: null
    },
    statics: {
    	CARET_COLOR : 'black',
    	CARET_WIDTH : 1
    },
    constructor: function(pConfig) {
        this.initConfig(pConfig);

        var x = pConfig.radius * Math.cos(pConfig.angle - Math.PI / 2) + 
                pConfig.center.x;
        var y = pConfig.radius * Math.sin(pConfig.angle - Math.PI / 2) + 
                pConfig.center.y;

        var config = {
            type: 'path',
            path: 'M' + pConfig.center.x + ' ' + pConfig.center.y + 
                  'L' + x + ' ' + y,
            stroke: pConfig.stroke || this.self.CARET_COLOR
        }
    	this.callParent([config]);
    },
});
