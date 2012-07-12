/**
 * @class Teselagen.utils.FeaturedDNASequenceUtils
 * @singleton
 * Utility to convert between sequenceProvider objects and FeaturedDNASequence objects.
 * @author Nick Elsbree
 * @author Zinovii Dmytriv (original author)
 */
Ext.define("Teselagen.utils.FeaturedDNASequenceUtils", {
	singleton: true,

	/**
	 * Converts a sequenceProvider object to a FeaturedDNASequence object.
	 * @param  {[type]} sequenceProvider The sequenceProvider to be converted.
	 * @return {Teselagen.models.FeaturedDNASequence} The sequenceProvider in FeaturedDNASequence form.
	 */
	sequenceProviderToFeaturedDNASequence: function(sequenceProvider) {
		if(!sequenceProvider) {
			return null;
		}

		var dnaSequenceFeatures = [];

		var featuredDNASequence = Ext.create("Teselagen.models.FeaturedDNASequence", {
			name: sequenceProvider.name,
			sequence: sequenceProvider.sequence.seqString(),
			isCircular: sequenceProvider.circular,
			features: dnaSequenceFeatures
		});

		// Iterate through all the features associated with sequenceProvider, converting them to DNAFeatures.
		Ext.each(sequenceProvider.getFeatures(), function(feature) {
			var convertedNotes = [];
			// Convert notes from feature to DNAFeatureNotes and add them to convertedNotes.
			Ext.each(feature.getNotes(), function(note) {
				convertedNotes.push(Ext.create("Teselagen.models.DNAFeatureNote", {
					name: note.getName(),
					aValue: note.getValue(),
					quoted: note.getQuoted()
				}));
			});

			var convertedLocations = [];
			// Convert locations from feature to DNAFeatureLocations and add them to convertedLocations.
			Ext.each(feature.getLocations(), function(location) {
				convertedLocations.push(Ext.create("Teselagen.models.DNAFeatureLocation", {
					genbankStart: feature.getStart() + 1,
					end: feature.getEnd(),
				}));
			});

			// Create a new DNAFeature with our converted data and add it to dnaSequenceFeatures.
			dnaSequenceFeatures.push(Ext.create("Teselagen.models.DNAFeature", {
				strand: feature.getStrand(),
				name: feature.getName(),
				notes: convertedNotes,
				type: feature.getType(),
				locations: convertedLocations
			}));
		});

		return featuredDNASequence;
	},

	/**
	 * Converts a FeaturedDNASequence object to a SequenceProvider object.
	 * @param  {Teselagen.models.FeaturedDNASequence} featuredDNASequence The sequence to be converted.
	 * @return {[type]} The FeaturedDNASequence in the form of a SequenceProvider.
	 */
	featuredDNASequenceToSequenceProvider: function(featuredDNASequence) {
		if(!featuredDNASequence) {
			return null;
		}

		var dnaSequence = Teselagen.bio.sequence.dna.DNATools.createDNASequence("", featuredDNASequence.get("sequence"));

		var sequenceProvider = Ext.create("Teselagen.") // TODO: figure out what sequence provider is!

		var convertedFeatures = [];
		Ext.each(featuredDNASequence.getFeatures(), function(feature) {
			var convertedNotes = [];
			// Convert feature's DNAFeatureNotes to FeatureNotes (Teselagen.bio.sequence.dna.FeatureNote)
			Ext.each(feature.get("notes"), function(note) {
				convertedNotes.push(Ext.create("Teselagen.bio.sequence.dna.FeatureNote", {
					name: note.get("name"),
					value: note.get("aValue"),
					quoted: note.get("quoted")
				}));
			});

			var convertedLocations = [];
			// Convert feature's DNAFeatureLocation to Locations (Teselagen.bio.sequence.common.Location)
			Ext.each(feature.get("locations"), function(location) {
				convertedLocations.push(Ext.create("Teselagen.bio.sequence.common.Location"), {
					start: location.get("start"),
					end: location.get("end")
				});
			});

			var convertedFeature = Ext.create("Teselagen.bio.sequence.dna.Feature", {
				name: feature.get("name"),
				start: convertedLocations[0].getStart(),
				end: convertedLocations[0].getEnd(),
				type: feature.get("type"),
				strand: feature.get("strand"),
				notes: convertedNotes,
			});

			convertedFeature.setLocations(convertedLocations);

			convertedFeatures.push(convertedFeature);
		});
		
		sequenceProvider.setFeatures(convertedFeatures);
		return sequenceProvider;
	}
});