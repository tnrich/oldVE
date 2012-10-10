var data = {
  "children": [
    {
        "ProjectName": "Model 1"
    },
    {
        "ProjectName": "Model 2"
    }
  ]
};


Ext.define("Teselagen.store.ProjectTreeStore", {
    extend: 'Ext.data.TreeStore',
    autoLoad: false,
    model: 'Teselagen.models.Project',
    proxy: {
        type: 'memory',
        root: 'children',
        data: data,
        reader: {
            type: 'json',
            root: 'children'
        }
    },
    listeners: {
        beforeload: function(store, operation, options) {
            //return true;
            //store.getProxy().url = sessionData.baseURL + 'getTree';
            //return sessionData.data? true : false;
            //store.getProxy().url = 'data/' + operation.node.get('path') + '/level1.json';
            return true;
        },
        append: function( thisNode, newChildNode, index, eOpts ) {

            //console.log(newChildNode);

            if( !newChildNode.isRoot() ) {
                newChildNode.set('leaf', true);
                newChildNode.set('text', newChildNode.raw["ProjectName"]);
            }
        }
    }
});

