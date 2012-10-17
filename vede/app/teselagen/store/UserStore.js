Ext.define("Teselagen.store.UserStore", {
    requires: ["Teselagen.models.User"],
    extend: 'Ext.data.Store',
    autoLoad: false,
    model: 'Teselagen.models.User',
    listeners: {
        beforeload: function (store, operation, options) {
            //store.getProxy().url = 'data/' + operation.node.get('Path') + '/level1.json';
        }
    }

});