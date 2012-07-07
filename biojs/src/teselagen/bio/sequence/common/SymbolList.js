Ext.define("Teselagen.bio.sequence.common.SymbolList", {
	constructor: function(data){
		var symbols;
		var alphabet;
		if (data.symbols && data.alphabet) {
			symbols = data.symbols;
			alphabet = data.alphabet;
		} else {
			throw new Error("Invalid parameters");
		}
		

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
				buffer[i] = symbols[i].getValue().charCodeAt(0);;
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
				console.log("Cool function");
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