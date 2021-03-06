/** HAS BEEN REFACTORED INTO Teselagen.models.Part
 * @class Teselagen.models.PartVO
 * Class describing a PartVO for J5Parameters.
 * @author Diana Wong
 * @author Douglas Densmore (original author) ?
 */
Ext.define("Teselagen.models.PartVO", {
    extend: "Ext.data.Model",

    requires: [
    ],

    proxy: {
        type: "memory"
    },

    statics: {
    },
    
    /**
     * Input parameters.
     * @param {String} name The name of the PartVO.
     * @param {Boolean} revComp Reverse Complement.
     * @param {Number} genbankStartBP Genbank basepair starting index
     * @param {Number} endBP Genbank basepair ending index
     * @param {Teselagen.models.SequenceFile} sequenceFile
     * @param {String} iconID iconID
     * @param {String} id Unique ID is composed of Date.now() + 3 random digits
     */
    fields: [
        {name: "name",              type: "string",     defaultValue: ""},
        {name: "partSouce",         type: "string",     defaultValue: ""},
        {name: "revComp",           type: "boolean",    defaultValue: false},
        {name: "genbankStartBP",    type: "int",        defaultValue: 0},
        {name: "endBP",             type: "int",        defaultValue: 0},
        {name: "sequenceFile",      type: "auto",       defaultValue: null},
        {name: "iconID",            type: "string",     defaultValue: null},
        //{name: "id",                type: "string",     defaultValue: Date.now().toString()}
        {
            name: "id",
            convert: function() {
                var extraDigits = Math.floor(Math.random() * 1000).toString();

                while (extraDigits.length < 3) {
                    extraDigits = "0" + extraDigits;
                }
                var id = (Date.now()) + extraDigits;
                return id;
            }
        }
    ],

    associations: [
        {type: "belongsTo", model: "Teselagen.models.EugeneRule"},
        {type: "belongsTo", model: "Teselagen.models.Part"}
    ],

    /**
     * Generates ID based on date + 3 random digits
     * @returns {String} id
     * @private
     */
    generateId: function() {
        var extraDigits = Math.floor(Math.random() * 1000).toString();

        while (extraDigits.length < 3) {
            extraDigits = "0" + extraDigits;
        }
        var id = (Date.now()) + extraDigits;
        return id;
    },

    /**
     * Sets a new id for this part, different than what was generated at object initiation.
     */
     setId: function() {
        var newId = this.generateId();
        this.set("id", newId);
        return true;
     },

    /*
     * Compares another PartVO and determines if they are the same.
     * @param {Teselagen.models.PartVO} otherPartVO PartVO to compare to.
     * @returns {Boolean} equal True if the same, false if not.
     */
    isEqual: function(otherPartVO) {
        if (Ext.getClassName(otherPartVO) !== "Teselagen.models.PartVO") {
            return false;
        }
        if (this === otherPartVO) {
            return true;
        }

        if (   this.get("name") === otherPartVO.get("name")
            && this.get("partSource") === otherPartVO.get("partSource")
            && this.get("revComp") === otherPartVO.get("revComp")
            && this.get("genbankStartBP") === otherPartVO.get("genbankStartBP")
            && this.get("endBP") === otherPartVO.get("endBP")
            && this.get("sequenceFile") === otherPartVO.get("sequenceFile")
            && this.get("iconID") === otherPartVO.get("iconID") ) {
            return true;
        }
        return false;
    },

    /*
     * Determines if PartVO is empty.
     * @returns {Boolean} equal True if empty, false if not.
     */
    isEmpty: function() {

        if (   this.get("name") === ""
            && this.get("partSource") === ""
            && this.get("revComp") === false
            && this.get("genbankStartBP") === 0
            && this.get("endBP") === 0
            && this.get("sequenceFile") === null
            /*&& this.get("iconID") === null*/ )
        {
            return true;
        }
        return false;
    }
});
