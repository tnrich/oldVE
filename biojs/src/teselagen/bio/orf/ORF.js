/**
 * @class Teselagen.bio.orf.ORF
 * Open Read Frame sequence annotation.
 * @author Nick Elsbree
 * @author Zinovii Dmytriv
 */
Ext.define("Teselagen.bio.orf.ORF", {
    extend: "Teselagen.bio.sequence.common.StrandedAnnotation",

    /**
     * Constructor.  
     * The ORF coordinates are [start, end).  The frame length is end-start.
     * @param {Int} start 0-based frame start location.
     * @param {Int} end 0-based index of the nucleotide after the last nucleotide in the frame.
     * @param {Teselagen.StrandType} strand Frame strand.
     * @param {Int} frame The frame. Can be 0, 1, or 2.
     * @param {Array} startCodons List of start codons for ORF.
     */
    constructor: function(inData) {
        var frame;
        var startCodons;
        var strand;

        this.callParent([inData]);

        if(typeof(inData.frame) === "undefined") {
            frame = 0;
        } else {
            frame = inData.frame;
        }

        if(typeof(inData.startCodons) === "undefined") {
            startCodons = null;
        } else {
            startCodons = inData.startCodons;
        }

        if(typeof(inData.strand) === "undefined") {
            strand = 1;
        } else {
            strand = inData.strand;
        }

        /**
         * Get the frame.
         * @return {Int}
         */
        this.getFrame = function() {
            return frame;
        };
        /**
         * Set the frame.
         * @param {Int} pFrame The value to set frame to.
         */
        this.setFrame = function(pFrame) {
            frame = pFrame;
        };
        /**
         * Get the start codons.
         * @return {Array}
         */
        this.getStartCodons = function() {
            return startCodons;
        };
        /**
         * Set the start codons.
         * @param {Array} pStartCodons
         */
        this.setStartCodons = function(pStartCodons) {
            startCodons = pStartCodons;
        };
        /**
         * Get the strand.
         * @return {Int}
         */
        this.getStrand = function() {
            return strand;
        };
        /**
         * Set the strand.
         * @param {Int} strand
         */
        this.setStrand = function(pStrand) {
            strand = pStrand;
        };

        this.toString = function() {
            return "ORF on strand " + strand + " and start codon indices " +
                startCodons + " from " + inData.start + " to " + inData.end;
        };

        return this;
    },

    toJSON: function () {
        return {
            "position": (this.getStart()+1) + " - " + this.getEnd(),
            "length": this.getEnd() - this.getStart(),
            "strand": this.getStrand(),
            "frame": this.getFrame()
        };
    }
});
