Ext.define("Teselagen.bio.BioException", {

	extend: 'Ext.Error',

	constructor: function(input){
		var message = input.message || "Default Message";

		this.getMessage = function(){
			return message;
		}
	}	
});