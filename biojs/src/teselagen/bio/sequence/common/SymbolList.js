/**
 * @class Teselagen.bio.sequence.common.SymbolList
 * Main class for all sequences in the library.
 * 
 * @author Micah Lerner
 */
Ext.define("Teselagen.bio.sequence.common.SymbolList", {
	/**
	 * Constructor
	 * @param  {Array <Symbols>} symbols The array of symbols in the SymbolList
	 * @param {String} alphabet Alphabet used in the SymbolList
	 */
	constructor: function(inData){
		var symbols;
		var alphabet;
		if (inData) {
			symbols = inData.symbols || null;
			alphabet = inData.alphabet || null;
		} else {
			throw Ext.create("Teselagen.bio.BioException", {
				message: "Arguments needed"
			});
		}
		
		/**
		 * Returns alphabet
		 * @return {String} [description]
		 */
		this.getAlphabet =  function (){
			return alphabet;
		}

		this.setAlphabet = function(pAlphabet){
			alphabet = pAlphabet;
		}

		this.getSymbols = function(){
			return symbols;
		}

		this.setSymbols = function(pSymbols){
			symbols = pSymbols;
		}

		this.getSymbolsLength = function(){
			return symbols.length;
		}

		this.symbolAt = function(pPosition){
			return symbols[pPosition];
		}

		this.hasGap = function(){
			return symbols.indexOf(alphabet.getGap()) > 0;
		}

		this.subList = function(pStart, pEnd){
			var subSymbols = symbols.splice(pStart, pEnd);

			return Ext.create("Teselagen.bio.sequence.common.SymbolList", {
				symbols: subSymbols,
				alphabet: this.alphabet
			});
		}

		this.seqString = function (){
			var buffer = [];
			var string = "";

			for ( var i = 0; i < symbols.length; ++i ) {
				buffer[i] = symbols[i].getValue().charCodeAt(0);
			}

			for(var i = 0; i < buffer.length; i++) {
				string += String.fromCharCode(buffer[i]);
			}

			return string;
		}

		this.clear = function (){
			symbols = [];
		}

		this.addSymbols = function (pSymbols) {
			if (Array.isArray(pSymbols)){
				pSymbols.forEach(function(element){
					symbols.push(element);
				});
			}
		}

		this.deleteSymbols = function (pStart, pLength) {
			symbols.splice(pStart, pLength);
		}

		this.insertSymbols = function (pPosition, pNewSymbols){
			symbols.splice(pPosition, 0, pNewSymbols);
		}

		this.toString = function(){
			return this.seqString();
		}

	}
});