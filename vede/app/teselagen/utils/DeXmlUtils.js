/**
 * @class Teselagen.utils.DeXmlUtils
 * Converts formats for Device Editor.
 * @author Diana Wong
 */

Ext.define("Teselagen.utils.DeXmlUtils", {

    singleton: true,

    requires: [
        "Teselagen.bio.util.StringUtil",
        "Teselagen.bio.util.XmlToJson"
    ],

    constructor: function() {
        XmlToJson = Teselagen.bio.util.XmlToJson;
    },


    formatXml: function(xml) {
        var formatted = '';
        var reg = /(>)(<)(\/*)/g;
        xml = xml.replace(reg, '$1\r\n$2$3');
        var pad = 0;
        jQuery.each(xml.split('\r\n'), function(index, node) {
            var indent = 0;
            if (node.match( /.+<\/\w[^>]*>$/ )) {
                indent = 0;
            } else if (node.match( /^<\/\w/ )) {
                if (pad != 0) {
                    pad -= 1;
                }
            } else if (node.match( /^<\w[^>]*[^\/]>.*$/ )) {
                indent = 1;
            } else {
                indent = 0;
            }
     
            var padding = '';
            for (var i = 0; i < pad; i++) {
                padding += '  ';
            }
     
            formatted += padding + node + '\r\n';
            pad += indent;
        });
     
        return formatted;
    },
 
    /**
     * Converts Device Editor XML (DE-XML) into Device Editor JSON (DE-JSON) format.
     * @param {String} xmlStr DE-XML in string format
     * @returns {Object} result DE-JSON as JSON object.
     */
    deXmlToJson: function(xmlStr) {
        var result = {};

        var json = XmlToJson.xml_str2json(xmlStr);

        // make sure this file is ok
        json = this.validateRawDeJson(json);

        if (json["design"] === undefined) {
            throw Ext.create("Teselagen.bio.BioException", {
                message: "Invalid DE-XML file. No root or record tag 'design'"
            });
            //return result;
        }

        // Header Information
        var schema = json["design"]["_xsi:schemaLocation"];
        var xmlns  = json["design"]["_xmlns:de"];
        var xsi    = json["design"]["_xmlns:xsi"];
        var version = parseInt(json["design"]["version"]["__text"]);

        // SequenceFiles
        var seqFiles = [];
        var seq = json["design"]["sequenceFiles"]["sequenceFile_asArray"];
        for (var i=0; i < seq.length; i++) {
            var hash        = seq[i]["_hash"];
            var format      = seq[i]["format"]["__text"];
            var content     = seq[i]["content"]["__cdata"];
            var filename    = seq[i]["fileName"]["__text"];

            seqFiles.push({
                "hash" : hash,
                "de:format" : format,
                "de:content" : content,
                "de:fileName" : filename
            });
        }

        // PartVOs
        var partVOs = [];
        var part    = json["design"]["partVOs"]["partVO_asArray"];

        for ( i=0; i < part.length; i++) {
            var id          = parseInt(part[i]["_id"]);
            var name        = part[i]["name"]["__text"];
            var revComp     = (part[i]["revComp"]["__text"] === "true");
            var startBP     = parseInt(part[i]["startBP"]["__text"]);
            var stopBP      = parseInt(part[i]["stopBP"]["__text"]);
            var seqFileHash = part[i]["sequenceFileHash"]["__text"];
            var parts       = [];

            // ASSUMES THERE ARE MORE THAN ONE PART
            /*var pt = part[i]["parts"]["part_asArray"];
            for (var j=0; j < pt.length; j++) {
                var ptId    = parseInt(pt[j]["_id"]);
                var fas     = pt[j]["fas"]["__text"] || "";

                parts.push({
                    "id" : ptId,
                    "de:fas" : fas
                });
            }*/

            // ASSUMES ONLY ONE PART
            //var pt      = part[i]["parts"]["part"];
            var ptId    = parseInt(part[i]["parts"]["part"]["_id"]) || "";
            var fas     = part[i]["parts"]["part"]["fas"]["__text"] || "";
            parts = {
                "id": ptId,
                "de:fas": fas
            };


            partVOs.push({
                "id": id,
                "de:name":      name,
                "de:revComp":   revComp,
                "de:startBP":   startBP,
                "de:stopBP":    stopBP,
                "de:sequenceFileHash": seqFileHash,
                "de:parts": {
                    "de:part": parts
                }
            });
        }

        // EugeneRules
        var eugene  = [];
        var eug     = json["design"]["eugeneRules"]["eugeneRule_asArray"];
        //console.log(json["design"]["eugeneRules"]);

        for (i = 0; i < eug.length; i++) {
            var name    = eug[i]["name"]["__text"];
            var negOp   = (eug[i]["negationOperator"]["__text"] === "true");
            var op1ID   = parseInt(eug[i]["operand1ID"]["__text"]);
            var compOp  = eug[i]["compositionalOperator"]["__text"];
            var op2ID   = parseInt(eug[i]["operand2ID"]["__text"]);

            eugene.push({
                "de:name": name,
                "de:negationOperator": negOp,
                "de:operand1ID": op1ID,
                "de:compositionalOperator": compOp,
                "de:operand2ID": op2ID
            });
        }

        // j5Collection
        var j5Bins          = [];
        //console.log(json["design"]["j5Collection"]);
        var j5isCirc        = (json["design"]["j5Collection"]["isCircular"]["__text"] === "true");
        var j5              = json["design"]["j5Collection"]["j5Bins"]["j5Bin_asArray"];

        for (i = 0; i < j5.length; i++) {
            var binName     = j5[i]["binName"]["__text"];
            var iconID      = j5[i]["iconID"]["__text"];
            var direction   = j5[i]["direction"]["__text"];
            var dsf         = (j5[i]["dsf"]["__text"] === "true");
            var binItems    = [];

            // ASSUMES MORE thAN ONE PARTID
            var bin         = j5[i]["binItems"]["partID_asArray"];
            for (var j = 0; j < bin.length; j++) {
                binItems.push(parseInt(bin[j]["__text"]));
            }
            // ASSUMES ONE PARTID
            // J5Collection Model says this should be a string
            //binItems        = parseInt(j5[i]["binItems"]["partID"]["__text"]);

            j5Bins.push({
                "de:binName": binName,
                "de:iconID": iconID,
                "de:direction": direction,
                "de:dsf": dsf,
                "de:binItems": {
                    "de:partID": binItems
                }
            });
        }

        // Combine Components
        result = {
            "de:design" : {
                "xsi:schemaLocation" : schema,
                "xmlns:de" : xmlns,
                "xmlns:xsi" : xsi,
                "de:version" : version,
                "de:sequenceFiles" : {
                    "de:sequenceFile" : seqFiles
                },
                "de:partVOs" : {
                    "de:partVO" : partVOs
                },
                "de:eugeneRules" : {
                    "eugeneRule" : eugene
                },
                "de:j5Collection" : {
                    "de:isCircular": j5isCirc,
                    "de:j5Bins": {
                        "de:j5Bin" : j5Bins
                    }
                }
            }
        };

        return result;
     },

     /**
      * Checks if a structure of the XML2JSON data structure has the minimal structure requirements.
      * Inserts blank entries for entries that are needed.
      *
      * @param {Object} json a Raw De-XML2JSON object
      * //@returns {Boolean} isValid True if structure is good, false if missing key elements.
      * @returns {Object} json Repaired raw DE-JSON object.
      */
    validateRawDeJson: function(json) {
        //var isValid = true;
        var i, j;

        if (json["design"] === undefined) {
            throw Ext.create("Teselagen.bio.BioException", {
                message: "Invalid DE-XML file. No root or record tag 'design'"
            });
        }

        // Header
        if (json["design"]["_xsi:schemaLocation"] === undefined) {
            console.warn("validateDeXml2Json: No xsi:schemaLocation key.");
            json["design"]["_xsi:schemaLocation"] = "http://jbei.org/device_editor design.xsd";
            //isValid = false;
        }
        if (json["design"]["_xmlns:de"] === undefined) {
            console.warn("validateDeXml2Json: No xmlns:de key.");
            json["design"]["_xmlns:de"] = "http://jbei.org/device_editor";
            //isValid = false;
        }
        if (json["design"]["_xmlns:xsi"] === undefined) {
            console.warn("validateDeXml2Json: No xmlns:xsi key.");
            json["design"]["_xmlns:xsi"] = "http://www.w3.org/2001/XMLSchema-instance";
            //isValid = false;
        }
        if (json["design"]["version"]["__text"] === undefined) {
            console.warn("validateDeXml2Json: No version.");
            json["design"]["version"] = {"__text" : ""};
            //isValid = false;
        }

        // SequenceFiles
        if (json["design"]["sequenceFiles"] === undefined) {
            throw Ext.create("Teselagen.bio.BioException", {
                message: "Invalid DE-XML file. No sequence"
            });
            json["design"] = {"sequenceFiles" : {"sequenceFile_asArray" : []} };
        }
        if (json["design"]["sequenceFiles"]["sequenceFile_asArray"] === undefined) {
            throw Ext.create("Teselagen.bio.BioException", {
                message: "Invalid DE-XML file. No sequence"
            });
        }

        var seq = json["design"]["sequenceFiles"]["sequenceFile_asArray"];
        for ( i=0; i < seq.length; i++) {
            //var hash        = seq[i]["_hash"];
            //var format      = seq[i]["format"]["__text"];
            //var content     = seq[i]["content"]["__cdata"];
            //var filename    = seq[i]["fileName"]["__text"];

            if (seq[i]["_hash"] === undefined) {
                console.warn("validateDeXml2Json: No hash.");
                json["design"]["sequenceFiles"]["sequenceFile_asArray"][i] = { "_hash" : "" };
            }
            if (seq[i]["format"] === undefined) {
                console.warn("validateDeXml2Json: No format.");
                json["design"]["sequenceFiles"]["sequenceFile_asArray"][i] = {"format": { "__text" : ""}};
            }
            if (seq[i]["content"] === undefined) {
                console.warn("validateDeXml2Json: No content.");
                json["design"]["sequenceFiles"]["sequenceFile_asArray"][i] = {"content": { "__cdata" : ""}};
            }
            if (seq[i]["fileName"] === undefined) {
                console.warn("validateDeXml2Json: No fileName.");
                json["design"]["sequenceFiles"]["sequenceFile_asArray"][i] = {"fileName": { "__text" : ""}};
            }
        }
        
        // PartVOs
        if (json["design"]["partVOs"] === undefined) {
            throw Ext.create("Teselagen.bio.BioException", {
                message: "Invalid DE-XML file. No partVOs"
            });
            json["design"] = { "partVOs" : { "partVO_asArray" : [] } };
        }
        if (json["design"]["partVOs"]["partVO_asArray"] === undefined) {
            throw Ext.create("Teselagen.bio.BioException", {
                message: "Invalid DE-XML file. No partVOs array"
            });
        }

        var part    = json["design"]["partVOs"]["partVO_asArray"];
        for ( i=0; i < part.length; i++) {
            //var id          = parseInt(part[i]["_id"]);
            //var name        = part[i]["name"]["__text"];
            //var revComp     = (part[i]["revComp"]["__text"] === "true");
            //var startBP     = parseInt(part[i]["startBP"]["__text"]);
            //var stopBP      = parseInt(part[i]["stopBP"]["__text"]);
            //var seqFileHash = part[i]["sequenceFileHash"]["__text"];

            if (part[i]["_id"] === undefined) {
                console.warn("validateDeXml2Json: No part id.");
                json["design"]["partVOs"]["partVO_asArray"][i] = {"_id" : ""};
            }
            if (part[i]["name"] === undefined) {
                console.warn("validateDeXml2Json: No part name.");
                json["design"]["partVOs"]["partVO_asArray"][i] = {"name": {"__text": ""}};
            }
            if (part[i]["revComp"] === undefined) {
                console.warn("validateDeXml2Json: No part revComp.");
                json["design"]["partVOs"]["partVO_asArray"][i] = {"revComp": {"__text": ""}};
            }
            if (part[i]["startBP"] === undefined) {
                console.warn("validateDeXml2Json: No part startBP.");
                json["design"]["partVOs"]["partVO_asArray"][i] = {"startBP": {"__text": ""}};
            }
            if (part[i]["stopBP"] === undefined) {
                console.warn("validateDeXml2Json: No part stopBP.");
                json["design"]["partVOs"]["partVO_asArray"][i] = {"stopBP": {"__text": ""}};
            }
            if (part[i]["sequenceFileHash"] === undefined) {
                console.warn("validateDeXml2Json: No part sequenceFileHash.");
                json["design"]["partVOs"]["partVO_asArray"][i] = {"sequenceFileHash": {"__text": ""}};
            }

            var pt = part[i]["parts"]["part_asArray"];
            for ( j=0; j < pt.length; j++) {
                //var ptId    = parseInt(pt[j]["_id"]);
                //var fas     = pt[j]["fas"]["__text"] || "";

                if (pt[j]["_id"] === undefined) {
                    console.warn("validateDeXml2Json: No parts id.");
                    json["design"]["partVOs"]["partVO_asArray"][i]["parts"]["part_asArray"][j] = {"_id": ""};
                }
                if (pt[j]["fas"] === undefined) {
                    console.warn("validateDeXml2Json: No parts id.");
                    json["design"]["partVOs"]["partVO_asArray"][i]["parts"]["part_asArray"][j] = {"fas": {"__text": ""}};
                }
            }
        }
        
        // EugeneRules
        if (json["design"]["eugeneRules"] === undefined) {
            console.warn("validateDeXml2Json: No eugeneRules.");
            //throw Ext.create("Teselagen.bio.BioException", {
            //    message: "Invalid DE-XML file. No eugeneRules"
            //});
            json["design"] = { "eugenRules" : { "eugeneRule_asArray" : [] } };
        }
        if (json["design"]["eugeneRules"]["eugeneRule_asArray"] === undefined) {
            console.warn("validateDeXml2Json: No eugeneRules-- eugenRule_asArray.");
            json["design"]["eugeneRules"] = {"eugeneRule_asArray" : []};
            //throw Ext.create("Teselagen.bio.BioException", {
            //    message: "Invalid DE-XML file. No eugeneRule as array"
            //});

        }
        var eug     = json["design"]["eugeneRules"]["eugeneRule_asArray"];

        for (i = 0; i < eug.length; i++) {
            //var name    = eug[i]["name"]["__text"];
            //var negOp   = (eug[i]["negationOperator"]["__text"] === "true");
            //var op1ID   = parseInt(eug[i]["operand1ID"]["__text"]);
            //var compOp  = eug[i]["compositionalOperator"]["__text"];
            //var op2ID   = parseInt(eug[i]["operand2ID"]["__text"]);

            if (eug[i]["name"] === undefined) {
                console.warn("validateDeXml2Json: No eugene name.");
                json["design"]["eugeneRules"]["eugeneRule_asArray"][i] = {"name": {"__text" : ""} };
            }
            if (eug[i]["negationOperator"] === undefined) {
                console.warn("validateDeXml2Json: No eugene negationOperator.");
                json["design"]["eugeneRules"]["eugeneRule_asArray"][i] = {"negationOperator": {"__text": ""}};
            }
            if (eug[i]["operand1ID"] === undefined) {
                console.warn("validateDeXml2Json: No eugene operand1ID.");
                json["design"]["eugeneRules"]["eugeneRule_asArray"][i] = {"operand1ID": {"__text": ""}};
            }
            if (eug[i]["compositionalOperator"] === undefined) {
                console.warn("validateDeXml2Json: No eugene compositionalOperator.");
                json["design"]["eugeneRules"]["eugeneRule_asArray"][i] = {"compositionalOperator": {"__text": ""}};
            }
            if (eug[i]["operand2ID"] === undefined) {
                console.warn("validateDeXml2Json: No eugene operand2ID.");
                json["design"]["eugeneRules"]["eugeneRule_asArray"][i] = {"operand2ID": {"__text": ""}};
            }

        }
        
        // j5Collection
        if (json["design"]["j5Collection"] === undefined) {
            throw Ext.create("Teselagen.bio.BioException", {
                message: "Invalid DE-XML file. No j5Collection"
            });
        }
        if (json["design"]["j5Collection"]["j5Bins"] === undefined) {
            throw Ext.create("Teselagen.bio.BioException", {
                message: "Invalid DE-XML file. No j5Collection j5Bins"
            });
        }
        if (json["design"]["j5Collection"]["j5Bins"]["j5Bin_asArray"] === undefined) {
            throw Ext.create("Teselagen.bio.BioException", {
                message: "Invalid DE-XML file. No j5Collection-j5Bins-j5Bin as array"
            });
            json["design"]["j5Collection"]["j5Bins"] = {"j5Bin_asArray" : []};
        }
        if (json["design"]["j5Collection"]["isCircular"] === undefined) {
            console.warn("validateDeXml2Json: No j5Collection isCircular.");
            json["design"]["j5Collection"] = {"isCircular" : {"__text" : ""}};
            //isValid = false;
        }

        var j5              = json["design"]["j5Collection"]["j5Bins"]["j5Bin_asArray"];
        for (i = 0; i < j5.length; i++) {
            var binName     = j5[i]["binName"]["__text"];
            var iconID      = j5[i]["iconID"]["__text"];
            var direction   = j5[i]["direction"]["__text"];
            var dsf         = (j5[i]["dsf"]["__text"] === "true");

            if (j5[i]["binName"] === undefined) {
                console.warn("validateDeXml2Json: No j5Collection binName.");
                json["design"]["j5Collection"]["j5Bins"]["j5Bin_asArray"][i]["binName"]["__text"] = "";
            }
            if (j5[i]["iconID"] === undefined) {
                console.warn("validateDeXml2Json: No j5Collection iconID.");
                json["design"]["j5Collection"]["j5Bins"]["j5Bin_asArray"][i]["iconID"]["__text"] = "";
            }
            if (j5[i]["direction"] === undefined) {
                console.warn("validateDeXml2Json: No j5Collection direction.");
                json["design"]["j5Collection"]["j5Bins"]["j5Bin_asArray"][i]["direction"]["__text"] = "";
            }
            if (j5[i]["dsf"] === undefined) {
                console.warn("validateDeXml2Json: No j5Collection dsf.");
                json["design"]["j5Collection"]["j5Bins"]["j5Bin_asArray"][i]["dsf"]["__text"] = "";
            }
            if (j5[i]["binItems"]["partID_asArray"] === undefined) {
                console.warn("validateDeXml2Json: No j5Collection binItem PartID.");
                json["design"]["j5Collection"]["j5Bins"]["j5Bin_asArray"][i]["binItem"]["partID_asArray"] = [];
            }

            var bin         = j5[i]["binItems"]["partID_asArray"];
            for ( j = 0; j < bin.length; j++) {
                if (bin[j]["__text"] === undefined) {
                    console.warn("validateDeXml2Json: No j5Collection binItem.");
                    json["design"]["j5Collection"]["j5Bins"]["j5Bin_asArray"][i]["binItems"]["partID_asArray"][j]["__text"] = "";
                }
            }
        }
        return json;
    },


      /**
      * Validates if structure of the JSON datastructure has the minimal structure requirements.
      *
      * @param {Object} json a DE-JSON object
      * @returns {Boolean} isValid True if structure is good, false if missing key elements.
      */
    validateDeJson: function(json) {
        var isValid = false;
    }


});