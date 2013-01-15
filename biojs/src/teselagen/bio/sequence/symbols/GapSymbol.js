    /**
    * @class Teselagen.bio.sequence.symbols.GapSymbol
    * This class models a gap symbol.
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
			Teselagen.bio.BioException.raise("Arguments needed");
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