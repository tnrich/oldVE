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
     * @param {Int} start Frame start location.
     * @param {Int} end Index of the nucleotide after the last nucleotide in the frame.
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
        }
        /**
         * Set the strand.
         * @param {Int} strand
         */
        this.setStrand = function(pStrand) {
            strand = pStrand;
        }

        return this;
    }
});
