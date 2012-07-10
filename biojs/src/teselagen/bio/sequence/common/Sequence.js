Ext.define("Teselagen.bio.sequence.common.Sequence", {
	extend: "Teselagen.bio.sequence.common.SymbolList",

	constructor: function(inData){
		var name;

		if (inData) {
			name = inData.name;
			this.callParent([{
				symbols: inData.symbolList.getSymbols(),
				alphabet: inData.symbolList.getAlphabet()
			}]);
		} else {
			throw Ext.create("Teselagen.bio.BioException", {
				message: "Arguments needed"
			});
		}

		this.getName = function(){
			return name;
		}

		this.setName = function(pName){
			name = pName;
		}

		return this;
	}
});