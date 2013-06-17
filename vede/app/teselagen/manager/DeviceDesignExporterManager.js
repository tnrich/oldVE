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
     * Generate Object Structure
     * @param {Model} DEProject.
     * @param {Model} Callback.
     */
    generateObject: function (deproject,cb) {
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
            jsonBin["de:fas"] = (bin.get("fas") === "None") ? "" : bin.get("fas");
            jsonBin["de:fro"] = bin.get("fro");
            jsonBin["de:extra3PrimeBps"] = bin.get("extra3PrimeBps");
            jsonBin["de:extra5PrimeBps"] = bin.get("extra5PrimeBps");

            // Parts structure
            jsonBin["de:binItems"] = {};
            jsonBin["de:binItems"]["de:partID"] = [];

            bin.parts().each(function(part,partIndex){
                //console.log(part);
                jsonBin["de:binItems"]["de:partID"].push(part.internalId);

                var sequence = part.getSequenceFile();

                // Process parts
                var jsonPart = {};

                //jsonPart.id = part.get("id");
                jsonPart.id = part.internalId;
                jsonPart["de:name"] = part.get("name");
                jsonPart["de:revComp"] = part.get("revComp");
                jsonPart["de:startBP"] = part.get("genbankStartBP");
                jsonPart["de:stopBP"] = part.get("endBP");
                jsonPart["de:sequenceFileHash"] = sequence.get("hash");

                jsonPart["de:parts"] = {};
                jsonPart["de:parts"]["de:part"] = {};
                //jsonPart["de:parts"]["de:part"].id = part.get("id");
                jsonPart["de:parts"]["de:part"].id = part.internalId;
                var fas = bin.data.fases[partIndex];
                jsonPart["de:parts"]["de:part"]["de:fas"] = (fas === "None") ? "" : fas;

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
        Ext.getCmp("mainAppPanel").getActiveTab().model.getDesign().rules().clearFilter();
        design.rules().each(function(rule){
            var jsonEugene = {};
            jsonEugene["de:name"] = rule.get("name");
            jsonEugene["de:negationOperator"] = rule.get("negationOperator");
            jsonEugene["de:operand1ID"] = rule.getOperand1().internalId;
            jsonEugene["de:compositionalOperator"] = rule.get("compositionalOperator");
            jsonEugene["de:operand2ID"] = rule.getOperand2().internalId;

            rules.push(jsonEugene);
        });

        json["de:j5Collection"]["de:j5Bins"]["de:j5Bin"] = bins;
        json["de:partVOs"]["de:partVO"] = parts;
        json["de:sequenceFiles"]["de:sequenceFile"] = sequences;
        json["de:eugeneRules"]["de:eugeneRule"] = rules;

        cb(json);
    },

    /**
     * Generate JSON Structure
     * @param {Model} DEProject.
     */
    exportToJSON: function (deproject) {
        var self = this;
        this.generateObject(deproject,function(json){
            var fileName = deproject.get("name")+".json";
            var fileContent = JSON.stringify({"de:design":json});
            self.saveToFile(fileName,fileContent);
        });
    },


    /**
     * Generate XML Structure
     * @param {Model} DEProject.
     */
    exportToXML: function (deproject) {
        var self = this;
        this.generateObject(deproject,function(json){
            var fileName = deproject.get("name")+".xml";
            var namespaceURI = "http://www.teselagen.com";
            var doc = document.implementation.createDocument(namespaceURI, "de:design", null);

            var j5Collection = doc.documentElement.appendChild(doc.createElement("de:j5Collection"));
            var j5Bins = j5Collection.appendChild(doc.createElement("de:j5Bins"));

            // Bins Processing
            json["de:j5Collection"]["de:j5Bins"]["de:j5Bin"].forEach(function(bin){
                var j5Bin = j5Bins.appendChild(doc.createElement("de:j5Bin"));

                for(var prop in bin)
                {
                    if(typeof(bin[prop]) !== "object")
                    {
                        var propNode = j5Bin.appendChild(doc.createElement(prop));
                        if(bin[prop]) { propNode.textContent = bin[prop]; }
                    }
                }
                var binItems = j5Bin.appendChild(doc.createElement("de:binItems"));
                bin["de:binItems"]["de:partID"].forEach(function(partID){
                    var part = binItems.appendChild(doc.createElement("de:partID"));
                    part.textContent = partID;
                });
            });

            var partsVOs = doc.documentElement.appendChild(doc.createElement("de:partVOs"));

            // Parts Processing
            json["de:partVOs"]["de:partVO"].forEach(function(part){
                var partV0 = partsVOs.appendChild(doc.createElement("de:partVO"));

                for(var prop in part)
                {
                    if(typeof(part[prop]) !== "object" && prop !== "id")
                    {
                        var propNode = partV0.appendChild(doc.createElement(prop));
                        if(part[prop]) { propNode.textContent = part[prop]; }
                    }
                }

                partV0.setAttribute("id", part.id);

                var deParts = partV0.appendChild(doc.createElement("de:parts"));
                var dePart = deParts.appendChild(doc.createElement("de:part"));
                dePart.setAttribute("id", part["de:parts"]["de:part"].id);
                dePart.appendChild(doc.createElement("fas")).textContent = part["de:parts"]["de:part"]["de:fas"];
            });

            var sequenceFiles = doc.documentElement.appendChild(doc.createElement("de:sequenceFiles"));

            // Sequences Processing
            json["de:sequenceFiles"]["de:sequenceFile"].forEach(function(sequence){
                var sequenceFile = sequenceFiles.appendChild(doc.createElement("de:sequenceFile"));

                for(var prop in sequence)
                {
                    if(typeof(sequence[prop]) !== "object" && prop!=="hash")
                    {
                        var propNode = sequenceFile.appendChild(doc.createElement(prop));
                        if(sequence[prop]) { propNode.textContent = sequence[prop]; }
                    }

                    sequenceFile.setAttribute("hash", sequence.hash);
                }
            });

            var eugeneRules = doc.documentElement.appendChild(doc.createElement("de:eugeneRules"));

            // EugeneRules Processing
            json["de:eugeneRules"]["de:eugeneRule"].forEach(function(rule){
                var eugeneRule = eugeneRules.appendChild(doc.createElement("de:eugeneRule"));

                for(var prop in rule)
                {
                    if(typeof(rule[prop]) !== "object")
                    {
                        var propNode = eugeneRule.appendChild(doc.createElement(prop));
                        if(rule[prop]) { propNode.textContent = rule[prop]; }
                    }
                }
            });

            //var sequenceFiles = doc.documentElement.appendChild(doc.createElement("de:sequenceFiles"));
            //var sequenceFile = sequenceFiles.appendChild(doc.createElement("de:sequenceFile"));
            //sequenceFile.textContent = "hello";

            var fileContent = (new XMLSerializer()).serializeToString(doc);
            self.saveToFile(fileName,fileContent);
        });
    }
});