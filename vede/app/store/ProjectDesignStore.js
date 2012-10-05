Ext.define("Vede.store.ProjectDesignStore", {
  	extend: 'Ext.data.TreeStore',
	id: 'ProjectDesignStore',
  	autoLoad: false,
    proxy: {
        type: 'ajax',
        url: 'getTree',
        extraParams: {
            mode: 'getTree'
        },
        actionMethods: 
        {
            read: 'POST'
        }
    },
    root: {
        expanded: true,
        visible: false,
    },
    listeners: {
        'beforeload': function(store, operation, options) {
            store.getProxy().url = sessionData.baseURL + 'getTree';
            return sessionData.data? true : false;
        }
    }
});
