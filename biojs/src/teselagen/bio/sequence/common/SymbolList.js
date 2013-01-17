/**
 * @class Teselagen.bio.sequence.common.SymbolList
 * Main class for all sequences in the library.
 * 
 * @author Micah Lerner
 */
//Ext.require("Teselagen.bio.sequence.alphabets.DNAAlphabet");
Ext.define("Teselagen.bio.sequence.common.SymbolList", {
	/**
	 * Constructor
	 * @param  {Symbols[]} symbols The array of symbols in the SymbolList
	 * @param {String} alphabet Alphabet used in the SymbolList
	 */


	requires: ["Teselagen.bio.sequence.alphabets.DNAAlphabet",
			 "Teselagen.bio.sequence.alphabets.ProteinAlphabet", 
			 "Teselagen.bio.sequence.alphabets.RNAAlphabet",
			 "Teselagen.bio.sequence.symbols.GapSymbol", 
			 "Teselagen.bio.sequence.symbols.IllegalSymbolException"],

	constructor: function(inData){
		var symbols;
		var alphabet;
		if (inData) {
			symbols = inData.symbols || null;
			alphabet = inData.alphabet || null;
		} else {
			Teselagen.bio.BioException.raise("Arguments needed");
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
		 * @method setAlphabet
		 * @param {Alphabet} pAlphabet an input alphabet
		 */
		this.setAlphabet = function(pAlphabet){
			alphabet = pAlphabet;
		}

		/**
		 * Returns the object's symbols
		 * @method getSymbols
		 * @return {Symbols[]} the objects symbols
		 */
		this.getSymbols = function(){
			return symbols;
		}

		/**
		 * Sets the objects' symbols.
		 * @method setSymbols
		 * @param {Symbols[]} pSymbols the objects symbols
		 */
		this.setSymbols = function(pSymbols){
			symbols = pSymbols;
            this.sequenceChanged = true;
		}

		/**
		 * Returns the number of symbols in the list
		 * @method getSymbolsLength
		 * @return {Integer} the number of symbols in the list
		 */	
		this.getSymbolsLength = function(){
			return symbols.length;
		}

		/**
		 * Gets the symbol at a specific position
		 * @method symbolAt
		 * @param  {Integer} pPosition a specified position within the symbols
		 * @return {Symbols}           the symbol at the specified position
		 */
		this.symbolAt = function(pPosition){
			return symbols[pPosition];
		}

		/**
		 * Returns whether the symbollist has a gap
		 * @method hasGap
		 * @return {Boolean} returns whether the alphabet has a gap
		 */
		this.hasGap = function(){
          //  var alphabetObject = Ext.create("Teselagen.bio.sequence.alphabets.DNAAlphabet");
           // console.log(alphabetObject.superclass.getGap().getName());
            var hasGapBoolean = symbols.some(function(element){
                 
			    return (element instanceof Teselagen.bio.sequence.symbols.GapSymbol); 
                 
            });	
            return hasGapBoolean;
        }

		/**
		 * Returns a sublist of symbols
		 * @method subList
		 * @param  {Integer} pStart start of slice
		 * @param  {Integer} pEnd   End of slice
		 * @return {SymbolList}        a spliced array of symbols
		 */
		this.subList = function(pStart, pEnd){
			var subSymbols = symbols.slice(pStart, pEnd);

			return Ext.create("Teselagen.bio.sequence.common.SymbolList", {
				symbols: subSymbols,
				alphabet: alphabet
			});
		}

		/**
		 * Turns the symbol list into a string
		 * @method seqString
		 * @return {String} the sequence's string
		 */	
		this.seqString = function (){
			var string = [];
            if(this.sequenceString && !this.sequenceChanged) {
                return this.sequenceString;
            }
            else {
                symbols.forEach(function(element){
                    if (Ext.getClassName(element).indexOf("Teselagen.bio.sequence.symbols.") !== -1) {
                        string.push(element.getValue());
                    }
                });

                this.sequenceChanged = false;
            }

			this.sequenceString = string.join("");
            return this.sequenceString;
		}

		/**
		 * Deletes symbols
		 * @method clear
		 */
		this.clear = function (){
			symbols = [];
            this.sequenceChanged = true;
		}

		/**
		 * Adds a specified symbol
		 * @method addSymbols
		 * @param {Symbols[]} pSymbols Array of symbols you want to add
		 */
		this.addSymbols = function (pSymbols) {
			if (Array.isArray(pSymbols)){
				pSymbols.forEach(function(element){
					symbols.push(element);
				});
                this.sequenceChanged = true;
			}
		}

		/**
		 * Adds a SymbolList to existing SymbolList.
		 * (DW: Added 7/26/2012 because addSymbols is specific to an array of symbols)
		 * @method addSymbolList
		 * @param {Teselagen.bio.sequence.common.SymbolList} pSymbols Symbols you want to add
		 */
		this.addSymbolList = function (pSymbols) {
			/*if (Array.isArray(pSymbols)){
				pSymbols.forEach(function(element){
					symbols.push(element);
				});
			}*/
			// DW: 7/26/2012 Redid this. a Symbol
			if (pSymbols && pSymbols.getSymbolsLength() > 0) {
				for (var i=0; i < pSymbols.getSymbolsLength(); i++) {
					symbols.push(pSymbols.getSymbols()[i]);
				}
                this.sequenceChanged = true;
			}
		}
		/**
		 * Deletes a subset of symbols
		 * @method deleteSymbols
		 * @param  {Integer} pStart  A start to the slice
		 * @param  {Integer} pLength The length of the delete (how many symbols to delete)
		 */
		this.deleteSymbols = function (pStart, pLength) {
			symbols.splice(pStart, pLength);
            this.sequenceChanged = true;
		}

		/**
		 * Inserts a symbol list at a position (using non-zero-based  cardinal index) 
		 * @method insertSymbols
		 * @param  {Integer} pPosition   The position the symbols should be inserted at
		 * @param  {Symbols[]} pNewSymbols The symbols to be added
		 */
		this.insertSymbols = function (pPosition, pNewSymbols){
			// Slices [0, pPosition)
			var beforeInsert= symbols.slice(0, pPosition);
			var afterInsert = symbols.slice(pPosition);
			symbols = beforeInsert.concat(pNewSymbols).concat(afterInsert);
            this.sequenceChanged = true;
		}

		/**
		 * Returns the string sequence
		 * @method toString
		 * @return {String} The Object's sequence
		 */
		this.toString = function(){
			return this.seqString();
		}

	}
});
