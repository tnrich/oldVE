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
        DISTANCE_BETWEEN_ORFS: 10,
        ORF_FRAME_COLOR: ["#FF0000", "#31B440", "#3366CC"]
    },

    config: {
        orfs: null
    },

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
        var seqLen = this.sequenceManager.getSequence().seqString().length;

        Ext.each(this.orfs, function(orf, index) {
            var color = this.self.ORF_FRAME_COLOR[orf.getFrame()];

            var orfRadius = this.railRadius + this.self.DISTANCE_FROM_RAIL;
            if(index > 0) {
                orfRadius += index * this.self.DISTANCE_BETWEEN_ORFS;
            }

            var startAngle = orf.getStart() * 2 * Math.PI / seqLen;
            var endAngle = orf.getEnd() * 2 * Math.PI / seqLen;

            // Generate the arc of the orf.
            var arcSprite = this.GraphicUtils.drawArc(this.center, orfRadius,
                                                startAngle, endAngle, color);

            sprites.push(arcSprite);

            // Attach a tooltip to the arc.
            arcSprite.tooltip = this.getToolTip(orf);
            arcSprite.on("render", function(me) {
                Ext.tip.QuickTipManager.register({
                    target: me.el,
                    text: me.tooltip
                });
            });

            // Render start codons as bold dots.
            Ext.each(orf.getStartCodons(), function(codonIndex) {
                var codonAngle = codonIndex * 2 * Math.PI / seqLen;

                var codonX = this.center.x + orfRadius * Math.sin(codonAngle);
                var codonY = this.center.y + orfRadius * Math.cos(codonAngle);

                sprites.push(Ext.create("Ext.draw.Sprite", {
                    type: "circle",
                    radius: 2,
                    x: codonX,
                    y: codonY,
                    fill: color
                }));
            });

            // Render end codons as arrows.
            var arrowShiftAngle;
            if(orf.getStrand() == this.StrandType.FORWARD) {
                arrowShiftAngle = endAngle - 5 / orfRadius;
            } else {
                arrowShiftAngle = startAngle + 5 / orfRadius;
            }

            sprites.push(Ext.create("Ext.draw.Sprite", {
                type: "path",
                path: "M" + this.center.x + (orfRadius + 2) * Math.sin(arrowShiftAngle) + " " +
                      this.center.y - (orfRadius + 2) * Math.cos(arrowShiftAngle) + " " +
                      "L" + this.center.x + orfRadius * Math.sin(endAngle) + " " +
                      this.center.y - (orfRadius - 2) * Math.cos(endAngle) + " " +
                      "L" + this.center.x + (orfRadius - 2) * Math.sin(arrowShiftAngle) + " " +
                      this.center.y - (orfRadius + 2) * Math.cos(arrowShiftAngle)
            }));
        }, this);
        
        return sprites;
    },

    /**
     * @private
     * Creates a tooltip for a given orf.
     * TODO: figure out what to do with the tooltip.
     * @param {Teselagen.bio.orf.ORF} orf The orf to calculate a tooltip for.
     * @return {String} The calculated tooltip.
     */
    getToolTip: function(orf) {
        var bp = Math.abs(orf.getEnd() - orf.getStart()) + 1;
        var aa = Math.floor(bp / 3);
        var complimentary = "";
        
        if(orf.getStrand() == 1) {
            complimentary = ", complimentary";
        }

        var tooltipLabel = (orf.getStart() + 1) + ".." + orf.getEnd() +
            ", frame: " + orf.getFrame() + 
            ", length: " + bp + " BP" + 
            ", " + aa + " AA" + complimentary;

        if(orf.getStartCodons().length > 1) {
            tooltipLabel += "\n";
            
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
