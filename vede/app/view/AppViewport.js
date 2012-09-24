///*global myMask */
Ext.define('Vede.view.AppViewport', {
    extend: 'Ext.container.Viewport',
    requires: [
    'Vede.view.ProjectPanelView',
    'Vede.view.DeviceEditor.DeviceEditor',
    'Vede.view.DeviceEditor.Inspector',
    'Vede.view.DeviceEditor.MainMenuBar',
    'Vede.view.DeviceEditor.MainToolBar'
    ],
    layout: {
        type: 'border'
    },

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'panel',
                    xtype: 'ProjectPanel',
                    id: 'ProjectPanel',
                    collapsible: true,
                    split : true,
                    title: 'Project',
                    flex: 1,
                    region: 'west'
                },
                {
                    xtype: 'tabpanel',
                    id: 'MainPanel',
                    activeTab: 0,
                    flex: 6,
                    region: 'center',
                    items: [
                        {
                            xtype: 'panel',
                            id: 'DeviceEditorPanel',
                            title: 'DeviceEditor',
                            layout: {
                                type: 'hbox',
                                align: 'stretch'
                            },
                            items: [
                                {
                                    xtype: 'DeviceEditorPanel',
                                    id: 'DeviceEditor',
                                    title: 'DeviceEditor',
                                    flex : 1,
                                    layout: {
                                        type: 'fit'
                                    }
                                },
                                {
                                    xtype: 'DeviceEditorInspectorPanel',
                                    width: '320px',
                                    title: 'Inspector',
                                    layout: {
                                        type: 'fit'
                                    }
                                }
                            ]
                        },
                        {
                            xtype: 'panel',
                            id: 'VectorEditorPanel',
                            title: 'VectorEditor',
                            layout: {
                                type: 'hbox',
                                align: 'stretch'
                            },
                            items: [
                                {
                                    xtype: 'panel',
                                    id: 'VectorPanel',
                                    layout: {
                                        type: 'fit'
                                    },
                                    flex: 1,
                                    region: 'center',
                                    collapsible: true,
                                    collapseDirection: 'left',
                                    items: [
                                        {
                                            xtype: 'container',
                                            id: 'PieContainer',
                                            //autoScroll: true,
                                            layout: {
                                                type: 'fit'
                                                //manageOverflow: 1
                                            }
                                        },
                                        {
                                            xtype: 'container',
                                            id: 'RailContainer',
                                            layout: {
                                                type: 'fit'
                                            }
                                        }
                                    ]
                                },
                                {
                                    xtype: 'splitter',
                                    collapseTarget: 'prev'
                                },
                                {
                                    xtype: 'panel',
                                    id: 'AnnotatePanel',
                                    layout: {
                                        type: 'fit'
                                    },
                                    autoScroll: true,
                                    collapsible: true,
                                    collapseDirection: 'right',
                                    flex: 1,
                                    items: [
                                        {
                                            xtype: 'container',
                                            id: 'AnnotateContainer',
                                            overflowY: 'scroll',
                                            layout: {
                                                type: 'fit'
                                            }
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    xtype: 'panel',
                    height: 75,
                    id: 'MainMenuPanel',
                    layout: {
                        align: 'stretch',
                        type: 'vbox'
                    },
                    region: 'north',
                    items: [
                        {
                            xtype: 'DeviceEditorMainMenuBar',
                            id: 'DeviceEditorMainMenuBar'
                        },
                        {
                            xtype: 'DeviceEditorMainToolBar',
                            id: 'DeviceEditorMainToolBar'
                        },
                        {
                            xtype: 'toolbar',
                            id: 'VectorEditorMainMenuBar',
                            hidden: true,
                            autoScroll: false,
                            flex: 1,
                            items: [
                                {
                                    xtype: 'button',
                                    text: 'File',
                                    menu: {
                                        xtype: 'menu',
                                        floating: true,
                                        minWidth: 140,
                                        width: 120,
                                        collapsed: false,
                                        collapsible: false,
                                        hideCollapseTool: false,
                                        titleCollapse: false,
                                        plain: false,
                                        items: [
                                            {
                                                xtype: 'menuitem',
                                                id: 'importMenuItem',
                                                plain: false,
                                                text: 'Import from File'
                                            },
                                            {
                                                xtype: 'menuitem',
                                                text: 'Download Genbank'
                                            },
                                            {
                                                xtype: 'menuseparator'
                                            },
                                            {
                                                xtype: 'menuitem',
                                                text: 'Project Properties'
                                            },
                                            {
                                                xtype: 'menuitem',
                                                text: 'Print',
                                                menu: {
                                                    xtype: 'menu',
                                                    width: 120,
                                                    items: [
                                                        {
                                                            xtype: 'menuitem',
                                                            text: 'Sequence'
                                                        },
                                                        {
                                                            xtype: 'menuitem',
                                                            text: 'Circular View'
                                                        },
                                                        {
                                                            xtype: 'menuitem',
                                                            text: 'Linear View'
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                },
                                {
                                    xtype: 'button',
                                    text: 'Edit',
                                    menu: {
                                        xtype: 'menu',
                                        minWidth: 150,
                                        width: 120,
                                        items: [
                                            {
                                                xtype: 'menuitem',
                                                id: 'undoMenuItem',
                                                text: 'Undo'
                                            },
                                            {
                                                xtype: 'menuitem',
                                                id: 'redoMenuItem',
                                                text: 'Redo'
                                            },
                                            {
                                                xtype: 'menuseparator'
                                            },
                                            {
                                                xtype: 'menuitem',
                                                text: 'Copy'
                                            },
                                            {
                                                xtype: 'menuitem',
                                                text: 'Cut'
                                            },
                                            {
                                                xtype: 'menuitem',
                                                text: 'Paste'
                                            },
                                            {
                                                xtype: 'menuseparator'
                                            },
                                            {
                                                xtype: 'menuitem',
                                                text: 'Find...',
                                                id: 'findMenuItem'
                                            },
                                            {
                                                xtype: 'menuitem',
                                                text: 'Go To...'
                                            },
                                            {
                                                xtype: 'menuseparator'
                                            },
                                            {
                                                xtype: 'menuitem',
                                                text: 'Select...',
                                                id: 'selectMenuItem'
                                            },
                                            {
                                                xtype: 'menuitem',
                                                text: 'Select All',
                                                id: 'selectAllMenuItem'
                                            },
                                            {
                                                xtype: 'menuitem',
                                                text: 'Select Inverse',
                                                id: 'selectInverseMenuItem'
                                            },
                                            {
                                                xtype: 'menuseparator'
                                            },
                                            {
                                                xtype: 'menuitem',
                                                text: 'Reverse Complement',
                                                id: 'reverseComplementMenuItem'
                                            },
                                            {
                                                xtype: 'menuitem',
                                                text: 'Rotate to Here',
                                                id: 'rebaseMenuItem'
                                            }
                                        ]
                                    }
                                },
                                {
                                    xtype: 'button',
                                    text: 'View',
                                    menu: {
                                        xtype: 'menu',
                                        width: 120,
                                        items: [
                                            {
                                                xtype: 'menucheckitem',
                                                text: 'Circular',
                                                id: 'circularViewMenuItem',
                                                checked: true,
                                                group: 'lineType'
                                            },
                                            {
                                                xtype: 'menucheckitem',
                                                text: 'Linear',
                                                id: 'linearViewMenuItem',
                                                group: 'lineType'
                                            },
                                            {
                                                xtype: 'menuseparator'
                                            },
                                            {
                                                xtype: 'menucheckitem',
                                                id: 'featuresMenuItem',
                                                text: 'Features',
                                                checked: true
                                            },
                                            {
                                                xtype: 'menucheckitem',
                                                id: 'cutSitesMenuItem',
                                                text: 'Cut Sites',
                                                checked: false
                                            },
                                            {
                                                xtype: 'menucheckitem',
                                                id: 'orfsMenuItem',
                                                text: 'ORF',
                                                checked: false
                                            },
                                            {
                                                xtype: 'menuseparator'
                                            },
                                            {
                                                xtype: 'menucheckitem',
                                                id: 'showComplementaryMenuItem',
                                                text: 'Complementary',
                                                checked: true
                                            },
                                            {
                                                xtype: 'menucheckitem',
                                                id: 'showSpacesMenuItem',
                                                text: 'Spaces',
                                                checked: true
                                            },
                                            {
                                                xtype: 'menucheckitem',
                                                id: 'showSequenceAAMenuItem',
                                                text: 'Sequence AA'
                                            },
                                            {
                                                xtype: 'menucheckitem',
                                                id: 'showRevcomAAMenuItem',
                                                text: 'Revcom AA'
                                            },
                                            {
                                                xtype: 'menuseparator'
                                            },
                                            {
                                                xtype: 'menucheckitem',
                                                id: 'featureLabelsMenuItem',
                                                text: 'Feature Labels',
                                                checked: true
                                            },
                                            {
                                                xtype: 'menucheckitem',
                                                id: 'cutSiteLabelsMenuItem',
                                                text: 'Cut Site Labels',
                                                checked: true
                                            }
                                        ]
                                    }
                                },
                                {
                                    xtype: 'button',
                                    text: 'Tools',
                                    menu: {
                                        xtype: 'menu',
                                        minWidth: 140,
                                        width: 120,
                                        items: [
                                            {
                                                xtype: 'menuitem',
                                                text: 'Create New Feature'
                                            },
                                            {
                                                xtype: 'menuitem',
                                                id: 'restrictionEnzymesManagerMenuItem',
                                                text: 'Restriction Enzymes Manager'
                                            },
                                            {
                                               xtype: 'menuitem',
                                                id: 'simulateDigestionMenuItem',
                                                text: 'Simulate Digestion'
                                            },
                                            {
                                                xtype: 'menuitem',
                                                text: 'Properties'
                                            },
                                            {
                                                xtype: 'menuseparator'
                                            },
                                            {
                                                xtype: 'menuitem',
                                                text: 'Preferences'
                                            }
                                        ]
                                    }
                                },
                                {
                                    xtype: 'button',
                                    text: 'Help',
                                    menu: {
                                        xtype: 'menu',
                                        width: 120,
                                        items: [
                                            {
                                                xtype: 'menuitem',
                                                text: 'Suggest Feature'
                                            },
                                            {
                                                xtype: 'menuitem',
                                                text: 'Report Bug'
                                            },
                                            {
                                                xtype: 'menuseparator'
                                            },
                                            {
                                                xtype: 'menuitem',
                                                text: 'About'
                                            }
                                        ]
                                    }
                                }
                            ]
                        },
                        {
                            xtype: 'toolbar',
                            id: 'VectorEditorMainToolBar',
                            hidden:true,
                            flex: 1,
                            items: [
                                {
                                    xtype: 'button',
                                    id: 'exportBtn',
                                    icon: 'resources/images/export.png',
                                    scale: 'medium',
                                    tooltip: 'Save to Registry'
                                },
                                {
                                    xtype: 'button',
                                    id: 'saveBtn',
                                    icon: 'resources/images/save.png',
                                    scale: 'medium',
                                    tooltip: 'Save Project'
                                },
                                {
                                    xtype: 'button',
                                    id: 'projectPropsBtn',
                                    icon: 'resources/images/project_properties.png',
                                    scale: 'medium',
                                    tooltip: 'Project Properties'
                                },
                                {
                                    xtype: 'button',
                                    id: 'circularViewBtn',
                                    enableToggle: true,
                                    pressed: true,
                                    icon: 'resources/images/pie.png',
                                    scale: 'medium',
                                    tooltip: 'Circular View'
                                },
                                {
                                    xtype: 'button',
                                    id: 'linearViewBtn',
                                    enableToggle: true,
                                    icon: 'resources/images/rail.png',
                                    scale: 'medium',
                                    tooltip: 'Linear View'
                                },
                                {
                                    xtype: 'button',
                                    id: 'copyBtn',
                                    icon: 'resources/images/copy.png',
                                    scale: 'medium',
                                    tooltip: 'Copy'
                                },
                                {
                                    xtype: 'button',
                                    id: 'cutBtn',
                                    icon: 'resources/images/cut.png',
                                    scale: 'medium',
                                    tooltip: 'Cut'
                                },
                                {
                                    xtype: 'button',
                                    id: 'pasteBtn',
                                    icon: 'resources/images/paste.png',
                                    scale: 'medium',
                                    tooltip: 'Paste'
                                },
                                {
                                    xtype: 'button',
                                    id: 'undoBtn',
                                    icon: 'resources/images/undo.png',
                                    scale: 'medium',
                                    tooltip: 'Undo'
                                },
                                {
                                    xtype: 'button',
                                    id: 'redoBtn',
                                    icon: 'resources/images/redo.png',
                                    scale: 'medium',
                                    tooltip: 'Redo'
                                },
                                {
                                    xtype: 'button',
                                    id: 'safeBtn',
                                    icon: 'resources/images/safe_editing.png',
                                    scale: 'medium',
                                    tooltip: 'Safe Editing'
                                },
                                {
                                    xtype: 'button',
                                    id: 'findBtn',
                                    enableToggle: true,
                                    icon: 'resources/images/find.png',
                                    scale: 'medium',
                                    tooltip: 'Find...'
                                },
                                {
                                    xtype: 'button',
                                    id: 'featuresBtn',
                                    enableToggle: true,
                                    pressed: true,
                                    icon: 'resources/images/features.png',
                                    scale: 'medium',
                                    tooltip: 'Show Features'
                                },
                                {
                                    xtype: 'button',
                                    id: 'cutsitesBtn',
                                    enableToggle: true,
                                    icon: 'resources/images/cut_sites.png',
                                    scale: 'medium',
                                    tooltip: 'Show Cut Sites'
                                },
                                {
                                    xtype: 'button',
                                    id: 'orfsBtn',
                                    enableToggle: true,
                                    icon: 'resources/images/orf.png',
                                    scale: 'medium',
                                    tooltip: 'Show ORF'
                                },
                                {
                                    xtype: 'button',
                                    id: 'reBtn',
                                    icon: 'resources/images/restriction_enzymes.png',
                                    scale: 'medium',
                                    tooltip: 'Show Restriction Enzyme Manager'
                                },
                                {
                                    xtype: 'button',
                                    id: 'propsBtn',
                                    icon: 'resources/images/properties.png',
                                    scale: 'medium',
                                    tooltip: 'Properties'
                                }
                            ]
                        }
                    ]
                },
                {
                    xtype: 'panel',
                    height: 28,
                    id: 'FindPanel',
                    layout: {
                        type: 'hbox'
                    },
                    hidden: true,
                    region: 'south',
                    items: [
                        {
                            xtype: 'textfield',
                            id: 'findField',
                            hideLabel: true,
                            emptyText: 'Search...',
                            width: 500,
                            maxWidth: 600,
                            margin: '2 4 2 4'
                        },
                        {
                            xtype: 'button',
                            id: 'findNextBtn',
                            text: '<b>Find Next</b>',
                            margin: '2 4 2 4'
                        },
                        {
                            xtype: 'combobox',
                            id: 'findInSelector',
                            queryMode: 'local',
                            editable: false,
                            value: 'DNA',
                            store: ['DNA', 'Amino Acids'],
                            margin: '2 4 2 4'
                        },
                        {
                            xtype: 'combobox',
                            id: 'literalSelector',
                            queryMode: 'local',
                            editable: false,
                            value: 'Literal',
                            store: ['Literal', 'Ambiguous'],
                            margin: '2 4 2 4'
                        },
                        {
                            xtype: 'button',
                            id: 'highlightAllBtn',
                            text: '<b>Highlight All</b>',
                            margin: '2 4 2 4'
                        }
                    ]
                },
                {
                    xtype: 'panel',
                    height: 23,
                    id: 'StatusPanel',
                    layout: {
                        type: 'fit'
                    },
                    region: 'south',
                    dockedItems: [
                        {
                            xtype: 'toolbar',
                            id: 'StatusBar',
                            dock: 'top',
                            items: [
                                {
                                    xtype: 'tbfill'
                                },
                                {
                                    xtype: 'tbseparator'
                                },
                                {
                                    xtype: 'tbtext',
                                    text: 'Read only'
                                },
                                {
                                    xtype: 'tbseparator'
                                },
                                {
                                    xtype: 'tbspacer',
                                    width: 10
                                },
                                {
                                    xtype: 'tbseparator'
                                },
                                {
                                    xtype: 'tbtext',
                                    text: '- : -'
                                },
                                {
                                    xtype: 'tbseparator'
                                },
                                {
                                    xtype: 'tbtext',
                                    text: 0
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        me.callParent(arguments);
    }
//    listeners: {
//        afterrender: function(){
//            myMask.destroy();
//        }
//    }


});
