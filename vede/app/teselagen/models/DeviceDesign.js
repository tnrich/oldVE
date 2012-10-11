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
    proxy: {
        type: 'rest',
        url: 'getDesign.json',
        reader: {
            type: 'json',
            root: 'data'
        }
    },

    /**
     * Input parameters.
     * @param {Teselagen.models.J5Collection} j5Collection
     * @param {Teselagen.models.EugeneRules}
     * @param {Teselagen.models.J5Run}
     */
    fields: [
        { name: "DesignName", type: "String", defaultValue: ""},
        {
            name: "j5Collection",
            convert: function(v, record) {
                return v || null; //Ext.create("Teselagen.models.J5Collection");
            }
        }
    ],

    associations: [
        {type: "belongsTo", model: "Teselagen.models.Project", getterName: "getProject", setterNme: "setProject"},
        //{type: "hasOne",    model: "Teselagen.models.J5Collection", getterName: "getJ5Collection", setterName: "setJ5Collection"},
        {type: "hasMany",   model: "Teselagen.models.EugeneRule",   name: "rules"},
        {type: "hasMany",   model: "Teselagen.models.J5Run",        name: "runs"}
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
    },

    /**
     * Adds a EugeneRule into the Rules Store.
     * @param {Teselagen.models.EugeneRule} pRule. Can be a single part or an array of parts.
     * @returns {Boolean} added True if added, false if not.
     */
    addToRules: function(pRule) {
        var cnt = this.rules();
        this.rules().add(pRule);

        if (cnt < this.rules()) {
            return true;
        } else {
            return false;
        }
    },

    /**
     * Removes a EugeneRule from the Rules Store.
     * @param {Teselagen.models.EugeneRule} pRule. Can be a single part or an array of parts.
     * @returns {Boolean} removed True if removed, false if not.
     */
    removeFromRules: function(pRule) {
        var cnt = this.rules();
        this.rules().remove(pRule);
        if (cnt < this.rules()) {
            return true;
        } else {
            return false;
        }
    },

    /**
     * Removes all EugeneRules from the Rules Store.
     * @returns {Boolean} True if all EugeneRules have been removed.
     */
    removeAllRules: function() {
        this.rules().removeAll();
        if (this.rules().count() === 0 ) {
            return true;
        } else {
            return false;
        }
    },

    /**
     * Returns the EugeneRules Store of EugeneRules that containt the Part in either operand.
     *
     * @param {Teselagen.models.Part} pPart
     * @return {Teselagen.models.EugeneRule[]} rules Array of EugeneRules containing pPart
     */
    getRulesInvolvingPart: function(pPart) {
        var rules = [];
        for (var i = 0; i < this.rules().count(); i++) {
            if (this.rules().getAt(i).get("operand1") === pPart || this.rules().getAt(i).get("operand2") === pPart) {
                rules.push(this.rules().getAt(i));
            }
        }

        return rules;
    },

    /**
     * @param {String} name
     * @returns {Teselagen.models.EugeneRule} eugeneRule Returns null if none found.
     */
    getRuleByName: function(pName) {
        var index = this.rules().find(name, pName);
        if ( index !== -1) {
            return this.rules().getAt(index);
        } else {
            return null;
        }
    },

    /**
     * Checks to see if a given name is unique within the Rules names.
     * @param {String} pName Name to check against Rules.
     * @returns {Boolean} True if unique, false if not.
     */
    isUniqueRuleName: function(pName) {
        var index = this.rules().find("name", pName);

        if (index === -1) {
            return true;
        } else {
            return false;
        }
    }


});