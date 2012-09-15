
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

        if (json["RDF"] === undefined) {
            throw Ext.create("Teselagen.bio.BioException", {
                message: "Invalid SBOL-XML file. No root or record tag 'RDF'"
            });
        }

        // Header Information
        var namespace = json["RDF"]["__prefix"]; //use a variable for the prefix
        var xmlns   = json["RDF"]["_xmlns"];
        var xrdf    = json["RDF"]["_xmlns:rdf"];
        var xrdfs   = json["RDF"]["_xmlns:rdfs"];
        var so      = json["RDF"]["_xmlns:so"];

        // Check Top Level: Collection || DnaComponent || DnaSequence ?
        // The hierarchy is Collection -> DnaComponent -> DnaSequence
        var top = [];
        var topName = "";
        if ( json["RDF"]["Collection"] !== undefined) {
            topName = "Collection";

            if (json["RDF"]["Collection"] === "HASH") {
                //top = {
                //    "Collection" : this.collectionXmlToJson(json["RDF"]["Collection"])
                //}
            }

            if (json["RDF"]["Collection_asArray"] !== undefined) {
                for (i = 0; i < json["RDF"]["Collection_asArray"].length; i++) {
                    top.push(
                        this.parseRawCollection(json["RDF"]["Collection_asArray"][i])
                    );
                }
            }

        } else if ( json["RDF"]["DnaComponent"] !== undefined) {
            topName = "DnaComponent";
            if (json["RDF"]["DnaComponent_asArray"] !== undefined) {
                top = [];
                for (i = 0; i < json["RDF"]["DnaComponent_asArray"].length; i++) {
                    top.push(
                        this.parseRawDnaComponent(json["RDF"]["DnaComponent_asArray"][i])
                    );
                }
            }

        } else if ( json["RDF"]["DnaSequence"] !== undefined) {
            topName = "DnaSequence";
            if (json["RDF"]["DnaSequence_asArray"] !== undefined) {
                top = [];
                for (i = 0; i < json["RDF"]["DnaSequence_asArray"].length; i++) {
                    top.push(
                        this.parseRawDnaSequence(json["RDF"]["DnaSequence_asArray"][i])
                    );
                }
            }

        } else {
            throw Ext.create("Teselagen.bio.BioException", {
                message: "Invalid SBOL-XML file. Top level is not either a Collection, a DnaComponent, or a DnaSequence. Exiting... \n"
            });
        }





        result = {
            "RDF" : {
                "_xmlns" :       xmlns,
                "_xmlns:rdf" :   xrdf,
                "_xmlns:rdfs" :  xrdfs,
                "_xmlns:so" :    so,
                topName :       top
            }
        };

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

    parseRawCollection: function(coll) {
        console.log("blah");

        return json;

    },

    parseRawDnaComponent: function(comp) {
        //console.log(namespace);
        var result;

        // SBOL sequences are never circular
        var circ = false;

        // Other Header info
        var display_id  = comp["displayId"];
        var desc        = comp["description"];
        var primary_id  = comp["name"];

        // Name space -- direct port, not sure how to use yet
        var about         = comp["_rdf:about"];
        /*var namespace, accession_number;
        if (tmp.match(/^(.*)#(-*)/)) {
            namespace           = about.split(/^(.*)#(-*)/)[0];
            accession_number    = about.split(/^(.*)#(-*)/)[1];
        } else {
            namespace           = about.split(/^(.*)#(-*)$/)[0];
            accession_number    = about.split(/^(.*)#(-*)$/)[1];
        }*/

        result = {
            "_rdf:about":   about,
            "displayId":    display_id,
            "name":         primary_id,
            "description":  desc

        };

        // Type
        var type = comp["_rdf:type"];
        if (type !== undefined) {
            var resource = type["_rdf:resource"];
            result["rdf:type"] = {
                "_rdf:resource" : resource
            };
        }

        // Contains DnaSequence -- There should be only one or result["dnaSequence"] will be an array
        if (comp["dnaSequence"] !== undefined) {
            result["dnaSequence"] = this.parseRawDnaSequence(comp["dnaSequence"]);
        }

        // Contains SequenceAnnotation
        if (comp["annotation"] !== undefined) {
            result["annotation"] = this.parseRawSequenceAnnotation(comp["annotation"]);
        }
        return result;
    },

    parseRawDnaSequence: function(seq) {
        var result;

        var about       = seq["DnaSequence"]["_rdf:about"];
        var nucleotides = seq["DnaSequence"]["nucleotides"];


        result = {
            "DnaSequence" : {
                "_rdf:about" : about,
                "nucleotides": nucleotides
            }
        };

        return result;
    },

    parseRawSequenceAnnotation: function(annotation) {
        var result;
        var about       = annotation["_rdf:about"] || "";
        var annot       = annotation["SequenceAnnotation_asArray"];
        var seqAnnot    = [];

        for (var i=0; i < annot.length; i++) {
            //var about       = annot["_rdf:about"] || "";
            var bioStart    = parseInt(annot[i]["bioStart"]) || parseInt("");
            var bioEnd      = parseInt(annot[i]["bioEnd"]) || parseInt("");
            var strand      = annot[i]["strand"] || "+";
            
            var subComp     = this.parseRawDnaComponent(annot[i]["subComponent"]);
            console.log(annot[i]["subComponent"]);

            seqAnnot.push({
                "bioStart"      : bioStart,
                "bioEnd"        : bioEnd,
                "strand"        : strand,
                "subComponent"  : subComp
            }
            );
        }
        result = {
            "_rdf:about"            : about,
            "SequenceAnnotation"    : seqAnnot
        };
        
        return result;
    }


});