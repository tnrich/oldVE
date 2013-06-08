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
        autoScroll:true,
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
            cls: 'j5RunsMenu',
            floating: false,
            autoScroll: false,
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
                    xtype: 'form',
                    cls: 'j5RunInfo',
                    margin: '10 10 10 10',
                    border: 0,
                    items: [
                        {
                            xtype: 'displayfield',
                            height: 20,
                            name: 'j5AssemblyType',
                            cls: 'j5RunAssemblyType',
                            fieldLabel: '<b>Assembly Type</b>',
                            labelWidth: 100
                        },
                        {
                            xtype: 'displayfield',
                            height: 20,
                            name: 'j5RunStatus',
                            cls: 'j5RunStatusField',
                            fieldLabel: '<div class="status-note"></div><b>Run Status</b>',
                            labelWidth: 115
                        },
                        {
                            xtype: 'displayfield',
                            height: 20,
                            name: 'j5RunStart',
                            cls: 'j5RunStartField',
                            fieldLabel: '<b>Date Submitted</b>',
                            labelWidth: 100
                        },
                        {
                            xtype: 'displayfield',
                            height: 20,
                            name: 'j5RunEnd',
                            cls: 'j5RunEndField',
                            fieldLabel: '<b>Date Finished</b>',
                            labelWidth: 100
                        },
                        {
                            xtype: 'displayfield',
                            height: 20,
                            name: 'j5RunElapsed',
                            cls: 'j5RunElapsedField',
                            fieldLabel: '<b>Run Time</b>',
                            labelWidth: 100
                        }
                    ]
                },
                {
                    xtype: 'gridpanel',
                    name: 'warnings',
                    cls: 'warningsGrid',
                    hidden: true,
                    margin: '10 10 20 10',
                    title: 'Warnings',
                    minHeight: 100,
                    layout: 'fit',
                    hideHeaders: true,
                    columns: [
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'message',
                            autoHeight: true,
                            forceFit: true,
                            flex: 1,
                            renderer: function(val) {
                                val = val.substring(1, val.length - 1);
                                return '<div style="white-space:normal !important;">'+ val +'</div>';
                            }
                        }
                    ]
                },
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
                    collapsible: true,
                    collapseDirection: 'top',
                    collapsed: true,
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