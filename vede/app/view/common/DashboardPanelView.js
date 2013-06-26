/**
 * Dashboard panel view
 * @class Vede.view.common.DashboardPanelView
 */
Ext.define('Vede.view.common.DashboardPanelView', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.DashboardPanelView',
    id: 'DashboardPanel',
    layout: {
        type: 'fit'
    },
    frameHeader: false,
    border: 0,
    title: 'Dashboard',
    items: [
            {
            xtype: 'panel',
            border: 0,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [
                    {
                        xtype: 'container',
                        flex: 0.1,
                        id: 'welcome_splash',
                        border: 0,
                    },
                    {
                        xtype: 'container',
                        id: 'dashboardButtons',
                        margin: '0 100 0 100',
                        flex: 0.2,
                        border: 0,
                        style: {
                            borderColor: '#E0E3E6',
                            borderStyle: 'solid'
                        },
                        layout: {
                            type: 'hbox'
                        },
                        items: [
                            {
                                xtype: 'button',
                                height: 100,
                                cls: 'dashBtn',
                                flex: 1,
                                id: 'projectStartBtn',
                                text: 'New Project',
                                scale: 'medium',
                                overCls: 'projectStartBtn-over',
                                iconAlign: 'top',
                                listeners: {
                                    click: function () {
                                        Teselagen.manager.ProjectManager.createNewProject();
                                    }
                                }

                            },{
                                xtype: 'button',
                                cls: 'dashBtn',
                                height: 100,
                                flex: 1,
                                id: 'createSequence',
                                text: 'Create Sequence',
                                scale: 'medium',
                                overCls: 'createSequence-over',
                                iconAlign: 'top',
                                listeners: {
                                    click: function () {
                                        Vede.application.fireEvent("TabOpen");
                                    }
                                }

                            },
                            {
                                xtype: 'button',
                                cls: 'dashBtn',
                                height: 100,
                                id: 'readManualsBtn',
                                scale: 'medium',
                                flex: 1,
                                overCls: 'readManualsBtn-over',
                                iconAlign: 'top',
                                text: 'Manuals',
                                href: 'http://help.teselagen.com/manual/'
                            },
                            {
                                xtype: 'button',
                                cls: 'dashBtn',
                                height: 100,
                                id: 'tourBtn',
                                scale: 'medium',
                                flex: 1,
                                overCls: 'tourBtn-over',
                                iconAlign: 'top',
                                text: 'Take a Tour',
                                href: 'http://help.teselagen.com/manual/'
                            }
                        ]
                    }, 
                    {
                        xtype: 'container',
                        id: 'dashboardStats',
                        margin: '10 100 50 100',
                        flex: 1,
                        border: 0,
                        style: {
                            borderColor: '#E0E3E6',
                            borderStyle: 'solid',
                        },
                        layout: {
                            type: 'hbox',
                            align: 'stretch'
                        },
                        items: [ 
                            {
                                xtype: 'container',
                                cls: 'dashboardStats-container',
                                margin: '0 0 0 0',
                                border: 0,
                                style: {
                                    borderColor: '#E0E3E6',
                                    borderStyle: 'solid'
                                },
                                flex: 0.5,
                                maxHeight: 320,
                                layout: {
                                    type: 'vbox',
                                    align: 'stretch'
                                },
                                items: [
                                    {
                                        xtype: 'container',
                                        cls: 'dashProjectsData',
                                        margin: '10 10 10 10',
                                        border: 1,
                                        width: 430,
                                        flex: 0.5,
                                        style: {
                                            borderColor: 'rgb(0, 116, 194)',
                                            borderStyle: 'solid'
                                        },
                                        id: 'projectsCountBox',
                                        layout: {
                                            type: 'hbox',
                                            align: 'stretch'
                                        },
                                        items: [
                                            {
                                                xtype: 'container',
                                                cls: 'projectsCountBox-icon',
                                                border: 1,
                                                flex: .6,
                                                style: {
                                                    borderColor: 'rgb(0, 116, 194)',
                                                    borderStyle: 'solid'
                                                }
                                            },
                                            {
                                                xtype: 'container',
                                                cls: 'projectsCountBox-data',
                                                border: 1,
                                                flex: 1,
                                                style: {
                                                    borderColor: 'rgb(0, 116, 194)',
                                                    borderStyle: 'solid'
                                                },
                                                layout: {
                                                    type: 'vbox',
                                                    align: 'stretch'
                                                },
                                                items: [
                                                    {
                                                        xtype: 'textfield',
                                                        cls: 'projectsCountBox-num',
                                                        border: 0,
                                                        flex: 1,
                                                        text: null,
                                                        style: {
                                                            borderColor: 'rgb(0, 116, 194)',
                                                            borderStyle: 'solid'
                                                        }
                                                    },
                                                    {
                                                        xtype: 'textfield',
                                                        cls: 'projectsCountBox-desc',
                                                        border: 0,
                                                        flex: .6,
                                                        style: {
                                                            borderColor: 'rgb(0, 116, 194)',
                                                            borderStyle: 'solid'
                                                        }
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        xtype: 'container',
                                        cls: 'dashDesignsData',
                                        margin: '10 10 10 10',
                                        border: 1,
                                        width: 430,
                                        flex: 0.5,
                                        style: {
                                            borderColor: 'rgb(0, 116, 194)',
                                            borderStyle: 'solid'
                                        },
                                        id: 'designsCountBox',
                                        layout: {
                                            type: 'hbox',
                                            align: 'stretch'
                                        },
                                        items: [
                                            {
                                                xtype: 'container',
                                                cls: 'designsCountBox-icon',
                                                border: 1,
                                                flex: .6,
                                                style: {
                                                    borderColor: 'rgb(0, 116, 194)',
                                                    borderStyle: 'solid'
                                                }
                                            },
                                            {
                                                xtype: 'container',
                                                cls: 'designsCountBox-data',
                                                border: 1,
                                                flex: 1,
                                                style: {
                                                    borderColor: 'rgb(0, 116, 194)',
                                                    borderStyle: 'solid'
                                                },
                                                layout: {
                                                    type: 'vbox',
                                                    align: 'stretch'
                                                },
                                                items: [
                                                    {
                                                        xtype: 'textfield',
                                                        cls: 'designsCountBox-num',
                                                        border: 0,
                                                        flex: 1,
                                                        text: null,
                                                        style: {
                                                            borderColor: 'rgb(0, 116, 194)',
                                                            borderStyle: 'solid'
                                                        }                                                    },
                                                    {
                                                        xtype: 'textfield',
                                                        cls: 'designsCountBox-desc',
                                                        border: 0,
                                                        flex: .6,
                                                        style: {
                                                            borderColor: 'rgb(0, 116, 194)',
                                                            borderStyle: 'solid'
                                                        }
                                                    }
                                                ]
                                            }
                                        ]
                                    },

                                ]
                            },
                            {
                              xtype: 'container',
                                cls: 'dashboardStats-container2',
                                margin: '0 0 0 0',
                                border: 0,
                                style: {
                                    borderColor: '#E0E3E6',
                                    borderStyle: 'solid'
                                },
                                flex: 0.5,
                                maxHeight: 320,
                                layout: {
                                    type: 'vbox',
                                    align: 'stretch'
                                },
                                items: [
                                    {
                                        xtype: 'container',
                                        cls: 'dashSequencesData',
                                        margin: '10 10 10 10',
                                        border: 1,
                                        flex: 0.5,
                                        style: {
                                            borderColor: 'rgb(0, 116, 194)',
                                            borderStyle: 'solid'
                                        },
                                        id: 'sequencesCountBox',
                                        layout: {
                                            type: 'hbox',
                                            align: 'stretch'
                                        },
                                        items: [
                                            {
                                                xtype: 'container',
                                                cls: 'sequencesCountBox-icon',
                                                border: 1,
                                                flex: .6,
                                                style: {
                                                    borderColor: 'rgb(0, 116, 194)',
                                                    borderStyle: 'solid'
                                                }
                                            },
                                            {
                                                xtype: 'container',
                                                cls: 'sequencesCountBox-data',
                                                border: 1,
                                                flex: 1,
                                                style: {
                                                    borderColor: 'rgb(0, 116, 194)',
                                                    borderStyle: 'solid'
                                                },
                                                layout: {
                                                    type: 'vbox',
                                                    align: 'stretch'
                                                },
                                                items: [
                                                    {
                                                        xtype: 'textfield',
                                                        cls: 'sequencesCountBox-num',
                                                        border: 0,
                                                        flex: 1,
                                                        text: null,
                                                        style: {
                                                            borderColor: 'rgb(0, 116, 194)',
                                                            borderStyle: 'solid'
                                                        }
                                                    },
                                                    {
                                                        xtype: 'textfield',
                                                        cls: 'sequencesCountBox-desc',
                                                        border: 0,
                                                        flex: .6,
                                                        style: {
                                                            borderColor: 'rgb(0, 116, 194)',
                                                            borderStyle: 'solid'
                                                        }
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        xtype: 'container',
                                        cls: 'dashPartsData',
                                        margin: '10 10 10 10',
                                        border: 1,
                                        flex: 0.5,
                                        style: {
                                            borderColor: 'rgb(0, 116, 194)',
                                            borderStyle: 'solid'
                                        },
                                        id: 'partsCountBox',
                                        layout: {
                                            type: 'hbox',
                                            align: 'stretch'
                                        },
                                        items: [
                                            {
                                                xtype: 'container',
                                                cls: 'partsCountBox-icon',
                                                border: 1,
                                                flex: .6,
                                                style: {
                                                    borderColor: 'rgb(0, 116, 194)',
                                                    borderStyle: 'solid'
                                                }
                                            },
                                            {
                                                xtype: 'container',
                                                cls: 'partsCountBox-data',
                                                border: 1,
                                                flex: 1,
                                                style: {
                                                    borderColor: 'rgb(0, 116, 194)',
                                                    borderStyle: 'solid'
                                                },
                                                layout: {
                                                    type: 'vbox',
                                                    align: 'stretch'
                                                },
                                                items: [
                                                    {
                                                        xtype: 'textfield',
                                                        cls: 'partsCountBox-num',
                                                        border: 0,
                                                        flex: 1,
                                                        text: null,
                                                        style: {
                                                            borderColor: 'rgb(0, 116, 194)',
                                                            borderStyle: 'solid'
                                                        }
                                                    },
                                                    {
                                                        xtype: 'textfield',
                                                        cls: 'partsCountBox-desc',
                                                        border: 0,
                                                        flex: .6,
                                                        style: {
                                                            borderColor: 'rgb(0, 116, 194)',
                                                            borderStyle: 'solid'
                                                        }
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                ]  
                            }
                        ]
                    }
                ]
            }

            // require: ["Teselagen.event.ProjectEvent", "Teselagen.manager.ProjectManager"],
            // listeners: {
            //     itemclick: function (view, record, item, index, e, eOpts) {
            //         Vede.application.fireEvent(Teselagen.event.ProjectEvent.OPEN_PROJECT, record);;
            //     }
            // }
        
            ]

    

});
