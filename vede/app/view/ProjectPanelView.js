function loadResults(record)
{

    var store = Ext.create('Ext.data.TreeStore', {
    autoLoad: true,
    proxy: {
        type: 'ajax',
        url: 'http://api.teselagen.com/openResult',
        extraParams: {
            fileId: record.fileId
        },
        actionMethods: 
        {
            read: 'POST'
        }
    },
    root: {
        text: 'Tree',
        expanded: true,
        id: 'src'
    }
    });

    var plasmidsViewer = Ext.define('Vede.view.PlasmidsViewer', {
        extend: 'Ext.tree.Panel',
        alias: 'widget.PlasmidsViewer',
        id: 'ProjectPanel',
        width: 150,
        title: 'Project',
        flex: 1,
        region: 'west',
        store: store,
        rootVisible: false,
        renderTo: Ext.getBody(),
        viewConfig: {},
        listeners: {
            itemclick: function(view, record,item,index,e,eOpts)
            {
                Ext.getCmp('rawpanel').update(record.raw.data);
            }
        }
    });

    console.log(record);

    var win = Ext.create('widget.window', {
                title: 'j5 Results',
                closable: true,
                closeAction: 'hide',
                width: 600,
                minWidth: 350,
                height: 350,
                layout: 'border',
                bodyStyle: 'padding: 5px;',
                items: [{
                    xtype: 'PlasmidsViewer',
                    region: 'west',
                    title: 'Plasmids',
                    width: 200,
                    split: true,
                    collapsible: true,
                    floatable: false
                }, {
                    region: 'center',
                    xtype: 'tabpanel',
                    items: [
                    {
                        title: 'Raw Data',
                        id: 'rawpanel',
                        html: ''
                    },
                    {
                        title: 'Configuration',
                        html: ''
                    },
                    {
                        title: 'Files',
                        html: 'Hello world 2'
                    }]
                }]
            });
            
            win.show();
}


var store = Ext.create('Ext.data.TreeStore', {
    autoLoad: true,
    proxy: {
        type: 'ajax',
        url: 'http://api.teselagen.com/getTree'
    },
    root: {
        text: 'Tree',
        expanded: true,
        id: 'src'
    }
});

Ext.define('Vede.view.ProjectPanelView', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.ProjectPanel',
    id: 'ProjectPanel',
    width: 150,
    title: 'Project',
    flex: 1,
    region: 'west',
    store: store,
    rootVisible: false,
    renderTo: Ext.getBody(),
    viewConfig: {
    },
    listeners: {
        itemclick: function(view, record,item,index,e,eOpts)
        {
            console.log(record.raw);

            if(record.raw.type == 'design') $(document).trigger('openSelectedDesign', record.raw._id);

            if(record.raw.type == 'protocol')
            {
                console.log('opening protocol');
                Ext.Ajax.request({
                    url: 'http://api.teselagen.com/getProtocol',
                    params: {
                        _id: record.raw._id
                    },
                    success: function(response){
                        var text = jQuery.parseJSON(response.responseText);
                        loadResults(text);
                    }
                });   
            }

        }
    }
});
                    