/**
 * @class Vede.view.rail.Frame
 * Base of circular DNA drawing
 */
Ext.define('Vede.view.rail.Frame', {
    statics: {
        RECT_REFERENCE: {x: 0, y: 0},
        RECT_HEIGHT: 3,
        RECT_GAP: 3,
        OUTLINE_WIDTH: 0.5,
        OUTLINE_COLOR: "#dddddd",
        RING_COLOR: "#ffffb3" // The color of the area between the two circles.
    },

    constructor: function(inData) {
        var reference = this.self.RECT_REFERENCE;
        var railWidth = this.self.RECT_WIDTH;
        var railHeight = this.self.RECT_HEIGHT;
        var railGap = this.self.RECT_GAP;
        
        return inData.rail.append("svg:rect")
                          .attr("x", reference.x)
                          .attr("y", reference.y)
                          .attr("width", inData.railWidth)
                          .attr("height", this.self.RECT_HEIGHT)
                          .attr("stroke", this.self.OUTLINE_COLOR)
                          .attr("stroke-width", this.self.OUTLINE_WIDTH)
                          .attr("fill", this.self.RING_COLOR)
                          .attr("fill-rule", "evenodd");
    }
});
