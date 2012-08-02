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
        orfs: null
    },

    maxAlignmentRow: 0,

    /**
     * @param {Array<Teselagen.bio.orf.ORF>} The orfs to calculate sprites for.
     */
    constructor: function(inData) {
        this.callParent(arguments);

        this.initConfig(inData);
    },

    /**
     * Creates sprites out of the orfs given.
     * @return {Array<Ext.draw.Sprite>} The sprites created from the orfs.
     */
    render: function() {
        var sprites = [];
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

            // Generate the arc of the orf.
            var arcSprite = Ext.create("Ext.draw.Sprite", {
                type: "path",
                path: this.GraphicUtils.drawArc(this.center, orfRadius,
                                          startAngle, endAngle, false, true,
                                          sweep, largeArc),
                stroke: color
            });

            sprites.push(arcSprite);

            this.addToolTip(arcSprite, tooltip);

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

                this.addToolTip(codonSprite, tooltip);

                sprites.push(codonSprite);
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

            var stopSprite = Ext.create("Ext.draw.Sprite", {
                type: "path",
                path: "M" + (this.center.x + (orfRadius + 2) * 
                      Math.sin(arrowShiftAngle)) + " " +
                      (this.center.y - (orfRadius + 2) * 
                      Math.cos(arrowShiftAngle)) + "L" + 
                      (this.center.x + orfRadius * Math.sin(lastAngle)) + 
                      " " + (this.center.y - orfRadius * Math.cos(lastAngle)) + 
                      "L" + (this.center.x + (orfRadius - 2) * 
                      Math.sin(arrowShiftAngle)) + " " + 
                      (this.center.y - (orfRadius - 2) * 
                      Math.cos(arrowShiftAngle)) + 
                      "z",
                stroke: color,
                fill: color
            });

            this.addToolTip(stopSprite, tooltip);

            sprites.push(stopSprite);
        }, this);
        
        return sprites;
    },

    /**
     * @private
     * Creates a tooltip for a given orf.
     * @param {Teselagen.bio.orf.ORF} orf The orf to calculate a tooltip for.
     * @return {String} The calculated tooltip.
     */
    getToolTip: function(orf) {
        var bp = Math.abs(orf.getEnd() - orf.getStart()) + 1;
        var aa = Math.floor(bp / 3);
        var complimentary = "";
        
        if(orf.getStrand() == 1 && orf.getStartCodons().length > 1) {
            complimentary = ", complimentary";
        }

        var tooltipLabel = (orf.getStart() + 1) + ".." + orf.getEnd() +
            ", frame: " + orf.getFrame() + 
            ", length: " + bp + " BP" + 
            ", " + aa + " AA" + complimentary;

        if(orf.getStartCodons().length > 1) {
            tooltipLabel += "\nStart Codons: ";
            
            var codonsArray = [];
            var codonString;
            Ext.each(orf.getStartCodons(), function(codon, index) {
                if(index != orf.getStartCodons().length - 1) {
                    codonString = codon + ", ";
                } else {
                    codonString = codon;
                }

                codonsArray.push(codonString);
            });

            tooltipLabel = [tooltipLabel].concat(codonsArray).join("");
        }

        return tooltipLabel;
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
