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
            itemclick: function (view, record, item, index, e, eOpts) {
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


Ext.define('Vede.view.common.ProjectPanelView', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.ProjectPanelView',
    region: 'west',
    id: 'ProjectPanel',
    maxWidth: 230,
    minWidth: 228,
    width: 228,
    collapseDirection: 'left',
    collapsible: true,
    frameHeader: false,
    hideCollapseTool: false,
    preventHeader: false,
    title: 'Project',
    plain: false,
    margin: '0 10 0 0',
    removePanelHeader: false,
    items: [{
        xtype: 'panel',
        overCls: 'project-tab-focus',
        border: 0,
        id: 'projectDesignTab',
        layout: {
            type: 'fit'
        },
        minButtonWidth: 32,
        items: [{
            xtype: 'treepanel',
            border: 0,
            id: 'projectDesignPanel',
            rootVisible: false
        }]
    }]
});