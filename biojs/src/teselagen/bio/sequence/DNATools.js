
/**
 * @class Teselagen.bio.sequence.DNATools
 * Main class used to create DNA sequences. See Teselagen.bio.sequence.symbols.NucleotideSymbol.
 * @author Micah Lerner
 * @author Zinovii Dmytriv (original author)
 */
Ext.define("Teselagen.bio.sequence.DNATools", {
	requires: ["Teselagen.bio.sequence.alphabets.DNAAlphabet", 
		    "Teselagen.bio.sequence.common.Sequence", 
		    "Teselagen.bio.sequence.common.SymbolList", 
		    "Teselagen.bio.sequence.dna.DNASequence", 
		    "Teselagen.bio.sequence.symbols.IllegalSymbolException"],

        singleton: true,

        constructor: function() {
            this.DNAAlphabet = Teselagen.bio.sequence.alphabets.DNAAlphabet;
        },
		/**
		 * Creates SymbolList from DNA sequence
		 * @param  {String} pDNASequence A DNA sequence
		 * @return {SymbolList}              A symbol lits
		 */
		createDNA: function(pDNASequence){
			var DNASequence = pDNASequence.toLowerCase();
			var symbols = [];

			for (var i = 0; i < DNASequence.length; i++) {

				var symbol = this.DNAAlphabet.symbolMap(DNASequence.charAt(i));
				if (symbol == null) {
					//Teselagen.bio.sequence.symbols.IllegalSymbolException.raise("Failed to find complement for symbol '" + symbol.value + ".'");
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
				case this.DNAAlphabet.getA().getValue():
					return this.DNAAlphabet.getT();
				case this.DNAAlphabet.getT().getValue():
					return this.DNAAlphabet.getA();
				case this.DNAAlphabet.getG().getValue():
					return this.DNAAlphabet.getC();
				case this.DNAAlphabet.getC().getValue():
					return this.DNAAlphabet.getG();
				case this.DNAAlphabet.getY().getValue():
					return this.DNAAlphabet.getR();
				case this.DNAAlphabet.getR().getValue():
					return this.DNAAlphabet.getY();
				case this.DNAAlphabet.getS().getValue():
					return this.DNAAlphabet.getS();
				case this.DNAAlphabet.getW().getValue():
					return this.DNAAlphabet.getW();
				case this.DNAAlphabet.getK().getValue():
					return this.DNAAlphabet.getM();
				case this.DNAAlphabet.getM().getValue():
					return this.DNAAlphabet.getK();
				case this.DNAAlphabet.getB().getValue():
					return this.DNAAlphabet.getV();
				case this.DNAAlphabet.getV().getValue():
					return this.DNAAlphabet.getB();
				case this.DNAAlphabet.getD().getValue():
					return this.DNAAlphabet.getH();
				case this.DNAAlphabet.getH().getValue():
					return this.DNAAlphabet.getD();
				case this.DNAAlphabet.getN().getValue():
					return this.DNAAlphabet.getN();
				case this.DNAAlphabet.getGap().getValue():
					return this.DNAAlphabet.getGap();
				default:
					Teselagen.bio.sequence.symbols.IllegalSymbolException.raise("Failed to find complement for symbol '" + symbol.value + ".'");
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
});
