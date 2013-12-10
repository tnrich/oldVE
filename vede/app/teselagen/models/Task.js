Ext.define("Teselagen.models.Task", {
    extend: "Ext.data.Model",

    proxy: {
        type: 'memory'
    },

    fields: [
        {  name: "id",               type: "long"   } ,
        {  name: "devicedesign_id",  type: "long",
            convert: function(v, record) {
                console.log(record);
                var id = record.run.devicedesign_id;
                return id;
            }
        },
        {  name: "project_id",       type: "long",
            convert: function(v, record) {
                var id = record.run.project_id;
                return id;
            }
        },
        {  name: "id",               type: "long"   } ,
        {  name: "taskName",         type: "String" } ,
        {  name: "taskType",         type: "String" } ,
        {  name: "status",           type: "String" } ,
        {  name: "assemblyType",     type: "String" } ,
        {  name: "dateStarted",      type: "Date"   } ,
        {  name: "taskRefID",        type: "long"   } 
    ]

});
