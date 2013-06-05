
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
				case this.DNAAlphabet.a.getValue():
					return this.DNAAlphabet.t;
				case this.DNAAlphabet.t.getValue():
					return this.DNAAlphabet.a;
				case this.DNAAlphabet.g.getValue():
					return this.DNAAlphabet.c;
				case this.DNAAlphabet.c.getValue():
					return this.DNAAlphabet.g;
				case this.DNAAlphabet.y.getValue():
					return this.DNAAlphabet.r;
				case this.DNAAlphabet.r.getValue():
					return this.DNAAlphabet.y;
				case this.DNAAlphabet.s.getValue():
					return this.DNAAlphabet.s;
				case this.DNAAlphabet.w.getValue():
					return this.DNAAlphabet.w;
				case this.DNAAlphabet.k.getValue():
					return this.DNAAlphabet.m;
				case this.DNAAlphabet.m.getValue():
					return this.DNAAlphabet.k;
				case this.DNAAlphabet.b.getValue():
					return this.DNAAlphabet.v;
				case this.DNAAlphabet.v.getValue():
					return this.DNAAlphabet.b;
				case this.DNAAlphabet.d.getValue():
					return this.DNAAlphabet.h;
				case this.DNAAlphabet.h.getValue():
					return this.DNAAlphabet.d;
				case this.DNAAlphabet.n.getValue():
					return this.DNAAlphabet.n;
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
