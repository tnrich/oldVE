/**
 * @class Teselagen.models.J5Bin
 * Class describing a j5Bin.
 * @author Diana Wong
 * @author Douglas Densmore (original author)
 */
Ext.define("Teselagen.models.J5Bin", {
    extend: "Ext.data.Model",

    requires: [
        //"Teselagen.models.J5Collection",
        "Teselagen.models.Part",
        "Teselagen.constants.SBOLvIcons",
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
     * @param {Ext.data.Store} parts A store of many(@link Teselagen.models.Part}
     * @param {String} binName (REQUIRED)
     * @param {String} iconID
     * @param {Boolean} directionForward
     * @param {Boolean} dsf
     * @param {Teselagen.utils.NullableInt} fro
     * @param {String} fas
     * @param {Teselagen.utils.NullableInt} extra5PrimeBps
     * @param {Teselagen.utils.NullableInt} extra3PrimeBps
     */
    fields: [
        {name: "id",                type: "int"},
        {name: "binName",           type: "string",     defaultValue: ""}, //required when making this object
        {name: "iconID",            type: "string",     defaultValue: ""},
        {name: "directionForward",  type: "boolean",    defaultValue: true},
        {name: "dsf",               type: "boolean",    defaultValue: false},
        {name: "fro",               type: "auto",       defaultValue: null},
        {name: "fas",               type: "string",     defaultValue: ""},
        {name: "extra5PrimeBps",    type: "auto",       defaultValue: null},
        {name: "extra3PrimeBps",    type: "auto",       defaultValue: null},
        {name: "collection_id",     type: "int"}

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
        {field: "iconID",           type: "presence"},
        {field: "directionForward", type: "presence"},
        {field: "dsf",              type: "presence"},
        {field: "fro",              type: "presence"},
        {field: "fas",              type: "presence"},
        {field: "extra5PrimeBps",   type: "presence"},
        {field: "extra3PrimeBps",   type: "presence"},
        {field: "collection_id",    type: "presence"}
    ],

    associations: [
        {
            type: "hasMany",
            model: "Teselagen.models.Part",
            name: "parts"
        },
        {
            type: "belongsTo",
            model: "Teselagen.models.J5Collection",
            getterName: "getJ5Collection",
            setterName: "setJ5Collection",
            associationKey: "j5Collection"
        }
    ],

    init: function(inData) {
        if (this.get("iconID") === "") {
            this.set("iconID", this.self.GENERIC);
        }
    },

    /**
     * @returns {int} count Number of Parts in parts
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
     * @returns {int} Index of Part in Bin. -1 if not present.
     */
    indexOfPart: function(pPart) {
        var index = -1;
        /*if (this.parts() === null || this.parts().count() === 0) {
            return index;
        }
        for (var i = 0; i < this.parts().count(); i++) {
            if (this.parts().getAt(i) === pPart) {
                index = i;
            }
        }*/
        index = this.parts().indexOf(pPart);
        return index;
    },

    /**
     * Adds a Part into the parts.
     * @param {Teselagen.models.Part} pPart. Can be a single part or an array of parts.
     * @param {int} pPosition Index to insert pPart. Optional. Defaults to end of of array if invalid or undefined value.
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
     * @param {int} pId Index of Part in Bin.
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
     * @param {int} pName Name of Part in Bin.
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

    /**
     * Deletes a Part after checking if a EugeneRule should also be deleted.
     * All Parts are from a collection, so removing from a J5Bin on removes the Part's link.
     * No need to actually delete SequenceFiles or Parts.
     * @param {Teselagen.models.Part} pPart Part to be deleted.
     * @param {Teselagen.manager.Store} pRulesStore List of EugeneRules in this design.
     */
    deletePart: function(pPart, pDeviceDesign) {
        var linkedPartsExist = false;
        //var isSequenceFileUsedElsewhere = false;

        for (var i = 0; i < this.parts().count(); i++) {
            if (this.parts().getAt(i) === pPart ) {
                // want to delete this Part

                var rulesToDelete = pDeviceDesign.getRulesInvolvingPart(pPart);
                //console.log(rulesToDelete);
                pDeviceDesign.removeFromRules(rulesToDelete);

                this.parts().removeAt(i);

                // If no linked Parks,
                // Determine if there are parts with the same SequenceFile. If yes, cannot remove.
                // Determine if there are EugeneRules that will become obsolete. If yes, remove them.
                /*if (!linkedPartsExist) {
                    isSequenceFileUsedElsewhere = false;

                    // SequenceFile
                    for (var k = 0; k < this.parts().count(); k++) {
                        if (i!==k && this.parts().getAt(i).get("sequenceFile") === this.parts().getAt(k).get("sequenceFile")) {
                            isSequenceFileUsedElsewhere = true;
                            break;
                        }
                    }
                    if(!isSequenceFileUsedElsewhere) {
                        pSequenceFileManager.deleteItem(pPart.get("partVO").get("sequenceFile"));
                    }

                    // Eugene Rules
                    var eugeneRules = pRulesStore.getRulesInvolvingPartVO(pPart.get("partVO"));
                    for (k = 0; k < eugeneRules.length; k++) {
                        pRulesStore.deleteItem(eugeneRules[k]);
                    }
                }

                // Delete the Part (and PartVO will also be deleted if no other part is using it).
                this.parts.splice(i, 1);
                break;*/
            }
        }

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

        /*for (var i = 0; i < this.parts().count(); i++) {
            if (this.parts().getAt(i).get("name") === pName) {
                return false;
            }
        }
        return true;*/
        var index = this.parts().find("name", pName);

        if (index === -1) {
            return true;
        } else {
            return false;
        }
    }
});