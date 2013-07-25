/**
 * Dashboard panel view
 * @class Vede.view.common.DashboardPanelView
 */
Ext.define('Vede.view.common.DashboardPanelView', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.DashboardPanelView',
    id: 'DashboardPanel',
    layout: {
        type: 'card'
    },
    frameHeader: false,
    border: 0,
    title: 'Dashboard',
    items: [
            {
            xtype: 'panel',
            title: 'Dashboard',
            border: 0,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [
                    {
                        xtype: 'container',
                        flex: 0.3,
                        id: 'welcome_splash',
                        border: 0,
                    },
                    {
                        xtype: 'container',
                        id: 'dashboardButtons',
                        margin: '0 100 0 100',
                        minHeight: 125,
                        minWidth: 800,
                        flex: 0.4,
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
                                iconCls: 'newProject-icon',
                                iconAlign: 'top',
                                listeners: {
                                    click: function () {
                                        Teselagen.manager.ProjectManager.createNewProject();
                                    },
                                    afterrender: function(cmp) {
                                        cmp.getEl().set({
                                            "data-intro": 'Click here to Start a Project',
                                            "data-step": 1
                                        });
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
                                iconCls: 'newSequence-icon',
                                iconAlign: 'top',
                                overCls: 'createSequence-over',
                                listeners: {
                                    click: function () {
                                        Vede.application.fireEvent("createSequence");
                                    },
                                    afterrender: function(cmp) {
                                        cmp.getEl().set({
                                            "data-intro": 'You can start with a blank sequence by clicking here.',
                                            "data-step": 2
                                        });
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
                                iconCls: 'manuals-icon',
                                text: 'Manuals',
                                href: 'http://help.teselagen.com/manual/',
                                listeners: {
                                    afterrender: function(cmp) {
                                        cmp.getEl().set({
                                            "data-intro": 'Make sure you check out the manuals for a thorough documentation.',
                                            "data-step": 4
                                        });
                                    }
                                }
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
                                iconCls: 'tour-icon',
                                iconAlign: 'top',
                                text: 'Take a Tour',
                                listeners: {
                                    click: function () {
                                        introJs().start();
                                    }
                                }
                            }
                        ]
                    }, 
                    {
                        xtype: 'container',
                        id: 'dashboardStats',
                        margin: '10 100 50 100',
                        flex: 1,
                        minHeight: 320,
                        minWidth: 800,
                        border: 0,
                        layout: {
                            type: 'hbox',
                            align: 'stretch'
                        },
                        listeners: {
                            afterrender: function(cmp) {
                                        cmp.getEl().set({
                                            "data-intro": 'Here are some awesome stats to keep you up to date.',
                                            "data-position": 'top',
                                            "data-step": 3
                                        });
                                    }
                        },
                        items: [ 
                            {
                                xtype: 'container',
                                cls: 'dashboardStats-container',
                                margin: '0 0 0 0',
                                border: 0,
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
                                        width: 430,
                                        flex: 0.5,
                                        id: 'projectsCountBox',
                                        layout: {
                                            type: 'hbox',
                                            align: 'stretch'
                                        },
                                        items: [
                                            {
                                                xtype: 'container',
                                                cls: 'projectsCountBox-icon',
                                                flex: .6,
                                                layout: {
                                                    type: 'hbox',
                                                    pack: 'center'
                                                },
                                                items: [
                                                    {
                                                        xtype: 'image',
                                                        imgCls: 'projects-icon',
                                                        border: 0,
                                                        margin: '32 0 0 0'
                                                    }
                                                ]
                                            },
                                            {
                                                xtype: 'container',
                                                cls: 'projectsCountBox-data',
                                                flex: 1,
                                                layout: {
                                                    type: 'vbox',
                                                    align: 'stretch'
                                                },
                                                items: [
                                                    {
                                                        xtype: 'textfield',
                                                        readOnly: true,
                                                        cls: 'projectsCountBox-num',
                                                        border: 0,
                                                        flex: .8,
                                                        text: null
                                                    },
                                                    {
                                                        xtype: 'textfield',
                                                        readOnly: true,
                                                        cls: 'projectsCountBox-desc',
                                                        flex: .6,
                                                        border: 0
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        xtype: 'container',
                                        cls: 'dashDesignsData',
                                        margin: '10 10 10 10',
                                        width: 430,
                                        flex: 0.5,
                                        id: 'designsCountBox',
                                        layout: {
                                            type: 'hbox',
                                            align: 'stretch'
                                        },
                                        items: [
                                            {
                                                xtype: 'container',
                                                cls: 'designsCountBox-icon',
                                                flex: .6,
                                                layout: {
                                                    type: 'hbox',
                                                    pack: 'center'
                                                },
                                                items: [
                                                    {
                                                        xtype: 'image',
                                                        imgCls: 'designs-icon',
                                                        border: 0,
                                                        margin: '32 0 0 0'
                                                    }
                                                ]
                                            },
                                            {
                                                xtype: 'container',
                                                cls: 'designsCountBox-data',
                                                flex: 1,
                                                layout: {
                                                    type: 'vbox',
                                                    align: 'stretch'
                                                },
                                                items: [
                                                    {
                                                        xtype: 'textfield',
                                                        readOnly: true,
                                                        cls: 'designsCountBox-num',
                                                        border: 0,
                                                        flex: 1,
                                                        text: null
                                                    },                         
                                                    {
                                                        xtype: 'textfield',
                                                        readOnly: true,
                                                        cls: 'designsCountBox-desc',
                                                        border: 0,
                                                        flex: .6
                                                    }
                                                ]
                                            }
                                        ]
                                    }

                                ]
                            },
                            {
                              xtype: 'container',
                                cls: 'dashboardStats-container2',
                                margin: '0 0 0 0',
                                border: 0,
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
                                        flex: 0.5,
                                        id: 'sequencesCountBox',
                                        layout: {
                                            type: 'hbox',
                                            align: 'stretch'
                                        },
                                        items: [
                                            {
                                                xtype: 'container',
                                                cls: 'sequencesCountBox-icon',
                                                flex: .6,
                                                layout: {
                                                    type: 'hbox',
                                                    pack: 'center'
                                                },
                                                items: [
                                                    {
                                                        xtype: 'image',
                                                        imgCls: 'sequences-icon',
                                                        border: 0,
                                                        margin: '32 0 0 0'
                                                    }
                                                ]
                                            },
                                            {
                                                xtype: 'container',
                                                cls: 'sequencesCountBox-data',
                                                flex: 1,
                                                layout: {
                                                    type: 'vbox',
                                                    align: 'stretch'
                                                },
                                                items: [
                                                    {
                                                        xtype: 'textfield',
                                                        readOnly: true,
                                                        cls: 'sequencesCountBox-num',
                                                        border: 0,
                                                        flex: 1,
                                                        text: null
                                                    },
                                                    {
                                                        xtype: 'textfield',
                                                        readOnly: true,
                                                        cls: 'sequencesCountBox-desc',
                                                        border: 0,
                                                        flex: .6
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        xtype: 'container',
                                        cls: 'dashPartsData',
                                        margin: '10 10 10 10',
                                        flex: 0.5,
                                        id: 'partsCountBox',
                                        layout: {
                                            type: 'hbox',
                                            align: 'stretch'
                                        },
                                        items: [
                                            {
                                                xtype: 'container',
                                                cls: 'partsCountBox-icon',
                                                flex: .6,
                                                layout: {
                                                    type: 'hbox',
                                                    pack: 'center'
                                                },
                                                items: [
                                                    {
                                                        xtype: 'image',
                                                        imgCls: 'parts-icon',
                                                        border: 0,
                                                        margin: '32 0 0 0'
                                                    }
                                                ]
                                            },
                                            {
                                                xtype: 'container',
                                                cls: 'partsCountBox-data',
                                                flex: 1,
                                                layout: {
                                                    type: 'vbox',
                                                    align: 'stretch'
                                                },
                                                items: [
                                                    {
                                                        xtype: 'textfield',
                                                        readOnly: true,
                                                        cls: 'partsCountBox-num',
                                                        border: 0,
                                                        flex: 1,
                                                        text: null
                                                    },
                                                    {
                                                        xtype: 'textfield',
                                                        readOnly: true,
                                                        cls: 'partsCountBox-desc',
                                                        border: 0,
                                                        flex: .6
                                                    }
                                                ]
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
                xtype: 'panel',
                title: 'Sequence Library',
                cls: 'sequenceLibraryPanel',
                border: 0,
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                items: [
                    {
                        xtype: 'container'
                    },
                    {
                        xtype: 'container',
                        cls: 'sequenceLibraryContainer',
                        flex: 1,
                        items : [
                            {
                                xtype: 'gridpanel',
                                border: 0,
                                name: 'SequenceLibraryGrid',
                                cls: 'sequenceLibraryGrid',
                                columns: [
                                    {
                                        xtype: 'gridcolumn',
                                        text: 'Name',
                                        width: 320,
                                        dataIndex: 'name'
                                    }, {
                                        xtype: 'gridcolumn',
                                        text: 'File Format',
                                        width: 100,
                                        dataIndex: 'sequenceFileFormat'
                                    },{
                                        xtype: 'gridcolumn',
                                        text: 'Project',
                                        width: 120,
                                        dataIndex: 'parentProject'
                                    },
                                    {
                                        xtype: 'gridcolumn',
                                        text: 'Size',
                                        width: 80,
                                        dataIndex: 'size'
                                    },
                                    {
                                        xtype: 'gridcolumn',
                                        text: 'Features',
                                        flex: 1,
                                        dataIndex: 'features'
                                    },
                                ]
                            }
                        ]
                    }
                ]
            }
        ]


            // require: ["Teselagen.event.AuthenticationEvent"],
            // listeners: {
            //     tabchange: function(tabPanel, tab) {
            //         Vede.application.fireEvent(Teselagen.event.AuthenticationEvent.POPULATE_STATS);;
            //     }
            // }

    

});
