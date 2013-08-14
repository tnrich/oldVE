 /**
 * @class Teselagen.models.SequenceFile
 * Class describing a SequenceFile.
 * @author Diana Wong
 * @author Douglas Densmore (original author) ?
 */
Ext.define("Teselagen.models.SequenceFile", {
    extend: "Ext.data.Model",

    requires: ["Teselagen.bio.util.Sha256", "Teselagen.constants.Constants", "Teselagen.manager.SessionManager","Teselagen.manager.SequenceManager"],

    proxy: {
        type: "rest",
        url: "/vede/test/data/json/sequenceFiles.json",
        reader: {
            type: "json",
            root: "sequences",
            totalProperty: "total"
        },
        writer: {
            type: "json"
        },
        buildUrl: function(request) {


            // GET SEQUENCES
            if( request.action === "read" && !request.operation.id)
            {
                    var url = "sequences";
                    //delete request.params;
                    return Teselagen.manager.SessionManager.buildUrl(url, this.url);
            }


            // GET SPECIFIC SEQUENCE
            if( request.operation.action === "read" && !request.operation.filters && request.params.id)
            {
                var url = "sequences/"+request.params.id;
                delete request.params;
                return Teselagen.manager.SessionManager.buildUrl(url, this.url);
            }

            
            // CREATE A NEW SEQUENCE
            if(request.action === "create" && !request.records[0].data.id)
            {
                var url = "sequences";
                delete request.params;
                return Teselagen.manager.SessionManager.buildUrl(url, this.url);
            }

            // GET CREATE SEQUENCE WITHOUT ID!
            if( request.operation.action === "create" && !request.operation.filters && !request.params.id)
            {
                var url = "sequences";
                delete request.params;
                return Teselagen.manager.SessionManager.buildUrl(url, this.url);
            }

            // GET SPECIFIC SEQUENCE WITHOUT ID!
            if( request.operation.action === "read" && !request.operation.filters && !request.params.id)
            {
                var url = "sequences";
                delete request.params;
                return Teselagen.manager.SessionManager.buildUrl(url, this.url);
            }

            // UPDATE A SEQUENCE
            if ( request.action === "update" && request.records[0].data.id)
            {
                var url = "sequences/" + request.records[0].data.id;
                delete request.params;
                return Teselagen.manager.SessionManager.buildUrl(url, this.url);                
            }


        }
    },

    /**
     * Input parameters.
     * @param {String} sequenceFileFormat (required)
     * @param {String} sequenceFileContent (required)
     * @param {String} [sequenceFileName] If n
     * @param {String} [partSource]
     * @param {String} [hash] Hash code from sha256 encryption (Generated upon creating this object)
     */
    fields: [{
        name: "id",
        type: "long"
    }, {
        name: "part_id",
        type: "long"
    }, {
        name: "name",
        type: "string"
    }, {
        name: "sequenceFileFormat",
        convert: function(v) {
            var format = v;

            if(format==="GENBANK") format = "Genbank";
            if(format==="Fasta") format = "FASTA";
            if(format==="JBEISEQXML") format = "jbei-seq";

            //var format = v.toUpperCase().replace(/[^A-Z]/gi, "");
            //format = format.toUpperCase().replace("-", "");
            //format = format.toUpperCase().replace("JBEISEQ", "JBEISEQXML");
            var constants = Teselagen.constants.Constants;

            if (format === constants.GENBANK || format === constants.FASTA || format === constants.JBEISEQ || format === constants.SBOLXML) {
                return format;
            } else {
                // COMMENTING THIS OUT FOR NOW
                //console.warn("Teselagen.models.SequenceFile: File format, '" + v + "' for this sequence is not recognized. Format not set.");
                return "INIT";
            }

        }
    },

    {
        name: "sequenceFileContent",
        type: "string",
        defaultValue: ""
    },

    {
        name: "hash",
        convert: function(v, record) {
            if(v) {
                return v;
            } else {
                var content = record.get("sequenceFileContent");
                if(content)
                {
                content = content.replace(/&amp;/g,'');
                content = content.replace(/amp;/g,'');
                content = content.replace(/&quot;/g,'"');
                content = content.replace(/quot;/g,'"');

                return Teselagen.bio.util.Sha256.hex_sha256(content);
                }
                else
                {
                    console.warn("Working with a sequence with empty content");
                    return "";
                }
            }
        }
    },

    {
        name: "partSource",
        convert: function(v, record) {

            if (!(v === "" || v === undefined || v === null)) {
                return v;
            }
            var format = record.get("sequenceFileFormat");
            var content = record.get("sequenceFileContent");

            return record.makePartSource(format, content);
        }
    },

    {
        name: "sequenceFileName",
        convert: function(v, record) {
            if (!(v === "" || v === undefined || v === null)) {
                return v;
            }

            var format = record.get("sequenceFileFormat");
            var source = record.get("partSource");

            var name = record.makeSequenceFileName(format, source);

            return name;
        }
    }, 
    {
        name: "dateCreated",
        type: "string",
    },
    {
        name: "dateModified",
        type: "string",
    },
    {
        name: "firstTimeImported",
        type: "boolean",
        defaultValue: "false"
    }, {
        name: "size",
        type: "short",
        /*convert: function(v, record) {
            if (!(v === "" || v === undefined || v === null)) {
                return v;
            }

            var length = record.getLength();

            return length;
        }*/
    },{
        name: "user_id",
        type: "long"
    },
    {
        name: 'serialize', 
        type: "auto",
        convert: function(v, record) {
            this.sequenceChanged = true;

            return v;
        }
    },

    ],
    /*
    validations: [{
        field: "sequenceFileFormat",
        type: "presence"
    }, {
        field: "sequenceFileFormat",
        type: "inclusion",
        list: ["GENBANK", "FASTA", "JBEISEQXML", "JBEISEQJSON", "SBOLXML"]
    }, {
        field: "sequenceFileContent",
        type: "presence"
    }
    //{field: "sequenceFileName",     type: "presence"},
    //{field: "partSource",           type: "presence"},
    //{field: "hash",                 type: "presence"}
    ],
    */
    associations: [{
        type: "belongsTo",
        model: "Teselagen.models.Part",
        getterName: "getPart",
        setterName: "setPart",
        foreignKey: "part_id"
    }, {
        type: "belongsTo",
        model: "Teselagen.models.User",
        getterName: "getUser",
        setterName: "setUser",
        associationKey: "user",
        foreignKey: "user_id"
    }],

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

        var constants = Teselagen.constants.Constants;
        var source = ""; //"UNKNOWN";
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
        } else {}
        return source;
    },

    /**
     * Sets PartSource based on FileFormat and FileContent.
     * DOES NOT CHECK FOR UNIQUENESS OF NAME.
     *
     * @param {String} [pPartSource] Name of the PartSource. If undefined, will set based on SequenceFileContent and SequenceFileFormat properties.
     * @returns {String} Name of the set partSource
     */
    setPartSource: function(pPartSource) {

        // In The case where there is an input
        if (!(pPartSource === "" || pPartSource === undefined || pPartSource === null)) {
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

        var constants = Teselagen.constants.Constants;
        var format = this.get("sequenceFileFormat");
        var name = "";

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
            // FIGURE OUT WHAT TO DO WITH THIS WARNING LATER
            //console.warn("Teselagen.models.SequenceFile: File format, '" + format + "' for this sequence is not recognized. Proper suffix for SequenceFileName not set.");
        }

        return name;
    },

    /**
     * Sets FileName based on PartSource
     * DOES NOT CHECK FOR UNIQUENESS OF NAME.
     *
     * @param {String} [pSequenceFileName] Sequence File name. If undefined, will set based on SequenceFileContent and SequenceFileFormat.
     * @returns {String} Set sequenceFileName.
     */
    setSequenceFileName: function(pName) {
        // In The case where there is an input
        if (!(pName === undefined || pName === null || pName === "")) {
            this.set("sequenceFileName", pName);
            return pName;
        }

        // The case of double checking what the sequenceFileName has already been set to.
        var name = this.get("sequenceFileName");

        // reparse from Content if there is no name
        if (name.replace(/\.gb|\.fas|\.xml/gi, "") === "" || name === undefined) {
            var source = this.makePartSource(this.get("sequenceFileFormat"), this.get("sequenceFileContent"));
            name = this.makeSequenceFileName(this.get("sequenceFileFormat"), source);
        }

        this.set("sequenceFileName", name);
        return name;
    },


    /** COME BACK AND FILL THIS IN FOR GENBANK AND JBEISEQ
     * Determine the length of the sequence.
     * @returns {Number} Length of the sequence
     */
    getLength: function() {
        var constants = Teselagen.constants.Constants;
        var format = this.get("sequenceFileFormat");
        var content = this.get("sequenceFileContent");
        var end = 0;

        if (format === constants.GENBANK) {
            var gb = Teselagen.bio.parsers.GenbankManager.parseGenbankFile(content);
            if (gb) {
                if (gb.findKeyword("ORIGIN")) {
                    end = gb.findKeyword("ORIGIN").getSequence().length;
                } else end = -1;
            } else end = -1;
        } else if (format === constants.FASTA) {
            var seq = content.replace(/>\s*(\S*)\s*/, "");
            seq = seq.replace(/\s/, "");
            end = seq.length;
        } else if (format === constants.JBEISEQ) {
            var jbei = Teselagen.bio.parsers.ParsersManager.jbeiseqXmlToJson(content);
            end = jbei["seq:seq"]["seq:sequence"].length;
        } else if (format === constants.SBOLXML) {
            var sbol = Teselagen.bio.parsers.ParsersManager.sbolXmlToJson(content);
            console.warn("Finding length for SBOL file not determined yet");
            end = -1;
        } else {}
        return end;
    },

    getSequenceManager: function(){
        var data = this.get("serialize");
        if(!data || data === "") {
            return null;
        } else if(!this.sequenceManager || this.sequenceChanged){
            var decodedData = data;
            this.sequenceManager = Ext.create("Teselagen.manager.SequenceManager", decodedData.inData);
            this.sequenceManager.deSerialize(decodedData);

            this.sequenceChanged = false;

            return this.sequenceManager;
        } else {
            return this.sequenceManager;
        }
    },

    setSequenceManager: function(sequenceManager){
        if(sequenceManager) {
            var data = sequenceManager.serialize();
            this.set('size', sequenceManager.getSequence().getSymbolsLength());
            this.set("serialize",data);
        }
    },

    processSequence: function(cb, gb){
        var fileContent = this.get("sequenceFileContent");
        var fileFormat = 
            Teselagen.constants.Constants.SEQUENCE_FILE_FORMAT_TO_FILE_EXTENSION_MAP[
                this.get("sequenceFileFormat")];

        if(!this.get("serialize") && fileContent) {
            // If gb is not defined, calculate it.
            if(!gb) {
                gb = Teselagen.utils.FormatUtils.fileToGenbank(fileContent,
                                                               fileFormat);
            }

            var seqMgr = Teselagen.utils.FormatUtils.genbankToSequenceManager(gb);

            if(seqMgr) {
                this.setSequenceManager(seqMgr);
                return cb(false, seqMgr, gb);
            } else {
                return cb(true);
            }
        } else {
            return cb(true);
        }
    }
});
