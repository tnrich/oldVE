/**
 * @class Teselagen.renderer.rail.ORFRenderer
 * Class which creates sprites out of the given ORFs.
 * @author Nick Elsbree
 * @author Zinovii Dmytriv (original author)
 */
Ext.define("Teselagen.renderer.rail.ORFRenderer", {
    extend: "Teselagen.renderer.rail.RailRenderer",

    statics: {
        DISTANCE_FROM_RAIL: 15,
        DISTANCE_BETWEEN_ORFS: 5,
        ORF_FRAME_COLOR: ["#FF0000", "#31B440", "#3366CC"]
    },

    config: {
        orfSVG: null,
        orfs: null,
        railWidth: null,
        railHeight: null,
        reference: null
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
        var path;
        var orfAlignment = this.Alignment.buildAlignmentMap(this.orfs, 
                                                         this.sequenceManager);
        this.maxAlignmentRow = Math.max.apply(null, orfAlignment.getValues());

        var seqLen = this.sequenceManager.getSequence().seqString().length;

        Ext.each(this.orfs, function(orf) {
            var color = this.self.ORF_FRAME_COLOR[orf.getFrame()];
            var tooltip = this.getToolTip(orf);
            var index = orfAlignment.get(orf);

            var orfHeight = this.reference.y - this.self.DISTANCE_FROM_RAIL;
            if(index > 0) {
                orfHeight += - (index * this.self.DISTANCE_BETWEEN_ORFS);
            }

            var startPoint = (orf.getStart() / seqLen) * this.railWidth;
            var endPoint = (orf.getEnd() / seqLen) * this.railWidth;

            // Generate the line of the orf.
            path = "M" + startPoint + " " + orfHeight +
                   "L" + endPoint + " " + orfHeight;

            this.orfSVG.append("svg:path")
                       .attr("stroke", color)
                       .attr("d", path)
                       .on("mousedown", this.getClickListener(orf.getStart(),
                                                              orf.getEnd()))
                       .append("svg:title")
                       .text(tooltip);

            // Render start codons as bold dots.
            Ext.each(orf.getStartCodons(), function(codonIndex) {
                var codonAngle = codonIndex * 2 * Math.PI / seqLen;

                var codonX = this.reference.x + ((codonIndex/seqLen) * this.railWidth);
                var codonY = this.reference.y + orfHeight;

                this.orfSVG.append("svg:circle")
                           .attr("r", 2)
                           .attr("cx", codonX)
                           .attr("cy", codonY)
                           .attr("fill", color)
                           .on("mousedown", this.getClickListener(orf.getStart(),
                                                                  orf.getEnd()))
                           .append("svg:title")
                           .text(tooltip);
            }, this);
            
            var lastPoint;
            var arrowShiftAngle;
            if(orf.getStrand() == this.StrandType.FORWARD) {
                arrowShiftAngle = endPoint + 5;
                lastPoint = endPoint;
            } else {
                arrowShiftAngle = startPoint - 5;
                lastPoint = startPoint;
            }
            
            path = "M" + (this.reference.x + lastPoint) + " " +
                   (this.reference.y + (orfHeight + 2)) + "L" + 
                   (this.reference.x + arrowShiftAngle) + 
                   " " + (this.reference.y + orfHeight) + 
                   "L" + (this.reference.x + lastPoint) + " " + 
                   (this.reference.y + (orfHeight - 2))  + "z";

            this.orfSVG.append("svg:path")
                       .attr("stroke", color)
                       .attr("fill", color)
                       .attr("d", path)
                       .on("mousedown", this.getClickListener(orf.getStart(),
                                                              orf.getEnd()))
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

        return pOrfs;
    }
});
