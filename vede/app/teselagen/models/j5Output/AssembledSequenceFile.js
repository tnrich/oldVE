/**
 * @class Teselagen.models.j5Output.AssembledSequenceFile
 * Class describing a AssembledSequenceFile.
 * @author Diana Wong
 */
Ext.define("Teselagen.models.j5Output.AssembledSequenceFile", {
    extend: "Ext.data.Model",

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
        {name: "sizeBP",   type: "String",     defaultValue: ""},
        {name: "parts", type: "String", defaultValue: ""}
    ]

});