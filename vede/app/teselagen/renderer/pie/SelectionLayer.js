/**
 * @class Teselagen.renderer.pie.SelectionLayer
 * Renders the shaded regions of a selection.
 * @author Nick Elsbree
 * @author Zinovii Dmytriv (original author of SelectionLayer.as)
 */
Ext.define("Teselagen.renderer.pie.SelectionLayer", {
    requires: ["Teselagen.bio.util.Point"],
    
    extend: "Teselagen.renderer.pie.Layer",

    /**
     * Draws the shaded wedge-shaped selection area.
     */
    drawSelectionPie: function(fromIndex, endIndex) {
        var path;
        var seqLen = this.sequenceManager.getSequence().toString().length;
        if(seqLen == 0) {
            return;
        }

        this.startAngle = fromIndex * 2 * Math.PI / seqLen;
        this.endAngle = endIndex * 2 * Math.PI / seqLen;

        var startPoint = {};
        startPoint.x = this.center.x + this.radius * Math.sin(this.startAngle);
        startPoint.y = this.center.y - this.radius * Math.cos(this.startAngle);

        var endPoint = {};
        endPoint.x = this.center.x + this.radius * Math.sin(this.endAngle);
        endPoint.y = this.center.y - this.radius * Math.cos(this.endAngle);

        // Adjust endangle and startangle to be relative to startangle so we
        // can use the same logic as in GraphicUtils to determine SVG arc flags.

        var adjustedEnd = this.endAngle;
        if(this.endAngle > this.startAngle) {
            adjustedEnd -= this.startAngle;
        } else {
            adjustedEnd += 2 * Math.PI - this.startAngle;
        }

        var adjustedStart = 0;

        var sweepFlag = 0;
        if(adjustedEnd > adjustedStart) {
            sweepFlag = 1;
        }

        var largeArcFlag = 0;
        if(Math.abs(adjustedEnd - adjustedStart) > Math.PI) {
            largeArcFlag = 1;
        }

        path = "M" + this.center.x + " " + this.center.y + " " +
               "L" + startPoint.x + " " + startPoint.y + " " + 
               "A" + this.radius + " " + this.radius + " 0 " + largeArcFlag +
               " " + sweepFlag + " " + endPoint.x + " " + endPoint.y +
               "L" + this.center.x + " " + this.center.y;

        this.selectionSVG.attr("d", path);
    }
});
