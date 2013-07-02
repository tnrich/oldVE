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
        CARET_HEIGHT: 3
    },

    svgObject: null,

    constructor: function(pConfig) {
        this.initConfig(pConfig);
    },

    applyStart: function(pStart) {
        var x = (pStart * this.getRailWidth()) + this.getReference().x;
        var y = this.getReference().y + this.self.CARET_HEIGHT;
        var path = 'M' + x + ' ' + (-y) + 'L' + x + ' ' + y;

        if(this.svgObject) {
            this.svgObject.attr("d", path);
        } else {
            this.svgObject = this.getRail().append("svg:path")
                           .attr("class", "railCaret")
                           .attr("stroke", this.self.CARET_COLOR)
                           .attr("d", path);
        }
        return pStart;
    }
});
