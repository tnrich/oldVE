Ext.define("Teselagen.bio.sequence.symbols.IllegalSymbolException", {

	extend: 'Ext.Error',

	constructor: function(inData){
		var message;
		if (inData) {
			message = inData.message || "Default Message";
		} else {
			throw Ext.create("Teselagen.bio.BioException", {
				message: "Arguments needed"
			});
		}
		

		this.getMessage = function(){
			return message;
		}
	}	
});