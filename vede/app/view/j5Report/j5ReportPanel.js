Ext.define('Vede.view.j5Report.j5ReportPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.j5ReportPanel',
    requires: [],
    cls: 'j5ReportTab',
    layout: {
        type: 'fit'
    },
    frameHeader: false,
    closable: true,
    title: 'j5Report',
    dockedItems: [{
        xtype: 'panel',
        dock: 'left',
        floating: false,
        frame: true,
        cls: 'InspectorPanel',
        margin: '0 0 0 0',
        width: 300,
        bodyBorder: false,
        animCollapse: false,
        collapseDirection: 'left',
        collapsed: false,
        collapsible: true,
        frameHeader: false,
        hideCollapseTool: false,
        overlapHeader: false,
        title: 'Inspector',
        titleCollapse: false,
        plain: false,
        removePanelHeader: false,
        layout: {
            deferredRender: false,
            type: 'card'
        },
        title: 'j5Runs',
        items: [{
            xtype: 'menu',
            floating: false,
            height: 453,
            width: 241,
            items: [{
                xtype: 'menuitem',
                text: 'Menu Item'
            }, {
                xtype: 'menuitem',
                text: 'Menu Item'
            }, {
                xtype: 'menuitem',
                text: 'Menu Item'
            }]
        }]
    }],
    items: [{
        xtype: 'panel',
        layout: {
            type: 'column'
        },
        title: 'Detail',
        items: [{
            xtype: 'gridpanel',
            width: 538,
            title: 'My Grid Panel',
            columns: [{
                xtype: 'gridcolumn',
                dataIndex: 'name',
                text: 'Name'
            }, {
                xtype: 'gridcolumn',
                dataIndex: 'size',
                text: 'Size'
            }, {
                xtype: 'gridcolumn',
                dataIndex: 'fileType',
                text: 'Type'
            }, {
                xtype: 'gridcolumn',
                dataIndex: 'fileContent',
                text: 'Content'
            }],
            viewConfig: {

            }
        }]
    }],

    listeners: {}
}

);