
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
                message: "Invalid JbeiSeqXML file. No root or record tag 'seq'"
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

        for (var i=0; i < part.length; i++) {
            var id          = part[i]["_id"];
            var name        = part[i]["name"]["__text"];
            var revComp     = part[i]["revComp"]["__text"];
            var startBP     = part[i]["startBP"]["__text"];
            var stopBP      = part[i]["stopBP"]["__text"];
            var seqFileHash = part[i]["sequenceFileHash"]["__text"];
            var parts       = [];

            var pt = part[i]["parts"]["part_asArray"]; //NOT SURE where array will occur when ther is more than one part
            for (var j=0; j < pt.length; j++) {
                var ptId    = pt[j]["_id"];
                var fas     = pt[j]["fas"] || "";

                parts.push({
                    "id" : ptId,
                    "de:fas" : fas
                });
            }


            partVOs.push({
                "id": id,
                "de:name":      name,
                "de:revComp":   (revComp  === "true"),
                "de:startBP":   parseInt(startBP),
                "de:stopBP":    parseInt(stopBP),
                "de:sequenceFileHash": seqFileHash,
                "de:parts": {
                    "de:part": parts
                }
            });
        }

        // EugeneRules
        var eugene = {};


        // j5Collection
        var j5 = {};

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
                "de:eugeneRules" : eugene,
                "de:j5Collection" : j5
            }
        };

        return result;
     }


});