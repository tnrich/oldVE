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
		 * @method setName
		 * @param {String} pName sets name
		 */
		this.setName = function(pName){
			name = pName;
		}

		/**
		 * Gets Value
		 * @method getValue
		 * @return {String} gets value
		 */
		this.getValue = function(){
			return value;
		}

		/**
		 * Sets Value
		 * @method setValue
		 * @param {String} pValue sets value
		 */
		this.setValue = function(pValue){
			value = pValue;
		}

		return this;
	},

    serialize: function() {
        return this.getValue();
    },

    deSerialize: function(data, alphabet) {
        var symbol = alphabet.getGap();

        if(!alphabet) {
            this.setName(data.name);
            this.setValue(data.value);
        } else {
            this.setName(symbol.getName());
            this.setValue(symbol.getValue());
        }
    }
});
