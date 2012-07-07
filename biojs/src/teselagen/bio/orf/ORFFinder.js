/**
 * @class Teselagen.bio.orf.ORFFinder
 * @singleton
 *
 * Helper class to find open reading frames in a DNA sequence.
 *
 * @author Nick Elsbree
 * @author Zinovii Dmytriv (original author)
 */
Ext.define("Teselagen.bio.orf.ORFFinder", {
	requires: ["Teselagen.bio.sequence.common.StrandType",
		"Teselagen.bio.sequence.TranslationUtils",
		"Teselagen.bio.sequence.alphabets.ProteinAlphabet",
		"Teselagen.bio.sequence.symbols.GapSymbol"],

	singleton:true,
	/**
	 * Calculates open read frames for a DNA sequence and filters them by a minimum length.
	 * No open read frames shorter than minimumLength will be returned.
	 * 
	 * @param  {SymbolList} dnaSymbolList A DNA sequence.
	 * @param  {Int} minimumLength Minimum ORF length. If value is -1 or not given, no minimum length will be applied.
	 * 
	 * @return {Array<Teselagen.bio.orf.ORF} All open read frames in forward strand with length > minimumLength.
	 */
	calculateORFs: function(dnaSymbolList, minimumLength) {
		if(typeof(minimumLength) === "undefined") {
			minimumLength = -1;
		}

		if(typeof(dnaSymbolList) === "undefined" || dnaSymbolList.seqString().length < 6) {
			return [];
		}

		var orfs1 = this.orfPerFrame(0, dnaSymbolList, minimumLength);
		var orfs2 = this.orfPerFrame(1, dnaSymbolList, minimumLength);
		var orfs3 = this.orfPerFrame(2, dnaSymbolList, minimumLength);

		return orfs1.concat(orfs2, orfs3);
	},

	/**
	 * Calculates open read frames for a DNA sequence in both directions and filters them by a minimum length.
	 * No open read frames shorter than minimumLength will be returned.
	 * 
	 * @param  {SymbolList} forwardSymbolList The forward DNA sequence.
	 * @param  {SymbolList} reverseSymbolList  The reverse DNA sequence.
	 * @param  {Int} minimumLength      Minimum ORF length. If value is -1 or not given, no minimum length will be applied.
	 * 
	 * @return {Array<Teselagen.bio.orf.ORF>} All open read frames in forward and reverse strands with length > minimumLength.
	 */
	calculateORFBothDirections: function(forwardSymbolList, reverseSymbolList, minimumLength) {
		if(typeof(forwardSymbolList) === "undefined" || forwardSymbolList.length < 6) {
			return [];
		}

		var result = [];

		var orfs1Forward = orfPerFrame(0, forwardSymbolList, minimumLength, StrandType.FORWARD);
		var orfs2Forward = orfPerFrame(1, forwardSymbolList, minimumLength, StrandType.FORWARD);
		var orfs3Forward = orfPerFrame(2, forwardSymbolList, minimumLength, StrandType.FORWARD);

		var orfs1Reverse = orfPerFrame(0, forwardSymbolList, minimumLength, StrandType.BACKWARD);
		var orfs2Reverse = orfPerFrame(1, forwardSymbolList, minimumLength, StrandType.BACKWARD);
		var orfs3Reverse = orfPerFrame(2, forwardSymbolList, minimumLength, StrandType.BACKWARD);

		var reverseCombined = orfs1Reverse.concat(orfs2Reverse, orfs3Reverse);

		var sequenceLength = reverseSymbolList.length;
		for(var i = 0; i < reverseCombined.length; i++) {
			var orf = reverseCombined[i];

			var start = sequenceLength - orf.start;
			var end = sequenceLength - orf.end;

			orf.setOneStart(end);
			orf.setOneEnd(start);

			for(var j = 0; j < orf.startCodons.length; j++) {
				orf.startCodons[j] = sequenceLength - orf.startCodons[j] - 1;
			}

			startCodons = orf.getStartCodons();
			startCodons.sort(codonsSort);
			orf.setStartCodons(startCodons);
		}

		return result.concat(orfs1Forward, orfs2Forward, orfs3Forward, reverseCombined);
	},

	/**
	 * @private
	 * Finds ORFs in a given DNA strand in a given frame.
	 * 
	 * @param  {Int} frame The frame to look in.
	 * @param  {Teselagen.bio.sequence.common.SymbolList} dnaSymbolList The dna sequence.
	 * @param  {Int} minimumLength The minimum length of ORF to return.
	 * @param  {Teselagen.bio.sequence.common.StrandType} strand The strand we are looking at.
	 * 
	 * @return {Array<Teselagen.bio.orf.ORF>} The list of ORFs found.
	 */
	orfPerFrame: function(frame, dnaSymbolList, minimumLength, strand) {
		if(typeof(minimumLength) === "undefined") {
			minimumLength = -1;
		}
		if(typeof(strand) === "undefined") {
			strand = 1;
		}

		tu = Ext.create("Teselagen.bio.sequence.TranslationUtils", {
			dnaToRNATranslationTable: null,
			rnaToDNATranslationTable: null,
			aminoAcidsTranslationTable: null
		});

		var orfs = [];
		var sequenceLength = dnaSymbolList.seqString().length;

		var index = frame;
		var startIndex = -1;
		var endIndex = -1;
		var startCodonIndexes = [];
		var possibleStopCodon = false;
		// Loop through sequence and generate list of ORFs.
		while(index + 2 < sequenceLength) {
			var n1 = dnaSymbolList.symbolAt(index);
			var n2 = dnaSymbolList.symbolAt(index + 1);
			var n3 = dnaSymbolList.symbolAt(index + 2);

			var aaSymbol = tu.dnaToProteinSymbol(n1, n2, n3);

			possibleStopCodon = false;

			// Check if current codon could be a stop codon.
			if(aaSymbol === Teselagen.bio.sequence.alphabets.ProteinAlphabet.gap && !tu.isStartCodon(n1, n2, n3)) {
				if(this.evaluatePossibleStop(n1, n2, n3)) {
					possibleStopCodon = true;
				}
			}

			// If we've found a start codon, add its index to startCodonIndexes.
			if(!possibleStopCodon && tu.isStartCodon(n1, n2, n3)) {
				// If we're not currently in an ORF, start evaluating a new potential ORF at current index.
				if(startIndex == -1) {
					startIndex = index;
				}

				if(startCodonIndexes == null) {
					startCodonIndexes = [];
				}
				startCodonIndexes.push(index);

				index += 3;

				continue;
			}

			// If we've reached a stop codon with a corresponding start codon and
			// its length is greater than minimumLength, create an ORF object and add it to orfs.
			if(possibleStopCodon || tu.isStopCodon(n1, n2, n3)) {
				if(startIndex != -1) {
					endIndex = index + 2;
					if(minimumLength == -1 || (Math.abs(endIndex - startIndex) + 1 >= minimumLength)) {
						if(startCodonIndexes == null) {
							startCodonIndexes = [];
						}
						orfs.push(Ext.create("Teselagen.bio.orf.ORF", {
							start: startIndex,
							end: endIndex + 1,
							strand: strand,
							frame: frame,
							startCodons: startCodonIndexes
						}));
					}
				}

				startIndex = -1;
				endIndex = -1;
				startCodonIndexes = null;

			}
			
			index += 3;
		}

		return orfs;
	},

	/**
	 * @private
	 * Takes three nucleotides and determines if they (and their ambiguous matches) form a stop codon.
	 * 
	 * @param  {Teselagen.bio.sequence.symbols (NucleotideSymbol or GapSymbol)} nucleotideOne
	 * @param  {Teselagen.bio.sequence.symbols (NucleotideSymbol or GapSymbol)} nucleotideTwo
	 * @param  {{Teselagen.bio.sequence.symbols (NucleotideSymbol or GapSymbol)}} nucleotideThree
	 * 
	 * @return {Boolean} True if the nucleotides given form a stop codon.
	 */
	evaluatePossibleStop: function(nucleotideOne, nucleotideTwo, nucleotideThree) {
		if(Ext.getClassName(nucleotideOne) === "Teselagen.bio.sequence.symbols.GapSymbol" || 
			(Ext.getClassName(nucleotideTwo) === "Teselagen.bio.sequence.symbols.GapSymbol" || 
			Ext.getClassName(nucleotideThree) === "Teselagen.bio.sequence.symbols.GapSymbol")) {
			return true;
		}

		var n1 = nucleotideOne.getAmbiguousMatches() ? nucleotideOne.getAmbiguousMatches() : [nucleotideOne];
		var n2 = nucleotideTwo.getAmbiguousMatches() ? nucleotideTwo.getAmbiguousMatches() : [nucleotideTwo];
		var n3 = nucleotideThree.getAmbiguousMatches() ? nucleotideThree.getAmbiguousMatches() : [nucleotideThree];

		for(var i1 = 0; i1 < n1.length; i1++) {
			for(var i2 = 0; i2 < n2.length; i2++) {
				for(var i3 = 0; i3 <n3.length; i3++) {
					if(tu.isStopCodon(n1[i1], n2[i2], n3[i3])) {
						return true;
					}
				}
			}
		}

		return false;
	},

	/**
	 * @private
	 * Sorting function for sorting codons.
	 * 
	 * @param a
	 * @param b
	 * @return {Int} Sort order.
	 */
	codonsSort: function(a, b) {
		if(a > b) {
			return 1;
		} else if(a < b) {
			return -1;
		} else {
			return 0;
		}
	}
});