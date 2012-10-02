/**
 * @class Teselagen.manager.J5CollectionManager
 * Class describing a J5CollectionManager.
 * J5CollectionManager holds an array of J5Collection, for a given design project.
 *
 * Originally J5CollectionProxy.as, FunctionMediator.as, SaveDesignXMLCommand.as
 * @author Diana Wong
 * @author Douglas Densmore (original author) ?
 */
Ext.define("Teselagen.manager.J5CollectionManager", {

    //singleton: true,

    requires: [
        "Teselagen.bio.util.Sha256",
        "Teselagen.constants.Constants",
        "Teselagen.models.J5Collection"
    ],

    statics: {
        NAME: "J5CollectionProxy"
    },

    Sha256: null,
    Constants: null,

    config: {
        j5Collections: []
    },

    constructor: function(inData) {
        this.Sha256         = Teselagen.bio.util.Sha256;
        this.Constants      = Teselagen.constants.Constants;
        this.EugeneRule     = Teselagen.models.EugeneRule;
        //console.log(inData);

        if (inData !== undefined && inData.j5Collections !== undefined) {
            this.j5Collections    = inData.j5Collections;
        } else {
            this.J5Collection    = [];
        }

        if (inData !== undefined && inData.numBins !== undefined && typeof(inData.numBins) === "number")  {
            for (var i = 0; i < numBins; i++) {
                this.addBin("No_Name" + i);
            }
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
        var bin; //j5 bin

        for (var i = 0; i < this.j5Collections.length; i++ ) {

        }
    }


});