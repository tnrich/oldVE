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
        "Teselagen.constants.Constants",
        "Ext.data.SortTypes"
    ],

    proxy: {
        type: "rest",
        reader: {
            type: "json",
            root: "parts"
        },
        writer: {
            type: "json"
        },
        buildUrl: function(request) {
            if(request.action === "read" && request.operation.filters && request.operation.filters[0] && request.operation.filters[0].property === "devicedesign_id" )
            {
                var project_id = Teselagen.manager.ProjectManager.workingProject.data.id;
                var url = "/projects"+'/'+ project_id +'/'+ 'devicedesigns' +'/'+ request.operation.filters[0].value+"/parts";
                delete request.params;
                return Teselagen.manager.SessionManager.buildUserResUrl(url, this.url);
            }
            return Teselagen.manager.SessionManager.buildUrl("parts", this.url);
        }
        /*
        afterRequest: function(req, res) {
            console.log(JSON.parse(req.operation.response.responseText).duplicated);
        }
        */
    },

    statics: {
        // For Default Names
        defaultNamePrefix: "Part",
        highestDefaultNameIndex: 0
    },

    /**
     * @param {Number} id Part id
     * @param {Number} veproject_id VectorEditorProject id
     * @param {Number} eugenerule_id EugeneRule id
     * @param {Number} sequencefile_id SequenceFile id
     * @param {Boolean} directionForward Direction forward.
     * @param {String}  name The name of the Part.
     * @param {String}  partSource The source of the Part.
     * @param {Boolean} revComp Reverse Complement.
     * @param {Number}  genbankStartBP Genbank basepair starting index
     * @param {Number}  endBP Genbank basepair ending index
     * @param {String}  iconID Icon id
     */
    fields: [{
        name: "id",
        type: "long"
    }, {
        name: "eugenerule_id",
        type: "long"
    }, {
        name: "sequencefile_id",
        type: "long"
    }, {
        name: "directionForward",
        type: "boolean",
        defaultValue: true
    }, {
        name: "fas",
        type: "string",
        defaultValue: "None"
    },
    /*{
            name: "id",
            convert: function(id) {
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
    {
        name: "name",
        sortType: function (s) {
            return String(s).toUpperCase();
        },
        convert: function(v) {
            var name;
            /*
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
                */
            name = v;
            if (v === undefined || v === null) {name = "";}
            //if ( name !== "" ) record.set('phantom',false);
            return name;
    }}, {
        name: "partSource",
        type: "string",
        defaultValue: ""
    }, {
        name: "revComp",
        type: "boolean",
        defaultValue: false
    }, //revComp
    {
        name: "genbankStartBP",
        type: "int",
        defaultValue: 0
    }, //startBP
    {
        name: "endBP",
        type: "int",
        defaultValue: 0
    }, //stopBP
    {
        name: "iconID",
        type: "string",
        defaultValue: ""
    }
    ],

    validations: [{
        field: "name",
        type: "presence"
    }, {
        field: "partSource",
        type: "presence"
    }, {
        field: "revComp",
        type: "presence"
    }, {
        field: "genbankStartBP",
        type: "presence"
    }, {
        field: "endBP",
        type: "presence"
    }, {
        field: "iconID",
        type: "presence"
    }],

    associations: [{
        type: "hasOne",
        model: "Teselagen.models.SequenceFile",
        foreignKey: "sequencefile_id",
        getterName: "getSequenceFile",
        setterName: "setSequenceFileModel"
    }, {
        type: "belongsTo",
        model: "Teselagen.models.Project",
        getterName: "getProject",
        setterName: "setProject",
        associationKey: "project",
        foreignKey: "id"
    }

    ],

    /**
     * Determines if Part is empty, i.e.
     * a Part is empty if it has no set SequenceFile
     * @returns {Boolean} True if empty, false if not.
     */
    isEmpty: function() {
        var partEmpty = false;
        if (!this.get("sequencefile_id")) {partEmpty = true;}
        return partEmpty;
    },

    /**
     * Whether this part is a named part.
     * @returns {Boolean} True if named, false if not.
     */
    isNamed: function() {
        var isNamed = false;
        if (this.get("name") && !this.get("sequencefile_id") && !this.get("partSource")) {
            isNamed = true;
        }
        return isNamed;
    },

    /**
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

        if (this.get("name") === otherPart.get("name") && this.get("partSouce") === otherPart.get("partSource") && this.get("revComp") === otherPart.get("revComp") && this.get("genbankStartBP") === otherPart.get("genbankStartBP") && this.get("endBP") === otherPart.get("endBP") &&
        //this.get("sequenceFile") === otherPart.get("sequenceFile") &&
        this.getSequenceFile() === otherPart.getSequenceFile() &&
        //this.getSequenceFile().get("sequenceFileContent") === otherPart.getSequenceFile().get("sequenceFileContent") &&
        this.get("iconID") === otherPart.get("iconID")) {
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
            var start = 1;
            var stop = pSequenceFile.getLength();

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
