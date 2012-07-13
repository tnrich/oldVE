/**
 * @class Teselagen.mappers.AAMapper
 * Class which translates the different frames from a sequenceManager.
 * @author Nick Elsbree
 * @author Zinovii Dmytriv (original author)
 */
Ext.define("Teselagen.mappers.AAMapper", {
    extends: "Teselagen.mappers.Mapper",

    /**
     * @param {Teselagen.manager.SequenceManager} sequenceManager The sequenceManager to get sequences from.
     */
    constructor: function(inData) {
        this.callParent(arguments);
        this.addEvent(Teselagen.mappers.MapperEvent.AA_MAPPER_UPDATED);
        
        var aaSequence = ["", "", ""];
        var aaSequenceSparse = ["", "", ""];
        var aaRevCom = ["", "", ""];
        var aaRevComSparse = ["", "", ""];

        var dirty = true;

        this.addEventListener(Teselagen.mappers.MapperEvent.AA_MAPPER_UPDATED,
                             function(){alert("aa mapper updated")});
    },
   
    /**
     * @private
     * Recalculates amino acid sequences.
     */
    recalculate: function() {
        aaSequence = ["", "", ""];
        aaSequenceSparse = ["", "", ""];
        aaRevCom = ["", "", ""];
        aaRevComSparse: ["", "", ""];
   
        if(sequencemanager) {
            this.recalculatenoncircular();
        }

        this.fireEvent(Teselagen.mappers.MapperEvent.AA_MAPPER_UPDATED);
    }
    
    /**
     * @private
     * Helper function to translate the different frames of the sequence.
     */
    recalculateNonCircular: function() {
        var i;
        var sequence = sequenceManager.getSequence();
        var revCom = sequenceManager.getReverseComplementSequence();
        var seqLen = sequence.length;
        var aminoAcid;
        var aminoAcidRevCom;
        var aaString;
        var aaStringRevCom;
        var codon = [];
        var codonRevCom = [];

        aaSequenceArray = [[], [], []];
        aaSequenceSparseArray = [[], [], []];
        revComArray = [[], [], []];
        revComSparse = [[], [], []];

        var tUtils = Ext.create("Teselagen.bio.sequence.TranslationUtils",{});

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
            aaSequenceSparseArray[i % 3].push([aaString, " "].join(""));

            revComArray[i % 3].push(aaStringRevCom);
            revComSparseArray[i % 3].push([aaStringRevCom, " "].join(""));
        }
    },
    
    /**
     * Returns the amino acid sequence of a given frame.
     * @param {Int} frame Which frame to return the amino acid sequence for.
     * @param {Boolean} sparse Whether to return the sparse version of the sequence.
     */
    getSequenceFrame: function(frame, sparse) {
        if(dirty) {
            this.recalculate();
            dirty = false;
        }

        if(sparse) {
            return aaSequenceSparse[frame];
        } else {
            return aaSequence[frame];
        }
    }

    /**
     * Returns the amino acid sequence of a given frame of the reverse complement sequence.
     * @param {Int} frame Which frame to return the amino acid sequence for.
     * @param {Boolean} sparse Whether to return the sparse version of the sequence.
     */
    getRevComFrame: function(frame, sparse) {
        if(dirty) {
            this.recalculate();
            dirty = false;
        }

        if(sparse) {
            return aaRevComSparse[frame];
        } else {
            return aaRevCom[frame];
        }
    }
});
