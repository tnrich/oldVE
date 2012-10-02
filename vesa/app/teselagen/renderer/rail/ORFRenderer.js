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
        orfs: null,
        railWidth: null,
        railHeight: null,
        reference: null
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

            var orfHeight = this.reference.y - this.self.DISTANCE_FROM_RAIL;
            if(index > 0) {
                orfHeight += - (index * this.self.DISTANCE_BETWEEN_ORFS);
            }

            var startPoint = (orf.getStart() / seqLen) * this.railWidth;
            var endPoint = (orf.getEnd() / seqLen) * this.railWidth;

            // Generate the line of the orf.
            var lineSprite = Ext.create("Ext.draw.Sprite", {
                type: "path",
                path: "M" + startPoint + " " + orfHeight +
                "L" + endPoint + 
                " " + orfHeight,
                stroke: color
            });

            sprites.push(lineSprite);

            this.addToolTip(lineSprite, tooltip);
            this.addClickListener(lineSprite, orf.getStart(), orf.getEnd());

            // Render start codons as bold dots.
            Ext.each(orf.getStartCodons(), function(codonIndex) {
                var codonAngle = codonIndex * 2 * Math.PI / seqLen;

                var codonX = this.reference.x + ((codonIndex/seqLen) * this.railWidth);
                var codonY = this.reference.y + orfHeight;

                var codonSprite = Ext.create("Ext.draw.Sprite", {
                    type: "circle",
                    radius: 2,
                    x: codonX,
                    y: codonY,
                    fill: color
                });

                this.addToolTip(codonSprite, tooltip);
                this.addClickListener(codonSprite, orf.getStart(), orf.getEnd());

                sprites.push(codonSprite);
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
            
            var stopSprite = Ext.create("Ext.draw.Sprite", {
                type: "path",
                path: "M" + (this.reference.x + lastPoint) + " " +
                      (this.reference.y + (orfHeight + 2)) + "L" + 
                      (this.reference.x + arrowShiftAngle) + 
                      " " + (this.reference.y + orfHeight) + 
                      "L" + (this.reference.x + lastPoint) + " " + 
                      (this.reference.y + (orfHeight - 2))  + 
                      "z",
                stroke: color,
                fill: color
            });

            this.addToolTip(stopSprite, tooltip);
            this.addClickListener(stopSprite, orf.getStart(), orf.getEnd());

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

        var tooltipLabel = (orf.getStart() + 1) + ".." + (orf.getEnd() + 1) +
            ", frame: " + orf.getFrame() + 
            ", length: " + bp + " BP" + 
            ", " + aa + " AA" + complimentary;

        if(orf.getStartCodons().length > 1) {
            tooltipLabel += "<br>Start Codons: ";
            
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

        return pOrfs;
    }
});
