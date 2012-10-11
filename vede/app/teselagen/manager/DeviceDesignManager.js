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

    /** NEEDS TESTING
     * Checks if J5Collection is combinatorial: There are more than one
     * Part in a J5Bin.
     * @param {Teselagen.models.J5Collection} pJ5Collection
     * @returns {Boolean}
     */
    checkCombinatorial: function(pJ5Collection) {
        var combo   = false;

        if (pJ5Collection === null || pJ5Collection === undefined) {
            return combo;
        }

        if (pJ5Collection.bins() === null || pJ5Collection.bins() === undefined) {
            return combo;
        }

        for (var i = 0; i < pJ5Collection.bins().count(); i++) {
            if (pJ5Collection.bins().getAt(i).parts().count() > 1) {
                combo = true;
            }
        }
        pJ5Collection.set("combinatorial", combo);
        return combo;
    },

    /** NEEDS TESTING
     * Checks if each J5Bin has at least one Part and one accompanying SequenceFile.
     * Sets j5Read flag on collection: true if conditions are true, false if not.
     * @param {Teselagen.models.J5Collection} pJ5Collection
     * @returns {Boolean}
     */
    checkJ5Ready: function(pJ5Collection) {
        var ready = true;

        if (pJ5Collection === null || pJ5Collection === undefined) {
            return false;
        }

        if (pJ5Collection.bins() === null || pJ5Collection.bins() === undefined) {
            return false;
        }
        var bins = pJ5Collection.bins();

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
                if (Ext.getClassName(parts.getAt(j).get("sequenceFile")) !== "Teselagen.models.SequenceFile") {
                    ready = false;
                }

                if (parts.getAt(i).isEmpty() === true) {
                    ready = false;
                }
            }
        }
        pJ5Collection.set("j5Ready", ready);
        return ready;
    },

    /** NEEDS TESTING
     * @param {Teselagen.models.J5Bin} pJ5Bin
     * @returns {int}
     */
    countNonEmptyParts: function(pJ5Bin) {
        var count = 0;
        for (var i = 0; i < pJ5Bin.parts().count(); i++) {
            if (!pJ5Bin.parts().getAt(i).isEmpty()) {
                count += 1;
            }
        }
        return count;
    },


    parseSeqCsv: function(pCsv) {

    },

    parsePartCsv: function(pCsv) {

    },

    parseTargetCsv: function(pCsv) {

    },

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

    isLegalName: function(pName) {
        if (pName.match(/[^a-zA-Z0-9_\-]/) !== null) {
            return false;
        } else {
            return true;
        }
    }




});