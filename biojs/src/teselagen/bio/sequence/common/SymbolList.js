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
		 * @return {alphabet} the symbol list's alphabet
		 */
		this.getAlphabet =  function (){
			return alphabet;
		}

		/**
		 * Sets Alphabet
		 * @param {Alphabet} pAlphabet an input alphabet
		 */
		this.setAlphabet = function(pAlphabet){
			alphabet = pAlphabet;
		}

		/**
		 * Returns the object's symbols
		 * @return {Array <Symbols>} the objects symbols
		 */
		this.getSymbols = function(){
			return symbols;
		}

		/**
		 * Sets the objects' symbols.
		 * @param {Array <Symbols>} pSymbols the objects symbols
		 */
		this.setSymbols = function(pSymbols){
			symbols = pSymbols;
		}

		/**
		 * Returns the number of symbols in the list
		 * @return {Integer} the number of symbols in the list
		 */	
		this.getSymbolsLength = function(){
			return symbols.length;
		}

		/**
		 * Gets the symbol at a specific position
		 * @param  {Integer} pPosition a specified position within the symbols
		 * @return {Symbols}           the symbol at the specified position
		 */
		this.symbolAt = function(pPosition){
			return symbols[pPosition];
		}

		/**
		 * Returns whether the symbollist has a gap
		 * @return {Boolean} returns whether the alphabet has a gap
		 */
		this.hasGap = function(){
			return symbols.indexOf(alphabet.getGap()) > 0;
		}

		/**
		 * Returns a sublist of symbols
		 * @param  {Integer} pStart start of slice
		 * @param  {Integer} pEnd   End of slice
		 * @return {SymbolList}        a spliced array of symbols
		 */
		this.subList = function(pStart, pEnd){
			var subSymbols = symbols.splice(pStart, pEnd);

			return Ext.create("Teselagen.bio.sequence.common.SymbolList", {
				symbols: subSymbols,
				alphabet: alphabet
			});
		}

		/**
		 * Turns the symbol list into a string
		 * @return {Striing} the sequence's string
		 */	
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

		/**
		 * Deletes symbols
		 */
		this.clear = function (){
			symbols = [];
		}

		/**
		 * Adds a specified symbol
		 * @param {Symbol} pSymbols A symbol you want to add
		 */
		this.addSymbols = function (pSymbols) {
			if (Array.isArray(pSymbols)){
				pSymbols.forEach(function(element){
					symbols.push(element);
				});
			}
		}

		/**
		 * Deletes a subset of symbols
		 * @param  {Integer} pStart  A start to the slice
		 * @param  {Integer} pLength The length of the delete
		 */
		this.deleteSymbols = function (pStart, pLength) {
			symbols.splice(pStart, pLength);
		}

		/**
		 * Inserts a symbol list
		 * @param  {Integer} pPosition   The position the symbols should be inserted at
		 * @param  {Array <Symbols>} pNewSymbols The symbols to be added
		 */
		this.insertSymbols = function (pPosition, pNewSymbols){
			symbols.splice(pPosition, 0, pNewSymbols);
		}

		/**
		 * Returns the string sequence
		 * @return {String} The Object's sequence
		 */
		this.toString = function(){
			return this.seqString();
		}

	}
});