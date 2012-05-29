/*
 * File: app/view/MyViewport.js
 *
 * This file was generated by Sencha Architect version 2.0.0.
 * http://www.sencha.com/products/architect/
 *
 * This file requires use of the Ext JS 4.0.x library, under independent license.
 * License of Sencha Architect does not include license for Ext JS 4.0.x. For more
 * details see http://www.sencha.com/license or contact license@sencha.com.
 *
 * This file will be auto-generated each and everytime you save your project.
 *
 * Do NOT hand edit this file.
 */

Ext.define('MyApp.view.MyViewport', {
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
                    title: 'My Panel',
                    titleCollapse: true,
                    region: 'center'
                },
                {
                    xtype: 'panel',
                    id: 'projectPanel',
                    width: 150,
                    resizable: true,
                    resizeHandles: 'e',
                    title: 'Project',
                    region: 'west'
                },
                {
                    xtype: 'panel',
                    width: 150,
                    resizable: true,
                    resizeHandles: 'w',
                    title: 'My Panel',
                    region: 'east'
                },
                {
                    xtype: 'panel',
                    height: 75,
                    id: 'menuPanel',
                    layout: {
                        align: 'stretch',
                        type: 'vbox'
                    },
                    region: 'north',
                    items: [
                        {
                            xtype: 'toolbar',
                            id: 'menuTb',
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
                                                xtype: 'menuitem',
                                                text: 'Circular'
                                            },
                                            {
                                                xtype: 'menuitem',
                                                text: 'Linear'
                                            },
                                            {
                                                xtype: 'menuseparator'
                                            },
                                            {
                                                xtype: 'menuitem',
                                                text: 'Features'
                                            },
                                            {
                                                xtype: 'menuitem',
                                                text: 'Cut Sites'
                                            },
                                            {
                                                xtype: 'menuitem',
                                                text: 'ORF'
                                            },
                                            {
                                                xtype: 'menuseparator'
                                            },
                                            {
                                                xtype: 'menuitem',
                                                text: 'Complementary'
                                            },
                                            {
                                                xtype: 'menuitem',
                                                text: 'Spaces'
                                            },
                                            {
                                                xtype: 'menuitem',
                                                text: 'Sequence AA'
                                            },
                                            {
                                                xtype: 'menuitem',
                                                text: 'Revcom AA'
                                            },
                                            {
                                                xtype: 'menuseparator'
                                            },
                                            {
                                                xtype: 'menuitem',
                                                text: 'Feature Labels'
                                            },
                                            {
                                                xtype: 'menuitem',
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
                                                text: 'Restriction Enzymes Manager'
                                            },
                                            {
                                                xtype: 'menuitem',
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
                            id: 'iconTb',
                            flex: 1,
                            items: [
                                {
                                    xtype: 'button',
                                    id: 'exportBtn',
                                    icon: 'icons/export.png',
                                    scale: 'medium',
                                    tooltip: 'Save to Registry'
                                },
                                {
                                    xtype: 'button',
                                    id: 'saveBtn',
                                    icon: 'icons/save.png',
                                    scale: 'medium',
                                    tooltip: 'Save Project'
                                },
                                {
                                    xtype: 'button',
                                    id: 'projectPropsBtn',
                                    icon: 'icons/project_properties.png',
                                    scale: 'medium',
                                    tooltip: 'Project Properties'
                                },
                                {
                                    xtype: 'button',
                                    id: 'circularViewBtn',
                                    icon: 'icons/pie.png',
                                    scale: 'medium',
                                    tooltip: 'Circular View'
                                },
                                {
                                    xtype: 'button',
                                    id: 'linearViewBtn',
                                    icon: 'icons/rail.png',
                                    scale: 'medium',
                                    tooltip: 'Linear View'
                                },
                                {
                                    xtype: 'button',
                                    id: 'copyBtn',
                                    icon: 'icons/copy.png',
                                    scale: 'medium',
                                    tooltip: 'Copy'
                                },
                                {
                                    xtype: 'button',
                                    id: 'cutBtn',
                                    icon: 'icons/cut.png',
                                    scale: 'medium',
                                    tooltip: 'Cut'
                                },
                                {
                                    xtype: 'button',
                                    id: 'pasteBtn',
                                    icon: 'icons/paste.png',
                                    scale: 'medium',
                                    tooltip: 'Paste'
                                },
                                {
                                    xtype: 'button',
                                    id: 'undoBtn',
                                    icon: 'icons/undo.png',
                                    scale: 'medium',
                                    tooltip: 'Undo'
                                },
                                {
                                    xtype: 'button',
                                    id: 'redoBtn',
                                    icon: 'icons/redo.png',
                                    scale: 'medium',
                                    tooltip: 'Redo'
                                },
                                {
                                    xtype: 'button',
                                    id: 'safeBtn',
                                    icon: 'icons/safe_editing.png',
                                    scale: 'medium',
                                    tooltip: 'Safe Editing'
                                },
                                {
                                    xtype: 'button',
                                    id: 'findBtn',
                                    icon: 'icons/find.png',
                                    scale: 'medium',
                                    tooltip: 'Find...'
                                },
                                {
                                    xtype: 'button',
                                    id: 'featuresBtn',
                                    icon: 'icons/features.png',
                                    scale: 'medium',
                                    tooltip: 'Show Features'
                                },
                                {
                                    xtype: 'button',
                                    id: 'cutsitesBtn',
                                    icon: 'icons/cut_sites.png',
                                    scale: 'medium',
                                    tooltip: 'Show Cut Sites'
                                },
                                {
                                    xtype: 'button',
                                    id: 'orfBtn',
                                    icon: 'icons/orf.png',
                                    scale: 'medium',
                                    tooltip: 'Show ORF'
                                },
                                {
                                    xtype: 'button',
                                    id: 'reBtn',
                                    icon: 'icons/restriction_enzymes.png',
                                    scale: 'medium',
                                    tooltip: 'Show Restriction Enzymes'
                                },
                                {
                                    xtype: 'button',
                                    id: 'propsBtn',
                                    icon: 'icons/properties.png',
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
                    id: 'statusPanel',
                    layout: {
                        type: 'fit'
                    },
                    region: 'south',
                    dockedItems: [
                        {
                            xtype: 'toolbar',
                            id: 'statusTb',
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