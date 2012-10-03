/** HAS NOT BEEN FULLY TESTED YET
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
        j5Collections: [],
        isCircular: true
    },

    constructor: function(inData) {
        this.Sha256         = Teselagen.bio.util.Sha256;
        this.Constants      = Teselagen.constants.Constants;
        this.EugeneRule     = Teselagen.models.EugeneRule;
        //console.log(inData);

        if (inData !== undefined && inData.j5Collections !== undefined) {
            this.j5Collections  = inData.j5Collections;
        } else {
            this.J5Collection   = [];
        }

        if (inData !== undefined && inData.numBins !== undefined && typeof(inData.numBins) === "number")  {
            for (var i = 0; i < numBins; i++) {
                this.addBin("No_Name" + i);
            }
        }

        if (inData !== undefined && inData.isCircular !== undefined){
            this.isCircular = inData.isCircular || true;
        }
    },

    /**
     * @param {Teselagen.models.J5Collection} pJ5Collection To be removed.
     */
    addItem: function(pJ5Collection) {
        this.j5Collections.push(pJ5Collection);
    },

    /**
     *
     */
    createNewCollection: function(numBins) {
        if (this.j5Collections.length > 0) {
            console.warn("Warning. Overwriting existing J5Collection");
        }
        j5Collections = [];
        for (var i = 0; i < numBins; i++) {
            this.addBin("No_Name" + i);
        }
    },

    /**
     * @param {Teselagen.models.J5Collection} pJ5Collection
     */
    deleteItem: function(pJ5Collection) {
        for (var i = 0; i < this.j5Collections.length; i++) {
            if (this.j5Collections[i] === pJ5Collection) {
                this.j5Collections.splice(i, 1);
                break;
            }
        }
    },

    /**
     * @param {Teselagen.models.Part} pPart
     */
    isInCollection: function(pPart) {
        if (this.j5Collections.length > 0 || this.j5Collections === null) {
            return false;
        }
        var bin, j5Bin; //j5 bin

        for (var i = 0; i < this.j5Collections.length; i++) {
            for (var j = 0; j < this.j5Collections[i].get("binsVector"); j++) {
                bin = this.j5Collections[i].get("binsVector")[j];
                for (var k = 0; k < bin.get("binItemsVector").length; k++) {
                    j5Bin = bin.get("binItemsVector")[k];
                    if (j5Bin === pPart) {
                        return true;
                    }
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
     * @param {String} pName
     * @param {int} pIndex Index to insert new J5Bin. -1 if just adding to the end of array.
     * @param {Teselagen.models.J5Bin}
     */
    addBin: function(pName, pIndex) {
        if (this.j5Collections === null) {
            throw Ext.create("Teselagen.bio.BioException", {
                message: "No collection exists. Cannot add bin"
            });
        }

        var j5Bin = Ext.create("Teselagen.models.J5Bin", {
            binName: pName
        });

        if (pIndex > 0 && pIndex < this.j5Collections) {
            this.j5Collections.get("binsVector").splice(index, 0, j5Bin);
        }
        //INCOMPLETE HERE
    },

    deleteBin: function(pIndex) {

    },

    getBinIndex: function(pJ5Bin) {

    },

    addToBin: function(pPart, pBinIndex, pPosition) {

    },

    removeFromBin: function(pPart, pBinItem) {

    },

    getBinAssignment: function(pPart) {

    }


});