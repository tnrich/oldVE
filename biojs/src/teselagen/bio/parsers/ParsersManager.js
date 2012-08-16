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

    /**
     * Converts a Genbank model into a JbeiSeq XML formatted file.
     * Only one Genbank model at a time.
     * This is code adapted from IceXmlUtils.as
     * @returns {Teselagen.bio.parsers.Genbank} genbank
     * @param {String} xml JbeiSeq XML string with ONE record in String format
     */
    genbankToJbeiseqxml: function(pGenbank) {

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
            for (j=0; j < ft.getFeatureLocation().length; j++) {
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
            for (j=0; j < ft.getFeatureLocation().length; j++) {
                var start = ft.getFeatureLocation()[j].getStart();
                var end   = ft.getFeatureLocation()[j].getEnd();
                xml.push("        <seq:location>\n");
                xml.push("            <seq:genbankStart>" + (start + 1).toString() + "</seq:genbankStart>\n");
                xml.push("            <seq:end>" + (end).toString() + "</seq:end>\n");
                xml.push("        </seq:location>\n");
            }

            for (k=0; k < ft.getFeatureQualifier().length; k++) {
                var key    = ft.getFeatureQualifier()[k].getName();
                var value  = ft.getFeatureQualifier()[k].getValue();
                var quoted = ft.getFeatureQualifier()[k].getQuoted();
                xml.push("        <seq:attribute name=\"" + key + "\" quoted=\"" + quoted + "\" >" + value + "</seq:attribute>\n");
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
    },

    /**
     * Converts a Genbank model into a JbeiSeq JSON formatted file.
     * Only one Genbank model at a time.
     * This is code adapted from IceXmlUtils.as
     * @returns {Teselagen.bio.parsers.Genbank} genbank
     * @param {String} xml JbeiSeq JSON string with ONE record in String format
     */
    genbankToJbeiseqJson: function(pGenbank) {

        if (pGenbank === null) {
            return null;
        }

        var xml = [];
        var json = [];

        var feat = pGenbank.getFeatures().getFeaturesElements();
        var sequence  = pGenbank.getOrigin().getSequence();

        var newFeatures = [];

        for (var i=0; i < feat.length; i++) {
            var ft = feat[i];
            var newFeat = []
            

            //Code to turn ftSeq into unique id/hash goes here
            var seqHash = "";

            // Feature Label/Complement/type population

            var newLoc = [];
            // Locations
            for (j=0; j < ft.getFeatureLocation().length; j++) {
                var start = ft.getFeatureLocation()[j].getStart();
                var end   = ft.getFeatureLocation()[j].getEnd();

                newLoc.push( {
                    "seq:genbankStart" : start,
                    "seq:end" : end
                });
            }

            var newAttr = [];
            for (k=0; k < ft.getFeatureQualifier().length; k++) {
                var key    = ft.getFeatureQualifier()[k].getName();
                var value  = ft.getFeatureQualifier()[k].getValue();
                var quoted = ft.getFeatureQualifier()[k].getQuoted();

                newAttr.push( {
                    "seq:attribute" : {
                        "_name" : key,
                        "_quoted" : quoted,
                        "__text" : value //USE __text
                    }
                });
            }

            var newFeat = {
                "seq:label" : ft.findLabel(),
                "seq:complement" : ft.getComplement(),
                "seq:type" : ft.getKeyword(),
                "seq:location" : newLoc,
                "seq:attribute" : newAttr,
                "seq:seqHash" : seqHash
            };

            newFeatures.push( {
                "feature" : newFeat
            });
        }

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

        //console.log(JSON.stringify(json, null, "   "));
        //console.log(XmlToJson.json2xml_str(json));


        return json;
    },




    /**
     * Converts a JbeiSeq XML file into a Genbank model of the data.
     * Only one record per xmlStr. Parse approriately with <seq:seq> RECORD </seq:seq> tags.
     * @param {String} xml JbeiSeq XML file  with ONE record in String format
     * @returns {Teselagen.bio.parsers.Genbank} genbank
     */
    jbeiseqxmlToGenbank: function(xmlStr) {
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
     * Converts an JbeiSeqXML in string format to JSON format
     * XXXXCurrently eliminates the "seq:" namespace by replaceing it with "seq".
     * @param {String} xml XML file in String format
     * @returns {JSON} json Cleaned JSON object of the JbeiSeqXml {@link Teselagen.bio.util.XmlToJson}
     */
     jbeiseqxmlToJson: function (xmlStr) {
        var result = {}; 

        var json = Teselagen.bio.util.XmlToJson.xml_str2json(xmlStr);

        if (json["seq"] === undefined) {
            throw Ext.create("Teselagen.bio.BioException", {
                message: "Invalid JbeiSeqXML file. No root or record tag 'seq'"
            });
            return result;
        } else if (json["seq"] === undefined) {
            return result;
        }

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
            var attributes  = []; //qualifiers  = [];
            
            var ft = jFeats[i];

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

                var loc = {
                    "genbankStart" :  start,
                    "end" :    end
                };
                locations.push(loc);
            }
            //===============
            // QUALIFIERS

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
                var attr = {
                    "seq:attribute" : {
                        "_name" : ft["attribute_asArray"][j]["_name"],
                        "_quoted" : true,
                        "__text" : ft["attribute_asArray"][j]["__text"], //USE __text
                    }
                }

                attributes.push(attr);
            }

            // POST CALCULATIONS

            if (complement === true) {
                var strand = -1;
                complement = true;
            } else {
                var strand = 1;
                complement = false;
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

        var result = { 
            "seq:seq" : {
                "seq:name" : name,
                "seq:circular" : circ,
                "seq:sequence" : seq,
                "seq:features" : features,
                "_xmlns:seq": "http://jbei.org/sequence",
                "_xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
                "_xsi:schemaLocation": "http://jbei.org/sequence seq.xsd"
            }
        }

        return result;
     },


     /**
     * Converts an JbeiSeqXML in string format with multiple records to array of Genbank models
     * Currently eliminates the "seq:" namespace by replaceing it with "seq".
     * @param {String} xml XML file with one or more records in String format
     * @returns {Teselagen.bio.parsers.Genbank[]} genbank
     */
     jbeiseqxmlsToXmlArray: function (xml) {
        var xmlArray = [];
        var newxml = xml;

        //newxml = newxml.replace(/\<seq\:name/gi, "BREAKRECORD<seq:name");
        newxml = newxml.replace(/\<\/seq\:seq\>/gi, "<\/seq:seq>BREAKRECORD");

        //console.log(newxml);

        var xmlArr = newxml.split("BREAKRECORD");

        for (var i=0; i<xmlArr.length; i++) {
            //if (xmlArr[i].match(/^\<seq\:name\>/)) {
                xmlArray.push(xmlArr[i]);
                //console.log(xmlArr[i]);
            //}
        }

        console.log(xmlArray.length);

        return xmlArray;
     },


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

    // ===========================================================================
    // UTILITY FUNCTIONS
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
     }

});