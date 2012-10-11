function loadResults(record) {

    var store = Ext.create('Ext.data.TreeStore', {
        autoLoad: true,
        proxy: {
            type: 'ajax',
            url: '/api/openResult',
            extraParams: {
                fileId: record.fileId
            },
            actionMethods: {
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
            itemclick: function(view, record, item, index, e, eOpts) {
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
            items: [{
                title: 'Raw Data',
                id: 'rawpanel',
                html: ''
            }, {
                title: 'Configuration',
                html: ''
            }, {
                title: 'Files',
                html: 'Hello world 2'
            }]
        }]
    });

    win.show();
};

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

var store = 
Ext.create("Teselagen.store.ProjectTreeStore", {
    extend: 'Ext.data.TreeStore',
    autoLoad: false,
    proxy: {
        type: 'memory',
        data: data,
        reader: {
            type: 'json',
            root: 'designs'
        }
    }
    });

Ext.define('Vede.view.common.ProjectPanelView', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.ProjectPanelView',
    region: 'west',
    split: true,
    id: 'ProjectPanel',
    cls: 'tabbar',
    maxWidth: 230,
    minWidth: 228,
    width: 228,
    collapseDirection: 'left',
    collapsible: true,
    frameHeader: false,
    hideCollapseTool: false,
    preventHeader: false,
    title: 'Project',
    activeTab: 0,
    plain: false,
    removePanelHeader: false,
    items: [{
        xtype: 'panel',
        id: 'projectDesignTab',
        layout: {
            type: 'fit'
        },
        minButtonWidth: 32,
        tabConfig: {
            xtype: 'tab',
            id: 'projectTab1',
            autoWidth: true,
            icon: 'resources/images/ux/designTab.png',
            iconCls: 'projectBarButton'
        },
        items: [{
            xtype: 'treepanel',
            id: 'projectDesignPanel',
            title: 'Your Designs',
            rootVisible: false,
            listeners: {
                itemclick: function(view, record, item, index, e, eOpts) {
                   //console.log(JSON.stringify(record.raw));
                },
                render: function(){
                    
                }
            }
        }]
    }, {
        xtype: 'panel',
        id: 'projectAnalysisTab',
        layout: {
            type: 'fit'
        },
        tabConfig: {
            xtype: 'tab',
            id: 'projectTab2',
            icon: 'resources/images/ux/graphTab.png',
            iconCls: 'projectBarButton'
        },
        items: [{
            xtype: 'treepanel',
            id: 'projectAnalysisPanel',
            title: 'j5 Results',
            viewConfig: {

            }
        }]
    }, {
        xtype: 'panel',
        id: 'projectPartsTab',
        layout: {
            type: 'fit'
        },
        tabConfig: {
            xtype: 'tab',
            id: 'projectTab3',
            icon: 'resources/images/ux/partsTab.png',
            iconCls: 'projectBarButton'
        },
        items: [{
            xtype: 'treepanel',
            id: 'projectPartsPanel',
            title: 'Your Parts',
            viewConfig: {

            }
        }]
    }, {
        xtype: 'panel',
        id: 'projectRegistryTab',
        layout: {
            type: 'fit'
        },
        tabConfig: {
            xtype: 'tab',
            id: 'projectTab4',
            autoWidth: false,
            icon: 'resources/images/ux/registryTab.png',
            iconCls: 'projectBarButton'
        },
        items: [{
            xtype: 'treepanel',
            id: 'projectsRegistryPanel',
            title: 'Registry',
            viewConfig: {

            }
        }]
    }]
});