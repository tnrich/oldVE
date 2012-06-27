    /**
    * AminoAcidSymbol class
    * @description This class ssets up the data structure for Amino Acids
    * @author Micah Lerner
    */

Ext.define("Teselagen.bio.sequence.symbols.AminoAcidSymbol",{
	/**
	* Constructor
	* @param  String name  	Full Name
	* @param  String value 	One Letter Symbol
	* @param  String threeLettersName 	Three letter symbol abbreviation
	*/

	constructor: function(data){
		var that = this;
		var name = data.name;
		var value = data.value;
		var threeLettersName = data.threeLettersName;

		this.getName =function(){
			return name;
		}

		this.setName = function(pName){
			name = pName;
		}

		this.getThreeLettersName = function(){
			return threeLettersName;
		}

		this.setThreeLettersName = function(pThreeLettersName){
			threeLettersName = pThreeLettersName;
		}

		this.getValue = function() {
			return value;
		}
		this.setValue = function(pValue) {
			value = pValue;
		}

		return this;

	}
});