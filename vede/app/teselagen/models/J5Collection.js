/**
 * @class Teselagen.models.J5Collection
 * Class describing a J5Collection.
 * @author Diana Wong
 * @author Zinovii Dmytriv (original author) ?
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
     * @param {Boolean} binsVector
     * @param {Boolean} j5Ready
     * @param {Boolean} combinatorial
     * @param {Boolean} isCircular
     */
    fields: [
        {name: "binsVector",        type: "boolean",    defaultValue: false},
        {name: "j5Ready",           type: "boolean",    defaultValue: false},
        {name: "combinatorial",     type: "boolean",    defaultValue: false},
        {name: "isCircular",        type: "boolean",    defaultValue: true}
    ],

    associations: [
    ],

    /**
     * Pushes a bin into the binsVector.
     * Not sure if these are necessary
     * Original uses splice, but don't we want to insert it, not replace an item?
     */
    addToBin: function(bin, position) {
        //var newBin = Ext.Array.insert(this.get("binItemsVector"), 0, bin);
        //console.log(this.get("binsVector"));
        Ext.Array.include(this.get("binsVector"), bin);
        //Ext.Array.insert(this.get("binsVector"), position, bin);
        console.log(this.get("binsVector"));
    },

    /**
     * Removes an item from Bin
     */
     removeFromBin: function(bin) {
        Ext.Array.remove(this.get("binItemsVector"), bin);
        //this.set("binItemsVector", newBin);
     },

     binCount: function() {
        return this.get("binsVector").length;
     }



});