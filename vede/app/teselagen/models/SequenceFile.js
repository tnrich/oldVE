/**
 * @class Teselagen.models.SequenceFile
 * Class describing a SequenceFile.
 * @author Diana Wong
 * @author Douglas Densmore (original author) ?
 */
Ext.define("Teselagen.models.SequenceFile", {
    extend: "Ext.data.Model",

    requires: [
        "Teselagen.bio.util.Sha256",
        "Teselagen.constants.Constants"
    ],

    proxy: {
        type: "memory"
    },

    statics: {
    },

    Constants: null,

    /**
     * Input parameters.
     * @param {String} sequenceFileFormat (required)
     * @param {String} sequenceFileContent (required)
     * @param {String} sequenceFileName
     * @param {String} partSource
     * @param {String} hash Hash code from sha256 encryption (Generated upon creating this object)
     */
    fields: [
        {name: "id",                    type: "int"},
        //{name: "sequenceFileFormat",    type: "string",     defaultValue: ""},
        {
            name: "sequenceFileFormat",
            convert: function(v, record) {
                v = v.toUpperCase();
                return v;
            }
        },
        {name: "sequenceFileContent",   type: "string",     defaultValue: ""},
        {name: "sequenceFileName",      type: "string",     defaultValue: ""},
        {name: "partSource",            type: "string",     defaultValue: ""},
        {name: "hash",                  type: "string",     defaultValue: ""}
    ],

    validations: [
        {field: "sequenceFileFormat",   type: "presence"},
        {
            field: "sequenceFileFormat",
            type: "inclusion",
            list: [
                Teselagen.constants.Constants.GENBANK,     // "Genbank"
                Teselagen.constants.Constants.FASTA,       // "FASTA"
                Teselagen.constants.Constants.JBEI_SEQ     // "jbei-seq"
            ]
        },
        {field: "sequenceFileContent",  type: "presence"},
        {field: "sequenceFileName",     type: "presence"},
        {field: "partSource",           type: "presence"},
        {field: "hash",                 type: "presence"}
    ],

    associations: [
        {
            type: "belongsTo",
            model: "Teselagen.models.Part",
            name: "part",
            getterName: "getPart",
            setterName: "setPart",
            associationKey: "part"
        },
        {
            type: "belongsTo",
            model: "Teselagen.models.Project",
            name: "project",
            getterName: "getProject",
            setterName: "setProject",
            associationKey: "project"
        }
    ],

    /*constructor: function() {
        console.log("constructor");
    },*/


    // Some of these taken from SequenceFileManager/SequenceProxy

    // Tried using Constructor and it doesn't work.
    // Read on forums to use init as a way to execute methods after the fields block. --DW
    init: function() {
        //console.log("init");
        this.Constants = Teselagen.constants.Constants;

        // Set the Hash Field
        this.setSequenceFileContent(this.get("sequenceFileContent"));

        // Set PartSource with Display ID
        this.setPartSource();

        // Set FileName if given ""
        this.setSequenceFileName();
    },

    /**
     * Sets the sequenceFileContent for thi
     * NOTE: Must execute setSequenceFileContent() to set the hash from "" to a unique identifier.
     * @param {String} pContent The sequence file, in string form.
     * @returns {String} SequenceHash
     */
    setSequenceFileContent: function(pContent) {

        if (pContent === undefined || pContent === null) {
            pContent = "";
        }

        this.set("sequenceFileContent", pContent);

        // DO NOT NEED TO DO writeUTFBytes
        //var contentByte = encodeURIComponent(pContent);
        //https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/encodeURIComponent

        var hash = Teselagen.bio.util.Sha256.hex_sha256(pContent);
        this.set("hash", hash);

        return hash;
    },

    /**
     * Sets PartSource based on FileFormat and FileContent.
     * DOES NOT CHECK FOR UNIQUENESS OF NAME
     * @returns {String} Name of the PartSource
     */
    setPartSource: function() {
        var displayID = "";
        var cnt;
        var content = this.get("sequenceFileContent");

        if (!(this.get("partSource") === "" || this.get("partSource") === undefined || this.get("partSource" === null))) {
            return this.get("partSource");
        }

        if (this.get("sequenceFileFormat") === Teselagen.constants.Constants.GENBANK) {
            cnt = content.match(/LOCUS *(\S*)/);
            if (cnt.length >= 1) {
                displayID = cnt[1].toString();
            }
        } else if (this.get("sequenceFileFormat") === Teselagen.constants.Constants.FASTA) {
            cnt = content.match(/>\s*(\S*)/);
            if (cnt.length >= 1) {
                displayID = cnt[1].toString();
            }
        } else if (this.get("sequenceFileFormat") === Teselagen.constants.Constants.JBEI_SEQ) {
            cnt = content.match(/<seq:name>(.*)<\/seq:name>/);
            if (cnt.length >= 1) {
                displayID = cnt[1].toString();
            }
        }
        this.set("partSource", displayID);
        return displayID;
    },

    /**
     * Sets FileName based on PartSource
     * DOES NOT CHECK FOR UNIQUENESS OF NAME
     * @returns {String} SequenceFileName
     */
    setSequenceFileName: function() {
        var format      = this.get("sequenceFileFormat");
        //var constants   = Teselagen.constants.Constants;
        var displayID   = this.get("partSource");
        var name        = this.get("sequenceFileName");

        if (this.get("sequenceFileName") === "" || this.get("sequenceFileName") === undefined ) {
            if (format === Teselagen.constants.Constants.GENBANK) {
                name = displayID + ".gb";
            } else if (format === Teselagen.constants.Constants.FASTA) {
                name = displayID + ".fas";
            } else if (format === Teselagen.constants.Constants.JBEI_SEQ) {
                name = displayID + ".xml"; // IS THIS THE CORRECT FILE SUFFIX?
            } else {
                name = displayID;
                console.warn("Teselagen.models.SequenceFile: File format, '" + format + "' for this sequence is not recognized. SequenceFileName not set.");
            }
        }
        this.set("sequenceFileName", name);
        return name;
    }
});
