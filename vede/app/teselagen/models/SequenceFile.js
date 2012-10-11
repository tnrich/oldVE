/**
 * @class Teselagen.models.SequenceFile
 * Class describing a SequenceFile for J5Parameters.
 * @author Diana Wong
 * @author Douglas Densmore (original author) ?
 */
Ext.define("Teselagen.models.SequenceFile", {
    extend: "Ext.data.Model",

    requires: [
        "Teselagen.bio.util.Sha256",
        "Teselagen.constants.Constants"
    ],

    statics: {
    },

    /**
     * Input parameters.
     * @param {String} sequenceFileFormat (required)
     * @param {String} sequenceFileContent (required)
     * @param {String} sequenceFileName
     * @param {String} partSource
     * @param {String} hash Hash code from sha256 encryption (Generated upon creating this object)
     */
    fields: [
        {name: "sequenceFileFormat",    type: "string",     defaultValue: ""},
        {name: "sequenceFileContent",   type: "string",     defaultValue: ""},
        {name: "sequenceFileName",      type: "string",     defaultValue: ""},
        {name: "partSource",            type: "string",     defaultValue: ""},
        {name: "hash",                  type: "string",     defaultValue: ""}
    ],

    validations: [
        {field: "sequenceFileFormat",   type: "presence"},
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


    // Some of these taken from SequenceFileManager/SequenceProxy
    init: function() {

        // Set PartSource with Display ID
        this.setPartSource();

        // Set FileName if given ""
        this.setSequenceFileName();

        // Set the Hash Field
        this.setSequenceFileContent(this.get("sequenceFileContent"));
    },

    /**
     * Sets the sequenceFileContent for this part
     * NOTE: Must execute setSequenceFileContent() to set the hash from "" to a unique identifier.
     * @returns {String} hash SequenceHash
     */
    setSequenceFileContent: function(pContent) {

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
     * @returns {String} displayID Name of the PartSource
     */
    setPartSource: function() {
        var displayID = "";
        var cnt;
        var content = this.get("sequenceFileContent");

        if (this.get("sequenceFileFormat") === Teselagen.constants.Constants.self.GENBANK) {
            cnt = content.match(/LOCUS *(\S*)/);
            if (cnt.length > 1) {
                displayID = cnt[1].toString();
            }
        } else if (this.get("sequenceFileFormat") === Teselagen.constants.Constants.self.FASTA) {
            cnt = content.match(/>\s*(\S*)/);
            if (cnt.length > 1) {
                displayID = cnt[1].toString();
            }
        } else if (this.get("sequenceFileFormat") === Teselagen.constants.Constants.self.JBEI_SEQ) {
            cnt = content.match(/<seq:name>(.*)<\/seq:name>/);
            if (cnt.length > 1) {
                displayID = cnt[1].toString();
            }
        }
        this.set("partSource", displayID);
        return displayID;
    },

    /**
     * Sets FileName based on PartSource
     * DOES NOT CHECK FOR UNIQUENESS OF NAME
     * @returns {String} name SequenceFileName
     */
    setSequenceFileName: function() {
        var format      = this.get("sequenceFileFormat");
        var constants   = Teselagen.constants.Constants;
        var displayID   = this.get("partSource");
        var name        = "";

        if (this.get("sequenceFileName") === "" || this.get("sequenceFileName") === undefined ) {
            if (format === constants.self.GENBANK) {
                name = displayID + ".gb";
            } else if (format === constants.self.FASTA) {
                name = displayID + ".fas";
            } else if (format === constants.self.JBEI_SEQ) {
                name = displayID + ".xml"; // IS THIS THE CORRECT FILE SUFFIX?
            } else {
                name = displayID;
                console.warn("File format for this sequence is not recognized.  Beware of nonsensical file names or missing sequence files.");
            }
        }
        this.set("sequenceFileName", name);
        return name;
    }
});
