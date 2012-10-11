var data = {
  "designs": [
    {
        "text": "Design 1",
        "leaf": true
    },
    {
        "text": "Design 2",
        "leaf": true
    }
  ],
  "j5results": [
    {
        "text": "Result 1",
        "leaf": true
    },
    {
        "text": "Result 2",
        "leaf": true
    }
  ]
};

var substore1 = Ext.create('Ext.data.Store', {
    model: 'TestModel',
    proxy: {
        type: 'memory',
        reader: {
          type: 'json',
          root: 'jsonpath1'
        }
    }
});

Ext.define("Teselagen.store.ProjectTreeStore", {
    extend: 'Ext.data.TreeStore',
    autoLoad: false,
    proxy: {
        type: 'memory',
        data: data,
        reader: {
            type: 'json',
            root: 'designs'
        }
    },
    listeners: {
        beforeload: function(store, operation, options) {
            //return true;
            //store.getProxy().url = sessionData.baseURL + 'getTree';
            return sessionData.data? true : false;
            //store.getProxy().url = 'data/' + operation.node.get('path') + '/level1.json';
            //return true;
        },
        load: function( store, node, records, successful, eOpts ){
    
            console.log(store.proxy.reader.jsonData);

            if(successful)
            {
            
            console.log(substore1);
            //var cont = Ext.getCmp('projectAnalysisPanel');

            substore1.loadRawData(store.proxy.reader.jsonData);
            

            }

        }
    }
});

