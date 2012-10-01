/**
 * @class Teselagen.models.EugeneRule
 * Class describing a Eugene Rule for J5Parameters.
 * @author Diana Wong
 * @author Douglas Densmore (original author) ?
 */
Ext.define("Teselagen.models.EugeneRule", {
    extend: "Ext.data.Model",

    requires: [
        "Teselagen.models.PartVO"
    ],

    statics: {
        // Deprecated
        NOTMORETHAN: "NOTMORETHAN",
        // Deprecated
        NOTWITH: "NOTWITH",
        
        AFTER: "AFTER",
        BEFORE: "BEFORE",
        WITH: "WITH",
        THEN: "THEN",
        NEXTTO: "NEXTTO",
        MORETHAN: "MORETHAN"
    },

    /**
     * Input parameters.
     * @param {String} name The name of the Eugene Rule.
     * @param {Boolean} negationOperator
     * @param {Teselagen.models.PartVO} operand1
     * @param {String} compositionalOperator
     * @param {Teselagen.models.PartVO||Number} operand2
     */
    fields: [
        {name: "name",                  type: "string",     defaultValue: ""},
        {name: "negationOperator",      type: "boolean",    defaultValue: false},
        {name: "operand1",              type: "auto",       defaultValue: null},
        {name: "compositionalOperator", type: "String",     defaultValue: ""},
        {name: "operand2",              type: "auto",       defaultValue: null}
    ],

    setOperand2: function(pOperand2) {
        if (Ext.typeOf(pOperand2) === "number" || Ext.getClassName(pOperand2) === "Teselagen.models.PartVO") {
            this.set("operand2", pOperand2);
        } else {
            throw Ext.create("Teselagen.bio.BioException", {
                message: "Teselagen.models.EugeneRule.setOperand2(): Illegal operand2. Must be a Number or PartVO"
            });
        }
    }
});
