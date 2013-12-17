/**
 * @class Teselagen.bio.enzymes.RestrictionEnzymeMapper
 * @singleton
 * Restriction enzyme mapper- finds restriction enzyme cut sites in DNA sequence.
 * @author Nick Elsbree
 * @author Zinovii Dmytriv (original author)
 */
Ext.define("Teselagen.bio.enzymes.RestrictionEnzymeMapper", {
    singleton: true,

    requires: ["Teselagen.bio.enzymes.RestrictionCutSite",
        "Teselagen.bio.sequence.common.StrandType"],

    /**
     * Cut sequence by list of restriction enzymes.  See Teselagen.bio.enzymes.RestrictionCutSite.
     * @param {Array} restrictionEnzymes List of restriction enzymes to cut sequence with.
     * @param {Teselagen.bio.sequence.dna.DNASequence} symbolList The DNA sequence to be cut.
     * @return
     */
    cutSequence: function(restrictionEnzymes, symbolList) {
        var reCuts = new Ext.util.HashMap();

        for(var i = 0; i < restrictionEnzymes.length; i++) {
            var re = restrictionEnzymes[i];
            reCuts.add(re.getName(), this.cutSequenceByRestrictionEnzyme(re, symbolList));
        }

        return reCuts;
    },

    /**
     * Cut sequence with one restriction enzyme. See Teselagen.bio.enzymes.RestrictionCutSite.
     * @param {RestrictionEnzyme} restrictionEnzyme Restriction enzyme to cut the sequence with.
     * @param {SymbolList} symbolList DNA sequence.
     * @return {Array} List of RestrictionCutSite's.
     */
    cutSequenceByRestrictionEnzyme: function(restrictionEnzyme, symbolList) {
        var restrictionCutSites = new Array();
        var restrictionCutSite;

        var forwardRegExpPattern = new RegExp(restrictionEnzyme.getForwardRegex().toLowerCase(), "g");
        var reverseRegExpPattern = new RegExp(restrictionEnzyme.getReverseRegex().toLowerCase(), "g");

        var reLength = restrictionEnzyme.getSite().length;
        if(reLength != restrictionEnzyme.getDsForward() + restrictionEnzyme.getDsReverse()) {
            reLength = restrictionEnzyme.getDsForward();
        }

        if(!symbolList) return null;
        var sequence = symbolList.seqString();
        var seqLength = sequence.length;

        var matchIndex = sequence.search(forwardRegExpPattern);
        var startIndex = 0;
        var subSequence = sequence;

        var start;
        var end;

        while(matchIndex != -1) {
            if(matchIndex + startIndex + reLength - 1 >= sequence.length) { // subSequence is too short
                break;
            }

            start = matchIndex + startIndex;
            end = matchIndex + reLength + startIndex;

            restrictionCutSite = Ext.create("Teselagen.bio.enzymes.RestrictionCutSite", {
                start: start,
                end: end,
                strand: Teselagen.bio.sequence.common.StrandType.FORWARD,
                restrictionEnzyme: restrictionEnzyme
            });
            restrictionCutSites.push(restrictionCutSite);

            // Make sure that we always store the previous match index to ensure
            // that we are always storing indices relative to the whole sequence,
            // not just the subSequence.
            startIndex = startIndex + matchIndex + 1;

            // Search again on subSequence, starting from the index of the last match + 1.
            subSequence = sequence.substring(startIndex, sequence.length);
            matchIndex = subSequence.search(forwardRegExpPattern);
        }

        if(!restrictionEnzyme.isPalindromic()) {
            matchIndex = sequence.search(reverseRegExpPattern);
            startIndex = 0;
            subSequence = sequence;
            while(matchIndex != -1) {
                if(matchIndex + startIndex + reLength - 1 >= sequence.length) { // subSequence is too short
                    break;
                }

                start = matchIndex + startIndex -
                    (restrictionEnzyme.getDsForward() - restrictionEnzyme.getSite().length);
                end = start + reLength;

                if(start >= 0) {
                    restrictionCutSite = Ext.create("Teselagen.bio.enzymes.RestrictionCutSite", {
                        start: start,
                        end: end,
                        strand: Teselagen.bio.sequence.common.StrandType.BACKWARD,
                        restrictionEnzyme: restrictionEnzyme
                    });

                    restrictionCutSites.push(restrictionCutSite);
                }

                // Make sure that we always store the previous match index to ensure
                // that we are always storing indices relative to the whole sequence,
                // not just the subSequence.
                startIndex = startIndex + matchIndex + 1;

                // Search again on subSequence, starting from the index of the last match + 1.
                subSequence = sequence.substring(startIndex, sequence.length);
                matchIndex = subSequence.search(reverseRegExpPattern);
            }
        }

        return restrictionCutSites;
    }
});
