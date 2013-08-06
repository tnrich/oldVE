/**
 * @class Teselagen.models.Cell
 * Class describing a Cell.
 * @author Diana Wong
 * @author Douglas Densmore (original author) ?
 */
Ext.define("Teselagen.models.Cell", {
    extend: "Ext.data.Model",

    requires: [
        "Teselagen.models.Part",
        "Teselagen.constants.Constants"
    ],

    proxy: {
        type: "memory",
        reader: {type: "json"}
    },


    /**
     * @param {Long} part_id
     */
    fields: [{
        name: "index",
        type: "int",
        defaultValue: 0
    }, {
        name: "part_id",
        type: "long",
        defaultValue: null
    }, {
        name: "fas",
        type: "string",
        defaultValue: "None"
    }, {
        name: "j5bin_id",
        type: "long",
        defaultValue: null
    }],

    associations: [
    {
        type: "belongsTo",
        model: "Teselagen.models.J5Bin",
        name: "j5Bin",
        getterName: "getJ5Bin",
        setterName: "setJ5Bin",
        associationKey: "j5Bin",
        foreignKey: "j5bin_id"
    }],

    constructor: function() {
        this.callParent(arguments);
    },
    
    active: false,
    
    setActive: function(value) {
    	this.active = value;
    },
    
    setPart: function(part) {

        // De-suscribe to existing events
        if(this.part) this.part.un( "idchanged", this.updateId, this );

        this.part = part;

        if(part && part.get("id")) {
            this.set("part_id", part.getId());
        } else {
            this.set("part_id", null);
            this.callStore("afterEdit", ["part_id"]);
        }


        // Suscribe to part changeid event
        if(this.part) this.part.on( "idchanged", this.updateId, this );

    },

    updateId: function( part, oldId, newId, eOpts ){
            this.set('part_id',newId);
    },

    getPart: function() {
        return this.part;
    }
});
