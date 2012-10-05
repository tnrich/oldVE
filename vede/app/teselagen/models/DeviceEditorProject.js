Ext.define("Teselagen.models.DeviceEditorProject", {
    extend: "Ext.data.Model",

    requires: [
        "Teselagen.models.J5Collection"
    ],

    fields: [
        { name: "ProjectName", type: "String", defaultValue: ""},
        { name: "DateCreated", type: "date"},
        { name: "DateModified", type: "date"}
    ],


    init: function() {
    },
    setCollection: function(pJ5Collection, pIndex) {
        
        var added = false;

        
    },

});