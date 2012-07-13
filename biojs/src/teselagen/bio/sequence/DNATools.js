
/**
 * @class Teselagen.bio.sequence.DNATools
 * 
 * DNA tools. Main class used to create DNA sequences.
 * @see Teselagen.bio.sequence.symbols.NucleotideSymbol
 * @author Micah Lerner
 * @author Zinovii Dmytriv (original author)
 */
Ext.define("Teselagen.bio.sequence.DNATools", {
	requires: ["Teselagen.bio.sequence.alphabets.DNAAlphabet", 
		    "Teselagen.bio.sequence.common.Sequence", 
		    "Teselagen.bio.sequence.common.SymbolList", 
		    "Teselagen.bio.sequence.dna.DNASequence", 
		    "Teselagen.bio.sequence.symbols.IllegalSymbolException"],

	statics: {
		/**
		 * Creates SymbolList from DNA sequence
		 * @param  {String} pDNASequence A DNA sequence
		 * @return {SymbolList}              A symbol lits
		 */
		createDNA: function(pDNASequence){
			var DNASequence = pDNASequence.toLowerCase();
			var symbols = [];

			for (var i = 0; i < DNASequence.length; i++) {

				var symbol = Teselagen.bio.sequence.alphabets.DNAAlphabet.symbolMap(DNASequence.charAt(i));
				if (symbol == null) {
					throw Ext.create("Teselagen.bio.sequence.symbols.IllegalSymbolException", {
						message: null
					});
				} else {
					symbols.push(symbol);
				}
			};

			return Ext.create("Teselagen.bio.sequence.common.SymbolList", {
				symbols: symbols,
				alphabet: "Teselagen.bio.sequence.alphabets.DNAAlphabet"
			});
		},

		/**
		 * Creates a DNA Sequence from an input Sequence
		 * @param  {String} pName        The name of the Sequence
		 * @param  {String} pDNASequence the DNA sequence
		 * @return {DNASequence}              A created DNA sequence
		 */
		createDNASequence: function(pName, pDNASequence){
			return Ext.create("Teselagen.bio.sequence.dna.DNASequence", {
				symbolList: this.createDNA(pDNASequence),
				name: pName
			});
		},

		/**
		 * Retrieves the symbol's complement
		 * @param  {Symbol} pSymbol An input symbol
		 * @return {Symbol}         The input symbol's complement
		 */
		complementSymbol: function(pSymbol){
			switch(pSymbol.getValue()) {
				case Teselagen.DNAAlphabet.getA().getValue():
					return Teselagen.DNAAlphabet.getT();
				case Teselagen.DNAAlphabet.getT().getValue():
					return Teselagen.DNAAlphabet.getA();
				case Teselagen.DNAAlphabet.getG().getValue():
					return Teselagen.DNAAlphabet.getC();
				case Teselagen.DNAAlphabet.getC().getValue():
					return Teselagen.DNAAlphabet.getG();
				case Teselagen.DNAAlphabet.getY().getValue():
					return Teselagen.DNAAlphabet.getR();
				case Teselagen.DNAAlphabet.getR().getValue():
					return Teselagen.DNAAlphabet.getY();
				case Teselagen.DNAAlphabet.getS().getValue():
					return Teselagen.DNAAlphabet.getS();
				case Teselagen.DNAAlphabet.getW().getValue():
					return Teselagen.DNAAlphabet.getW();
				case Teselagen.DNAAlphabet.getK().getValue():
					return Teselagen.DNAAlphabet.getM();
				case Teselagen.DNAAlphabet.getM().getValue():
					return Teselagen.DNAAlphabet.getK();
				case Teselagen.DNAAlphabet.getB().getValue():
					return Teselagen.DNAAlphabet.getV();
				case Teselagen.DNAAlphabet.getV().getValue():
					return Teselagen.DNAAlphabet.getB();
				case Teselagen.DNAAlphabet.getD().getValue():
					return Teselagen.DNAAlphabet.getH();
				case Teselagen.DNAAlphabet.getH().getValue():
					return Teselagen.DNAAlphabet.getD();
				case Teselagen.DNAAlphabet.getN().getValue():
					return Teselagen.DNAAlphabet.getN();
				case Teselagen.DNAAlphabet.getGap().getValue():
					return Teselagen.DNAAlphabet.getGap();
				default:
					throw Ext.create("Teselagen.bio.sequence.symbols.IllegalSymbolException", {
						message: "Failed to find complement for symbol '" + symbol.value + ".'"
					});
			}
		},

		/**
		 * Retrieves the complement for a SymbolList
		 * @param  {SymbolList} pSymbolList an input symbol list
		 * @return {SymbolList}             The input's complement strand.
		 */
		complement: function(pSymbolList){
			var symbols = pSymbolList.getSymbols();
			var complementSymbols = [];

			if (symbols.length > 0) {
				for (var i = 0; i < symbols.length; i++) {

					complementSymbols.push(this.complementSymbol(symbols[i]));
				};
			};

			return Ext.create("Teselagen.bio.sequence.common.SymbolList", {
				symbols: complementSymbols,
				alphabet: "Teselagen.bio.sequence.alphabets.DNAAlphabet"
			});
		},

		/**
		 * Reverse complement of the input symbol list
		 * @param  {SymbolList} pSymbolList An input symbol List
		 * @return {SymbolList}            The reverse complement of the
		 */
		reverseComplement: function(pSymbolList){
			var symbols = pSymbolList.getSymbols();
			var reverseComplementSymbols = [];
			for (var i = symbols.length - 1; i >= 0; --i){
				reverseComplementSymbols.push(this.complementSymbol(symbols[i]));
			}


			return Ext.create("Teselagen.bio.sequence.common.SymbolList", {
				symbols: reverseComplementSymbols,
				alphabet: "Teselagen.bio.sequence.alphabets.DNAAlphabet"
			});
		},
	},	
});
