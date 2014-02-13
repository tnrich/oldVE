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
     * @param  {String} name is the string name
     * @param  {String} type is the type of feature
     * @param  {Integer} start stranded annotation start
     * @param {Integer} end stranded annotation end
     * @param {Integer} Strand strand directionality
     * @param {Integer} Index unique index
     */
    constructor: function (inData) {
        var name, type, notes, index;
        if (inData) {
            name = String(inData.name || "");
            type = inData.type || "";
            notes = inData.notes || [];
            index = inData.index || 0;
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
        };

        /**
         * Sets Name
         * @method setName
         * @param {String} pName
         */
        this.setName = function(pName){
            name = pName;
        };

        /**
         * Get Type
         * @method getType
         * @return {String} Type
         */
        this.getType = function(){
            return type;
        };

        /**
         * Sets Type
         * @method setType
         * @param {String} pName
         */
        this.setType = function(pType){
            type = pType;
        };

        /**
         * Add a FeatureNote
         * @method addNote
         * @param {Teselagen.bio.sequence.dna.FeatureNote[]} note
         */
        this.addNote = function(pNote){
            notes.push(pNote);
        };
        
        /**
         * Get Notes
         * @method getNotes
         * @return {Teselagen.bio.sequence.dna.FeatureNote[]} Notes
         */
        this.getNotes = function(){
            return notes;
        };

        /**
         * Set Notes
         * @method setNotes
         * @param {Teselagen.bio.sequence.dna.FeatureNote[]} pNotes
         */
        this.setNotes = function(pNotes){
            notes = pNotes;
        };

        /**
         * Get Index
         * @method getIndex
         * @return {Teselagen.bio.sequence.dna.FeatureNote[]} Index
         */
        this.getIndex = function(){
            return index;
        };

        /**
         * Set Index
         * @method setIndex
         * @param {Teselagen.bio.sequence.dna.FeatureNote[]} pIndex
         */
        this.setIndex = function(pIndex){
            index = pIndex;
        };
        
        /**
         * Clones the feature
         * @method clone
         * @return {Feature} cloned feature
         */
        this.clone = function(){
            var clonedFeature = Ext.create("Teselagen.bio.sequence.dna.Feature",
                    {
                        name: name,
                        start: inData.start,
                        end: inData.end,
                        index: inData.index,
                        type: type,
                        strand: this.getStrand(),
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
                for (i = 0; i < notes.length; i++) {
                    clonedNotes.push(notes[i].clone());
                }

                clonedFeature.setNotes(clonedNotes);
            }

            return clonedFeature;
        };


    },

    /**
     * String representation of Feature.
     * @return {String}
     */
    toString: function() {
        return "Feature " + this.getName() + " of type " + this.getType() + " from " +
            this.getStart() + " to " + this.getEnd();
    },

    /**
     * Serialize Feature.
     * @return {Object}
     */
    serialize: function(){

        var data = {};
        data.inData = {
            name : this.getName(),
            type : this.getType(),
            index : this.getIndex(),
            start : this.getStart(),
            end : this.getEnd(),
            strand : this.getStrand()
        };
        data.notes = [];
        this.getNotes().forEach(function(note){
            data.notes.push(note.serialize());
        });

        data.inData.locations = [];
        this.getLocations().forEach(function(location) {
            data.inData.locations.push(location.serialize());
        });

        return data;
    },

    /**
     * Deserialize Feature.
     * @return {Object}
     */
    deSerialize: function(data){
        var self = this;

        data.notes.forEach(function(note){
            var newNote = Ext.create("Teselagen.bio.sequence.dna.FeatureNote", note.inData);
            self.addNote(newNote);
        });
    }
});
