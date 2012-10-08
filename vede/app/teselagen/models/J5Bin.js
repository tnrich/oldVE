/**
 * @class Teselagen.models.J5Bin
 * Class describing a j5Bin.
 * @author Diana Wong
 * @author Douglas Densmore (original author)
 */
Ext.define("Teselagen.models.J5Bin", {
    extend: "Ext.data.Model",

    requires: [
        "Teselagen.constants.SBOLvIcons",
        "Teselagen.models.Part",
        "Teselagen.utils.NullableInt"
    ],

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
        /*{
            name: "parts",
            convert: function(v, record) {
                return v || [];
            }
        },*/
        {name: "binName",           type: "string",     defaultValue: ""}, //required when making this object
        {name: "iconID",            type: "string",     defaultValue: ""},
        {name: "directionForward",  type: "boolean",    defaultValue: true},
        {name: "dsf",               type: "boolean",    defaultValue: false},
        {name: "fro",               type: "auto",       defaultValue: null},
        {name: "fas",               type: "string",     defaultValue: ""},
        {name: "extra5PrimeBps",    type: "auto",       defaultValue: null},
        {name: "extra3PrimeBps",    type: "auto",       defaultValue: null}

        /* worry about this later. Original does not include this field.
        ,{
            name: "SBOLvIconInfo",
            convert: function(v, record) {
                if (v !== undefined || v !== null) {
                    return v;
                } else {
                    return Ext.create("Teselagen.models.SBOLvIconsInfo")
                }
            }
        }*/
        
    ],

    associations: [
        {type: "hasMany", model: "Teselagen.models.Part", name: "parts", defaultValue: []},
        {type: "belongsTo", model: "Teselagen.models.J5Collection"}
    ],

    init: function(inData) {
        if (this.get("iconID") === "") {
            this.set("iconID", this.self.GENERIC);
        }
    },

    /**
     * @returns {int} count Number of Parts in parts
     */
    binCount: function() {
        return this.parts().count();
    },

    /**
     * @param {Teselagen.models.Part} pPart
     * @returns {Boolean} partIsPresent True is in this J5Bin, False if not.
     */
    isPartInBin: function(pPart) {
        if (this.parts() === null || this.parts().count() === 0) {
            return false;
        }

        for (var i = 0; i < this.parts().count(); i++) {
            if (this.parts().getAt(i) === pPart) {
                return true;
            }
        }
        return false;
    },

    /**
     * @param {Teselagen.models.Part} pPart
     * @returns {int} index Index of Part in Bin. -1 if not present.
     */
    indexOfPartInBin: function(pPart) {
        var index = -1;
        if (this.parts() === null || this.parts().count() === 0) {
            return index;
        }
        for (var i = 0; i < this.parts().count(); i++) {
            if (this.parts().getAt(i) === pPart) {
                index = i;
            }
        }
        return index;
    },

    /**
     * Adds a Part into the parts.
     * @param {Teselagen.models.Part} pPart. Can be a single part or an array of parts.
     * @param {int} pPosition Index to insert pPart. Optional. Defaults to end of of array if invalid or undefined value.
     * @returns {Boolean} added True if added, false if not.
     */
    addToBin: function(pPart, pPosition) {
        var added = false;

        var cnt = this.binCount();

        if (pPosition >= 0 && pPosition < cnt) {
            //this.parts().splice(pPosition, 0, pPart);
            this.parts().insert(pPosition, pPart);
        } else {
            //this.parts().push(pPart);
            this.parts().add(pPart);
        }

        var newCnt  = this.binCount();
        if (newCnt > cnt) {
            added = true;
        }
        return added;
    },

    /**
     * Removes a Part from the parts.
     * @param {Teselagen.models.Part} pPart
     * @returns {Boolean} removed True if removed, false if not.
     */
    removeFromBin: function(pPart) {
        var removed = false;

        var cnt = this.binCount();
        //Ext.Array.remove(this.parts(), pPart);
        this.parts().remove(pPart);


        var newCnt  = this.binCount();
        if (newCnt < cnt) {
            removed = true;
        }
        return removed;
    }


});