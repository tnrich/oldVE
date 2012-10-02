/**
 * @class Vesa.view.rail.Caret
 * Selection line for circular DNA drawing
 */
Ext.define("Vesa.view.rail.Caret", {
    extend: "Ext.draw.Sprite",
    config: {
        start: null,
        reference: null,
        length: null,
        railWidth:null
    },
    statics: {
        CARET_COLOR : 'black',
        CARET_WIDTH : 1,
        CARET_HEIGHT: 3,
    },
    constructor: function(pConfig) {
        this.initConfig(pConfig);

        var x = (this.start * this.railWidth) + pConfig.reference.x;
        var y = pConfig.reference.y + this.self.CARET_HEIGHT;
        var config = {
            type: 'path',
            path: 'M' + x + ' ' + (-y) + 
            'L' + x + ' ' + y,
            stroke: this.self.CARET_COLOR
        }
        
        this.callParent([config]);
    }
});
