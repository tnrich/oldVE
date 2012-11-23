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
        "Teselagen.constants.Constants",
        "Teselagen.constants.SBOLIcons",
        "Teselagen.utils.NullableInt"
    ],

    proxy: {
        type: "memory",
        reader: {type: "json"}
    },

    statics: {
        GENERIC: "generic"
    },

    /**
     * Input parameters.
     * @param {String} binName (REQUIRED) String must be alphanumeric with only "_" or "-". Will eliminate other characters when saving the name.
     * @param {String} iconID
     * @param {Boolean} directionForward True for "forward" or False for "reverse". All parts within a bin should be the same direction.
     * @param {Boolean} dsf Direct Synthesis Firewall. False to allow j5 the flexibility to choose. True to prevent a direct synthesis piece from extending from a marked target part row to the target part in the next row.
     * @param {Teselagen.utils.NullableInt} fro Forced Relative Overlap/Overhang Position. Empty to allow j5 the flexibility to choose, or an integral number of bps (to forcibly set the relative overlap/overhang position).
     * @param {String} fas Forced Assembly Strategy. Empty to allow j5 the flexibility to choose.
     * @param {Teselagen.utils.NullableInt} extra5PrimeBps
     * @param {Teselagen.utils.NullableInt} extra3PrimeBps
     */
    fields: [
        //{name: "id",                type: "long"},
        //{name: "j5collection_id",     type: "long"},
        {
            name: "binName",
            convert: function(v) {
                if (typeof(v) === "number" || typeof(v) === "string") {
                    if (Teselagen.utils.FormatUtils.isLegalName(v)) {
                        return v;
                    } else {
                        return Teselagen.utils.FormatUtils.reformatName(v);
                    }
                } else {
                    return "";
                }
            }
        }, //required when making this object
        //{name: "iconID",            type: "string",     defaultValue: ""},
        {
            name: "iconID",
            convert: function(v, record) {
                if ( v === null || v === undefined || v === "") {
                    // DW NOTE: I am saving the key here, but maybe it should be name
                    // Depends on how you use iconID to find the original URL.
                    return Teselagen.constants.SBOLIcons.ICONS.GENERIC.key;
                } else {
                    return v;
                }
            }
        },

        {name: "directionForward",  type: "boolean",    defaultValue: true},
        {name: "dsf",               type: "boolean",    defaultValue: false},
        {name: "fro",               type: "string",     defaultValue: "NONE"},
        {name: "fas",               type: "string",     defaultValue: "NONE"},
        {name: "extra5PrimeBps",    type: "auto",       defaultValue: null},
        {name: "extra3PrimeBps",    type: "auto",       defaultValue: null}

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
        {field: "binName",          type: "presence"},
        {
            field: "iconID",
            type: "inclusion",
            //list: Teselagen.constants.SBOLIcons.ICON_LIST
        },
        //field: "directionForward", type: "presence"},
        //{field: "dsf",              type: "presence"},
        //{field: "fro",              type: "presence"},
        {
            field: "fas",
            type: "inclusion",
            list: Teselagen.constants.Constants.FAS_LIST
        }//,
        //{field: "extra5PrimeBps",   type: "presence"},
        //{field: "extra3PrimeBps",   type: "presence"},
        //{field: "j5collection_id",    type: "presence"}
    ],

    associations: [
        {
            type: "hasMany",
            model: "Teselagen.models.Part",
            name: "parts",
            foreignKey: "j5bin_id"
        },
        {//Needed to find the parent of a child
            type: "belongsTo",
            model: "Teselagen.models.J5Collection",
            name: "j5collection",
            getterName: "getJ5Collection",
            setterName: "setJ5Collection",
            associationKey: "j5Collection",
            foreignKey: "j5collection_id"
        }
    ],

    /**
     * @returns {Number} count Number of Parts in parts
     */
    partCount: function() {
        return this.parts().count();
    },

    /**
     * @param {Teselagen.models.Part} pPart
     * @returns {Boolean} True is in this J5Bin, False if not.
     */
    hasPart: function(pPart) {
        if (this.indexOfPart(pPart) === -1) {
            return false;
        } else {
            return true;
        }
    },

    /**
     * @param {Teselagen.models.Part} pPart
     * @returns {Number} Index of Part in Bin. -1 if not present.
     */
    indexOfPart: function(pPart) {
        var index = -1;
        index = this.parts().indexOf(pPart);
        return index;
    },

    /**
     * Adds a Part into the parts.
     * @param {Teselagen.models.Part} pPart. Can be a single part or an array of parts.
     * @param {Number} pPosition Index to insert pPart. Optional. Defaults to end of of array if invalid or undefined value.
     * @returns {Boolean} True if added, false if not.
     */
    addToParts: function(pPart, pPosition) {
        var added = false;

        var cnt = this.partCount();

        if (pPosition >= 0 && pPosition < cnt) {
            //this.parts().splice(pPosition, 0, pPart);
            this.parts().insert(pPosition, pPart);
        } else {
            //this.parts().push(pPart);
            this.parts().add(pPart);
        }

        var newCnt  = this.partCount();
        if (newCnt > cnt) {
            added = true;
        }
        return added;
    },

    /**
     * Removes a Part from the parts.
     * This DOES NOT check if parts are in EugeneRules. Use deleteItem to check.
     * @param {Teselagen.models.Part} pPart
     * @returns {Boolean} True if removed, false if not.
     */
    removeFromParts: function(pPart) {
        var removed = false;

        var cnt = this.partCount();
        //Ext.Array.remove(this.parts(), pPart);
        this.parts().remove(pPart);

        var newCnt  = this.partCount();
        if (newCnt < cnt) {
            removed = true;
        }
        return removed;
    },

    // =============================================
    // METHODS FROM PartProxy.as / PartManager.js

    /** (From PartProxy)
     * Returns first matching Part with given Id number.
     * @param {Number} pId Index of Part in Bin.
     * @returns {Teselagen.models.Part}
     */
    getPartById: function(pId) {
        var index = this.parts().find("id", pId);

        if ( index === -1 ) {
            return null;
        } else {
            return this.parts().getAt(index);
        }
    },

    /** (From PartProxy)
     * Returns first matching Part with given name.
     * @param {Number} pName Name of Part in Bin.
     * @returns {Teselagen.models.Part}
     */
    getPartByName: function(pName) {
        var index = this.parts().find("name", pName);

        if ( index === -1 ) {
            return null;
        } else {
            return this.parts().getAt(index);
        }
    },

    /** From PartProxy.as.
     * Deletes a Part after checking if a EugeneRule should also be deleted.
     * All Parts are from a collection, so removing from a J5Bin on removes the Part's link.
     * No need to actually delete SequenceFiles or Parts.
     * @param {Teselagen.models.Part} pPart Part to be deleted.
     * @param {Teselagen.manager.DeviceDesign}
     * @returns {Boolean} True if removed, false if not.
     */
    deletePart: function(pPart, pDeviceDesign) {
        var cnt = this.partCount(); //this.parts().count()
        var deleted = false;

        for (var i = 0; i < cnt; i++) {
            if (this.parts().getAt(i) === pPart ) {
                // want to delete this Part

                var rulesToDelete = pDeviceDesign.getRulesInvolvingPart(pPart);
                //console.log(rulesToDelete);
                pDeviceDesign.removeFromRules(rulesToDelete);

                this.parts().removeAt(i);
            }
        }
        var newCnt  = this.partCount();
        if (newCnt < cnt) {
            deleted = true;
        }
        return deleted;

        // Refresh all parts (to change colors, etc)
        // DW: NEED TO FIRE EVENT TO REFRESH THE VIEW.
    },
    

    /** IS THIS NECESSARY?
     *
     */
    createPart: function(pPart) {
        // If none passed in, create new part, create a new PartVO
        var newPart = pPart;
        if (pPart === null) {
            newPart = Ext.create("Teselagen.models.Part", {});
        }

        // Create new Part containing PartVO
        this.parts().add(newPart);

        return newPart;
    },

    // This differs from flex implementation
    /**
     * Checks to see if a given name is unique within the Parts names.
     * @param {String} pName Name to check against parts.
     * @returns {Boolean} if unique, false if not.
     */
    isUniquePartName: function(pName) {
        var index = this.parts().find("name", pName);

        if (index === -1) {
            return true;
        } else {
            return false;
        }
    }
});