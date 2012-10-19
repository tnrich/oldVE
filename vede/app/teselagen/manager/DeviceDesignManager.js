/**
 * @class Teselagen.manager.DeviceDesignManager
 * Class describing a DeviceDesignManager.
 * DeviceDesignManager holds an array of SequenceFiles, for a given design project.
 *
 * Originally  FunctionMediator.as, SaveDesignXMLCommand.as
 * @author Diana Wong
 * @author Douglas Densmore (original author) ?
 */
Ext.define("Teselagen.manager.DeviceDesignManager", {

    singleton: true,

    requires: [
        "Teselagen.bio.util.Sha256",
        "Teselagen.constants.Constants"
    ],

    proxy: {
        type: "memory"
    },

    statics: {
        //NAME: "SequenceFileProxy"
    },

    Sha256: null,
    Constants: null,

    config: {
        sequenceFiles: []
    },

    constructor: function() {
        //his.Sha256          = Teselagen.bio.util.Sha256;
        //this.Constants       = Teselagen.constants.Constants;
    },


    //================================================================
    // DeviceDesign management
    //================================================================

    createDeviceDesign: function(pNumBins) {
        var device = Ext.create("Teselagen.models.DeviceDesign");
        device.createNewCollection(pNumBins);
        return device;
    },

    createNewCollection: function(pDesign, pNumBins) {
        return pDesign.createNewCollection(pNumBins);
    },

    addToRules: function(pDesign, pRule) {
        return pDesign.addToRules(pRule);
    },

    removeFromRules: function(pDesign, pRule) {
        return pDesign.removeFromRules(pRule);
    },

    removeAllRules: function(pDesign) {
        return pDesign.removeAllRules();
    },

    getRulesInvolvingPart: function(pDesign, pPart) {
        return pDesign.getRulesInvolvingPart(pPart);
    },

    getRuleByName: function(pDesign, pName) {
        return pDesign.getRuleByName(pName);
    },

    isUniqueRuleName: function(pDesign, pName) {
        return pDesign.isUniqueRuleName(pName);
    },


    //================================================================
    // J5Collection management
    //================================================================

    createEmptyJ5Collection: function(pDesign, pNumBins, pIsCircular) {
        var collection = Ext.create("Teselagen.models.J5Collection", {
            isCircular: pIsCircular
        });

        collection.createEmptyCollection(pNumBins);

        pDesign.setJ5Collection(collection);
        return collection;
    },

    isCircular: function(pDevice) {
        return pDevice.getJ5Collection().isCircular();
    },

    binCount: function(pDevice) {
        return pDevice.getJ5Collection().binCount();
    },

    /** NEEDS TESTING
     * Checks if J5Collection is combinatorial: There are more than one
     * Part in a J5Bin.
     * @param {Teselagen.models.DeviceDesign}
     * @returns {Boolean}
     */
    checkCombinatorial: function(pDesign) {
        var collection = pDesign.getJ5Collection();
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
    findMaxNumParts: function(pDesign) {
        var collection = pDesign.getJ5Collection();
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
     * @param {Teselagen.models.DeviceDesign} pDesign
     * @returns {Boolean}
     */
    checkJ5Ready: function(pDesign) {
        var collection = pDesign.getJ5Collection();
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
            var parts = bins.getAt(i);
            for (var j = 0; j < parts.count(); j++) {
                // CHANGE THIS ACCORDING TO HOW SEQUENCEFILE IS STORED IN PARTS
                if (Ext.getClassName(parts.getAt(j).getSequenceFile()) !== "Teselagen.models.SequenceFile") {
                    ready = false;
                }
                if (parts.getAt(i).isEmpty() === true) {
                    ready = false;
                }
            }
        }
        collection.set("j5Ready", ready);
        return ready;
    },
    //================================================================
    // J5Bin management
    //================================================================

    createEmptyJ5Bin: function(pDevice, pIndex, pBinName) {
        var bin = Ext.create("Teselagen.models.J5Bin", {
            binName: pBinName
        });

        pDevice.getJ5Collection().addToBin(bin, pIndex);
        return bin;
    },

    getBinIndex: function(pDevice, pJ5Bin) {
        return pDevice.getJ5Collection().getBinIndex(pJ5Bin);
    },

    isUniqueBinName: function(pDevice, pName){
        return pDevice.getJ5Collection().isUniqueBinName(pName);
    },

    addBin: function(pDevice, pIndex, pJ5Bin) {
        var success = pDevice.getJ5Collection().addToBin(pJ5Bin, pIndex);
        return success;
    },

    addBinByIndex: function(pDevice, pIndex) {
        var success = pDevice.getJ5Collection().addNewBinByIndex(pIndex);
        return success;
    },

    removeBin: function(pDevice, pJ5Bin) {
        var success = pDevice.getJ5Collection().removeFromBin(pJ5Bin);
        return success;
    },

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

    //addPart


    //================================================================
    // Parts/SequenceFile management
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
    createPart: function(pName, pStart, pEnd, pRevComp, pDirectionForward, pFas, pIconID) {
        var part = Ext.create("Teselagen.models.J5Bin", {
            name: pName,
            genbankStartBP: pStart,
            endBP: pEnd,
            revComp: pRevComp,
            directionForward: pDirectionForward,
            fas: pFas,
            iconID: pIconID
        });
        return part;
    },

    /**
     * Create a SequenceFile. Optional parameters require an empty string "" in its place.
     * @param {String} pSequenceFileFormat "Genbank", "FASTA", or "jbei-seq"
     * @param {String} pSequenceFileContent The content of the file in string form
     * @param {[String]} pSequenceFileName If null, will generate a name based on the File Content and Format
     * @param {[String]} pPartSource If null, will generate a display ID based on the File Content and Format
     */
    createSequenceFile: function(pSequenceFileFormat, pSequenceFileContent, pSequenceFileName, pPartSource) {
        var seq = Ext.create("Teselagen.models.SequenceFile", {
            sequenceFileFormat: pSequenceFileFormat,
            sequenceFileContent: pSequeneceFileContent,
            sequenceFileName: pSequenceFileName,
            partSource: pPartSource
        });
        return seq;
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
    }




});