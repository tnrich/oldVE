/**
 * @class Teselagen.models.J5Bin
 * Class describing a j5Bin.
 * @author Diana Wong
 * @author Douglas Densmore (original author)
 */
Ext.define("Teselagen.models.J5Bin", {
    extend: "Ext.data.Model",

    requires: [
        "Teselagen.models.Part",
        "Teselagen.models.Cell",
        "Teselagen.constants.Constants",
        "Teselagen.constants.SBOLIcons",
        "Teselagen.utils.NameUtils",
        "Teselagen.utils.NullableInt"
    ],

    proxy: {
        type: "memory",
        reader: {type: "json"},
        listeners: {
            remove: function () {
                console.log("Attemping to remove j5bin");
            }
        }
    },
    statics: {
        // For Default Names
        defaultNamePrefix: "Bin",
        highestDefaultNameIndex: 1
    },

    /**
     * Input parameters.
     * @param {String} binName (REQUIRED) String must be alphanumeric with only "_" or "-". Will eliminate other characters when saving the name.
     * @param {String} iconID
     * @param {Boolean} directionForward True for "forward" or False for "reverse". All parts within a bin should be the same direction.
     * @param {Boolean} dsf Direct Synthesis Firewall. False to allow j5 the flexibility to choose. True to prevent a direct synthesis piece from extending from a marked target part row to the target part in the next row.
     * @param {Teselagen.utils.NullableInt} fro Forced Relative Overlap/Overhang Position. Empty to allow j5 the flexibility to choose, or an integral number of bps (to forcibly set the relative overlap/overhang position).
     * @param {Array} fas Forced Assembly Strategy for each Part in the Bin. Set to None to allow j5 the flexibility to choose.
     * @param {Teselagen.utils.NullableInt} extra5PrimeBps
     * @param {Teselagen.utils.NullableInt} extra3PrimeBps
     */
    fields: [
        {
            name: "binName",
            convert: function(v, record) {
                var name;
                v = Ext.String.trim(v+"");
                if (v === "" || v === undefined || v === null) {
                    record.self.highestDefaultNameIndex += 1;
                    name = record.self.defaultNamePrefix/*+ record.self.highestDefaultNameIndex*/;
                } else {
                    if (Teselagen.utils.NameUtils.isLegalName(v)) {
                        name = v.toString();
                    } else {
                        if(Vede.application.warnings) console.warn("Illegal name " + v + ". Name can only contain alphanumeric characters, underscore (_), and hyphen (-). Removing non-alphanumerics.");
                        name = Teselagen.utils.NameUtils.reformatName(v);
                    }
                }
                return name;
            }
        },

        {
            name: "iconID",
            convert: function(v) {
                //console.log(Teselagen.constants.SBOLIcons.ICON_LIST);
                if ( v === null || v === undefined || v === "") {
                    // DW NOTE: I am saving the key here, but maybe it should be name
                    // Depends on how you use iconID to find the original URL.
                    return Teselagen.constants.SBOLIcons.ICONS["USER-DEFINED"].key;
                } else {
                    return v;
                }
            }
        },

        {name: "directionForward",  type: "boolean",    defaultValue: true},
        {name: "dsf",               type: "boolean",    defaultValue: false},
        {name: "fro",               type: "string",     defaultValue: ""},
        {name: "fases",               defaultValue: []},
        {name: "extra5PrimeBps",    type: "auto",       defaultValue: null},
        {name: "extra3PrimeBps",    type: "auto",       defaultValue: null},
        {name: "devicedesign_id",    type: "long",       defaultValue: null}


        /* worry about this later. Original does not include this field.
        ,{
            name: "SBOLvIconInfo",
            convert: function(v, record) {
                if (v === undefined || v === null || v === "") {
                    return Ext.create("Teselagen.models.SBOLvIconsInfo");
                } else {
                    return v;
                }
            }
        }*/
        
    ],

    validations: [
        {field: "binName",          type: "presence"}
//        {
//            field: "iconID",
//            type: "inclusion",
//            list: Teselagen.constants.SBOLIcons.ICON_LIST  // This causes a loading problem in debugger
//        }
        //field: "directionForward", type: "presence"},
        //{field: "dsf",              type: "presence"},
        //{field: "fro",              type: "presence"},
//        {
//            field: "fas",
//            type: "inclusion",
//            list: Teselagen.constants.Constants.FAS_LIST
//        }//,
        //{field: "extra5PrimeBps",   type: "presence"},
        //{field: "extra3PrimeBps",   type: "presence"},
        //{field: "j5collection_id",    type: "presence"}
    ],

    associations: [
        {
            type: "hasMany",
            model: "Teselagen.models.Cell",
            name: "cells",
            foreignKey: "cell_id"
        }, {
            type: "belongsTo",
            model: "Teselagen.models.DeviceDesign",
            getterName: "getDeviceDesign",
            setterName: "setDeviceDesign",
            foreignKey: "devicedesign_id"
        }
    ],

    /**
     * Model constructor.
     * Needed to set fases array so that it will create an instance variable.
     */
    constructor: function(pCfg) {
        //var fases = pCfg && pCfg.fases ? pCfg.fases : [];
        this.callParent(arguments);
        //this.set("fases", fases);
        
        this.cells().on("add", this.renderIfActive, this);
        this.cells().on("update", this.renderIfActive, this);
        this.cells().on("remove", this.renderIfActive, this);
        
        var self = this;
    	var cellFireEvent = self.cells().fireEvent;
    	self.cells().fireEvent = function() {
    		if(Teselagen.manager.GridManager.listenersEnabled) return cellFireEvent.apply(self.cells(), arguments) || null;
		}
    	
    	var setDeviceDesign = self.setDeviceDesign;
    	self.setDeviceDesign = function() {
    		self.isActive = function() {
				if(self.getDeviceDesign()) return self.getDeviceDesign().active;
				else return false;		
    		}
    		return setDeviceDesign.apply(self, arguments) || null;
		}
    	
    },
    
    isActive: function() {
    	return false;
    },
    
    renderIfActive: function() {
    	if(this.isActive()) Teselagen.manager.GridManager.renderGrid(Ext.getCmp("mainAppPanel").getActiveTab().model);
    },
    
    /**
     * Removes a Part from the parts.
     * This DOES NOT check if parts are in EugeneRules. Use deleteItem to check.
     * @param {Teselagen.models.Part} pPart
     * @returns {Boolean} True if removed, false if not.
     */
//    removeFromParts: function(pPart) {
//        var removed = false;
//        var index = this.parts().indexOf(pPart);
//        if (index >= 0) {
//            this.parts().remove(pPart);
//            this.get("fases").splice(index, 1);
//            removed = true;
//        }
//        return removed;
//    },

    // =============================================
    // METHODS FROM PartProxy.as / PartManager.js

    /**
     * Returns FAS for a part
     * @param {Number} index Part index
     * @returns {String} Null if not found.
     */
     /*
    getFas: function(pIndex) {
        var fas = this.get("fases")[pIndex];
        if (!fas) {
            console.warn("Invalid part index:", pIndex);
            fas = null;
        }
        return fas;
    },
    */
    
    /** (From PartProxy)
     * Returns first matching Part with given Id number.
     * @param {Number} pId Index of Part in Bin.
     * @returns {Teselagen.models.Part}
     */

     /*
    getPartById: function(pId) {
        var index = this.parts().find("id", pId);

        if ( index === -1 ) {
            return null;
        } else {
            return this.parts().getAt(index);
        }
    },
    */

    /** (From PartProxy)
     * Returns first matching Part with given name.
     * @param {Number} pName Name of Part in Bin.
     * @returns {Teselagen.models.Part}
     */

     /*
    getPartByName: function(pName) {
        var index = this.parts().find("name", pName);

        if ( index === -1 ) {
            return null;
        } else {
            return this.parts().getAt(index);
        }
    },
    */

    /** From PartProxy.as.
     * Deletes a Part after checking if a EugeneRule should also be deleted.
     * All Parts are from a collection, so removing from a J5Bin on removes the Part's link.
     * No need to actually delete SequenceFiles or Parts.
     * @param {Teselagen.models.Part} pPart Part to be deleted.
     * @param {Teselagen.models.DeviceDesign} deviceDesign
     * @returns {Boolean} True if removed, false if not.
     */

     /*
    deletePart: function(pPart, pDeviceDesign) {
        var cnt = this.partCount();
        var deleted = false;

        for (var i = 0; i < cnt; i++) {
            if (this.parts().getAt(i) === pPart ) {
                // want to delete this Part

                var rulesToDelete = pDeviceDesign.getRulesInvolvingPart(pPart);
                pDeviceDesign.removeFromRules(rulesToDelete.getRange());

                this.parts().removeAt(i);
                this.get("fases").splice(i, 1);
            }
        }
        var newCnt  = this.partCount();
        if (newCnt < cnt) {
            deleted = true;
        }
        return deleted;
    },
    */
    

    /** IS THIS NECESSARY?
     *
     */
//    createPart: function(pPart) {
//        // If none passed in, create new part, create a new PartVO
//        var newPart = pPart;
//        if (pPart === null) {
//            newPart = Ext.create("Teselagen.models.Part", {});
//        }
//
//        // Create new Part containing PartVO
//        this.parts().add(newPart);
//
//        return newPart;
//    },

    // This differs from flex implementation
    /**
     * Checks to see if a given name is unique within the Parts names.
     * @param {String} pName Name to check against parts.
     * @returns {Boolean} if unique, false if not.
     */
     /*
    isUniquePartName: function(pName) {
        var index = this.parts().find("name", pName);

        if (index === -1) {
            return true;
        } else {
            return false;
        }
    }
    */
});
