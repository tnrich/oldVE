/**
 * @class Vede.view.rail.Caret
 * Selection line for circular DNA drawing
 */
Ext.define("Vede.view.rail.Caret", {
    config: {
        rail: null,
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

        var path = 'M' + x + ' ' + (-y) + 'L' + x + ' ' + y;

        return pConfig.rail.append("svg:path")
                           .attr("class", "railCaret")
                           .attr("stroke", this.self.CARET_COLOR)
                           .attr("d", path);
    }
});
