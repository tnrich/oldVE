/**
 * @class Teselagen.renderer.rail.SelectionLayer
 * Renders the shaded regions of a selection.
 * @author Nick Elsbree
 * @author Zinovii Dmytriv (original author of SelectionLayer.as)
 */
Ext.define("Teselagen.renderer.rail.SelectionLayer", {
    extend: "Teselagen.renderer.rail.Layer",

    /**
     * Draws the shaded wedge-shaped selection area.
     */
    drawSelectionRail: function(fromIndex, endIndex) {
        var seqLen = this.sequenceManager.getSequence().toString().length;
        var path;

        if(seqLen == 0) {
            return;
        }

        this.startAngle = fromIndex / seqLen;
        this.endAngle = endIndex / seqLen;
        var wireHeight = this.reference.y + this.self.WIREFRAME_OFFSET;

        // Adjust endangle and startangle to be relative to startangle so we
        // can use the same logic as in GraphicUtils to determine SVG arc flags.

        var adjustedEnd = this.endAngle;

        var startPoint = this.startAngle * this.railWidth;
        var endPoint = adjustedEnd * this.railWidth;

        if (endPoint<startPoint) {
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

        this.selectionSVG.attr("d", path);
    }
});
    
