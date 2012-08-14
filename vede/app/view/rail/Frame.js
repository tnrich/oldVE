/**
 * @class Vede.view.rail.Frame
 * Base of circular DNA drawing
 */
Ext.define('Vede.view.rail.Frame', {
    extend: 'Ext.draw.Sprite',

    statics: {
        RECT_REFERENCE: {x: 0, y: 0},
        RECT_WIDTH: 300,
        RECT_HEIGHT: 3,
        RECT_GAP: 3,
        OUTLINE_WIDTH: 0.5,
        OUTLINE_COLOR: "#dddddd",
        RING_COLOR: "#ffffb3" // The color of the area between the two circles.
    },

    constructor: function() {
        var reference = this.self.RECT_REFERENCE;
        var railWidth = this.self.RECT_WIDTH;
        var railHeight = this.self.RECT_HEIGHT;
        var railGap = this.self.RECT_GAP;
        
        // Draw two concentric circles using SVG paths. We use paths instead of
        // two circle sprites so that the frame only needs one sprite.

        // NOTE: It is important that the arcs be drawn in opposite directions
        // (one draws counterclockwise, the other clockwise) to ensure the 
        // fill computes properly. See the SVG documentation on fill-rule for more.
        // Basically, ExtJS doesn't let you set fill-rule, so we can only use the
        // default of "nonzero", while we would like to set it to "evenodd".
        this.callParent([{
            type: "rect",
            x: reference.x,
            y: reference.x,
            width: this.self.RECT_WIDTH,
            height: this.self.RECT_HEIGHT,
            stroke: this.self.OUTLINE_COLOR,
            "stroke-width": this.self.OUTLINE_WIDTH,
            fill: this.self.RING_COLOR,
            "fill-rule": "evenodd"
        }]);
    }
});
