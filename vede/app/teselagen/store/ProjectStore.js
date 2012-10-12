Ext.define("Teselagen.store.ProjectStore", {
    requires: ["Teselagen.models.Project"],
    extend: 'Ext.data.Store',
    autoLoad: false,
    model: 'Teselagen.models.Project',
    listeners: {
        beforeload: function (store, operation, options) {
            return true;
            //store.getProxy().url = 'data/' + operation.node.get('Path') + '/level1.json';
        },
        load: function (records, successful, eOpts) {
            console.log('Project Store loaded');
            Ext.getCmp('projectsWidget').reconfigure(records);
        }
    }

});