/** HAS NOT BEEN FULLY TESTED YET.
 * THIS CLASS WILL BE ELIMINATED AND FUNCTIONS WILL BE PUT IN DEVICEDESIGN.JS
 * @class Teselagen.manager.EugeneRuleManager
 * Class describing a EugeneRuleManager.
 * EugeneRuleManager holds an array of EugeneRules, for a given design project.
 *
 * Originally EugeneRulesProxy.as, FunctionMediator.as, SaveDesignXMLCommand.as
 * @author Diana Wong
 * @author Douglas Densmore (original author) ?
 */
Ext.define("Teselagen.manager.EugeneRuleManager", {

    //singleton: true,

    requires: [
        "Teselagen.bio.util.Sha256",
        "Teselagen.constants.Constants",
        "Teselagen.models.EugeneRule"
    ],

    statics: {
        NAME: "EugeneRulesProxy"
    },

    Sha256: null,
    Constants: null,

    config: {
        defaultNamePrefix: "rule",
        highestDefaultNameIndex: 0,
        eugeneRules: []
    },

    constructor: function(inData) {
        this.Sha256         = Teselagen.bio.util.Sha256;
        this.Constants      = Teselagen.constants.Constants;
        this.EugeneRule     = Teselagen.models.EugeneRule;
        //console.log(inData);

        if (inData !== undefined && inData.eugeneRules !== undefined) {
            this.eugeneRules    = inData.eugeneRules;
        } else {
            this.EugeneRules    = [];
        }
        //console.log(inData.sequenceFiles);
    },


    /**
     * @returns {RegExp} regex
     */
    getDefaultNamePattern: function() {
        var regex = new RegExp( "^" + this.defaultNamePrefix + "(\\d+)$" );
        return regex;
    },

    //getDefaultNamePrefix: function() {
    //    return this.defaultNamePrefix;
    //},


    /**
     * Input parameters.
     * @param {String} pName The name of the Eugene Rule.
     * @param {Boolean} pNegationOperator
     * @param {Teselagen.models.PartVO} pOperand1
     * @param {String} pCompositionalOperator
     * @param {Teselagen.models.PartVO||Number} pOperand2
     * @return {Teselagen.models.EugeneRule} eugeneRule
     */
    addRule: function(pName, pNegationOperator, pOperand1, pCompositionalOperator, pOperand2) {

        if (pName === "") {
            throw Ext.create("Teselagen.bio.BioException", {
                message: "Please enter a name for this EugeneRule."
            });
        } else if ( XXX.isLegalName(pName)) {
            throw Ext.create("Teselagen.bio.BioException", {
                message: "Illegal name " + name + ". Name can only contain alphanumeric characters, underscore (_), and hyphen (-)."
            });
        }

        for (var i = 0; i < this.eugeneRules.length; i++) {
            if (this.eugeneRules[i].get("name") === pName) {
                throw Ext.create("Teselagen.bio.BioException", {
                    message: "Rule name " + pName + " already exists.\nPlease choose a unique name for the rule."
                });
            }
        }

        if (pOperand1 === null) {
            throw Ext.create("Teselagen.bio.BioException", {
                message: "Missing operand 1."
            });
        }

        if (pCompositionalOperator === this.EugeneRule.MORETHAN) {

            if (typeof(pOperand2) !== "number") {
                throw Ext.create("Teselagen.bio.BioException", {
                    message: "Invalid operand 2. Must be a number if using operator NOTMORETHAN."
                });
            }
        } else if (pCompositionalOperator === this.EugeneRule.AFTER || pCompositionalOperator === this.EugeneRule.BEFORE || pCompositionalOperator === this.EugeneRule.NEXTTO) {
            if (Ext.getClassName(operand2) !== "Teselagen.models.PartVO") {
                throw Ext.create("Teselagen.bio.BioException", {
                    message: "Invalid or missing operand 2."
                });
            }
        } else {
            throw Ext.create("Teselagen.bio.BioException", {
                message: "Operator " + compositionalOperator + " is not supported."
            });
        }

        var newEugeneRule = Ext.create("Teselagen.models.EugeneRule", {
            name: pName,
            negationOperator: pNegationOperator,
            operand1: pOperand1,
            compositionalOperator: pCompositionalOperatorm,
            operand2: pOperand2
        });

        this.eugeneRules.push(newEugeneRule);

        // If the name follows the default name pattern, update highest default name index
        // NOT SURE ABOUT THIS ONE YET
        var tmp = this.getDefaultNamePattern().exec(pName);
        if ( tmp !== null &&  parseInt(tmp[1]) > this.highestDefaultNameIndex ) {
            this.highestDefaultNameIndex = parseInt(tmp[1]);
        }

        // DW: NEED TO FIRE EVENT NEW_EUGENE_RULE_ADDED_DELETED.

        return newEugeneRule;
    },

    /**
     * @param {Teselagen.models.EugeneRule} pRule
     */
    deleteItem: function(pRule) {
        for (var i = 0; i < this.eugeneRules.length; i++) {
            if (this.eugeneRules[i] === pRule) {
                this.eugeneRules.splice(i, 1);
                break;
            }
        }
        // DW: NEED TO FIRE EVENT NEW_EUGENE_RULE_ADDED_DELETED.
    },

    deleteAllItems: function() {
        this.eugeneRules = [];
        this.highestDefaultNameIndex = 0;

        // DW: NEED TO FIRE EVENT NEW_EUGENE_RULE_ADDED_DELETED.
    },

    /**
     * @param {Teselagen.models.EugeneRule} pRule
     * @returns {String} ruleText
     */
    generateRuleText: function(pRule) {
        var ruleText = ["Rule " , pRule.get("name") , "(" ];

        if (pRule.get("negationOperator")) {
            ruleText.push("NOT ");
        }

        if ( pRule.get("operand1") !== null) {
            ruleText.push( pRule.get("operand1").get("name") );
            ruleText.push( " " );
        }
        ruleText.push( pRule.get("compositionalOperator") );
        ruleText.push( " " );

        if (typeof(pRule.get("operand2")) === "number") {
            ruleText.push( pRule.get("operand2").toString());
        } else if ( Ext.getClassName(pRule.get("operand2")) === "Teselagen.models.PartVO") {
            ruleText.push( pRule.get("name"));
        } else {
            /*throw Ext.create("Teselagen.bio.BioException", {
                message: "generateRuleText(): Cannot generate rule. Operand2 must be a Number or a PartVO."
            });*/
        }

        ruleText.push(");");

        return ruleText.join("");
    },

    /**
     * @param {String} name
     * @returns {Teselagen.models.EugeneRule} eugeneRule
     */
    getRuleByName: function(pName) {
        for (var i = 0; i < this.eugeneRules.length; i++) {
            if (this.eugeneRules[i].get("name") === pName) {
                return this.eugeneRules[i];
            }
        }
        return null;
    },

    /** THIS SEEMS REDUNDANT OF getRulesInvolvingPartVO
     * Returns the eugeneRules that apply to the given PartVO.
     * This includes all rules where the PartVO is the first operand,
     * as well as all AFTER, NOT AFTER, BEFORE, NOT BEFORE, WITH, NOT WITH,
     * NOT THEN, and NOT NEXTTO rules where the PartVO is the second operand
     * (since the listed rules are symmetric).
     *
     * @param {Teselagen.models.PartVO} pPartVO
     * @return {Teselagen.models.EugeneRule[]} partRules
     */
    getRulesByPartVO: function(pPartVO) {
        var partRules = [];

        for (var i = 0; i < this.eugeneRules.length; i++) {
            if (this.eugeneRules[i] === pPartVO) {
                partRules.push(this.eugeneRules[i]);
            } else if (this.eugeneRules[i].get("operand2") === pPartVO) {

                var op = this.eugeneRules[i].get("operand2");
                if ( op === this.EugeneRule.AFTER || op === this.EugeneRule.BEFORE || op === this.EugeneRule.WITH ) {
                    partRules.push(this.eugeneRules[i]);
                } else if ( op === this.EugeneRule.THEN || op === this.EugeneRule.NEXTTO || this.eugeneRules[i].get("negationOperator") === true) {
                    partRules.push(this.eugeneRules[i]);
                }
            }
        }
        return partRules;
    },

    /**
     * Returns the eugeneRules that involve the PartVO in either operand.
     *
     * @param {Teselagen.models.PartVO} pPartVO
     * @return {Teselagen.models.EugeneRule[]} partRules
     */
    getRulesInvolvingPartVO: function(pPartVO) {
        var rulesInvolvingPartVO = [];

        for (var i = 0; i < this.eugeneRules.length; i++) {
            if (this.eugeneRules[i].get("operand1") === pPartVO || this.eugeneRules[i].get("operand2") === pPartVO) {
                rulesInvolvingPartVO.push(this.eugeneRules[i]);
            }
        }
        return rulesInvolvingPartVO;
    },

    /**
     * @param {String} pName
     * @return {Boolean}
     */
    isUniqueRuleName: function(pName) {
        for (var i = 0; i < this.eugeneRules.length; i++) {
            if (eugeneRules[i].get("name") === pName) {
                return false;
            }
        }
        return true;
    }


});