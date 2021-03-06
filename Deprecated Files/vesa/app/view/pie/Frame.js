/**
 * @class Vesa.view.pie.Frame
 * Base of circular DNA drawing
 */
Ext.define('Vesa.view.pie.Frame', {
    extend: 'Ext.draw.Sprite',

    statics: {
        CENTER: {x: 100, y: 100},
        OUTER_RADIUS: 100,
        INNER_RADIUS: 97,
        OUTLINE_WIDTH: 0.5,
        OUTLINE_COLOR: "black",
        RING_COLOR: "#ffffb3" // The color of the area between the two circles.
    },

    constructor: function() {
        var center = this.self.CENTER;
        var outerRadius = this.self.OUTER_RADIUS;
        var innerRadius = this.self.INNER_RADIUS;
        var outerStartPoint = {x: center.x - outerRadius, y: center.y};
        var innerStartPoint = {x: center.x - innerRadius, y: center.y};

        // Draw two concentric circles using SVG paths. We use paths instead of
        // two circle sprites so that the frame only needs one sprite.

        // NOTE: It is important that the arcs be drawn in opposite directions
        // (one draws counterclockwise, the other clockwise) to ensure the 
        // fill computes properly. See the SVG documentation on fill-rule for more.
        // Basically, ExtJS doesn't let you set fill-rule, so we can only use the
        // default of "nonzero", while we would like to set it to "evenodd".
        this.callParent([{
            type: "path",
            path: "M" + outerStartPoint.x + " " + outerStartPoint.y + 
                  "A" + outerRadius + " " + outerRadius + " 0 1 1 " + 
                  outerStartPoint.x + " " + (outerStartPoint.y + 0.0001) + 
                  "L" + outerStartPoint.x + " " + outerStartPoint.y + 
                  "M" + innerStartPoint.x + " " + innerStartPoint.y +
                  "A" + innerRadius + " " + innerRadius + " 0 1 0 " +
                  innerStartPoint.x + " " + (innerStartPoint.y - 0.0001),
            stroke: this.self.OUTLINE_COLOR,
            "stroke-width": this.self.OUTLINE_WIDTH,
            fill: this.self.RING_COLOR,
            "fill-rule": "evenodd"
        }]);
    }
});
