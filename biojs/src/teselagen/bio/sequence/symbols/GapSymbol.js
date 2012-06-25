    /**
    * GapSymbol class
    * @description This class sets up a Gap Symbol class
    * @author Micah Lerner
    */
   
Ext.define("Teselagen.bio.sequence.symbols.GapSymbol",{

	constructor: function(data){
		var name = data.name;
		var value = data.value;

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