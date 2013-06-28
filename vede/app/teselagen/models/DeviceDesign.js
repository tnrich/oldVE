/**
 * @class Teselagen.models.DeviceDesign
 * Class describing a DeviceDesign.
 * @author Diana Wong
 */
Ext.define("Teselagen.models.DeviceDesign", {
    extend: "Ext.data.Model",
    requires: ["Teselagen.constants.Constants",
               "Teselagen.models.J5Collection",
               "Teselagen.models.EugeneRule"],

    proxy: {
        type: "rest",
        //url: "/vede/test/data/json/getDeviceDesign.json",
        reader: {
            type: "json",
            root: "designs"
        },
        writer: {
            type: "json",
            //This method should resolve associations and prepare data before saving design
            getRecordData: function(record) {
                var data = record.getData();
                var associatedData = record.getAssociatedData();
                var j5Collection = associatedData.j5collection;

                var rules = associatedData.rules;
                data.j5collection = j5Collection;

                var binsTempArray = [];

                record.getJ5Collection().bins().each(function(bin) {
                    var partsTempArray = [];
                    bin.parts().each(function(part) {
                        {partsTempArray.push(part.getData().id); }
                    });
                    binsTempArray.push(partsTempArray);
                });

                data.j5collection.bins.forEach(function(bin,binKey){
                    var partIds = binsTempArray[binKey];
                    bin.fases = [];
                    for (var i= 0; i < partIds.length; i++) {
                        bin.fases[i] = bin.parts[i].fas;
                    }
                    bin.parts = partIds;
                });

                data.rules = rules;

                data.rules.forEach(function(rule, ruleKey) {
                    delete data.rules[ruleKey]["Teselagen.models.Part"];
                    delete data.rules[ruleKey]["teselagen.models.devicedesign_id"];
                });

                return data;
            }
        },
        buildUrl: function(request) {

            this.debugFlag = false;
            if(this.debugFlag) console.log(request);


            // CASE 1: READ ALL DEVICE DESIGNS FROM GIVEN PROJECT
            if(request.action === "read" && request.params)
            {
                if(request.operation.filters)
                {
                    if(request.operation.filters[0] && !request.params.id)
                    {
                        if(request.operation.filters[0].property==="project_id")
                        {
                            var url = "/projects"+'/'+request.operation.filters[0].value+"/devicedesigns";
                            if(this.debugFlag) console.log("READING DEVICE DESIGNS FROM PROJECT: ",url);
                            delete request.params.filter;
                            return Teselagen.manager.SessionManager.buildUserResUrl(url, this.url);
                        }
                    }
                }
            }

            // CASE 2: CREATE A NEW DEVICEDESIGN AT PROJECT
            if(request.action === "create" && request.records[0].data.project_id!="")
            {
                var url = "/projects"+'/'+request.records[0].data.project_id+"/devicedesigns";
                if(this.debugFlag) console.log("CREATING DEVICE DESIGN AT PROJECT: ",url);
                delete request.params.filter;
                return Teselagen.manager.SessionManager.buildUserResUrl(url, this.url);                
            }


            // CASE 3: UPDATE AN EXISTING DEVICEDESIGN AT PROJECT
            if(request.action === "update" && request.records[0].data.project_id!="" && request.records[0].data.id!="")
            {
                var url = "/projects"+'/'+request.records[0].data.project_id+"/devicedesigns"+'/'+request.records[0].data.id;
                if(this.debugFlag) console.log("UPDATE DEVICE DESIGN AT PROJECT: ",url);
                delete request.params.filter;
                return Teselagen.manager.SessionManager.buildUserResUrl(url, this.url);                
            }


            // CASE 4: READ SPECIFIC DEVICE DESIGN FROM PROJECT
            if(request.action === "read" && request.params)
            {
                if(request.operation.filters)
                {
                    if(request.operation.filters[0] && request.params.id)
                    {
                        if(request.operation.filters[0].property==="project_id")
                        {
                            var url = "/projects"+'/'+request.operation.filters[0].value+"/devicedesigns/"+request.params.id;
                            if(this.debugFlag) console.log("READING SPECIFIC DESIGN FROM PROJECT: ",url);
                            delete request.params.filter;
                            return Teselagen.manager.SessionManager.buildUserResUrl(url, this.url);
                        }
                    }
                }
            }

            // CASE 4: READ SPECIFIC DEVICE DESIGN FROM PROJECT
            if(request.action === "destroy" && request.records[0].data.id)
            {
                var url = "/projects"+'/'+request.records[0].data.project_id+"/devicedesigns/"+request.records[0].data.id;
                if(this.debugFlag) console.log("DESTROYING SPECIFIC DESIGN FROM PROJECT: ",url);
                delete request.params.filter;
                return Teselagen.manager.SessionManager.buildUserResUrl(url, this.url);                
            }

            console.log("No devicedesign url generated");


        },
        appendId: true,
        noCache: false,
        //filterParam: undefined,
        groupParam: undefined,
        pageParam: undefined,
        startParam: undefined,
        sortParam: undefined,
        limitParam: undefined
    },

    //constructor: function(inData) {
    //    this.callParent([inData]);
    //
    //    this.setJ5Collection(Ext.create("Teselagen.models.J5Collection"));
    //},

    /**
     * Input parameters.
     * @param {int} id
     */
    fields: [{
        name: "id",
        type: "long"
    }, {
        name: "project_id",
        type: "long"
    }, {
        name: "name",
        type: "String",
        defaultValue: ""
    }],

    validations: [],

    associations: [{
        type: "hasOne",
        model: "Teselagen.models.J5Collection",
        getterName: "getJ5Collection",
        setterName: "setJ5Collection",
        associationKey: "j5collection",
        name: "j5collection" // Note: not a documented config, but specified for getRecordData
    }, {
        type: "hasOne",
        model: "Teselagen.models.SBOLvIconInfo",
        getterName: "getSBOLvIconInfo",
        setterName: "setSBOLvIconInfo",
        associationKey: "sbolvIconInfo"
    }, {
        type: "hasMany",
        model: "Teselagen.models.EugeneRule",
        name: "rules",
        associationKey: "rules"
    }, {
        type: "hasMany",
        model: "Teselagen.models.J5Run",
        name: "j5runs",
        associationKey: "j5runs",
        autoload: true,
        foreignKey: "devicedesign_id"
    }, {
        type: "belongsTo",
        model: "Teselagen.models.Project",
        getterName: "getProject",
        setterName: "setProject",
        associationKey: "project",
        foreignKey: "id"
    }],

    modelIsLoaded: false,

    reload: function(callBack) {

        var me = this;
        return Ext.getClass(this).load(this.getId(), {
            success: function(r, o) {
                console.log("record reloaded!");
                var k;
                for (k in r.data) {
                    me.data[k] = r.data[k];
                }

                me.setJ5Collection(r.getJ5Collection());
                me.j5runs().removeAll();
                me.j5runs().insert(0, r.j5runs());

                me.commit();
                if (Ext.isFunction(callBack)) {
                    callBack(me, true, o);
                }
            },
            failure: function() {
                if (Ext.isFunction(callBack)) {
                    callBack(false);
                }
            }
        });
    },

    getDesign: function() {
        /*
        if(!this.modelIsLoaded)
        {
            this.modelIsLoaded = true;
            this.reload(function(record){
                if (Ext.isFunction(callback)) {
                    callback(record);
                }
            });
        }
        */
        return this;
    },

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
            var bin = Ext.create("Teselagen.models.J5Bin", {
                binName: "No_Name" + i
            });
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
        if (this.rules().count() === 0) {
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
        var constants = Teselagen.constants.Constants;

        this.rules().clearFilter();

        this.rules().filterBy(function(rule) {
            if (rule.getOperand1() === pPart) {
                return true;
            } else if(rule.getOperand2() === pPart && 
                      rule.get("compositionalOperator") !== constants.THEN &&
                      rule.get("compositionalOperator") !== constants.NEXTTO) {
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
        if (index !== -1) {
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
