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
        "Teselagen.constants.Constants"
    ],

    statics: {
        //NAME: "SequenceFileProxy"
    },

    constructor: function() {
    },


    //================================================================
    // DeviceDesign management
    //================================================================

    /**
     */
    createDeviceDesign: function(pNumBins) {
        var device = Ext.create("Teselagen.models.DeviceDesign");
        device.createNewCollection(pNumBins);

        var err = device.validate();
        if (err.length > 0) {
            console.warn("Creating DeviceDesign: " + err.length + " errors found.");
        }
        return device;
    },
    /**
     */
    addToRules: function(pDevice, pRule) {
        return pDevice.addToRules(pRule);
    },
    /**
     */
    removeFromRules: function(pDevice, pRule) {
        return pDevice.removeFromRules(pRule);
    },
    /**
     */
    removeAllRules: function(pDevice) {
        return pDevice.removeAllRules();
    },
    /**
     */
    getRulesInvolvingPart: function(pDevice, pPart) {
        return pDevice.getRulesInvolvingPart(pPart);
    },
    /**
     */
    getRuleByName: function(pDevice, pName) {
        return pDevice.getRuleByName(pName);
    },
    /**
     */
    isUniqueRuleName: function(pDevice, pName) {
        return pDevice.isUniqueRuleName(pName);
    },

    //================================================================
    // EugeneRules Management
    //================================================================
    /**
     */
    createEugeneRule: function(pDevice, pRuleName, pNegationOperator, pOperand1, pCompositionalOperator, pOperand2) {
        var rule = Ext.create("Teselagen.models.EugeneRule", {
            name: pRuleName,
            negationOperator: pNegationOperator,
            compositionalOperator: pCompositionalOperator,
            operand2: pOperand2
        });
        rule.setOperand1(pOperand1);

        var err = rule.validate();
        if (err.length > 0) {
            console.warn("Creating EugeneRule: " + err.length + " errors found.");
        }
        pDevice.addToRules(pRule); //put this here?
        return rule;
    },

    //================================================================
    // J5Collection Management
    //================================================================
    // ? keep this?
    /** Wipe out existing J5Collection
     */
    createNewCollection: function(pDevice, pNumBins) {
        return pDevice.createNewCollection(pNumBins);
    },
    /** Wipe out existing J5Collection.
     */
    createEmptyJ5Collection: function(pDevice, pNumBins, pIsCircular) {
        var collection = Ext.create("Teselagen.models.J5Collection", {
            isCircular: pIsCircular
        });

        collection.createEmptyCollection(pNumBins);

        var err = collection.validate();
        if (err.length > 0) {
            console.warn("Creating J5Collection: " + err.length + " errors found.");
        }

        pDevice.setJ5Collection(collection); //put this here?
        return collection;
    },
    /**
     */
    isCircular: function(pDevice) {
        return pDevice.getJ5Collection().isCircular();
    },
    /**
     */
    binCount: function(pDevice) {
        return pDevice.getJ5Collection().binCount();
    },

    /** NEEDS TESTING
     * Checks if J5Collection is combinatorial: There are more than one
     * Part in a J5Bin.
     * @param {Teselagen.models.DeviceDesign}
     * @returns {Boolean}
     */
    checkCombinatorial: function(pDevice) {
        var collection = pDevice.getJ5Collection();
        var combo   = false;

        if (collection === null || collection === undefined) {
            return combo;
        }

        if (collection.bins() === null || collection.bins() === undefined) {
            return combo;
        }

        for (var i = 0; i < collection.bins().count(); i++) {
            if (collection.bins().getAt(i).parts().count() > 1) {
                combo = true;
            }
        }
        collection.set("combinatorial", combo);
        return combo;
    },

    /** NEEDS TESTING
     * Finds the maximum number of parts in a bin in a collection.
     * @param {Teselagen.models.DeviceDesign}
     * @returns {int}
     */
    findMaxNumParts: function(pDevice) {
        var collection = pDevice.getJ5Collection();
        var num = 0;

        if (collection === null || collection === undefined) {
            return num;
        }

        if (collection.bins() === null || collection.bins() === undefined) {
            return num;
        }

        for (var i = 0; i < collection.bins().count(); i++) {
            if (collection.bins().getAt(i).parts().count() > num) {
                num = collection.bins().getAt(i).parts().count();
            }
        }
        return num;
    },

    /** NEEDS TESTING
     * Checks if each J5Bin has at least one Part and one accompanying SequenceFile.
     * Sets j5Read flag on collection: true if conditions are true, false if not.
     * @param {Teselagen.models.DeviceDesign} pDevice
     * @returns {Boolean}
     */
    checkJ5Ready: function(pDevice) {
        var collection = pDevice.getJ5Collection();
        var ready = true;

        if (collection === null || collection === undefined) {
            return false;
        }

        if (collection.bins() === null || collection.bins() === undefined) {
            return false;
        }
        var bins = collection.bins();

        for (var i = 0; i < bins.count(); i++) {
            if (bins.getAt(i).parts() === undefined) {
                return false;
            }
            if (bins.getAt(i).parts().count() < 1) {
                ready = false;
            }
            var parts = bins.getAt(i).parts();
            for (var j = 0; j < parts.count(); j++) {
                // CHANGE THIS ACCORDING TO HOW SEQUENCEFILE IS STORED IN PARTS
                if (Ext.getClassName(parts.getAt(j).getSequenceFile()) !== "Teselagen.models.SequenceFile") {
                    ready = false;
                }
                if (parts.getAt(j).isEmpty() === true) {
                    ready = false;
                }
            }
        }
        collection.set("j5Ready", ready);
        return ready;
    },
    /**
     */
    getBinByIndex: function(pDevice, pBinIndex) {
        return pDevice().getJ5Collection().bins().getAt(pBinIndex);
    },

    //================================================================
    // J5Bin management
    //================================================================
    /**
     */
    createEmptyJ5Bin: function(pDevice, pBinName, pIndex) {
        var unique = this.isUniqueBinName(pDevice, pBinName);
        if (!unique) {
            throw Ext.create("Teselagen.bio.BioException", {
                message: "Teselagen.models.J5Bin: File name already exists in Design."
            });
        }

        var bin = Ext.create("Teselagen.models.J5Bin", {
            binName: pBinName
        });

        bin.validate();

        pDevice.getJ5Collection().addToBin(bin, pIndex); // put this here?
        return bin;
    },
    /**
     */
    getBinIndex: function(pDevice, pJ5Bin) {
        return pDevice.getJ5Collection().getBinIndex(pJ5Bin);
    },
    /**
     */
    isUniqueBinName: function(pDevice, pName){
        return pDevice.getJ5Collection().isUniqueBinName(pName);
    },
    /**
     */
    addBin: function(pDevice, pJ5Bin, pIndex) {
        var unique = this.isUniqueBinName(pDevice, pBinName);
        if (!unique) {
            throw Ext.create("Teselagen.bio.BioException", {
                message: "Teselagen.models.J5Bin: File name already exists in Design."
            });
        }

        var success = pDevice.getJ5Collection().addToBin(pJ5Bin, pIndex);
        return success;
    },
    /**
     */
    addEmptyBinByIndex: function(pDevice, pIndex) {
        var success = pDevice.getJ5Collection().addNewBinByIndex(pIndex);
        return success;
    },
    /**
     */
    removeBin: function(pDevice, pJ5Bin) {
        var success = pDevice.getJ5Collection().removeFromBin(pJ5Bin);
        return success;
    },
    /**
     */
    removeBinByIndex: function(pDevice, pIndex) {
        var success = pDevice.getJ5Collection().deleteBinByIndex(pIndex);
        return success;
    },


    /** NEEDS TESTING
     * @param {Teselagen.models.J5Bin} pJ5Bin
     * @returns {int}
     */
    countNonEmptyParts: function(pDevice, pBinIndex) {
        var bin = pDevice.getJ5Collection().bins().getAt(pBinIndex);
        var count = 0;
        for (var i = 0; i < bin.parts().count(); i++) {
            if (!bin.parts().getAt(i).isEmpty()) {
                count += 1;
            }
        }
        return count;
    },
    /**
     */
    setBinName: function(pDevice, pJ5Bin, pBinName){
        var unique = this.isUniqueBinName(pDevice, pBinName);
        if (!unique) {
            throw Ext.create("Teselagen.bio.BioException", {
                message: "Teselagen.models.J5Bin: File name already exists in Design."
            });
        }

        pJ5Bin.set("binName", pBinName);
    },
    /**
     */
    getPartByBin: function(pJ5Bin, pPartIndex) {
        return pJ5Bin.parts().getAt(pPartIndex);
    },


    //================================================================
    // Parts management
    //================================================================
    /**
     * Create a Part. Optional parameters require a "null" in its place.
     * @param {String} pName
     * @param {int} pStart
     * @param {int} pEnd
     * @param {[Boolean]} pRevComp Reverse Complement. Default is false.
     * @param {[Boolean]} pDirectionForward Direction Forward. Default is true.
     * @param {String} fas (?)
     * @param {pIconID} pIconID (?)
     */
    createPart: function(pDevice, pBinIndex, pName, pStart, pEnd, pRevComp, pDirectionForward, pFas, pIconID) {
        var part = Ext.create("Teselagen.models.J5Bin", {
            name: pName,
            genbankStartBP: pStart,
            endBP: pEnd,
            revComp: pRevComp,
            directionForward: pDirectionForward,
            fas: pFas,
            iconID: pIconID
        });
        part.validate();

        pDevice.getJ5Collection().bins().getAt(pBinIndex).addToParts(part, -1); // put this here?
        return part;
    },
    /**
     */
    isPartInCollection: function(pDevice, pPart) {
        var partIsPresent = false;
        if (pDevice.getJ5Collection().bins() === null || pDevice.getJ5Collection().bins().count() === 0) {
            return false;
        }
        for (var i = 0; i < pDevice.getJ5Collection().bins().count(); i++) {
            partIsPresent = pDevice.getJ5Collection().bins().getAt(i).hasPart(pPart);
        }
        return partIsPresent;

        //return pDevice.isPartInCollection(pPart);
    },
    /**
     */
    getBinAssignment: function(pDevice, pPart) {
        var bin = null;
        for (var i = 0; i < pDevice.getJ5Collection().binCount(); i++) {
            var j5Bin = pDevice.getJ5Collection().bins().getAt(i);
            for (var j = 0; j < j5Bin.partCount(); j++) {
                if (j5Bin.parts().getAt(i) === pPart) {
                //if (j5Bin.parts().getAt(i).isEqual(pPart)) {
                    bin = j5Bin.parts().getAt(i);
                }
            }
        }
        return bin;
        //return pDevice.getBinAssignment(pPart);
    },
    /**
     */
    isUniquePartName: function(pDevice, pName) {
        var unique = true;
        for (var i =0; i < pDevice.getJ5Collection().binCount(); i++) {
            unique = pDevice.bins().getAt(i).isUniquePartName(pName);
            if (unique === false) {
                return unique;
            }
        }
        return true;
    },
    /**
     */
    getPartById: function(pDevice, pPartId) {
        var part, id;
        for (var i =0; i < pDevice.getJ5Collection().binCount(); i++) {
            var bin = pDevice.getJ5Collection().binCount().getAt(i);
            part = bin.getPartById(pId);
            //id = bin.parts().find("id", pId);
            if (part !== null) {
                return part;
            }
        }
        return part;
    },
    /**
     */
    getPartByName: function(pDevice, pPartName) {
        var part, id;
        for (var i =0; i < pDevice.getJ5Collection().binCount(); i++) {
            var bin = pDevice.getJ5Collection().binCount().getAt(i);
            part = bin.getPartByName(pName);
            if (part !== null) {
                return part;
            }
        }
        return part;
    },
    /**
     */
    addPartToBin: function(pDevice, pPart, pBinIndex, pPosition) {
        var j5Bin;
        var cnt = pDevice.binCount();

        if (pBinIndex >= 0 && pBinIndex < cnt) {
            j5Bin = pDevice.getJ5Collection().bins().getAt(pBinIndex);
        } else {
            j5Bin = pDevice.getJ5Collection().bins().getAt(cnt);
        }
        var added = j5Bin.addToParts(pPart, pPosition);
        return added;

        //return pDevice.addPartToBin(pPart, pBinIndex, pPosition);
    },

    /**
     * Deletes a Part after checking if a EugeneRule should also be deleted.
     * All Parts are from a collection, so removing from a J5Bin on removes the Part's link.
     * No need to actually delete SequenceFiles or Parts.
     * @param {Teselagen.models.Part} pPart Part to be deleted.
     * @param {Teselagen.manager.DeviceDesign}
     * @returns {Boolean} True if removed, false if not.
     */
    removePartFromBin: function(pDevice, pPart, pBinIndex) {
        var j5Bin;
        var cnt = pDevice.binCount();

        if (pBinIndex >= 0 && pBinIndex < cnt) {
            j5Bin = pDevice.getJ5Collection().bins().getAt(pBinIndex);
        } else {
            j5Bin = pDevice.getJ5Collection().bins().getAt(cnt);
        }
        //var removed = j5Bin.removeFromParts(pPart);
        var deleted = j5Bin.deletePart(pPart, pDevice);
        return deleted;

        //return pDevice.removePartFromBin(pPart, pBinIndex);
    },
    /**
     */
    getSequenceFileByPartName: function(pDevice, pPart) {
        var part = this.getPartByName(pDevice, PartName);
        return part.getSequenceFile();
    },
    /**
     */
    getSequenceFileByPart: function(pDevice, pPart) {
        return pPart.getSequenceFile();
    },

    //================================================================
    // SequenceFile Management
    // Use methods to obtain the part you want to manipulate.
    //================================================================

    /**
     * Create a SequenceFile. Optional parameters require an empty string "" in its place.
     * @param {String} pSequenceFileFormat "Genbank", "FASTA", or "jbei-seq"
     * @param {String} pSequenceFileContent The content of the file in string form
     * @param {[String]} pSequenceFileName If null, will generate a name based on the File Content and Format
     * @param {[String]} pPartSource If null, will generate a display ID based on the File Content and Format
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
            sequenceFileContent: pSequeneceFileContent,
            sequenceFileName: pSequenceFileName,
            partSource: pPartSource
        });
        seq.validate();

        pPart.setSequenceFile(seq); // put this here?
        return seq;
    },
    /**
     */
    addSequenceFile: function(pDevice, pPart, pSequenceFile) {
        var unique = this.isUniquePartName(pDevice, pSequenceFile.get("sequenceFileName"));
        if (!unique) {
            throw Ext.create("Teselagen.bio.BioException", {
                message: "Teselagen.models.SequenceFile: File name already exists in Design."
            });
        }

        return pPart.addSequenceFile(pSequenceFile);
    },
    /**
     */
    removeSequenceFile: function(pDevice, pPart) {
        return pPart.removeSequenceFile();
    },


    // Does not reset PartSource or SequenceFileName
    /**
     */
    setSequenceFileContent: function(pSequenceFile, pContent) {
        return pSequenceFile.setSequenceFileContent(pContent);
    },
    /**
     */
    setPartSource: function(pSequenceFile) {
        return pSequenceFile.setPartSource();
    },
    /**
     */
    setSequenceFileName: function(pDevice, pSequenceFile, pSequenceFileName) {
        var unique = this.isUniquePartName(pDevice, pSequenceFileName);
        if (unique) {
            pSequenceFile.set("sequenceFileName", pSequenceFileName);
        } else {
            throw Ext.create("Teselagen.bio.BioException", {
                message: "Teselagen.models.SequenceFile: File name already exists in Design."
            });
        }
    },

    //================================================================
    // CSV Readers --> Refactor to Parsers?
    //================================================================
    parseSeqCsv: function(pCsv) {

    },

    parsePartCsv: function(pCsv) {

    },

    parseTargetCsv: function(pCsv) {

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
        var revComp = [];
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
                    revComp.push("a");
                    break;
                case "t":
                    revComp.push("a");
                    break;
            }
        }
        return revComp.join("");
    },

    /**
     * Determines if string is only alphanumeric with underscores "_" or hyphens "-".
     * @param {String} pName
     * @returns {Boolean}
     */
    isLegalName: function(pName) {
        if (pName.match(/[^a-zA-Z0-9_\-]/) !== null) {
            return false;
        } else {
            return true;
        }
    },

    /**
     * Reformat name to be only alphanumeric with underscores "_" or hyphens "-".
     * @param {String} pName
     * @returns {String} New name.
     */
    reformatName: function(pName) {
        return pName.replace(/[^a-zA-Z0-9_\-]/g, "");
    }




});