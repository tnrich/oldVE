/**
 * @class Teselagen.utils.FeaturedDNASequenceUtils
 * @singleton
 * Utility to convert between sequenceManager objects and FeaturedDNASequence objects.
 * @author Nick Elsbree
 * @author Zinovii Dmytriv (original author)
 */
Ext.define("Teselagen.utils.FeaturedDNASequenceUtils", {
    singleton: true,

    /**
     * Converts a sequenceManager object to a FeaturedDNASequence object.
     * @param  {Teselagen.manager.SequenceManager} SequenceManager The SequenceManager to be converted.
     * @return {Teselagen.models.FeaturedDNASequence} The SequenceManager in FeaturedDNASequence form.
     */
    sequenceManagerToFeaturedDNASequence: function(sequenceManager) {
        var dnaSequenceFeatures = [];
        var convertedNotes = [];
        var convertedLocations = [];

        if(!sequenceManager) {
            return null;
        }

        var featuredDNASequence = Ext.create("Teselagen.models.FeaturedDNASequence", {
            name: sequenceManager.getName(),
            sequence: sequenceManager.getSequence(),
            isCircular: sequenceManager.getCircular(),
            features: dnaSequenceFeatures
        });

        // Iterate through all the features associated with sequenceManager, converting them to DNAFeatures.
        Ext.each(sequenceManager.getFeatures(), function(feature) {
            // Convert notes from feature to DNAFeatureNotes and add them to convertedNotes.
            Ext.each(feature.getNotes(), function(note) {
                convertedNotes.push(Ext.create("Teselagen.models.DNAFeatureNote", {
                    name: note.getName(),
                    aValue: note.getValue(),
                    quoted: note.getQuoted()
                }));
            });

            // Convert locations from feature to DNAFeatureLocations and add them to convertedLocations.
            Ext.each(feature.getLocations(), function(location) {
                convertedLocations.push(Ext.create("Teselagen.models.DNAFeatureLocation", {
                    // I've left the '+ 1' to ensure the behavior is consistent with old code, but I'm not sure why it's necessary.
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
     * Converts a FeaturedDNASequence object to a SequenceManager object.
     * @param  {Teselagen.models.FeaturedDNASequence} featuredDNASequence The sequence to be converted.
     * @return {Teselagen.manager.SequenceManager} The FeaturedDNASequence in the form of a SequenceManager.
     */
    featuredDNASequenceToSequenceManager: function(featuredDNASequence) {
        var convertedFeatures = [];
        var convertedNotes = [];
        var convertedLocations = [];
        
        if(!featuredDNASequence) {
            return null;
        }

        var sequenceManager = Ext.create("Teselagen.manager.SequenceManager", {
            name: featuredDNASequence.get("name"),
            circular: featuredDNASequence.get("isCircular"),
            sequence: featuredDNASequence.get("sequence")
        });

        Ext.each(featuredDNASequence.get("features"), function(feature) {
            // Convert feature's DNAFeatureNotes to FeatureNotes (Teselagen.bio.sequence.dna.FeatureNote)
            Ext.each(feature.get("notes"), function(note) {
                convertedNotes.push(Ext.create("Teselagen.bio.sequence.dna.FeatureNote", {
                    name: note.get("name"),
                    value: note.get("aValue"),
                    quoted: note.get("quoted")
                }));
            });

            // Convert feature's DNAFeatureLocation to Locations (Teselagen.bio.sequence.common.Location)
            Ext.each(feature.get("locations"), function(location) {
                convertedLocations.push(Ext.create("Teselagen.bio.sequence.common.Location", {
                    start: location.get("genbankStart") - 1,
                    end: location.get("end")
                }));
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
        
        sequenceManager.setFeatures(convertedFeatures);
        return sequenceManager;
    }
});
