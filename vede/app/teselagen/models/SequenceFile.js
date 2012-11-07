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
        "Teselagen.constants.Constants",
        "Teselagen.manager.SessionManager"
    ],

    proxy: {
        type: "rest",
        url: "/vede/test/data/json/sequenceFiles.json",
        reader: {
            type: "json",
            root: "sequence"
        },
        writer: {
            type: "json"
        },
        buildUrl: function() {
            return Teselagen.manager.SessionManager.buildUrl("user/projects/veprojects/sequencefile", this.url);
        }
    },

    /**
     * Input parameters.
     * @param {String} sequenceFileFormat (required)
     * @param {String} sequenceFileContent (required)
     * @param {[String]} sequenceFileName If n
     * @param {[String]} partSource
     * @param {[String]} hash Hash code from sha256 encryption (Generated upon creating this object)
     */
    fields: [
        {name: "id", type: "long"},
        { name: "veproject_id", type: "long" },
        { name: "part_id", type: "long" },
        {
            name: "sequenceFileFormat",
            convert: function(v) {
                var format = v.toUpperCase().replace(/[^A-Z]/gi,"");
                var constants = Teselagen.constants.Constants;

                if (format === constants.GENBANK || format === constants.FASTA || format === constants.JBEISEQ || format === constants.SBOLXML) {
                    return format;
                } else {
                    console.warn("Teselagen.models.SequenceFile: File format, '" + v + "' for this sequence is not recognized. Format not set.");
                    return "";
                }
                
            }
        },
        
        {name: "sequenceFileContent",   type: "string",     defaultValue: ""},

        {
            name: "hash",
            convert: function(v, record) {
                var content = record.get("sequenceFileContent");
                return Teselagen.bio.util.Sha256.hex_sha256(content);
            }
        },

        {
            name: "partSource",
            convert: function(v, record) {

                if (! (v === "" || v === undefined || v === null) ) {
                    return v;
                }
                var format      = record.get("sequenceFileFormat");
                var content     = record.get("sequenceFileContent");

                return record.makePartSource(format, content);
            }
        },

        {
            name: "sequenceFileName",
            convert: function(v, record) {
                if (! (v === "" || v === undefined || v === null) ) {
                    return v;
                }

                var format      = record.get("sequenceFileFormat");
                var source      = record.get("partSource");

                var name = record.makeSequenceFileName(format, source);

                return name;
            }
        }
    ],

    validations: [
        {field: "sequenceFileFormat",   type: "presence"},
        {
            field: "sequenceFileFormat",
            type: "inclusion",
            list: Teselagen.constants.Constants.FORMATS_LIST
        },
        {field: "sequenceFileContent",  type: "presence"}
        //{field: "sequenceFileName",     type: "presence"},
        //{field: "partSource",           type: "presence"},
        //{field: "hash",                 type: "presence"}
    ],

    associations: [
        {
            type: "belongsTo",
            model: "Teselagen.models.Part",
            name: "part",
            getterName: "getPart",
            setterName: "setPart",
            associationKey: "part",
            foreignKey: "part_id"
        },
        {
            type: "belongsTo",
            model: "Teselagen.models.VectorEditorProject",
            name: "VectorEditorProject",
            getterName: "getVectorEditorProject",
            setterName: "setVectorEditorProject",
            associationKey: "VectorEditorProject",
            foreignKey: "veproject_id"
        }
    ],

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
     * If no Part Source is given, this function determines it based on SequenceFileContent.
     * @private
     */
    makePartSource: function(pFormat, pContent) {

        var constants   = Teselagen.constants.Constants;
        var source      = "";//"UNKNOWN";
        var cnt;

        if (pFormat === constants.GENBANK) {
            cnt = pContent.match(/LOCUS *(\S*)/);
            if (cnt !== null && cnt.length >= 1) {
                source = cnt[1].toString();
            }
        } else if (pFormat === constants.FASTA) {
            cnt = pContent.match(/>\s*(\S*)/);
            if (cnt !== null && cnt.length >= 1) {
                source = cnt[1].toString();
            }
        } else if (pFormat === constants.JBEISEQ) {
            cnt = pContent.match(/<seq:name>(.*)<\/seq:name>/);
            if (cnt !== null && cnt.length >= 1) {
                source = cnt[1].toString();
            }
        } else {
        }
        return source;
    },

    /**
     * Sets PartSource based on FileFormat and FileContent.
     * DOES NOT CHECK FOR UNIQUENESS OF NAME.
     *
     * @param {[String]} pPartSource Optional. Name of the PartSource. If undefined, will set based on SequenceFileContent and SequenceFileFormat properties.
     * @returns {String} Name of the set partSource
     */
    setPartSource: function(pPartSource) {

        // In The case where there is an input
        if (! (pPartSource === "" || pPartSource === undefined || pPartSource === null) ) {
            this.set("partSource", pPartSource);
            return pPartSource;
        }

        var source = this.makePartSource(this.get("sequenceFileFormat"), this.get("sequenceFileContent"));

        this.set("partSource", source);
        return source;
    },

    /**
     * If no File Name is given, this function determines it based on SequenceFileContent and SequenceFileFormat.
     * @private
     */
    makeSequenceFileName: function(pFormat, pSource) {

        var constants   = Teselagen.constants.Constants;
        var format      = this.get("sequenceFileFormat");
        var name        = "";

        // If the file name was set with a "" for partSource, the file name may be ".fas", ".gb", or "xml"
        // Overwrite these filenames if that is true calling this method.

        if (format === constants.GENBANK) {
            name = pSource + ".gb";
        } else if (format === constants.FASTA) {
            name = pSource + ".fas";
        } else if (format === constants.JBEISEQ) {
            name = pSource + ".xml"; // IS THIS THE CORRECT FILE SUFFIX?
        } else {
            name = pSource;
            console.warn("Teselagen.models.SequenceFile: File format, '" + format + "' for this sequence is not recognized. Proper suffix for SequenceFileName not set.");
        }

        return name;
    },

    /**
     * Sets FileName based on PartSource
     * DOES NOT CHECK FOR UNIQUENESS OF NAME.
     *
     * @params {[String]} pSequenceFileName Optional. Sequence File name. If undefined, will set based on SequenceFileContent and SequenceFileFormat.
     * @returns {[String]} Set sequenceFileName.
     */
    setSequenceFileName: function(pName) {
        // In The case where there is an input
        if (! (pName === undefined || pName === null || pName === "") ) {
            this.set("sequenceFileName", pName);
            return pName;
        }

        // The case of double checking what the sequenceFileName has already been set to.
        var name = this.get("sequenceFileName");

        // reparse from Content if there is no name
        if (name.replace(/\.gb|\.fas|\.xml/gi,"") === "" || name === undefined ) {
            var source = this.makePartSource(this.get("sequenceFileFormat"), this.get("sequenceFileContent"));
            name = this.makeSequenceFileName(this.get("sequenceFileFormat"), source);
        }

        this.set("sequenceFileName", name);
        return name;
    },


    /**
     * Determine the length of the sequence.
     * @returns {Number} Length of the sequence
     */
    getLength: function() {
        var format  = this.get("sequenceFileFormat");
        var end     = 0;

        // If the file name was set with a "" for partSource, the file name may be ".fas", ".gb", or "xml"
        // Overwrite these filenames if that is true calling this method.

        if (format === constants.GENBANK) {
        } else if (format === constants.FASTA) {
        } else if (format === constants.JBEISEQ) {
        } else {
        }
        return end;
    }
});
