/**
 * @class Teselagen.models.J5Bin
 * Class describing a j5Bin.
 * @author Diana Wong
 * @author Zinovii Dmytriv (original author) ?
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
     * NOTE: Must execute setId() to set the id from "" to a unique identifier.
     * @param {Teselagen.models.Part} [binItemsVector]
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
        //{name: "binItemsVector",    type: "auto",       defaultValue: null}, //array
        {name: "binName",           type: "string",     defaultValue: ""}, //required when making this object
        {name: "iconID",            type: "string",     defaultValue: this.self.GENERIC}, //Teselagen.models.SBOLvIcons.self.GENERIC}, //generic
        {name: "directionForward",  type: "boolean",    defaultValue: true},
        {name: "dsf",               type: "boolean",    defaultValue: false},
        {name: "fro",               type: "auto",       defaultValue: null},
        {name: "fas",               type: "string",     defaultValue: ""},
        {name: "extra5PrimeBps",    type: "auto",       defaultValue: null},
        {name: "extra3PrimeBps",    type: "auto",       defaultValue: null}
    ],

    // This actually doesn't work...
    associations: [
        {type: "hasMany", model: "Teselagen.models.Part", name: "binItemsVector", defaultValue: null},
        {type: "belongsTo", model: "Teselagen.models.J5Collection"}
    ],

    /**
     * This is Required
     */
    setDefaultValues: function() {
        this.set("iconID", this.self.GENERIC);
    },

    /**
     * Not sure if these are necessary
     * Original uses splice, but don't we want to insert it, not replace an item?
     */
    addToBin: function(part, position) {
        var newBin = Ext.Array.insert(this.get("binItemsVector"), position, part);
        this.set("binItemsVector", newBin);
    },

    /**
     * Removes an item from Bin
     */
     removeFromBin: function(part) {
        var newBin = Ext.Array.remove(this.get("binItemsVector"), part);
        this.set("binItemsVector", newBin);
     }


});