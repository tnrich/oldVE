    /**
    * @class Teselagen.bio.sequence.symbols.IllegalSymbolException
    *
    * @author Micah Lerner
    */
Ext.define("Teselagen.bio.sequence.symbols.IllegalSymbolException", {

	extend: 'Ext.Error',
	/**
	 * Constructor
	 * @param  {String} message input message
	 * @return {[type]}        [description]
	 */
	constructor: function(inData){
		var message;
		if (inData) {
			message = inData.message || "Default Message";
		} else {
			throw Ext.create("Teselagen.bio.BioException", {
				message: "Arguments needed"
			});
		}
		
		/**
		 * Get message
		 * @return {String} Gets error message
		 */
		this.getMessage = function(){
			return message;
		}
	}	
});