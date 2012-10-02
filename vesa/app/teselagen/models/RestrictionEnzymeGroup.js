/**
 * @class Teselagen.models.RestrictionEnzymeGroup
 * Class to hold a group of RestrictionEnzymes.
 * Used by @link Teselagen.manager.RestrictionEnzymeManager
 */
Ext.define("Teselagen.models.RestrictionEnzymeGroup", {
    config: {
        name: "",
        enzymes: [],
    },

    /**
     * @param {String} name The name of the group of enzymes.
     * @param {Array<Teselagen.bio.enzymes.RestrictionEnzyme>} enzymes The group of restriction enzymes.
     */
    constructor: function(inData) {
        this.initConfig(inData);
    },

    /**
     * Adds a restriction enzyme to the group. Throws a BioException if the enzyme is already present in the group.
     * @param {Teselagen.bio.enzymes.RestrictionEnzyme} enzyme An enzyme to add to the group.
     */
    addRestrictionEnzyme: function(enzyme) {
        var enzymesNew;

        // TODO: check for enzymes having same properties instead of ==?
        if(this.enzymes.indexOf(enzyme) == -1) {
            enzymesNew = this.getEnzymes();
            enzymesNew.push(enzyme);
            this.setEnzymes(enzymesNew);
        } else {
            throw Ext.create("Teselagen.bio.BioException", {
                message: "Restriction Enzyme already in the set!"
            });
        }
    },

    /**
     * Removes a given enzyme from the group. Throws a BioException if the enzyme is not present in the group.
     * @param {Teselagen.bio.enzymes.RestrictionEnzyme} enzyme The enzyme to remove from the group.
     */
    removeRestrictionEnzyme: function(enzyme) {
        var enzymesNew;
        var index = this.getEnzymes().indexOf(enzyme)

        if(index != -1) {
            enzymesNew = this.getEnzymes();
            enzymesNew.splice(index, 1);
            this.setEnzymes(enzymesNew);
        } else {
            throw Ext.create("Teselagen.bio.BioException", {
                message: "Restriction Enzyme is not in the set!"
            });
        }
    },

    /**
     * Checks to see if a given enzyme is present in the group.
     * @param {Teselagen.bio.enzymes.RestrictionEnzyme} enzyme The enzyme to check for membership.
     */
    hasEnzyme: function(enzyme) {
        return this.getEnzymes().indexOf(enzyme) != -1;
    },

    /**
     * Gets the enzyme at the given index. Throws a BioException if the index is out of bounds or negative.
     * @param {Int} index The index of the enzyme to return.
     */
    getRestrictionEnzyme: function(index) {
        // We could allow negative indices, as this will simply index from end of enzyme array.
        if(index >= this.getEnzymes().length || index < 0) {
            throw Ext.create("Teselagen.bio.BioException", {
                message: "Index is out of bounds!"
            });
        } else {
            return this.getEnzymes()[index];
        }
    },
});
