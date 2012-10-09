var data = {
  "children": [
    {
        "_id": "50648d2be43620fadd000003",
        "text": "Model 1",
        "leaf": true,
        "type": "example"
    },
    {
        "_id": "50648d2be43620fadd000003",
        "text": "Model 2",
        "leaf": true,
        "type": "example"
    }
  ]
};


Ext.define("Teselagen.store.ProjectDesignStore", {
    extend: 'Ext.data.TreeStore',
    id: 'ProjectDesignStore',
    autoLoad: false,
    proxy: {
        type: 'memory',
        root: 'children',
        data: data
    },
    root: {
        expanded: true,
        visible: false,
    },
    listeners: {
        beforeload: function(store, operation, options) {
            store.getProxy().url = sessionData.baseURL + 'getTree';
            return sessionData.data? true : false;
        },
        append: function( thisNode, newChildNode, index, eOpts ) {

            console.log(newChildNode);

            if( !newChildNode.isRoot() ) {
                newChildNode.set('leaf', true);
                newChildNode.set('text', newChildNode.get('text'));
                //newChildNode.set('text', newChildNode.get('type'));
            }
        }
    }
});
