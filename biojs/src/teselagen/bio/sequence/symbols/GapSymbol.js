    /**
    * GapSymbol class
    * @description This class sets up a Gap Symbol class
    * @author Micah Lerner
    */
   Ext.define("Teselagen.bio.sequence.symbols.GapSymbol",{

	constructor: function(inData){
		var name;
		var value;

		if (inData) {
			name = inData.name;
			value = inData.value
		}else {
			throw Ext.create("Teselagen.bio.BioException", {
				message: "Arguments needed"
			});
		}

		/**
		 * Gets Name
		 * @return {String} gets Name
		 */
		this.getName = function(){
			return name;
		}

		/**
		 * Sets Name
		 * @param {String} pName sets name
		 */
		this.setName = function(pName){
			name = pName;
		}

		/**
		 * Gets Value
		 * @return {String} gets value
		 */
		this.getValue = function(){
			return value;
		}

		/**
		 * Sets Value
		 * @param {String} pValue sets value
		 */
		this.setValue = function(pValue){
			value = pValue;
		}

		return this;
	},




});