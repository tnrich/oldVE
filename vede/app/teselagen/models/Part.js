/**
 * @class Teselagen.models.Part
 * Class describing a Part for J5Parameters.
 * @author Diana Wong
 * @author Douglas Densmore (original author) ?
 */
Ext.define("Teselagen.models.Part", {
    extend: "Ext.data.Model",

    requires: [
        "Teselagen.models.PartVO"
    ],

    statics: {
    },

    /**
     * Input parameters.
     * @param {Teselagen.models.PartVO} partVO PartVO.
     * @param {Boolean} directionForward Direction forward.
     * @param {String}  fas
     * @param {String}  id ID is composed of the Date.toString + 3 random digits
     *
     * ( Fields from PartVO)
     * @param {String}  name The name of the PartVO.
     * @param {Boolean} revComp Reverse Complement.
     * @param {Number}  genbankStartBP Genbank basepair starting index
     * @param {Number}  endBP Genbank basepair ending index
     * @param {Teselagen.models.SequenceFile} sequenceFile
     * @param {String}  iconID iconID
     */
    fields: [
        {name: "partVO",            type: "auto",       defaultValue: null},
        {name: "directionForward",  type: "boolean",    defaultValue: true},
        {name: "fas",               type: "string",     defaultValue: ""},
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
        },

        // Fields from PartVO
        {name: "name",              type: "string",     defaultValue: ""},      //name
        {name: "revComp",           type: "boolean",    defaultValue: false},   //revComp
        {name: "genbankStartBP",    type: "int",        defaultValue: 0},       //startBP
        {name: "endBP",             type: "int",        defaultValue: 0},       //stopBP
        {name: "sequenceFile",      type: "auto",       defaultValue: null},    //sequenceFileHash
        {name: "iconID",            type: "string",     defaultValue: null}
    ],

    associations: [
        {type: "belongsTo", model: "Teselagen.models.J5Bin"}
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

    /**
     * Determines if PartVO is empty.
     * @returns {Boolean} equal True if empty, false if not.
     */
    isPartVOEmpty: function() {
        var partEmpty = false;

        if (this.get("partVO") === undefined || this.get("partVO") === null) {
            partEmpty = true;
        } else if (this.get("partVO").isEmpty()) {
            partEmpty = true;
        }
        console.log(partEmpty);
        
        if (  partEmpty
            && this.get("directionForward") === true
            && this.get("fas") === "" ) {
            partEmpty = true;
        }
        console.log(partEmpty);
        return partEmpty;
    },

    /** Copy of isEmpty, except checks PartVO fields that are now in Part
     * Determines if PartVO is empty.
     * @returns {Boolean} equal True if empty, false if not.
     */
    isEmpty: function() {
        var partEmpty = false;

        if (this.get("name") === ""
            && this.get("revComp") === false
            && this.get("genbankStartBP") === 0
            && this.get("endBP") === 0
            && this.get("sequenceFile") === null) {
            partEmpty = true;
        }
        
        if (  partEmpty
            && this.get("directionForward") === true
            && this.get("fas") === "" ) {
            partEmpty = true;
        }
        return partEmpty;
    },

    /*
     * Compares another Part and determines if they are the same.
     * @param {Teselagen.models.PartVO} otherPart Part to compare to.
     * @returns {Boolean} equal True if the same, false if not.
     */
    isEqual: function(otherPart) {
        if (Ext.getClassName(otherPart) !== "Teselagen.models.Part") {
            return false;
        }
        if (this === otherPart) {
            return true;
        }

        if (   this.get("name") === otherPart.get("name")
            && this.get("revComp") === otherPart.get("revComp")
            && this.get("genbankStartBP") === otherPart.get("genbankStartBP")
            && this.get("endBP") === otherPart.get("endBP")
            && this.get("sequenceFile") === otherPart.get("sequenceFile")
            && this.get("iconID") === otherPart.get("iconID") ) {
            return true;
        }
        return false;
    }
});
