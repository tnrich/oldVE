/*globals Ext, Teselagen, XmlToJson, DNATools*/
/**
 * @class Teselagen.bio.parsers.ParsersManager
 *
 * Converts input files into Genbank data models.
 * Converts back to other formats as needed.
 * 
 * @author Diana Wong
 */

Ext.define("Teselagen.bio.parsers.ParsersManager", {
    requires:  ["Teselagen.bio.util.StringUtil",
                "Teselagen.bio.parsers.GenbankManager",
                "Teselagen.bio.sequence.DNATools",
                "Ext.Ajax", 
                "Ext.data.Store",
                "Ext.data.XmlStore",
                "Ext.data.reader.Xml"
                ],
    singleton: true,

    XmlToJson: null,
    DNATools: null,

    constructor: function() {
        XmlToJson = Teselagen.bio.util.XmlToJson;
        DNATools = Teselagen.bio.sequence.DNATools;
    },

    // ===========================================================================
    //   SequenceManager & Genbank Conversions
    // ===========================================================================


    /**
     * Converts a Sequence Manager into a Genbank {@link Teselagen.bio.parsers.Genbank}
     * form of the data.
     * @param {Teselagen.manager.SequenceManager} sequenceManager
     * @returns {Teselagen.bio.parsers.Genbank} genbank A Genbank model of your data
     */ 

    sequenceManagerToGenbank: function(pSequenceManager) {

        var result = Ext.create("Teselagen.bio.parsers.Genbank", {});

        // LOCUS
        var date    = (new Date()).toDateString().split(" ");
        var dateStr = date[2] + "-" + date[1].toUpperCase() + "-" + date[3];
        var locusKW = Ext.create("Teselagen.bio.parsers.GenbankLocusKeyword", {
            locusName: pSequenceManager.getName(),
            sequenceLength: pSequenceManager.getSequence().getSymbolsLength(),
            linear: !pSequenceManager.getCircular(),
            naType: "DNA",
            strandType: "ds",
            date: dateStr
        });
        result.setLocus(locusKW);

        // FEATURES
        var featKW = Ext.create("Teselagen.bio.parsers.GenbankFeaturesKeyword", {});
        result.setFeatures(featKW);

        for (var i=0; i < pSequenceManager.getFeatures().length; i++) {
            var feat = pSequenceManager.getFeatures()[i];

            var featElm = Ext.create("Teselagen.bio.parsers.GenbankFeatureElement", {
                keyword: feat.getType(),
                strand: pSequenceManager.getStrand(),
                complement: false,
                join: false,
                featureQualifier: [],
                featureLocation: []
            });

            if (pSequenceManager.getStrand() === 1) {
                featElm.setCompelment(true);
            }

            if (feat.getLocations().length > 1) {
                featElm.setJoin(true);
            }

            featKW.addElement(featElm);

            //console.log(feat.getLocations().length);

            for (var j=0; j < feat.getLocations().length; j++) {
                var featLoc = Ext.create("Teselagen.bio.parsers.GenbankFeatureLocation", {
                    start:  feat.getLocations()[j].getStart(),
                    end:    feat.getLocations()[j].getEnd(),
                    to:     ".."
                });
                featElm.addFeatureLocation(featLoc);
            }
            //console.log(featElm.getFeatureLocation().length);

            if (feat.getNotes() !== null) {
                for (var j=0; j < feat.getNotes().length; j++) {
                    var featQual = Ext.create("Teselagen.bio.parsers.GenbankFeatureQualifier", {
                        name: feat.getNotes()[j].getName(),
                        value: feat.getNotes()[j].getValue(),
                        quoted: feat.getNotes()[j].getQuoted()
                    });
                    featElm.addFeatureQualifier(featQual);
                }
            }
        }

        // ORIGIN

        var origKW = Ext.create("Teselagen.bio.parsers.GenbankOriginKeyword", {
            sequence: pSequenceManager.getSequence.seqString()
        });
        result.setFeatures(origKW);

        return result;
    },

    /**
     * Converts a Genbank {@link Teselagen.bio.parsers.Genbank} into a FeaturedDNASequence
     * form of the data.
     *      OUTPUT IS FeaturedDNASequence but not sure if data should be set to "this"
     * @param {Teselagen.bio.parsers.Genbank} genbank A Genbank model of your data
     * @returns {Teselagen.manager.SequenceManager} sequenceManager A sequenceManager model of your data
     */
    genbankToSequenceManager: function(genbank) {
        var result; // original wants this to be a FeaturedDNASequence NOT SeqMgr!

        var name        = genbank.getLocus().getLocusName();
        var isCirc      = !genbank.getLocus().getLinear(); //genbank.getLocus().getCircular();
        var sequence    = Teselagen.bio.sequence.DNATools.createDNA(genbank.getOrigin().getSequence());
        var features    = [];
        
        var gbFeats     = genbank.getFeatures().getFeaturesElements();

        for (var i=0; i < gbFeats.length; i++) {
            var locations   = [];
            var notes       = [];
            var featName    = gbFeats[i].getKeyword();   
            //var tmpFeat = null;

            for (var j=0; j < gbFeats[i].getFeatureLocation().length; j++) {
                var tmpLoc = Ext.create("Teselagen.bio.sequence.common.Location", { 
                    start:  gbFeats[i].getFeatureLocation()[j].getStart(), 
                    end:    gbFeats[i].getFeatureLocation()[j].getEnd() 
                });
                locations.push(tmpLoc);
            }

            for (var k=0; k < gbFeats[i].getFeatureQualifier().length; k++) {
                var tmpName = gbFeats[i].getFeatureQualifier()[k].getName();
                if (tmpName === "label" | tmpName === "ApEinfo_label" ||
                    tmpName === "note" || tmpName === "gene" || 
                    tmpName === "organism" || tmpName === "name" ) {
                    featName = gbFeats[i].getFeatureQualifier()[k].getValue();
                } //else {
                    //featName = gbFeats[i].getKeyword();
                //}

                var tmpNote = Ext.create("Teselagen.bio.sequence.dna.FeatureNote", {
                    name:   gbFeats[i].getFeatureQualifier()[k].getName(),
                    value:  gbFeats[i].getFeatureQualifier()[k].getValue(),
                    quoted: gbFeats[i].getFeatureQualifier()[k].getQuoted(),
                });
                notes.push(tmpNote);
            }

            features[i] = Ext.create("Teselagen.bio.sequence.dna.Feature",{
                name:   featName,
                type:   gbFeats[i].getKeyword(),
                strand: gbFeats[i].getStrand(),
                //start:  gbFeats[i].getFeatureLocation()[0].getStart(),
                //end:    gbFeats[i].getFeatureLocation()[0].getEnd(),
                notes:  notes
            });
            features[i].setNotes(notes);
            features[i].setLocations(locations);
        }

        result = Ext.create("Teselagen.manager.SequenceManager", {
            name: name,
            circular: isCirc,
            sequence: sequence,
            features: features
        });
        
        return result;
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
     verifyJbeiseqJson: function (json) {
        var result = false; 

        if (json["seq"] === undefined) {
            throw Ext.create("Teselagen.bio.BioException", {
                message: "Invalid JbeiSeqXML file. No root or record tag 'seq'"
            });
            return result;
        }

        //===============
        // HEADER INFO

        var date    = Teselagen.bio.parsers.ParsersManager.todayDate();

        if (json["seq"]["name"] === undefined) {
            console.warn("jbeiseqXmlToJson: No sequence name detected");
            return result;
        }

        if (json["seq"]["circular"] === undefined) {
            console.warn("jbeiseqXmlToJson: No linear status detected; default to linear");
            return result;
        }

        if (json["seq"]["sequence"] === undefined) {
            console.warn("jbeiseqXmlToJson: No sequence detected");
            throw Ext.create("Teselagen.bio.BioException", {
                message: "Invalid JbeiSeqXML file. No sequence detected"
            });
            return result;
        }

        if (json["seq"]["seqHash"] === undefined) {
            //return result;
        }

        //===============
        // FEATURES

        var features = [];

        if (json["seq"]["features"]["feature_asArray"] === undefined) {
            throw Ext.create("Teselagen.bio.BioException", {
                message: "Invalid JbeiSeqXML file. No Features detected"
            });
            return result;
        }

        for (var i=0; i < jFeats.length; i++) {

            var locations   = [];
            var attributes  = []; //qualifiers  = [];
            
            var ft = jFeats[i];

            if (ft["type"] === undefined) {
                //return result;
            }

            if (ft["complement"] === undefined) {
                //return result;
            }

            //===============
            // LOCATIONS
            // asArray will detect if there are locations; ie length=0 means no locations

            for (var j=0; j < ft["location_asArray"].length; j++) {

                if (ft["location_asArray"][j]["genbankStart"] === undefined) {
                    return result;
                }
            }
            //===============
            // ATTRIBUTES

            if (ft["label"] === undefined ) {
                return result;
            }

            for (var j=0; j < ft["attribute_asArray"].length; j++) {
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
            return result;
        } else if (json["seq"] === undefined) {
            return result;
        }

        //===============
        // HEADER INFO

        var date    = Teselagen.bio.parsers.ParsersManager.todayDate();

        if (json["seq"]["name"] !== undefined) {
            var name    = json["seq"]["name"]["__text"];
        } else {
            var name = "no_name";
            console.warn("jbeiseqXmlToJson: No sequence name detected");
        }

        if (json["seq"]["circular"] !== undefined) {
            var circ  = (json["seq"]["circular"]["__text"].toLowerCase() === "true");
        } else {
            var circ  = false;
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
                    "seq:genbankStart" : start,
                    "seq:end" : end
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
                "_xmlns:seq": "http://jbei.org/sequence",
                "_xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
                "_xsi:schemaLocation": "http://jbei.org/sequence seq.xsd"
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

            if (complement === true) {
                var strand = -1;
            } else {
                var strand = 1;
            }

            if (locations.length>1) {
                var join = true;
            } else {
                var join = false;
            }

            // THIS DOESNT WORK YET
            if (seq.match(/[^U][^RYMKSWHBVDN][ACGT]/gi)) {
                var na = "DNA";
            } else if (seq.match(/[^T][^RYMKSWHBVDN][ACGU]/gi)) {
                var na = "RNA";
            } else if (seq.match(/[^U][ACGTRYMKSWHBVDNacgtrymkswhbvdn]+/gi)) {
                var na = "PRO";
            } else {
                var na = "NAN";
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
            var ft    = feat[i];
            var newFt = [];

            // SEQHASH
            //Code to turn ftSeq into unique id/hash goes here //DO SEQHASH HERE!
            var seqHash = "";

            // LOCATIONS
            var newLoc = [];
            for (var j=0; j < ft.getFeatureLocation().length; j++) {
                var start = ft.getFeatureLocation()[j].getStart();
                var end   = ft.getFeatureLocation()[j].getEnd();

                newLoc.push( {
                    "seq:genbankStart" : start,
                    "seq:end" : end
                });
            }
            // QUALIFIERS -> ATTRIBUTES
            var newAttr = [];
            for (var k=0; k < ft.getFeatureQualifier().length; k++) {
                var key    = ft.getFeatureQualifier()[k].getName();
                var value  = ft.getFeatureQualifier()[k].getValue();
                var quoted = ft.getFeatureQualifier()[k].getQuoted();

                if (k==0 && this.isALabel(key) ) { //HERE 8/20
                    //console.log("found a label: " + key );
                    var label = value;
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
            }

            var newFt = {
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
        var json = { 
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

    // ===========================================================================
    //   SBOL & JbeiSeq Conversions
    //
    //      sbolXML <--> sbolJSON <--> jbeiJSON
    // ===========================================================================

    /**
     * Converts an SbolXML in string format to JSON format.
     * This checks for valid entries in the XML file. 
     * If a required entry is not recognized, an error is thrown.
     * If a non-required entry is not recognized, a default value is used.
     * Use this for a cleaned version of JSON (from {@link Teselagen.bio.util.XmlToJson})
     * @param {String} xml Sbol XML file in String format
     * @returns {JSON} json Cleaned JSON object of the Sbol XML
     */
    sbolXmlToJson: function(xmlStr) {
        var result = {};

        var json = XmlToJson.xml_str2json(xmlStr);
        //  console.log(JSON.stringify(json, null, "  "));


        if (json["RDF"] === undefined) {
            throw Ext.create("Teselagen.bio.BioException", {
                message: "Invalid SbolXML file. No root or record tag 'RDF'"
            });
            return result;
        } else if (json["RDF"] === undefined) {
            return result;
        }

        //===============
        // HEADER INFO

        if (json["RDF"]["DnaComponent"] === undefined) {
            throw Ext.create("Teselagen.bio.BioException", {
                message: "Invalid SbolXML file. No 'DnaComponent' tag found."
            });
            return result;
        }



        if (json["RDF"]["DnaComponent"]["displayId"] !== undefined) {
            var displayId = json["RDF"]["DnaComponent"]["displayId"]; //seq:name
        } else {
            var displayId = "no_name";
            console.warn("sbolXmlToJson: no displayId detected");
        }

        var dnaComp = json["RDF"]["DnaComponent"];

        var newDnaSeq = [];
        if (dnaComp["dnaSequence"] === undefined) {
            console.warn("sbolXmlToJson: no 'dnaSequence' detected");
        } else {
            var tmp = json["RDF"]["DnaComponent"]["dnaSequence"]["DnaSequence"];
            if (tmp["_rdf:about"] !== undefined) {
                var newRdfAbt = tmp["_rdf:about"];
            } else {
                var newRdfAbt = "";
            }
            console.log(tmp["nucleotides"]);

            if (tmp["nucleotides"] !== undefined) {
                var nucleotides = tmp["nucelotides"]; //seq:sequence
            } else {
                var nucleotides = "";
                console.warn("sbolXmlToJson: No sequence name detected");
            }

            newDnaSeq = {
                //"dnaSequence" : {
                    "DnaSequence" : {
                        "nucleotides" : nucleotides,
                        "_rdf:about" : newRdfAbt
                        
                    }
                //}
            };
            
        }

        var newAnnot = [];
        if (dnaComp["annotation"] === undefined && dnaComp["annotation"]["SequenceAnnotation_asArray"] === undefined ) {
            console.warn("sbolXmlToJson: no 'annotation' detected");
        } else {

            var seqAnnot = json["RDF"]["DnaComponent"]["annotation"]["SequenceAnnotation"];
            var newSeqAnnot = [];
            for (var i=0; i < seqAnnot.length; i++) {
                var annot = seqAnnot[i];

                if (seqAnnot["bioStart"] !== undefined) {
                    var bioStart = seqAnnot["bioStart"];
                } else {
                    var bioStart = "";
                }
                if (annot["bioEnd"] !== undefined) {
                    var bioEnd = seqAnnot["bioEnd"];
                } else {
                    var bioEnd = "";
                }
                if (annot["strand"] !== undefined) {
                    var strand = seqAnnot["strand"];
                } else {
                    var strand = "+";
                }

                var subComp =seqAnnot["subComponent"];
                console.log(subComp);
                var newSubComp = [];
                if (annot["subComponent"] !== undefined) {
                    var abt = subComp["DnaComponent"]["_rdf:about"];
                    var type= subComp["DnaComponent"]["rdf:type"];
                    var id  = subComp["DnaComponent"]["displayId"];

                    var sub = {
                        "DnaComponent" : {
                            "_rdf:about" : abt,
                            "rdf:type" : type,
                            "displayId" : id
                        }
                    };
                    newSubComp.push(sub);
                }
            }
            newAnnot = {
                "_rdf:about" : json["RDF"]["DnaComponent"]["annotation"]["SequenceAnnotation"]["_rdf:about"],
                "bioStart" : bioStart,
                "bioEnd"   : bioEnd,
                "strand"   : strand,
                "subComponent" : newSubComp
            }
        }

        json = {
            "DnaComponent" : {
                "_rdf:about" : json["RDF"]["DnaComponent"]["_rdf:about"],
                "displayId" : displayId,
                "dnaSequence" : newDnaSeq,
                "annotation" : newAnnot
            }
        }

        //console.log(JSON.stringify(json, null, "  "));

        return json;
        

    },

    sbolJsonTojbeiJson: function(sbol) {

    },

    jbeiJsonTosbolJson: function(jbei) {

    },




    // ===========================================================================
    //      UTILITY FUNCTIONS
    // ===========================================================================

    /**
     * @param {String} url The url to retrieve data from.
     * Uses a synchronus Ajax request.
     * @returns {String} xml XML string
     */
    loadFile: function(url) {
        // Doing XMLHttpRequest leads to loading from cash

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
     * @param
     * @return {Boolean} isALabel
     */
    isALabel: function(name) {
        if (name === "label" || name === "name"|| name === "ApEinfo_label" ||
            name === "note" || name === "gene" || name === "organism"  ) {

            return true;
        } else {
            return false;
        }
    },







// ===============================================================================================
//      STUFF TO DUMP BUT WILL SAVE HERE FOR NOW
// ===============================================================================================
    /** THIS DOES NOT WORK--breaks with domainspace and sub-models
     * Converts an XML string format of JbeiSeqXML.
     * Currently eliminates the "seq:" namespace by replaceing it with "seq".
     * @param {String} xml XML file in String format
     * 
     */
    parseJbeiseqxml: function (xml, url) {
        var list = [];

        Ext.define("JbeiSeq", {
            extend: "Ext.data.Model",
            fields: [
                "seqname", "seqcircular", "seqfeatures", "seqsequence"
                //{name: "name",     mapping: "seqname"    ,  type: "string"},
                //{name: "circular", mapping: "seqcircular",  type: "boolean"},
                //{name: "features", mapping: "seqfeatures",  type: "auto"},
                //{name: "sequence", mapping: "seqsequence",  type: "string"}
            ],
            proxy: {
                type: "memory",
                reader: {
                    type: "xml",
                    record: "seqseq"
                }
            },
            associations: [
                { type: 'belongsTo', model: 'Feature', name: "features" }
            ]
            /*hasMany: {
                name: "features",
                model: "Feature"
            }*/
        });

        Ext.define("Feature", {
            extend: "Ext.data.Model",
            fields: [
                "seqlabel",
                "seqcomplement",
                "seqtype",
                "seqlocation",
                "seqattribute",
                "seqseqHash"
                /*{name: "label",      mapping: "seqlabel",      type: "string"},
                {name: "complement", mapping: "seqcomplement", type: "boolean"},
                {name: "type",       mapping: "seqtype",       type: "string"},
                //{name: "location",   mapping: "seqlocation",   type: "auto"},
                {name: "attribute",  mapping: "seqattribute",  type: "auto"},
                {name: "seqHash",    mapping: "seqseqHash",    type: "auto"}*/
            ],
            proxy: {
                type: "memory",
                reader: {
                    type: "xml",
                    record: "seqfeature"
                }
            },
            /*hasMany: {
                name: "location",
                model: "Location"
            },*/
            belongsTo: "JbeiSeq"
        });

        Ext.define("Location", {
            extend: "Ext.data.Model",
            fields: [
                "seqgenbankStart", "seqend"
                //{name: "start",     mapping: "seq:location > seq:genbankStart"},
                //{name: "end",       mapping: "seq: location > seq:end"}
            ],
            proxy: {
                type: "memory",
                reader: {
                    type: "xml",
                    record: "location"
                }
            },
            belongsTo: "JbeiSeq"
        });

        console.log("here");

        xml = xml.replace(/seq\:/g, "seq");
        var doc = new DOMParser().parseFromString(xml, "text/xml");

        var store = Ext.create("Ext.data.XmlStore", {
            //autoDestroy: true,
            autoLoad: true,
            //model: "JbeiSeq",
            //model: "Feature",
            fields: [
                "seqname", "seqcircular", "seqsequence", "seqfeatures"
            ],
            //fields: [
            //    "seqlabel", "seqcomplement", "seqtype", "seqlocation", "seqattribute", "seqseqHash"
            //],
            data: doc,
            proxy: {
                type: "memory",
                url: url,
                reader: {
                    type: "xml",
                    record: "seqseq",
                    //record: "seqfeature",
                    root: "seqseq",
                    totalProperty: "total",
                    successProperty: "success"
                }
            }
        });

        //store.loadRawData(doc);
        console.log(store.getCount());
        console.log(store);

        // For each item in the store, which is one record, create a genbank data model and add to list
        store.each(function(jbei) {
            console.log(jbei.get("seqtype"));
            var name    = jbei.get("seqname");
            var linear  = !jbei.get("seqcircular");
            var seq     = jbei.get("seqsequence");
            var date    = Teselagen.bio.parsers.ParsersManager.todayDate();

            var locus   = Ext.create("Teselagen.bio.parsers.GenbankLocusKeyword", {
                locusName: name,
                linear: linear,
                sequenceLength: seq.length,
                date: date
            });
            var origin =  Ext.create("Teselagen.bio.parsers.GenbankOriginKeyword", {
                sequence: jbei.get("seqsequence")
            });


            var gb = Ext.create("Teselagen.bio.parsers.Genbank", {});
            gb.addKeyword(locus);
            gb.addKeyword(origin);
            list.push(gb);
            console.log(gb.toString());
        });

        return list;


    },

    /**
     * Converts a JbeiSeq XML file into a Genbank model of the data.
     * Only one record per xmlStr. Parse approriately with <seq:seq> RECORD </seq:seq> tags.
     * @param {String} xml JbeiSeq XML file  with ONE record in String format
     * @returns {Teselagen.bio.parsers.Genbank} genbank
     */
    jbeiseqxmlToGenbankUSINGXMLTOJSON: function(xmlStr) {
        var result = Ext.create("Teselagen.bio.parsers.Genbank", {});;

        var json = XmlToJson.xml_str2json(xmlStr);
        //console.log(JSON.stringify(json, null, "    "));

        if (json["seq"] === undefined) {
            throw Ext.create("Teselagen.bio.BioException", {
                message: "Invalid JbeiSeqXML file. No root or record tag 'seq'"
            });
            return result;
        } else if (json["seq"] === undefined) {
            return result;
        }

        //console.log(json["seq"]["features"]["feature_asArray"]);

        //===============
        // LOCUSKEYWORD

        var date    = Teselagen.bio.parsers.ParsersManager.todayDate();

        if (json["seq"]["name"] !== undefined) {
            var name    = json["seq"]["name"]["__text"];
        } else {
            var name = "no_name";
            console.warn("jbeiseqxmlToGenbank: No sequence name detected");
        }

        if (json["seq"]["circular"] !== undefined) {
            var circ  = json["seq"]["circular"]["__text"];
        } else {
            var circ  = false;
            console.warn("jbeiseqxmlToGenbank: No linear status detected; default to linear");
        }

        if (circ === "true") { //were strings for circular, convert to booleans
            var linear = false;
        } else {
            var linear = true;
        }

        if (json["seq"]["sequence"] !== undefined) {
            var seq     = json["seq"]["sequence"]["__text"] || "no_sequence";
        } else {
            var seq     = "";
            console.warn("jbeiseqxmlToGenbank: No sequence detected");
            throw Ext.create("Teselagen.bio.BioException", {
                message: "Invalid JbeiSeqXML file. No sequence detected"
            });
        }       

        var locus   = Ext.create("Teselagen.bio.parsers.GenbankLocusKeyword", {
            locusName: name,
            linear: linear,
            sequenceLength: seq.length,
            naType: na,
            date: date
        });

        result.addKeyword(locus);

        //===============
        // FEATURESKEYWORD

        var features = [];

        if (json["seq"]["features"]["feature_asArray"] === undefined) {
            return result;
            throw Ext.create("Teselagen.bio.BioException", {
                message: "Invalid JbeiSeqXML file. No Features detected"
            });
        } else { 
            var jFeats  = json["seq"]["features"]["feature_asArray"];
        }

        //console.log(jFeats.length);

        for (var i=0; i < jFeats.length; i++) {

            var locations   = [];
            var qualifiers  = [];
            
            var ft = jFeats[i];
            
            //console.log(ft);
            //console.log(JSON.stringify(ft, null, "   "));

            if (ft["type"] !== undefined) {
                var type = ft["type"]["__text"];
            } else {
                var type = "type_unknown";
            }

            if (ft["complement"] !== undefined) {
                var complement = ft["complement"]["__text"];
            } else {
                var complement = false;
            }

            //===============
            //LOCATIONS
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

                var loc = Ext.create("Teselagen.bio.parsers.GenbankFeatureLocation", {
                    start:  start,
                    end:    end,
                    to:     to
                });
                locations.push(loc);
            }
            //===============
            // QUALIFIERS

            if (ft["label"] !== undefined ) {
                var label = ft["label"]["__text"];
            } else {
                var label = "name_unknown";
            }
            var qual = Ext.create("Teselagen.bio.parsers.GenbankFeatureQualifier", {
                name:      "label",
                value:      label,
                quoted:     true
            });
            qualifiers.push(qual);

            //console.log(ft["attribute_asArray"]);
            for (var j=0; j < ft["attribute_asArray"].length; j++) {
                var qual = Ext.create("Teselagen.bio.parsers.GenbankFeatureQualifier", {
                    name:   ft["attribute_asArray"][j]["_name"],
                    value:  ft["attribute_asArray"][j]["__text"],
                    quoted: true
                });
                //console.log(qual.toString());
                qualifiers.push(qual);
            }

            // POST CALCULATIONS

            if (complement === true) {
                var strand = -1;
                complement = true;
            } else {
                var strand = 1;
                complement = false;
            }

            if (locations.length>1) {
                var join = true;
            } else {
                var join = false;
            }

            // THIS DOESNT WORK YET
            if (seq.match(/[^U][^RYMKSWHBVDN][ACGT]/gi)) {
                var na = "DNA";
            } else if (seq.match(/[^T][^RYMKSWHBVDN][ACGU]/gi)) {
                var na = "RNA";
            } else if (seq.match(/[^U][ACGTRYMKSWHBVDNacgtrymkswhbvdn]+/gi)) {
                var na = "PRO";
            } else {
                var na = "NAN";
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
            //console.log(feat.toString());
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
    jbeiseqxmlToGenbank_WITHCHECKS: function(xmlStr) {
        var result = Ext.create("Teselagen.bio.parsers.Genbank", {});;

        //var json = XmlToJson.xml_str2json(xmlStr);

        // Use clean JSON version of the XML, NOT the XmlToJson.xml_str2json() version
        // This checks and returns a useable format.
        var json = this.jbeiseqxmlToJson(xmlStr);
        //console.log(JSON.stringify(json, null, "    "));

        if (json["seq:seq"] === undefined) {
            throw Ext.create("Teselagen.bio.BioException", {
                message: "Invalid JbeiSeqXML file. No root or record tag 'seq'"
            });
            return result;
        } else if (json["seq:seq"] === undefined) {
            return result;
        }

        //console.log(json["seq:seq"]["features"]["feature_asArray"]);

        //===============
        // LOCUSKEYWORD

        var date    = Teselagen.bio.parsers.ParsersManager.todayDate();

        if (json["seq:seq"]["seq:name"] !== undefined) {
            var name    = json["seq:seq"]["seq:name"];
        } else {
            var name = "no_name";
            console.warn("jbeiseqxmlToGenbank: No sequence name detected");
        }

        if (json["seq:seq"]["seq:circular"] !== undefined) {
            var circ  = json["seq:seq"]["circular"];
        } else {
            var circ  = false;
            console.warn("jbeiseqxmlToGenbank: No linear status detected; default to linear");
        }

        if (circ === "true") { //were strings for circular, convert to booleans
            var linear = false;
        } else {
            var linear = true;
        }

        if (json["seq:seq"]["seq:sequence"] !== undefined) {
            var seq     = json["seq:seq"]["seq:sequence"];
        } else {
            var seq     = "";
            console.warn("jbeiseqxmlToGenbank: No sequence detected");
            throw Ext.create("Teselagen.bio.BioException", {
                message: "Invalid JbeiSeqXML file. No sequence detected"
            });
        }       

        var locus   = Ext.create("Teselagen.bio.parsers.GenbankLocusKeyword", {
            locusName: name,
            linear: linear,
            sequenceLength: seq.length,
            naType: na,
            date: date
        });

        result.addKeyword(locus);

        //===============
        // FEATURESKEYWORD

        var features = [];
        console.log(json["seq:seq"]["seq:features"]);

        if (json["seq:seq"]["seq:features"]["seq:feature"] === undefined) {
            throw Ext.create("Teselagen.bio.BioException", {
                message: "Invalid JbeiSeqXML file. No Features detected"
            });
            return result;
        } else { 
            var jFeats  = json["seq:seq"]["seq:features"]["seq:feature"];
        }

        console.log(jFeats.length);

        for (var i=0; i < jFeats.length; i++) {

            var locations   = [];
            var qualifiers  = [];
            
            var ft = jFeats[i];
            
            //console.log(ft);
            //console.log(JSON.stringify(ft, null, "   "));

            if (ft["seq:type"] !== undefined) {
                var type = ft["seq:type"];
            } else {
                var type = "type_unknown";
            }

            if (ft["seq:complement"] !== undefined) {
                var complement = ft["seq:complement"];
            } else {
                var complement = false;
            }

            //===============
            //LOCATIONS
            // asArray will detect if there are locations; ie length=0 means no locations

            for (var j=0; j < ft["seq:location"].length; j++) {
                var start = ft["seq:location"][j]["seq:genbankStart"];

                if (ft["location"][j]["seq:end"] === undefined) {
                    var end   = start;
                } else {
                    var end   = ft["seq:location"][j]["seq:end"];
                }
                var to    = "..";

                var loc = Ext.create("Teselagen.bio.parsers.GenbankFeatureLocation", {
                    start:  start,
                    end:    end,
                    to:     to
                });
                locations.push(loc);
            }
            //===============
            // QUALIFIERS

            if (ft["seq:label"] !== undefined ) {
                var label = ft["seq:label"];
            } else {
                var label = "name_unknown";
            }
            var qual = Ext.create("Teselagen.bio.parsers.GenbankFeatureQualifier", {
                name:      "label",
                value:      label,
                quoted:     true
            });
            qualifiers.push(qual);

            console.log(ft["seq:attribute"]);
            for (var j=0; j < ft["seq:attribute"].length; j++) {
                var qual = Ext.create("Teselagen.bio.parsers.GenbankFeatureQualifier", {
                    name:   ft["seq:attribute"][j]["_name"],
                    value:  ft["seq:attribute"][j]["__text"],
                    quoted: true
                });
                //console.log(qual.toString());
                qualifiers.push(qual);
            }

            // POST CALCULATIONS

            if (complement === true) {
                var strand = -1;
                complement = true;
            } else {
                var strand = 1;
                complement = false;
            }

            if (locations.length>1) {
                var join = true;
            } else {
                var join = false;
            }

            // THIS DOESNT WORK YET
            if (seq.match(/[^U][^RYMKSWHBVDN][ACGT]/gi)) {
                var na = "DNA";
            } else if (seq.match(/[^T][^RYMKSWHBVDN][ACGU]/gi)) {
                var na = "RNA";
            } else if (seq.match(/[^U][ACGTRYMKSWHBVDNacgtrymkswhbvdn]+/gi)) {
                var na = "PRO";
            } else {
                var na = "NAN";
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
            //console.log(feat.toString());
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
     * Converts a Genbank model into a JbeiSeq XML formatted file.
     * Only one Genbank model at a time.
     * This is code adapted from IceXmlUtils.as
     * @returns {Teselagen.bio.parsers.Genbank} genbank
     * @param {String} xml JbeiSeq XML string with ONE record in String format
     */
    genbankToJbeiseqxml_ORIGINAL: function(pGenbank) {

        if (pGenbank === null) {
            return null;
        }

        var xml = [];

        xml.push("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n");
        xml.push("<seq:seq\n");

        xml.push("  xmlns:seq=\"http://jbei.org/sequence\"\n");
        xml.push("  xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"\n");
        xml.push("  xsi:schemaLocation=\"http://jbei.org/sequence seq.xsd\"\n");
        xml.push(">\n");
        
        xml.push("<seq:name>" + pGenbank.getLocus().getLocusName() + "</seq:name>\n");
        xml.push("<seq:circular>" + !pGenbank.getLocus().getLinear() + "</seq:circular>\n");
        xml.push("<seq:sequence>" + pGenbank.getOrigin().getSequence() + "</seq:sequence>\n");
        xml.push("<seq:features>\n");

        var feat = pGenbank.getFeatures().getFeaturesElements();
        var sequence  = pGenbank.getOrigin().getSequence();

        for (var i=0; i < feat.length; i++) {
            var ft = feat[i];
            

            // Original code SeqMgr->jbeiSeq, seqHash needs to be made for the first location segment
            var ftSeq = "";
            for (var j=0; j < ft.getFeatureLocation().length; j++) {
                var start = ft.getFeatureLocation()[j].getStart();
                var end   = ft.getFeatureLocation()[j].getEnd();

                if (end < start) {
                    ftSeq += sequence.substr(start, sequence.length) + sequence.substr(0, end);
                } else {
                    ftSeq += sequence.substr(start, end);
                }
            }
            if (pGenbank.getLocus().getStrandType() === -1) {
                ftSeq = DNATools.reverseComplement();
            }

            //Code to turn ftSeq into unique id/hash goes here
            var seqHash = "";


            // Look for Feature name



            // Feature Label/Complement/type population
            xml.push("    <seq:feature>\n");
            xml.push("        <seq:label>" + ft.findLabel() + "</seq:label>\n");
            xml.push("        <seq:complement>" + ft.getComplement() + "</seq:label>\n");
            xml.push("        <seq:type>" + ft.getKeyword() + "</seq:label>\n");

            //var loc = [];
            // Locations
            for (var j=0; j < ft.getFeatureLocation().length; j++) {
                var start = ft.getFeatureLocation()[j].getStart();
                var end   = ft.getFeatureLocation()[j].getEnd();
                xml.push("        <seq:location>\n");
                xml.push("            <seq:genbankStart>" + (start + 1).toString() + "</seq:genbankStart>\n");
                xml.push("            <seq:end>" + (end).toString() + "</seq:end>\n");
                xml.push("        </seq:location>\n");
            }

            for (var k=0; k < ft.getFeatureQualifier().length; k++) {
                var key    = ft.getFeatureQualifier()[k].getName();
                var value  = ft.getFeatureQualifier()[k].getValue();
                var quoted = ft.getFeatureQualifier()[k].getQuoted();

                if (k==0 && this.isALabel(key) ) { //HERE 8/20
                    console.log("found a label");
                    //don't add as attribute
                } else {
                    xml.push("        <seq:attribute name=\"" + key + "\" quoted=\"" + quoted + "\" >" + value + "</seq:attribute>\n");
                }
            }

            xml.push("        <seq:seqHash>" + seqHash + "</seq:seqHash>\n");
            xml.push("    </seq:feature>\n");


        }

        xml.push("</seq:features>\n");
        xml.push("</seq:seq>\n");


        var json = { 
            "seq:seq" : {
                "seq:name" : pGenbank.getLocus().getLocusName(),
                "seq:circular" : !pGenbank.getLocus().getLinear(),
                "seq:sequence" : pGenbank.getOrigin().getSequence()
            }
        };

        //console.log(JSON.stringify(json, null, "   "));
        //console.log(XmlToJson.json2xml_str(json));


        return xml.join("");
    }

});