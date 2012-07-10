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
	require: ["Teselagen.bio.sequence.symbols.GapSymbol", "Teselagen.bio.BioException"],
	constructor: function(inData){

		var that = this;
		var gap = Ext.create("Teselagen.bio.sequence.symbols.GapSymbol", {
			name: "Gap",
			value: "-"
		});
		var symbolsMap = [];
		var key = gap.getValue();

		symbolsMap[key] = gap;

		/**
		 * Returns the list of the alphabet's symbols.
		 * @return {Array of Symbols} an array of symbols.
		 */
		this.getSymbols = function (){
			var symbols = [];
			for (var index in symbolsMap){
				symbols.push(symbolsMap[index]);
			}
			return symbols;
		}

		/**
		 * Retrieves the symbol that corresponds to the input value.
		 * @param  {Symbol} pValue corresponds to the key for a symbol in the map of symbols
		 * @return {Symbol} a symbol in the symbol map.
		 */
		this.symbolByValue = function(pValue){
			return symbolsMap[pValue];
		}

		/**
		 * Adds an input symbol to the symbol map.
		 * @param {Symbol} pSymbol corresponds to the symbol to be added to to the map of symbols
		 */
		this.addSymbol = function(pSymbol){
			console.log(Ext.getClassName(pSymbol).indexOf("Teselagen.bio.sequence.symbols") !== -1);
			//Check the type (in a roundabout kind of way)
			if (Ext.getClassName(pSymbol).indexOf("Teselagen.bio.sequence.symbols") !== -1){
				var key = pSymbol.getValue();
				symbolsMap[key] = pSymbol;
			} else {
				throw Ext.create("Teselagen.bio.BioException", {
					message: "You tried adding a non-symbol to symbolsMap"
				});
			}
		}

		/**
		 * Returns the Gap Symbol for the Alphabet
		 * @return {Gap Symbol} the gap symbol of the alphabet
		 */
		this.getGap = function(){
			return gap;
		}

		return this;
	}
});