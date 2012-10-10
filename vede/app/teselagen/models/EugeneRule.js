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
     * @param {String} name The name of the Eugene Rule. Must contain only alphanumeric/underscore/hyphen characters.
     * @param {Boolean} negationOperator
     * @param {Teselagen.models.Part} operand1
     * @param {String} compositionalOperator
     * @param {Teselagen.models.Part||Number} operand2
     */
    fields: [
        {
            name: "name",
            convert: function(v, record) {
                if ( v.match(/[^a-zA-Z0-9_\-]/)) {
                    console.warn("Illegal name " + v + ". Name can only contain alphanumeric characters, underscore (_), and hyphen (-). Removing non-alphanumerics.");
                    v = v.replace(/[^a-zA-Z0-9_\-]*/g, "");
                }
                return v || "";
            }
        },
        
        {name: "negationOperator",      type: "boolean",    defaultValue: false},
        {name: "operand1",              type: "auto",       defaultValue: null},
        {name: "compositionalOperator", type: "String",     defaultValue: ""},
        
        {name: "operand2",              type: "auto",       defaultValue: null}
    ],

    associations: [
        //{type: "hasOne",    model: "Teselagen.models.Part", getterName: "getPart", setterName: "setPart"},
        {type: "belongsTo", model: "Teselagen.models.DeviceDesign", getterName: "getDeviceDesign", setterName: "setDeviceDesign"}
    ],


    // EVENTUALLY USE THE BELONGS TO THING TO DO THIS
    init: function() {
        //device = this.getDeviceDesign().isUniqueRuleName(this));
        //console.log(device);

        //console.log(pDeviceDesign.isUniqueRuleName(this));

        // Check Operand2
        this.setOperand2(this.get("operand2"));

    },

    setOperand2: function(pOperand2) {
        if (Ext.typeOf(pOperand2) === "number" || Ext.getClassName(pOperand2) === "Teselagen.models.Part") {
            this.set("operand2", pOperand2);
        } else {
            throw Ext.create("Teselagen.bio.BioException", {
                message: "Teselagen.models.EugeneRule.setOperand2(): Illegal operand2. Must be a Number or Part."
            });
        }
    },


    /** (From EugeneRulesManager.js/EugeneProxy.as)
     * Converts EugeneRule into text
     * @returns {String} ruleText
     */
    generateText: function() {
        var ruleText = ["Rule " , this.get("name") , "(" ];

        if (this.get("negationOperator")) {
            ruleText.push("NOT ");
        }

        if ( this.get("operand1") !== null) {
            ruleText.push( this.get("operand1").get("name") );
            ruleText.push( " " );
        }
        ruleText.push( this.get("compositionalOperator") );
        ruleText.push( " " );

        if (typeof(this.get("operand2")) === "number") {
            ruleText.push( this.get("operand2").toString());
        } else if ( Ext.getClassName(this.get("operand2")) === "Teselagen.models.PartVO") {
            ruleText.push( this.get("name"));
        } else {
            /*throw Ext.create("Teselagen.bio.BioException", {
                message: "generateRuleText(): Cannot generate rule. Operand2 must be a Number or a PartVO."
            });*/
        }

        ruleText.push(");");

        return ruleText.join("");
    }
});
