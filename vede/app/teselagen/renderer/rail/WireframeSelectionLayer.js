/**
 * @class Teselagen.renderer.rail.WireframeSelectionLayer
 * Renders the hollow selection region which appears when no feature is selected
 * yet.
 * @author Nick Elsbree
 * @author Zinovii Dmytriv (original author of WireframeSelectionLayer.as)
 */
Ext.define("Teselagen.renderer.rail.WireframeSelectionLayer", {
    extend: "Teselagen.renderer.rail.Layer",

    statics: {
        FRAME_COLOR: "#808080",
        WIREFRAME_OFFSET: 5 // Distance of wireframe from rail edge.
    },

    drawSelectionRail: function(fromIndex, endIndex) {
        var seqLen = this.sequenceManager.getSequence().toString().length;
        if(seqLen == 0 || (this.start == fromIndex && this.end == endIndex) ||
           fromIndex == endIndex) {

            return;
        }

        var startAngle = fromIndex / seqLen;
        var endAngle = endIndex  / seqLen;

        var wireHeight = this.reference.y + this.self.WIREFRAME_OFFSET;

        // Adjust endangle and startangle to be relative to startangle so we
        // can use the same logic as in GraphicUtils to determine SVG arc flags.

        var startPoint = startAngle * this.railWidth;
        var endPoint = endAngle * this.railWidth;
        
        var wireWidth = (startAngle-endAngle) * this.railWidth;

        this.selectionSprite = Ext.create("Ext.draw.Sprite", {
            type: "path",
            path: "M" + startPoint + " " + wireHeight + 
                  "L" + endPoint + " " + wireHeight + 
                  "L" + endPoint  + " " + (-wireHeight) + 
                  "L" + startPoint  + " " + (-wireHeight) +
                  "L" + startPoint  + " " + wireHeight,
            stroke: this.self.FRAME_COLOR,
            "stroke-opacity": this.self.STROKE_OPACITY,
        });
    }
});
