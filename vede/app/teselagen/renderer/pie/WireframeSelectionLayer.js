/**
 * @class Teselagen.renderer.pie.WireframeSelectionLayer
 * Renders the hollow selection region which appears when no feature is selected
 * yet.
 * @author Nick Elsbree
 * @author Zinovii Dmytriv (original author of WireframeSelectionLayer.as)
 */
Ext.define("Teselagen.renderer.pie.WireframeSelectionLayer", {
    requires: ["Teselagen.bio.util.Point"],
    
    extend: "Teselagen.renderer.pie.Layer",

    statics: {
        FRAME_COLOR: "#808080",
        WIREFRAME_OFFSET: 10 // Distance of wireframe from rail edge.
    },

    deselect: function() {
        this.callParent();

        this.selectionSVG.selectAll(".pieWireframeElement").remove();
    },

    drawSelectionPie: function(fromIndex, endIndex) {
        var path;
        var seqLen = this.sequenceManager.getSequence().toString().length;

        if(seqLen == 0 || (this.start == fromIndex && this.end == endIndex) ||
           fromIndex == endIndex) {

            return;
        }

        var startAngle = fromIndex * 2 * Math.PI / seqLen;
        var endAngle = endIndex * 2 * Math.PI / seqLen;

        var wireRadius = this.radius + this.self.WIREFRAME_OFFSET;

        var startPoint = Ext.create("Teselagen.bio.util.Point");
        startPoint.x = this.center.x + wireRadius * Math.sin(startAngle);
        startPoint.y = this.center.y - wireRadius * Math.cos(startAngle);

        var endPoint = Ext.create("Teselagen.bio.util.Point");
        endPoint.x = this.center.x + wireRadius * Math.sin(endAngle);
        endPoint.y = this.center.y - wireRadius * Math.cos(endAngle);

        // Adjust endangle and startangle to be relative to startangle so we
        // can use the same logic as in GraphicUtils to determine SVG arc flags.

        if(endAngle > startAngle) {
            endAngle -= startAngle;
        } else {
            endAngle += 2 * Math.PI - startAngle;
        }

        startAngle = 0;

        var sweepFlag = 0;
        if(endAngle > startAngle) {
            sweepFlag = 1;
        }

        var largeArcFlag = 0;
        if(Math.abs(endAngle - startAngle) > Math.PI) {
            largeArcFlag = 1;
        }

        path = "M" + this.center.x + " " + this.center.y + 
               "L" + startPoint.x + " " + startPoint.y + 
               "A" + wireRadius + " " + wireRadius + " 0 " + largeArcFlag +
               " " + sweepFlag + " " + endPoint.x + " " + endPoint.y +
               "L" + this.center.x + " " + this.center.y;

        var selectionElement = this.selectionSVG.select(".pieWireframeElement");

        if(selectionElement[0][0] === null) {
            this.selectionSVG.append("svg:path")
                             .attr("class", "pieWireframeElement")
                             .attr("stroke", this.self.FRAME_COLOR)
                             .attr("stroke-opacity", this.self.STROKE_OPACITY)
                             .attr("fill", "none")
                             .attr("d", path);
        } else {
            selectionElement.attr("d", path);
        }
    }
});
