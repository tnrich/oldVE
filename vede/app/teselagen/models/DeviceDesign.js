/**
 * @class Teselagen.models.DeviceDesign
 * Class describing a DeviceDesign.
 * @author Diana Wong
 */
Ext.define("Teselagen.models.DeviceDesign", {
    extend: "Ext.data.Model",
    requires: ["Teselagen.constants.Constants",
               "Teselagen.models.J5Collection",
               "Teselagen.models.EugeneRule",
               "Teselagen.models.J5Bin"],

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

                record.bins().each(function(bin){
                    bin.cells().each(function(cell){
                        cell.setPart(cell.getPart());
                    });
                });

                var data = record.getData();
                var associatedData = record.getAssociatedData();

                var parts = [];
                associatedData.parts.forEach(function(part,partKey){
                    if(part.id) {
                        parts.push(part.id);
                    } else {
                    	console.warn("Trying to save non-saved part");
                    }
                });


                data.bins = associatedData.bins;
                data.parts = parts;
                data.rules = associatedData.rules;

                data.bins.forEach(function(bin){
                    bin.cells.forEach(function(cell){
                        delete cell.j5Bin;
                        delete cell.j5bin_id;
                    });
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
    
    constructor: function() {
    	this.callParent(arguments);
    	var self = this;
    	
        var binInsert = self.bins().insert;	
    	self.bins().insert = function() {
    		var records = arguments[1];
    		if(!Ext.isIterable(records)) records = [records];
    		for(var i=0;i<records.length;i++) {
    			records[i].setDeviceDesign(self);
    		}
    	    return binInsert.apply(self.bins(), arguments) || null;
		}
    	
    	this.bins().on("add", this.renderIfActive, this);
        this.bins().on("update", this.renderIfActive, this);
        this.bins().on("remove", this.renderIfActive, this);
        
        this.parts().on("add", this.renderIfActive, this);
        this.parts().on("update", this.renderIfActive, this);
        this.parts().on("remove", this.renderIfActive, this);
        
        this.rules().on("add", this.renderIfActive, this);
        this.rules().on("update", this.renderIfActive, this);
        this.rules().on("remove", this.renderIfActive, this);
        
    	var binFireEvent = self.bins().fireEvent;	
    	self.bins().fireEvent = function() {
    		if(Teselagen.manager.GridManager.listenersEnabled) return binFireEvent.apply(self.bins(), arguments) || null;
		}
    	
    	var partFireEvent = self.parts().fireEvent;
    	self.parts().fireEvent = function() {
    		if(Teselagen.manager.GridManager.listenersEnabled) return partFireEvent.apply(self.parts(), arguments) || null;
		}
    	
    	var ruleFireEvent = self.rules().fireEvent;
    	self.rules().fireEvent = function() {
    		if(Teselagen.manager.GridManager.listenersEnabled) return ruleFireEvent.apply(self.rules(), arguments) || null;
		}
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
    },
        {
        name: "combinatorial",
        type: "boolean",
        defaultValue: false
    },
        {
        name: "isCircular",
        type: "boolean",
        defaultValue: true
    }
    ],

    validations: [],

    associations: [
    {
        type: "hasMany",
        model: "Teselagen.models.J5Bin",
        name: "bins"
    }, {
        type: "hasMany",
        model: "Teselagen.models.Part",
        name: "parts",
        foreignKey: "devicedesign_id"
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
    active: false,
    
    reload: function(callBack) {

        var me = this;
        return Ext.getClass(this).load(this.getId(), {
            success: function(r, o) {
                console.log("record reloaded!");
                var k;
                for (k in r.data) {
                    me.data[k] = r.data[k];
                }

                me.setJ5Collection(r());
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
    
    setActive: function(value) {
    	this.active = value;
    },
    
    renderIfActive: function() {
    	if(this.active) Teselagen.manager.GridManager.renderGrid(Ext.getCmp("mainAppPanel").getActiveTab().model);
    },
    /**
     * Adds a default J5Bin given a name and index.
     * @param {String} pName
     * @param {Number} pIndex Index to insert new J5Bin. Optional. Defaults to end of of array if invalid or undefined value.
     * @returns {Teselagen.models.J5Bin}
     * ///@returns {Boolean} True if added, false if not.
     */
    addNewBinByIndex: function(pIndex, pName) {
    	var added = false;
        var cnt = this.bins().count();
        var totalRows = Teselagen.manager.DeviceDesignManager.findMaxNumParts(this);
        
        if (pName === "" || pName === undefined || pName === null) {
        	var maxBin = 0;
        	this.bins().each(function(bin) {
                var name = bin.get("binName");
                var binNumber;

                if(name.match(/^Bin\d+$/)) {
                    binNumber = parseInt(name.match(/\d+$/)[0]);

                    if(binNumber > maxBin) {
                        maxBin = binNumber;
                    }
                }
            });

            var j5Bin = Ext.create("Teselagen.models.J5Bin", {
                binName: "Bin" + (maxBin + 1)
            });
            
        } else {
        	 var j5Bin = Ext.create("Teselagen.models.J5Bin", {
                 binName: pName
             });
        }
        
        var phantomCells = [];
		for(var i=0;i<totalRows;i++) {
			var phantomCell = Ext.create("Teselagen.models.Cell", {
				index: i
			});
			phantomCell.setJ5Bin(j5Bin);
			phantomCells.push(phantomCell);
		}	
		j5Bin.cells().add(phantomCells);

        if (pIndex >= 0 && pIndex < cnt) this.bins().insert(pIndex, j5Bin); 
        else this.bins().add(j5Bin);
        
        return j5Bin;
    },
    
    generateDefaultNewBin: function(pName) {
    	var cnt = this.bins().count();
        var totalRows = Teselagen.manager.DeviceDesignManager.findMaxNumParts(this);
        
        if (pName === "" || pName === undefined || pName === null) {
        	var maxBin = 0;
        	this.bins().each(function(bin) {
                var name = bin.get("binName");
                var binNumber;

                if(name.match(/^Bin\d+$/)) {
                    binNumber = parseInt(name.match(/\d+$/)[0]);

                    if(binNumber > maxBin) {
                        maxBin = binNumber;
                    }
                }
            });

            var j5Bin = Ext.create("Teselagen.models.J5Bin", {
                binName: "Bin" + (maxBin + 1)
            });
            
        } else {
        	 var j5Bin = Ext.create("Teselagen.models.J5Bin", {
                 binName: pName
             });
        }
        
        var phantomCells = [];
		for(var i=0;i<totalRows;i++) {
			var phantomCell = Ext.create("Teselagen.models.Cell", {
				index: i
			});
			phantomCell.setJ5Bin(j5Bin);
			phantomCells.push(phantomCell);
		}	
		j5Bin.cells().add(phantomCells);
		
		return j5Bin;
    },
    
    /**
     * Checks to see if a given name is unique within the J5Bins names.
     * @param {String} pName Name to check against bins.
     * @returns {Boolean} True if unique, false if not.
     */
    isUniqueBinName: function(pName) {
        var index = this.bins().find("binName", pName);

        if (index === -1) {
            return true;
        } else {
            return false;
        }
    },
    
    /**
     * Creates a J5Collection with pNumBins empty J5Bins.
     * @param {Number} pNumBins Number of empty J5Bins to make in Collection
     * @returns {Teselagen.models.J5Collection}
     */
    createEmptyGridModel: function(pNumBins) {
        var bins = this.bins();

        if (bins.count() > 0) {
            console.warn("Warning. Overwriting existing J5Collection");
        }
        for (var i = 0; i < pNumBins; i++) {
            var bin = Ext.create("Teselagen.models.J5Bin", {
                binName: "No_Name" + i
            });
            bins.insertAt(i, bin);
        }

        return bins;
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
     * @param {Boolean} filterThenAndNextTo If true, filter out rules that involve
     * the part if they are THEN or NEXTTO rules. For rendering purposes, this
     * flag should be true, which is the default value.
     * @return {Ext.data.Store} Filtered store of EugeneRules containing pPart
     */
    getRulesInvolvingPart: function(pPart, filterThenAndNextTo) {
    	var constants = Teselagen.constants.Constants;
        
        // filterThenAndNextTo should default to true.
        if(filterThenAndNextTo === undefined) {
            filterThenAndNextTo = true;
        }

        this.rules().clearFilter(true);
        this.rules().filterBy(function(rule) {
            if (rule.getOperand1() === pPart) {
                return true;
            } else if(rule.getOperand2() === pPart) {
                if(filterThenAndNextTo &&
                   rule.get("compositionalOperator") !== constants.THEN &&
                   rule.get("compositionalOperator") !== constants.NEXTTO) {
                    return true;
                } else if(!filterThenAndNextTo) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        });

        return this.rules();
    },

    getNumberOfRulesInvolvingPart: function(pPart) {
    	this.rules().suspendEvents(false);
    	var numberOfRules = this.getRulesInvolvingPart(pPart, true).count();
    	this.rules().resumeEvents();
    	return numberOfRules;
    },

    /**
     * @param {String} pName
     * @returns {Teselagen.models.EugeneRule} Returns null if none found.
     */
    getRuleByName: function(pName) {
        this.rules().clearFilter(true);
        var index = this.rules().find("name", pName, 0,false,false, true);
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
        this.rules().clearFilter(true);
        var index = this.rules().find("name", pName, 0,false,false, true);

        if (index === -1) {
            return true;
        } else {
            return false;
        }
    },
    
    getPartById: function(pId) {
	    var index = this.parts().find("id", pId);
	
	    if ( index === -1 ) {
	        return null;
	    } else {
	        return this.parts().getAt(index);
	    }
    },


});
