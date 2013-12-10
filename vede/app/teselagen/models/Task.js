Ext.define("Teselagen.models.Task", {
    extend: "Ext.data.Model",

    proxy: {
        type: 'memory'
    },

    fields: [
        {  name: "id",               type: "long"   } ,
        {  name: "taskName",         type: "String" } ,
        {  name: "taskType",         type: "String" } ,
        {  name: "status",           type: "String" } ,
        {  name: "assemblyType",     type: "String" } ,
        {  name: "dateStarted",      type: "Date"   } ,
        {  name: "taskRefID",        type: "long"   } 
    ],

    associations: [
        {
            type: "hasOne",
            model: "Teselagen.models.J5Run",
            getterName: "getJ5IRun",
            setterName: "setJ5Run",
            associationKey: "j5Run"
        },

});
