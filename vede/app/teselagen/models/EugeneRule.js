/**
 * @class Teselagen.models.EugeneRule
 * Class describing a Eugene Rule.
 * @author Diana Wong
 * @author Douglas Densmore (original author) ?
 */
Ext.define("Teselagen.models.EugeneRule", {
    extend: "Ext.data.Model",

    requires: [
        "Teselagen.models.Part",
        "Teselagen.constants.Constants"
    ],

    proxy: {
        type: "memory"
    },

    statics: {
        // For Default Names
        // This Differs from EugeneRules.as
        defaultNamePrefix: "rule",
        highestDefaultNameIndex: 0
    },

    /**
     * Input parameters.
     * @param {String} name The name of the Eugene Rule. Must contain only alphanumeric/underscore/hyphen characters. Will default to "rule"+i when name is empty string.
     * @param {Boolean} negationOperator
     * @param {Teselagen.models.Part} operand1
     * @param {String} compositionalOperator
     * @param {Teselagen.models.Part/Number} operand2
     */
    fields: [
        //{name: "id",                type: "long"},
        //{name: "devicedesign_id",   type: "long"},
        {name: "operand1_id",   type: "long"},
        {name: "operand2_id",   type: "long"},
        {
            name: "name"
            /**
             * @DEPRECATED
             * Use DeviceDesignManager.getDefaultRuleName method to generate
             * default rule name strings, as this generates design-specific names.
            convert: function(v, record) {
                var name;

                if (v === "" || v === undefined || v === null) {
                    name = record.self.defaultNamePrefix + record.self.highestDefaultNameIndex;
                    record.self.highestDefaultNameIndex += 1;
                } else {
                    if (Teselagen.utils.FormatUtils.isLegalName(v)) {
                        name =  v.toString();
                    } else {
                        console.warn("Illegal name " + v + ". Name can only contain alphanumeric characters, underscore (_), and hyphen (-). Removing non-alphanumerics.");
                        name = Teselagen.utils.FormatUtils.reformatName(v);
                    }
                }
                return name;
            }*/
        },

        
        {name: "originalRuleLine",      type: "String",    defaultValue: ""},

        {name: "negationOperator",      type: "boolean",    defaultValue: false},

        {
            name: "compositionalOperator",
            convert: function(v) {
                var compOp = v.toUpperCase();

                var constants = Teselagen.constants.Constants;

                if (compOp === constants.AFTER || compOp === constants.BEFORE || compOp === constants.WITH || compOp === constants.THEN || compOp === constants.NEXTTO || compOp === constants.MORETHAN ) {
                    // These check out
                } else if (compOp === constants.NOTMORETHAN || compOp === constants.NOTWITH) {
                    console.warn("Using deprecated compositionalOperator: ",compOp);
                } else {
                    // Should be a throw, but it would throw A LOT of errors for ppl not knowing how to create a rule...
                    console.warn("Teselagen.models.EugeneRule: Illegal CompositionalOperator: " + compOp);
                    throw Ext.create("Teselagen.bio.BioException", {
                        message: "Teselagen.models.EugeneRule: Illegal CompositionalOperator: " + compOp
                    });
                }
                return compOp;
            }
        },
        {
            name: "operand2isNumber",
            convert: function(v) {
                if (this.get("operand2Number") === undefined) {
                    return v;
                }
            }
        },
        
        {name: "operand2isNumber",      type: "boolean",    defaultValue: false},
        {name: "operand2Number",        type: "number",     defaultValue: 0}
    ],

    validations: [
        {field: "name",             type: "presence"},
        //{field: "negationOperator", type: "presence"},
        //{field: "operand1",         type: "presence"},
        {field: "compositionalOperator",    type: "presence"},
        /*
        {
            field: "compositionalOperator",
            type: "inclusion",
            list: Teselagen.constants.Constants.COMPOP_LIST // Its NOT possible using constants on class definition context.
        },
        */
        {field: "operand2Number",         type: "presence"}
    ],

    associations: [
        // Operand1 is always a Part
        {
            type: "hasOne",
            model: "Teselagen.models.Part",
            getterName: "getOperand1",
            setterName: "setOperand1",
//            associationKey: "operand1",
            instanceName: "operand1",
            foreignKey: "operand1_id" 
        },
        // Operand2 can be a Part or a Number; If Part, then store here.
        {
            type: "hasOne",
            model: "Teselagen.models.Part",
            getterName: "getOperand2Part",
            setterName: "setOperand2Part",
//            associationKey: "operand2Part",
            instanceName: "operand2",
            foreignKey: "operand2_id" 

        },
        //Needed to find the parent of a child
        /*
        {
            type: "belongsTo",
            model: "Teselagen.models.DeviceDesign",
            getterName: "getDeviceDesign",
            setterName: "setDeviceDesign",
            associationKey: "deviceDesign",
            foreignKey: "devicedesign_id" 
        }
        */
    ],

    /**
     * Gets Operand2. Must use this method to obtain Operand2 correctly.
     * @returns {Teselagen.models.Part|Number} Operand2 can be a Part or a Number
     */
    getOperand2: function() {
        if (this.get("operand2isNumber")) {
            return this.get("operand2Number");
        } else {
            return this.getOperand2Part();
        }
    },

    /**
     * Set Operand2. Input can be Part or a Number. This method will set them appropriately.
     * @param {Teselagen.models.Part|Number} pOperand2 can be a Part or a Number
     */
    setOperand2: function(pOperand2) {
        if (Ext.typeOf(pOperand2) === "number") {
            //console.log(pOperand2);
            this.set("operand2Number", pOperand2);
            this.set("operand2isNumber", true);
        } else if (Ext.getClassName(pOperand2) === "Teselagen.models.Part") {
            this.setOperand2Part(pOperand2);
        } else {
            throw Ext.create("Teselagen.bio.BioException", {
                message: "Teselagen.models.EugeneRule.setOperand2(): Illegal operand2. Must be a Number or Part."
            });
        }
    },

    /*setOperand1: function(pOperand1) {
        console.log("here");
        if (Ext.getClassName(pOperand1) === "Teselagen.models.Part") {
            this.setOperand1(pOperand1);
        } else {
            throw Ext.create("Teselagen.bio.BioException", {
                message: "Teselagen.models.EugeneRule.setOperand2(): Illegal operand2. Must be a Number or Part."
            });
        }
    },*/


    /** (From EugeneRulesManager.js/EugeneProxy.as)
     * Converts EugeneRule into text
     * @returns {String}
     */
    generateText: function() {
        var ruleText = ["Rule " , this.get("name") , "(" ];

        if (this.get("negationOperator")) {
            ruleText.push("NOT ");
        }

        if ( this.getOperand1() !== null) {
            ruleText.push( this.getOperand1().get("name") );
            ruleText.push( " " );
        }
        ruleText.push( this.get("compositionalOperator") );
        ruleText.push( " " );

        if (typeof(this.getOperand2()) === "number") {
            ruleText.push( this.getOperand2().toString());
        } else if ( Ext.getClassName(this.getOperand2()) === "Teselagen.models.Part") {
            ruleText.push( this.getOperand2().get("name"));
        } else {
            console.warn("Teselagen.models.EugeneRule.generateRuleText(): Cannot generate rule. Operand2 must be a Number or a Part.");
            /*throw Ext.create("Teselagen.bio.BioException", {
                message: "generateRuleText(): Cannot generate rule. Operand2 must be a Number or a Part."
            });*/
        }

        ruleText.push(");");

        return ruleText.join("");
    }
});
