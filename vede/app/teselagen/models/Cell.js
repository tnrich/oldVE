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
        //this.on("add", this.renderIfActive, this);
        //this.on("update", this.renderIfActive, this);
        //this.on("remove", this.renderIfActive, this);
    },
    
    //renderIfActive: function() {
    	//if(this.active) Teselagen.manager.GridManager.renderGrid(Ext.getCmp("mainAppPanel").getActiveTab().model);
    //},
    
    active: false,
    
    setActive: function(value) {
    	this.active = value;
    },
    
    setPart: function(part) {
        this.part = part;

        if(part && part.get("id")) {
            this.set("part_id", part.getId());
        } else {
            this.set("part_id", null);
            this.callStore("afterEdit", ["part_id"]);
        }
    },

    getPart: function() {
        return this.part;
    }
});
