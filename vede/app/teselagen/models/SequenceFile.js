/**
 * @class Teselagen.models.SequenceFile
 * Class describing a SequenceFile for J5Parameters.
 * @author Diana Wong
 * @author Zinovii Dmytriv (original author) ?
 */
Ext.define("Teselagen.models.SequenceFile", {
    extend: "Ext.data.Model",

    requires: [
        "Teselagen.bio.util.Sha256"
    ],

    statics: {
    },

    /**
     * Input parameters.
     * NOTE: Must execute setId() to set the id from "" to a unique identifier.
     * @param {String} sequenceFileFormat
     * @param {String} sequenceFileContent
     * @param {String} sequenceFileName
     * @param {String} partSource
     * @param {String} hash Hash code from sha256 encryption
     */
    fields: [
        {name: "sequenceFileFormat",    type: "string",     defaultValue: null},
        {name: "sequenceFileContent",   type: "string",     defaultValue: null},
        {name: "sequenceFileName",      type: "string",     defaultValue: null},
        {name: "partSource",            type: "string",     defaultValue: null},
        {name: "hash",                  type: "string",     defaultValue: null}
    ],

    belongsTo: [
        "Teselagen.models.PartVO"
    ],

    /**
     * Sets the sequenceFileContent for this part
     * NOTE: Must execute setSequenceFileContent() to set the hash from "" to a unique identifier.
     * @param {String} content Sequence File Content
     */
     setSequenceFileContent: function(pContent) {

        this.set("sequenceFileContent", pContent);

        // DO NOT NEED TO DO writeUTFBytes
        var contentByte = encodeURIComponent(pContent);
        //https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/encodeURIComponent

        var hash = Teselagen.bio.util.Sha256.hex_sha256(pContent);

        this.set("hash", hash);

        return true;
     }
});
