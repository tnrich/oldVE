/**
 * @class Teselagen.models.j5Output.AssembledSequenceFile
 * Class describing a AssembledSequenceFile.
 * @author Diana Wong
 */
Ext.define("Teselagen.models.j5Output.AssembledSequenceFile", {
    extend: "Ext.data.Model",

    requires: [
        "Teselagen.models.j5Output.Assembly"
    ],

    proxy: {
        type: "memory"
    },

    statics: {
    },

    /**
     * Input parameters.
     */
    fields: [

        // model fields
        {
            name: "fileType",
            convert: function(v) {
                var format = v.toUpperCase().replace(/[^A-Z]/gi,"");
                var constants = Teselagen.constants.Constants;

                if (format === constants.GENBANK || format === constants.FASTA || format === constants.JBEISEQ || format === constants.SBOLXML) {
                    return format;
                } else {
                    // Default format
                    return constants.GENBANK;
                }
                
            }
        },
        {name: "name",   type: "String",     defaultValue: ""},
        {name: "fileContent",   type: "String",     defaultValue: ""},
        {name: "size",   type: "String",     defaultValue: ""},


        // IDs
        {name: "assembly_id",   type: "long"}
    ],

    validations: [
        {
            field: "fileType",
            type: "inclusion",
            list: Teselagen.constants.Constants.FORMATS_LIST
        }

    ],

    associations: [
        {
            type: "hasOne",
            model: "Teselagen.models.j5Output.Assembly",
            getterName: "getAssembly",
            setterName: "setAssembly",
            associationKey: "assembly",
            foreignKey: "assembly_id"
        },
        {
            type: "belongsTo",
            model: "Teselagen.models.J5Results",
            getterName: "getJ5Results",
            setterName: "setJ5Results",
            associationKey: "j5Results",
            foreignKey: "j5results_id"
        }
    ]

});