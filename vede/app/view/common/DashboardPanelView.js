/**
 * Dashboard panel view
 * @class Vede.view.common.DashboardPanelView
 */
Ext.define('Vede.view.common.DashboardPanelView', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.DashboardPanelView',
    id: 'DashboardPanel',
    padding: '10 0',
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
                layout: 'fit',
                items: [
                    // {
                    //     xtype: 'button',
                    //     id: 'dropzone-activate',
                    //     cls: 'dropzone-activate-btn',
                    //     overCls: 'dropzone-activate-btn-over',
                    //     icon: '../../resources/images/ux/drop-import.png',
                    //     iconCls: 'dropzone-activate-import-btn',
                    //     text: 'Import Files',
                    //     height: '35',
                    //     width: '100',
                    //     listeners: {
                    //         click: function() {
                    //             $("#dropZone-area").show();
                    //         }
                    //     }
                    // },
                    {
                        xtype: 'container',
                        cls: 'sequenceLibraryContainer',
                        id: 'sequenceLibraryArea',
                        autoScroll: true,
                        layout: {
                            type: 'vbox',
                            align: 'stretch'
                        },
                        items : [
                            {
                                xtype: 'textfield',
                                anchor: '100%',
                                height: 30,
                                cls: 'sequenceLibrarySearchField',
                                width: '98%',
                                emptyText: 'Search Sequence Library',
                                emptyCls: 'empty-search-field',
                                margin: 13,
                                listeners: {
                                    change: function(field, newValue, oldValue, eOpts) {
                                        var grid = Ext.getCmp('sequenceLibrary');
                                        grid.store.clearFilter();

                                        if (newValue) {
                                            var matcher = new RegExp(Ext.String.escapeRegex(newValue), "i");
                                            grid.store.filter({
                                                filterFn: function(record) {
                                                    var features = [];
                                                    for(var i=0; i<record.get('serialize').features.length; i++) {
                                                        features.push(record.get('serialize').features[i].inData.name);
                                                    }
                                                    return matcher.test(record.get('name')) ||
                                                        matcher.test(record.get('sequenceFileFormat')) ||
                                                        matcher.test(record.get('size')) || 
                                                        matcher.test(record.get('serialize').sequence.alphabet) || 
                                                        matcher.test(features);
                                                }
                                            });
                                        }
                                    }
                                }
                            },
                            {
                                xtype: 'gridpanel',
                                xtype: 'gridpanel', 
                                border: 0,
                                name: 'SequenceLibraryGrid',
                                cls: 'sequenceLibraryGrid',
                                layout: 'fit',
                                autoHeight: true,
                                flex: 1,
                                autoScroll: true,
                                viewConfig: {
                                    style: 'overflow-y: auto'
                                },
                                id: 'sequenceLibrary',
                                autoScroll: true,
                                columns: [
                                    {
                                        xtype: 'gridcolumn',
                                        text: 'Name',
                                        width: 220,
                                        dataIndex: 'name'
                                    }, 
                                    {
                                        text     : 'Type',
                                        width    : 75,
                                        dataIndex: 'serialize',
                                        renderer: function(val) {
                                            val = val.sequence.alphabet.toUpperCase();
                                            return val;
                                        }
                                    },
                                    {
                                        xtype: 'gridcolumn',
                                        text: 'File Format',
                                        width: 100,
                                        dataIndex: 'sequenceFileFormat'
                                    },
                                    {
                                        xtype: 'gridcolumn',
                                        text: 'Size',
                                        width: 80,
                                        dataIndex: 'size'
                                    },
                                    {
                                        text     : 'Features',
                                        width    : 200,
                                        flex: 1,
                                        dataIndex: 'serialize',
                                        renderer: function(val) {
                                            var features = [];
                                            for(var i=0; i<val.features.length; i++) {
                                                features.push(val.features[i].inData.name);
                                            }
                                            return features;
                                            // return val;
                                        }
                                    },
                                    {
                                        xtype: 'gridcolumn',
                                        flex: 1,
                                        text: 'Date Created',
                                        width: 100,
                                        dataIndex: 'dateCreated',
                                        renderer: function(val) {
                                            val = new Date(val);
                                            val = Ext.Date.format(val, "F d, Y g:i A");
                                            return val;
                                        }
                                    },
                                    {
                                        xtype: 'gridcolumn',
                                        flex: 1,
                                        text: 'Last Modified',
                                        width: 100,
                                        dataIndex: 'dateModified',
                                        renderer: function(val) {
                                            val = new Date(val);
                                            val = Ext.Date.format(val, "F d, Y g:i A");
                                            return val;
                                        }
                                    }
                                    
                                    ],
                                listeners: {
                                    itemcontextmenu: function( el, record, item, index, e, eOpts ){
                                        e.preventDefault();
                                        var contextMenu = Ext.create('Ext.menu.Menu',{
                                              items: [{
                                                text: 'Open',
                                                handler: function(){
                                                    Vede.application.getController("Vede.controller.DashboardPanelController").onSequenceGridItemClick(null,record);
                                                }
                                              },{
                                                text: 'Download',
                                                handler: function() {
                                                    var VEManager = Ext.create("Teselagen.manager.VectorEditorManager", record, record.getSequenceManager());
                                                    VEManager.saveSequenceToFile();
                                                }
                                              }]
                                        }).show();
                                        contextMenu.setPagePosition(e.getX(),e.getY()-5)
                                    }
                                }
                            },
                            {
                                xtype: "dropZone",
                                name: "dropZone"
                            }
                        ]
                    }
                ]
            },
            {
                xtype: 'panel',
                title: 'Part Library',
                cls: 'partLibraryPanel',
                border: 0,
                layout: 'fit',
                items: [
                    {
                        xtype: 'container',
                        cls: 'partLibraryContainer',
                        autoScroll: true,
                        layout: {
                            type: 'vbox',
                            align: 'stretch'
                        },
                        items : [
                            {
                                xtype: 'textfield',
                                layout: {
                                    type: 'fit',
                                    align: 'stretch'
                                },
                                anchor: '100%',
                                height: 30,
                                cls: 'partLibrarySearchField',
                                width: '98%',
                                emptyText: 'Search Part Library',
                                emptyCls: 'empty-search-field',
                                margin: 13,
                                listeners: {
                                    change: function(field, newValue, oldValue, eOpts) {
                                        var grid = Ext.getCmp('partLibrary');
                                        grid.store.clearFilter();

                                        if (newValue) {
                                            var matcher = new RegExp(Ext.String.escapeRegex(newValue), "i");
                                            grid.store.filter({
                                                filterFn: function(record) {
                                                    return matcher.test(record.get('name')) ||
                                                        matcher.test(record.get('genbankStartBP')) ||
                                                        matcher.test(record.get('endBP')) ||
                                                        matcher.test(record.get('length')) ||
                                                        matcher.test(record.get('revComp')) || 
                                                        matcher.test(record.get('partSource')) ||
                                                        matcher.test(record.get('features'));
                                                }
                                            });
                                        }
                                    }
                                }
                            },
                            {
                                xtype: 'gridpanel',
                                border: 0,
                                name: 'PartLibraryGrid',
                                loadMask: true,
                                autoHeight: true,
                                flex: 1,
                                autoScroll: true,
                                viewConfig: {
                                    style: 'overflow-y: auto'
                                },
                                cls: 'partLibraryGrid',
                                height: '100%',
                                autoScroll: true,
                                id: 'partLibrary',
                                columns: [

                                    {
                                        xtype: 'gridcolumn',
                                        text: 'Name',
                                        width: 220,
                                        dataIndex: 'name'
                                    },{
                                        xtype: 'gridcolumn',
                                        text: 'Start BP',
                                        width: 80,
                                        dataIndex: 'genbankStartBP'
                                    },{
                                        xtype: 'gridcolumn',
                                        text: 'Stop BP',
                                        width: 80,
                                        dataIndex: 'endBP'
                                    },
                                    {
                                        xtype: 'gridcolumn',
                                        text: 'Length',
                                        dataIndex: 'length',
                                        width: 80
                                    },
                                    {
                                        xtype: 'gridcolumn',
                                        text: 'Reverse Complement',
                                        dataIndex: 'revComp',
                                        width: 120,
                                        renderer: function(val) {
                                            val = String(val);
                                            val = val.charAt(0).toUpperCase() + val.slice(1);
                                            return val;
                                        }
                                    },
                                    {
                                        xtype: 'gridcolumn',
                                        text: 'Source Sequence',
                                        width: 120,
                                        dataIndex: 'partSource'
                                    },
                                    {
                                        xtype: 'gridcolumn',
                                        flex: 1,
                                        text: 'Features in Range',
                                        width: 150,
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
