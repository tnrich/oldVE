/**
 * Parser for DeviceDesign JSON and XML.
 * @class Teselagen.manager.DeviceDesignParsersManager
 * @author Rodrigo Pavez
 **/

Ext.define("Teselagen.manager.DeviceDesignParsersManager", {
    alias: "DeviceDesignParsersManager",
    singleton: true,
    requires: ["Teselagen.manager.DeviceDesignManager"],
    mixins: {
        observable: "Ext.util.Observable"
    },


    /**
     * Generate a DeviceEditor design based in an array of Bins and eugeneRules
     * @param {Array} Array of bins (constructors).
     * @param {Array} Array of eugeneRules (constructors).
     * @param {Function} (optional) Callback with design as argument 0.
     */
    generateDesign: function (binsArray, eugeneRules, cb) {

        if(typeof(cb)==="function")
        {
            return cb(Teselagen.manager.DeviceDesignManager.createDeviceDesignFromBins(binsArray));
        }
        else
        {
            Ext.getCmp("mainAppPanel").getActiveTab().el.unmask();

            var loadDesign = this.loadDesign.bind(this, binsArray, eugeneRules);

            Ext.Msg.show({
                title: "Are you sure you want to load example?",
                msg: "WARNING: This will clear the current design. Any unsaved changes will be lost.",
                buttons: Ext.Msg.OKCANCEL,
                cls: "messageBox",
                fn: loadDesign,
                icon: Ext.Msg.QUESTION
            });
        }

    },

    /**
     * Loads a Designs
     * @param {Array} Array of Bins
     * @param {Array} Array of eugene rules
     * @param {String} Button clicked

     */
    loadDesign: function (binsArray, eugeneRules, evt) {
        if (evt === "ok") {
            var design = Teselagen.manager.DeviceDesignManager.createDeviceDesignFromBins(binsArray);
            var deproject = Ext.getCmp("mainAppPanel").getActiveTab().model;
            var deprojectId = Ext.getCmp("mainAppPanel").getActiveTab().modelId;
            deproject.setDesign(design);
            design.set("deproject_id", deprojectId);
            deproject.set("id", deprojectId);

            // Load the Eugene Rules in the Design
            for (var i = 0; i < eugeneRules.length; i++) {
                design.addToRules(eugeneRules[i]);
            }

            Vede.application.fireEvent("ReRenderDECanvas");
            Vede.application.fireEvent("checkj5Ready");

        }
    },

    /**
     * Parse a JSON DeviceEditor Design file.
     * @param {String} File input.
     * @param {Function} (optional) Callback with design as argument 0.
     */
    parseJSON: function (input,cb) {
        console.log("Parsing JSON file");
        var jsonDoc = JSON.parse(input);
        var bins = jsonDoc["de:design"]["de:j5Collection"]["de:j5Bins"]["de:j5Bin"];
        var sequences = jsonDoc["de:design"]["de:sequenceFiles"]["de:sequenceFile"];
        var binsArray = [];
        var fullPartsAssocArray = {};
        var binsCounter = bins.length;

        function getSequenceByHash(targetHash, cb) {
            // Find sequence by hash
            sequences.forEach(function (sequence) {
                if (String(sequence.hash) === String(targetHash)) { cb(sequence); }
            });
        }

        function getPartByID(targetId, cb) {
            // Return part associated to bin finding by id (internal)
            var parts = jsonDoc["de:design"]["de:partVOs"]["de:partVO"];
            parts.forEach(function (part) {
                if (String(part["de:parts"]["de:part"].id) === String(targetId)) {
                    getSequenceByHash(part["de:sequenceFileHash"], function (sequence) {
                        part.sequence = sequence;
                        cb(part);
                    });
                } else if (part["de:parts"]["de:part"] instanceof Array) {
                    // Cover the special cases in which some structures parts are inside subnodes that are array
                    if (String(part["de:parts"]["de:part"][0].id) === String(targetId)) {
                        getSequenceByHash(part["de:sequenceFileHash"], function (sequence) {
                            part.sequence = sequence;
                            cb(part);
                        });
                    }
                }
            });
        }


        // Bins Processing
        for (var indexBin in bins) {
            var bin = bins[indexBin];

            var newBin = Ext.create("Teselagen.models.J5Bin", {
                binName: bin["de:binName"],
                iconID: bin["de:iconID"],
                directionForward: (bin["de:direction"] === "forward"),
                dsf: Boolean(bin["de:dsf"])
            });

            var parts = bin["de:binItems"]["de:partID"];

            if (typeof(parts) === "number") {
                // Cover special cases in which parts are inside sub array
                parts = [];
                var itemsObj = bin["de:binItems"];
                for (var prop in itemsObj) {
                    parts.push(itemsObj[prop]);
                }
            }

            var partsCounter = parts.length;

            var tempPartsArray = [];
            for (var indexPart in parts) {
                getPartByID(parts[indexPart], function (part) {

                    // Part processing
                    var newPart = Ext.create("Teselagen.models.Part", {
                        name: part["de:name"],
                        partSource: part["de:partSource"],
                        genbankStartBP: part["de:startBP"],
                        endBP: part["de:stopBP"],
                        revComp: part["de:revComp"],
                        fas: (part["de:parts"]["de:part"]["de:fas"] === "") ? "None" : part["de:parts"]["de:part"]["de:fas"]
                    });

                    // Sequence processing
                    var newSequence = Ext.create("Teselagen.models.SequenceFile", {
                        sequenceFileContent: part.sequence["de:content"],
                        sequenceFileFormat: part.sequence["de:format"],
                        sequenceFileName: part.sequence["pj5_00001.gb"]
                    });

                    newPart.setSequenceFileModel(newSequence);

                    tempPartsArray.push(newPart);
                    fullPartsAssocArray[part.id] = newPart;

                    partsCounter--;
                    if (partsCounter === 0) {
                        newBin.addToParts(tempPartsArray);
                        binsArray.push(newBin);

                        binsCounter--;

                        if (binsCounter === 0) {

                            //Process Eugene Rules
                            var eugeneRules = jsonDoc["de:design"]["de:eugeneRules"];
                            var rulesArray = [];

                            if (eugeneRules.eugeneRule instanceof Array) {
                                // Fix special cases where empty object is create to designate no eugeneRules
                                if (eugeneRules.eugeneRule.length === 0) { eugeneRules = []; }
                            }

                            for (var ruleIndex in eugeneRules) {
                                var rule = eugeneRules[ruleIndex];
                                var operand1 = rule["de:operand1ID"];
                                var operand2 = rule["de:operand2ID"];

                                var newEugeneRule = Ext.create("Teselagen.models.EugeneRule", {
                                    name: rule["de:name"],
                                    compositionalOperator: rule["de:compositionalOperator"],
                                    negationOperator: rule["de:negationOperator"]
                                });
                                fullPartsAssocArray[operand1].save({
                                    callback: function(){
                                        newEugeneRule.setOperand1(fullPartsAssocArray[operand1]);
                                    }
                                });
                                fullPartsAssocArray[operand2].save({
                                    callback: function(){
                                        newEugeneRule.setOperand2(fullPartsAssocArray[operand2]);
                                    }
                                });

                                rulesArray.push(newEugeneRule);
                            }

                            Teselagen.manager.DeviceDesignParsersManager.generateDesign(binsArray, rulesArray, cb);
                        }
                    }
                });
            }
        }
    },

    /**
     * Parse a XML DeviceEditor Design file.
     * @param {String} File input.
     * @param {Function} (optional) Callback with design as argument 0.
     */
    parseXML: function (input, cb) {

        console.log("Parsing XML file");
        var parser = new DOMParser();
        var xmlDoc = parser.parseFromString(input, "text/xml");

        function getPartByID(targetId) {
            var parts = xmlDoc.getElementsByTagNameNS("*", "partVO");
            for (var indexPart in parts) {
                if (!parts[indexPart].nodeName) { continue; }
                var part = parts[indexPart];
                var id = part.getElementsByTagNameNS("*", "part")[0].attributes[0].value;
                if (id === targetId) { return part; }
            }
        }

        function getSequenceByID(targetHash, cb) {
            var sequences = xmlDoc.getElementsByTagNameNS("*", "sequenceFile");
            for (var sequenceindex in sequences) {
                var sequence = sequences[sequenceindex];
                if (!sequence.nodeName || typeof sequence !== "object") { continue; }
                if (String(sequence.getAttribute.hash) === String(targetHash)) { cb(sequence); }
            }
        }

        var binsArray = [];
        var fullPartsAssocArray = {};

        //var circular = Boolean(xmlDoc.getElementsByTagNameNS("*", "isCircular")[0].textContent);

        var bins = xmlDoc.getElementsByTagNameNS("*", "j5Bins")[0].getElementsByTagNameNS("*", "j5Bin");

        for (var indexBin in bins) {
            if (!bins[indexBin].nodeName) { continue; }
            var bin = bins[indexBin];
            //console.log(bin);
            var binName = bin.getElementsByTagNameNS("*", "binName")[0].textContent;
            var iconID = bin.getElementsByTagNameNS("*", "iconID")[0].textContent;
            var direction = bin.getElementsByTagNameNS("*", "direction")[0].textContent;
            var dsf = bin.getElementsByTagNameNS("*", "dsf")[0].textContent;

            var newBin = Ext.create("Teselagen.models.J5Bin", {
                binName: binName,
                iconID: iconID,
                directionForward: direction,
                dsf: (dsf === "true") ? true : false
            });

            var parts = bin.getElementsByTagNameNS("*", "partID");

            var tempPartsArray = [];
            for (var indexPart in parts) {
                if (!parts[indexPart].nodeName) { continue; }
                var part = getPartByID(parts[indexPart].textContent);
                var fas = part.getElementsByTagNameNS("*", "parts")[0].getElementsByTagNameNS("*", "part")[0].getElementsByTagNameNS("*", "fas")[0].textContent;
                var hash = part.getElementsByTagNameNS("*", "sequenceFileHash")[0].textContent;
                var newPart = Ext.create("Teselagen.models.Part", {
                    name: part.getElementsByTagNameNS("*", "name")[0].textContent,
                    genbankStartBP: part.getElementsByTagNameNS("*", "startBP")[0].textContent,
                    endBP: part.getElementsByTagNameNS("*", "stopBP")[0].textContent,
                    revComp: part.getElementsByTagNameNS("*", "revComp")[0].textContent,
                    fas: (fas === "") ? "None" : fas
                });

                getSequenceByID(hash, function (sequence) {
                    // Sequence processing
                    var newSequence = Ext.create("Teselagen.models.SequenceFile", {
                        sequenceFileContent: sequence.getElementsByTagNameNS("*", "content")[0].textContent,
                        sequenceFileFormat: sequence.getElementsByTagNameNS("*", "format")[0].textContent,
                        sequenceFileName: sequence.getElementsByTagNameNS("*", "fileName")[0].textContent
                    });

                    newPart.setSequenceFileModel(newSequence);
                });

                tempPartsArray.push(newPart);
                fullPartsAssocArray[part.getAttribute("id")] = newPart;
            }
            newBin.addToParts(tempPartsArray);
            binsArray.push(newBin);
        }

        var eugeneRules = xmlDoc.getElementsByTagNameNS("*", "eugeneRules")[0].getElementsByTagNameNS("*", "eugeneRule");
        var rulesArray = [];

        for (var i = 0; i < eugeneRules.length; i++) {
            var rule = eugeneRules[i];
            if (typeof(rule) !== "object") { continue; }
            var operand1 = rule.getElementsByTagNameNS("*", "operand1ID")[0].textContent;
            var operand2 = rule.getElementsByTagNameNS("*", "operand2ID")[0].textContent;

            var newEugeneRule = Ext.create("Teselagen.models.EugeneRule", {
                name: rule.getElementsByTagNameNS("*", "name")[0].textContent,
                compositionalOperator: rule.getElementsByTagNameNS("*", "compositionalOperator")[0].textContent,
                negationOperator: rule.getElementsByTagNameNS("*", "negationOperator")[0].textContent
            });

            newEugeneRule.setOperand1(fullPartsAssocArray[operand1]);
            newEugeneRule.setOperand2(fullPartsAssocArray[operand2]);
            rulesArray.push(newEugeneRule);

        }
        Teselagen.manager.DeviceDesignParsersManager.generateDesign(binsArray, rulesArray, cb);
    }

});