/**
 * @class Teselagen.models.Cell
 * Class describing a Cell.
 * @author Diana Wong
 * @author Douglas Densmore (original author) ?
 */
Ext.define("Teselagen.models.Cell", {
    extend: "Ext.data.Model",

    requires: [
        "Teselagen.models.Part",
        "Teselagen.constants.Constants"
    ],

    proxy: {
        type: "memory",
        reader: {type: "json"}
    },


    /**
     * @param {Long} part_id
     */
    fields: [{
        name: "index",
        type: "int"
    }, {
        name: "part_id",
        type: "long"
    }, {
        name: "fas",
        type: "string",
        defaultValue: "None"
    }],

    associations: [{
        type: "hasOne",
        model: "Teselagen.models.Part",
        foreignKey: "part_id",
        getterName: "getPart",
        setterName: "setPart"
    },
    {
        type: "belongsTo",
        model: "Teselagen.models.J5Bin",
        name: "j5Bin",
        getterName: "getJ5Bin",
        setterName: "setJ5Bin",
        associationKey: "j5Bin",
        foreignKey: "j5bin_id"
    }
    ]
    
});
