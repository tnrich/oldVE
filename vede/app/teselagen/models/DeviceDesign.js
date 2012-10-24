Ext.onReady(function() {
Ext.data.writer.Json.override({
    getRecordData: function(record, getEverything) {
        return record.getAllData();
        //return this.callOverridden(arguments);
        /*
        if(this.writeEverything || record.writeEverything){
            console.log('getRecordData', this,arguments);
            return record.getAllData();
        }else{
            return this.callOverridden(arguments);
        }
        */
        
    }
});

Ext.data.Model.addMembers({
    getAllData: function() {
        var data1 = this.getData();
        var data2 = this.getAssociatedData( );
        console.log(data1);
        console.log(data2);
        var dataMerged = Ext.Object.merge(data1, data2);
        return dataMerged;
    }
});
});

/**
 * @class Teselagen.models.DeviceDesign
 * Class describing a DeviceDesign.
 * @author Diana Wong
 */
Ext.define("Teselagen.models.DeviceDesign", {
    extend: "Ext.data.Model",
    requires: [
        //"Teselagen.models.Project",
        "Teselagen.models.J5Collection"//,
        //"Teselagen.models.EugeneRule",
        //,'custom.JsonWriterOverride'
    ],
    // The models will break if there is not proxy defined here. Please define appropriately. DW
    // We need a rest proxy here to load designs from here. RP
    
    proxy: {
        type: 'rest',
        url: 'getDeviceDesign.json', // For testing just create a file with this name and fill with data.
        reader: {
            type: 'json',
            root: 'design'
        },
        writer: {
            type: 'json',
            writeEverything: true
        },
        buildUrl: function() {
            return sessionData.baseURL + 'getDeviceDesign'; // This method reBuild the URL for ajax requests from parents models
        }
    },
        
    statics: {
    },

    /**
     * Input parameters.
     * @param {int} id
     */
    fields: [
        {
            name: "id", type: "long"
        },
        {
            name: "payload", type: "string" // This is temporary, not really needed
        }
    ],

    validations: [
        {field: "id", type: "presence"}
    ],

    associations: [
        {
            type: "hasOne",
            model: "Teselagen.models.J5Collection",
            getterName: "getJ5Collection",
            setterName: "setJ5Collection",
            associationKey: "j5collection"
        },
        {
            type: "hasMany",
            model: "Teselagen.models.EugeneRule",
            name: "rules"
        },
        {
            type: "belongsTo",
            model: "Teselagen.models.DeviceEditorProject",
            getterName: "getDeviceEditorProject",
            setterName: "setDeviceEditorProject",
            associationKey: "deviceEditorProject"
        }
    ],

    init: function() {
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
        //this.set("j5Collection", j5Coll);
        this.setJ5Collection(j5Coll);
        return j5Coll;
    },

    /** NOT TESTED
     * Creates a J5Collection from given J5Bins.
     * @param {Teselagen.models.J5Bins[]} pJ5Bins Array of J5Bins to put into Collection, in the order the bins should be placed.
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
     * @param {Teselagen.models.EugeneRule} pRule. Can be a single part or an array of parts.
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
     * @param {Teselagen.models.EugeneRule} pRule. Can be a single part or an array of parts.
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
     * Returns the EugeneRules Store of EugeneRules that containt the Part in either operand.
     *
     * @param {Teselagen.models.Part} pPart
     * @return {Teselagen.models.EugeneRule[]} Array of EugeneRules containing pPart
     */
    getRulesInvolvingPart: function(pPart) {
        var rules = [];
        for (var i = 0; i < this.rules().count(); i++) {
            if (this.rules().getAt(i).getOperand1() === pPart || this.rules().getAt(i).get("operand2") === pPart) {
                rules.push(this.rules().getAt(i));
            }
        }

        return rules;
    },

    /**
     * @param {String} name
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