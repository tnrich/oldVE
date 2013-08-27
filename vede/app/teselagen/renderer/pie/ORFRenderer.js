/**
 * @class Teselagen.renderer.pie.ORFRenderer
 * Class which creates sprites out of the given ORFs.
 * @author Nick Elsbree
 * @author Zinovii Dmytriv (original author)
 */
Ext.define("Teselagen.renderer.pie.ORFRenderer", {
    extend: "Teselagen.renderer.pie.PieRenderer",

    statics: {
        DISTANCE_FROM_RAIL: 15,
        DISTANCE_BETWEEN_ORFS: 5,
        ORF_FRAME_COLOR: ["#FF0000", "#31B440", "#3366CC"]
    },

    config: {
        orfSVG: null,
        orfs: null
    },

    maxAlignmentRow: 0,

    /**
     * @param {Teselagen.bio.orf.ORF[]} The orfs to calculate sprites for.
     */
    constructor: function(inData) {
        this.callParent(arguments);

        this.initConfig(inData);
    },

    /**
     * Creates sprites out of the orfs given.
     * @return {Ext.draw.Sprite[]} The sprites created from the orfs.
     */
    render: function() {
        var orfAlignment = this.Alignment.buildAlignmentMap(this.orfs, 
                                                         this.sequenceManager);
        this.maxAlignmentRow = Math.max.apply(null, orfAlignment.getValues());

        var seqLen = this.sequenceManager.getSequence().seqString().length;

        Ext.each(this.orfs, function(orf) {
            var color = this.self.ORF_FRAME_COLOR[orf.getFrame()];
            var tooltip = this.getToolTip(orf);
            var index = orfAlignment.get(orf);

            var orfRadius = this.railRadius + this.self.DISTANCE_FROM_RAIL;
            if(index > 0) {
                orfRadius += index * this.self.DISTANCE_BETWEEN_ORFS;
            }

            var startAngle = orf.getStart() * 2 * Math.PI / seqLen;
            var endAngle = orf.getEnd() * 2 * Math.PI / seqLen;

            // Calculate SVG flags sweep and large-arc. See SVG docs for details.
            var sweep = true;
            if(endAngle < startAngle) {
                sweep = false;
            }

            var largeArc = false;
            if(Math.abs(endAngle - startAngle) > Math.PI) {
                largeArc = true;
            }

            if(startAngle > endAngle) {
                sweep = !sweep;
                largeArc = !largeArc;
            }

            var selectEnd;
            if(orf.getStrand() == -1) {
                selectEnd = orf.getEnd() + 1;
            } else {
                selectEnd = orf.getEnd();
            }

            path = this.GraphicUtils.drawArc(this.center, orfRadius,
                                      startAngle, endAngle, false, true,
                                      sweep, largeArc);

            this.orfSVG.append("svg:path")
                       .attr("stroke", color)
                       .attr("fill", "none")
                       .attr("d", path)
                       .on("mousedown", function() {
                           Vede.application.fireEvent("VectorPanelAnnotationClicked",
                                                      orf.getStart(),
                                                      selectEnd);
                       })
                       .append("svg:title")
                       .text(tooltip);
            
            // Render start codons as bold dots.
            Ext.each(orf.getStartCodons(), function(codonIndex) {
                var codonAngle = codonIndex * 2 * Math.PI / seqLen;

                var codonX = this.center.x + orfRadius * Math.sin(codonAngle);
                var codonY = this.center.y - orfRadius * Math.cos(codonAngle);

                var codonSprite = Ext.create("Ext.draw.Sprite", {
                    type: "circle",
                    radius: 2,
                    x: codonX,
                    y: codonY,
                    fill: color
                });

                this.orfSVG.append("svg:circle")
                           .attr("r", 2)
                           .attr("cx", codonX)
                           .attr("cy", codonY)
                           .attr("fill", color)
                           .on("mousedown", function() {
                               Vede.application.fireEvent("VectorPanelAnnotationClicked",
                                                          orf.getStart(),
                                                          selectEnd);
                           })
                           .append("svg:title")
                           .text(tooltip);
            }, this);

            // Render end codons as arrows.
            var lastAngle;
            var arrowShiftAngle;
            if(orf.getStrand() == this.StrandType.FORWARD) {
                arrowShiftAngle = endAngle - 5 / orfRadius;
                lastAngle = endAngle;
            } else {
                arrowShiftAngle = startAngle + 5 / orfRadius;
                lastAngle = startAngle;
            }

            path = "M" + (this.center.x + (orfRadius + 2) * 
                   Math.sin(arrowShiftAngle)) + " " +
                   (this.center.y - (orfRadius + 2) * 
                   Math.cos(arrowShiftAngle)) + "L" + 
                   (this.center.x + orfRadius * Math.sin(lastAngle)) + 
                   " " + (this.center.y - orfRadius * Math.cos(lastAngle)) + 
                   "L" + (this.center.x + (orfRadius - 2) * 
                   Math.sin(arrowShiftAngle)) + " " + 
                   (this.center.y - (orfRadius - 2) * 
                   Math.cos(arrowShiftAngle)) + 
                   "z";

            this.orfSVG.append("svg:path")
                       .attr("stroke", color)
                       .attr("fill", color)
                       .attr("d", path)
                       .on("mousedown", function() {
                           Vede.application.fireEvent("VectorPanelAnnotationClicked",
                                                      orf.getStart(),
                                                      selectEnd);
                       })
                       .append("svg:title")
                       .text(tooltip);
        }, this);
    },

    /**
     * @private
     * Creates a tooltip for a given orf.
     * @param {Teselagen.bio.orf.ORF} orf The orf to calculate a tooltip for.
     * @return {String} The calculated tooltip.
     */
    getToolTip: function(orf) {
        return this.getORFTooltipLabel(orf);
    },
    
    /**
     * @private
     * Called when orfs are changed. Flags the renderer for recalculation.
     */
    applyOrfs: function(pOrfs) {
        this.setNeedsMeasurement(true);

        return pOrfs;
    }
});
