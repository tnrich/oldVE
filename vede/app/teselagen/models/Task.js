Ext.define("Teselagen.models.Task", {
    extend: "Ext.data.Model",

    proxy: {
        type: 'memory'
    },

    fields: [
        {  name: "id",               type: "long"   } ,
        {  name: "devicedesign_id",  type: "long"   } ,
        {  name: "project_id",       type: "long"   } ,
        {  name: "id",               type: "long"   } ,
        {  name: "taskName",         type: "String" } ,
        {  name: "taskType",         type: "String" } ,
        {  name: "status",           type: "String" } ,
        {  name: "assemblyType",     type: "String" } ,
        {  name: "dateStarted",      type: "Date"   } ,
        {  name: "taskRefID",        type: "long"   } 
    ]
});
