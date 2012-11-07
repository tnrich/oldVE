/**
 * @class Teselagen.models.Part
 * Class describing a Part.
 * @author Diana Wong
 * @author Douglas Densmore (original author) ?
 */
Ext.define("Teselagen.models.Part", {
    extend: "Ext.data.Model",

    requires: [
        "Teselagen.models.SequenceFile"
    ],

    proxy: {
        type: "ajax",
        url: "/vede/test/data/json/getParts.json",
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
        {name: "id",                type: "long"},
        {name: "veproject_id",        type: "long"},
        {name: "j5bin_id",        type: "long"},
        {name: "eugenerule_id",        type: "long"},
        {name: "sequencefile_id",        type: "long"},
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
        {name: "iconID",            type: "string",     defaultValue: ""}//,
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
            foreignKey:"sequencefile_id",
            getterName: "getSequenceFile",
            setterName: "setSequenceFileModel"
        },
        {
            type: "belongsTo",
            model: "Teselagen.models.J5Bin",
            getterName: "getJ5Bin",
            setterName: "setJ5Bin",
            associationKey: "j5Bin",
            foreignKey: "j5bin_id"
        },
        {
            type: "belongsTo",
            model: "Teselagen.models.EugeneRule",
            getterName: "getEugeneRule",
            setterName: "setEugeneRule",
            associationKey: "eugeneRule",
            foreignKey: "eugenerule_id"
        },
        {
            type: "belongsTo",
            model: "Teselagen.models.VectorEditorProject",
            getterName: "getVectorEditorProject",
            setterName: "setVectorEditorProject",
            associationKey: "vectorEditorProject",
            foreignKey: "veproject_id"
        }
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
     * @returns {Boolean} True if set.
     */
    setId: function() {
        var newId = this.generateId();
        this.set("id", newId);
        return true;
     },

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



    /** COME BACK AND DO THIS
     * Sets SequenceFile with default genbankStartBP and endBP based on a set SequenceFileContent.
     * @returns {Boolean}
     */
    setSequenceFile: function(pSequenceFile) {
        if (pSequenceFile === null) {
            this.setSequenceFileModel(pSequenceFile);
        } else {
            var start   = 1;
            var stop    = pSequenceFile.getLength();

            this.setSequenceFileModel(pSequenceFile);
            this.set("genbankStartBP", start);
            this.set("endBP", stop);
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
