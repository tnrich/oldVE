Ext.define("Teselagen.bio.sequence.dna.Feature", {
	require: ["Teselagen.bio.sequence.common.Location", "Teselagen.bio.sequence.common.StrandedAnnotation"],
	extend: "Teselagen.bio.sequence.common.StrandedAnnotation",

	constructor: function (inData) {
		if (inData) {
			var name = inData.name || "";
			var _type = inData.type || "";
			var notes = inData.notes || null;
			this.callParent([inData]);
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


		this.getType = function(){
			return _type;
		}

		this.setType = function(pType){
			_type = pType;
		}


		this.getNotes = function(){
			return notes;
		}

		this.setNotes = function(pNotes){
			notes = pNotes;
		}

		this.clone = function(){
			var clonedFeature = Ext.create("Teselagen.bio.sequence.dna.Feature", {
			    inData: inData});

			var clonedLocations = [];
			var locations = this.superclass.getLocations();

			for (var i = 0; i < locations.length; i++) {
				clonedLocations.push(locations[i].clone());
			}

			clonedFeature.setLocations(clonedLocations);

			if (notes && notes.length > 0) {
				var clonedNotes = [];
				for (var i = 0; i < notes.length; i++) {
					clonedNotes.push(notes[i].clone());
				};

				clonedFeature.setNotes(clonedNotes);
			}

			return clonedFeature;
		}


	}


});
