Ext.define("Teselagen.bio.sequence.alphabets.AbstractAlphabet", {
	constructor: function(data){

		var that = this;
		var gap = Ext.create("Teselagen.bio.sequence.symbols.GapSymbol", {
			name: "Gap",
			value: "-"
		});
		var symbolsMap = [];
		var key = gap.getValue();
		symbolsMap[key] = gap;

		this.getSymbols = function (){
			var symbols = [];
			for (var index in symbolsMap){
				symbols.push(symbolsMap[index]);
			}
			return symbols;
		}

		this.symbolByValue = function(pValue){
			return symbolsMap[pValue];
		}

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

		this.getGap = function(){
			return gap;
		}

		return this;
	}
});