Ext.define("Teselagen.bio.sequence.dna.RichDNASequence", {
	extend: "Teselagen.bio.sequence.dna.DNASequence",
	require: ["Teselagen.bio.sequence.common.SymbolList", "Teselagen.bio.BioException", "Teselagen.bio.sequence.dna.Feature"],

	constructor: function(inData){
		var features;
		if (inData) {
			features = inData.features;
			this.callParent([inData]);
		} else{
			Teselagen.bio.BioException.raise("Arguments needed");
		}


		this.getFeatures = function(){
			return features;
		}

		this.numberOfFeatures = function(){
			return features.length;
		}

		this.addFeature = function(pFeature){
			features.push(pFeature);
		}

		this.containsFeature= function(pFeature){
			return features.indexOf(pFeature) >= 0;
		}

		this.removeFeature = function(pFeature){
			var index = features.indexOf(pFeature);
			if (index == -1) {
				Teselagen.bio.BioException.raise("Arguments needed");
			};

			features.splice(index, 1);
		}
	}
});