/**
 * @class Teselagen.models.J5Collection
 * Class describing a J5Collection.
 * @author Diana Wong
 * @author Douglas Densmore (original author)
 */
Ext.define("Teselagen.models.J5Collection", {
    extend: "Ext.data.Model",

    requires: [
        //"Teselagen.models.DeviceDesign",
        "Teselagen.models.J5Bin"
    ],

    proxy: {
        type: "memory"
    },

    statics: {
    },

    /**
     * Input parameters.
     * @param {Ext.data.bins} bins A store of many {@link Teselagen.models.J5Bin}
     * @param {Boolean} j5Ready
     * @param {Boolean} combinatorial
     * @param {Boolean} isCircular
     */
    fields: [
        {name: "id",                type: "int"},
        {name: "j5Ready",           type: "boolean",    defaultValue: false},
        {name: "combinatorial",     type: "boolean",    defaultValue: false},
        {name: "isCircular",        type: "boolean",    defaultValue: true},
        {name: "deviceDesign_id",   type: "int"}
    ],

    // GO BACK AND FIX THESE VALIDATIONS. CURRENTLY FAILS. IF NOT SET TO NON-DEFAULT, IT BECOMES AN ERROR
    validations: [
        //{field: "j5Ready",          type: "presence"},
        //{field: "combinatorial",    type: "presence"},
        //{field: "isCircular",       type: "presence"},
        {field: "deviceDesign_id",  type: "presence"}
    ],

    associations: [
        {
            type: "hasMany",
            model: "Teselagen.models.J5Bin",
            name: "bins"
        },
        {
            type: "belongsTo",
            model: "Teselagen.models.DeviceDesign",
            getterName: "getDeviceDesign",
            setterName: "setDeviceDesign",
            associationKey: "deviceDesign"
        }
    ],

    init: function() {
    },

    /**
     * @returns {Number} count Number of J5Bins in bins
     */
    binCount: function() {
        return this.bins().count();
    },

    /**
     * Creates an empty collection with the given number of bins.
     * @param {Number} pNumBins Number of empty bins to be created.
     * @returns {Ext.data.Store} Bins created.
     */
    createEmptyCollection: function(pNumBins) {
        if (this.binCount() > 0) {
            console.warn("Warning. Overwriting existing J5Collection's J5Bins");
        }
        for (var i = 0; i < pNumBins; i++) {
            var bin = Ext.create("Teselagen.models.J5Bin", {binName: "No_Name" + i});
            this.addToBin(bin, i);
        }
        return this.bins();
    },

    /**
     * Pushes a J5bin into the bins.
     * Original uses splice, but don't we want to insert it, not replace an item?
     * @param {Teselagen.models.J5Bin} pJ5Bin Bin to add to collection. Can be one or array of bins.
     * @param {Number} pIndex Index to insert pJ5Bin. Optional. Defaults to end of of array if invalid or undefined value.
     * @preturns {Boolean} True if added, False if not.
     */
    addToBin: function(pJ5Bin, pIndex) {
        var added = false;

        var cnt     = this.binCount();

        if (pIndex >= 0 && pIndex < cnt) {
            //this.bins().splice(pIndex, 0, pJ5Bin);
            this.bins().insert(pIndex, pJ5Bin);
        } else {
            //Ext.Array.include(this.bins(),pJ5Bin);
            this.bins().add(pJ5Bin);
        }

        var newCnt  = this.binCount();
        if (newCnt > cnt) {
            added = true;
        }
        return added;
    },

    /**
     * Removes a J5Bin from Collection.
     * @param {Teselagen.models.J5Bin} pJ5Bin Bin to remove to collection
     * @returns {Boolean} True if removed, False if not.
     */
    removeFromBin: function(pJ5Bin) {
        var removed = false;

        var cnt     = this.binCount();
        //Ext.Array.remove(this.bins(), pJ5Bin);
        this.bins().remove(pJ5Bin);

        var newCnt  = this.binCount();
        if (newCnt < cnt) {
            removed = true;
        }
        return removed;
    },

    // ===============================================
    // THE FOLLOWING COMES FROM J5CollectionProxy.as
    // It makes more sense to put these methods here.

    /**
     * @returns {Boolean} isCircular
     */
    isCircular: function() {
        return this.get("isCircular");
    },

    /**
     * Given a J5Bin, returns the index
     * @param {Teselagen.models.J5Bin} pJ5Bin
     * @returns {Number} Index of bin. -1 if not found.
     */
    getBinIndex: function(pJ5Bin) {
        var index = -1;

        for (var i = 0; i < this.bins().count(); i++) {
            if (pJ5Bin === this.bins().getAt(i)) {
                index = i;
            }
        }
        return index;
    },

    /**
     * Adds a default J5Bin given a name and index.
     * @param {String} pName
     * @param {Number} pIndex Index to insert new J5Bin. Optional. Defaults to end of of array if invalid or undefined value.
     * ///@returns {Teselagen.models.J5Bin}
     * @returns {Boolean} True if added, false if not.
     */
    addNewBinByIndex: function(pName, pIndex) {
        var added   = false;

        var j5Bin = Ext.create("Teselagen.models.J5Bin", {
            binName: pName
        });

        var cnt     = this.binCount();
        if (pIndex >= 0 && pIndex < this.bins().count()) {
            //this.bins().splice(pIndex, 0, j5Bin);
            this.bins().insert(pIndex, j5Bin);
        } else {
            //Ext.Array.include(this.bins(), j5Bin);
            this.bins().add(j5Bin);
        }

        var newCnt  = this.binCount();
        if (newCnt < cnt) {
            added = true;
        }

        // DW: NEED TO FIRE EVENT NEW_BIN_ADDED

        return added; //j5Bin;
    },

    /**
     * Remove a J5Bin by index.
     * @param {Number} pIndex Index of J5Bin. Optional. Defaults to last item of bin array if invalid or undefined value.
     * ////@param {Teselagen.models.J5Bin}
     * @returns {Boolean} True if deleted, false if not.
     */
    deleteBinByIndex: function(pIndex) {
        var deleted = false;

        var cnt     = this.binCount();
        if (pIndex >= 0 && pIndex < cnt) {
            //this.bins().splice(pIndex, 1); //Don't use slice
            this.bins().removeAt(pIndex);
        } else {
            this.bins().removeAt(cnt-1);
        }
        var newCnt  = this.binCount();
        if (newCnt < cnt) {
            deleted = true;
        }

        return deleted;
    },

    /** SHOULD BE REFACTORED TO DEVICE DESIGN MANAGER?
     * Adds a Part to the J5Bin specified by binIndex at the position specified,
     * or to the end of the J5Bin if no position specified.
     *
     * @param {Teselagen.models.Part} pPart The part to add to a J5Bin
     * @param {Number} pBinIndex The index of the J5Bin in which to add the part. Defaults to end of of array if invalid or undefined value.
     * @param {Number} pPosition The position within the bin at which to add the Part. Defaults to end of array if invalid or undefined value.
     * @returns {Boolean} True if added, False if not.
     */
    addPartToBin: function(pPart, pBinIndex, pPosition) {
        var j5Bin;
        var cnt = this.binCount();

        if (pBinIndex >= 0 && pBinIndex < cnt) {
            j5Bin = this.bins().getAt(pBinIndex);
        } else {
            j5Bin = this.bins().getAt(cnt);
        }

        var added = j5Bin.addToParts(pPart, pPosition);

        return added;
    },

    /** SHOULD BE REFACTORED TO DEVICE DESIGN MANAGER?
     * Adds a Part to the J5Bin specified by binIndex at the position specified,
     * or to the end of the J5Bin if no position specified
     *
     * @param {Teselagen.models.Part} pPart The part to add to a J5Bin
     * @param {Number} pBinIndex The index of the J5Bin in which to add the Part. Defaults to end of of array if invalid or undefined value.
     * @param {Number} pPosition The position within the J5Bin at which to add the Part. Defaults to end of array if invalid or undefined value.
     * @returns {Boolean} True if added, False if not.
     */
    removePartFromBin: function(pPart, pBinIndex) {
        var j5Bin;
        var cnt     = this.binCount();

        if (pBinIndex >= 0 && pBinIndex < cnt) {
            j5Bin = this.bins().getAt(pBinIndex);
        } else {
            j5Bin = this.bins().getAt(cnt);
        }

        var removed = j5Bin.removeFromParts(pPart);

        return removed;
    },

    /** SHOULD BE REFACTORED TO DEVICE DESIGN MANAGER?
     * @param {Teselagen.models.Part} pPart
     * @returns {Boolean} True is in the J5Bins, False if not.
     */
    isPartInCollection: function(pPart) {
        var partIsPresent = false;
        if (this.bins() === null || this.bins().count() === 0) {
            return false;
        }
        for (var i = 0; i < this.bins().count(); i++) {
            partIsPresent = this.bins().getAt(i).hasPart(pPart);
        }
        return partIsPresent;
    },

    /** SHOULD BE REFACTORED TO DEVICE DESIGN MANAGER?
     * Determines the J5Bin a Part is in.
     *
     * @param {Teselagen.models.Part} pPart The part whose J5Bin it belongs to.
     * @param {Teselagen.models.J5Bin} The first J5Bin Part belongs to, null if not in J5Collection.
     */
    getBinAssignment: function(pPart) {
        var bin = null;

        for (var i = 0; i < this.binCount(); i++) {
            var j5Bin = this.bins().getAt(i);
            for (var j = 0; j < j5Bin.partCount(); j++) {
                //if (j5Bin.parts().getAt(i) === pPart) {
                    if (j5Bin.parts().getAt(i).isEqual(pPart)) {
                    bin = j5Bin.parts().getAt(i);
                }
            }
        }
        return bin;
    },

    /**
     * Checks to see if a given name is unique within the J5Bins names.
     * @param {String} pName Name to check against bins.
     * @returns {Boolean} True if unique, false if not.
     */
    isUniqueBinName: function(pName) {
        var index = this.bins().find("binName", pName);

        if (index === -1) {
            return true;
        } else {
            return false;
        }
    }
});