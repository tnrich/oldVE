Ext.define("Teselagen.store.ProjectStore", {
    requires: ["Teselagen.models.Project"],
    extend: "Ext.data.Store",
    model: "Teselagen.models.Project",
    write: function(store, operations, eOpts){
    	console.log("Project saved by store");
    }
});