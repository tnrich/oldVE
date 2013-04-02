/**
 * Export for DeviceDesign projects to JSON and XML.
 * @class Teselagen.manager.DeviceDesignExporterManager
 * @author Rodrigo Pavez
 **/

Ext.define("Teselagen.manager.DeviceDesignExporterManager", {
    alias: "DeviceDesignExporterManager",
    singleton: true,
    requires: ["Teselagen.manager.DeviceDesignManager"],
    mixins: {
        observable: "Ext.util.Observable"
    },

    saveToFile: function(fileName, fileContent){
        var saveFile = function (name, gb) {
                var text = gb.toString();
                var filename = name;
                var bb = new BlobBuilder();
                bb.append(text);
                saveAs(bb.getBlob("text/plain;charset=utf-8"), filename);
            };

        saveFile(fileName, fileContent);
    },

    /**
     * Generate JSON Structure
     * @param {Model} DEProject.
     */
    exportToJSON: function (deproject) {
        var json = {};
        var design = deproject.getDesign();

        // Structures
        json["de:j5Collection"] = {};
        json["de:j5Collection"]["de:j5Bins"] = {};

        json["de:partVOs"] = {};
        json["de:sequenceFiles"] = {};

        json["de:eugeneRules"] = {};

        var bins = [];
        var parts = [];
        var sequences = [];
        var rules = [];

        design.getJ5Collection().bins().each(function(bin){
            //console.log(bin);
            var jsonBin = {};
            jsonBin = {};
            jsonBin["de:binName"] = bin.get("binName");
            jsonBin["de:iconID" ] = bin.get("iconID");
            jsonBin["de:direction"] = bin.get("directionForward") ? "forward" : "reverse";
            jsonBin["de:dsf"] = bin.get("dsf");
            jsonBin["de:fas"] = bin.get("fas");
            jsonBin["de:fro"] = bin.get("fro");
            jsonBin["de:extra3PrimeBps"] = bin.get("extra3PrimeBps");
            jsonBin["de:extra5PrimeBps"] = bin.get("extra5PrimeBps");

            // Parts structure
            jsonBin["de:binItems"] = {};
            jsonBin["de:binItems"]["de:partID"] = [];

            bin.parts().each(function(part){
                //console.log(part);
                jsonBin["de:binItems"]["de:partID"].push(part.get("id"));

                var sequence = part.getSequenceFile();

                // Process parts
                var jsonPart = {};

                jsonPart.id = part.get("id");
                jsonPart["de:name"] = part.get("name");
                jsonPart["de:revComp"] = part.get("revComp");
                jsonPart["de:startBP"] = part.get("genbankStartBP");
                jsonPart["de:stopBP"] = part.get("endBP");
                jsonPart["de:sequenceFileHash"] = sequence.get("hash");

                jsonPart["de:parts"] = {};
                jsonPart["de:parts"]["de:part"] = {};
                jsonPart["de:parts"]["de:part"].id = part.get("id");
                jsonPart["de:parts"]["de:part"].fas = part.get("fas");

                parts.push(jsonPart);

                // Process sequences
                var jsonSequence = {};
                jsonSequence.hash = sequence.get("hash");
                jsonSequence["de:format"] = sequence.get("sequenceFileFormat");
                jsonSequence["de:content"] = sequence.get("sequenceFileContent");
                jsonSequence["de:fileName"] = sequence.get("partSource") + ".gb";

                sequences.push(jsonSequence);
            });

            bins.push(jsonBin);
        });

        design.rules().each(function(rule){
            var jsonEugene = {};

            jsonEugene["de:name"] = rule.get("name");
            jsonEugene["de:negationOperator"] = rule.get("negationOperator");
            jsonEugene["de:operand1ID"] = rule.getOperand1().get("id");
            jsonEugene["de:compositionalOperator"] = rule.get("compositionalOperator");
            jsonEugene["de:operand2ID"] = rule.getOperand2().get("id");

            rules.push(jsonEugene);
        });

        json["de:j5Collection"]["de:j5Bins"]["de:j5Bin"] = bins;
        json["de:partVOs"]["de:partVO"] = parts;
        json["de:sequenceFiles"]["de:sequenceFile"] = sequences;
        json["de:eugeneRules"]["de:eugeneRule"] = rules;

        var fileName = deproject.get("name")+".json";
        var fileContent = JSON.stringify({"de:design":json});

        this.saveToFile(fileName,fileContent);
    }

});