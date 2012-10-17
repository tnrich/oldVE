/**
 * @class Teselagen.models.Part
 * Class describing a Part for J5Parameters.
 * @author Diana Wong
 * @author Douglas Densmore (original author) ?
 */
Ext.define("Teselagen.models.Part", {
    extend: "Ext.data.Model",

    requires: [
        "Teselagen.models.SequenceFile"
//        "Teselagen.models.J5Bin",
//        "Teselagen.models.EugeneRule"
    ],

    proxy: {
        type: "rest",
        url: "getParts.json",
        reader: {
            type: "json",
            root: "data"
        }
    },

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
        {name: "id",                type: "int"},
        {name: "veproject_id",        type: "int"},
        
        //{name: "partVO",            type: "auto",       defaultValue: null},
        {name: "directionForward",  type: "boolean",    defaultValue: true},
        {name: "fas",               type: "string",     defaultValue: ""},
        /*{
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
        */
        // Fields from PartVO
        {name: "name",              type: "string",     defaultValue: ""},      //name
        {name: "revComp",           type: "boolean",    defaultValue: false},   //revComp
        {name: "genbankStartBP",    type: "int",        defaultValue: 0},       //startBP
        {name: "endBP",             type: "int",        defaultValue: 0},       //stopBP
        //{name: "sequenceFile_id",   type: "int"},
        {name: "iconID",            type: "string",     defaultValue: ""}//,
        //{name: "j5bin_id",          type: "int"}
    ],

    validations: [
        {field: "name",             type: "presence"},
        {field: "revComp",          type: "presence"},
        {field: "genbankStartBP",   type: "presence"},
        {field: "endBP",            type: "presence"},
        {field: "iconID",           type: "presence"}
    ],

    associations: [
        {
            type: "hasOne",
            model: "Teselagen.models.SequenceFile",
            associationKey:"sequenceFile",
            foreignKey:"sequenceFile_id",
            getterName: "getSequenceFile",
            setterName: "setSequenceFile"
        },
        {
            type: "belongsTo",
            model: "Teselagen.models.J5Bin",
            getterName: "getJ5Bin",
            setterName: "setJ5Bin",
            associationKey: "j5Bin"
        },
        {
            type: "belongsTo",
            model: "Teselagen.models.EugeneRule",
            getterName: "getEugeneRule",
            setterName: "setEugeneRule",
            associationKey: "eugeneRule"
        },
        {
            type: "belongsTo",
            model: "Teselagen.models.Project",
            getterName: "getProject",
            setterName: "setProject",
            associationKey: "project"
        }
    ],

    init: function() {
        
    },

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
     *
    isPartVOEmpty: function() {
        var partEmpty = false;

        if (this.get("partVO") === undefined || this.get("partVO") === null) {
            partEmpty = true;
        } else if (this.get("partVO").isEmpty()) {
            partEmpty = true;
        }
        
        if (partEmpty &&
            this.get("directionForward") === true &&
            this.get("fas") === "" ) {
            partEmpty = true;
        } else {
            partEmpty = false;
        }
        return partEmpty;
    },*/

    /** Copy of isEmpty, except checks PartVO fields that are now in Part
     * Determines if PartVO is empty.
     * @returns {Boolean} True if empty, false if not.
     */
    isEmpty: function() {
        var partEmpty = false;

        if (this.get("name") === "" &&
            this.get("revComp") === false &&
            this.get("genbankStartBP") === 0 &&
            this.get("endBP") === 0 &&
            //this.get("sequenceFile") === null) {
            this.getSequenceFile().get("sequenceFileContent") === "") {
            partEmpty = true;
        }
        
        if (partEmpty &&
            this.get("directionForward") === true &&
            this.get("fas") === "" ) {
            partEmpty = true;
        } else {
            partEmpty = false;
        }
        return partEmpty;
    },

    /*
     * Compares another Part and determines if they are the same.
     * @param {Teselagen.models.PartVO} otherPart Part to compare to.
     * @returns {Boolean} True if the same, false if not.
     */
    isEqual: function(otherPart) {
        if (Ext.getClassName(otherPart) !== "Teselagen.models.Part") {
            return false;
        }
        if (this === otherPart) {
            return true;
        }

        if (this.get("name") === otherPart.get("name") &&
            this.get("revComp") === otherPart.get("revComp") &&
            this.get("genbankStartBP") === otherPart.get("genbankStartBP") &&
            this.get("endBP") === otherPart.get("endBP") &&
            //this.get("sequenceFile") === otherPart.get("sequenceFile") &&
            this.getSequenceFile() === otherPart.getSequenceFile() &&
            //this.getSequenceFile().get("sequenceFileContent") === otherPart.getSequenceFile().get("sequenceFileContent") &&
            this.get("iconID") === otherPart.get("iconID") ) {
            return true;
        }
        return false;
    },



    // SOME METHODS FROM SEQUENCEFILEMANAGER/SEQUENCEFILEPROXY

    /** NEEDS TESTING
     * Adds a SequenceFile to Part.
     * @param {Teselagen.models.SequenceFile} pSequenceFile
     * @returns {Boolean} True if added, false if not.
     */
    addSequenceFile: function(pSequenceFile) {
        this.setSequenceFile(pSequenceFile);
        if (this.getSequenceFile() === pSequenceFile) {
            return false;
        } else {
            return true;
        }
    },

    /** NEEDS TESTING
     * Removes the SequenceFile of Part.
     * @returns {Boolean} True if removed, false if not.
     */
    removeSequenceFile: function() {
        this.setSequenceFile(null);
        if (this.getSequenceFile() === null || this.getSequenceFile() === undefined) {
            return false;
        } else {
            return true;
        }
    }

});
