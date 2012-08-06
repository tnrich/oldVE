/**
 * @class Vede.view.pie.Caret
 * Selection line for circular DNA drawing
 */
Ext.define("Vede.view.pie.Caret", {
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
        var config = {
            type: 'path',
            path: 'M 10 10 L 100 100',
            stroke: this.self.CARET_COLOR
        }
    	Ext.merge(config, pConfig);
    	this.callParent([config]);
    }
});
