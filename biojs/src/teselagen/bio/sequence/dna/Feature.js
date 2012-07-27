/**
* @class Teselagen.bio.sequence.dna.Feature
* DNA feature holder.
* 
* @author Micah Lerner
* @author Zinovii Dmytriv (original author)
* @extends Teselagen.bio.sequence.common.StrandedAnnotation
* @requires Teselagen.bio.sequence.common.StrandedAnnotation
* @requires Teselagen.bio.sequence.common.Location
* @requires Teselagen.bio.BioException
*/
Ext.define("Teselagen.bio.sequence.dna.Feature", {
    require: ["Teselagen.bio.sequence.common.Location", "Teselagen.bio.sequence.common.StrandedAnnotation", "Teselagen.bio.sequence.common.StrandType"],
    extend: "Teselagen.bio.sequence.common.StrandedAnnotation",

    /**
     * Constructor
     * @param  {String} Name is the string name
     * @param  {String} Name is the type of feature
     * @param  {Integer} start stranded annotation start
     * @param {Integer} end stranded annotation end
     * @param {Integer} Strand strand directionality
     */
    constructor: function (inData) {
        if (inData) {
            var name = inData.name || "";
            var type = inData.type || "";
            var notes = inData.notes || [];
            this.callParent([inData]);
        } else {
            Teselagen.bio.BioException.raise("Arguments needed");
        }

        /**
         * Get Name
         * @return {String} Name
         */
        this.getName = function(){
            return name;
        }

        /**
         * Sets Name
         * @param {String} pName
         */
        this.setName = function(pName){
            name = pName;
        }

        /**
         * Get Type
         * @return {String} Type
         */
        this.getType = function(){
            return type;
        }

        /**
         * Sets Type
         * @param {String} pName
         */
        this.setType = function(pType){
            type = pType;
        }

        /**
         * Add a FeatureNote
         * @param {Teselagen.bio.sequence.dna.FeatureNote[]} note
         */
        this.addNote = function(pNote){
            notes.push(pNote);
        }
        
        /**
         * Get Notes
         * @return {Teselagen.bio.sequence.dna.FeatureNote[]} Notes
         */
        this.getNotes = function(){
            return notes;
        }

        /**
         * Sets Name
         * @param {Teselagen.bio.sequence.dna.FeatureNote[]} pNotes
         */
        this.setNotes = function(pNotes){
            notes = pNotes;
        }

        /**
         * Clones the feature
         * @return {Feature} cloned feature
         */
        this.clone = function(){
            var clonedFeature = Ext.create("Teselagen.bio.sequence.dna.Feature", 
                    {
                        name: name,
                        start: inData.start,
                        end: inData.end,
                        type: type,
                        strand: inData.strand,
                        notes: inData.notes
                    });

            var clonedLocations = [];
            var locations = this.getLocations();
            //console.log(locations)
            //console.log("Cloned length: " + locations.length);

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
