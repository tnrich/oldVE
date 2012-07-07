Ext.define("Teselagen.bio.sequence.symbols.IllegalSymbolException", {

	extend: 'Ext.Error',

	constructor: function(inData){
		var message = inData.message || "Default Message";

		this.getMessage = function(){
			return message;
		}
	}	
});