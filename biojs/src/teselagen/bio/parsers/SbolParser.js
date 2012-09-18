
/**
 * @class Teselagen.bio.parsers.SbolParser
 * Converts SBOL formats.
 * Specifications for SBOL can be found at http://www.sbolstandard.org/specification/core-data-model
 * @author Diana Wong
 */

Ext.define("Teselagen.bio.parsers.SbolParser", {


    requires: [
        "Teselagen.bio.util.StringUtil",
        "Teselagen.bio.util.XmlToJson"
    ],

    singleton: true,

    namespace: null,

    constructor: function() {
        XmlToJson = Teselagen.bio.util.XmlToJson;
        namespace = "";
    },

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

        var i, j;

        var json = XmlToJson.xml_str2json(xmlStr);
        json     = this.checkRawSbolJson(json);

        var name = "RDF";

        if (json[name] === undefined) {
            throw Ext.create("Teselagen.bio.BioException", {
                message: "Invalid SBOL-XML file. No root or record tag 'RDF'"
            });
        }

        // Header Information
        var prefix  = json[name]["__prefix"]; //use a variable for the prefix
        var namespace;
        if (prefix === "") {
            namespace = name;
        } else {
            namespace = prefix + ":" + name;
        }

        var xmlns   = json[name]["_xmlns"];
        var xrdf    = json[name]["_xmlns:rdf"];
        var xrdfs   = json[name]["_xmlns:rdfs"];
        var so      = json[name]["_xmlns:so"];

        // Check Top Level: Collection || DnaComponent || DnaSequence ?
        // The hierarchy is Collection -> DnaComponent -> DnaSequence
        var top = [];
        var topName = "";

        if ( json[name]["Collection"] !== undefined) {
            topName = "Collection";

            if (json[name]["Collection"] === "HASH") {
                //top = {
                //    "Collection" : this.collectionXmlToJson(json["RDF"]["Collection"])
                //}
            }

            if (json[name]["Collection_asArray"] !== undefined) {
                for (i = 0; i < json[name]["Collection_asArray"].length; i++) {
                    top.push(
                        this.parseRawCollection(json[name]["Collection_asArray"][i], prefix)
                    );
                }
            }

        } else if ( json[name]["DnaComponent"] !== undefined) {
            topName = "DnaComponent";
            if (json[name]["DnaComponent_asArray"] !== undefined) {
                top = [];
                for (i = 0; i < json[name]["DnaComponent_asArray"].length; i++) {
                    top.push(
                        this.parseRawDnaComponent(json[name]["DnaComponent_asArray"][i], prefix)
                    );
                }
            }

        } else if ( json[name]["DnaSequence"] !== undefined) {
            topName = "DnaSequence";
            if (json[name]["DnaSequence_asArray"] !== undefined) {
                top = [];
                for (i = 0; i < json[name]["DnaSequence_asArray"].length; i++) {
                    top.push(
                        this.parseRawDnaSequence(json[name]["DnaSequence_asArray"][i], prefix)
                    );
                }
            }

        } else {
            throw Ext.create("Teselagen.bio.BioException", {
                message: "Invalid SBOL-XML file. Top level is not either a Collection, a DnaComponent, or a DnaSequence. Exiting... \n"
            });
        }

        // Fill in Result output
        result[namespace]                           = {};
        result[namespace]["_xmlns"]                 = xmlns;
        result[namespace]["_xmlns:" + prefix]       = xrdf;
        result[namespace]["_xmlns:" + prefix + "s"] = xrdfs;
        result[namespace]["_xmlns_so"]              = so;

        result[namespace][topName]                  = top;

        return result;
    },


    /**
      * Checks if a structure of the XML2JSON data structure has the minimal structure requirements.
      * Inserts blank entries for entries that are needed.
      *
      * @param {JSON} json a Raw SBOL-XML2JSON object
      * @returns {JSON} json Repaired raw SBOL-JSON object.
      */
    checkRawSbolJson: function(json) {

        if (json["RDF"] === undefined) {
            throw Ext.create("Teselagen.bio.BioException", {
                message: "Invalid SBOL-XML file. No root or record tag 'RDF'"
            });
        }

        if (json["RDF"]["Collection"] !== undefined) {
            //json["RDF"] = { "Collection" : [] };
        }

        return json;
    },

    parseRawCollection: function(coll, prefix) {
        var result = {};

        var uri         = coll["_"+prefix+":about"];
        var displayId   = coll["displayId"];
        var name        = coll["name"]; //[0..1]
        var description = coll["description"]; //[0..1]

        var components;
        if ( coll["components"] !== undefined) {
            components  = this.parseRawDnaComponent(coll["components"]["DnaComponent"]);
        }

        // Fill in Result ouput
        result["_"+prefix+":about"] = uri;
        result["displayId"]         = displayId;
        result["name"]              = name;
        result["description"]       = description;

        result["components"]        = components;

        return result;

    },

    parseRawDnaComponent: function(comp, prefix) {
        var result      = {};

        // SBOL sequences are never circular
        var circ        = false;

        // Name space -- direct port, not sure how to use yet
        var uri         = comp["_" + prefix + ":about"];
        /*var namespace, accession_number;
        if (tmp.match(/^(.*)#(-*)/)) {
            namespace           = about.split(/^(.*)#(-*)/)[0];
            accession_number    = about.split(/^(.*)#(-*)/)[1];
        } else {
            namespace           = about.split(/^(.*)#(-*)$/)[0];
            accession_number    = about.split(/^(.*)#(-*)$/)[1];
        }*/

        // Other Header info
        var displayId   = comp["displayId"];
        var primaryId   = comp["name"];
        var description = comp["description"];
        
        // Fill in Result ouput
        result["_"+prefix+":about"] = uri;
        result["displayId"]         = displayId;
        result["name"]              = primaryId;
        result["description"]       = description;

        // Type
        var type = comp["_" + prefix + ":type"];
        if (type !== undefined) {
            result[prefix + ":type"] = {};
            result[prefix + ":type"]["_" + prefix + ":resource"] = type["_" + prefix + ":resource"];
        }

        // DnaSequence -- Contains 0..1
        if (comp["dnaSequence"] !== undefined) {
            result["dnaSequence"] = this.parseRawDnaSequence(comp["dnaSequence"], prefix);
        }

        // SequenceAnnotation -- Contains 0..*
        if (comp["annotation_asArray"] !== undefined) {
            result["annotation"] = [];
            for (var i=0; i < comp["annotation_asArray"].length; i++) {
                result["annotation"].push(this.parseRawSequenceAnnotation(comp["annotation_asArray"][i], prefix));
            }
        }
        return result;
    },

    parseRawDnaSequence: function(seq, prefix) {
        var result;

        var about       = seq["DnaSequence"]["_" + prefix + ":about"];
        var nucleotides = seq["DnaSequence"]["nucleotides"];

        // Fill in Result ouput
        result = {
            "DnaSequence" : {}
        };

        result["DnaSequence"]["_" + prefix + ":about"]  = about;
        result["DnaSequence"]["nucleotides"]            = nucleotides;

        return result;
    },

    parseRawSequenceAnnotation: function(annotation, prefix) {
        var result = {};

        var uri         = annotation["_" + prefix + ":about"];
        var annot       = annotation["SequenceAnnotation_asArray"];
        var seqAnnot    = [];

        for (var i=0; i < annot.length; i++) {
            var bioStart    = parseInt(annot[i]["bioStart"]);// || parseInt("");
            var bioEnd      = parseInt(annot[i]["bioEnd"]);// || parseInt("");
            var strand      = annot[i]["strand"] || "+";
            
            // DnaComponent -- Contains Exactly 1
            var subComp     = this.parseRawDnaComponent(annot[i]["subComponent"]["DnaComponent"], prefix);

            // Sequence Annotation -- Contains 0..*
            var precedes;
            if (annot[i]["precedes"] !== undefined ) {
                precedes = [];
                preSeqAn = annot[i]["precedes"]["SequenceAnnotation_asArray"];
                for (var j=1; j < preSeqAn.length; j++) {
                    precedes.push(this.parseRawSequenceAnnotation(preSeqAn[j], prefix));
                }
            }

            seqAnnot.push({
                "bioStart"      : bioStart,
                "bioEnd"        : bioEnd,
                "strand"        : strand,
                "subComponent"  : subComp,
                "precedes"      : precedes
            });
        }

        // Fill in Result ouput
        result["_"+prefix+":about"]     = uri;
        result["SequenceAnnotation"]    = seqAnnot;
        
        return result;
    }


});