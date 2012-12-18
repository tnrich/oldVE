/**
 * @class Teselagen.models.Part
 * Class describing a Part.
 * @author Diana Wong
 * @author Douglas Densmore (original author) ?
 */
Ext.define("Teselagen.models.Part", {
    extend: "Ext.data.Model",

    requires: [
        "Teselagen.models.SequenceFile",
        "Teselagen.constants.Constants"
    ],

    proxy: {
        type: "rest",
        url: "/vede/test/data/json/getParts.json",
        reader: {
            type: "json",
            root: "parts"
        },
        writer: {
            type: "json"
        },
        buildUrl: function() {
            return Teselagen.manager.SessionManager.buildUrl("user/projects/deprojects/parts", this.url);
        }
    },

    statics: {
        // For Default Names
        defaultNamePrefix: "Part",
        highestDefaultNameIndex: 0
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
        // {name: "j5bin_id",        type: "long"},
        {name: "eugenerule_id",        type: "long"},
        {name: "sequencefile_id",        type: "long"},
        {name: "directionForward",  type: "boolean",    defaultValue: true},
        {name: "fas",               type: "string",     defaultValue: "None"},
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
        //{name: "name",              type: "string",     defaultValue: ""},      //name
        {
            name: "name",
            convert: function(v, record) {
                var name;

                if (v === "" || v === undefined || v === null) {
                    name = record.self.defaultNamePrefix + record.self.highestDefaultNameIndex;
                    record.self.highestDefaultNameIndex += 1;
                } else {
                    if (Teselagen.utils.FormatUtils.isLegalName(v)) {
                        name = v.toString();
                    } else {
                        console.warn("Illegal name " + v + ". Name can only contain alphanumeric characters, underscore (_), and hyphen (-). Removing non-alphanumerics.");
                        name = Teselagen.utils.FormatUtils.reformatName(v);
                    }
                }
                return name;
                /*
                if (typeof(v) === "number" || typeof(v) === "string") {
                    if (Teselagen.utils.FormatUtils.isLegalName(v)) {
                        return v.toString();
                    } else {
                        console.warn("Illegal name " + v + ". Name can only contain alphanumeric characters, underscore (_), and hyphen (-). Removing non-alphanumerics.");
                        return Teselagen.utils.FormatUtils.reformatName(v);
                    }
                } else {
                    var name = record.self.defaultNamePrefix + record.self.highestDefaultNameIndex;
                    record.self.highestDefaultNameIndex += 1;
                    return name;
                }*/
            }
        },
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
//            associationKey:"sequenceFile",
            foreignKey:"sequencefile_id",
            getterName: "getSequenceFile",
            setterName: "setSequenceFileModel"
//            , name: "sequenceFile"
        }/*,
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
        }*/
    ],


    // IDS ARE GENERATED ON SERVER SIDE
    /**
     * Generates ID based on date + 3 random digits
     * @returns {String} id
     * @private
     *
    generateId: function() {
        var extraDigits = Math.floor(Math.random() * 1000).toString();

        while (extraDigits.length < 3) {
            extraDigits = "0" + extraDigits;
        }
        var id = (Date.now()) + extraDigits;
        return id;
    },
    */

    /**
     * Sets a new id for this part, different than what was generated at object initiation.
     * @returns {Boolean} True if set.
     *
    setId: function() {
        var newId = this.generateId();
        this.set("id", newId);
        return true;
     },
    */
    /**
     * Determines if Part is empty, i.e.
     * a Part is empty if it only has default values and no set SequenceFile
     * A Part with a non-default "name" field is still defined as Empty.
     * @returns {Boolean} True if empty, false if not.
     */
    isEmpty: function() {
        var partEmpty = false;

        if (//this.get("name").match(this.self.defaultNamePrefix) !== null &&
            this.get("revComp") === false &&
            this.get("genbankStartBP") === 0 &&
            this.get("endBP") === 0 &&
            //this.get("sequenceFile") === null) {
            this.getSequenceFile().get("sequenceFileContent") === "") {
            partEmpty = true;
        }
        
        if (partEmpty &&
            this.get("directionForward") === true &&
            this.get("fas") === "None" ) {
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

    /**
     * Set Start index
     * @param {Number} pStart The start index, from 1 to length of the sequence, to set the start BP.
     */
    setStart: function(pStart) {
        this.set("genbankStartBP", pStart);
    },

    /**
     * Get Start index.
     * @returns {Number}
     */
    getStart: function() {
        return this.get("genbankStartBP");
    },


    /**
     * Set End index
     * @param {Number} pEnd The end index, from 1 to length of the sequence, to set the start BP.
     */
    setEnd: function(pEnd) {
        this.set("endBP", pEnd);
    },

    /**
     * Get End index.
     * @returns {Number}
     */
    getEnd: function() {
        return this.get("endBP");
    },

    /**
     * Sets SequenceFile with default genbankStartBP and endBP based on a set SequenceFileContent.
     * @param {Teselagen.models.SequenceFile} pSequenceFile
     * @returns {Boolean}
     */
    setSequenceFile: function(pSequenceFile) {
        var success = false;
        if (pSequenceFile === null) {
            this.setSequenceFileModel(pSequenceFile);
        } else {
            var start   = 1;
            var stop    = pSequenceFile.getLength();

            this.setSequenceFileModel(pSequenceFile);

            if (this.get("genbankStartBP") === 0) {
                this.set("genbankStartBP", start);
            }
            if (this.get("endBP") === 0) {
                this.set("endBP", stop);
            }
            success = true;
        }
        return success;
    },


    /** (WEIRD PROBLEM--print part, does not show same seqFile from getSeqFile.)
     * Removes the SequenceFile of Part. Resets the Sequence File format to INIT (?),
     * and the content, filename, partsource, etc to empty strings.
     * Resets the Start and Stop in Part to 0.
     *
     * @returns {Boolean} True if removed, false if not.
     */
    removeSequenceFile: function() {
        this.setSequenceFile(null);
        this.setStart(0);
        this.setEnd(0);
        if (this.getSequenceFile().get("sequenceFileFormat") === "INIT") {
            return true;
        } else {
            return false;
        }
    }

});
