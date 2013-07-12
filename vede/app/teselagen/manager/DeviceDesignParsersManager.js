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

        for (var indexBin in bins) {
            if (!bins[indexBin].nodeName) { continue; }
            var bin = bins[indexBin];
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

            var existingDesign = Ext.getCmp("mainAppPanel").getActiveTab().model;
            var design = Teselagen.manager.DeviceDesignManager.clearDesignAndAddBins(existingDesign,binsArray);

            Ext.getCmp("mainAppPanel").getActiveTab().model = design;

            // Load the Eugene Rules in the Design
            for (var i = 0; i < eugeneRules.length; i++) {
                design.addToRules(eugeneRules[i]);
            }

            Vede.application.fireEvent(Teselagen.event.DeviceEvent.RERENDER_DE_CANVAS);
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
        var sequences = jsonDoc["de:design"]["de:sequenceFiles"]["de:sequenceFile"];
        var binsArray = [];
        var fullPartsAssocArray = {};
        var binsCounter = bins.length;

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

        function getPartByID(targetId, cb) {
            // Return part associated to bin finding by id (internal)
            var parts = jsonDoc["de:design"]["de:partVOs"]["de:partVO"];
            parts.forEach(function (part) {
                if (String(part["de:parts"]["de:part"].id) === String(targetId)) {
                    getSequenceByHash(part["de:sequenceFileHash"], part, cb);
                } else if (part["de:parts"]["de:part"] instanceof Array) {
                    // Cover the special cases in which some structures parts are inside subnodes that are array
                    if (String(part["de:parts"]["de:part"][0].id) === String(targetId)) {
                        getSequenceByHash(part["de:sequenceFileHash"], part, cb);
                    }
                }
            });
        }


        // Bins Processing
        for (var indexBin in bins) {
            var bin = bins[indexBin];

            if(!Teselagen.constants.SBOLIcons.ICONS[bin["de:iconID"].toUpperCase()]) { console.warn(bin["de:iconID"]); console.warn("Invalid iconID"); }

            var newBin = Ext.create("Teselagen.models.J5Bin", {
                binName: bin["de:binName"],
                iconID: bin["de:iconID"].toUpperCase(),
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

            if(indexBin==1)
            {
            //console.log(parts);
            //console.log(parts.length);
            }

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

                    newPart.set('project_id',Teselagen.manager.ProjectManager.workingProject.data.id);

                    var partName;
                    partName = part.sequence["name"];
                    if(part.sequence["de:fileName"]) partName = part.sequence["de:fileName"].replace('.gb',"");
                    if(newPart.get('partSource')===""&&!newPart.get('partSource')) newPart.set('partSource',partName);
                    // Sequence processing
                    var newSequence = Ext.create("Teselagen.models.SequenceFile", {
                        name: partName,
                        sequenceFileContent: part.sequence["de:content"],
                        sequenceFileFormat: part.sequence["de:format"],
                        sequenceFileName: part.sequence["de:fileName"]
                    });

                    newSequence.set('project_id',Teselagen.manager.ProjectManager.workingProject.data.id);

                    newPart.setSequenceFileModel(newSequence);

                    tempPartsArray.push(newPart);
                    fullPartsAssocArray[part.id] = newPart;

                    partsCounter--;
                    if (partsCounter === 0) {
                        newBin.addToParts(tempPartsArray);
                        binsArray.push(newBin);

                        binsCounter--;

                        if (binsCounter === 0) {

                            var rulesArray = [];
                            if(typeof(cb) !== "function" ) // Not parsing eugeneRules in tests
                            {
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

                                for (var ruleIndex in eugeneRules) {
                                    var rule = eugeneRules[ruleIndex];
                                    var operand1 = rule["de:operand1ID"];
                                    var operand2 = rule["de:operand2ID"];

                                    if(fullPartsAssocArray[operand1])
                                    {
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
                                    else
                                    {
                                        //console.warn("Eugene rule possible not loaded");
                                    }
                                }
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
        var parser = new DOMParser();
        var xmlDoc = parser.parseFromString(input, "text/xml");

        xmlDoc = this.auto_migrate_XML4_to4_1(xmlDoc);


        // Build part Index

        var partIndex = [];
        var parts = xmlDoc.getElementsByTagNameNS("*", "partVO");
        for (var indexPart in parts) {
            if (!parts[indexPart].nodeName) { continue; }

            var part = parts[indexPart];
            partIndex.push(part);
            var instances = part.getElementsByTagNameNS("*", "parts")[0].getElementsByTagNameNS("*", "part");

            for (var instanceIndex in instances)
            {
                if (!instances[instanceIndex].nodeName) { continue; }
                var newPart = part.cloneNode(true);
                newPart.setAttribute("id", instances[instanceIndex].getAttribute("id"));
                newPart.appendChild(xmlDoc.createElement("de:fas")).textContent = instances[instanceIndex].getElementsByTagNameNS("*","fas")[0].textContent;
                partIndex.push(newPart);
            }
        }


        function getPartByID(targetId) {
            var partfound = false;
            var parts = xmlDoc.getElementsByTagNameNS("*", "partVO");
            for (var indexPart in parts) {
                if (!parts[indexPart].nodeName) { continue; }
                var part = parts[indexPart];
                var id = part.getElementsByTagNameNS("*", "part")[0].attributes[0].value;
                if (id === targetId) {
                    partfound = true;
                    return {
                        "part":part,
                        "linked":false
                        };
                }

                var instances = part.getElementsByTagNameNS("*", "parts")[0].getElementsByTagNameNS("*", "part");

                for (var instanceIndex in instances)
                {
                    if (!instances[instanceIndex].nodeName) { continue; }
                    if ( instances[instanceIndex].getAttribute("id") === targetId )
                    {
                        partfound = true;
                        return {
                            "part":part,
                            "linked":true,
                            "fas":instances[instanceIndex].getElementsByTagNameNS("*","fas")[0].textContent
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
            for (var sequenceindex in sequences) {
                var sequence = sequences[sequenceindex];
                if (!sequence.nodeName || typeof sequence !== "object") { continue; }
                if (String(sequence.getAttribute("hash")) === String(targetHash) && !found ) { cb(sequence); }
            }
        }

        var binsArray = [];
        var fullPartsAssocArray = {};

        //var circular = Boolean(xmlDoc.getElementsByTagNameNS("*", "isCircular")[0].textContent);

        var bins = xmlDoc.getElementsByTagNameNS("*", "j5Bins")[0].getElementsByTagNameNS("*", "j5Bin");

        for (var indexBin in bins) {
            if (!bins[indexBin].nodeName) { continue; }
            var bin = bins[indexBin];
            var binName = bin.getElementsByTagNameNS("*", "binName")[0].textContent;
            var iconID = bin.getElementsByTagNameNS("*", "iconID")[0].textContent;
            var direction = (bin.getElementsByTagNameNS("*", "direction")[0].textContent === "forward");
            var dsf = bin.getElementsByTagNameNS("*", "dsf")[0] ? bin.getElementsByTagNameNS("*", "dsf")[0].textContent : false;
            
            var fro = "";
            if( bin.getElementsByTagNameNS("*", "fro") ) fro = (bin.getElementsByTagNameNS("*", "fro").length > 0) ? bin.getElementsByTagNameNS("*", "fro")[0].textContent : "";
            var extra3PrimeBps = "";
            if ( bin.getElementsByTagNameNS("*", "extra3PrimeBps") ) extra3PrimeBps = (bin.getElementsByTagNameNS("*", "extra3PrimeBps").length > 0) ? bin.getElementsByTagNameNS("*", "extra3PrimeBps")[0].textContent : "";
            var extra5PrimeBps = "";
            if( bin.getElementsByTagNameNS("*", "extra5PrimeBps") ) extra5PrimeBps = (bin.getElementsByTagNameNS("*", "extra5PrimeBps").length > 0) ? bin.getElementsByTagNameNS("*", "extra5PrimeBps")[0].textContent : "";

            if(!Teselagen.constants.SBOLIcons.ICONS[iconID.toUpperCase()]) { console.warn(iconID); console.warn("Invalid iconID"); }

            var newBin = Ext.create("Teselagen.models.J5Bin", {
                binName: binName,
                iconID: iconID,
                directionForward: direction,
                dsf: (dsf === "true") ? true : false,
                fro: fro,
                extra3PrimeBps: extra3PrimeBps,
                extra5PrimeBps: extra5PrimeBps
            });

            var parts = bin.getElementsByTagNameNS("*", "partID");

            var tempPartsArray = [];
            var delayedLinkedPartsLookup = [];
            var binFases = [];

            for (var indexPart in parts) {
                if (!parts[indexPart].nodeName) { continue; }
                var partLookup = getPartByID(parts[indexPart].textContent);
                var part = partLookup.part;

                if(partLookup.linked)
                {
                    delayedLinkedPartsLookup.push({"position":tempPartsArray.length,"part":part,"fas":partLookup.fas});
                    binFases.push(partLookup.fas);
                }
                else
                {  
                    var fas = part.getElementsByTagNameNS("*", "parts")[0].getElementsByTagNameNS("*", "part")[0].getElementsByTagNameNS("*", "fas")[0].textContent;
                    var hash = part.getElementsByTagNameNS("*", "sequenceFileHash")[0].textContent;
                    var newPart = Ext.create("Teselagen.models.Part", {
                        name: part.getElementsByTagNameNS("*", "name")[0].textContent,
                        genbankStartBP: part.getElementsByTagNameNS("*", "startBP")[0].textContent,
                        endBP: part.getElementsByTagNameNS("*", "stopBP")[0].textContent,
                        revComp: part.getElementsByTagNameNS("*", "revComp")[0] ? part.getElementsByTagNameNS("*", "revComp")[0].textContent :  false,
                        fas: (fas === "") ? "None" : fas
                    });

                    getSequenceByID(hash, function (sequence) {
                        // Sequence processing
                        var newSequence = Ext.create("Teselagen.models.SequenceFile", {
                            sequenceFileContent: sequence.getElementsByTagNameNS("*", "content")[0].textContent,
                            sequenceFileFormat: sequence.getElementsByTagNameNS("*", "format")[0].textContent,
                            sequenceFileName: sequence.getElementsByTagNameNS("*", "fileName")[0].textContent
                        });

                        newSequence.set('project_id',Teselagen.manager.ProjectManager.workingProject.data.id);
                        newSequence.set('name',newPart.get('name'));

                        newPart.setSequenceFileModel(newSequence);
                    });

                    binFases.push(newPart.get('fas'));

                    tempPartsArray.push(newPart);
                    fullPartsAssocArray[part.getAttribute("id")] = newPart;
                }

            }

            for(var delayedIndexPart in delayedLinkedPartsLookup)
            {
                var delayed = delayedLinkedPartsLookup[delayedIndexPart];
                var originalPart = fullPartsAssocArray[delayed.part.getAttribute("id")];
                if(originalPart)
                {
                    tempPartsArray.splice(delayed.position,0,originalPart);
                    fullPartsAssocArray[delayed.part.getAttribute("id")] = originalPart;
                }
                else
                {
                    console.log("Part not linked!");
                }
            }


            newBin.addToParts(tempPartsArray);
            newBin.set('fases',binFases);
            binsArray.push(newBin);
        }

        var eugeneRules = xmlDoc.getElementsByTagNameNS("*", "eugeneRules")[0].getElementsByTagNameNS("*", "eugeneRule");
        var rulesArray = [];

        for (var i = 0; i < eugeneRules.length; i++) {
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
            else operand2 = operand2Node.textContent;

            var newEugeneRule = Ext.create("Teselagen.models.EugeneRule", {
                name: rule.getElementsByTagNameNS("*", "name")[0].textContent,
                compositionalOperator: rule.getElementsByTagNameNS("*", "compositionalOperator")[0].textContent,
                negationOperator: rule.getElementsByTagNameNS("*", "negationOperator")[0].textContent,
                operand2isNumber: operand2isNumber
            });

            newEugeneRule.setOperand1(fullPartsAssocArray[operand1]);
            if( operand2isNumber ) newEugeneRule.setOperand2(operand2);
            else newEugeneRule.setOperand2(fullPartsAssocArray[operand2]);
            rulesArray.push(newEugeneRule);

        }
        Teselagen.manager.DeviceDesignParsersManager.generateDesign(binsArray, rulesArray, cb);
    },

    parseEugeneRules: function(content,filename,design){


        // Existing rules
        var existingRules = design.rules();

        // Build part Index

        var partIndex = {};

        design.getJ5Collection().bins().each(function (bin, binKey) {
            bin.parts().each(function (part) {
                partIndex[part.data.name] = part;
            });
        });
    
        var lines = content.split("\n");
        var newRule;
        
        var parsedRules = Ext.create('Ext.data.Store', { model: "Teselagen.models.EugeneRule" });


        var conflictRules = [];
        var newRules = Ext.create('Ext.data.Store', { model: "Teselagen.models.EugeneRule" });
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
                }
                
                var parsed = line.match(/Rule (.+)\((NOT|) (.+) (.+) (.+)\);/);
                if(!parsed) parsed = line.match(/Rule (.+)\((.+) (.+) (.+)\);/);
                if(!parsed) 
                {
                    parsed = line.match(/\/\//);
                    commentLine = true;
                }
                if(!parsed) new Error("Invalid eugene rule line");

                if(parsed.length===6)
                {
                    newRule.name = parsed[1];
                    newRule.negationOperator = parsed[2];
                    newRule.operand1 = partIndex[parsed[3]];
                    newRule.compositionalOperator = parsed[4];
                    //newRule.operand2 = partIndex[parsed[5]];

                    var operand2 = parsed[5];
                    if( isNaN ( parseInt( operand2 ) ) )
                    {
                        // Operand 2 is a part
                        newRule.operand2 = partIndex[operand2];
                        newRule.operand2isNumber = false;
                        if(operand2 && !newRule.operand2) notfoundPart = true;
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

                    var operand2 = parsed[4];
                    if( isNaN ( parseInt( operand2 ) ) )
                    {
                        // Operand 2 is a part
                        newRule.operand2 = partIndex[operand2];
                        newRule.operand2isNumber = false;
                        if(operand2 && !newRule.operand2) notfoundPart = true;
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
                else throw new Error("Invalid eugene rule line");
                
                if(notfoundPart) ignoredLines.push({"originalRuleLine":line});

                if(!commentLine && !notfoundPart)
                {
                    var unsupported = false;

                    try {
                    var newEugeneRule = Ext.create("Teselagen.models.EugeneRule", {
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
                        if(!newRule.operand2isNumber) newEugeneRule.setOperand2(newRule.operand2);
                        else
                        {
                            newEugeneRule.set('operand2isNumber',true);
                            newEugeneRule.set('operand2Number',newRule.operand2Number);
                        }

                        parsedRules.add(newEugeneRule);
                    }
                }
            }
        });

        var checkForDuplicatedName = function(parsedRule,cb){

            var rulesCounter = existingRules.count();
            var duplicated = false;
            var duplicatedRule;
            existingRules.each(function(existingRule){
                if(
                    parsedRule.data.name === existingRule.data.name
                )
                {
                    duplicated = true;
                    duplicatedRule = existingRule;
                    rulesCounter--;
                }
                else
                {
                    rulesCounter--;
                }
                if(rulesCounter === 0) cb(duplicated,duplicatedRule);
            });
        };
    
        var checkForConflicts = function(rule,cb){

            checkForDuplicatedName(rule,function(dup,existingRule){
                if(dup) { 
                    var rule2 = existingRule.get('operand2isNumber') ? existingRule.get('operand2Number') : existingRule.getOperand2().data.name;
                    conflictRules.push({"originalRuleLine":"There is a conflict between the existing rule "+existingRule.data.name +" ( "+existingRule.getOperand1().data.name+" "+existingRule.data.compositionalOperator+" "+rule2+" )"+" and the rule to be imported, "+rule.data.originalRuleLine +" Renaming the rule to be imported: "+rule.data.name+'_1'});
                    rule.set('name',rule.data.name+'_1');
                    rule.set('originalRuleLine',rule.get('originalRuleLine').replace(existingRule.get('name'),rule.get('name')));
                }
                return cb(dup)
            })
        };

        var checkForRepeatedRule = function(parsedRule,cb){

            var rulesCounter = existingRules.count();
            var duplicated = false;
            existingRules.each(function(existingRule){
                if(
                    parsedRule.data.operand1_id === existingRule.data.operand1_id &&
                    parsedRule.data.operand2_id === existingRule.data.operand2_id &&
                    parsedRule.data.negationOperator === existingRule.data.negationOperator &&
                    parsedRule.data.operand2isNumber === existingRule.data.operand2isNumber &&
                    parsedRule.data.operand2Number === existingRule.data.operand2Number &&
                    parsedRule.data.compositionalOperator === existingRule.data.compositionalOperator
                )
                {
                    duplicated = true;
                    rulesCounter--;
                }
                else
                {
                    rulesCounter--;
                }
                if(rulesCounter === 0) cb(duplicated);
            });
        };


        var endEugeneRulesProcessing = function(){

        var eugeneRulesImportWindow = Ext.create('Vede.view.de.EugeneRulesImportDialog').show();

        eugeneRulesImportWindow.down('grid[name="new"]').reconfigure(newRules)

        var conflictRulesStore = new Ext.data.ArrayStore({
                fields: [
                   {name: 'originalRuleLine'}
                ]
            });
        conflictRulesStore.loadData(conflictRules);
        eugeneRulesImportWindow.down('grid[name="conflict"]').reconfigure(conflictRulesStore);

        var ignoredRulesStore = new Ext.data.ArrayStore({
                fields: [
                   {name: 'originalRuleLine'}
                ]
            });
        ignoredRulesStore.loadData(ignoredLines);
        eugeneRulesImportWindow.down('grid[name="ignored"]').reconfigure(ignoredRulesStore);

        var repeatedRulesStore = new Ext.data.ArrayStore({
                fields: [
                   {name: 'originalRuleLine'}
                ]
            });
        repeatedRulesStore.loadData(repeatedRules);
        eugeneRulesImportWindow.down('grid[name="repeated"]').reconfigure(repeatedRulesStore);

        eugeneRulesImportWindow.down('button[text="Ok"]').on('click', function() {
            var design = Ext.getCmp("mainAppPanel").getActiveTab().model;

            // Load the Eugene Rules in the Design
            newRules.each(function(rule){
                design.addToRules(rule);
            });
            eugeneRulesImportWindow.close();
        });

        eugeneRulesImportWindow.down('button[text="Cancel"]').on('click', function() {
            eugeneRulesImportWindow.close();
        });

        };

        var processedRules = parsedRules.count();

        parsedRules.each(function(parsedRule)
        {
            //sconsole.log("processing: ",parsedRule.data.name);
            checkForRepeatedRule(parsedRule,function(repeated){
                if(repeated) 
                {
                    repeatedRules.push({"originalRuleLine":parsedRule.data.originalRuleLine});
                    processedRules--;
                    if(processedRules === 0) endEugeneRulesProcessing();
                }
                else
                {
                    checkForConflicts(parsedRule,function(conflicts){
                        newRules.add(parsedRule);
                        processedRules--;
                        if(processedRules === 0) endEugeneRulesProcessing();
                    });
                }
            });
        });


    }

});
