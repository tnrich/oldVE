/**
 * @class Teselagen.bio.parsers.JbeiseqParser
 * Converts JbeiSeq (XML and JSON) formats.
 * Performs:
 *          jbeiseqXMLs (more than one) --> ArrayList<jbeiseqXml>
 *
 *          jbeiseqXML <--> jbeiseqJSON <--> Genbank
 *
 * Specifications for JbeiSeq (XML) can be found at http://j5.jbei.org/j5manual/pages/94.html
 *
 * @author Diana Wong
 */

Ext.define("Teselagen.bio.parsers.JbeiseqParser", {


    requires: [
        "Teselagen.bio.util.XmlToJson",
        "Teselagen.bio.util.StringUtil",
        "Teselagen.bio.util.Sha256",
        "Teselagen.bio.parsers.Genbank",
        "Teselagen.bio.parsers.GenbankFeatureElement",
        "Teselagen.bio.parsers.GenbankFeatureLocation",
        "Teselagen.bio.parsers.GenbankFeatureQualifier",
        "Teselagen.bio.parsers.GenbankFeaturesKeyword",
        "Teselagen.bio.parsers.GenbankLocusKeyword",
        "Teselagen.bio.parsers.GenbankOriginKeyword",
        "Teselagen.utils.NameUtils"
    ],

    singleton: true,

    namespace: null,

    constructor: function() {
        XmlToJson = Teselagen.bio.util.XmlToJson;
        Sha256    = Teselagen.bio.util.Sha256;
        namespace = "";
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
      * @param {Object} json JbeiSeq JSON object
      * @returns {String[]} Array of error messages. Empty if valid JSON.
      */
     validateJbeiseqJson: function (json) {
        var i, j;
        var messages = [];

        if (json["seq:seq"] === undefined) {
            messages.push("Invalid JbeiSeqXML file. No root or record tag 'seq'");
            throw Ext.create("Teselagen.bio.BioException", {
                message: "Invalid JbeiSeqXML file. No root or record tag 'seq'"
            });
        }

        //===============
        // HEADER INFO

        var date    = Teselagen.bio.parsers.ParsersManager.todayDate();

        if (json["seq:seq"]["seq:name"] === undefined) {
            messages.push("jbeiseqXmlToJson: No sequence name detected");
        }

        if (json["seq:seq"]["seq:circular"] === undefined) {
            messages.push("jbeiseqXmlToJson: No linear status detected; default to linear");
        }

        if (json["seq:seq"]["seq:sequence"] === undefined) {
            messages.push("jbeiseqXmlToJson: No sequence detected");
            //throw Ext.create("Teselagen.bio.BioException", {
            //    message: "Invalid JbeiSeqXML file. No sequence detected"
            //});
        }

        if (json["seq:seq"]["seq:seqHash"] === undefined) {
            //return result;
        }

        //===============
        // FEATURES

        var features = [];
        var jFeats;

        if (json["seq:seq"]["seq:features"] === undefined) {
            messages.push("Invalid JbeiSeqXML file. No Features detected");
            //throw Ext.create("Teselagen.bio.BioException", {
            //    message: "Invalid JbeiSeqXML file. No Features detected"
            //});
        } else {
            jFeats  = json["seq:seq"]["seq:features"];
        }

        for (i=0; i < jFeats.length; i++) {

            var locations   = [];
            var ft = jFeats[i]["seq:feature"];
            
            var attributes = ft["seq:attribute"];
            var attribute;
            var attributesText = "";
            if(attributes.length > 0) {
                attributesText = "'" + attributes[0]._name + "': " + "'" + attributes[0].__text + "'";
            }

            /*for(var i = 0; i < attributes.length; i++) {
                attribute = attributes[i];

                //attributesText.push("'" + attribute._name + "': '" + attribute.__text + "'");
            }*/

            //attributesText = attributesText.join(", ");

            if (ft["seq:type"] === undefined) {
                //return result;
            }

            if (ft["seq:complement"] === undefined) {
                //return result;
            }

            //===============
            // LOCATIONS
            // asArray will detect if there are locations; ie length=0 means no locations

            for (j=0; j < ft["seq:location"].length; j++) {
                if (ft["seq:location"][j]["seq:genbankStart"] === undefined) {
                    if(attributes.length > 0) {
                        messages.push("Feature with attribute " + attributesText + " has an undefined location.");
                    }
                }
            }
            //===============
            // ATTRIBUTES

            if (ft["seq:label"] === undefined ) {
                if(attributes.length > 0) {
                    messages.push("Feature with attribute " + attributesText + " has no defined label.");
                } else {
                    messages.push("Feature " + (i + 1) + " has no attributes.");
                }
            }
        }

        return messages;
     },

    /**
     * Converts an JbeiSeqXML in string format to JSON format.
     * This checks for valid entries in the XML file.
     * If a required entry is not recognized, an error is thrown.
     * If a non-required entry is not recognized, a default value is used.
     * Use this for a cleaned version of JSON (from {@link Teselagen.bio.util.XmlToJson})
     * XXXXCurrently eliminates the "seq:" namespace by replaceing it with "seq".
     * @param {String} xml XML file in String format
     * @returns {Object} json Cleaned JSON object of the JbeiSeqXml
     */
     jbeiseqXmlToJson: function (xmlStr) {
        var result = {};
        var i, j, k;

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

        var seq;
        if (json["seq"]["sequence"] !== undefined) {
            seq     = json["seq"]["sequence"]["__text"] || "no_sequence";
        } else {
            seq     = "";
            console.warn("jbeiseqXmlToJson: No sequence detected");
            throw Ext.create("Teselagen.bio.BioException", {
                message: "Invalid JbeiSeqXML file. No sequence detected"
            });
        }

        var seqHash;
        if (json["seq"]["seqHash"] !== undefined) {
            seqHash = json["seq"]["seqHash"]["__text"];
        } else {
            seqHash = "";
        }


        //===============
        // FEATURES

        var features = [];

        var jFeats;
        if (json["seq"]["features"]["feature_asArray"] === undefined) {
            throw Ext.create("Teselagen.bio.BioException", {
                message: "Invalid JbeiSeqXML file. No Features detected"
            });
            //return result;
        } else {
            jFeats  = json["seq"]["features"]["feature_asArray"];
        }

        if(jFeats) {
            for (i=0; i < jFeats.length; i++) {

                var locations   = [];
                var attributes  = []; //qualifiers  = [];
                
                var ft = jFeats[i];

                var type = "unsure"; //using seq.xsd
                if (ft["type"] !== undefined) {
                    type = ft["type"]["__text"];
                }

                var complement = false;
                if (ft["complement"] !== undefined) {
                    complement = (ft["complement"]["__text"].toLowerCase() === "true");
                }

                //===============
                // LOCATIONS
                // asArray will detect if there are locations; ie length=0 means no locations

                if(ft["location_asArray"]) {
                    for (j=0; j < ft["location_asArray"].length; j++) {
                        //console.log(ft["location_asArray"][j]);
                    	
                        var start;
                        // The following code checks for a variation of format found in test files.
                        if (ft["location_asArray"][j]["genbankStart"] === undefined) {
                        	start = ft["location_asArray"][j]["genbank_start"]["__text"];
                        } else {
                        	start = ft["location_asArray"][j]["genbankStart"]["__text"];
                        }
                        var end;
                        if (ft["location_asArray"][j]["end"] === undefined) {
                            end   = start;
                        } else {
                            end   = ft["location_asArray"][j]["end"]["__text"];
                        }
                        var to    = "..";

                        var loc = {
                            "seq:genbankStart" : parseInt(start),
                            "seq:end" : parseInt(end)
                        };
                        locations.push(loc);
                    }
                }
                //===============
                // ATTRIBUTES

                var label = "name_unknown";
                if (ft["label"] !== undefined ) {
                    label = ft["label"]["__text"];
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
                if(ft["attribute_asArray"]) {
                    for (j=0; j < ft["attribute_asArray"].length; j++) {
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
                                "__text" : ft["attribute_asArray"][j]["__text"] //USE __text
                            //}
                        };

                        attributes.push(attr);
                    }
                }

                // POST CALCULATIONS
                var strand = 1;
                if (complement === true) {
                    strand = -1;
                }

                var feat = {
                    "seq:feature" : {
                        "seq:label" : label,
                        "seq:complement" : complement,
                        "seq:type" : type,
                        "seq:location": locations,
                        "seq:attribute" : attributes //this should not be saved as a subset
                    }
                };

                features.push(feat);
            }
        }
        // Setting final JSON object
        result = {
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
        };

        return result;
     },

    /**
     * Converts an JbeiSeq JSON to JbeiSeq XML format.
     *
     * @param {Object} json Cleaned JSON object of the JbeiSeqXml
     * @returns {String} xml XML file in String format
     */
     jbeiseqJsonToXml: function(json) {

        if (json === null) {
            return null;
        }

        try {
            messages = Teselagen.bio.parsers.ParsersManager.validateJbeiseqJson(json);
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
     * @param {Object} json JbeiSeq JSON object with ONE record
     * @returns {Teselagen.bio.parsers.Genbank} genbank
     */
    jbeiseqJsonToGenbank: function(json) {
        var result = Ext.create("Teselagen.bio.parsers.Genbank", {});
        var NameUtils = Teselagen.utils.NameUtils;

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

        if(!NameUtils.isLegalName(locus.getLocusName())) {
            locus.setLocusName(NameUtils.reformatName(locus.getLocusName()));
            result.addMessage('Invalid locus name. Illegal characters replaced with \'_\'.');
        }

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

        var feat      = pGenbank.getFeatures() ? pGenbank.getFeatures().getFeaturesElements() : "";
        var sequence = "";
        if(pGenbank.getOrigin()) sequence = pGenbank.getOrigin().getSequence();
        // FEATURES Label/Complement/type population
        var newFeatures = [];

        for (var i=0; i < feat.length; i++) {
            var start, end, key, value, quoted;
            var j, k;
            var nameAttr = {};

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
            var hasName = false;
            var usingLabel = false;
            var usingGene = false;

            for (k=0; k < ft.getFeatureQualifier().length; k++) {
                key    = ft.getFeatureQualifier()[k].getName();
                value  = ft.getFeatureQualifier()[k].getValue();
                quoted = ft.getFeatureQualifier()[k].getQuoted();

                // SET THE LABEL FIELD. DO NOT STORE AS AN ATTRIBUTE

                if (this.isALabel(key)) {
                    // Priority for name attributes is: 'label' > 'gene' > 'organism'.
                    // We check to see if the current name is from a lower-priority
                    // attribute. If it is, we store it as an attribute and then
                    // replace it with the current higher-priority attribute.

                    if(key === "label") {
                        // Label has top priority.
                        
                        // If feature already has a name, it is lower priority,
                        // so save it as a normal attribute instead.
                        if(hasName) {
                            newAttr.push(nameAttr);
                        }

                        nameAttr = {
                            "_name": key,
                            "_quoted": quoted,
                            "__text": value
                        };

                        usingLabel = true;
                    } else if(key === "gene") {

                        // If we're not using the label for the name, use the
                        // current 'gene' attribute. If we are using label for
                        // the name, just save the current attribute as a normal
                        // attribute.
                        if(!usingLabel) {
                            if(hasName) {
                                newAttr.push(nameAttr);
                            }

                            nameAttr = {
                                "_name": key,
                                "_quoted": quoted,
                                "__text": value
                            };

                            usingGene = true;
                        } else {
                            newAttr.push({
                                "_name": key,
                                "_quoted": quoted,
                                "__text": value
                            });
                        }
                    } else if(!usingLabel && !usingGene) {
                        // If we don't have a label from either a 'gene' or a
                        // 'label' field, use the current field as the name.

                        if(hasName) {
                            newAttr.push(nameAttr);
                        }

                        nameAttr = {
                            "_name": key,
                            "_quoted": quoted,
                            "__text": value
                        };
                    } else {
                        // If we already have a name, and the current attribute
                        // is not of higher priority, just save it as a normal
                        // attribute.
                        
                        newAttr.push({
                            "_name": key,
                            "_quoted": quoted,
                            "__text": value
                        });
                    }

                    hasName = true;
                } else {
                    newAttr.push( {
                        //"seq:attribute" : {
                            "_name" : key,
                            "_quoted" : quoted,
                            "__text" : value //USE __text
                        //}
                    });
                }
            }

            newFt = {
                "seq:label" : nameAttr.__text, //ft.findLabel(),
                "seq:complement" : ft.getComplement(),
                "seq:type" : ft.getKeyword(),
                "seq:index" : ft.getIndex(),
                "seq:location" : newLoc,
                "seq:attribute" : newAttr,
                "seq:seqHash" : seqHash
            };

            newFeatures.push( {
                "seq:feature" : newFt
            });
        }

        // MAKE JSON
        json = {
            "seq:seq" : {
                "seq:name" : pGenbank.getLocus() ? pGenbank.getLocus().getLocusName() : "",
                "seq:circular" : pGenbank.getLocus() ? !pGenbank.getLocus().getLinear() : "",
                "seq:sequence" : pGenbank.getOrigin() ? pGenbank.getOrigin().getSequence() : "",
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
    //      UTILITY FUNCTIONS
    // ===========================================================================

    /**
     * isALabel
     * @param {String} name Name of a attribute or qualifier
     * @return {Boolean} isALabel
     */
    isALabel: function(name) {
        if (name === "label" || name === "name"|| name === "ApEinfo_label" ||
            name === "note" || name === "gene" || name === "organism" || name === "locus_tag") {

            return true;
        } else {
            return false;
        }
    }

});
