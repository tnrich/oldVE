function loadResults(record)
{

    var store = Ext.create('Ext.data.TreeStore', {
    autoLoad: true,
    proxy: {
        type: 'ajax',
        url: '/api/openResult',
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
};

var store = Ext.create('Ext.data.TreeStore', {
    autoLoad: false,
    proxy: {
        type: 'ajax',
        url: '/api/getTree',
        extraParams: {
            mode: 'getTree'
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
    },
    require: ["Teselagen.event.AuthenticationEvent", "Teselagen.manager.AuthenticationManager"],
    listeners: {
        'beforeload': function(store, options) {
            if(sessionData.data) store.proxy.extraParams.sessionId = sessionData.data.sessionId;
            else Ext.Ajax.abort(store.proxy.activeRequest.load);
        }
    }
});

Ext.define('Vede.view.common.ProjectPanelView', {
	extend: 'Ext.tab.Panel',
	alias: 'widget.ProjectPanelView',


				
                    region: 'west',
                    split: true,
                    id: 'projectPanel',
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
                    items: [
                        {
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
                            items: [
                                {
                                    xtype: 'treepanel',
                                    id: 'projectDesignPanel',
                                    title: 'Your Designs',
                                    viewConfig: {

                                    }
                                }
                            ]
                        },
                        {
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
                            items: [
                                {
                                    xtype: 'treepanel',
                                    id: 'projectAnalysisPanel',
                                    title: 'j5 Results',
                                    viewConfig: {

                                    }
                                }
                            ]
                        },
                        {
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
                            items: [
                                {
                                    xtype: 'treepanel',
                                    id: 'projectPartsPanel',
                                    title: 'Your Parts',
                                    viewConfig: {

                                    }
                                }
                            ]
                        },
                        {
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
                            items: [
                                {
                                    xtype: 'treepanel',
                                    id: 'projectsRegistryPanel',
                                    title: 'Registry',
                                    viewConfig: {

                                    }
                                }
                            ]
                        }
                    ]
                });
/*
	floatable: false,
	region: 'west',
	draggable: false,
	floating: false,
	frame: false,
	id: 'ProjectPanel',
	width: 250,
	resizeHandles: 'e',
	closable: false,
	collapseDirection: 'left',
	collapsed: false,
	collapsible: true,
	title: 'Project',
	titleCollapse: true,
	viewConfig: {
		draggable: false
	},
    store: store,
    rootVisible: false,
    listeners: {
        itemclick: function(view, record,item,index,e,eOpts)
        {
            if(record.raw.type == 'design') $(document).trigger('openSelectedDesign', record.raw._id);

            if(record.raw.type == 'protocol')
            {
                console.log('opening protocol');
                Ext.Ajax.request({
                    url: '/api/getProtocol',
                    params: {
                        _id: record.raw._id
                    },
                    success: function(response){
                        var text = jQuery.parseJSON(response.responseText);
                        loadResults(text);
                    }
                });   
            }

            if(record.raw.type == 'example')
            {
                console.log("Trying to open example #"+record.raw._id);
                $(document).trigger('openExampleDesign', record.raw._id);
            }

        }
    }
});
*/
