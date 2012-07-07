    /**
    * Nucleotide Symbol class
    * @description This class sets up a Nucleotide Symbol class
    * @author Micah Lerner
    */
   
Ext.define("Teselagen.bio.sequence.symbols.NucleotideSymbol",{

	constructor: function(data){
		var name = data.name;
		var value = data.value;
		var ambiguousMatches = data.ambiguousMatches;

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