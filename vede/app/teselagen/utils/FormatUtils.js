/**
 * @class Teselagen.utils.FormatUtils
 *
 * Converts SequenceManager to various file formats using
 * {@link Teselagen.bio.parsers.ParsersManager}
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
        "Teselagen.bio.sequence.DNATools",

        "Teselagen.utils.SequenceUtils"
    ],

    singleton: true,

    DNAAlphabet: null,
    StringUtil: null,
    XmlToJson: null,
    Sha256: null,
    SequenceUtils: null,
    GenbankManager: null,
    ParsersManager: null,
    
    constructor: function() {
        DNAAlphabet     = Teselagen.bio.sequence.alphabets.DNAAlphabet;
        DNATools        = Teselagen.bio.sequence.DNATools;

        StringUtil      = Teselagen.bio.util.StringUtil;
        XmlToJson       = Teselagen.bio.util.XmlToJson;
        Sha256          = Teselagen.bio.util.Sha256;

        SequenceUtils   = Teselagen.utils.SequenceUtils;

        GenbankManager  = Teselagen.bio.parsers.GenbankManager;
        ParsersManager  = Teselagen.bio.parsers.ParsersManager;
    },

    /** REFACTORED FROM DEVICEDESIGNMANAGER -- NEEDS TESTING.
     * Finds reverse complement of a sequence.
     * @param {String} pSeq
     * @returns {String} reverse complement sequence
     */
    reverseComplement: function(pSeq) {
        var revComp = [];
        pSeq = pSeq.toLowerCase();

        for (var i = pSeq.length-1; i >= 0; i--) {
            switch (pSeq.charAt(i)) {
                case "a":
                    revComp.push("t");
                    break;
                case "c":
                    revComp.push("g");
                    break;
                case "g":
                    revComp.push("a");
                    break;
                case "t":
                    revComp.push("a");
                    break;
            }
        }
        return revComp.join("");
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
     * @param {String} pFasta FASTA formated string
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
            features: seqMan.getFeatures(),
        });

        return result;
    },

    /**
     * Converts a JbeiSeq XML file into a SequenceManager form of the data.
     * @param {JSON} jbeiSeqJson JbeiSeqJson model of data
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
            return null;
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
                notes:              notes
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
     * @returns {JSON} jbeiSeqJson JbeiSeqJson model of data
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

    /**
     * isALabel
     * @param
     * @return {Boolean} isALabel
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
    }


});