Ext.define('Vede.view.j5.AnalysisPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.AnalysisPanel',
    layout: {
        type: 'fit'
    },
    // id: 'AnalysisPanel',
    title: 'Analysis',
    items: [
        {
            xtype: 'panel',
            border: 0,
            layout: {
                type: 'fit'
            },
            title: 'Project Info',
            items: [
                {
                    xtype: 'tabpanel',
                    border: 0,
                    // id: 'AnalysisTabPanel',
                    activeTab: 0,
                    items: [
                        {
                            xtype: 'panel',
                            border: 0,
                            layout: {
                                align: 'stretch',
                                type: 'vbox'
                            },
                            title: 'Info',
                            items: [
                                {
                                    xtype: 'panel',
                                    flex: 1,
                                    border: 0,
                                    // id: 'j5_info',
                                    layout: {
                                        align: 'stretch',
                                        type: 'hbox'
                                    },
                                    items: [
                                        {
                                            xtype: 'panel',
                                            flex: 1,
                                            border: 0,
                                            // id: 'j5-status-Panel',
                                            layout: {
                                                align: 'stretch',
                                                type: 'vbox'
                                            },
                                            items: [
                                                {
                                                    xtype: 'fieldcontainer',
                                                    flex: 1,
                                                    margins: '10',
                                                    height: 150,
                                                    // id: 'j5-status-Fields',
                                                    minHeight: 150,
                                                    width: 389,
                                                    layout: {
                                                        align: 'stretch',
                                                        padding: 10,
                                                        type: 'vbox'
                                                    },
                                                    fieldLabel: '',
                                                    hideLabel: true,
                                                    items: [
                                                        {
                                                            xtype: 'displayfield',
                                                            value: 'Display Field',
                                                            fieldLabel: 'Status'
                                                        },
                                                        {
                                                            xtype: 'displayfield',
                                                            value: 'Display Field',
                                                            fieldLabel: 'Run Date'
                                                        },
                                                        {
                                                            xtype: 'displayfield',
                                                            value: 'Display Field',
                                                            fieldLabel: 'Run Time'
                                                        },
                                                        {
                                                            xtype: 'displayfield',
                                                            value: 'Display Field',
                                                            fieldLabel: 'Assembly Type'
                                                        },
                                                        {
                                                            xtype: 'displayfield',
                                                            value: 'Display Field',
                                                            fieldLabel: 'j5 Ready'
                                                        },
                                                        {
                                                            xtype: 'displayfield',
                                                            value: 'Display Field',
                                                            fieldLabel: 'Combinatorial'
                                                        }
                                                    ]
                                                },
                                                {
                                                    xtype: 'panel',
                                                    flex: 2,
                                                    border: 0,
                                                    margin: 10,
                                                    layout: {
                                                        align: 'stretch',
                                                        padding: 5,
                                                        type: 'vbox'
                                                    },
                                                    items: [
                                                        {
                                                            xtype: 'button',
                                                            margins: '5',
                                                            icon: 'resources/images/ux/edit_button.png',
                                                            scale: 'medium',
                                                            text: 'Edit in Device Editor'
                                                        },
                                                        {
                                                            xtype: 'button',
                                                            margins: '5',
                                                            maxHeight: 30,
                                                            minHeight: 30,
                                                            maintainFlex: false,
                                                            autoWidth: true,
                                                            icon: 'resources/images/ux/view_button.png',
                                                            scale: 'medium',
                                                            text: 'View j5 Parameters'
                                                        },
                                                        {
                                                            xtype: 'splitbutton',
                                                            flex: 3,
                                                            margins: '5',
                                                            maxHeight: 30,
                                                            autoWidth: true,
                                                            icon: 'resources/images/ux/submit_button.png',
                                                            scale: 'large',
                                                            text: 'Submit j5 Run',
                                                            menu: {
                                                                xtype: 'menu',
                                                                items: [
                                                                    {
                                                                        xtype: 'menuitem',
                                                                        text: 'j5 Inputs'
                                                                    }
                                                                ]
                                                            }
                                                        },
                                                        {
                                                            xtype: 'button',
                                                            flex: 4,
                                                            margins: '5',
                                                            maxHeight: 30,
                                                            minHeight: 30,
                                                            maintainFlex: false,
                                                            autoWidth: false,
                                                            icon: 'resources/images/ux/downstream_button.png',
                                                            scale: 'medium',
                                                            text: 'Downstream Automation'
                                                        }
                                                    ]
                                                }
                                            ]
                                        },
                                        {
                                            xtype: 'panel',
                                            flex: 1,
                                            margin: 30,
                                            layout: {
                                                align: 'stretch',
                                                type: 'vbox'
                                            },
                                            title: 'Download Results',
                                            items: [
                                                {
                                                    xtype: 'panel',
                                                    flex: 1,
                                                    border: 0,
                                                    margin: 15,
                                                    maxHeight: 50,
                                                    layout: {
                                                        align: 'stretch',
                                                        type: 'vbox'
                                                    },
                                                    items: [
                                                        {
                                                            xtype: 'button',
                                                            flex: 1,
                                                            margins: '5',
                                                            margin: '',
                                                            icon: 'resources/images/ux/download_button.png',
                                                            scale: 'large',
                                                            text: 'Download All'
                                                        }
                                                    ]
                                                },
                                                {
                                                    xtype: 'panel',
                                                    flex: 1,
                                                    border: 0,
                                                    margin: 15,
                                                    maintainFlex: false,
                                                    layout: {
                                                        align: 'stretch',
                                                        type: 'hbox'
                                                    },
                                                    items: [
                                                        {
                                                            xtype: 'panel',
                                                            flex: 1,
                                                            border: 0,
                                                            layout: {
                                                                align: 'stretch',
                                                                type: 'vbox'
                                                            },
                                                            items: [
                                                                {
                                                                    xtype: 'button',
                                                                    margins: '5',
                                                                    icon: 'resources/images/ux/download_button2.png',
                                                                    scale: 'medium',
                                                                    text: 'Sequence File'
                                                                },
                                                                {
                                                                    xtype: 'button',
                                                                    margins: '5',
                                                                    icon: 'resources/images/ux/download_button2.png',
                                                                    scale: 'medium',
                                                                    text: 'Parts File'
                                                                }
                                                            ]
                                                        },
                                                        {
                                                            xtype: 'panel',
                                                            flex: 1,
                                                            border: 0,
                                                            minWidth: 100,
                                                            layout: {
                                                                align: 'stretch',
                                                                type: 'vbox'
                                                            },
                                                            items: [
                                                                {
                                                                    xtype: 'button',
                                                                    margins: '5',
                                                                    icon: 'resources/images/ux/download_button2.png',
                                                                    scale: 'medium',
                                                                    text: 'Target Parts File'
                                                                },
                                                                {
                                                                    xtype: 'button',
                                                                    margins: '5',
                                                                    icon: 'resources/images/ux/download_button2.png',
                                                                    scale: 'medium',
                                                                    text: 'Eugene Rules File'
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                },
                                                {
                                                    xtype: 'panel',
                                                    flex: 1,
                                                    border: 0,
                                                    margin: 15,
                                                    maintainFlex: false,
                                                    layout: {
                                                        align: 'stretch',
                                                        type: 'hbox'
                                                    },
                                                    items: [
                                                        {
                                                            xtype: 'panel',
                                                            flex: 1,
                                                            border: 0,
                                                            layout: {
                                                                align: 'stretch',
                                                                type: 'vbox'
                                                            },
                                                            items: [
                                                                {
                                                                    xtype: 'button',
                                                                    margins: '5',
                                                                    icon: 'resources/images/ux/download_button2.png',
                                                                    scale: 'medium',
                                                                    text: 'j5 Parameters'
                                                                }
                                                            ]
                                                        },
                                                        {
                                                            xtype: 'panel',
                                                            flex: 1,
                                                            border: 0,
                                                            minWidth: 100,
                                                            layout: {
                                                                align: 'stretch',
                                                                type: 'vbox'
                                                            },
                                                            items: [
                                                                {
                                                                    xtype: 'button',
                                                                    margins: '5',
                                                                    icon: 'resources/images/ux/download_button2.png',
                                                                    scale: 'medium',
                                                                    text: 'Downstream Parameters'
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    xtype: 'form',
                                    flex: 1,
                                    border: 0,
                                    maxHeight: 250,
                                    bodyPadding: 10,
                                    title: 'Warnings'
                                }
                            ]
                        },
                        {
                            xtype: 'panel',
                            border: 0,
                            title: 'Design Overview'
                        },
                        {
                            xtype: 'panel',
                            border: 0,
                            title: 'Sequences'
                        }
                    ]
                },
                {
                    xtype: 'gridpanel',
                    hidden: true,
                    title: 'My Grid Panel',
                    columns: [
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'string',
                            text: 'String'
                        },
                        {
                            xtype: 'numbercolumn',
                            dataIndex: 'number',
                            text: 'Number'
                        },
                        {
                            xtype: 'datecolumn',
                            dataIndex: 'date',
                            text: 'Date'
                        },
                        {
                            xtype: 'booleancolumn',
                            dataIndex: 'bool',
                            text: 'Boolean'
                        }
                    ],
                    viewConfig: {

                    }
                },
                {
                    xtype: 'form',
                    layout: {
                        type: 'fit'
                    },
                    bodyPadding: 10,
                    title: 'j5 Run Info'
                }
            ]
        }
    ]

   });