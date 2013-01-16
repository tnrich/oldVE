/**
 * @class Teselagen.manager.AAManager
 * Class which translates the different frames from a sequenceManager.
 * @author Nick Elsbree
 * @author Zinovii Dmytriv (original author)
 */
Ext.define("Teselagen.manager.AAManager", {
    extend: "Teselagen.mappers.Mapper",

    requires: ["Teselagen.bio.sequence.TranslationUtils"],

    config: {
        aaSequence: ["", "", ""],
        aaSequenceSparse: ["", "", ""],
        aaRevCom: ["", "", ""],
        aaRevComSparse: ["", "", ""]
    },

    mixins: {
        observable: "Ext.util.Observable"
    },

    TranslationUtils: null,

    updateEventString: Teselagen.event.MapperEvent.AA_MAPPER_UPDATED,

    /**
     * @param {Teselagen.manager.SequenceManager} sequenceManager The sequenceManager to get sequences from.
     */
    constructor: function(inData) {
        this.TranslationUtils = Teselagen.bio.sequence.TranslationUtils;
        this.mixins.observable.constructor.call(this, inData);
        
        this.callParent([inData]);
        this.initConfig(inData);
    },

    /**
     * @private
     * Recalculates amino acid sequences.
     */
    recalculate: function() {
        if(this.sequenceManager) {
            this.recalculateNonCircular();
        }

        Vede.application.fireEvent(this.updateEventString);
    },
    
    /**
     * @private
     * Helper function to translate the different frames of the sequence.
     */
    recalculateNonCircular: function() {
        var i;
        var sequence = this.sequenceManager.getSequence();
        var revCom = this.sequenceManager.getReverseComplementSequence();
        var seqLen = sequence.seqString().length;
        var aminoAcid;
        var aminoAcidRevCom;
        var aaString;
        var aaStringRevCom;
        var codon = [];
        var codonRevCom = [];

        var aaSequenceNew = [];
        var aaSequenceSparseNew = [];
        var revComNew = [];
        var revComSparseNew = [];

        var aaSequenceArray = [[], [], []];
        var revComArray = [[], [], []];

        for(i = 0; i < seqLen; i++) {
            if(i >= seqLen - 2) {
                break;
            }

            codon = [sequence.symbolAt(i), sequence.symbolAt(i + 1), sequence.symbolAt(i + 2)];
            codonRevCom = [revCom.symbolAt(i), revCom.symbolAt(i + 1), revCom.symbolAt(i + 2)];

            aminoAcid = this.TranslationUtils.dnaToProteinSymbol(codon[0],
                                                                 codon[1], 
                                                                 codon[2]);

            aminoAcidRevCom = this.TranslationUtils.dnaToProteinSymbol(codonRevCom[0],
                                                                       codonRevCom[1], 
                                                                       codonRevCom[2]);
            
            aaString = "";
            aaStringRevCom = "";

            if(aminoAcid instanceof Teselagen.bio.sequence.symbols.GapSymbol) {
                if(this.TranslationUtils.isStopCodon(codon[0], codon[1], codon[2])) {
                    aaString = ".";
                }
            } else {
                aaString = aminoAcid.getValue();
            }

            if(aminoAcidRevCom instanceof Teselagen.bio.sequence.symbols.GapSymbol) {
                if(this.TranslationUtils.isStopCodon(codonRevCom[0],
                                                     codonRevCom[1], 
                                                     codonRevCom[2])) {
                    aaStringRevCom = ".";
                }
            } else {
                aaStringRevCom = aminoAcidRevCom.getValue();
            }

            aaSequenceArray[i % 3].push(aaString);
            revComArray[i % 3].push(aaStringRevCom);
        }

        for(i = 0; i < 3; i++) {
            aaSequenceNew[i] = aaSequenceArray[i].join("");
            aaSequenceSparseNew[i] = aaSequenceArray[i].join(" ");
            revComNew[i] = revComArray[i].join("");
            revComSparseNew[i] = revComArray[i].join(" ");
        }

        this.setAaSequence(aaSequenceNew);
        this.setAaSequenceSparse(aaSequenceSparseNew);
        this.setAaRevCom(revComNew);
        this.setAaRevComSparse(revComSparseNew);
    },
    
    /**
     * Returns the amino acid sequence of a given frame.
     * @param {Number} frame Which frame to return the amino acid sequence for.
     * @param {Boolean} sparse Whether to return the sparse version of the sequence.
     */
    getSequenceFrame: function(frame, sparse) {
        if(this.dirty) {
            this.recalculate();
            this.dirty = false;
        }

        if(sparse) {
            return this.aaSequenceSparse[frame];
        } else {
            return this.aaSequence[frame];
        }
    },

    /**
     * Returns the amino acid sequence of a given frame of the reverse complement sequence.
     * @param {Int} frame Which frame to return the amino acid sequence for.
     * @param {Boolean} sparse Whether to return the sparse version of the sequence.
     */
    getRevComFrame: function(frame, sparse) {
        if(this.dirty) {
            this.recalculate();
            this.dirty = false;
        }

        if(sparse) {
            return this.aaRevComSparse[frame];
        } else {
            return this.aaRevCom[frame];
        }
    }
});
