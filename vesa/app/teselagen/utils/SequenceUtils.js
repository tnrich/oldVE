/**
 * @class Teselagen.utils.SequenceUtils
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
    }

});