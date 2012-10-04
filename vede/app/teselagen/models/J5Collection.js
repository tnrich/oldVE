/**
 * @class Teselagen.models.J5Collection
 * Class describing a J5Collection.
 * @author Diana Wong
 * @author Douglas Densmore (original author)
 */
Ext.define("Teselagen.models.J5Collection", {
    extend: "Ext.data.Model",

    requires: [
        "Teselagen.models.J5Bin"
    ],

    statics: {
    },

    /**
     * Input parameters.
     * @param {Teselagen.models.J5Bin[]} binsVector
     * @param {Boolean} j5Ready
     * @param {Boolean} combinatorial
     * @param {Boolean} isCircular
     */
    fields: [
        {
            name: "binsVector",
            convert: function(v, record) {
                return v || [];
            }
        },
        //{name: "binsVector",        type: "auto",       defaultValue: null},
        {name: "j5Ready",           type: "boolean",    defaultValue: false},
        {name: "combinatorial",     type: "boolean",    defaultValue: false},
        {name: "isCircular",        type: "boolean",    defaultValue: true}
    ],

    associations: [
    ],

    init: function() {
        //if (this.get("binsVector").length === 0|| this.get("binsVector") === null) {
        //    this.set("binsVector", []);
        //}
        //console.log(this.binsVector); //does not work
    },

    /**
     * @returns {int} count Number of J5Bins in binsVector
     */
    binCount: function() {
        return this.get("binsVector").length;
    },

    /**
     * Pushes a J5bin into the binsVector.
     * Original uses splice, but don't we want to insert it, not replace an item?
     * @param {Teselagen.models.J5Bin} pJ5Bin Bin to add to collection
     * @param {int} pIndex Index to insert pJ5Bin. Optional. Defaults to end of of array if invalid or undefined value.
     * @preturns {Boolean} added True if added, False if not.
     */
    addToBin: function(pJ5Bin, pIndex) {
        var added = false;

        var cnt     = this.binCount();

        if (pIndex >= 0 && pIndex < cnt) {
            //Ext.Array.insert(this.get("binsVector"), pIndex, pJ5Bin);
            this.get("binsVector").splice(pIndex, 0, pJ5Bin);
        } else {
            Ext.Array.include(this.get("binsVector"),pJ5Bin);
        }
        
        //Ext.Array.insert(this.get("binsVector"), position, bin);
        //console.log(this.get("binsVector")[0]);

        var newCnt  = this.binCount();
        if (newCnt > cnt) {
            added = true;
        }
        return added;
    },

    /**
     * Removes a J5Bin from Collection.
     * @param {Teselagen.models.J5Bin} pJ5Bin Bin to remove to collection
     * @returns {Boolean} removed True if removed, False if not.
     */
    removeFromBin: function(pJ5Bin) {
        var removed = false;

        var cnt     = this.binCount();
        Ext.Array.remove(this.get("binsVector"), pJ5Bin);

        //this.set("binItemsVector", newBin);

        var newCnt  = this.binCount();
        if (newCnt < cnt) {
            addd = true;
        }
        return removed;
    },

    // ===============================================
    // THE FOLLOWING COMES FROM J5CollectionProxy.as
    // It makes more sense to put these methods here.

    /**
     * @param {Teselagen.models.Part} pPart
     * @returns {Boolean} partIsPresent True is in the J5Bins, False if not.
     */
    isInCollection: function(pPart) {
        if (this.get("binsVector").length > 0 || this === null) {
            return false;
        }
        var bin, j5Bin; //j5 bin

        for (var j = 0; j < this.get("binsVector").length; j++) {
            bin = this.get("binsVector")[j];
            for (var k = 0; k < bin.get("binItemsVector").length; k++) {
                j5Bin = bin.get("binItemsVector")[k];
                if (j5Bin === pPart) {
                    return true;
                }
            }
        }
        return false;
    },

    /**
     * @returns {Boolean} isCircular
     */
    isCircular: function() {
        return this.isCircular;
    },

    /**
     * Given a J5Bin, returns the index
     * @param {Teselagen.models.J5Bin} pJ5Bin
     * @returns {int} index Index of bin. -1 if not found.
     */
    getBinIndex: function(pJ5Bin) {
        var index = -1;

        for (var i = 0; i < this.get("binsVector").length; i++) {
            if (pJ5Bin === this.get("binsVector")[i]) {
                index = i;
            }
        }
        return index;
    },

    /**
     * Adds a default J5Bin given a name and index.
     * @param {String} pName
     * @param {int} pIndex Index to insert new J5Bin. Optional. Defaults to end of of array if invalid or undefined value.
     * ///@returns {Teselagen.models.J5Bin}
     * @returns {Boolean} added True if added, false if not.
     */
    addNewBinByIndex: function(pName, pIndex) {

        var added = false;

        if (this.get("binsVector") === null) {
            /*throw Ext.create("Teselagen.bio.BioException", {
                message: "No collection exists. Cannot add bin"
            });*/
            this.set("binsVector", []);
        }

        var j5Bin = Ext.create("Teselagen.models.J5Bin", {
            binName: pName
        });

        if (pIndex >= 0 && pIndex < this.j5Collection.length) {
            Ext.Array.insert(this.get("binsVector"), pIndex, j5Bin);
            added = true;
        } else {//if (pIndex === -1) {
            Ext.Array.include(this.get("binsVector"), j5Bin);
            added = true;
        }
        //not sure above will work

        // DW: NEED TO FIRE EVENT NEW_BIN_ADDED

        return added; //j5Bin;
    },

    /**
     * Remove a J5Bin by index.
     * @param {int} pIndex Index of J5Bin. Optional. Defaults to last item of bin array if invalid or undefined value.
     * ////@param {Teselagen.models.J5Bin}
     * @returns {Boolean} deleted True if deleted, false if not.
     */
    deleteBinByIndex: function(pIndex) {
        var deleted = false;

        if (this.get("binsVector") === null) {
            this.set("binsVector", []);
        }

        var cnt     = this.binCount();
        if (pIndex >= 0 && pIndex < cnt) {
            this.j5Collection.get("binsVector").slice(pIndex, 1); //DOES THIS WORK?
            //Ext.Array.remove(this.get("binsVector"), pJ5Bin);\
        } else {
            this.j5Collection.get("binsVector").pop();
        }
        var newCnt  = this.binCount();
        if (newCnt < cnt) {
            deleted = true;
        }

        return deleted;
    },

    /**
     * Adds a Part to the J5Bin specified by binIndex at the position specified,
     * or to the end of the J5Bin if no position specified.
     *
     * @param {Teselagen.models.Part} pPart The part to add to a J5Bin
     * @param {int} pBinIndex The index of the J5Bin in which to add the part. Defaults to end of of array if invalid or undefined value.
     * @param {int} pPosition The position within the bin at which to add the Part. Defaults to end of array if invalid or undefined value.
     * @returns {Boolean} added True if added, False if not.
     */
    addPartToBin: function(pPart, pBinIndex, pPosition) {
        var j5Bin;
        var cnt     = this.binCount();

        if (pBinIndex >= 0 && pBinIndex < cnt) {
            j5Bin = this.get("binsVector")[pBinIndex];
        } else {
            j5Bin = this.get("binsVector")[cnt];
        }

        var added = j5Bin.addToBin(pPart, pPosition);

        return added;
    },

    /**
     * Adds a Part to the J5Bin specified by binIndex at the position specified,
     * or to the end of the J5Bin if no position specified
     *
     * @param {Teselagen.models.Part} pPart The part to add to a J5Bin
     * @param {int} pBinIndex The index of the J5Bin in which to add the Part. Defaults to end of of array if invalid or undefined value.
     * @param {int} pPosition The position within the J5Bin at which to add the Part. Defaults to end of array if invalid or undefined value.
     * @returns {Boolean} removed True if added, False if not.
     */
    removePartFromBin: function(pPart, pBinItem) {
        var j5Bin;
        var cnt     = this.binCount();

        if (pBinIndex >= 0 && pBinIndex < cnt) {
            j5Bin = this.get("binsVector")[pBinIndex];
        } else {
            j5Bin = this.get("binsVector")[cnt];
        }

        var removed = j5Bin.removeFromBin(pPart);

        return removed;
    },

    /**
     * Determines the J5Bin a Part is in.
     *
     * @param {Teselagen.models.Part} pPart The part whose J5Bin it belongs to.
     * @param {Teselagen.models.J5Bin} J5Bin The first J5Bin Part belongs to, null if not in J5Collection.
     */
    getBinAssignment: function(pPart) {

        for (var i = 0; i < this.binCount(); i++) {
            var j5Bin = this.get("binsVector")[i];
            for (var j = 0; j < j5Bin.binCount(); j++) {
                if (j5Bin.get("binItemsVector")[j] === pPart) {
                    return j5Bin.get("binItemsVector")[j];
                }
            }
        }
        return null;
    }
});