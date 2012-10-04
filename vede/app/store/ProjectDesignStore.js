Ext.define("Vede.store.ProjectDesignStore", {
  	extend: 'Ext.data.TreeStore',
	id: 'ProjectDesignStore',
  	autoLoad: false,
    proxy: {
        type: 'ajax',
        url: sessionData.baseURL + 'api/getTree',
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
        'beforeload': function(store, options) {
            return sessionData.data? true : false;
        }
    }
});
