
/**
 * @class Teselagen.utils.DeXmlUtils
 * @author Diana Wong
 */

Ext.define("Teselagen.utils.DeXmlUtils", {


    requires: [
        "Teselagen.bio.util.StringUtil",
        "Teselagen.bio.util.XmlToJson"
    ],

    singleton: true,
    constructor: function() {
        XmlToJson = Teselagen.bio.util.XmlToJson;
    },

 
    /**
     *
     */
    deXmlToJson: function(xmlStr) {
        var result = {};

        var json = XmlToJson.xml_str2json(xmlStr);

        console.log(JSON.stringify(json, null, "  "));

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
                "de:filename" : filename
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

            var pt = part[i]["parts"]["part_asArray"]; //NOT SURE where array will occur when ther is more than one part
            for (var j=0; j < pt.length; j++) {
                var ptId    = parseInt(pt[j]["_id"]);
                var fas     = pt[j]["fas"]["__text"] || "";

                parts.push({
                    "id" : ptId,
                    "de:fas" : fas
                });
            }


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

            var bin         = j5[i]["binItems"]["partID_asArray"];
            for (var j = 0; j < bin.length; j++) {
                binItems.push(parseInt(bin[j]["__text"]));
            }

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
      * Validates if structure of the XML2JSON datastructure has the minimal structure requirements.
      *
      * @param {JSON} json a Raw De-XML2JSON object
      * @returns {Boolean} isValid True if structure is good, false if missing key elements.
      */
    validateDeXml2Json: function(json) {
        var isValid = false;

        if (json["design"] === undefined) {
            throw Ext.create("Teselagen.bio.BioException", {
                message: "Invalid DE-XML file. No root or record tag 'design'"
            });
        }

        // Header

        if (json["design"]["xsi:schemaLocation"] === undefined) {
            throw Ext.create("Teselagen.bio.BioException", {
                message: "Invalid DE-XML file. No root or record tag 'design'"
            });
        }

        if (json["design"]["xsi:schemaLocation"] === undefined) {
            console.warn("validateDeXml2Json: No xsi:schemaLocation key.");
        }
        if (json["design"]["xmlns:de"] === undefined) {
            console.warn("validateDeXml2Json: No xmlns:de key.");
        }
        if (json["design"]["xmlns:xsi"] === undefined) {
            console.warn("validateDeXml2Json: No xmlns:xsi key.");
        }
        if (json["design"]["de:version"] === undefined) {
            console.warn("validateDeXml2Json: No de:version key.");
        }
        if (json["design"]["version"]["__text"] === undefined) {
            console.warn("validateDeXml2Json: No version.");
        }

        if (json["design"]["xsi:schemaLocation"] === undefined) {
            throw Ext.create("Teselagen.bio.BioException", {
                message: "Invalid DE-XML file. No root or record tag 'design'"
            });
        }

        /*
        // SequenceFiles
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
                "de:filename" : filename
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

            var pt = part[i]["parts"]["part_asArray"]; //NOT SURE where array will occur when ther is more than one part
            for (var j=0; j < pt.length; j++) {
                var ptId    = parseInt(pt[j]["_id"]);
                var fas     = pt[j]["fas"]["__text"] || "";

                parts.push({
                    "id" : ptId,
                    "de:fas" : fas
                });
            }


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

            var bin         = j5[i]["binItems"]["partID_asArray"];
            for (var j = 0; j < bin.length; j++) {
                binItems.push(parseInt(bin[j]["__text"]));
            }

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
        */
    },


      /**
      * Validates if structure of the JSON datastructure has the minimal structure requirements.
      *
      * @param {JSON} json a DE-JSON object
      * @returns {Boolean} isValid True if structure is good, false if missing key elements.
      */
    validateDeJson: function(json) {
        var isValid = false;
    }


});