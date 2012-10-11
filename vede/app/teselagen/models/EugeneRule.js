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

    proxy: {
        type: "memory"
    },

    statics: {
        // For Default Names
        // This Differs from EugeneRules.as
        defaultNamePrefix: "rule",
        highestDefaultNameIndex: 0,

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
     * @param {String} name The name of the Eugene Rule. Must contain only alphanumeric/underscore/hyphen characters. Will default to "rule"+i when name is empty string.
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
                return v;
            }
        },
        
        {name: "negationOperator",      type: "boolean",    defaultValue: false},
        {name: "operand1",              type: "auto",       defaultValue: null},
        {name: "compositionalOperator", type: "String",     defaultValue: ""},
        
        {name: "operand2",              type: "auto",       defaultValue: null}
    ],

    validations: [
        {field: "name",             type: "presence"},
        //{field: "negationOperator", type: "presence"},
        {field: "operand1",         type: "presence"},
        {field: "compositionalOperator",    type: "presence"},
        {field: "compositionalOperator",    type: "inclusion",
                list: [             //Cannot access the statics, hard coding for now.
                    "AFTER",
                    "BEFORE",
                    "WITH",
                    "THEN",
                    "NEXTTO",
                    "MORETHAN",
                    this.self.NOTMORETHAN,
                    this.self.NOTWITH
                ]
        },
        {field: "operand2",         type: "presence"}
    ],

    associations: [
        /*{
            type: "hasOne",
            model: "Teselagen.models.Part",
            getterName: "getOperand1",
            setterName: "setOperand1",
            associationKey: "operand1"
        },
        {
            type: "hasOne",
            model: "Teselagen.models.Part",
            getterName: "getOperand2",
            setterName: "setOperand2",
            associationKey: "operand2"
        },
        */
        {
            type: "belongsTo",
            model: "Teselagen.models.DeviceDesign",
            getterName: "getDeviceDesign",
            setterName: "setDeviceDesign",
            associationKey: "deviceDesign"
        }
    ],


    // EVENTUALLY USE THE BELONGS TO THING TO DO THIS
    init: function() {
        //device = this.getDeviceDesign().isUniqueRuleName(this));
        //console.log(device);

        //console.log(pDeviceDesign.isUniqueRuleName(this));


        // If Name is "", use default + number as name
        if (this.get("name") === "") {
            this.set("name", this.self.defaultNamePrefix + this.self.highestDefaultNameIndex);
                this.self.highestDefaultNameIndex += 1;
        }

        // Check Operand2
        this.setOperand2(this.get("operand2"));

        // Check CompositionalOperator
        var compOp = this.get("compositionalOperator");
        if (compOp === this.self.AFTER || compOp === this.self.BEFORE || compOp === this.self.WITH || compOp === this.self.THEN || compOp === this.self.NEXTTO || compOp === this.self.MORETHAN ) {
            // These check out
        } else if (compOp === this.self.NOTMORETHAN || compOp === this.self.NOTWITH) {
            // These are ok, just deprecated
        } else {
            // Should be a throw, but it would throw A LOT of errors for ppl not knowing how to create a rule...
            console.warn("Teselagen.models.EugeneRule: Illegal CompositionalOperator: " + compOp);
            /*throw Ext.create("Teselagen.bio.BioException", {
                message: "Teselagen.models.EugeneRule: Illegal CompositionalOperator: " + compOp
            });*/
        }

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
