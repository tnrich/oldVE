
Ext.define("Teselagen.bio.sequence.DNATools", {
	requires: ["Teselagen.bio.sequence.alphabets.DNAAlphabet", 
		    "Teselagen.bio.sequence.common.Sequence", 
		    "Teselagen.bio.sequence.common.SymbolList", 
		    "Teselagen.bio.sequence.dna.DNASequence", 
		    "Teselagen.bio.sequence.symbols.IllegalSymbolException"],

	statics: {
		createDNA: function(pDNASequence){
			var DNASequence = pDNASequence.toLowerCase();
		},

		createDNASequence: function(pName, pDNASequence){

		},

		complementSymbol: function(pSymbol){

		},

		complement: function(pSymbolList){

		},

		reverseComplement: function(pSymbolList){

		}
	},	
});