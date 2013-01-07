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
        cls: 'j5ReportsPanel',
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
        title: 'Detail',
        cls: 'j5detailpanel',
        items: [{
                    xtype: 'fieldset',
                    margin: '10 10 10 10',
                    width: 700,
                    items: [
                        {
                            xtype: 'gridpanel',
                            margin: '10 10 20 10',
                            width: 650,
                            title: 'Output Plasmids',
                            columns: [
                                {
                                    xtype: 'gridcolumn',
                                    dataIndex: 'name',
                                    flex: 1,
                                    text: 'Name'
                                },
                                {
                                    xtype: 'gridcolumn',
                                    dataIndex: 'size',
                                    flex: 1,
                                    text: 'Size'
                                },
                                {
                                    xtype: 'gridcolumn',
                                    dataIndex: 'fileType',
                                    flex: 1,
                                    text: 'Type'
                                },
                                {
                                    xtype: 'gridcolumn',
                                    dataIndex: 'fileContent',
                                    flex: 2,
                                    text: 'Content'
                                }
                            ]
                        }
                    ]
                },
                {
                    xtype: 'fieldset',
                    margin: '10 10 10 10',
                    width: 700,
                    title: 'Combinatorial Mock Assembly Output',
                    items: [
                        {
                            xtype: 'textareafield',
                            margin: '10 10 20 10',
                            width: 650,
                            fieldLabel: ''
                        }
                    ]
                },
                {
                    xtype: 'button',
                    margin: 10,
                    text: 'Download Results',
                    cls: 'downloadResults'
                }]
    }],

    listeners: {}
}

);