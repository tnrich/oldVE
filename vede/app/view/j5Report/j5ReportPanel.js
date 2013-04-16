/**
 * j5 report panel
 * @class Vede.view.j5Report.j5ReportPanel
 */
Ext.define('Vede.view.j5Report.j5ReportPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.j5ReportPanel',
    requires: [],
    cls: 'j5ReportTab',
    /*
    layout: {
        type: 'fit'
    },
    */
    frameHeader: false,
    closable: true,
    title: 'j5Report',
    layout: 'fit',
    dockedItems: [{
        xtype: 'panel',
        dock: 'left',
        floating: false,
        frame: true,
        cls: 'j5ReportsPanel',
        margin: '0 0 0 0',
        width: 350,
        bodyBorder: false,
        animCollapse: false,
        collapseDirection: 'left',
        collapsed: false,
        collapsible: true,
        frameHeader: false,
        hideCollapseTool: false,
        overlapHeader: false,
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
            width: 291,
            items: []
        }]
    }],
    items: [
        {
            xtype: 'panel',
            title: 'Detail',
            cls: 'j5detailpanel-fill',
            hidden: true,
            border: 0,
            items: [{
                xtype: 'container',
                cls: 'j5detailpanel-fillcontent',
                height: 40,
                padding: 12,
                margin: '20 10 10 10',
                html: 'Click on a J5 Run to View Results.'
            }]
        },
        {
        xtype: 'panel',
        title: 'Detail',
        cls: 'j5detailpanel',
        hidden: false,
        autoScroll: true,
        border: 0,
        dockedItems: [{
                    xtype: 'toolbar',
                    layout: 'fit',
                    height: 50,
                    dock: 'top',
                    items: [{
                        xtype: 'button',
                        margin: 10,
                        text: 'Download Results',
                        cls: 'downloadResults',
                        overCls: 'downloadResults-over'
                    }]
                }],
        items: [
                {
                    xtype: 'gridpanel',
                    name: 'assemblies',
                    margin: '10 10 20 10',
                    title: 'Output Plasmids',
                    minHeight: 100,
                    layout: 'fit',
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
                },
                {
                    xtype: 'gridpanel',
                    name: 'j5parameters',
                    margin: '10 10 20 10',
                    title: 'j5 Parameters',
                    minHeight: 100,
                    layout: 'fit',
                    columns: [
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'name',
                            flex: 1,
                            text: 'Name'
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'value',
                            flex: 1,
                            text: 'Value'
                        }
                    ]
                },
                {
                xtype: 'fieldset',
                margin: '10 10 10 10',
                layout: 'fit',
                title: 'Combinatorial Mock Assembly Output',
                items: [
                    {
                        xtype: 'textareafield',
                        name: 'combinatorialAssembly',
                        margin: '10 10 20 10',
                        fieldLabel: ''
                    }
                    ]
                }]
            }],

    listeners: {}
}

);