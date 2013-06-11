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

    deselect: function() {
        this.callParent();

        d3.selectAll(".pieWireframeElement").remove();
    },

    drawSelectionRail: function(fromIndex, endIndex) {
        var path;
        var seqLen = this.sequenceManager.getSequence().toString().length;

        if(seqLen == 0 || (this.start == fromIndex && this.end == endIndex) ||
           fromIndex == endIndex) {

            return;
        }

        d3.selectAll(".railWireframeElement").remove();

        var startAngle = fromIndex / seqLen;
        var endAngle = endIndex  / seqLen;

        var wireHeight = this.reference.y + this.self.WIREFRAME_OFFSET;

        // Adjust endangle and startangle to be relative to startangle so we
        // can use the same logic as in GraphicUtils to determine SVG arc flags.

        var startPoint = startAngle * this.railWidth;
        var endPoint = endAngle * this.railWidth;
        
        var wireWidth = (startAngle-endAngle) * this.railWidth;

        if (endPoint < startPoint) {
            path = "M 0" + " " + wireHeight + 
                   "L" + endPoint + " " + wireHeight + 
                   "L" + endPoint  + " " + (-wireHeight) + 
                   "L 0" +  " " + (-wireHeight) +
                   "L 0" + " " + (wireHeight) +
                   "M" + startPoint + " " + wireHeight +
                   "L" + this.railWidth + " " + (wireHeight) +
                   "L" + this.railWidth  + " " + (-wireHeight) +
                   "L" + startPoint  + " " + (-wireHeight) +
                   "L" + startPoint + " " + wireHeight;
        } else {
            path = "M" + startPoint + " " + wireHeight + 
                   "L" + endPoint + " " + wireHeight + 
                   "L" + endPoint  + " " + (-wireHeight) + 
                   "L" + startPoint  + " " + (-wireHeight) +
                   "L" + startPoint  + " " + wireHeight;
        }

        this.selectionSVG.append("svg:path")
                         .attr("class", "railWireframeElement")
                         .attr("stroke", this.self.FRAME_COLOR)
                         .attr("stroke-opacity", this.self.STROKE_OPACITY)
                         .attr("fill", "none")
                         .attr("d", path);
    }
});
