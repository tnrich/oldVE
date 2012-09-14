
/**
 * @class Teselagen.bio.parsers.SbolParser
 * Converts SBOL formats.
 * @author Diana Wong
 */

Ext.define("Teselagen.bio.parsers.SbolParser", {


    requires: [
        "Teselagen.bio.util.StringUtil",
        "Teselagen.bio.util.XmlToJson"
    ],

    singleton: true,

    constructor: function() {
        XmlToJson = Teselagen.bio.util.XmlToJson;
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

        var json = XmlToJson.xml_str2json(xmlStr);

        json     = this.checkRawSbolJson(json);

        if (json["RDF"] === undefined) {
            throw Ext.create("Teselagen.bio.BioException", {
                message: "Invalid SBOL-XML file. No root or record tag 'RDF'"
            });
        }

        // Header Information
        var rdf     = json["RDF"]["__prefix"]; //use a variable for the prefix
        var xmlns   = json["RDF"]["_xmlns"];
        var xrdf    = json["RDF"]["_xmlns:rdf"];
        var xrdfs   = json["RDF"]["_xmlns:rdfs"];
        var so      = json["RDF"]["_xmlns:so"];

        // Check Top Level: Collection || DnaComponent || DnaSequence ?

        if ( json["RDF"]["Collection"] !== undefined) {

        } else if ( json["RDF"]["DnaComponent"] !== undefined) {

        } else if ( json["RDF"]["DnaSequence"] !== undefined) {

        }





        result = {
            "RDF" : {
                "xmlns" :       xmlns,
                "xmlns:rdf" :   xrdf,
                "xmlns:rdfs" :  xrdfs,
                "xmlns:so" :    so
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

        if (json["RDF"]["Collection"] === undefined) {
            json["RDF"] = { "Collection" : [] };
        }

        return json;
    }


});