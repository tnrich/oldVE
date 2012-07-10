Ext.define("Teselagen.bio.sequence.dna.FeatureNote", {
	
	constructor: function(inData){
		if (inData) {
			var name = inData.name || "";
			var value = inData.value || "";
			var quoted = inData.quoted || false;
		} else {
			throw Ext.create("Teselagen.bio.BioException", {
				message: "Arguments needed"
			});
		}

		this.getName = function(){
			return this.name;
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

		this.getQuoted = function (){
			return quoted;
		}

		this.setQuoted = function (pQuoted){
			quoted = pQuoted;
		}

		this.clone =function(){
			return Ext.create("Teselagen.bio.sequence.dna.FeatureNote", {
				name: this.name,
				value: this.value
			});
		}
	}
});