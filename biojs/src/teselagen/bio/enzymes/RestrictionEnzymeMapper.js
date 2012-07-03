/**
 * Restriction enzyme mapper- finds restriction enzyme cut sites in DNA sequence.
 * 
 * @see Teselagen.bio.enzymes.RestrictionEnzyme
 * @see Teselagen.bio.enzymes.RestrictionCutSite
 * 
 * @author Nick Elsbree
 * @author Zinovii Dmytriv (original author)
 */

Ext.require("Teselagen.bio.enzymes.RestrictionCutSite");

Ext.define("Teselagen.bio.enzymes.RestrictionEnzymeMapper", {
	singleton: true,
	
	/**
	 * Cut sequence by list of restriction enzymes.
	 * 
	 * @param {Array} restrictionEnzymes List of restriction enzymes to cut sequence with.
	 * @param {} symbolList The DNA sequence to be cut.
	 * @return 
	 * 
	 * @see Teselegen.bio.enzymes.RestrictionCutSite
	 */
	cutSequence: function(restrictionEnzymes, symbolList) {
		var reCuts = {};
		
		for(var i = 0; i < restrictionEnzymes.length; i++) {
			var re = restrictionEnzymes[i];
			reCuts[re.name] = cutSequenceByRestrictionEnzyme(re, symbolList);
		}
		
		return reCuts;
	},
	
	/**
	 * Cut sequence with one restriction enzyme.
	 * 
	 * @param {RestrictionEnzyme} Restriction enzyme to cut the sequence with.
	 * @param {SymbolList} symbolList DNA sequence.
	 * @return {Array} List of RestrictionCutSite's.
	 * 
	 * @see Teselegen.bio.enzymes.RestrictionCutSite
	 */
	cutSequenceByRestrictionEnzyme: function(restrictionEnzyme, symbolList) {
		var restrictionCutSites = new Array();
		
		var forwardRegExpPattern = new RegExp(restrictionEnzyme.forwardRegex.toLowerCase(), "g");
		var reverseRegExpPattern = new RegExp(restrictionEnzyme.reverseRegex.toLowerCase(), "g");
		
		var reLength = restrictionEnzyme.getSite().length;
		if(reLength != restrictionEnzyme.dsForward + restrictionEnzyme.dsReverse) {
			reLength = restrictionEnzyme.dsForward;
		}
		
		var sequence = symbolList;//.seqString();
		var seqLength = sequence.length;
		
		var matchIndex = sequence.search(forwardRegExpPattern);
		var prevIndex = 0;
		var subSequence = sequence;
		while(match != -1) {
			if(matchIndex + reLength - 1 >= subsequence.length) { // subsequence is too short
				break;
			}
			
			restrictionCutSite = Ext.create("Teselagen.bio.enzymes.RestrictionCutSite", {
				start: matchIndex + prevIndex + 1,
				end: matchIndex + reLength + prevIndex + 1,
				strand: Teselagen.bio.sequence.common.StrandType.FORWARD,
				restrictionEnzyme: restrictionEnzyme
			});
			restrictionCutSites.push(restrictionCutSite);
			
			// Make sure that we always store the previous match index to ensure
			// that we are always storing indices relative to the whole sequence,
			// not just the subsequence.
			prevIndex = matchIndex;
			
			// Search again on subsequence, starting from the index of the last match + 1.
			subSequence = subSequence.substring(matchIndex + 1, subSequence.length - 1);
			matchIndex = subSequence.search(forwardRegExpPattern);
		}
		
		if(!restrictionEnzyme.isPalindromic()) {
			matchIndex = sequence.search(reverseRegExpPattern);
			prevIndex = 0;
			subSequence = sequence;
			while(match != -1) {
				if(matchIndex + reLength - 1 >= subsequence.length) { // subsequence is too short
					break;
				}
				
				restrictionCutSite = Ext.create("Teselagen.bio.enzymes.RestrictionCutSite", {
					start: matchIndex + prevIndex + 1,
					end: matchIndex + reLength + prevIndex + 1,
					strand: Teselagen.bio.sequence.common.StrandType.BACKWARD,
					restrictionEnzyme: restrictionEnzyme
				});
				restrictionCutSites.push(restrictionCutSite);
				
				// Make sure that we always store the previous match index to ensure
				// that we are always storing indices relative to the whole sequence,
				// not just the subsequence.
				prevIndex = matchIndex;
				
				// Search again on subsequence, starting from the index of the last match + 1.
				subSequence = subSequence.substring(matchIndex + 1, subSequence.length - 1);
				matchIndex = subSequence.search(reverseRegExpPattern);
			}
		}
		
		return restrictionCutSites;
	}
});