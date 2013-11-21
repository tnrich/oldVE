/**
 * @class Teselagen.models.Part
 * Class describing a Part.
 * @author Diana Wong
 * @author Douglas Densmore (original author) << Really?
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
            root: "parts",
            totalProperty: "total"
        },
        writer: {
            type: "json"
        },
        buildUrl: function(request) {
            var url;
            if(request.action === "read" && request.operation.filters && request.operation.filters[0] && request.operation.filters[0].property === "devicedesign_id" )
            {
                var project_id = Teselagen.manager.ProjectManager.workingProject.data.id;
                url = "/projects"+'/'+ project_id +'/'+ 'devicedesigns' +'/'+ request.operation.filters[0].value+"/parts";
                delete request.params;
                return Teselagen.manager.SessionManager.buildUserResUrl(url, this.url);
            }

            if(request.action === "read" && request.params && request.params.id )
            {
                url = "parts/"+request.params.id;
                return Teselagen.manager.SessionManager.buildUrl(url, this.url);
            }

            if(request.action === "read" && request.operation.filters && request.operation.filters[0] && request.operation.filters[0].property === "user_id" )
            {
                url = "parts";
                return Teselagen.manager.SessionManager.buildUrl(url, this.url);
            }

            if(request.action === "destroy" && request.records.length === 1) {
                url = "parts/" + request.records[0].get('id');
                return Teselagen.manager.SessionManager.buildUrl(url, this.url);
            }

            return Teselagen.manager.SessionManager.buildUrl("parts", this.url);
        }
    },

    statics: {
        // For Default Names
        defaultNamePrefix: "Part",
        highestDefaultNameIndex: 0
    },

    hasSequenceFile: false,

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
        type: "long",
        defaultValue: null
    }, {
        name: "directionForward",
        type: "boolean",
        defaultValue: true
    },
    {
        name: "name",
        sortType: function (s) {
            return String(s).toUpperCase();
        },
        convert: function(v) {
            var name;
            name = v;
            if (v === undefined || v === null) {name = "";}
            return name;
    }}, {
        name: "partSource",
        type: "string",
        defaultValue: ""
    }, {
        name: "revComp",
        type: "boolean",
        defaultValue: false
    },
    {
        name: "genbankStartBP",
        type: "int",
        defaultValue: 0,
        convert: function(value, record) {
            record.data.genbankStartBP = Number(value);
            record.calculateSize(true);

            return value;
        }
    },
    {
        name: "endBP",
        type: "int",
        defaultValue: 0,
        convert: function(value, record) {
            record.data.endBP = Number(value);
            record.calculateSize(true);

            return value;
        }
    },
    {
        name: "size",
        type: "int",
        defaultValue: 0
    },
    {
        name: "iconID",
        type: "string",
        defaultValue: ""
    },
    {
        name: "features",
        type: "string",
        defaultValue: ""
    },
    {
        name: "dateCreated",
        type: "string"
    },
    {
        name: "dateModified",
        type: "string"
    },
    {
        name: "user_id",
        type: "long"
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
        getterName: "getSequenceFileModel",
        setterName: "setSequenceFileModel"
    }, {
        type: "belongsTo",
        model: "Teselagen.models.User",
        getterName: "getUser",
        setterName: "setUser",
        associationKey: "user",
        foreignKey: "user_id"
    }

    ],
    
    constructor: function() {
        this.callParent(arguments);
    },
    
    active: false,
    
    setActive: function(value) {
    	this.active = value;
    },
    
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

    calculateSize: function(ignoreNoSequenceFile){
        var record = this;
        var size = 0;

        record.getSequenceFile(function(sequenceFile) {
            if(!sequenceFile && !ignoreNoSequenceFile)
            {
                console.warn("Trying to calculate size of Part with no sequenceFile");
                return false;
            }

            var startBP = record.get("genbankStartBP");
            var endBP = record.get("endBP");

            if(startBP>endBP) {
                var tSize = record.getSequenceFile().getLength();
                size = Math.abs(tSize - (Math.abs(endBP - startBP)) + 1);
            } else if (startBP==endBP) {
                size = 1;
            } else {
                size = (Math.abs(startBP - endBP) + 1);
            }

            if(size === 0) {
                console.warn("Part with sequence with length zero.");
            }

            record.set('size', size);
        });
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

            this.hasSequenceFile = true;
            this.calculateSize();
        }
        return success;
    },

    /**
     * Gets SequenceFile.
     * @returns {Teselagen.models.SequenceFile} The sequencefile model.
     */
    getSequenceFile: function(callbackFn) {
        if(this.hasSequenceFile || this.get("sequencefile_id")) {

            var sequences = Teselagen.manager.ProjectManager.sequences;
            var sequence = sequences.getById(this.get("sequencefile_id"));

            if(sequence) {
                if(typeof(callbackFn) === "object") {
                    return callbackFn.callback(sequence);
                } else if(typeof callbackFn === "function") {
                    return callbackFn(sequence);
                } else {
                    return sequence;
                }
            }

            if(typeof(callbackFn) === "object"){
                return this.getSequenceFileModel({
                    callback: callbackFn.callback
                });
            } else if(typeof callbackFn === "function") {
                return callbackFn(this.getSequenceFileModel());
            } else {
                return this.getSequenceFileModel();
            }
        } else {
            return null;
        }

    },

    /** (WEIRD PROBLEM--print part, does not show same seqFile from getSeqFile.)
     * Removes the SequenceFile of Part. Resets the Sequence File format to INIT (?),
     * and the content, filename, partsource, etc to empty strings.
     * Resets the Start and Stop in Part to 0.
     *
     * @returns {Boolean} True if removed, false if not.
     */
    removeSequenceFile: function() {
        this.setSequenceFileModel(null);
        this.setStart(0);
        this.setEnd(0);
        if (this.getSequenceFile().get("sequenceFileFormat") === "INIT") {
            return true;
        } else {
            return false;
        }
    },

    /**
     * Checks to see if part is mapped to a valid (nonempty) sequenceFile.
     */
    isMapped: function() {
        if(this.get("sequencefile_id") || this.hasSequenceFile) {
            return true;
        } else {
            return false;
        }
    }
});
