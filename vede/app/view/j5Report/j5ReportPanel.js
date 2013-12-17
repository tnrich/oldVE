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
            hidden: false,
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
        hidden: true,
        autoScroll: true,
        border: 0,
        layout: {
            type: 'vbox',
            align: 'stretch'
        },
        dockedItems: [{
                    xtype: 'toolbar',
                    height: 100,
                    dock: 'top',
                    layout:'vbox',
                    margin: '5 0 0 0',
                    items: [
                    {
                        xtype: 'container',
                        height:50,
                        width: '100%',
                        flex: 1,
                        layout: 'fit',
                        items: [
                            {
                               xtype: 'button',
                                margin: '0 0 5 0',
                                layout:'fit',
                                text: 'Build',
                                cls: 'buildBtn',
                                overCls: 'buildBtn-over' 
                            }
                        ]
                    },{
                        xtype: 'container',
                        height:50,
                        flex: 1,
                        width: '100%',
                        layout: 'fit',
                        items: [
                            {
                                xtype: 'button',
                                margin: '0 0 5 0',
                                text: 'Download Results',
                                cls: 'downloadResults',
                                overCls: 'downloadResults-over'
                            }
                        ]
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
                    ],
                    viewConfig: {
                        enableTextSelection: true
                    },

                },
                {
                    xtype: 'gridpanel',
                    name: 'errors',
                    cls: 'errorsGrid',
                    hidden: true,
                    margin: '10 10 20 10',
                    title: 'Errors',
                    minHeight: 80,
                    layout: 'fit',
                    hideHeaders: true,
                    columns: [
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'faultString',
                            autoHeight: true,
                            forceFit: true,
                            flex: 1,
                            renderer: function(val) {
                                //val = val.substring(0, val.indexOf(" at")).substring(0, val.indexOf("."));
                                //return '<div style="white-space:normal !important;">'+ val +'.</div>';
                                return val;
                            }
                        }
                    ],
                    viewConfig: {
                        enableTextSelection: true
                    },

                    tools:[
                        {
                            type:'help',
                            tooltip: 'Get Help',
                            handler: function(event, toolEl, panel){
                                // show help here
                            }
                        }],
                },
                {
                    xtype: 'gridpanel',
                    name: 'assemblies',
                    margin: '10 10 20 10',
                    title: 'Output Assembled Constructs',
                    overflowY: 'auto',
                    layout: 'fit',
                    forceFit: true,
                    columns: [
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'name',
                            width: 120,
                            text: 'Name',
                            renderer: function (val, metadata) {
                                metadata.tdAttr = 'data-qtip = "Click to open"';
                                return val;
                            }
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'sizeBP',
                            width: 80,
                            text: 'Size (bp)'
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'fileType',
                            width: 120,
                            text: 'Type'
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'parts',
                            dirty: false,
                            flex: 2,
                            text: 'Parts Contained',
                            renderer: function(val) {
                                val = val.replace(/\(/g, "").replace(/\)_/g, ", ").replace(/\)/g, "").replace(/\,/g, ", ");
                                return '<div style="white-space:normal !important;">'+ val +'</div>';
                            }
                        }
                        // {
                        //     xtype: 'gridcolumn',
                        //     dataIndex: 'fileContent',
                        //     flex: 2,
                        //     text: 'Content',
                        //     renderer: function(val) {
                        //         var content_limited = val.slice(0, (val.lastIndexOf("bp") + 2));
                        //         return content_limited + "..."
                        //     }
                        // }
                    ],
                },
                {
                    xtype: 'gridpanel',
                    name: 'j5parameters',
                    margin: '10 10 20 10',
                    collapsible: true,
                    collapseDirection: 'top',
                    collapsed: false,
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
                }
                // ,{
                //     xtype: 'gridpanel',
                //     name: 'combinatorialAssembly',
                //     margin: '10 10 20 10',
                //     title: 'Parts',
                //     minHeight: 100,
                //     layout: 'fit',
                //     columns: [
                //         {
                //             xtype: 'gridcolumn',
                //             dataIndex: 'name',
                //             flex: 1,
                //             text: 'Name'
                //         }
                //     ]
                // },
                // {
                // xtype: 'fieldset',
                // margin: '10 10 10 10',
                // layout: 'fit',
                // title: 'Combinatorial Mock Assembly Output',
                // hidden: true,
                // items: [
                //     {
                //         xtype: 'textareafield',
                //         name: 'combinatorialAssembly',
                //         margin: '10 10 20 10',
                //         fieldLabel: ''
                //     }
                //     ]
                // }
                ]
            }],

    listeners: {}
}

);
