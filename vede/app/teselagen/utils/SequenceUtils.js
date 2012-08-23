/**
 * @class Teselagen.utils.SequenceUtils
 *
 * 
 * 
 * @author Diana Wong
 * @author Zinovii Dmytriv (original author of SequenceUtils.as)
 */

Ext.define("Teselagen.utils.SequenceUtils", {


    requires: [
        "Teselagen.bio.sequence.DNATools",
        "Teselagen.bio.sequence.alphabets.DNAAlphabet",
        "Teselagen.bio.sequence.dna.DNASequence"
    ],

    singleton: true,

    //DNAAlphabet: Teselagen.bio.sequence.alphabets.DNAAlphabet,
    DNAAlphabet: null,
    RNAAlphabet: null,

    constructor: function() {
        DNAAlphabet = Teselagen.bio.sequence.alphabets.DNAAlphabet;
        RNAAlphabet = Teselagen.bio.sequence.alphabets.RNAAlphabet;
    },

    COMPATIBLE_SYMBOLS: [
    	" ", 
    	"\t", 
    	"\n", 
    	"\r", 
    	"0", 
    	"1", 
    	"2", 
    	"3", 
    	"4", 
    	"5", 
    	"6", 
    	"7", 
    	"8", 
    	"9"
    ], 

    /**
     * Determines if sequence compatible: 
     * Has characters like 0-9, ATGCYRSWKMBVDHN, &lt;newline&gt;, &lt;space&gt;, &lt;tab&gt;, &lt;return&gt;
     * Original version includes "U" but this is an RNA nucleotide, so it is not included here.
     * @param {String} pSequence
     * @returns {Boolean} compatible Is or is not compatible.
     */
    isCompatibleSequence: function(pSequence) {
    	var dnaResult = true;
        var rnaResult = true;

        dnaResult = this.isCompatibleDNASequence(pSequence);
        rnaResult = this.isCompatibleRNASequence(pSequence);
    	return dnaResult || rnaResult;
    },

    /**
     * Determines if DNA sequence iscompatible: 
     * Has characters like 0-9, ATGCYRSWKMBVDHN, &lt;newline&gt;, &lt;space&gt;, &lt;tab&gt;, &lt;return&gt;
     * @param {String} pSequence
     * @returns {Boolean} compatible Is or is not compatible.
     */
    isCompatibleDNASequence: function(pSequence) {
        var result = true;

        pSequence = pSequence.toLowerCase();

        for (var i=0; i < pSequence.length; i++) {
            if (DNAAlphabet.symbolByValue(pSequence.charAt(i)) !== undefined) {
                continue;
            } else if (Ext.Array.contains(this.COMPATIBLE_SYMBOLS, pSequence.charAt(i))) {
                continue;
            } else {
                result = false;
                break;
            }
        }
        return result;
    },
    /**
     * Determines if RNA sequence iscompatible: 
     * Has characters like 0-9, AUGCYRSWKMBVDHN, &lt;newline&gt;, &lt;space&gt;, &lt;tab&gt;, &lt;return&gt;
     * @param {String} pSequence
     * @returns {Boolean} compatible Is or is not compatible.
     */
    isCompatibleRNASequence: function(pSequence) {
        var result = true;

        pSequence = pSequence.toLowerCase();

        for (var i=0; i < pSequence.length; i++) {
            if (RNAAlphabet.symbolByValue(pSequence.charAt(i)) !== undefined) {
                continue;
            } else if (Ext.Array.contains(this.COMPATIBLE_SYMBOLS, pSequence.charAt(i))) {
                continue;
            } else {
                result = false;
                break;
            }
        }
        return result;
    },


    /**
     * Purifies sequence to be compatible. Ignores bad characters
     * has characters like 0-9, ATUGCYRSWKMBVDHN, &lt;newline&gt;, &lt;space&gt;, &lt;tab&gt;, &lt;return&gt;
     * @param {String} pSequence
     * @returns {String} result Cleaned sequence
     */
    purifyCompatibleSequence: function(pSequence) {
    	var result = [];

    	pSequence = pSequence.toLowerCase();

    	for (var i=0; i < pSequence.length; i++) {
    		var currentCharacter = pSequence.charAt(i);

    		if (Ext.Array.contains(this.COMPATIBLE_SYMBOLS, pSequence.charAt(i))) {
    			continue;
    		} else if (DNAAlphabet.symbolByValue(pSequence.charAt(i))) {
    			result.push(pSequence.charAt(i));
    		} else if (RNAAlphabet.symbolByValue(pSequence.charAt(i))) {
    			result.push(pSequence.charAt(i));
    		} else {
    			//result += "";
    		}
    	}
    	return result.join("");
    },

    /**
     * Purifies DNA sequence to be compatible. Ignores bad characters
     * has characters like 0-9, ATGCYRSWKMBVDHN, &lt;newline&gt;, &lt;space&gt;, &lt;tab&gt;, &lt;return&gt;
     * Original version includes "U" but this is an RNA nucleotide, so it is not included here.
     * @param {String} pSequence
     * @returns {String} result Cleaned sequence
     */
    purifyCompatibleDNASequence: function(pSequence) {
    	var result = [];

    	pSequence = pSequence.toLowerCase();

    	for (var i=0; i < pSequence.length; i++) {
    		var currentCharacter = pSequence.charAt(i);

    		if (Ext.Array.contains(this.COMPATIBLE_SYMBOLS, pSequence.charAt(i))) {
    			continue;
    		} else if (DNAAlphabet.symbolByValue(pSequence.charAt(i))) {
    			result.push(pSequence.charAt(i));
    		} else {
    		}
    	}
    	return result.join("");
    },

    /**
     * Purifies RNA sequence to be compatible. Ignores bad characters
     * has characters like 0-9, AUGCYRSWKMBVDHN, &lt;newline&gt;, &lt;space&gt;, &lt;tab&gt;, &lt;return&gt;
     * @param {String} pSequence
     * @returns {String} result Cleaned sequence
     */
    purifyCompatibleRNASequence: function(pSequence) {
    	var result = [];

    	pSequence = pSequence.toLowerCase();

    	for (var i=0; i < pSequence.length; i++) {
    		var currentCharacter = pSequence.charAt(i);

    		if (Ext.Array.contains(this.COMPATIBLE_SYMBOLS, pSequence.charAt(i))) {
    			continue;
    		} else if (RNAAlphabet.symbolByValue(pSequence.charAt(i))) {
    			result.push(pSequence.charAt(i));
    		} else {
    		}
    	}
    	return result.join("");
    },

    // ===========================================================================
    //   SequenceManager  Conversions
    // ===========================================================================

    /**
     * Converts a FASTA file into a SequenceManager form of the data.
     * @param {String} pFasta FASTA formated string
     * @returns {Teselagen.bio.sequence.common.Sequence} sequence A Sequence model of your data
     * @returns {Teselagen.models.FeaturedDNASequence} featuredDNASequence or this output
     */
    fastaToFeaturedDNASequence: function(pFasta) {
        var result; // original wants this to be a FeaturedDNASequence NOT SeqMgr!

        var lineArr = String(pFasta).split(/[\n]+|[\r]+/);
        var seqArr  = [];
        var name    = "";
        var sequence = "";

        if (Ext.String.trim(lineArr[0]).charAt(0) === ">") {
            var nameArr = lineArr[0].match(/^>[\s]*[\S]*/);
            if (nameArr !== null && nameArr.length >= 1) {
                name = nameArr[0].replace(/^>/, "");
            }
        }

        for (var i=0; i < lineArr.length; i++) {

            if ( !lineArr[i].match(/^\>/) ) {
                sequence += Ext.String.trim(lineArr[i]);
            }
        }
        sequence = sequence.replace(/[\d]|[\s]/g, "").toLowerCase(); //remove whitespace and digits
        if (sequence.match(/[^ACGTRYMKSWHBVDNacgtrymkswhbvdn]/)) {
            //illegalcharacters
            return null;
        }
        //console.log(sequence);

        //result = Teselagen.bio.sequence.DNATools.createDNASequence(name, sequence);

        result = Ext.create("Teselagen.models.FeaturedDNASequence", {
            name: name,
            sequence: sequence,
            isCiruclar: false, //assume linear
            features: [] //none
        });

        /*result = Ext.create("Teselagen.manager.SequenceManager", {
            name: name,
            circular: false,
            sequence: eselagen.bio.sequence.DNATools.createDNASequence(name, sequence),
            features: []
        });*/

        return result;
    },

    /**
     * Converts a JbeiSeq XML file into a SequenceManager form of the data.
     * @param {JbeiSeq} jbeiSeq 
     * @returns {Teselagen.manager.SequenceManager} sequenceManager A sequenceManager model of your data
     * @returns {Teselagen.models.FeaturedDNASequence} featuredDNASequence or this output?
     */
    jbeiseqXmlToSequenceManager: function(jbeiSeq) {
        var result; /// original wants this to be a FeaturedDNASequence NOT SeqMgr!

        var xmlData;

        //try {
            var gb      = Teselagen.bio.parsers.ParsersManager.jbeiseqxmlToGenbank(jbeiXml);
            //if (LOG) console.log(gb.toString());
            //if (LOG) console.log(JSON.stringify(gb, null, "    "));
        //} catch (bio) {
        //    console.warn("Caught: " + bio.message);
        //}

        result = this.fromGenbank(gb);


        return result;
    },

    sequenceManagerTojbeiseqJson: function(seqMan) {

    }


});