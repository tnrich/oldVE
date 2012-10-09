/**
 * @class Teselagen.models.DeviceDesign
 * Class describing a DeviceDesign.
 * @author Diana Wong
 */
Ext.define("Teselagen.models.DeviceDesign", {
    extend: "Ext.data.Model",

    requires: [
    ],

    statics: {
    },

    /**
     * Input parameters.
     * @param {Teselagen.models.J5Collection} j5Collection
     * @param {Teselagen.models.EugeneRules}
     * @param {Teselagen.models.J5Run}
     */
    fields: [
        {
            name: "j5Collection",
            convert: function(v, record) {
                return v || null; //Ext.create("Teselagen.models.J5Collection");
            }
        }
        //,
        //{
        //    name: "sequenceFiles",
        //    convert: function(v, record) {
        //        return v || null;
        //    }
        //},
    ],

    associations: [
        {type: "belongsTo", model: "Teselagen.models.Project"},
        {type: "hasMany",   model: "Teselagen.models.EugeneRules",  name: "rules",  defaultValue: null},
        {type: "hasMany",   model: "Teselagen.models.J5Run",        name: "runs",   defaultValue: null}
    ],

    init: function() {
    },

    createNewCollection: function(pNumBins) {
        if (this.get("j5Collection").binCount() > 0) {
            console.warn("Warning. Overwriting existing J5Collection");
        }
        var j5Coll = Ext.create("Teselagen.models.J5Collection");
        for (var i = 0; i < pNumBins; i++) {
            j5Coll.addBin("No_Name" + i);
        }
        this.set("j5Collection", j5Coll);
        return j5Coll;
    }

});