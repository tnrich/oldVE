/**
 * @class Teselagen.utils.NullableInt
 * Class describing a NullableInt.
 * @author Diana Wong
 * @author Zinovii Dmytriv (original author) ?
 */
Ext.define("Teselagen.utils.NullableInt", {
    extend: "Ext.data.Model",

    statics: {
    },

    /**
     * Input parameters.
     * @param {int} value
     */
    fields: [
        {name: "value",             type: "int",        defaultValue: null}
    ],

    associations: [
        {type: "belongsTo", model: "Teselagen.models.J5Bin"}
    ],

    getValue: function() {
        return this.get("value");
    },

    toString: function() {
        return (this.get("value")).toString();  
    }

});