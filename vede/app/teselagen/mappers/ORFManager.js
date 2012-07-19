/**
 * @class Teselagen.mappers.ORFMapper
 * Class which manages the calculation of ORFs in the sequence.
 * @author Nick Elsbree
 * @author Zinovii Dmytriv
 */
Ext.define("Teselagen.mappers.ORFMapper", {
    extend: "Teselagen.mappers.Mapper",

    requires: ["Teselagen.bio.orf.ORFFinder"],

    config: {
        minORFSize: 300
    },

    mixins: {
        observable: "Ext.util.Observable"
    },


    /**
     * @param {Teselagen.manager.SequenceManager} sequenceManager The sequenceManager to observe for sequence changes.
     */
    constructor: function(inData) {
        this.updateEventString = Teselagen.mappers.MapperEvent.ORF_MAPPER_UPDATED;

        this.mixins.observable.constructor.call(this, inData);
        this.addEvents(this.updateEventString);

        this.callParent([inData]);
        this.initConfig(inData);

        var orfs = [];

    },

    setOrfs: function(pOrfs) {
        this.orfs = pOrfs;
    },
    
    /**
     * Gets ORFs from sequence. Recalculate them if the sequence has changed.
     * @return {Array<Teselagen.bio.orf.ORF>} Array of ORFs in DNA sequence.
     */
    getOrfs: function() {
        if(this.dirty) {
            this.recalculate();
            this.dirty = false;
        } 

        return orfs;
    },

    /**
     * Sets the minimum ORF size. 
     * Checks to make sure it is a new size to avoid unnecessary recalculation.
     * @param {Int} pSize The new minimum ORF size.
     */
    setMinORFSize: function(pSize) {
        if(this.minORFSize != pSize) {
            this.minORFSize = pSize;
            this.dirty = true;
        }
    },

    /**
     * @private
     * Handles recalculation depending on whether the sequence is linear or circular.
     */
    recalculate: function() {
        if(this.sequenceManager) {
            if(this.sequenceManager.getCircular()) {
                this.recalculateCircular();
            } else {
                this.recalculateNonCircular();
            }
        } else {
            this.setOrfs(null);
        }

        this.fireEvent(Teselagen.mappers.MapperEvent.ORF_MAPPER_UPDATED);
    },

    /**
     * @private
     * Recalculates ORFs for linear DNA. Simply calls the method in ORFMapper.
     */
    recalculateNonCircular: function() {
        this.setOrfs(Teselagen.bio.orf.ORFFinder.calculateORFBothDirections(
                                this.sequenceManager.getSequence(),
                                this.sequenceManager.getReverseComplementSequence(),
                                this.minORFSize));
    },

    /**
     * @private
     * Recalculates ORFs for circular DNA.
     */
    recalculateCircular: function() {
        var forwardSequence = sequenceManager.getSequence();
        var backwardSequence = sequenceManager.getReverseComplementSequence();

        var doubleForward = DNATools.createDNA(forwardSequence.seqString() +
                                               forwardSequence.seqString());
        var doubleBackward = DNATools.createDNA(backwardSequence.seqString() +
                                                backwardSequence.seqString());

        var orfsSequence = Teselagen.bio.orf.ORFFinder.calculateORFBothDirections(
                                                                doubleForward,
                                                                doubleBackward,
                                                                minORFSize);

        var maxLength = forwardSequence.getLength();

        var recalcOrfs = [];
        var normalOrfs = [];
        var orf = null;

        for(var i = 0; i < orfsSequence.getLength(); i++) {
            orf = orfsSequence[i];

            if(orf.getStart() >= maxLength) {
            } else if(orf.getEnd() < maxLength) {
                normalOrffs.push(orf);
            } else if(orf.getEnd() >= maxLength && orf.getStart() < maxLength) {
                orf.setOneEnd(orf.end - maxLength);
                var startCodons = orf.getStartCodons();

                for(var j = 0; j < startCodons.length; j++) {
                    if(startCodons[j] >= maxLength) {
                        startCodons[j] -= maxLength;
                    }
                }

                recalcOrfs.push(orf);
            }
        }
        
        var normalOrf = null;
        var circularOrf = null;
        // Eliminate the orf that overlaps with circular orfs.
        for(var k = 0; k < normalOrfs.length; k++) {
            normalOrf = normalOrfs[k];
            var skip = false;

            for(var l = 0; l < recalcOrfs.length; l++) {
                circularOrf = recalcOrfs[l];
                if(circularOrf.getEnd() == normalOrf.getEnd() &&
                   circularOrg.getStrand() == normalOrf.getStrand()) {
                    skip = true;
                    break;
                }
            }
            if(!skip) {
                recalcOrfs.push(normalOrf);
            }
        }

        this.setOrfs(recalcOrfs);
    },
});
