/**
 * @class Teselagen.utils.FormatUtils
 *
 * Converts SequenceManager to various file formats using
 * {@link Teselagen.bio.parsers.ParsersManager}
 *
 * This class directly converts:
 *          FASTA ---> {@link Teselagen.models.FeaturedDNASequence}
 *
 *          FASTA <--> {@link Teselagen.manager.SequenceManager}
 *
 *          FileString (FASTA, GenBank, JbeiSeq, SBOL?) ---> {@link Teselagen.models.SequenceFile}
 *
 *          jbeiseq JSON <--> {@link Teselagen.manager.SequenceManager}
 *
 *          jbeiseq XML <--> {@link Teselagen.manager.SequenceManager}
 *
 *          {@link Teselagen.models.SequenceFile}  <--> {@link Teselagen.manager.SequenceManager}
 *
 *          {@link Teselagen.manager.SequenceManager}  ---> {@link Teselagen.models.FeaturedDNASequence}
 *
 *          {@link Teselagen.manager.SequenceManager}  ---> {@link Teselagen.bio.parsers.Genbank}
 *
 *
 * Calls methods from {@link Teselagen.bio.parsers.ParsersManager}, can also convert:
 *      FASTA/GenBank:
 *          FASTA <--> Genbank
 *
 *      JbeiSeq/Genbank:
 *          jbeiseqXMLs (more than one) --> ArrayList<jbeiseqXml>
 *          jbeiseqXML <--> jbeiseqJSON <--> Genbank
 *
 *      SBOL/JbeiSeq
 *          sbolXML <--> sbolJSON <--> jbeiJSON
 *
 *
 * Use {@link Teselagen.bio.parsers.JbeiseqParser} to convert:
 *          jbeiseqXMLs (more than one) --> ArrayList<jbeiseqXml>
 *
 *          jbeiseqXML <--> jbeiseqJSON <--> Genbank
 *
 *
 * @author Diana Wong
 */

Ext.define("Teselagen.utils.FormatUtils", {
    requires: [
        "Teselagen.bio.util.StringUtil",
        "Teselagen.bio.util.XmlToJson",
        "Teselagen.bio.util.Sha256",

        "Teselagen.bio.parsers.GenbankManager",
        "Teselagen.bio.parsers.ParsersManager",

        "Teselagen.bio.sequence.alphabets.DNAAlphabet",
        "Teselagen.bio.sequence.dna.DNASequence",
        "Teselagen.bio.sequence.dna.Feature",
        "Teselagen.bio.sequence.dna.FeatureNote",
        "Teselagen.bio.sequence.DNATools",

        "Teselagen.utils.SequenceUtils",
        "Teselagen.constants.Constants"
    ],

    singleton: true,

    DNAAlphabet: null,
    StringUtil: null,
    XmlToJson: null,
    Sha256: null,

    Constants: null,
    SequenceUtils: null,
    GenbankManager: null,
    ParsersManager: null,
    //SequenceFileManager: null,
    
    /**
     * @member Teselagen.utils.FormatUtils
     */
    constructor: function() {
        DNAAlphabet     = Teselagen.bio.sequence.alphabets.DNAAlphabet;
        DNATools        = Teselagen.bio.sequence.DNATools;

        StringUtil      = Teselagen.bio.util.StringUtil;
        XmlToJson       = Teselagen.bio.util.XmlToJson;
        Sha256          = Teselagen.bio.util.Sha256;

        Constants       = Teselagen.constants.Constants;
        SequenceUtils   = Teselagen.utils.SequenceUtils;

        GenbankManager  = Teselagen.bio.parsers.GenbankManager;
        ParsersManager  = Teselagen.bio.parsers.ParsersManager;

        //SequenceFileManager = Teselagen.manager.SequenceFileManager;
    },

    /**
     * Determines if string is only alphanumeric with underscores "_" or hyphens "-".
     * (REFACTORED FROM DEVICEDESIGNMANAGER)
     * @param {String} pName
     * @returns {Boolean}
     */
    isLegalName: function(pName) {
        var str = pName.toString();
        if (str.match(/[^a-zA-Z0-9_\-]/) !== null) {
            return false;
        } else {
            return true;
        }
    },

    /**
     * Reformat name to be only alphanumeric with underscores "_" or hyphens "-".
     *(REFACTORED FROM DEVICEDESIGNMANAGER)
     * @param {String} pName
     * @returns {String} New name.
     */
    reformatName: function(pName) {
        return pName.toString().replace(/[^a-zA-Z0-9_\-]/g, "");
    },

    /**
     * Determines if a name (of a Genbank Feature Qualifier) is a "Label".
     * A "label" can be label, name, note, gene, organism, and is considered the
     * "label" of a JbeiSeq's feature (ie. "seq:label").
     * In GenBank, the name of the Feature Element is the "type" in JbeiSeq, and
     * the Feature Qualfier with a labe;/name/note/gene/organism is the "label".
     *
     * @param {String} name
     * @return {Boolean} If it is a label or not.
     */
    isALabel: function(name) {
        /*if (name === "label" || name === "name"|| name === "ApEinfo_label" ||
            name === "note" || name === "gene" || name === "organism"  ) {

            return true;
        } else {
            return false;
        }*/

        //return this.ParsersManager.isALabel(name);
        return Teselagen.bio.parsers.ParsersManager.isALabel(name);
    },

    /** NOT TESTED
     * Determines an appropriate name for a Model (J5Bin, Part, EugeneRule)
     * @param {String} pInput Input passed into model for name
     * @param {String} pNamePrefix
     * @param {Number} pNameNum
     * @returns {Object} Name of model and Number count
     */
    createName: function(pInput, pNamePrefix, pNameNum) {
        var name;

        if (pInput === "" || pInput === undefined || pInput === null) {
            name = pNamePrefix + pNameNum;
            pNameNum += 1;
        } else {
            if (Teselagen.utils.FormatUtils.isLegalName(pInput)) {
                name = pInput.toString();
            } else {
                console.warn("Illegal name " + pInput + ". Name can only contain alphanumeric characters, underscore (_), and hyphen (-). Removing non-alphanumerics.");
                name = Teselagen.utils.FormatUtils.reformatName(pInput);
            }
        }
        return { name: name, number: pNameNum};
    },


    // ===========================================================================
    //   SequenceManager  Conversions
    // ===========================================================================

    /**
     * Converts a FASTA file into a FeaturedDNASequence form of the data.
     * @param {String} pFasta FASTA formated string
     * @returns {Teselagen.models.FeaturedDNASequence} featuredDNASequence or this output
     */
    fastaToFeaturedDNASequence: function(pFasta) {
        var result; // original wants this to be a FeaturedDNASequence NOT SeqMgr!

        var lineArr = String(pFasta).split(/[\n]+|[\r]+/);
        var seqArr  = [];
        var name    = "";
        var sequence = "";

        if (Ext.String.trim(lineArr[0]).charAt(0) === ">") {
            var nameArr = lineArr[0].match(/^>[\s]*[\S]*/);
            if (nameArr !== null && nameArr.length >= 1) {
                name = nameArr[0].replace(/^>/, "");
            }
        } else {
            console.warn("fastaToFeaturedDNASequence: No '>' detected");
            throw Ext.create("Teselagen.bio.BioException", {
                message: "Invalid Fasta file. No '>' detected"
            });
        }

        for (var i=0; i < lineArr.length; i++) {

            if ( !lineArr[i].match(/^\>/) ) {
                sequence += Ext.String.trim(lineArr[i]);
            }
        }
        sequence = sequence.replace(/[\d]|[\s]/g, "").toLowerCase(); //remove whitespace and digits
        if (sequence.match(/[^ACGTRYMKSWHBVDNacgtrymkswhbvdn]/)) {
            //illegalcharacters
            return null;
        }

        //result = Teselagen.bio.sequence.DNATools.createDNASequence(name, sequence);

        result = Ext.create("Teselagen.models.FeaturedDNASequence", {
            name: name,
            sequence: sequence,
            isCiruclar: false, //assume linear
            features: [] //none
        });

        return result;
    },

    /**
     * Converts a FASTA file into a SequenceManager form of the data.
     * @param {String} pFasta FASTA file as a string
     * @returns Teselagen.manager.SequenceManager} sequenceManager A sequenceManager model of your data
     */
    fastaToSequenceManager: function(pFasta) {
        var result;

        var lineArr = String(pFasta).split(/[\n]+|[\r]+/);
        var seqArr  = [];
        var name    = "";
        var sequence = "";

        if (Ext.String.trim(lineArr[0]).charAt(0) === ">") {
            var nameArr = lineArr[0].match(/^>[\s]*[\S]*/);
            if (nameArr !== null && nameArr.length >= 1) {
                name = nameArr[0].replace(/^>/, "");
            }
        } else {
            console.warn("fastaToSequenceManager: No '>' detected");
            throw Ext.create("Teselagen.bio.BioException", {
                message: "Invalid Fasta file. No '>' detected"
            });
        }

        for (var i=0; i < lineArr.length; i++) {

            if ( !lineArr[i].match(/^\>/) ) {
                sequence += Ext.String.trim(lineArr[i]);
            }
        }
        sequence = sequence.replace(/[\d]|[\s]/g, "").toLowerCase(); //remove whitespace and digits
        if (sequence.match(/[^ACGTRYMKSWHBVDNacgtrymkswhbvdn]/)) {
            //illegalcharacters
            return null;
        }

        result = Ext.create("Teselagen.manager.SequenceManager", {
            name: name,
            circular: false,
            sequence: Teselagen.bio.sequence.DNATools.createDNASequence(name, sequence),
            features: []
        });

        return result;
    },

    /**
     * Converts a FASTA file into a FeaturedDNASequence form of the data.
     * @param {Teselagen.manager.SequenceManager} sequenceManager A sequenceManager model of your data
     * @returns {Teselagen.models.FeaturedDNASequence} featuredDNASequence or this output
     */
    sequenceManagerToFeaturedDNASequence: function(seqMan) {

        var result = Ext.create("Teselagen.models.FeaturedDNASequence", {
            name: seqMan.getName(),
            sequence: seqMan.getSequence().seqString(),
            isCircular: seqMan.getCircular(),
            features: seqMan.getFeatures()
        });

        return result;
    },

    /**
     * Converts a JbeiSeq XML file into a SequenceManager form of the data.
     * @param {Object} jbeiSeqJson JbeiSeqJson model of data
     * @returns {Teselagen.manager.SequenceManager} sequenceManager A sequenceManager model of your data
     */
    jbeiseqJsonToSequenceManager: function(jbeiSeqJson) {
        var result = {}; /// original wants this to be a FeaturedDNASequence NOT SeqMgr!
        var json = jbeiSeqJson;
        var isJSON;

        try {
            isJSON = Teselagen.bio.parsers.ParsersManager.validateJbeiseqJson(json);
        } catch (e) {
            console.warn("jbeiseqJsonToSequenceManager() failed: " + e.message);
            return null; // jbeiSeq Structure is bad.
        }

        if ( isJSON === false) {
            console.warn("FormatUtils.jbeiseqJsonToSequenceManager(): Invalid jbeiSeq JSON input.");
            //return null;
        }

        var name    = json["seq:seq"]["seq:name"];
        var circ    = (json["seq:seq"]["seq:circular"] === "true" || json["seq:seq"]["seq:circular"] === true);
        var seq     = json["seq:seq"]["seq:sequence"];
        var sequence= Teselagen.bio.sequence.DNATools.createDNA(seq);

        //===============
        // FEATURES (Teselagen.bio.sequence.dna.Feature)

        var features = [];

        var feats = json["seq:seq"]["seq:features"];

        for (var i=0; i < feats.length; i++) {
            var ft = feats[i]["seq:feature"];

            var locations   = [];
            var notes       = [];

            var label      = ft["seq:label"];
            var type       = ft["seq:type"];
            var complement = ft["seq:complement"];
            var index      = ft["seq:index"];

            //===============
            // LOCATION
            for (var j=0; j < ft["seq:location"].length; j++) {
                var start = ft["seq:location"][j]["seq:genbankStart"] - 1; //fix 9/13/12
                var end   = ft["seq:location"][j]["seq:end"];

                var loc = Ext.create("Teselagen.bio.sequence.common.Location", {
                    start:  start,
                    end:    end
                });
                locations.push(loc);
            }

            //===============
            // ATTRIBUTES -> NOTES
            for (var j=0; j < ft["seq:attribute"].length; j++) {
                var note = Ext.create("Teselagen.bio.sequence.dna.FeatureNote", {
                    name:   ft["seq:attribute"][j]["_name"],
                    value:  ft["seq:attribute"][j]["__text"],
                    quoted: ft["seq:attribute"][j]["_quoted"]
                });
                notes.push(note);
            }

            // POST CALCULATIONS
            var strand;
            if (complement === true) {
                strand = -1;
            } else {
                strand = 1;
            }

            var feat = Ext.create("Teselagen.bio.sequence.dna.Feature", {
                name:               label,
                type:               type,
                strand:             strand,
                notes:              notes,
                index:              index
            });
            feat.setLocations(locations);
            features.push(feat);
        }

        result = Ext.create("Teselagen.manager.SequenceManager", {
            name: name,
            circular: circ,
            sequence: sequence,
            features: features
        });
        
        return result;
    },

    /**
     * Converts a SequenceManager {@link Teselagen.manager.SequenceManager} into
     * a JbeiSeqJson.
     * @param {Teselagen.manager.SequenceManager} sequenceManager A sequenceManager model of your data
     * @returns {Object} jbeiSeqJson JbeiSeqJson model of data
     */
    sequenceManagerToJbeiseqJson: function(seqMan) {
        if (Ext.getClassName(seqMan) !== "Teselagen.manager.SequenceManager" ) {
            console.warn("Invalid SequenceManager loaded in sequenceManagerToJbeiseqJson()");
            return null;
        }

        var result = {};

        var newName = seqMan.getName();
        var newCirc = seqMan.getCircular();
        var newSequence = seqMan.getSequence().seqString();

        var newFeatures = [];
        for (var i=0; i < seqMan.features.length; i++) {
            var j, k;
            var start, end;
            var name, value, quoted;

            var feat = seqMan.features[i];

            // SEQHASH
            //Code to turn ftSeq into unique id/hash goes here //DO SEQHASH HERE!
            var seqHash = "";
            var seqHashStr = "";
            for (j=0; j < feat.getLocations().length; j++) {
                start = feat.getLocations()[j].getStart() + 1;
                end   = feat.getLocations()[j].getEnd();

                if (end < start) {
                    seqHashStr += newSequence.substring(start, newSequence.length) + newSequence.substring(0, end);
                } else {
                    seqHashStr += newSequence.substring(start, end);
                }
            }
            //Does not check for complement
            
            seqHash = Teselagen.bio.util.Sha256.hex_sha256(seqHashStr);
            //console.log(seqHashStr);
            //console.log(seqHash);

            // LOCATIONS
            var newLoc = [];
            for (j=0; j < feat.getLocations().length; j++) {
                start = feat.getLocations()[j].getStart() + 1; //fix 9/13/12
                end   = feat.getLocations()[j].getEnd();

                newLoc.push( {
                    "seq:genbankStart" : start,
                    "seq:end" : end
                });
            }

            // ATTRIBUTES/FEATURES
            var newAttr = [];
            if (feat.getNotes() !== null) {
                for (j=0; j < feat.getNotes().length; j++) {
                    name    = feat.getNotes()[j].getName();
                    value   = feat.getNotes()[j].getValue();
                    quoted  = feat.getNotes()[j].getQuoted();
                    
                    newAttr.push( {
                        "_name" : name,
                        "_quoted" : quoted,
                        "__text" : value  //use __text?
                    });
                }
            }

            // JOIN/COMPLEMENT
            var join;
            if (newLoc.length > 1) {
                join = true;
            } else {
                join = false;
            }

            var complement;
            if (feat.getStrand() === 1) {
                complement = false;
            } else {
                complement = true;
            }

            var newFeature = {
                "seq:label" : feat.getName(),
                "seq:complement" : complement,
                "seq:type" : feat.getType(),
                "seq:location" : newLoc,
                "seq:attribute" : newAttr,
                "seq:seqHash" : seqHash
            };

            newFeatures.push({
                "seq:feature" : newFeature
            });
        }

        result = {
            "seq:seq" : {
                "seq:name" : newName,
                "seq:circular" : newCirc,
                "seq:sequence" : newSequence,
                "seq:features" : newFeatures,
                "_xmlns:seq": "http://jbei.org/sequence",
                "_xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
                "_xsi:schemaLocation": "http://jbei.org/sequence seq.xsd"
            }
        };
        return result;
    },

    /**
     * Converts a JbeiSeqXML file into a SequenceManager form of the data.
     * @param {String} jbeiSeqXml JbeiSeqXml model of data
     * @returns {Teselagen.manager.SequenceManager} sequenceManager A sequenceManager model of your data
     */
    jbeiseqXmlToSequenceManager: function(jbeiSeqXml) {
        var json = Teselagen.bio.parsers.ParsersManager.jbeiseqXmlToJson(jbeiSeqXml);
        var result = this.jbeiseqJsonToSequenceManager(json);
        return result;
    },

    /**
     * Converts a SequenceManager {@link Teselagen.manager.SequenceManager} into
     * a JbeiSeqXML.
     * @param {Teselagen.manager.SequenceManager} sequenceManager A sequenceManager model of your data
     * @returns {String} jbeiSeqXml JbeiSeqXml model of data
     */
    sequenceManagerToJbeiseqXml: function(seqMan) {

        if (Ext.getClassName(seqMan) !== "Teselagen.manager.SequenceManager" ) {
            console.warn("Invalid SequenceManager loaded in sequenceManagerToJbeiseqJson()");
            return null;
        }

        var json = this.sequenceManagerToJbeiseqJson(seqMan);
        var result = Teselagen.bio.parsers.ParsersManager.jbeiseqJsonToXml(json);
        return result;
    },

    /**
     * Converts a Genbank {@link Teselagen.bio.parsers.Genbank} into a
     * SequenceManager {@link Teselagen.manager.SequenceManager}
     * @param {Teselagen.bio.parsers.Genbank} genbank A Genbank model of your data
     * @returns {Teselagen.manager.SequenceManager} sequenceManager A sequenceManager model of your data
     */
    genbankToSequenceManager: function(genbank) {
        if (Ext.getClassName(genbank) !== "Teselagen.bio.parsers.Genbank" ) {
            console.warn("Invalid Genbank loaded in genbankToSequenceManager()");
            return null;
        }

        //var jbeiseqJson = this.ParsersManager.genbankToJbeiseqJson(genbank);
        var jbeiseqJson = Teselagen.bio.parsers.ParsersManager.genbankToJbeiseqJson(genbank);
        //console.log(jbeiseqJson);

        var result = this.jbeiseqJsonToSequenceManager(jbeiseqJson);
        
        return result;
    },

    /**
     * Converts a SequenceManager {@link Teselagen.manager.SequenceManager} into a
     * Genbank {@link Teselagen.bio.parsers.Genbank}.
     * @param {Teselagen.manager.SequenceManager} seqMan A SequenceManager model of the data
     * @returns {Teselagen.bio.parsers.Genbank} genbank A Genbank model of the data
     */
    sequenceManagerToGenbank: function(seqMan) {

        if (Ext.getClassName(seqMan) !== "Teselagen.manager.SequenceManager" ) {
            console.warn("Invalid SequenceManager loaded in sequenceManagerToGenbank()");
            return null;
        }

        var jbeiseqJson = this.sequenceManagerToJbeiseqJson(seqMan);

        //var result = this.ParsersManager.jbeiseqJsonToGenbank(jbeiseqJson);
        var result = Teselagen.bio.parsers.ParsersManager.jbeiseqJsonToGenbank(jbeiseqJson);

        return result;
    },

//    /**
//     * Convert a SequenceFile model to a SequenceManager model.
//     * @param {Teselagen.models.SequenceFile} pSequenceFile
//     * @returns {Teselagen.manager.SequenceManager}
//     *
//    sequenceFileToSequenceManager: function(pSequenceFile) {
//        return SequenceFileManager.sequenceFileToSequenceManager(pSequenceFile);
//    },*/

    /**
     * Convert a SequenceFile model to a SequenceManager model.
     * @param {Teselagen.models.SequenceFile} pSequenceFile
     * @returns {Teselagen.manager.SequenceManager}
     */
    sequenceFileToSequenceManager: function(pSequenceFile) {
        //console.log(pSequenceFile);

        if (Ext.getClassName(pSequenceFile) !== "Teselagen.models.SequenceFile") {
            console.warn("FormatUtils.sequenceFileToSequenceManager(): '" + pSequenceFile + "' is not a SequenceFile. Returning null.");
            return null;
        }
        var name    = pSequenceFile.get("partSource");
        var format  = pSequenceFile.get("sequenceFileFormat");
        var content = pSequenceFile.get("sequenceFileContent");
        var seqMan;
        
        switch (format) {
        case Constants.GENBANK:
            //console.log(content);
            var genbank = GenbankManager.parseGenbankFile(content);
            //console.log(JSON.stringify(genbank, null, "  "));
            seqMan = this.genbankToSequenceManager(genbank);
            //console.log(seqMan);
            break;
        case Constants.FASTA:
            seqMan = this.fastaToSequenceManager(content);
            break;
        case Constants.JBEISEQ:
            seqMan = this.jbeiseqXmlToSequenceManager(content);
            //console.log(content);
            break;
        case Constants.SBOLXML:
            sbolJson = SbolParser.sbolXmlToJson(content);

            if (SbolParser.checkRawSbolJson(sbolJson)) {
                // SBOL 2 SequenceManager has not been written yet
            }

            console.warn("Teselagen.manager.SequenceFileManger.sequenceFileToSequenceManger: SbolJson2SequenceManager not written yet.");

            seqMan = null;
            break;
        default:
            console.warn("Teselagen.utils.FormatUtils.sequenceFileToSequenceManger: File format not detected: " + format);
        }
        //console.log(seqMan);
        seqMan.setName(name);
        return seqMan;
    },

    /** NOT TESTED
     * Convert a SequenceManager model to a SequenceFile model.
     * @param {Teselagen.manager.SequenceManager} pSequenceManager
     * @returns {Teselagen.models.SequenceFile}
     */
    sequenceManagerToSequenceFile: function(pSequenceManager) {

        if (Ext.getClassName(pSequenceManager) !== "Teselagen.models.SequenceManager") {
            console.warn("FormatUtils.sequenceManagerToSequenceFile(): '" + pSequenceManager + "' is not a SequenceManager. Returning null.");
            return null;
        }
        var name    = pSequenceManager.getName();
        var format  = Teselagen.constants.Constants.GENBANK;
        var content = Teselagen.manager.FormatUtils.sequenceManagerToGenbank(pSequenceManager);

        var seqFile = Teselagen.manager.DeviceDesignManager.createSequenceFileStandAlone(format, content, name, "");

        return seqFile;
    },

    /** NOT TESTED
     * Convert a File (FASTA, GenBank, JbeiSeq, SBOL, etc) to a SequenceFile model.
     * @param {String} pFile
     * @param {String} pFormat Must be: "GENBANK", "FASTA", "JBEISEQXML", "JBEISEQJSON", "SBOLXML"
     * @returns {Teselagen.models.SequenceFile}
     */
    fileToSequenceFile: function(pFile, pFormat) {

        if (!Ext.isString(pFile)) {
            console.warn("File content is not a String. Returning null.");
            return null;
        }

        var format  = pFormat;
        var content = pFile;

        var seqFile = Ext.create("Teselagen.model.SequenceFile", {
            sequenceFileFormat: format,
            sequenceFileContent: content
        });

        return seqFile;
    },
    
    /**
     * Convert file content to Genbank
     * @param {String} content File content
     * @param {String} ext File extension which must be 'genbank', 'gb', 'fasta', 'fas', 'xml', or 'json'.
     * @returns {Teselagen.bio.parsers.Genbank}
     */
    fileToGenbank: function(pContent, pExt){
        var gb = null;
        if (!Ext.isString(pContent)) {
            console.warn("File content is not a String.");
        }
        else {
            switch(pExt)
            {
            case "genbank":
            case "gb":
                gb = Teselagen.bio.parsers.GenbankManager.parseGenbankFile(pContent);
                break;
            case "fasta":
            case "fas":
                gb = Teselagen.bio.parsers.ParsersManager.fastaToGenbank(pContent);
                break;
            case "xml":
                gb = Teselagen.bio.parsers.ParsersManager.jbeiseqXmlToGenbank(pContent);
                break;
            case "json":
                gb = Teselagen.bio.parsers.ParsersManager.jbeiseqJsonToGenbank(pContent);
                break;
            default:
                console.warn("File extension '" + pExt + "' is not supported." );
            }
        }
        return gb;
    },
    convertEugeneRule: function(v,n) {
        var compOp = v.toUpperCase();
        var negationOperator = v;
        var constants = Teselagen.constants.Constants;
        if(compOp === constants.NOTMORETHAN)
        {
            compOp = constants.MORETHAN;
            negationOperator = true;
            console.warn("Compositional operator updated to MORE and NOT? True");
        }
        if(compOp === constants.NOTMOREWITH)
        {
            compOp = constants.MOREWITH;
            negationOperator = true;
            cconsole.warn("Compositional operator updated to WITH and NOT? True");
        }
        return {"compOp":compOp,"negOp":negationOperator};
    }

});
