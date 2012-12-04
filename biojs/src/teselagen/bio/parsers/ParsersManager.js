/*globals Ext, Teselagen, XmlToJson, DNATools*/
/**
 * DW NOTE: SHOULD REFACTOR THE JBEISEQ CODE INTO Teslagen.bio.parses.JbeiSeq
 *
 * @class Teselagen.bio.parsers.ParsersManager
 *
 * Conversions between FASTA, GenBank, JbeiSeqXML/JbeiSeqJSON.
 *
 * @author Diana Wong
 */

Ext.define("Teselagen.bio.parsers.ParsersManager", {
    requires:  [
        "Teselagen.bio.util.XmlToJson",
        "Teselagen.bio.util.StringUtil",
        "Teselagen.bio.util.Sha256",

        "Teselagen.bio.parsers.GenbankManager",
        "Teselagen.bio.parsers.SbolParser",
        "Teselagen.bio.sequence.DNATools",

        "Ext.Ajax",
        "Ext.data.Store",
        "Ext.data.XmlStore",
        "Ext.data.reader.Xml"
    ],

    singleton: true,

    //XmlToJson: null,
    //DNATools: null,

    constructor: function() {
        XmlToJson   = Teselagen.bio.util.XmlToJson;
        DNATools    = Teselagen.bio.sequence.DNATools;
        SbolParser  = Teselagen.bio.parsers.SbolParser;
        Sha256      = Teselagen.bio.util.Sha256;
    },

    // ===========================================================================
    //  Fasta & Genbank Conversions
    // ===========================================================================

    /**
     * Converts a FASTA file into a Genbank form of the data.
     * @param {String} pFasta FASTA formated string
     * @returns {Teselagen.bio.parsers.Genbank} genbank
     */
    fastaToGenbank: function(pFasta) {
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

        var locus = Ext.create("Teselagen.bio.parsers.GenbankLocusKeyword", {
            locusName: name,
            sequenceLength: sequence.length,
            date: Teselagen.bio.parsers.ParsersManager.todayDate()
        });

        var origin =  Ext.create("Teselagen.bio.parsers.GenbankOriginKeyword", {
            sequence: sequence
        });

        result = Ext.create("Teselagen.bio.parsers.Genbank", {});

        result.addKeyword(locus);
        result.addKeyword(origin);

        return result;
    },

    /**
     * Converts a Genbank model into a FASTA string.
     * @returns {Teselagen.bio.parsers.Genbank} genbank
     * @param {String} pFasta FASTA formated string
     */
     genbankToFasta: function(pGenbank) {

        var name = pGenbank.getLocus().getLocusName();
        var sequence = pGenbank.getOrigin().getSequence();

        var result = ">" + name + "\n" + sequence;
        return result;
    },
    // ===========================================================================
    //   Jbeiseq & Genbank Conversions
    //      jbeiseqXMLs (more than one) --> ArrayList<jbeiseqXml>
    //
    //      jbeiseqXML <--> jbeiseqJSON <--> Genbank
    // ===========================================================================

    /**
     * Converts an JbeiSeqXML in string format with multiple records to array of Genbank models
     * Currently eliminates the "seq:" namespace by replaceing it with "seq".
     * @param {String} xml XML file with one or more records in String format
     * @returns {Teselagen.bio.parsers.Genbank[]} genbank
     */
     jbeiseqXmlsToXmlArray: function (xml) {
        var xmlArray = [];
        var newxml = xml;

        //newxml = newxml.replace(/\<seq\:name/gi, "BREAKRECORD<seq:name");
        newxml = newxml.replace(/\<\/seq\:seq\>/gi, "<\/seq:seq>BREAKRECORD");

        var xmlArr = newxml.split("BREAKRECORD");

        for (var i=0; i<xmlArr.length; i++) {
            if (xmlArr[i].match(/\<seq\:seq/g)) {
                xmlArray.push(xmlArr[i].replace(/^[\n]*/g, ""));
            }
        }
        return xmlArray;
     },

     /**  DOES NOT HAVE TEST CODE YET
      * Scans through a JbeiSeq JSON object to see if it has the minimum structure
      * requirements.
      * @param {JSON} json JbeiSeq JSON object
      * @returns {Boolean} isJbeiSeq True if structure is good, false if missing key elements.
      */
     validateJbeiseqJson: function (json) {
        var result = false;

        if (json["seq:seq"] === undefined) {
            console.warn("Invalid JbeiSeqXML file. No root or record tag 'seq'");
            throw Ext.create("Teselagen.bio.BioException", {
                message: "Invalid JbeiSeqXML file. No root or record tag 'seq'"
            });
            //return result;
        }

        //===============
        // HEADER INFO

        var date    = Teselagen.bio.parsers.ParsersManager.todayDate();

        if (json["seq:seq"]["seq:name"] === undefined) {
            console.warn("jbeiseqXmlToJson: No sequence name detected");
            return result;
        }

        if (json["seq:seq"]["seq:circular"] === undefined) {
            console.warn("jbeiseqXmlToJson: No linear status detected; default to linear");
            return result;
        }

        if (json["seq:seq"]["seq:sequence"] === undefined) {
            console.warn("jbeiseqXmlToJson: No sequence detected");
            throw Ext.create("Teselagen.bio.BioException", {
                message: "Invalid JbeiSeqXML file. No sequence detected"
            });
            return result;
        }

        if (json["seq:seq"]["seq:seqHash"] === undefined) {
            //return result;
        }

        //===============
        // FEATURES

        var features = [];
        var jFeats;

        if (json["seq:seq"]["seq:features"] === undefined) {
            console.warn("Invalid JbeiSeqXML file. No Features detected");
            throw Ext.create("Teselagen.bio.BioException", {
                message: "Invalid JbeiSeqXML file. No Features detected"
            });
            return result;
        } else {
            jFeats  = json["seq:seq"]["seq:features"];
        }

        for (var i=0; i < jFeats.length; i++) {

            var locations   = [];
            var attributes  = []; //qualifiers  = [];
            
            var ft = jFeats[i]["seq:feature"];

            if (ft["seq:type"] === undefined) {
                //return result;
            }

            if (ft["seq:complement"] === undefined) {
                //return result;
            }

            //===============
            // LOCATIONS
            // asArray will detect if there are locations; ie length=0 means no locations

            for (var j=0; j < ft["seq:location"].length; j++) {

                if (ft["seq:location"][j]["seq:genbankStart"] === undefined) {
                    console.warn("feature['seq:location'][" + j +"]['seq:genbankStart'] undefined");
                    return result;
                }
            }
            //===============
            // ATTRIBUTES

            if (ft["seq:label"] === undefined ) {
                console.warn("json['seq:seq']['seq:features']["+i+"]'seq:feature][seq:label'] undefined");
                return result;
            }

            for (var j=0; j < ft["seq:attribute"].length; j++) {
                //
            }

        }
        result = true;
        return result;
     },

    /**
     * Converts an JbeiSeqXML in string format to JSON format.
     * This checks for valid entries in the XML file.
     * If a required entry is not recognized, an error is thrown.
     * If a non-required entry is not recognized, a default value is used.
     * Use this for a cleaned version of JSON (from {@link Teselagen.bio.util.XmlToJson})
     * XXXXCurrently eliminates the "seq:" namespace by replaceing it with "seq".
     * @param {String} xml XML file in String format
     * @returns {JSON} json Cleaned JSON object of the JbeiSeqXml
     */
     jbeiseqXmlToJson: function (xmlStr) {
        var result = {};

        var json = XmlToJson.xml_str2json(xmlStr);
        //console.log(JSON.stringify(json, null, "  "));

        if (json["seq"] === undefined) {
            throw Ext.create("Teselagen.bio.BioException", {
                message: "Invalid JbeiSeqXML file. No root or record tag 'seq'"
            });
            //eturn result;
        } else if (json["seq"] === undefined) {
            return result;
        }

        //===============
        // HEADER INFO

        var schema = json["seq"]["_xsi:schemaLocation"];
        var xmlns  = json["seq"]["_xmlns:seq"];
        var xsi    = json["seq"]["_xmlns:xsi"];

        var date    = Teselagen.bio.parsers.ParsersManager.todayDate();

        var name;
        if (json["seq"]["name"] !== undefined) {
            name    = json["seq"]["name"]["__text"];
        } else {
            name = "no_name";
            console.warn("jbeiseqXmlToJson: No sequence name detected");
        }

        var circ;
        if (json["seq"]["circular"] !== undefined) {
            circ  = (json["seq"]["circular"]["__text"].toLowerCase() === "true");
        } else {
            circ  = false;
            console.warn("jbeiseqXmlToJson: No linear status detected; default to linear");
        }
        var linear = !circ;

        if (json["seq"]["sequence"] !== undefined) {
            var seq     = json["seq"]["sequence"]["__text"] || "no_sequence";
        } else {
            var seq     = "";
            console.warn("jbeiseqXmlToJson: No sequence detected");
            throw Ext.create("Teselagen.bio.BioException", {
                message: "Invalid JbeiSeqXML file. No sequence detected"
            });
        }

        if (json["seq"]["seqHash"] !== undefined) {
            var seqHash = json["seq"]["seqHash"]["__text"];
        } else {
            var seqHash = "";
        }


        //===============
        // FEATURES

        var features = [];

        if (json["seq"]["features"]["feature_asArray"] === undefined) {
            throw Ext.create("Teselagen.bio.BioException", {
                message: "Invalid JbeiSeqXML file. No Features detected"
            });
            return result;
        } else { 
            var jFeats  = json["seq"]["features"]["feature_asArray"];
        }

        for (var i=0; i < jFeats.length; i++) {

            var locations   = [];
            var attributes  = []; //qualifiers  = [];
            
            var ft = jFeats[i];

            if (ft["type"] !== undefined) {
                var type = ft["type"]["__text"];
            } else {
                var type = "unsure"; //using seq.xsd
            }

            if (ft["complement"] !== undefined) {
                var complement = (ft["complement"]["__text"].toLowerCase() === "true");
            } else {
                var complement = false;
            }

            //===============
            // LOCATIONS
            // asArray will detect if there are locations; ie length=0 means no locations

            for (var j=0; j < ft["location_asArray"].length; j++) {
                //console.log(ft["location_asArray"][j]);
                var start = ft["location_asArray"][j]["genbankStart"]["__text"];

                if (ft["location_asArray"][j]["end"] === undefined) {
                    var end   = start;
                } else {
                    var end   = ft["location_asArray"][j]["end"]["__text"];
                }
                var to    = "..";

                var loc = {
                    "seq:genbankStart" : parseInt(start),
                    "seq:end" : parseInt(end)
                };
                locations.push(loc);
            }
            //===============
            // ATTRIBUTES

            if (ft["label"] !== undefined ) {
                var label = ft["label"]["__text"];
            } else {
                var label = "name_unknown";
            }
            /*var attr = {
                "seq:attribute" : {
                    "_name" : "label",
                    "_quoted" : true,
                    "__text" : label //USE __text
                }
            }*/
            //attributes.push(qual);

            //console.log(ft["attribute_asArray"]);
            for (var j=0; j < ft["attribute_asArray"].length; j++) {
                /*var attr = {
                    "seq:attribute" : {
                        "_name" : ft["attribute_asArray"][j]["_name"],
                        "_quoted" : true,
                        "__text" : ft["attribute_asArray"][j]["__text"], //USE __text
                    }
                }*/
                var attr = {
                    //"seq:attribute" : {
                        "_name" : ft["attribute_asArray"][j]["_name"],
                        "_quoted" : true,
                        "__text" : ft["attribute_asArray"][j]["__text"], //USE __text
                    //}
                }

                attributes.push(attr);
            }

            // POST CALCULATIONS
            if (complement === true) {
                var strand = 1;
            } else {
                var strand = -1;
            }

            var feat = {
                "seq:feature" : {
                    "seq:label" : label,
                    "seq:complement" : complement,
                    "seq:type" : type,
                    "seq:location": locations,
                    "seq:attribute" : attributes //this should not be saved as a subset
                }
            }

            features.push(feat);
        }
        // Setting final JSON object
        var result = { 
            "seq:seq" : {
                "seq:name" : name,
                "seq:circular" : circ,
                "seq:sequence" : seq,
                "seq:features" : features,
                "seq:seqHash"  : seqHash,
                "_xmlns:seq": xmlns, //"http://jbei.org/sequence",
                "_xmlns:xsi": xsi, //"http://www.w3.org/2001/XMLSchema-instance",
                "_xsi:schemaLocation": schema //"http://jbei.org/sequence seq.xsd"
            }
        }

        return result;
     },

    /**
     * Converts an JbeiSeqXML in string format to JSON format.
     * Use this for a cleaned version of JSON (from {@link Teselagen.bio.util.XmlToJson})
     * @param {JSON} json Cleaned JSON object of the JbeiSeqXml
     * @returns {String} xml XML file in String format
     */
     jbeiseqJsonToXml: function(json) {

        if (json === null) {
            return null;
        }

        var isJSON;
        try {
            isJSON = Teselagen.bio.parsers.ParsersManager.validateJbeiseqJson(json);
        } catch (e) {
            console.warn("jbeiseqJsonToSequenceManager() failed: " + e.message);
            return null; // jbeiSeq Structure is bad.
        }

        var xml = [];

        xml.push("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n");
        xml.push("<seq:seq\n");

        xml.push("  xmlns:seq=\"http://jbei.org/sequence\"\n");
        xml.push("  xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"\n");
        xml.push("  xsi:schemaLocation=\"http://jbei.org/sequence seq.xsd\"\n");
        xml.push(">\n");
        
        xml.push("<seq:name>" +     json["seq:seq"]["seq:name"] +       "</seq:name>\n");
        xml.push("<seq:circular>" + json["seq:seq"]["seq:circular"] +   "</seq:circular>\n");
        xml.push("<seq:sequence>" + json["seq:seq"]["seq:sequence"] +   "</seq:sequence>\n");
        xml.push("<seq:features>\n");

        var feat        = json["seq:seq"]["seq:features"];
        var sequence    = json["seq:seq"]["seq:sequence"];

        for (var i=0; i < feat.length; i++) {
            var ft = feat[i]["seq:feature"];

            // FEATURE Label/Complement/type population
            xml.push("    <seq:feature>\n");
            xml.push("        <seq:label>" +        ft["seq:label"] +       "</seq:label>\n");
            xml.push("        <seq:complement>" +   ft["seq:complement"] +  "</seq:complement>\n");
            xml.push("        <seq:type>" +         ft["seq:type"] +        "</seq:type>\n");

            // LOCATIONS
            for (var j=0; j < ft["seq:location"].length; j++) {
                var start = ft["seq:location"][j]["seq:genbankStart"];
                var end   = ft["seq:location"][j]["seq:end"];
                //console.log(start + " : " + end );
                xml.push("        <seq:location>\n");
                xml.push("            <seq:genbankStart>" + start + "</seq:genbankStart>\n");
                xml.push("            <seq:end>" + end + "</seq:end>\n");
                xml.push("        </seq:location>\n");
            }

            // ATTRIBUTES
            //var labelFlag = false;
            for (var k=0; k < ft["seq:attribute"].length; k++) {
                var att    = ft["seq:attribute"][k]; //["seq:attribute"];
                var key    = att["_name"];
                var quoted = att["_quoted"];
                var value  = att["__text"];

                xml.push("        <seq:attribute name=\"" + key + "\" quoted=\"" + quoted + "\">" + value + "</seq:attribute>\n");
            }

            xml.push("        <seq:seqHash>" + json["seq:seq"]["seq:seqHash"] + "</seq:seqHash>\n");
            xml.push("    </seq:feature>\n");
        }

        xml.push("</seq:features>\n");
        xml.push("</seq:seq>\n");

        return xml.join("");
     },

     /**
     * Converts a JbeiSeq JSON object into a Genbank model of the data.
     * Only one record per json.
     * @param {JSON} json JbeiSeq JSON object with ONE record
     * @returns {Teselagen.bio.parsers.Genbank} genbank
     */
    jbeiseqJsonToGenbank: function(json) {
        var result = Ext.create("Teselagen.bio.parsers.Genbank", {});

        //===============
        // LOCUSKEYWORD

        var date    = Teselagen.bio.parsers.ParsersManager.todayDate();
        var name    = json["seq:seq"]["seq:name"];
        var circ    = (json["seq:seq"]["seq:circular"] === "true" || json["seq:seq"]["seq:circular"] === true);
        var seq     = json["seq:seq"]["seq:sequence"];

        var locus   = Ext.create("Teselagen.bio.parsers.GenbankLocusKeyword", {
            locusName: name,
            linear: !circ,
            sequenceLength: seq.length,
            naType: na,
            date: date
        });

        result.addKeyword(locus);

        //===============
        // FEATURESKEYWORD

        var features = [];

        var feats = json["seq:seq"]["seq:features"];

        for (var i=0; i < feats.length; i++) {
            var ft = feats[i]["seq:feature"];

            var locations   = [];
            var qualifiers  = [];
            
            var type       = ft["seq:type"];
            var complement = ft["seq:complement"];

            //===============
            // LOCATION
            for (var j=0; j < ft["seq:location"].length; j++) {
                var start = ft["seq:location"][j]["seq:genbankStart"];
                var end   = ft["seq:location"][j]["seq:end"];
                var to    = "..";

                var loc = Ext.create("Teselagen.bio.parsers.GenbankFeatureLocation", {
                    start:  start,
                    end:    end,
                    to:     to
                });
                locations.push(loc);
            }

            //===============
            // ATTRIBUTES -> QUALIFIERS
            var label = ft["seq:label"];

            var qual = Ext.create("Teselagen.bio.parsers.GenbankFeatureQualifier", {
                name:      "label",
                value:      label,
                quoted:     true
            });
            qualifiers.push(qual);

            for (var j=0; j < ft["seq:attribute"].length; j++) {
                var qual = Ext.create("Teselagen.bio.parsers.GenbankFeatureQualifier", {
                    name:   ft["seq:attribute"][j]["_name"],
                    value:  ft["seq:attribute"][j]["__text"],
                    //quoted: true
                    quoted: ft["seq:attribute"][j]["_quoted"]
                });
                qualifiers.push(qual);
            }

            // POST CALCULATIONS
            var strand;
            if (complement === true) {
                strand = -1;
            } else {
                strand = 1;
            }

            var join;
            if (locations.length>1) {
                join = true;
            } else {
                join = false;
            }

            // THIS DOESNT WORK YET
            var na;
            if (seq.match(/[^U][^RYMKSWHBVDN][ACGT]/gi)) {
                na = "DNA";
            } else if (seq.match(/[^T][^RYMKSWHBVDN][ACGU]/gi)) {
                na = "RNA";
            } else if (seq.match(/[^U][ACGTRYMKSWHBVDNacgtrymkswhbvdn]+/gi)) {
                na = "PRO";
            } else {
                na = "NAN";
            }
            
            var feat = Ext.create("Teselagen.bio.parsers.GenbankFeatureElement", {
                keyword:            type,
                strand:             strand,
                complement:         complement,
                join:               join,
                featureLocation:    locations,
                featureQualifier:   qualifiers
            });
            features.push(feat);
        }

        var featureKW =  Ext.create("Teselagen.bio.parsers.GenbankFeaturesKeyword");
        featureKW.setFeaturesElements(features);
        
        result.addKeyword(featureKW);

        //===============
        // ORIGINKEYWORD

        var origin =  Ext.create("Teselagen.bio.parsers.GenbankOriginKeyword", {
            sequence: seq
        });
        result.addKeyword(origin);

        return result;
    },

    /**
     * Converts a JbeiSeq XML file into a Genbank model of the data.
     * Only one record per xmlStr. Parse approriately with <seq:seq> RECORD </seq:seq> tags.
     * @param {String} xml JbeiSeq XML file  with ONE record in String format
     * @returns {Teselagen.bio.parsers.Genbank} genbank
     */
    jbeiseqXmlToGenbank: function(xmlStr) {
        //var json = XmlToJson.xml_str2json(xmlStr); // DO NOT USE THIS TO GET JSON!!!

        // Use clean JSON version of the XML, NOT the XmlToJson.xml_str2json() version
        // This checks and returns a useable KNOWN format.
        var json = this.jbeiseqXmlToJson(xmlStr);

        var result = this.jbeiseqJsonToGenbank(json);

        return result;
    },

    /**
     * Converts a Genbank model into a JbeiSeq JSON formatted file.
     * Only one Genbank model at a time.
     * This is code adapted from IceXmlUtils.as
     * @returns {Teselagen.bio.parsers.Genbank} genbank
     * @param {String} xml JbeiSeq JSON string with ONE record in String format
     */
    genbankToJbeiseqJson: function(pGenbank) {

        if (Ext.getClassName(pGenbank) !== "Teselagen.bio.parsers.Genbank" ) {
            return null;
        }
        var json = {};

        var feat      = pGenbank.getFeatures().getFeaturesElements();
        var sequence  = pGenbank.getOrigin().getSequence();

        // FEATURES Label/Complement/type population
        var newFeatures = [];

        for (var i=0; i < feat.length; i++) {
            var label, start, end, key, value, quoted;
            var j, k;

            var ft    = feat[i];
            var newFt = [];

            // SEQHASH
            //Code to turn ftSeq into unique id/hash goes here //DO SEQHASH HERE!
            var seqHash = "";
            var seqHashStr = "";
            for (j=0; j < ft.getFeatureLocation().length; j++) {
                start = ft.getFeatureLocation()[j].getStart();
                end   = ft.getFeatureLocation()[j].getEnd();

                if (end < start) {
                    seqHashStr += sequence.substring(start, sequence.length) + sequence.substring(0, end);
                } else {
                    seqHashStr += sequence.substring(start, end);
                }
            }
            if (feat[i].getStrand() === -1 || feat[i].getComplement()) {
                seqHashStr = DNATools.reverseComplement(DNATools.createDNA(seqHashStr)).seqString();
            }
            seqHash = Teselagen.bio.util.Sha256.hex_sha256(seqHashStr);
            //console.log(seqHashStr);
            //console.log(seqHash);


            // LOCATIONS
            var newLoc = [];
            for (j=0; j < ft.getFeatureLocation().length; j++) {
                start = ft.getFeatureLocation()[j].getStart();
                end   = ft.getFeatureLocation()[j].getEnd();

                newLoc.push( {
                    "seq:genbankStart" : start,
                    "seq:end" : end
                });
            }
            // QUALIFIERS -> ATTRIBUTES
            var newAttr = [];
            for (k=0; k < ft.getFeatureQualifier().length; k++) {
                key    = ft.getFeatureQualifier()[k].getName();
                value  = ft.getFeatureQualifier()[k].getValue();
                quoted = ft.getFeatureQualifier()[k].getQuoted();

                if (k===0 && this.isALabel(key) ) { //HERE 8/20
                    //console.log("found a label: " + key );
                    label = value;
                    //don't add as attribute
                } else {
                    newAttr.push( {
                        "seq:attribute" : {
                            "_name" : key,
                            "_quoted" : quoted,
                            "__text" : value //USE __text
                        }
                    });
                }
                console.log(label);
            }

            newFt = {
                "seq:label" : label, //ft.findLabel(),
                "seq:complement" : ft.getComplement(),
                "seq:type" : ft.getKeyword(),
                "seq:location" : newLoc,
                "seq:attribute" : newAttr,
                "seq:seqHash" : seqHash
            };

            newFeatures.push( {
                "seq:feature" : newFt
            });
        }
        //console.log(pGenbank.getLocus().getLinear());

        // MAKE JSON
        json = {
            "seq:seq" : {
                "seq:name" : pGenbank.getLocus().getLocusName(),
                "seq:circular" : !pGenbank.getLocus().getLinear(),
                "seq:sequence" : pGenbank.getOrigin().getSequence(),
                "seq:features" : newFeatures,
                "_xmlns:seq": "http://jbei.org/sequence",
                "_xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
                "_xsi:schemaLocation": "http://jbei.org/sequence seq.xsd"
            }
        };

        return json;
    },

    /**
     * Converts a Genbank model into a JbeiSeq XML formatted file.
     * Only one Genbank model at a time.
     * This is code adapted from IceXmlUtils.as
     * @returns {Teselagen.bio.parsers.Genbank} genbank
     * @param {String} xml JbeiSeq XML string with ONE record in String format
     */
    genbankToJbeiseqXml: function(pGenbank) {

        if (pGenbank === null) {
            return null;
        }
        var json = this.genbankToJbeiseqJson(pGenbank);

        var xml  = this.jbeiseqJsonToXml(json);

        return xml;
    },

    /**
     * Creates a Sequence Hash, from a sequence. Uses Sha256.js to create this id.
     * @param {Teselagen.} pSequence Sequence string
     * @returns {String} seqHash Hash of the sequence using sha256
     *
    makeSeqHash: function(pSequence) {
        Teselagen.bio.util.Sha256
    },*/

    // ===========================================================================
    //   SBOL & JbeiSeq Conversions
    //
    //      sbolXML <--> sbolJSON <--> jbeiJSON
    // ===========================================================================

    /** THIS DOES NOT WORK YET
     * Converts an SbolXML in string format to JSON format.
     * This checks for valid entries in the XML file.
     * If a required entry is not recognized, an error is thrown.
     * If a non-required entry is not recognized, a default value is used.
     * Use this for a cleaned version of JSON (from {@link Teselagen.bio.util.XmlToJson})
     * @param {String} xml Sbol XML file in String format
     * @returns {JSON} json Cleaned JSON object of the Sbol XML
     */
    sbolXmlToJson: function(xmlStr) {
        return Teselagen.bio.parsers.SbolParser.sbolXmlToJson(xmlStr);
        

    },

    sbolJsonTojbeiJson: function(sbol) {

    },

    jbeiJsonTosbolJson: function(jbei) {

    },




    // ===========================================================================
    //      UTILITY FUNCTIONS
    // ===========================================================================

    /** TO BE MOVED TO Teselagen.util.FileUtils.js.
     * @param {String} url The url to retrieve data from.
     * @returns {String} xml XML string
     */
    loadFile: function(url) {
        // Doing XMLHttpRequest leads to loading from cache

        var str;

        Ext.Ajax.request({
            url: url,
            async: false,
            disableCaching: true,
            success: function(response) {
                str = response.responseText;
                //console.dir(xmlStr);
            },
            failure: function(response, opts) {
                console.warn('Could not load: ' + url + '\nServer-side failure with status code ' + response.status);
                throw Ext.create("Teselagen.bio.BioException", {
                    message: 'Could not load: ' + url + '\nServer-side failure with status code ' + response.status
                });
            }
        });
        return str;
     },


    /**
     * Today's date
     * @returns {String} date Today's date in string format
     */
    todayDate: function() {
        var date    = (new Date()).toDateString().split(" ");
        var dateStr = date[2] + "-" + date[1].toUpperCase() + "-" + date[3];
        return dateStr;
     },

    /**
     * isALabel
     * @param {String} name Name of a attribute or qualifier
     * @return {Boolean} isALabel
     */
    isALabel: function(name) {
        if (name === "label" || name === "name"|| name === "ApEinfo_label" ||
            name === "note" || name === "gene" || name === "organism"  ) {

            return true;
        } else {
            return false;
        }
    }

});