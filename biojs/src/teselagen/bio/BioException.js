Ext.define("Teselagen.bio.BioException", {

	extend: 'Ext.Error',

	constructor: function(inData){
		var message = inData.message || "Default Message";

		this.getMessage = function(){
			return message;
		}

        //this.callParent([inData]);
	}

});
