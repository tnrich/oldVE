/**
 * @class Teselagen.mappers.AAMapper
 * Class which translates the different frames from a sequenceManager.
 * @author Nick Elsbree
 * @author Zinovii Dmytriv (original author)
 */
Ext.define("Teselagen.mappers.AAMapper", {
    extend: "Teselagen.mappers.Mapper",

    tUtils: Teselagen.bio.sequence.TranslationUtils,

    mixins: {
        observable: "Ext.util.Observable"
    },

    updateEventString: Teselagen.mappers.MapperEvent.AA_MAPPER_UPDATED,

    /**
     * @param {Teselagen.manager.SequenceManager} sequenceManager The sequenceManager to get sequences from.
     */
    constructor: function(inData) {
        this.mixins.observable.constructor.call(this, inData);
        this.callParent([inData]);
        this.addEvents(this.updateEventString);
        
        var aaSequence = ["", "", ""];
        var aaSequenceSparse = ["", "", ""];
        var aaRevCom = ["", "", ""];
        var aaRevComSparse = ["", "", ""];

        this.on(this.updateEventString,
                             function(){alert("aa mapper updated")});
        /**
         * @private
         * Recalculates amino acid sequences.
         */
        this.recalculate = function() {
            aaSequence = ["", "", ""];
            aaSequenceSparse = ["", "", ""];
            aaRevCom = ["", "", ""];
            aaRevComSparse: ["", "", ""];
       
            if(this.sequenceManager) {
                this.recalculateNonCircular();
            }

            this.fireEvent(this.updateEventString);
        },
        
        /**
         * @private
         * Helper function to translate the different frames of the sequence.
         */
        this.recalculateNonCircular = function() {
            var i;
            var sequence = this.sequenceManager.getSequence();
            var revCom = this.sequenceManager.getReverseComplementSequence();
            var seqLen = sequence.length;
            var aminoAcid;
            var aminoAcidRevCom;
            var aaString;
            var aaStringRevCom;
            var codon = [];
            var codonRevCom = [];

            aaSequenceArray = [[], [], []];
            revComArray = [[], [], []];

            for(i = 0; i < seqLen; i++) {
                if(i >= seqLen - 2) {
                    break;
                }

                codon = [sequence.symbolAt(i), sequence.symbolAt(i + 1), sequence.symbolAt(i + 2)];
                codonRevCom = [revCom.symbolAt(i), revCom.symbolAt(i + 1), revCom.symbolAt(i + 2)];

                aminoAcid = tUtils.dnaToProteinSymbol(codon[0], codon[1], codon[2]);
                aminoAcidRevCom = tUtils.dnaToProteinSymbol(codonRevComRevCom[0], codonRevCom[1], codonRevCom[2]);
                
                aaString = "";
                aaStringRevCom = "";

                if(aminoAcid instanceof Teselagen.bio.sequence.dna.symbols.GapSymbol) {
                    if(tUtils.isStopCodon(codon[0], codon[1], codon[2])) {
                        aaString = ".";
                    }
                } else {
                    aaString = aminoAcid.getValue();
                }

                if(aminoAcidRevCom instanceof Teselagen.bio.sequence.dna.symbols.GapSymbol) {
                    if(tUtils.isStopCodon(codonRevCom[0], codonRevCom[1], codonRevCom[2])) {
                        aaStringRevCom = ".";
                    }
                } else {
                    aaStringRevCom = aminoAcidRevCom.getValue();
                }

                aaSequenceArray[i % 3].push(aaString);
                revComArray[i % 3].push(aaStringRevCom);
            }

            for(i = 0; i < 3; i++) {
                aaSequence[i] = aaSequenceArray[i].join("");
                aaSequenceSparse[i] = aaSequenceArray[i].join(" ");
                revCom[i] = revComArray[i].join("");
                revComSparse[i] = revComArray[i].join("");
            }
        },
        
        /**
         * Returns the amino acid sequence of a given frame.
         * @param {Int} frame Which frame to return the amino acid sequence for.
         * @param {Boolean} sparse Whether to return the sparse version of the sequence.
         */
        this.getSequenceFrame = function(frame, sparse) {
            if(this.dirty) {
                this.recalculate();
                this.dirty = false;
            }

            if(sparse) {
                return aaSequenceSparse[frame];
            } else {
                return aaSequence[frame];
            }
        },

        /**
         * Returns the amino acid sequence of a given frame of the reverse complement sequence.
         * @param {Int} frame Which frame to return the amino acid sequence for.
         * @param {Boolean} sparse Whether to return the sparse version of the sequence.
         */
        this.getRevComFrame = function(frame, sparse) {
            if(this.dirty) {
                this.recalculate();
                this.dirty = false;
            }

            if(sparse) {
                return aaRevComSparse[frame];
            } else {
                return aaRevCom[frame];
            }
        }
    }
});
