/**
 * @class Teselagen.manager.DeviceDesignManager
 * Class describing a DeviceDesignManager.
 * DeviceDesignManager is the interface to manipulating the data models that
 * DeviceDesign holds. See schema for structure.
 *
 * Some functions originally  FunctionMediator.as, SaveDesignXMLCommand.as
 * @author Diana Wong
 * @author Douglas Densmore (original author) ?
 */
Ext.define("Teselagen.manager.DeviceDesignManager", {

    singleton: true,

    requires: [
        "Teselagen.bio.util.Sha256",
        "Teselagen.constants.Constants",
        "Teselagen.utils.NameUtils"
    ],

    statics: {
    },

    constants: null,

    /**
     * @member Teselagen.manager.DeviceDesignManager
     */
    constructor: function() {
        this.constants = Teselagen.constants.Constants;
    },


    //================================================================
    // DeviceDesign management
    //================================================================

    /**
     * Creates a DeviceDesign with a J5Collection that has pNumBins empty J5Bins.
     * Validates DeviceDesign.
     *
     * @param {Number} pNumBins Number of J5Bins to put into Collection
     * @returns {Teselagen.models.DeviceDesign}
     */
    createDeviceDesign: function(pNumBins) {
        var device = Ext.create("Teselagen.models.DeviceDesign");
        device.createEmptyGridModel(pNumBins);

        var err = device.validate();
        if (err.length > 0) {
            console.warn("Creating DeviceDesign: " + err.length + " errors found.");
        }

        return device;
    },

    /**
     * Clear the design and add a given set of J5Bins.
     * @param {Teselagen.models.DeviceDesign} DeviceEditor design.
     * @param {Teselagen.models.J5Bin[]} pBins One or an array of J5Bins
     * @returns {Teselagen.models.DeviceDesign}
     */
    clearDesignAndAddBins: function(device,pBins) {
        var bins = device.bins();

        bins.removeAll();
        bins.add(pBins);

        var err = device.validate();
        if (err.length > 0) {
            console.warn("Clearing DeviceDesign: " + err.length + " errors found.");
        }
        return device;
    },

    clearDesignAndAddBinsAndPartsAndRules: function(device,pBins,pParts,pRules) {
        var bins = device.bins();
        var parts = device.parts();
        var rules = device.rules();

        rules.clearFilter(true);
        rules.removeAll(true);
        rules.add(pRules);

        parts.removeAll(true);
        parts.add(pParts);

        bins.removeAll(true);
        bins.add(pBins);

        Teselagen.manager.DeviceDesignManager.enforceColumnLength(device);

        /*var err = device.validate();
        if (err.length > 0) {
            console.warn("Clearing DeviceDesign: " + err.length + " errors found.");
        }*/
        return device;
    },

    /**
     * Creates a DeviceDesign using a given set of J5Bins.
     * The order in the array determines the order in the Collection.
     * Validates DeviceDesign.
     * @param {Teselagen.models.J5Bin[]} pBins One or an array of J5Bins
     * @returns {Teselagen.models.DeviceDesign}
     */
    createDeviceDesignFromBins: function(pBins) {
        var device = Ext.create("Teselagen.models.DeviceDesign");

        device.bins().removeAll();
        device.bins().insert(0, pBins);

        // var combo = this.setCombinatorial(device);
        //console.log(combo);
        // device.set("combinatorial", combo);
        //this.setCombinatorial(device);

        var err = device.validate();
        if (err.length > 0) {
            console.warn("Creating DeviceDesign: " + err.length + " errors found.");
        }
        return device;
    },

    createDeviceDesignFromBinsAndParts: function(pBins, pParts) {
        var device = Ext.create("Teselagen.models.DeviceDesign");

        device.parts().removeAll();
        device.parts().add(pParts);

        device.bins().removeAll();
        device.bins().add(pBins);

        var err = device.validate();
        if (err.length > 0) {
            console.warn("Creating DeviceDesign: " + err.length + " errors found.");
        }
        return device;
    },

    //================================================================
    // EugeneRules Management
    //================================================================
    /**
     * Creates a new EugeneRule in DeviceDesign.
     * Executes validation.
     *
     * @param {Teselagen.models.DeviceDesign} pDevice
     * @param {String} pRuleName
     * @param {Boolean} pNegationOperator
     * @param {Teselagen.models.Part} pOperand1
     * @param {String} pCompositionalOperator
     * @param {Teselagen.models.Part|Number} pOperand2
     * @returns {Teselagen.models.EugeneRule}
     */
    createEugeneRule: function(pDevice, pRuleName, pNegationOperator, pOperand1, pCompositionalOperator, pOperand2) {
        var rule = Ext.create("Teselagen.models.EugeneRule", {
            name: pRuleName,
            negationOperator: pNegationOperator,
            compositionalOperator: pCompositionalOperator
        });
        rule.setOperand1(pOperand1);
        rule.setOperand2(pOperand2);

        // GO BACK AND FIX THIS VALIDATOR
        var err = rule.validate();
        if (err.length > 0) {
            console.warn("Creating EugeneRule: " + err.length + " errors found.");
        }
        pDevice.addToRules(rule); //put this here?
        return rule;
    },
    /**
     * Adds a EugeneRule into the Rules Store.
     * @param {Teselagen.models.DeviceDesign} pDevice
     * @param {Teselagen.models.EugeneRule} pRule. Can be a single part or an array of parts.
     * @returns {Boolean} True if added, false if not.
     */
    addToRules: function(pDevice, pRule) {
        return pDevice.addToRules(pRule);
    },
    /**
     * Removes a EugeneRule from the Rules Store.
     * @param {Teselagen.models.DeviceDesign} pDevice
     * @param {Teselagen.models.EugeneRule} pRule. Can be a single part or an array of parts.
     * @returns {Boolean} True if removed, false if not.
     */
    removeFromRules: function(pDevice, pRule) {
        return pDevice.removeFromRules(pRule);
    },
    /**
     * Removes all EugeneRules from the Rules Store.
     * @param {Teselagen.models.DeviceDesign} pDevice
     * @returns {Boolean} True if all EugeneRules have been removed.
     */
    removeAllRules: function(pDevice) {
        return pDevice.removeAllRules();
    },
    /**
     * Returns the EugeneRules Store of EugeneRules that containt the Part in either operand.
     * @param {Teselagen.models.DeviceDesign} pDevice
     * @param {Teselagen.models.Part} pPart
     * @return {Ext.data.Store} Store of EugeneRules containing pPart
     */
    getRulesInvolvingPart: function(pDevice, pPart, filterThenAndNextTo) {
        return pDevice.getRulesInvolvingPart(pPart, filterThenAndNextTo);
    },

    getNumberOfRulesInvolvingPart: function(pDevice, pPart) {
        return pDevice.getNumberOfRulesInvolvingPart(pPart);
    },

    /**
     * Returns the first EugeneRule in the store that has the given name.
     * @param {Teselagen.models.DeviceDesign} pDevice
     * @param {String} pName
     * @returns {Teselagen.models.EugeneRule} Returns null if none found.
     */
    getRuleByName: function(pDevice, pName) {
        return pDevice.getRuleByName(pName);
    },
    /**
     * Checks to see if a given name is unique within the Rules names.
     * @param {Teselagen.models.DeviceDesign} pDevice
     * @param {String} pName Name to check against Rules.
     * @returns {Boolean} True if unique, false if not.
     */
    isUniqueRuleName: function(pDevice, pName) {
        return pDevice.isUniqueRuleName(pName);
    },
    /**
     * Converts EugeneRule into text
     * @param {Teselagen.models.DeviceDesign} pDevice
     * @param {Teselagen.models.EugeneRule} pRuleName
     * @returns {String}
     */
    generateRuleText: function(pDevice, pRuleName) {
        var rule = pDevice.getRuleByName(pRuleName);
        if (Ext.getClassName(rule) === "Teselagen.models.EugeneRule") {
            return rule.generateText();
        } else {
            console.warn("Teselagen.manager.DeviceDesignManager.generateRuleText(): No rule '" + pRuleName +"'.");
            return null;
        }
    },

    /**
     * Generates the default name for a new rule. Gets rules in the same design
     * with names in the form rule.self.prefix + (number), and returns a string in
     * the form rule.self.prefix + (highest_number+1).
     * @param {Teselagen.models.DeviceDesign} pDevice
     * @returns {String}
     */
    generateDefaultRuleName: function(pDevice) {
        var prefix = Teselagen.models.EugeneRule.defaultNamePrefix;
        var rules = pDevice.rules().getRange();
        var re = new RegExp("^" + prefix + "(\\d+)$");
        var highestRuleNameNumber = -1;
        var match;

        for(var i = 0; i < rules.length; i++) {
            match = re.exec(rules[i].get("name"));

            if(match && Number(match[1]) > highestRuleNameNumber) {
                highestRuleNameNumber = Number(match[1]);
            }
        }

        return prefix + (highestRuleNameNumber + 1);
    },

    /**
     * Removes the given part from the given design's part store and unmaps it
     * from all cells it is mapped to.
     * @param {Teselagen.models.DeviceDesign} pDevice
     * @param {Teselagen.models.Part} pPart
     */
    removePartFromDesign: function(pDevice, pPart) {
        var ownerBins = this.getParentBins(pDevice, pPart);
        var cell;

        for(var j = 0; j < ownerBins.length; j++) {
            ownerBins[j].cells().each(function(cell) {
                if(cell.get('part_id') === pPart.get('id')) {
                    cell.setPart(null);
                }
            });
        }

        pDevice.parts().remove(pPart);
    },

    removeRulesAndPartsAssocWithCell: function(pDevice, pCell) {
        var part = pCell.getPart();
        var removedPart;
        var removedRules = [];
        if(part) {
            var otherParts = false;
            loop:
            for(var i=0;i<pDevice.bins().count();i++) {
                var bin = pDevice.bins().getAt(i);
                for(var j=0;j<bin.cells().count();j++) {
                    var cell = bin.cells().getAt(j);
                    if(cell.getPart() === part && pCell !== cell) {
                        otherParts = true;
                        break loop;
                    }
                }
            }
            if(!otherParts) {
                removedPart = part;

                this.getRulesInvolvingPart(pDevice, part, false);
                removedRules = pDevice.rules().getRange();

                pDevice.rules().removeAll();
                pDevice.rules().clearFilter(true);

                pDevice.parts().remove(part);
            }
        }

        return {
            removedRules: removedRules,
            removedPart: removedPart
        }
    },

    removeRulesAndPartsAssocWithBin: function(pDevice, pBin, binIndex) {
        if(binIndex===null || binIndex===undefined) binIndex = pDevice.bins().indexOf(pBin);
        if(pBin===null || pBin===undefined) pBin = pDevice.bins().getAt(binIndex);

        var removedParts = [];
        var removedRules = [];

        var partsAssocArray = {};
        for(var i=0;i<pBin.cells().count();i++) {
            var part = pBin.cells().getAt(i).getPart();
            if(part) partsAssocArray[part.internalId] = part;
        }
        for(var x in partsAssocArray) {
            var part = partsAssocArray[x];

            var otherParts = false;
            loop:
            for(var i=0;i<pDevice.bins().count();i++) {
                var bin = pDevice.bins().getAt(i);
                if(i===binIndex) continue;
                for(var j=0;j<bin.cells().count();j++) {
                    var cell = bin.cells().getAt(j);
                    if(cell.getPart() === part) {
                        otherParts = true;
                        break loop;
                    }
                }
            }
            if(!otherParts) {
                removedParts.push(part);

                this.getRulesInvolvingPart(pDevice, part, false);
                removedRules = removedRules.concat(pDevice.rules().getRange());

                pDevice.rules().removeAll();
                pDevice.rules().clearFilter(true);

                pDevice.parts().remove(part);
            }
        }

        return {
            removedRules: removedRules,
            removedParts: removedParts
        }
    },

    removeRulesAndPartsAssocWithRow: function(pDevice, rowIndex) {
        var removedParts = [];
        var removedRules = [];

        var partsAssocArray = {};
        for(var i=0;i<pDevice.bins().count();i++) {
            var part = pDevice.bins().getAt(i).cells().getAt(rowIndex).getPart();
            if(part) partsAssocArray[part.internalId] = part;
        }
        for(var x in partsAssocArray) {
            var part = partsAssocArray[x];

            var otherParts = false;
            loop:
            for(var i=0;i<pDevice.bins().count();i++) {
                var bin = pDevice.bins().getAt(i);
                for(var j=0;j<bin.cells().count();j++) {
                    if(j===rowIndex) continue;
                    var cell = bin.cells().getAt(j);
                    if(cell.getPart() === part) {
                        otherParts = true;
                        break loop;
                    }
                }
            }
            if(!otherParts) {
                removedParts.push(part);

                this.getRulesInvolvingPart(pDevice, part, false);
                removedRules = removedRules.concat(pDevice.rules().getRange());

                pDevice.rules().removeAll();
                pDevice.rules().clearFilter(true);

                pDevice.parts().remove(part);
            }
        }

        return {
            removedRules: removedRules,
            removedParts: removedParts
        }
    },

    //================================================================
    // J5Collection Management
    //================================================================
    /**
     * Delete existing J5Collection and replaces it with a new collection with pNumBins bins.
     * This version does not do a validation.
     * @param {Teselagen.models.DeviceDesign} pDevice
     * @param {Number} pNumBins
     */
    createNewCollection: function(pDevice, pNumBins) {
        return pDevice.createNewCollection(pNumBins);
    },
    /**
     * Delete existing J5Collection and replaces it with a new collection with pNumBins bins.
     * Executes validation.
     * @param {Teselagen.models.DeviceDesign} pDevice
     * @param {Number} pNumBins
     * @param {Boolean} pIsCircular
     * @returns {Teselagen.models.J5Collection}
     */
    createEmptyJ5Collection: function(pDevice, pNumBins, pIsCircular) {
        var collection = Ext.create("Teselagen.models.J5Collection", {
            isCircular: pIsCircular
        });

        // GO BACK AND FIX THIS VALIDATOR
        var err = collection.validate();
        if (err.length > 0) {
            console.warn("Creating J5Collection: " + err.length + " errors found.");
            console.warn(err);
        }

        collection.createEmptyCollection(pNumBins);
        pDevice.setJ5Collection(collection); //put this here?
        return collection;
    },
    /**
     * Returns if a design/collection is a circular construct.
     * @param {Teselagen.models.DeviceDesign} pDevice
     * @return {Boolean}
     */
    isCircular: function(pDevice) {
        return pDevice.isCircular();
    },

    /**
     * Sets the isCircular flag.
     * @param {Teselagen.models.DeviceDesign} pDevice
     * @param {Boolean} pCircular
     */
    setCircular: function(pDevice, pCircular) {
        pDevice.set("isCircular", pCircular);
    },
    /**
     * Returns the number of J5Bins in a J5Collection
     * @param {Teselagen.models.DeviceDesign} pDevice
     * @return {Number} Number of bins
     */
    binCount: function(pDevice) {
        return pDevice.bins().count();
    },

    /**
     * Checks if Design/J5Collection is combinatorial (i.e. if there is more than one Part in a J5Bin)
     * and sets the flag.
     * NOTE: After checking for combinatorial, this method also sets the status of "combinatorial" a J5Collection.
     * If more than one part is added to a bin through the models, the combinatorial flag may not be triggered.
     * Using this function would be necessary to set the flags correctly and to check the status.
     *
     * @param {Teselagen.models.DeviceDesign} pDevice
     * @returns {Boolean}
     */
    setCombinatorial: function(pDevice) {
        var combo   = false;
        var tmpC = 0;

        if (pDevice === null || pDevice === undefined) {
            return combo;
        } else if (pDevice.bins() === null || pDevice.bins() === undefined) {
            return combo;
        } else {
            for (var i = 0; i < pDevice.bins().count(); i++) {
                if (pDevice.bins().getAt(i).cells().count() > 1) {
                    pDevice.bins().getAt(i).cells().each(function(cell) {
                        if(cell.get("part_id")) {
                            cell.getPart().getSequenceFile({
                                callback: function(sequenceFile){
                                    if (sequenceFile) {
                                        if(sequenceFile.get("partSource")!="") {
                                            console.log(sequenceFile.get("partSource"));
                                            tmpC++;
                                        }
                                    }
                                }
                            });
                        }
                    });
                }

                if (tmpC>1) {
                    combinatorial = true;
                }

                pDevice.set("combinatorial", combo);
            }
            return combo;
        }
    },

    /**
     * Gets the Combinatorial flag in a collection based on setCombinatorial().
     * NOTE: This method DOES NOT CHECK FOR COMBINATORIAL STATUS.
     * Use setCombinatorial() first to verify if the Design/Collection is combinatorial.
     *
     * @param {Teselagen.models.DeviceDesign} pDevice
     * @param {Boolean} pCircular
     */
    getCombinatorial: function(pDevice) {
        return pDevice.get("combinatorial");
    },

    /**
     * Finds the maximum number of parts in a bin in a collection.
     * @param {Teselagen.models.DeviceDesign}
     * @returns {Number}
     */
    findMaxNumParts: function(pDevice) {
        var num = 0;

        if (pDevice === null || pDevice === undefined) {
            return num;
        }

        if (pDevice.bins() === null || pDevice.bins() === undefined) {
            return num;
        }

        for (var i = 0; i < pDevice.bins().count(); i++) {
            if (pDevice.bins().getAt(i).cells().count() > num) {
                num = pDevice.bins().getAt(i).cells().count();
            }
        }
        return num;
    },

    /**
     * Fills columns with phantom parts so that all columns have the same
     * number of parts.
     * @param {Teselagen.models.DeviceDesign}
     */
    enforceColumnLength: function(pDevice) {
        var maxNumParts = Teselagen.manager.DeviceDesignManager.findMaxNumParts(pDevice);
        pDevice.bins().each(function(bin) {
            var phantomArray = [];
            for(var i=bin.cells().getCount(); i<maxNumParts; i++) {
                var phantomCell = Ext.create("Teselagen.models.Cell", {
                    index: i
                });
                phantomCell.setJ5Bin(bin);
                phantomArray.push(phantomCell);
            }
            bin.cells().add(phantomArray);

        });
    },

    /**
     * Checks if each J5Bin has at least one Part and one accompanying SequenceFile.
     * Sets j5Read flag on collection: true if conditions are true, false if not.
     * @param {Teselagen.models.DeviceDesign} pDevice
     * @returns {Boolean}
     */
    checkJ5Ready: function(pDevice) {
        var ready = true;

        if (pDevice === null || pDevice === undefined) {
            return false;
        }

        if (pDevice.bins() === null || pDevice.bins() === undefined) {
            return false;
        }
        var bins = pDevice.bins();

        for (var i = 0; i < bins.count(); i++) {
            if (bins.getAt(i).cells() === undefined) {
                return false;
            }
            if (bins.getAt(i).cells().count() < 1) {
                ready = false;
            }
            var cells = bins.getAt(i).cells();
            for (var j = 0; j < cells.count(); j++) {
                // CHANGE THIS ACCORDING TO HOW SEQUENCEFILE IS STORED IN PARTS

                // Supplying a only a name field makes an "empty" Part
                var part = cells.getAt(j).getPart();
                if (part && part.data.sequencefile_id !== "")
                {
                    if (Ext.getClassName(part.getSequenceFile()) !== "Teselagen.models.SequenceFile") {
                        console.log("a");
                        ready = false;
                    }
                    if (part.isEmpty() === true) {
                        console.log("b");
                        ready = false;
                    }
                }
            }
        }

//        console.log(ready);
        pDevice.set("j5Ready", ready);
        return ready;
    },

    //================================================================
    // J5Bin management
    //================================================================
    /**
     * Creates an empty J5Bin with the name pBinName at the index of pIndex.
     * Executes validation.
     * @param {Teselagen.models.DeviceDesign} pDevice
     * @param {String} pBinName Name of bin
     */
    createEmptyJ5Bin: function(pDevice, pBinName, pIndex) {
        var unique = this.isUniqueBinName(pDevice, pBinName);
        if (!unique) {
            throw Ext.create("Teselagen.bio.BioException", {
                message: "Teselagen.models.J5Bin.createEmptyJ5Bin(): File name already exists in Design."
            });
        }

        var bin = Ext.create("Teselagen.models.J5Bin", {
            binName: pBinName
        });

        // GO BACK AND FIX THIS VALIDATOR
        var err = bin.validate();
        if (err.length > 0) {
            console.warn("Creating J5Bin: " + err.length + " errors found.");
            console.warn(err);
        }

        pDevice.bins().insert(pIndex, bin);
        return bin;
    },

    /**
     * Returns the iconID for J5Bin at pBinIndex. (Indices begin at 0.)
     * @param {Teselagen.models.DeviceDesign} pDevice
     * @param {Number} pBinIndex
     * @returns {String}
     */
    getIconIDByBinIndex: function(pDevice, pBinIndex) {
        return pDevice.bins().getAt(pBinIndex).get("iconID");
    },

    /**
     * Returns the iconID for J5Bin at pBinIndex. (Indices begin at 0.)
     * @param {Teselagen.models.DeviceDesign} pDevice
     * @param {Number} pBinIndex
     * @param {String} pIconIDName
     */
    setIconIDByBinIndex: function(pDevice, pBinIndex, pIconIDName) {
        pDevice.bins().getAt(pBinIndex).set("iconID", pIconIDName);
    },

    /**
     * Returns the bin at pBinIndex. (Indices begin at 0.)
     * @param {Teselagen.models.DeviceDesign} pDevice
     * @param {Number} pBinIndex
     * @returns {Teselagen.models.J5Bin}
     */
    getBinByIndex: function(pDevice, pBinIndex) {
        return pDevice.bins().getAt(pBinIndex);
    },

    /**
     * Gets one parent bin of a part.
     * @param {Teselagen.models.DeviceDesign} pDevice
     * @param {Teselagen.models.Part} pPart
     * @returns {Teselagen.models.J5Bin}
     */
    getBinByPart: function(pDevice, pPart) {
        var parentIndex = this.getBinAssignment(pDevice, pPart);

        return this.getBinByIndex(pDevice, parentIndex);
    },

    /**
     * Gets all bins which contain a part.
     * @param {Teselagen.models.DeviceDesign} pDevice
     * @param {Teselagen.models.Part} pPart
     * @returns {Teselagen.models.J5Bin[]}
     */
    getParentBins: function(pDevice, pPart) {
        var bins = [];
        var binIndices = this.getOwnerBinIndices(pDevice, pPart);

        for(var i = 0; i < binIndices.length; i++) {
            bins.push(this.getBinByIndex(pDevice, binIndices[i]));
        }

        return bins;
    },

    /**
     * Gets the bin which owns a specific parts store.
     * @param {Teselagen.models.DeviceDesign} pDevice
     * @param {Teselagen.models.Part} pPart
     * @returns {Teselagen.models.J5Bin[]}
     */
    getBinByCellsStore: function(pDevice, pStore) {
        var bins = pDevice.bins().getRange();
        var ownerBin;

        for(var i = 0; i < bins.length; i++) {
            ownerBin = bins[i];
            if(ownerBin.cells() === pStore) {
                return ownerBin;
            }
        }
    },

    /**
     * Returns the bin's name at pBinIndex. (Indices begin at 0.)
     * @param {Teselagen.models.DeviceDesign} pDevice
     * @param {Number} pBinIndex
     * @returns {Teselagen.models.J5Bin}
     */
    getBinNameByIndex: function(pDevice, pBinIndex) {
        return pDevice.bins().getAt(pBinIndex).get("binName");
    },

    /**
     * Returns the index of a J5Bin. (Indices begin at 0.)
     * @param {Teselagen.models.DeviceDesign} pDevice
     * @param {Teselagen.models.J5Bin} pJ5Bin
     */
    getBinIndex: function(pDevice, pJ5Bin) {
        return pDevice.bins().indexOf(pJ5Bin);
    },
    /**
     * Determines if pBinName is a unique J5Bin name in the collection.
     * @param {Teselagen.models.DeviceDesign} pDevice
     * @param {String} pBinName
     * @returns {Boolean}
     */
    isUniqueBinName: function(pDevice, pBinName){
        return pDevice.isUniqueBinName(pBinName);
    },
    /**
     * Sets the name for a bin, by the bin's index.
     * @param {Teselagen.models.DeviceDesign} pDevice
     * @param {Number} pBinIndex
     * @param {String} pBinName New name for bin
     * @returns {Boolean} True if successful.
     */
    setBinName: function(pDevice, pBinIndex, pBinName){
        var unique = this.isUniqueBinName(pDevice, pBinName);
        if (!unique) {
            throw Ext.create("Teselagen.bio.BioException", {
                message: "Teselagen.models.J5Bin.setBinName(): File name already exists in Design."
            });
        }
        var bin = pDevice.bins().getAt(pBinIndex);
        bin.set("binName", pBinName);

        return true;
    },
    /**
     * Add a bin to the collection at specified index.
     * @param {Teselagen.models.DeviceDesign} pDevice
     * @param {Teselagen.models.J5Bin} pJ5Bin
     * @param {Number} pIndex
     * @returns {Boolean} True if successful, false if not.
     */
    addBin: function(pDevice, pJ5Bin, pIndex) {
        var unique = this.isUniqueBinName(pDevice, pJ5Bin.get("binName"));
        if (!unique) {
            throw Ext.create("Teselagen.bio.BioException", {
                message: "Teselagen.models.J5Bin.addBin(): File name already exists in Design."
            });
        }

        var success = pDevice.bins().insert(pIndex, pJ5Bin);
        return success;
    },
    /**
     * Add an empty bin to the collection, by index.
     * @param {Teselagen.models.DeviceDesign} pDevice
     * @param {Number} pIndex
     * @param, {String} [pName] Optional
     */
    addEmptyBinByIndex: function(pDevice, pIndex, pName) {
        var success = pDevice.addNewBinByIndex(pIndex, pName);

        return success;
    },
    /**
     * Remove a bin from a collection.
     * @param {Teselagen.models.DeviceDesign} pDevice
     * @param {Teselagen.models.J5Bin} pJ5Bin
     */
    removeBin: function(pDevice, pJ5Bin) {
        var success = pDevice.bins().remove(pJ5Bin);
        return success;
    },
    /**
     * Remove a bin from a collection by index.
     * @param {Teselagen.models.DeviceDesign} pDevice
     * @param {Number} pIndex
     */
    removeBinByIndex: function(pDevice, pIndex) {
        var success = pDevice.bins().removeAt(pIndex);
        return success;
    },


    /**
     * Returns the number of non-empty parts in a bin, given its index.
     * @param {Teselagen.models.DeviceDesign} pDevice
     * @param {Number} pBinIndex Index of bin.
     * @returns {Number} Count of parts in a bin
     */
    nonEmptyPartCount: function(pDevice, pBinIndex) {
        var bin = pDevice.bins().getAt(pBinIndex);
        var count = 0;
        for (var i = 0; i < bin.cells().count(); i++) {
            if (!bin.cells().getAt(i).get("part_id")) {
                count += 1;
            }
        }
        return count;
    },
    /**
     * Returns the number of Parts in a J5Bin, empty or not.
     * @param {Teselagen.models.DeviceDesign} pDevice
     * @return {Number} Number of parts
     */
    partCount: function(pDevice, pBinIndex) {
        return pDevice.bins().getAt(pBinIndex).cells().count();
    },
    /**
     * Returns the part given a bin index and part index.
     * @param {Teselagen.models.J5Bin} pJ5Bin
     * @param {Number} pBinIndex Bin index in collection.
     * @param {Number} pPartIndex Part index in bin.
     * @returns {Teselagen.models.Part}
     */
    getPartByBin: function(pDevice, pBinIndex, pPartIndex) {
        return pDevice.bins().getAt(pBinIndex).cells().getAt(pPartIndex).getPart();
    },


    //================================================================
    // Parts management
    //================================================================
    // Todo: move optional arguments to the end of parameter list
    /**
     * Create a Part and add to design. Optional parameters require a "null" in its place.
     * Executes validation.
     *
     * @param {Teselagen.models.DeviceDesign} device Device design
     * @param {Number} binIndex j5 bin index
     * @param {String} name Name of Part
     * @param {int} start Genbank start index
     * @param {int} end Genbank end index
     * @param {Boolean} [revComp] Reverse Complement. Default is false.
     * @param {Boolean} [directionForward] Direction Forward. Default is true.
     * @param {Number} [position] Location for inserting the Part.  Undefined or null will append.
     * @param {String} fas FAS for the part
     * @param {String} iconID (?)
     */
    createPart: function(pDevice, pBinIndex, pName, pStart, pEnd, pRevComp, pDirectionForward, pPos, pFas, pIconID) {
        var part = Ext.create("Teselagen.models.Part", {
            name: pName,
            genbankStartBP: pStart,
            endBP: pEnd,
            revComp: pRevComp,
            directionForward: pDirectionForward,
            iconID: pIconID
        });

        // GO BACK AND FIX THIS VALIDATOR
        var err = part.validate();
        if (err.length > 0) {
            //console.warn("Creating Part: " + err.length + " errors found.");
            //console.warn(err);
        }
        this.addPartToBin(pDevice, part, pBinIndex, pPos, pFas);

        return part;
    },
    /**
     * Gets all parts in the given device as a store.
     * @param {Teselagen.models.DeviceDesign} pDevice
     * @returns {Store} Store of parts.
     */
    getAllPartsAsStore: function(pDevice, pExcept) {
        allParts = Ext.create('Ext.data.Store', {
            model: 'Teselagen.models.Part'
        });

        allParts.add(pDevice.parts().getRange());

        return allParts;
    },
    /**
     * Gets all parts in the given device. If the optional parameter pExcept is
     * defined as a part, returns all parts except that part.
     * @param {Teselagen.models.DeviceDesign} pDevice
     * @param {Teselagen.models.Part} pExcept
     * @returns {Array} Array of all parts except for pExcept.
     */
    getAllParts: function(pDevice, pExcept) {
        var allParts = pDevice.parts().getRange();

        if(pExcept && pExcept.$className === "Teselagen.models.Part") {
            allParts.splice(allParts.indexOf(pExcept), 1);
        }

        return allParts;
    },
    /**
     * Determines if a Part is in the Collection.
     * @param {Teselagen.models.DeviceDesign} pDevice
     * @param {Teselagen.models.Part} pPart
     * @returns {Boolean} True if pPart is present
     */
    isPartInCollection: function(pDevice, pPart) {
        var partIsPresent = false;
        var binsStore = pDevice.bins();

        if (!pPart || binsStore === null || binsStore.count() === 0) {
            return false;
        }

        var binsArray = binsStore.getRange();

        for (var i = 0; i < binsArray.length; i++) {
            partIsPresent = this.getBinAssignment(pDevice, binsArray[i]) !== -1;

            if (partIsPresent) {
                return partIsPresent;
            }
        }

        return partIsPresent;
    },

    /**
     * Determines bin that pCell is in and returns its index.
     * @param {Teselagen.models.DeviceDesign} pDevice
     * @param {Teselagen.models.Cell} pCell
     * @returns {Number} Index of bin.
     */
    getCellBinAssignment: function(pDevice, pCell) {
        var bins = pDevice.bins().getRange();

        for(var i = 0; i < bins.length; i++) {
            if(bins[i].cells().indexOf(pCell) >= 0) {
                return i;
            }
        }
    },

    /**
     * Determines (first) bin that pPart is in and returns its index.
     * @param {Teselagen.models.DeviceDesign} pDevice
     * @param {Teselagen.models.Part} pPart
     * @returns {Number} Index of bin.
     */
    getBinAssignment: function(pDevice, pPart) {
        var binIndex = -1;
        var bins = pDevice.bins().getRange();

        for (var i = 0; i < bins.length; i++) {
            var cells = bins[i].cells().getRange();

            for(var j = 0; j < cells.length; j++) {
                if (pPart.get("id") === cells[j].get("part_id")) {
                    return cells[j].get("index");
                }
            }
        }

        return binIndex;
    },

    /**
     * Gets the indices of all bins that contain a given part.
     * @param {Teselagen.models.DeviceDesign} pDevice
     * @param {Teselagen.models.Part} pPart
     * @returns {Number[]} Array of indices of all owner bins.
     */
    getOwnerBinIndices: function(pDevice, pPart) {
        var binIndices = [];
        var binsStore = pDevice.bins();
        var partsStore;
        if(!pPart) {
            return [];
        }
        for(var i = 0; i < binsStore.getCount(); i++) {
            partsStore = binsStore.getAt(i).cells();

            for(var j = 0; j < partsStore.getCount(); j++) {
                if(partsStore.getAt(j) && partsStore.getAt(j).get("part_id") && pPart.get("id")) {
                    if(partsStore.getAt(j).get("part_id") === pPart.get("id")) {
                        binIndices.push(i);
                    }
                }
            }
        }

        return binIndices;
    },
    /**
     * Determines if a given part name is unique.
     * @param {Teselagen.models.DeviceDesign} pDevice
     * @param {String} pPartName
     * @returns {Boolean}
     */
    isUniquePartName: function(pDevice, pPartName) {
        var unique = true;
        for (var i =0; i < pDevice.bins().count(); i++) {
            unique = pDevice.bins().getAt(i).isUniquePartName(pPartName);
            if (unique === false) {
                return unique;
            }
        }
        return true;
    },
    /** NOT TESTED--CANT UNTIL DB IS DONE
     * Get a part given its Part ID
     * @param {Teselagen.models.DeviceDesign} pDevice
     * @param {Long}  pPartId
     * @returns {Teselagen.models.Part}
     */
    getPartById: function(pDevice, pPartId) {
        var part = pDevice.getPartById(pPartId);
        return part;
    },
    /**
     * Get a part by its name
     * @param {Teselagen.models.DeviceDesign} pDevice
     * @param {String} pPartName
     * @returns {Teselagen.models.Part}
     */
    getPartByName: function(pDevice, pPartName) {
        return pDevice.parts().data.findBy(function(part) {if(part.get("name")===pPartName) return true;});
    },
    /**
     * Add a Part to a J5Bin
     * @deprecated
     * @param {Teselagen.models.DeviceDesign} device
     * @param {Teselagen.models.Part} part
     * @param {Number} binIndex Bin index (0 <= i < n-1). If invalid, issues warning.
     * @param {Number} [position] Location for inserting the Part.  Undefined or null will append.
     * @param {String} [fas] FAS for the part. Defaults to "None".
     * @returns {Boolean} True if part was added.
     */
    addPartToBin: function(pDevice, pPart, pBinIndex, pPosition, pFas) {
        var j5Bin;
        var added = false;
        var cnt = pDevice.bins().count();
        if (pBinIndex >= 0 && pBinIndex < cnt) {
            j5Bin = pDevice.bins().getAt(pBinIndex);
            added = j5Bin.addToParts(pPart, pPosition, pFas);
        } else {
//            j5Bin = pDevice.bins().getAt(cnt);
            console.warn("Part not added due to invalid bin index:", pBinIndex);
        }
        return added;
    },
    /**
     * Deletes a Part after checking if a EugeneRule should also be deleted.
     * All Parts are from a collection, so removing from a J5Bin on removes the Part's link.
     * No need to actually delete SequenceFiles or Parts.
     * @param {Teselagen.models.DeviceDesign} pDevice
     * @param {Teselagen.models.Part} pPart Part to be deleted.
     * @param {Number} pBinIndex
     * @returns {Boolean} True if removed, false if not.
     */
    removePartFromBin: function(pDevice, pPart, pBinIndex) {
        var j5Bin;
        var cnt = pDevice.bins().count();

        if (pBinIndex >= 0 && pBinIndex < cnt) {
            j5Bin = pDevice.bins().getAt(pBinIndex);
        } else {
            j5Bin = pDevice.bins().getAt(cnt);
        }
        var deleted = j5Bin.deletePart(pPart, pDevice);
        return deleted;
    },

    /**
     * Returns index of given part in bin.
     * @param {Teselagen.models.Bin} bin
     * @param {Teselagen.models.Part} part
     * @returns {Number} Index of part or -1 if not found.
     */
    getPartIndex: function(pBin, pPart) {
        var index = -1;
        var cells = pBin.cells().getRange();

        for(var i = 0; i < cells.length; i++) {
            if(cells[i].get("part_id") === pPart.get("id")) {
                index = i;
            }
        }

        return index;
    },

    /**
     * Set the Start index for a Part
     * @param {Teselagen.models.Part} pPart
     * @param {Number} pStart The start index, from 1 to length of the sequence, to set the start BP.
     */
    setPartStart: function(pPart, pStart) {
        pPart.setStart(pStart);
    },

    /**
     * Get Start Index for a Part
     * @param {Teselagen.models.Part} pPart
     * @returns {Number}
     */
    getPartStart: function(pPart) {
        return pPart.getStart();
    },

    /**
     * Set the End index for a Part
     * @param {Teselagen.models.Part} pPart
     * @param {Number} [pEnd] If undefined, will set to length of sequence.
     */
    setPartEnd: function(pPart, pEnd) {
        if (pEnd === undefined || pEnd === null) {
            var len = pPart.getSequenceFile().getLength();
            pPart.setEnd(len);
        } else {
            pPart.setEnd(pEnd);
        }
    },

    /**
     * Get End Index
     * @param {Teselagen.models.Part} pPart
     * @returns {Number}
     */
    getPartEnd: function(pPart) {
        return pPart.getEnd();
    },

    //================================================================
    // SequenceFile Management
    // Use methods to obtain the part you want to manipulate.
    //================================================================

    /**
     * Create a SequenceFile. Optional parameters require an empty string "" in its place.
     * Executes validation.
     *
     * @param {Teselagen.models.DeviceDesign} pDevice
     * @param {String} pSequenceFileFormat "Genbank", "FASTA", or "jbei-seq". Case insensitive.
     * @param {String} pSequenceFileContent The content of the file in string form
     * @param {String} [pSequenceFileName] If null, will generate a name based on the File Content and Format
     * @param {String} [pPartSource] If null, will generate a display ID based on the File Content and Format
     */
    createSequenceFile: function(pDevice, pPart, pSequenceFileFormat, pSequenceFileContent, pSequenceFileName, pPartSource) {

        var unique = this.isUniquePartName(pDevice, pSequenceFileName);
        if (!unique) {
            throw Ext.create("Teselagen.bio.BioException", {
                message: "Teselagen.models.SequenceFile: File name already exists in Design."
            });
        }

        var seq = Ext.create("Teselagen.models.SequenceFile", {
            sequenceFileFormat: pSequenceFileFormat,
            sequenceFileContent: pSequenceFileContent,
            sequenceFileName: pSequenceFileName,
            partSource: pPartSource
        });

        // GO BACK AND FIX THIS VALIDATOR
        var err = seq.validate();
        if (err.length > 0) {
            console.warn("Creating Part: " + err.length + " errors found.");
            console.warn(err);
        }

        pPart.setSequenceFile(seq); // put this here
        return seq;
    },

    /**
     * Create a standalone SequenceFile not belonging to a DeviceDesign.
     * Optional parameters require an empty string "" in its place.
     * Executes validation.
     *
     * @param {String} pSequenceFileFormat "Genbank", "FASTA", or "JBEISEQXML". Case insensitive.
     * @param {String} pSequenceFileContent The content of the file in string form
     * @param {String[]} pSequenceFileName If null, will generate a name based on the File Content and Format
     * @param {String[]} pPartSource If null, will generate a display ID based on the File Content and Format
     */
    createSequenceFileStandAlone: function(pSequenceFileFormat, pSequenceFileContent, pSequenceFileName, pPartSource) {
        var seq = Ext.create("Teselagen.models.SequenceFile", {
            sequenceFileFormat: pSequenceFileFormat,
            sequenceFileContent: pSequenceFileContent,
            sequenceFileName: pSequenceFileName,
            partSource: pPartSource,
            name: pPartSource
        });

        // GO BACK AND FIX THIS VALIDATOR
        var err = seq.validate();
        if (err.length > 0) {
            console.warn("Creating Part: " + err.length + " errors found.");
            console.warn(err);
        }

        return seq;
    },

    /**
     * Given a Part, get the SequenceFile. (pDevice is not used.)
     * @param {Teselagen.models.DeviceDesign} pDevice
     * @param {String} pPartName
     * @returns {Teselagen.models.SequenceFile}
     */
    getSequenceFileByPartName: function(pDevice, pPartName) {
        var part = this.getPartByName(pDevice, pPartName);
        return part.getSequenceFile();
    },
    /**
     * Given a Part, get the SequenceFile.
     * @param {Teselagen.models.Part} pPart
     * @returns {Teselagen.models.SequenceFile}
     */
    getSequenceFileByPart: function(pPart) {
        return pPart.getSequenceFile();
    },

    /**
     * Given a Part, get the SequenceFile.
     * @param {Teselagen.models.Part} pPart
     * @param {Teselagen.models.SequenceFile} pSequenceFile
     * @returns {Teselagen.models.Part}
     */
    setSequenceFileByPart: function(pPart, pSequenceFile) {
        //console.log(pPart.getSequenceFile().get("sequenceFileName"));
        //console.log(pSequenceFile.get("sequenceFileName"));
        pPart.setSequenceFile(pSequenceFile);
        return pPart;
    },
    /**
     * Removes the SequenceFile in a Part and replaces it with an empty Part.
     * @param {Teselagen.models.Part} pPart
     * @returns {Teselagen.models.Part}
     */
    removeSequenceFileByPart: function(pPart) {
        return pPart.removeSequenceFile();
    },

    /**
     * Sets the SequenceFile Content and also resets the hash for it.
     * NOTE: Does not reset the sequenceFileName or the partSource properties.
     *
     * @param {Teselagen.models.SequenceFile} pSequenceFile
     * @param {String} pContent
     * @return {Teselagen.models.SequenceFile}
     */
    setSequenceFileContent: function(pSequenceFile, pContent) {
        pSequenceFile.setSequenceFileContent(pContent);
        return pSequenceFile;
    },
    /**
     * Sets the partSource for a SequenceFile.
     * NOTE: Does not reset any other properties.
     *
     * @param {Teselagen.models.SequenceFile} pSequenceFile
     * @param {String} pPartSource
     * @return {Teselagen.models.SequenceFile}
     */
    setPartSource: function(pSequenceFile, pPartSource) {
        return pSequenceFile.setPartSource(pPartSource);
    },
    /**
     * Sets the sequenceFileName for a SequenceFile.
     * NOTE: Does not reset any other properties.
     *
     * @param {Teselagen.models.SequenceFile} pSequenceFile
     * @param {String} pSequenceFileName
     * @return {Boolean} True if name is set, false if not. (Throw an error if not set?)
     */
    setSequenceFileName: function(pSequenceFile, pSequenceFileName) {
        return pSequenceFile.setSequenceFileName(pSequenceFileName);
    },


    /** THIS IS INCOMPLETE. ONLY TESTED FOR FASTA. GO BACK FOR GENBANK AND JBEISEQ AND SBOL.
     * Get Length of Sequence.
     * @param {Teselagen.models.SequenceFile}
     */
    getSequenceLength: function(pSequenceFile) {
        return pSequenceFile.getLength();
    },



    //================================================================
    // Helper Functions
    //================================================================

    /** REFACTOR INTO FormatUtils.js?
     * Finds reverse complement of a sequence.
     * @param {String} pSeq
     * @returns {String} reverse complement sequence
     */
    reverseComplement: function(pSeq) {
        return Teselagen.utils.FormatUtils(pSeq);
        /*var revComp = [];
        pSeq = pSeq.toLowerCase();

        for (var i = pSeq.length-1; i >= 0; i--) {
            switch (pSeq.charAt(i)) {
                case "a":
                    revComp.push("t");
                    break;
                case "c":
                    revComp.push("g");
                    break;
                case "g":
                    revComp.push("g");
                    break;
                case "t":
                    revComp.push("a");
                    break;
            }
        }
        return revComp.join("");*/
    },

    /**
     * Determines if string is only alphanumeric with underscores "_" or hyphens "-".
     * Calls Teselagen.utils.NameUtils.isLegalName()
     * @param {String} pName
     * @returns {Boolean}
     */
    isLegalName: function(pName) {
        return Teselagen.utils.NameUtils.isLegalName(pName);
        /*if (pName.match(/[^a-zA-Z0-9_\-]/) !== null) {
            return false;
        } else {
            return true;
        }*/
    },

    /**
     * Reformat name to be only alphanumeric with underscores "_" or hyphens "-".
     * Calls Teselagen.utils.NameUtils.reformatName().
     * @param {String} pName
     * @returns {String} New name.
     */
    reformatName: function(pName) {
        return Teselagen.utils.NameUtils.reformatName(pName);
        //return pName.replace(/[^a-zA-Z0-9_\-]/g, "");
    }

});
