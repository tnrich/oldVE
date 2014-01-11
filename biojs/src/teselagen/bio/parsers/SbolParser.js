/**
 * @class Teselagen.bio.parsers.SbolParser
 * Converts SBOL formats.
 * Specifications for SBOL can be found at http://www.sbolstandard.org/specification/core-data-model
 *
 * The hierarcy of the components in an SBOL object is:
 *
 *          The hierarchy is Collection -> DnaComponent -> DnaSequence
 *
 * Check for each level and parse downward from there.
 *
 * @author Rodrigo Pavez
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

    convertGenbankToSBOL: function(data,cb){
            var messageBox = Ext.MessageBox.wait(
                "Converting to SBOL XML/RDF...",
                "Waiting for the server"
            );

            Ext.Ajax.request({
                url: Teselagen.manager.SessionManager.buildUrl("genbanktosbol", ''),
                params: {
                    filename: 'example.xml',
                    data: Base64.encode(data)
                },
                success: function (response) {
                    response = JSON.parse(response.responseText);
                    messageBox.close();
                    Ext.getCmp('mainAppPanel').getActiveTab().el.unmask();
                    cb(response.data,true);
                },
                failure: function(response, opts) {
                    Ext.getCmp('mainAppPanel').getActiveTab().el.unmask();
                    messageBox.close();
                    Ext.MessageBox.alert('Failed','Conversion failed');
                }
            });        
    },

    parse: function(data, cb){
        console.log("Parsing using j5");
        var self = this;

        Ext.getCmp('mainAppPanel').getActiveTab().el.unmask();

        var performOperation = function(preserveSBOL){

            var messageBox = Ext.MessageBox.wait(
                "Converting XML...",
                "Waiting for the server"
            );
            
            /*
            var task = new Ext.util.DelayedTask(function() {
                messageBox.updateProgress(100,"Done!","done");
                messageBox.close();
            });

            task.delay(5000);
            */

            Ext.Ajax.request({
                url: Teselagen.manager.SessionManager.buildUrl("sbol", ''),
                params: {
                    filename: 'example.xml',
                    data: Base64.encode(data),
                    preserveSBOL: preserveSBOL
                },
                success: function (response) {
                    response = JSON.parse(response.responseText);
                    messageBox.close();
                    Ext.getCmp('mainAppPanel').getActiveTab().el.unmask();
                    var sequenceLibrary = Ext.getCmp("sequenceLibrary");
                    if(sequenceLibrary && sequenceLibrary.el) sequenceLibrary.el.unmask();
                    cb(response.data,true);
                },
                failure: function(response, opts) {
                    Ext.getCmp('mainAppPanel').getActiveTab().el.unmask();                    
                    var sequenceLibrary = Ext.getCmp("sequenceLibrary");
                    if(sequenceLibrary && sequenceLibrary.el) sequenceLibrary.el.unmask();
                    messageBox.close();
                    Ext.MessageBox.alert('Failed','Conversion failed');
                }
            });

        };

        Ext.Msg.show({
            title: 'Alert',
            msg: "Do you want to preserve SBOL information during import process?",
            width: 300,
            buttons: Ext.Msg.YESNOCANCEL,
            buttonText: ['','Yes','No','Cancel'],
            fn: function(buttonId){
                if(buttonId==='yes')
                {
                    performOperation(true);
                }
                else if(buttonId==='no')
                {
                    performOperation(false);
                } else {
                }
            },
            icon: Ext.MessageBox.ALERT
        });

    },

    /** NOT WRITTEN NOT TESTED
     * Converts an JbeiSeqXML in string format to JSON format.
     * Use this for a cleaned version of JSON (from {@link Teselagen.bio.util.XmlToJson})
     * @param {Object} json Cleaned JSON object of the JbeiSeqXml
     * @returns {String} xml XML file in String format
     */
     jbeiseqJsonToXml: function(json) {

     },

    /**
     * Converts an SbolXML in string format to JSON format.
     * This checks for valid entries in the XML file.
     * If a required entry is not recognized, an error is thrown.
     * If a non-required entry is not recognized, a default value is used.
     * Use this for a cleaned version of JSON (from {@link Teselagen.bio.util.XmlToJson})
     * @param {String} xml Sbol XML file in String format
     * @param {String} pRootNameSpace e.g. "rdf:RDF" would have a namespace of "RDF"; Default is "RDF"
     * @returns {Object} json Cleaned JSON object of the Sbol XML
     */
    sbolXmlToJson: function(xmlStr, pRootNamespace) {
        var result = {};

        var i, j;

        var json = XmlToJson.xml_str2json(xmlStr);
        json     = this.checkRawSbolJson(json);

        var name = pRootNamespace || "RDF";

        if (json[name] === undefined) {
            throw Ext.create("Teselagen.bio.BioException", {
                message: "Invalid SBOL-XML file. No root or record tag" + name
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

        console.warn("sbolXmlToJson: Namespace used is: '" + namespace + "'. No error at this time.");

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

            console.warn("sbolXmlToJson: Collection Detected");

            if (json[name]["Collection"] === "HASH") {
                console.warn("sbolXmlToJson: Found 'HASH'. Not handling.");
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

            console.warn("sbolXmlToJson: DnaComponent Detected.");

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

            console.warn("sbolXmlToJson: DnaSequence Detected.");

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


    /** NOTE DONE && NOT TESTED
      * Checks if a structure of the XML2JSON data structure has the minimal structure requirements.
      * Inserts blank entries for entries that are needed.
      *
      * @param {Object} json a Raw SBOL-XML2JSON object
      * @returns {Object} json Repaired raw SBOL-JSON object.
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

    /** NOT WRITTEN; LAST HERE DW 2012.12_07 (last day)
     */
    sbolJsonToJbeiJson: function(json, prefix) {
        var name = json["rdf:RDF"]["DnaComponent"][0]["displayId"];
        var seq  = json["rdf:RDF"]["DnaComponent"][0]["dnaSequence"]["DnaSequence"]["nucleotides"];
        var seqHash = Teselagen.bio.util.Sha256.hex_sha256(seq);

        var circ = true; // DONT KNOW HOW TO SET YET

        var feats = json["rdf:RDF"]["DnaComponent"][0]["annotation"]["SequenceAnnotation"];

        for (var i=0; i < feats.length; i++) {
            var ft = feats[0];
        }

        var features= [];

        /*var features = {
            "seq:feature" : {
                "seq:label" : label,
                "seq:complement" : complement,
                "seq:type" : type,
                "seq:location": locations,
                "seq:attribute" : attributes //this should not be saved as a subset
            }
        };*/

        var jbei = {
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
        };

        return jbei;

    },

    /** NOT WRITTEN
     */
    jbeiJsonToSbolJson: function(json, prefix) {

    },

    /** NOT TESTED
     * Parses a Raw Collection JSON to something more readable.
     * @param {Object} coll
     * @param {String} prefix
     * @returns {Object}
     */
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

    /** NOT TESTED
     * Parses a Raw DnaComponent JSON to something more readable.
     * @param {Object} comp
     * @param {String} prefix
     * @returns {Object}
     */
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
            result["annotation"] = {"SequenceAnnotation" : [] };
            for (var i=0; i < comp["annotation_asArray"].length; i++) {
                result["annotation"]["SequenceAnnotation"].push(this.parseRawSequenceAnnotation(comp["annotation_asArray"][i], prefix));
            }
        }
        return result;
    },

    /** NOT TESTED
     * Parses a Raw RawDnaSequence JSON to something more readable.
     * @param {Object} seq
     * @param {String} prefix
     * @returns {Object}
     */
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

    /** NOT TESTED
     * Parses a Raw SequenceAnnotation JSON to something more readable.
     * @param {Object} annotation
     * @param {String} prefix
     * @returns {Object}
     */
    parseRawSequenceAnnotation: function(annotation, prefix) {
        var result = {};

        var uri         = annotation["SequenceAnnotation"]["_" + prefix + ":about"];
        var annot       = annotation["SequenceAnnotation"];//_asArray"];
        //var seqAnnot    = {};//[];

        var bioStart    = parseInt(annot["bioStart"]);
        var bioEnd      = parseInt(annot["bioEnd"]);
        var strand      = annot["strand"] || "+";
        
        // DnaComponent -- Contains Exactly 1
        var subComp     = this.parseRawDnaComponent(annot["subComponent"]["DnaComponent"], prefix);

        // Sequence Annotation -- Contains 0..*
        var precedes;
        if (annot["precedes"] !== undefined ) {
            precedes = [];
            preSeqAn = annot["precedes"]["SequenceAnnotation"];
            for (var j=0; j < preSeqAn.length; j++) {
                precedes.push(this.parseRawSequenceAnnotation(preSeqAn[j], prefix));
            }
        }

        // Fill in Result ouput
        result["_"+prefix+":about"] = uri;
        result["bioStart"]          = bioStart;
        result["bioEnd"]            = bioEnd;
        result["strand"]            = strand;
        result["subComponent"]      = subComp;
        result["precedes"]          = precedes;
        
        return result;
    }


});
