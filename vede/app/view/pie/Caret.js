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
        this.initConfig(pConfig);

        var x = this.radius * Math.cos(this.angle - Math.PI / 2) + this.center.x;
        var y = this.radius * Math.sin(this.angle - Math.PI / 2) + this.center.y;

        var config = {
            type: 'path',
            path: 'M' + this.center.x + ' ' + this.center.y + 
                  'L' + x + ' ' + y,
            stroke: this.self.CARET_COLOR
        }
    	this.callParent([config]);
    },
});
