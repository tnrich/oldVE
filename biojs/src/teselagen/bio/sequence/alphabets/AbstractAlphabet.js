/**
 * @class Teselagen.bio.sequence.alphabets.AbstractAlphabet
 * 
 * Abstract general class for alphabets.
 * 
 * @author Micah Lerner
 * @author Zinovii Dmytriv (original author)
 * @author Timothy Ham (original author)
 */ 
 Ext.define("Teselagen.bio.sequence.alphabets.AbstractAlphabet", {
	requires: ["Teselagen.bio.sequence.symbols.GapSymbol", "Teselagen.bio.BioException"],

	symbolsMap: [],

	constructor: function(inData){
		var gap = Ext.create("Teselagen.bio.sequence.symbols.GapSymbol", {
			name: "Gap",
			value: "-"
		});
		//var symbolsMap = [];
		var key = gap.getValue();

		this.symbolsMap[key] = gap;

		/**
		 * Returns the list of the alphabet's symbols.
		 * @return {Symbols[]} an array of symbols.
		 */
		this.getSymbols = function (){
			var symbols = [];
			for (var index in this.symbolsMap){
				symbols.push(this.symbolsMap[index]);
			}
			return symbols;
		}

		/** 
		 * SYMBOLSMAP ARRAY IS AN EMPTY ARRAY WHEN CALLED FROM DNAAlphabet
		 * Retrieves the symbol that corresponds to the input value.
         * @method symbolByValue
		 * @param  {Symbol} pValue corresponds to the key for a symbol in the map of symbols
		 * @return {Symbol} a symbol in the symbol map.
		 */
		this.symbolByValue = function(pValue){
			return this.symbolsMap[pValue];
		}

		/**
		 * Adds an input symbol to the symbol map.
         * @method addSymbol
		 * @param {Symbol} pSymbol corresponds to the symbol to be added to to the map of symbols
		 */
		this.addSymbol = function(pSymbol){
			console.log(Ext.getClassName(pSymbol).indexOf("Teselagen.bio.sequence.symbols") !== -1);
			//Check the type (in a roundabout kind of way)
			if (Ext.getClassName(pSymbol).indexOf("Teselagen.bio.sequence.symbols") !== -1){
				var key = pSymbol.getValue();
				this.symbolsMap[key] = pSymbol;
			} else {
				throw Ext.create("Teselagen.bio.BioException", {
					message: "You tried adding a non-symbol to symbolsMap"
				});
			}
		}

		/**
		 * Returns the Gap Symbol for the Alphabet
         * @method getGap
		 * @return {Gap Symbol} the gap symbol of the alphabet
		 */
		this.getGap = function(){
			return gap;
		}

		return this;
	}
});