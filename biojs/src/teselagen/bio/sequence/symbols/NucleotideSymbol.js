    /**
    * Nucleotide Symbol class
    * @description This class sets up a Nucleotide Symbol class
    * @author Micah Lerner
    */
   
Ext.define("Teselagen.bio.sequence.symbols.NucleotideSymbol",{

	/**
	* Contructor
	* 
	* @param name Symbol full name
	* @param value One letter symbol value
	* @param ambiguousMatches List of ambiguos matches for this symbol. For example nucleotide symbol 'M' can by either 'A' or 'C', so abiguous matches are {'A', 'C'}
	*/
	constructor: function(inData){
		var name;
		var value
		var ambiguousMatches;

		if (inData) {
			name = inData.name;
			value = inData.value;
			ambiguousMatches = inData.ambiguousMatches;
		} else {
			throw Ext.create("Teselagen.bio.BioException", {
				message: "Arguments needed"
			});
		}

		/**
		 * getName
		 * @return {String} get Name
		 */
		this.getName = function(){
			return name;
		}

		/**
		 * Set name
		 * @param {String} pName sets name
		 */
		this.setName = function(pName){
			name = pName;
		}


		/**
		 * Gets value
		 * @return {String} gets Value
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

		/**
		 * Gets ambigous matches
		 * @return {Array <Symbols>} Returns an array of the ambiguous matches
		 */		
		this.getAmbiguousMatches = function(){
			return ambiguousMatches;
		}

		/**
		 * Sets ambiguous matches
		 * @param {Array <Symbols>} pAmbiguousMatches sets ambiguous matches
		 */
		this.setAmbiguousMatches = function(pAmbiguousMatches){
			ambiguousMatches = pAmbiguousMatches;
		}

		return this;
	},

});