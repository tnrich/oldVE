/** HAS NOT BEEN FULLY TESTED YET.
 * THIS CLASS WILL BE ELIMINATED AND FUNCTIONS WILL BE PUT IN J5COLLECTION.JS
 * @class Teselagen.manager.J5Manager
 * Class describing a J5Manager.
 * J5Manager holds an array of J5Collection, for a given design project.
 *
 * Originally J5Proxy.as, FunctionMediator.as, SaveDesignXMLCommand.as
 * @author Diana Wong
 * @author Douglas Densmore (original author) ?
 */
Ext.define("Teselagen.manager.J5Manager", {

    //singleton: true,

    requires: [
        "Teselagen.bio.util.Sha256",
        "Teselagen.constants.Constants",
        "Teselagen.models.J5Collection"
    ],

    statics: {
        NAME: "J5Proxy"
    },

    Sha256: null,
    Constants: null,

    config: {
        j5Collection: null
    },

    constructor: function(inData) {
        this.Sha256         = Teselagen.bio.util.Sha256;
        this.Constants      = Teselagen.constants.Constants;
        this.EugeneRule     = Teselagen.models.EugeneRule;

        if (inData !== undefined && inData.j5Collection !== undefined) {
            this.j5Collection   = inData.j5Collection;
        } else {
            this.J5Collection   = Ext.create("Teselagen.models.J5Collection", {
                // USE DEFAULTS
            });
        }

        if (inData !== undefined && inData.numBins !== undefined && typeof(inData.numBins) === "number")  {
            for (var i = 0; i < numBins; i++) {
                //this.j5Collection.addBin("No_Name" + i); //FIX ME
            }
        }
    },

    /**
     *
     */
    createNewCollection: function(numBins) {
        if (this.j5Collection.length > 0) {
            console.warn("Warning. Overwriting existing J5Collection");
        }
        j5Collection = [];
        for (var i = 0; i < numBins; i++) {
            this.addBin("No_Name" + i);
        }
    },

    /** (moved to J5Collection.js)
     * @param {Teselagen.models.Part} pPart
     *
    isInCollection: function(pPart) {
        if (this.j5Collection.length > 0 || this.j5Collection === null) {
            return false;
        }
        var bin, j5Bin; //j5 bin

        for (var i = 0; i < this.j5Collection.length; i++) {
            for (var j = 0; j < this.j5Collection[i].get("binsVector").length; j++) {
                bin = this.j5Collection[i].get("binsVector")[j];
                for (var k = 0; k < bin.get("binItemsVector").length; k++) {
                    j5Bin = bin.get("binItemsVector")[k];
                    if (j5Bin === pPart) {
                        return true;
                    }
                }
            }
        }
        return false;
    },*/


    /** (moved to J5Collection.js)
     * @returns {Boolean} isCircular
     *
    isCircular: function() {
        return this.isCircular;
    },*/


    /** DELETE THIS? EQUIV TO j5mgr.setJ5Collection(pJ5Collection)
     * @param {Teselagen.models.J5Collection} pJ5Collection To be removed.
     */
    addItem: function(pJ5Collection) {
        //this.j5Collection.push(pJ5Collection);
        this.j5Collection = pJ5Collection;
    },

    /**  DELETE THIS?
     * @param {Teselagen.models.J5Collection} pJ5Collection
     */
    deleteItem: function(pJ5Collection) {
        /*for (var i = 0; i < this.j5Collection.length; i++) {
            if (this.j5Collection[i] === pJ5Collection) {
                this.j5Collection.splice(i, 1);
                break;
            }
        }*/
        this.j5Collection = null;
    },


    /** (moved to J5Collection.js as addNewBin())
     * @param {String} pName
     * @param {int} pIndex Index to insert new J5Bin. -1 if just adding to the end of array.
     * @param {Teselagen.models.J5Bin}
     *
    addBin: function(pName, pIndex) {
        if (this.j5Collection === null) {
            throw Ext.create("Teselagen.bio.BioException", {
                message: "No collection exists. Cannot add bin"
            });
        }

        var j5Bin = Ext.create("Teselagen.models.J5Bin", {
            binName: pName
        });

        //var newBins;

        if (pIndex >= 0 && pIndex < this.j5Collection.length) {
            Ext.Array.insert(this.j5Collection.get("binsVector"), index, j5Bin);
        } else if (pIndex === -1) {
            Ext.Array.include(this.j5Collection.get("binsVector"), j5Bin);
        }
        //not sure above will work

        // DW: NEED TO FIRE EVENT NEW_BIN_ADDED

        return j5Bin;
    },*/


    /** (moved to J5Collection.js as deleteBinByIndex())
     *
    deleteBin: function(pIndex) {
        if (this.j5Collection.length > 0 || this.j5Collection === null) {
            return false;
        }

        var newBins;

        if (pIndex >= 0 && pIndex < this.j5Collection.length) {
            newBins = this.j5Collection.get("binsVector").slice(pIndex, 1);
        } else {
            newBins = this.j5Collection.get("binsVector").pop();
        }
        this.j5Collection.set("binsVector", newBins);

    },*/


    /** (moved to J5Collection.js as deleteBinByIndex())
     *
    getBinIndex: function(pJ5Bin) {
        for (var i = 0; i < this.j5Collection.get("binsVector").length; i++) {
            //if ( this.j5Collection)
        }

    },*/


    /*addToBin: function(pPart, pBinIndex, pPosition) {

    },

    removeFromBin: function(pPart, pBinItem) {

    },

    getBinAssignment: function(pPart) {

    }*/


});