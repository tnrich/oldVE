/**
 * Parser for DeviceDesign JSON and XML.
 * @class Teselagen.manager.DeviceDesignParsersManager
 * @author Rodrigo Pavez
 **/

Ext.define("Teselagen.manager.DeviceDesignParsersManager", {
    alias: "DeviceDesignParsersManager",
    singleton: true,
    requires: ["Teselagen.manager.DeviceDesignManager","Teselagen.constants.SBOLIcons",
               "Teselagen.event.DeviceEvent",
               "Teselagen.utils.FormatUtils"],
    mixins: {
        observable: "Ext.util.Observable"
    },

    /**
     * Check XmlDoc for XML4.0 iconIDreferences and update to new XMl4.1 standard
     * @param {xmldoc} XmlDOC.
     */
    auto_migrate_XML4_to4_1: function(xmlDoc){

        var bins = xmlDoc.getElementsByTagNameNS("*", "j5Bins")[0].getElementsByTagNameNS("*", "j5Bin");
        for (var i=0; i < bins.length; i++) {
            if (!bins[i].nodeName) { continue; }
            var bin = bins[i];
            var iconID = bin.getElementsByTagNameNS("*", "iconID")[0].textContent.toUpperCase();
            if(!Teselagen.constants.SBOLIcons.ICONS[iconID])
            {
                bin.getElementsByTagNameNS("*", "iconID")[0].textContent = Teselagen.constants.SBOLIcons.ICONS_4_TO_4_1_UPDATE[iconID.toUpperCase()];
            }
        }

        return xmlDoc;
    },

    /**
    /**
     * Check JSONDoc for JSON4.0 iconIDreferences and update to new JSON4.1 standard
     * @param {JSONdoc} JSONDOC.
     */
    auto_migrate_JSON4_to4_1: function(jsonDoc){
        var bins = jsonDoc["de:design"]["de:j5Collection"]["de:j5Bins"]["de:j5Bin"];
        bins.forEach(function(bin){
            var iconID = bin["de:iconID"].toUpperCase();
            if(!Teselagen.constants.SBOLIcons.ICONS[iconID])
            {
                bin["de:iconID"] = Teselagen.constants.SBOLIcons.ICONS_4_TO_4_1_UPDATE[iconID.toUpperCase()];
            }
        });
        return jsonDoc;
    },

    /**
     * Generate a DeviceEditor design based in an array of Bins and eugeneRules
     * @param {Array} Array of bins (constructors).
     * @param {Array} Array of parts (constructors).
     * @param {Function} (optional) Callback with design as argument 0.
     */
    generateDesign: function (binsArray, partsArray, eugeneRules, cb) {
        Teselagen.manager.GridManager.selectedGridPart = null;
        Teselagen.manager.GridManager.selectedGridBin = null;

        var next = this.backgroundSequenceProcessing(partsArray);

        if(next[0]==true) {
            if(typeof(cb)==="function")
            {
                return cb(Teselagen.manager.DeviceDesignManager.createDeviceDesignFromBinsAndParts(binsArray, partsArray));
            }
            else
            {
                Ext.getCmp("mainAppPanel").getActiveTab().el.unmask();

                var loadDesign = this.loadDesign.bind(this, binsArray, partsArray, eugeneRules);

                Ext.Msg.show({
                    title: "Are you sure you want to load example?",
                    msg: "WARNING: This will clear the current design. Any unsaved changes will be lost.",
                    buttons: Ext.Msg.OKCANCEL,
                    cls: "messageBox",
                    fn: loadDesign,
                    icon: Ext.Msg.QUESTION
                });
            }
        } else {
            Ext.getCmp("mainAppPanel").getActiveTab().el.unmask();

             Ext.MessageBox.show({
                title: "Error",
                msg: 'Multiple parts in this design have associated source sequences named "' + next[1] + '" which are not identical. Please check the parts and their sequences and try again.',
                buttons: Ext.MessageBox.OK,
                icon:Ext.MessageBox.ERROR
            });
        }
    },

    /**
     * Loads a Designs
     * @param {Array} Array of Bins
     * @param {Array} Array of eugene rules
     * @param {String} Button clicked

     */
    loadDesign: function (binsArray, partsArray, eugeneRules, evt) {
        if (evt === "ok") {
            var gridManager = Teselagen.manager.GridManager;

            gridManager.setListenersEnabled(false);

            var existingDesign = Ext.getCmp("mainAppPanel").getActiveTab().model;
            var design = Teselagen.manager.DeviceDesignManager.clearDesignAndAddBinsAndPartsAndRules(existingDesign,binsArray,partsArray,eugeneRules);

            Ext.getCmp("mainAppPanel").getActiveTab().model = design;

            // Load the Eugene Rules in the Design
            //design.rules().add(eugeneRules);
            /*for (var i = 0; i < eugeneRules.length; i++) {
                design.addToRules(eugeneRules[i]);
            }*/

            Vede.application.fireEvent(Teselagen.event.DeviceEvent.RERENDER_DE_CANVAS);
            gridManager.setListenersEnabled(true);

            Vede.application.fireEvent(Teselagen.event.DeviceEvent.SAVE_DESIGN);
            //Vede.application.fireEvent(Teselagen.event.DeviceEvent.SAVE_DESIGN);
        }
    },

    /**
     * Parse a JSON DeviceEditor Design file.
     * @param {String} File input.
     * @param {Function} (optional) Callback with design as argument 0.
     */
    parseJSON: function (input,cb) {
        var jsonDoc = JSON.parse(input);
        jsonDoc = this.auto_migrate_JSON4_to4_1(jsonDoc);

        var bins = jsonDoc["de:design"]["de:j5Collection"]["de:j5Bins"]["de:j5Bin"];
        var parts = jsonDoc["de:design"]["de:partVOs"]["de:partVO"];
        var sequences = jsonDoc["de:design"]["de:sequenceFiles"]["de:sequenceFile"];

        var binsArray = [];
        var partsArray = [];
        var rulesArray = [];
        var fullPartsAssocArray = {};

        function getSequenceByHash(targetHash, part, cb) {
            // Find sequence by hash
            var found = false;
            sequences.forEach(function (sequence) {
                if (String(sequence.hash) === String(targetHash) && !found) {
                    found = true;
                    part.sequence = sequence;
                    return cb(part);
                }
            });
        }

        // Parts Processing
        for (var i=0; i<parts.length; i++) {
            var part = parts[i];
            var partId;
            if (part["de:parts"]["de:part"] instanceof Array) {
                // Cover the special cases in which some structures parts are inside subnodes that are array
                partId = part["de:parts"]["de:part"][0].id;
            } else {
                partId = part["de:parts"]["de:part"].id;
            }

            getSequenceByHash(part["de:sequenceFileHash"], part, function(part) {
                var newPart = Ext.create("Teselagen.models.Part", {
                    //id: partId,
                    name: part["de:name"],
                    partSource: part["de:partSource"],
                    genbankStartBP: part["de:startBP"],
                    endBP: part["de:stopBP"],
                    revComp: part["de:revComp"],
                });
                newPart.fas = part["de:parts"]["de:part"]["de:fas"] || "None";
                newPart.set("project_id",Teselagen.manager.ProjectManager.workingProject.data.id);

                var partName;
                partName = part.sequence.name;
                if(part.sequence["de:fileName"]) {partName = part.sequence["de:fileName"].replace(".gb","");}
                if(newPart.get("partSource")===""&&!newPart.get("partSource")) {newPart.set("partSource",partName);}
                // Sequence processing

                var newSequence = Ext.create("Teselagen.models.SequenceFile", {
                    name: partName,
                    sequenceFileContent: part.sequence["de:content"],
                    sequenceFileFormat: part.sequence["de:format"],
                    sequenceFileName: part.sequence["de:fileName"]
                });

                newSequence.set("project_id",Teselagen.manager.ProjectManager.workingProject.data.id);

                newPart.setSequenceFile(newSequence);

                fullPartsAssocArray[partId] = newPart;
                partsArray.push(newPart);
            });

        }

        // Check the fas scheme
        var isNewFasScheme = bins[0]["de:binItems"]["de:fas"] !== undefined;

        // Bins Processing
        for (var i=0; i<bins.length; i++) {
            var bin = bins[i];

            if(!Teselagen.constants.SBOLIcons.ICONS[bin["de:iconID"].toUpperCase()]) { console.warn(bin["de:iconID"]); console.warn("Invalid iconID"); }

            var newBin = Ext.create("Teselagen.models.J5Bin", {
                binName: bin["de:binName"],
                iconID: bin["de:iconID"].toUpperCase(),
                directionForward: (bin["de:direction"] === "forward"),
                dsf: Boolean(bin["de:dsf"])
            });

            var binParts = bin["de:binItems"]["de:partID"];

            if (typeof(binParts) === "number") {
                // Cover special cases in which parts are inside sub array
                binParts = [];
                var itemsObj = bin["de:binItems"];
                for (var prop in itemsObj) {
                    if (itemsObj.hasOwnProperty(prop)) {
                        binParts.push(itemsObj[prop]);
                    }
                }
            }

            var cellFases;
            cellFases = bin["de:binItems"]["de:fas"];

            var temCellsArray = [];
            for (var j=0; j<binParts.length; j++) {
                var assocPart = fullPartsAssocArray[binParts[j]];
                var cellFas;
                if(isNewFasScheme) cellFas = cellFases[j];
                else cellFas = assocPart ? assocPart.fas : "None";
                var newCell = Ext.create("Teselagen.models.Cell", {
                    index: j,
                    //part_id: binParts[j],
                    fas: cellFas
                });
                newCell.setPart(assocPart);
                newCell.setJ5Bin(newBin);
                temCellsArray.push(newCell);
            }

            newBin.cells().removeAll();
            newBin.cells().insert(0, temCellsArray);
            binsArray.push(newBin);
        }


        if(typeof(cb) !== "function" ) { // Not parsing eugeneRules in tests

            //Process Eugene Rules
            var eugeneRules = jsonDoc["de:design"]["de:eugeneRules"];

            // Fix for issue caused by designs with eugeneRules not defined within array structures
            if (eugeneRules["de:eugeneRule"] instanceof Array) {
                eugeneRules = eugeneRules["de:eugeneRule"];
            }

            if (eugeneRules.eugeneRule instanceof Array) {
                if(eugeneRules.eugeneRule.length === 0) {
                    eugeneRules = [];
                }
            }

            //if(eugeneRules.length === 0) { console.log("No eugenes rules found"); }
            //else { console.log("Eugene rules found."); }

            for (var k=0; k < eugeneRules.length; k++) {
                var rule = eugeneRules[k];
                var operand1 = fullPartsAssocArray[rule["de:operand1ID"]];
                var operand2;
                if(rule["de:operand2isNumber"]===true) operand2 = rule["de:operand2Number"];
                else operand2 = fullPartsAssocArray[rule["de:operand2ID"]];

                var newEugeneRule = Ext.create("Teselagen.models.EugeneRule", {
                    name: rule["de:name"],
                    compositionalOperator: rule["de:compositionalOperator"],
                    negationOperator: rule["de:negationOperator"]
                });
                newEugeneRule.setOperand1(operand1);
                newEugeneRule.setOperand2(operand2);
                rulesArray.push(newEugeneRule);
                /*if(fullPartsAssocArray[operand1]) {
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
                        callback: function() {
                            newEugeneRule.setOperand2(fullPartsAssocArray[operand2]);
                        }
                    });
                    rulesArray.push(newEugeneRule);
                } else {
                    //console.warn("Eugene rule possible not loaded");
                }*/
            }
        }

        //var devDes = Teselagen.manager.DeviceDesignManager.createDeviceDesignFromBinsAndParts(binsArray, partsArray);
        Teselagen.manager.DeviceDesignParsersManager.generateDesign(binsArray, partsArray, rulesArray, cb);     
    },

    /**
     * Parse a XML DeviceEditor Design file.
     * @param {String} File input.
     * @param {Function} (optional) Callback with design as argument 0.
     */
    parseXML: function (input, cb) {
        var me = this;
        var i,j, part, newPart;

        var parser = new DOMParser();
        var xmlDoc = parser.parseFromString(input, "text/xml");
        xmlDoc = this.auto_migrate_XML4_to4_1(xmlDoc);

        // Build part Index

        var partIndex = [];
        var parts = xmlDoc.getElementsByTagNameNS("*", "partVO");
        for (i=0; i < parts.length; i++) {
            if (!parts[i].nodeName) { continue; }

            part = parts[i];
            partIndex.push(part);
            var instances = part.getElementsByTagNameNS("*", "parts")[0].getElementsByTagNameNS("*", "part");

            for (j=0; j < instances.length; j++)
            {
                if (!instances[j].nodeName) { continue; }
                newPart = part.cloneNode(true);
                newPart.setAttribute("id", instances[j].getAttribute("id"));
                newPart.appendChild(xmlDoc.createElement("de:fas")).textContent = instances[j].getElementsByTagNameNS("*","fas")[0].textContent;
                partIndex.push(newPart);
            }
        }


        function getPartByID(targetId) {
            var partfound = false;
            var parts = xmlDoc.getElementsByTagNameNS("*", "partVO");
            for (var i=0; i < parts.length; i++) {
                if (!parts[i].nodeName) { continue; }
                var part = parts[i];
                var id = part.getElementsByTagNameNS("*", "part")[0].attributes[0].value;
                if (id === targetId) {
                    partfound = true;
                    return {
                        "part":part,
                        "linked":false
                        };
                }

                var instances = part.getElementsByTagNameNS("*", "parts")[0].getElementsByTagNameNS("*", "part");

                for (var j=0; j < instances.length; j++)
                {
                    if (!instances[j].nodeName) { continue; }
                    if ( instances[j].getAttribute("id") === targetId )
                    {
                        partfound = true;
                        return {
                            "part":part,
                            "linked":true,
                            "fas":instances[j].getElementsByTagNameNS("*","fas")[0].textContent
                        };
                    }
                    //var newPart = part.cloneNode(true);
                    //newPart.setAttribute("id", instances[instanceIndex].getAttribute("id"));
                    //newPart.appendChild(xmlDoc.createElement("de:fas")).textContent = instances[instanceIndex].getElementsByTagNameNS("*","fas")[0].textContent;
                }

            }
        }

        function getSequenceByID(targetHash, cb) {
            var found = false;
            var sequences = xmlDoc.getElementsByTagNameNS("*", "sequenceFile");
            for (var i=0; i < sequences.length; i++) {
                var sequence = sequences[i];
                if (!sequence.nodeName || typeof sequence !== "object") { continue; }
                if (String(sequence.getAttribute("hash")) === String(targetHash) && !found ) { cb(sequence); }
            }
        }

        var binsArray = [];
        var fullPartsAssocArray = {};

        //var circular = Boolean(xmlDoc.getElementsByTagNameNS("*", "isCircular")[0].textContent);

        var bins = xmlDoc.getElementsByTagNameNS("*", "j5Bins")[0].getElementsByTagNameNS("*", "j5Bin");

        for (i = 0;  i < bins.length; i++) {
            if (!bins[i].nodeName) { continue; }
            var bin = bins[i];
            var binName = bin.getElementsByTagNameNS("*", "binName")[0].textContent;
            var iconID = bin.getElementsByTagNameNS("*", "iconID")[0].textContent;
            var direction = (bin.getElementsByTagNameNS("*", "direction")[0].textContent === "forward");
            var dsf = (this.getTagText(bin, "dsf").toLowerCase() === "true");
            var fro = this.getTagText(bin, "fro");
            var extra3PrimeBps = this.getTagText(bin, "extra3PrimeBps");
            var extra5PrimeBps = this.getTagText(bin, "extra5PrimeBps");

            if(!Teselagen.constants.SBOLIcons.ICONS[iconID.toUpperCase()]) { 
                console.warn(iconID); console.warn("Invalid iconID"); 
            }

            var newBin = Ext.create("Teselagen.models.J5Bin", {
                binName: binName,
                iconID: iconID,
                directionForward: direction,
                dsf: dsf ? true : false,
                fro: fro,
                extra3PrimeBps: extra3PrimeBps,
                extra5PrimeBps: extra5PrimeBps
            });

            parts = bin.getElementsByTagNameNS("*", "partID");

            var tempPartsArray = [];
            var delayedLinkedPartsLookup = [];
            var binFases = [];

            for (j = 0; j < parts.length; j++) {
                if(parts[j].textContent) {
                    var partLookup = getPartByID(parts[j].textContent);

                    if (!parts[j].nodeName) { 
                        continue; 
                    }

                    part = partLookup.part;

                    if(partLookup.linked) {

                        var newCell = Ext.create("Teselagen.models.Cell", {
                            index: j,
                            fas: partLookup.fas || "None"
                        });

                        delayedLinkedPartsLookup.push({"position":tempPartsArray.length,"part":part,"fas":partLookup.fas,"cell":newCell});

                        newCell.setJ5Bin(newBin);

                        newBin.cells().add(newCell);
                    } else {
                        var fas = part.getElementsByTagNameNS("*", "parts")[0].getElementsByTagNameNS("*", "part")[0].getElementsByTagNameNS("*", "fas")[0].textContent;
                        var hash = part.getElementsByTagNameNS("*", "sequenceFileHash")[0].textContent;
                        var name = this.getTagText(part, "name");
                        var startBP = this.getTagText(part, "startBP");
                        var endBP = this.getTagText(part, "stopBP");
                        var revComp = (this.getTagText(part, "revComp")==="true");

                        newPart = Ext.create("Teselagen.models.Part", {
                            name: name,
                            genbankStartBP: startBP,
                            endBP: endBP,
                            revComp: revComp,
                        });

                        getSequenceByID(hash, function (sequence) {

                            var ext = me.getTagText(sequence, "fileName").match(/^.*\.(genbank|gb|fas|fasta|xml|json|rdf)$/i);

                            if(ext) {
                                var processSequence = Teselagen.bio.parsers.ParsersManager.parseSequence(sequence.getElementsByTagNameNS("*", "content")[0].textContent, ext[1], function(gb) {
                                    Teselagen.bio.parsers.ParsersManager.createAndProcessSequenceFromGenbank(gb, name, function(err, sequence, sequenceManager, gb) {
                                        if(err) {
                                            return err;
                                        }

                                        var newSequence = Ext.create("Teselagen.models.SequenceFile", {
                                            sequenceFileContent: gb.toString(),
                                            sequenceFileFormat: "GENBANK",
                                            sequenceFileName: sequence.fileName,
                                            name: sequence.name
                                        });

                                        newSequence.set("project_id",Teselagen.manager.ProjectManager.workingProject.data.id);

                                        newPart.setSequenceFile(newSequence);
                                    
                                        var newCell = Ext.create("Teselagen.models.Cell", {
                                            index: j,
                                            fas: fas || "None"
                                        });

                                        newCell.setPart(newPart);
                                        newCell.setJ5Bin(newBin);

                                        newBin.cells().add(newCell);

                                        tempPartsArray.push(newPart);
                                        fullPartsAssocArray[part.getAttribute("id")] = newPart;
                                    });
                                });
                            } else {
                                var newSequence = Ext.create("Teselagen.models.SequenceFile", {
                                    sequenceFileContent: sequence.getElementsByTagNameNS("*", "content")[0].textContent,
                                    sequenceFileFormat: sequence.getElementsByTagNameNS("*", "format")[0].textContent,
                                    sequenceFileName: me.getTagText(sequence, "fileName"),
                                    name: me.getTagText(sequence, "fileName")
                                });

                                newSequence.set("project_id",Teselagen.manager.ProjectManager.workingProject.data.id);
                                //newSequence.set("name",newPart.get("name"));

                                newPart.setSequenceFile(newSequence);

                                var newCell = Ext.create("Teselagen.models.Cell", {
                                    index: j,
                                    fas: fas || "None"
                                });

                                newCell.setPart(newPart);
                                newCell.setJ5Bin(newBin);

                                newBin.cells().add(newCell);

                                tempPartsArray.push(newPart);
                                fullPartsAssocArray[part.getAttribute("id")] = newPart;
                            }
                        });
                    }
                }
            }

            console.log("delayedLinkedPartsLookup is:" + delayedLinkedPartsLookup);

            for(var k = 0; k < delayedLinkedPartsLookup.length; k++) {
                var delayed = delayedLinkedPartsLookup[k];
                var originalPart = fullPartsAssocArray[delayed.part.getAttribute("id")];
                if(originalPart)
                {
                    tempPartsArray.splice(delayed.position,0,originalPart);
                    fullPartsAssocArray[delayed.part.getAttribute("id")] = originalPart;
                    delayed["cell"].setPart(originalPart);
                }
                else
                {
                    console.log("Part not linked!");
                }
            }

            //newBin.addToParts(tempPartsArray);
            //newBin.set("fases",binFases);
            binsArray.push(newBin);
        }

        var eugeneRules = xmlDoc.getElementsByTagNameNS("*", "eugeneRules")[0].getElementsByTagNameNS("*", "eugeneRule");
        var rulesArray = [];

        for (i = 0; i < eugeneRules.length; i++) {
            var rule = eugeneRules[i];
            if (typeof(rule) !== "object") { continue; }
            var operand1 = rule.getElementsByTagNameNS("*", "operand1ID")[0].textContent;

            var operand2isNumber = false;
            var operand2Node = rule.getElementsByTagNameNS("*", "operand2ID")[0];
            var operand2;
            if(!operand2Node)
            {
                // operand2Node might be a number
                operand2Node = rule.getElementsByTagNameNS("*", "operand2Number")[0];
                operand2 = parseInt( operand2Node.textContent );
                operand2isNumber = true;
            }
            else {operand2 = operand2Node.textContent;}

            var newEugeneRule = Ext.create("Teselagen.models.EugeneRule", {
                name: rule.getElementsByTagNameNS("*", "name")[0].textContent,
                compositionalOperator: rule.getElementsByTagNameNS("*", "compositionalOperator")[0].textContent,
                negationOperator: rule.getElementsByTagNameNS("*", "negationOperator")[0].textContent,
                operand2isNumber: operand2isNumber
            });

            newEugeneRule.setOperand1(fullPartsAssocArray[operand1]);
            
            console.log(operand2isNumber);
            if( operand2isNumber ) {
                newEugeneRule.setOperand2(operand2);
            } else {
                newEugeneRule.setOperand2(fullPartsAssocArray[operand2]);
            }

            rulesArray.push(newEugeneRule);
        }

        var partsArray = [];

        for(var key in fullPartsAssocArray) {
            partsArray.push(fullPartsAssocArray[key]);
        }

        this.generateDesign(binsArray, partsArray, rulesArray, cb);
    },

    parseEugeneRules: function(content,filename,design){


        design.rules().clearFilter(true);
        // Existing rules
        var existingRules = design.rules();

        // Build part Index

        var partIndex = {};

        design.parts().each(function (part) {
            partIndex[part.get("name")] = part;
        });

        var lines = content.split("\n");
        var newRule, newEugeneRule;
        var operand2;

        var parsedRules = [];//Ext.create("Ext.data.Store", { model: "Teselagen.models.EugeneRule" });


        var conflictRules = [];
        var newRules = Ext.create("Ext.data.Store", { model: "Teselagen.models.EugeneRule" });
        var ignoredLines = [];
        var repeatedRules = [];


        lines.forEach(function(line)
        {
            if(line!=="")
            {
                var commentLine = false;
                var notfoundPart = false;

                newRule = {
                    operand1_id: "",
                    operand2_id: "",
                    negationOperator: "",
                    name: "",
                    compositionalOperator: "",
                    operand2Number: 0,
                    operand2isNumber: false
                };

                var parsed = line.match(/Rule (.+)\((NOT|) (.+) (.+) (.+)\);/);
                if(!parsed) {parsed = line.match(/Rule (.+)\((.+) (.+) (.+)\);/);}
                if(!parsed)
                {
                    parsed = line.match(/\/\//);
                    commentLine = true;
                }
                if(!parsed) {throw new Error("Invalid eugene rule line");}

                if(parsed.length===6)
                {
                    newRule.name = parsed[1];
                    newRule.negationOperator = parsed[2];
                    newRule.operand1 = partIndex[parsed[3]];
                    newRule.compositionalOperator = parsed[4];
                    //newRule.operand2 = partIndex[parsed[5]];

                    operand2 = parsed[5];
                    if( isNaN ( parseInt( operand2 ) ) )
                    {
                        // Operand 2 is a part
                        newRule.operand2 = partIndex[operand2];
                        newRule.operand2isNumber = false;
                        if(operand2 && !newRule.operand2) {notfoundPart = true;}
                    }
                    else
                    {
                        // Operand 2 is a number
                        newRule.operand2Number = operand2;
                        newRule.operand2isNumber = true;
                    }

                }
                else if(parsed.length===5)
                {
                    newRule.name = parsed[1];
                    //newRule.negationOperator = parsed[2];
                    newRule.operand1 = partIndex[parsed[2]];
                    newRule.compositionalOperator = parsed[3];

                    operand2 = parsed[4];
                    if( isNaN ( parseInt( operand2 ) ) )
                    {
                        // Operand 2 is a part
                        newRule.operand2 = partIndex[operand2];
                        newRule.operand2isNumber = false;
                        if(operand2 && !newRule.operand2) {notfoundPart = true;}
                    }
                    else
                    {
                        // Operand 2 is a number
                        newRule.operand2Number = operand2;
                        newRule.operand2isNumber = true;

                    }
                }
                else if(commentLine)
                {
                    ignoredLines.push({"originalRuleLine":line});
                }
                else {throw new Error("Invalid eugene rule line");}

                if(notfoundPart) {ignoredLines.push({"originalRuleLine":line});}

                if(!commentLine && !notfoundPart)
                {
                    var unsupported = false;

                    try {
                    newEugeneRule = Ext.create("Teselagen.models.EugeneRule", {
                        name: newRule.name,
                        compositionalOperator: Teselagen.utils.FormatUtils.convertEugeneRule(newRule.compositionalOperator).compOp,
                        negationOperator: Teselagen.utils.FormatUtils.convertEugeneRule(newRule.negationOperator).negOp,
                        originalRuleLine: line
                    });
                    }
                    catch(e)
                    {
                        if( e.message.match( /Illegal CompositionalOperator/ ) )
                        {
                            //console.log("Unsupported operator");
                            unsupported = true;
                            ignoredLines.push({"originalRuleLine":line});
                        }
                        else
                        {
                            throw new Error("Error while processing eugeneRules");
                        }
                    }

                    if(!unsupported)
                    {
                        newEugeneRule.setOperand1(newRule.operand1);
                        if(!newRule.operand2isNumber) {newEugeneRule.setOperand2(newRule.operand2);}
                        else
                        {
                            newEugeneRule.set("operand2isNumber",true);
                            newEugeneRule.set("operand2Number",newRule.operand2Number);
                        }

                        parsedRules.push(newEugeneRule);
                    }
                }
            }
        });

        var ruleDuplNameMap = {};
        var fullNamesArray = [];
        for(var i=0;i<parsedRules.length;i++) {
            var parsedRule = parsedRules[i];
            var repeated = false;
            var nameConflict = false;
            for(var j=0;j<existingRules.count();j++) {
                var existingRule = existingRules.getAt(j);
                if(
                    parsedRule.data.operand1_id === existingRule.data.operand1_id &&
                    parsedRule.data.operand2_id === existingRule.data.operand2_id &&
                    parsedRule.data.negationOperator === existingRule.data.negationOperator &&
                    parsedRule.data.operand2isNumber === existingRule.data.operand2isNumber &&
                    parsedRule.data.operand2Number === existingRule.data.operand2Number &&
                    parsedRule.data.compositionalOperator === existingRule.data.compositionalOperator
                ) {
                    repeatedRules.push({"originalRuleLine": parsedRule.data.originalRuleLine});
                    repeated = true;
                    break;
                } else if(parsedRule.data.name === existingRule.data.name) {        
                    nameConflict = true;
                } 
            }
            if(!repeated && !nameConflict) {
                newRules.add(parsedRule);
                fullNamesArray.push(parsedRule.get("name"));
            } else if(nameConflict && !repeated) {
                ruleDuplNameMap[parsedRule.data.name] = parsedRule;
            }
        }

        if(!$.isEmptyObject(ruleDuplNameMap)) {

            for(var item in ruleDuplNameMap) {
                var currentRule = ruleDuplNameMap[item];

                var existingDesign = Ext.getCmp('mainAppPanel').getActiveTab().model;

                var existingRule = existingDesign.rules().findRecord('name', currentRule.get('name'));

                var prefix = Teselagen.models.EugeneRule.defaultNamePrefix;
                var rules = existingDesign.rules().getRange().concat(parsedRules);
                rules.splice(rules.indexOf(currentRule),1);
                var re = new RegExp("^" + prefix + "(\\d+)$");
                var highestRuleNameNumber = -1;
                var match;

                for(var i = 0; i < rules.length; i++) {
                    match = re.exec(rules[i].get("name"));

                    if(match && Number(match[1]) > highestRuleNameNumber) {
                        highestRuleNameNumber = Number(match[1]);
                    }
                }

                var highest =  prefix + (highestRuleNameNumber + 1);
                var previousName = currentRule.get('name');
                currentRule.set('name',highest);
                var operand2 = existingRule.get("operand2isNumber") ? existingRule.get("operand2Number") : existingRule.getOperand2().data.name;
                conflictRules.push({"originalRuleLine":"There is a conflict between the existing rule "+existingRule.data.name +" ( "+existingRule.getOperand1().data.name+" "+existingRule.data.compositionalOperator+" "+operand2+" )"+" and the rule to be imported, "+currentRule.data.originalRuleLine +" Renaming the rule to be imported: "+currentRule.get('name')});

                newRules.add(currentRule);

                /*
                for(var i=0;i<existingRules.count();i++) {
                    fullNamesArray.push(existingRules.getAt(i).get("name"));
                }

                var existingSuffixes = {};
                for(var name in ruleDuplNameMap) {
                    for(var i=0;i<fullNamesArray.length;i++) {
                        var match = fullNamesArray[i].match(/.*(\d+)$/);
                        if(match && Number(match[1])) {
                            var maxNum = existingSuffixes[name];
                            existingSuffixes[name] = (maxNum>Number(match[1])) ? maxNum : Number(match[1]);
                        }
                    }
                }
                for(var oldName in existingSuffixes) {
                    var rule = ruleDuplNameMap[oldName];
                    //debugger;
                    var newName = oldName+(parseInt(existingSuffixes[oldName])+1);
                    var rule2 = existingRule.get("operand2isNumber") ? existingRule.get("operand2Number") : existingRule.getOperand2().data.name;
                    conflictRules.push({"originalRuleLine":"There is a conflict between the existing rule "+existingRule.data.name +" ( "+existingRule.getOperand1().data.name+" "+existingRule.data.compositionalOperator+" "+rule2+" )"+" and the rule to be imported, "+rule.data.originalRuleLine +" Renaming the rule to be imported: "+newName});
                    rule.set("name", newName);
                    rule.set("originalRuleLine",rule.get("originalRuleLine").replace(existingRule.get("name"),rule.get("name")));
                    newRules.add(rule);
                }
                */
            };

        }

        var eugeneRulesImportWindow = Ext.create("Vede.view.de.EugeneRulesImportDialog").show();

        eugeneRulesImportWindow.down("grid[name='new']").reconfigure(newRules);

        var conflictRulesStore = new Ext.data.ArrayStore({
                fields: [
                   {name: "originalRuleLine"}
                ]
            });
        conflictRulesStore.loadData(conflictRules);
        eugeneRulesImportWindow.down("grid[name='conflict']").reconfigure(conflictRulesStore);

        var ignoredRulesStore = new Ext.data.ArrayStore({
                fields: [
                   {name: "originalRuleLine"}
                ]
            });
        ignoredRulesStore.loadData(ignoredLines);
        eugeneRulesImportWindow.down("grid[name='ignored']").reconfigure(ignoredRulesStore);

        var repeatedRulesStore = new Ext.data.ArrayStore({
                fields: [
                   {name: "originalRuleLine"}
                ]
            });
        repeatedRulesStore.loadData(repeatedRules);
        eugeneRulesImportWindow.down("grid[name='repeated']").reconfigure(repeatedRulesStore);

        eugeneRulesImportWindow.down("button[text='Ok']").on("click", function() {
            var design = Ext.getCmp("mainAppPanel").getActiveTab().model;

            // Load the Eugene Rules in the Design
            newRules.each(function(rule){
                design.addToRules(rule);
            });
            eugeneRulesImportWindow.close();
        });

        eugeneRulesImportWindow.down("button[text='Cancel']").on("click", function() {
            eugeneRulesImportWindow.close();
        });
    },

    /**
     * Return the textContent of a DOM Element's child by tagname.
     * This will only return the text of the first matching child element.
     * @param {Element} element DOM Element
     * @param {String} tagname Child tag name
     * @param {String} [default] Default value if tag is not found (defaults to empty string)
     */
    getTagText: function(pElement, pTagname, pDefault) {
        var elem = pElement.getElementsByTagName(pTagname)[0];
        var text = pDefault || "";
        if (elem) {
            text = elem.textContent;
        }
        return text;
    },

    backgroundSequenceProcessing: function(parts){
        // debugger;
        console.log(parts);
        var processFlag = true;
        toastr.options.onclick = function(){
            processFlag = false;
        };
        var error = false;
        var conflict;
        toastr.info("Parsing sequences in background (click to cancel)");
        var countPartProcessing = parts.length;
        parts.forEach(function(part,partKey){
            if(processFlag) {
                parts.forEach(function (otherPart) {
                    if((part.getSequenceFile().get("partSource") === otherPart.getSequenceFile().get("partSource")) && (part.getSequenceFile().get("hash") != otherPart.getSequenceFile().get("hash"))) {
                        error = true;
                        console.log(part.getSequenceFile().get("partSource"));
                        console.log(otherPart.getSequenceFile().get("partSource"));
                        conflict = part.getSequenceFile().get("partSource");
                    }
                });
                if(!error) {
                    part.getSequenceFile({
                        callback: function(sequence){
                        sequence.processSequence(function(err,seqMgr,gb){
                            if(err)
                            {
                                countPartProcessing--;
                                console.log("Sequence not imported");
                                console.log(sequence);
                            }
                            else
                            {
                                countPartProcessing--;
                                sequence.set("name",gb.getLocus().locusName);
                            }
                            if(!countPartProcessing) { Vede.application.fireEvent("allSequencesProcessed"); Vede.application.fireEvent("PopulateStats");}
                            //if(err) debugger;
                        });
                    }});
                }
            }
        });
        if(error) {
            return [false, conflict];
        } else {
            return [true, ""];
        }
    }
});
