    /**
    * Nucleotide Symbol class
    * @description This class sets up a Nucleotide Symbol class
    * @author Micah Lerner
    */
   
Ext.define("Teselagen.bio.sequence.symbols.NucleotideSymbol",{

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

		this.getName = function(){
			return name;
		}

		this.setName = function(pName){
			name = pName;
		}

		this.getValue = function(){
			return value;
		}

		this.setValue = function(pValue){
			value = pValue;
		}

		this.getAmbiguousMatches = function(){
			return ambiguousMatches;
		}

		this.setAmbiguousMatches = function(pAmbiguousMatches){
			ambiguousMatches = pAmbiguousMatches;
		}

		return this;
	},

});