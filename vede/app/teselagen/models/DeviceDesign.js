/**
 * @class Teselagen.models.DeviceDesign
 * Class describing a DeviceDesign.
 * @author Diana Wong
 */
Ext.define("Teselagen.models.DeviceDesign", {
    extend: "Ext.data.Model",
    requires: [
        "Teselagen.models.J5Collection",
        "Teselagen.models.EugeneRule"
    ],

    proxy: {
        type: "rest",
        url: "/vede/test/data/json/getDeviceDesign.json",
        reader: {
            type: "json",
            root: "design"
        },
        writer: {
            type: "json",
            //This method should resolve associations and prepare data before saving design
            getRecordData: function(record) {
                var data = record.getData();
                var associatedData = record.getAssociatedData();
                var j5Collection = associatedData["j5collection"];

                var rules = associatedData["rules"];
                data.j5collection = j5Collection;

                var binsTempArray = [];

                record.getJ5Collection().bins().each(function(bin,binKey){
                    var partsTempArray = [];
                    bin.parts().each(function(part){
                        if(!part.isEmpty()) partsTempArray.push(part.getData().id);
                    });
                    binsTempArray.push(partsTempArray);
                });

                data.j5collection.bins.forEach(function(bin,binKey){
                    bin.parts.forEach(function(part,partKey){
                        delete data.j5collection.bins[binKey].parts;
                        data.j5collection.bins[binKey].parts = binsTempArray[binKey];
                    });
                });

                data.rules = rules;

                data.rules.forEach(function(rule,ruleKey){
                    delete data.rules[ruleKey]["Teselagen.models.Part"];
                });

                return data;
            }
        },
        buildUrl: function() {
            return Teselagen.manager.SessionManager.buildUrl("user/projects/deprojects/devicedesign", this.url);
        }
    },

    /**
     * Input parameters.
     * @param {int} id
     */
    fields: [
        {name: "deproject_id", type: "long"},
    ],

    validations: [
    ],

    associations: [
        {
            type: "hasOne",
            model: "Teselagen.models.J5Collection",
            getterName: "getJ5Collection",
            setterName: "setJ5Collection",
            associationKey: "j5collection",
            name: "j5collection" // Note: not a documented config, but specified for getRecordData
        },
        {
            type: "hasOne",
            model: "Teselagen.models.SBOLvIconInfo",
            getterName: "getSBOLvIconInfo",
            setterName: "setSBOLvIconInfo",
            associationKey: "sbolvIconInfo"
        },
        {
            type: "hasMany",
            model: "Teselagen.models.EugeneRule",
            name: "rules",
            associationKey: "rules"
        },
        {
            type: "belongsTo",
            model: "Teselagen.models.DeviceEditorProject",
            getterName: "getDeviceEditorProject",
            setterName: "setDeviceEditorProject",
            associationKey: "deviceEditorProject"
        }
    ],

    /** (Untested)
     * Get number of bins in J5Bin.
     * @member Teselagen.models.DeviceDesign
     * @returns {Number}
     */
    getBinCount: function() {
        return this.getJ5Collection().binCount();
    },

    /**
     * Creates a J5Collection with pNumBins empty J5Bins.
     * @param {Number} pNumBins Number of empty J5Bins to make in Collection
     * @returns {Teselagen.models.J5Collection}
     */
    createNewCollection: function(pNumBins) {
        if (this.getJ5Collection().binCount() > 0) {
            console.warn("Warning. Overwriting existing J5Collection");
        }
        var j5Coll = Ext.create("Teselagen.models.J5Collection");
        for (var i = 0; i < pNumBins; i++) {
            var bin = Ext.create("Teselagen.models.J5Bin", {binName: "No_Name" + i});
            j5Coll.addToBin(bin, i);
        }
        this.setJ5Collection(j5Coll);
        return j5Coll;
    },

    /**
     * Creates a J5Collection from given J5Bins.
     * @param {Teselagen.models.J5Bin[]} pJ5Bins Array of J5Bins to put into Collection, in the order the bins should be placed.
     * @returns {Teselagen.models.J5Collection}
     */
    createCollectionFromBins: function(pBins) {
        if (this.getJ5Collection().binCount() > 0) {
            console.warn("Warning. Overwriting existing J5Collection");
        }
        var j5Coll = Ext.create("Teselagen.models.J5Collection");
        for (var i = 0; i < pBins.length; i++) {
            j5Coll.addToBin(pBins[i], i);
        }
        this.setJ5Collection(j5Coll);
        return j5Coll;
    },

    /**
     * Adds a EugeneRule into the Rules Store.
     * @param {Teselagen.models.EugeneRule} pRule. Can be a single rule or an array of rules.
     * @returns {Boolean} True if added, false if not.
     */
    addToRules: function(pRule) {
        var cnt = this.rules().count();
        this.rules().add(pRule);

        if (cnt < this.rules().count()) {
            return true;
        } else {
            return false;
        }
    },

    /**
     * Removes a EugeneRule from the Rules Store.
     * @param {Teselagen.models.EugeneRule/Teselagen.models.EugeneRule[]} rule Can be a single rule or an array of rules.
     * @returns {Boolean} True if removed, false if not.
     */
    removeFromRules: function(pRule) {
        var cnt = this.rules().count();
        this.rules().remove(pRule);
        if (cnt > this.rules().count()) {
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
     * Returns the EugeneRules Store of EugeneRules that contain the Part in either operand.
     *
     * @param {Teselagen.models.Part} pPart
     * @return {Ext.data.Store} Filtered store of EugeneRules containing pPart
     */
    getRulesInvolvingPart: function(pPart) {
        this.rules().clearFilter();

        this.rules().filterBy(function(rule) {
            if(rule.getOperand1() === pPart || rule.getOperand2() === pPart) {
                return true;
            } else {
                return false;
            }
        });

        return this.rules();
    },

    /**
     * @param {String} pName
     * @returns {Teselagen.models.EugeneRule} Returns null if none found.
     */
    getRuleByName: function(pName) {
        var index = this.rules().find("name", pName);
        if ( index !== -1) {
            return this.rules().getAt(index);
        } else {
            return null;
        }
    },

    /**
     * Checks to see if a given name is unique within the Rules.
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
