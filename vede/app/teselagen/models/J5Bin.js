/**
 * @class Teselagen.models.J5Bin
 * Class describing a j5Bin.
 * @author Diana Wong
 * @author Douglas Densmore (original author)
 */
Ext.define("Teselagen.models.J5Bin", {
    extend: "Ext.data.Model",

    requires: [
        "Teselagen.models.SBOLvIcons",
        "Teselagen.models.Part",
        "Teselagen.utils.NullableInt"
    ],

    statics: {
        GENERIC: "generic"
    },

    /**
     * Input parameters.
     * @param {Teselagen.models.Part[]} binItemsVector
     * @param {String} binName (REQUIRED)
     * @param {String} iconID
     * @param {Boolean} directionForward
     * @param {Boolean} dsf
     * @param {Teselagen.utils.NullableInt} fro
     * @param {String} fas
     * @param {Teselagen.utils.NullableInt} extra5PrimeBps
     * @param {Teselagen.utils.NullableInt} extra3PrimeBps
     */
    fields: [
        //{name: "binItemsVector",    type: "auto",       defaultValue: null},
        {
            name: "binItemsVector",
            convert: function(v, record) {
                return v || [];
            }
        },
        {name: "binName",           type: "string",     defaultValue: ""}, //required when making this object
        {name: "iconID",            type: "string",     defaultValue: ""},
        {name: "directionForward",  type: "boolean",    defaultValue: true},
        {name: "dsf",               type: "boolean",    defaultValue: false},
        {name: "fro",               type: "auto",       defaultValue: null},
        {name: "fas",               type: "string",     defaultValue: ""},
        {name: "extra5PrimeBps",    type: "auto",       defaultValue: null},
        {name: "extra3PrimeBps",    type: "auto",       defaultValue: null}
        
    ],

    // This actually doesn't work...
    associations: [
        {type: "hasMany", model: "Teselagen.models.Part", name: "binItemsVector", defaultValue: []},
        {type: "belongsTo", model: "Teselagen.models.J5Collection"}
    ],

    init: function() {
        if (this.get("iconID") === "") {
            this.set("iconID", this.self.GENERIC);
        }
        //if (this.get("binItemsVector") === null) {
        //    this.set("binItemsVector", []);
        //}
    },

    /**
     * @returns {int} count Number of Parts in binItemsVector
     */
    binCount: function() {
        return this.get("binItemsVector").length;
    },

    /**
     * Adds a Part into the binItemsVector.
     * @param {Teselagen.models.Part} pPart
     * @param {int} pPosition Index to insert pPart. Optional. Defaults to end of of array if invalid or undefined value.
     * @returns {Boolean} added True if added, false if not.
     */
    addToBin: function(pPart, pPosition) {
        var added = false;

        var cnt = this.binCount();

        if (pPosition >= 0 && pPosition < cnt) {
            //Ext.Array.insert(this.get("binItemsVector"), pPosition, pPart);
            this.get("binItemsVector").splice(pPosition, 0, pPart);
        } else {
            //Ext.Array.include(this.get("binItemsVector"), pPart);
            this.get("binItemsVector").push(pPart);
        }

        var newCnt  = this.binCount();
        if (newCnt > cnt) {
            added = true;
        }
        return added;
    },

    /**
     * Removes a Part from the binItemsVector.
     * @param {Teselagen.models.Part} pPart
     * @returns {Boolean} removed True if removed, false if not.
     */
    removeFromBin: function(pPart) {
        var removed = false;

        var cnt = this.binCount();
        Ext.Array.remove(this.get("binItemsVector"), pPart);

        //console.log(this.get("binItemsVector"));
        //console.log(part.get("id"));
        //var newBin = Ext.Array.remove(this.get("binItemsVector"), pPart);
        //this.set("binItemsVector", newBin);

        var newCnt  = this.binCount();
        if (newCnt < cnt) {
            addd = true;
        }
        return removed;
    }


});