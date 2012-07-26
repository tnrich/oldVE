Ext.define('Vede.view.AppViewport', {
    extend: 'Ext.container.Viewport',

    layout: {
        type: 'border'
    },

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'panel',
                    id: 'ProjectPanel',
                    width: 150,
                    resizable: true,
                    resizeHandles: 'e',
                    title: 'Project',
                    flex: 1,
                    region: 'west'
                },
                {
                    xtype: 'panel',
                    id: 'VectorPanel',
                    layout: {
                        type: 'fit'
                    },
                    title: 'Vector',
                    flex: 2,
                    region: 'center',
                    items: [
                        {
                            xtype: 'container',
                            id: 'PieContainer',
                            layout: {
                                type: 'fit'
                            }
                        },
                        {
                            xtype: 'container',
                            hidden: true,
                            id: 'RailContainer',
                            layout: {
                                type: 'fit'
                            }
                        }
                    ]
                },
                {
                    xtype: 'panel',
                    id: 'AnnotatePanel',
                    layout: {
                        type: 'fit'
                    },
                    width: 150,
                    resizable: true,
                    resizeHandles: 'w',
                    title: 'Annotate',
                    flex: 2,
                    region: 'east'
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
                            xtype: 'toolbar',
                            id: 'MainMenuBar',
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
                                                text: 'Undo'
                                            },
                                            {
                                                xtype: 'menuitem',
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
                                                text: 'Find...'
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
                                                text: 'Select...'
                                            },
                                            {
                                                xtype: 'menuitem',
                                                text: 'Select All'
                                            },
                                            {
                                                xtype: 'menuitem',
                                                text: 'Select Inverse'
                                            },
                                            {
                                                xtype: 'menuseparator'
                                            },
                                            {
                                                xtype: 'menuitem',
                                                text: 'Reverse Complement'
                                            },
                                            {
                                                xtype: 'menuitem',
                                                text: 'Rotate to Here'
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
                                                group: 'lineType'
                                            },
                                            {
                                                xtype: 'menucheckitem',
                                                text: 'Linear',
                                                group: 'lineType'
                                            },
                                            {
                                                xtype: 'menuseparator'
                                            },
                                            {
                                                xtype: 'menucheckitem',
                                                id: 'featuresMenuItem',
                                                text: 'Features'
                                            },
                                            {
                                                xtype: 'menucheckitem',
                                                text: 'Cut Sites'
                                            },
                                            {
                                                xtype: 'menucheckitem',
                                                text: 'ORF'
                                            },
                                            {
                                                xtype: 'menuseparator'
                                            },
                                            {
                                                xtype: 'menucheckitem',
                                                text: 'Complementary'
                                            },
                                            {
                                                xtype: 'menucheckitem',
                                                text: 'Spaces'
                                            },
                                            {
                                                xtype: 'menucheckitem',
                                                text: 'Sequence AA'
                                            },
                                            {
                                                xtype: 'menucheckitem',
                                                text: 'Revcom AA'
                                            },
                                            {
                                                xtype: 'menuseparator'
                                            },
                                            {
                                                xtype: 'menucheckitem',
                                                text: 'Feature Labels'
                                            },
                                            {
                                                xtype: 'menucheckitem',
                                                text: 'Cut Site Labels'
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
                                                text: 'Simulate Digestion',
/*                                                listeners: {
                                                    click: {
                                                        fn: me.onMenuitemClick,
                                                        scope: me
                                                    }
                                                }*/
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
                            id: 'MainToolBar',
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
                                    icon: 'resources/images/pie.png',
                                    scale: 'medium',
                                    tooltip: 'Circular View'
                                },
                                {
                                    xtype: 'button',
                                    id: 'linearViewBtn',
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
                                    icon: 'resources/images/find.png',
                                    scale: 'medium',
                                    tooltip: 'Find...'
                                },
                                {
                                    xtype: 'button',
                                    id: 'featuresBtn',
                                    enableToggle: true,
                                    icon: 'resources/images/features.png',
                                    scale: 'medium',
                                    tooltip: 'Show Features'
                                },
                                {
                                    xtype: 'button',
                                    id: 'cutsitesBtn',
                                    icon: 'resources/images/cut_sites.png',
                                    scale: 'medium',
                                    tooltip: 'Show Cut Sites'
                                },
                                {
                                    xtype: 'button',
                                    id: 'orfBtn',
                                    icon: 'resources/images/orf.png',
                                    scale: 'medium',
                                    tooltip: 'Show ORF'
                                },
                                {
                                    xtype: 'button',
                                    id: 'reBtn',
                                    icon: 'resources/images/restriction_enzymes.png',
                                    scale: 'medium',
                                    tooltip: 'Show Restriction Enzymes'
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

});
