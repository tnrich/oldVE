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

		return this;
	},




});