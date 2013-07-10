/**
 * @class Teselagen.manager.ORFManager
 * Class which manages the calculation of ORFs in the sequence.
 * @author Nick Elsbree
 * @author Zinovii Dmytriv
 */
Ext.define("Teselagen.manager.ORFManager", {
    extend: "Teselagen.mappers.Mapper",

    singleton: true,

    requires: ["Teselagen.bio.orf.ORFFinder",
               "Teselagen.bio.sequence.DNATools"],

    config: {
        minORFSize: 300,
        orfs: []
    },

    mixins: {
        observable: "Ext.util.Observable"
    },

    DNATools: null,

    /**
     * @param {Teselagen.manager.SequenceManager} sequenceManager The sequenceManager to observe for sequence changes.
     */
    initialize: function() {
        this.DNATools = Teselagen.bio.sequence.DNATools;
    },

    setOrfs: function(pOrfs) {
        this.orfs = pOrfs;
    },
    
    /**
     * Gets ORFs from sequence. Recalculate them if the sequence has changed.
     * @return {Teselagen.bio.orf.ORF[]} Array of ORFs in DNA sequence.
     */
    getOrfs: function() {
        if(this.getDirty()) {
            this.recalculate();
            this.setDirty(false);
        } 

        return this.orfs;
    },

    /**
     * Sets the minimum ORF size. 
     * Checks to make sure it is a new size to avoid unnecessary recalculation.
     * @param {Int} pSize The new minimum ORF size.
     */
    setMinORFSize: function(pSize) {
        if(this.minORFSize != pSize) {
            this.minORFSize = pSize;
            this.setDirty(true);
        }
    },

    /**
     * @private
     * Handles recalculation depending on whether the sequence is linear or circular.
     */
    recalculate: function() {
        if(this.getSequenceManager()) {
            if(this.getSequenceManager().getCircular()) {
                this.recalculateCircular();
            } else {
                this.recalculateNonCircular();
            }
        } else {
            this.setOrfs(null);
        }

        Vede.application.fireEvent(Teselagen.event.MapperEvent.ORF_MAPPER_UPDATED);
    },

    /**
     * @private
     * Recalculates ORFs for linear DNA. Simply calls the method in ORFMapper.
     */
    recalculateNonCircular: function() {
        this.setOrfs(Teselagen.bio.orf.ORFFinder.calculateORFBothDirections(
                                this.getSequenceManager().getSequence(),
                                this.getSequenceManager().getReverseComplementSequence(),
                                this.getMinORFSize()));
    },

    /**
     * @private
     * Recalculates ORFs for circular DNA.
     */
    recalculateCircular: function() {
        var forwardSequence = this.getSequenceManager().getSequence().seqString();
        var backwardSequence = this.getSequenceManager().getReverseComplementSequence().seqString();

        var doubleForward = this.DNATools.createDNA(forwardSequence +
                                               forwardSequence);
        var doubleBackward = this.DNATools.createDNA(backwardSequence +
                                                backwardSequence);

        var orfsSequence = Teselagen.bio.orf.ORFFinder.calculateORFBothDirections(
                                                                doubleForward,
                                                                doubleBackward,
                                                                this.getMinORFSize());

        var maxLength = forwardSequence.length;

        var recalcOrfs = [];
        var normalOrfs = [];
        var orf = null;

        Ext.each(orfsSequence, function(orf) {
            if(orf.getStart() >= maxLength) {
            } else if(orf.getEnd() <= maxLength) {
                normalOrfs.push(orf);
            } else if(orf.getEnd() > maxLength && orf.getStart() < maxLength) {
                orf.setOneEnd(orf.getEnd() - maxLength);
                var startCodons = orf.getStartCodons();

                Ext.each(startCodons, function(startCodon) {
                    if(startCodon >= maxLength) {
                        startCodon -= maxLength;
                    }
                });

                recalcOrfs.push(orf);
            }
        });
        
        var normalOrf = null;
        var circularOrf = null;

        // Eliminate the orf that overlaps with circular orfs.
        Ext.each(normalOrfs, function(normalOrf) {
            var skip = false;

            Ext.each(recalcOrfs, function(circularOrf) {
                if(circularOrf.getEnd() == normalOrf.getEnd() &&
                   circularOrf.getStrand() == normalOrf.getStrand()) {
                    skip = true;
                    return false;
                }
            });

            if(!skip) {
                recalcOrfs.push(normalOrf);
            }
        });

        this.setOrfs(recalcOrfs);
    }
});
