/**
 * @class Teselagen.bio.sequence.symbols.AminoAcidSymbol
 * This class sets up the data structure for Amino Acids.
 * @author Micah Lerner
 */
Ext.define("Teselagen.bio.sequence.symbols.AminoAcidSymbol",{
	/**
	* Constructor
	* @param  {String} name Full Name
	* @param  {String} value One Letter Symbol
	* @param  {String} threeLettersName Three letter symbol abbreviation
	*/

	constructor: function(inData){
		var name;
		var value;
		var threeLettersName;


		if (inData) {
			name = inData.name;
			value = inData.value
			threeLettersName = inData.threeLettersName;
		}else {
			Teselagen.bio.BioException.raise("Arguments needed");
		}

		/**
		 * Get name.
		 * @return {String} Name
		 */
		this.getName =function(){
			return name;
		}

		/**
		 * Set Name
		 * @method setName
		 * @param {String} pName input name
		 */
		this.setName = function(pName){
			name = pName;
		}

		/**
		 * Get threeLettersName
		 * @method getThreeLettersName
		 * @return {String} returns threelettername
		 */
		this.getThreeLettersName = function(){
			return threeLettersName;
		}

		/**
		 * Set threeLettersName
		 * @method setThreeLettersName
		 * @param {String} pThreeLettersName input threelettersname
		 */
		this.setThreeLettersName = function(pThreeLettersName){
			threeLettersName = pThreeLettersName;
		}

		/**
		 * Get value
		 * @method getValue
		 * @return {String} returns value
		 */
		this.getValue = function() {
			return value;
		}

		/**
		 * Set value
		 * @method setValue
		 * @param {String} pValue input value
		 */
		this.setValue = function(pValue) {
			value = pValue;
		}

		return this;
	},

    serialize: function() {
        return this.getValue();
    },

    deSerialize: function(data, alphabet) {
        var symbol;

        if(!alphabet) {
            this.setName(data.name);
            this.setValue(data.value);
            this.setAmbiguousMatches(data.ambiguousMatches);
        } else {
            symbol = alphabet[data];

            this.setName(symbol.getName());
            this.setValue(symbol.getValue());
            this.setAmbiguousMatches(symbol.getAmbiguousMatches());
        }
    }
});
