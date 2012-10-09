var data =
{
    "success": true,
    "data": [
        {
            "ProjectName": "Model 1",
            "parts" : [
                {
                    name: 'Part A'
                }
            ]
        },
        {
            "ProjectName": "Model 2"
        }
    ]
};

Ext.define("Teselagen.store.ProjectStore", {
    extend: 'Ext.data.Store',
    autoLoad: false,
    model: 'Teselagen.models.Project',
    proxy: {
        type: 'memory',
        data: data,
        url: 'getTree.json',
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    listeners: {
        beforeload: function(store, operation, options) {
            //store.getProxy().url = 'data/' + operation.node.get('Path') + '/level1.json';
            return true;
        }
    }
});

