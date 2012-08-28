/*
 * File: app/view/AppViewport.js
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

Ext.define('MyApp.view.AppViewport', {
    extend: 'Ext.container.Viewport',
    layout: 'border',
    requires: ['MyApp.view.DeviceEditorView',
    'MyApp.view.DeviceEditorInspectorView',
    'MyApp.view.DeviceEditorMainMenuBar'],
    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'treepanel',
                    id: 'ProjectPanel',
                    width: 150,
                    title: 'Project',
                    flex: 1,
                    region: 'west',
                    viewConfig: {

                    }
                },
                {
                    xtype: 'tabpanel',
                    id: 'EditorPanel',
                    activeTab: 0,
                    flex: 4,
                    region: 'center',
                    items: [
                        {
                            xtype: 'panel',
                            layout: {
                                align: 'stretch',
                                type: 'hbox',
                                pack: 'start'
                            },
                            title: 'DeviceEditor',
                            items: [
                                {
                                    xtype: 'DeviceEditorPanel',
                                    id: 'DeviceEditor',
                                    layout: {
                                        type: 'fit'
                                    },
                                    flex: 2,
                                    title: 'DeviceEditor'
                                },
                                {
                                    xtype: 'DeviceEditorInspectorPanel',
                                    width: '320px',
                                    layout: {
                                        type: 'fit'
                                    },
                                    title: 'Inspector'                                }
                            ]
                        },
                        {
                            xtype: 'panel',
                            layout: {
                                align: 'stretch',
                                type: 'hbox'
                            },
                            title: 'VectorEditor',
                            items: [
                                {
                                    xtype: 'panel',
                                    id: 'VectorPanel',
                                    layout: {
                                        align: 'stretch',
                                        type: 'hbox'
                                    },
                                    title: 'Vector',
                                    flex: 2,
                                    items: [
                                        {
                                            xtype: 'container',
                                            id: 'PieContainer',
                                            layout: {
                                                type: 'fit'
                                            },
                                            flex: 1,
                                            items: [
                                                {
                                                    xtype: 'button',
                                                    text: 'MyButton'
                                                }
                                            ]
                                        },
                                        {
                                            xtype: 'container',
                                            hidden: true,
                                            id: 'RailContainer',
                                            layout: {
                                                type: 'fit'
                                            },
                                            flex: 1,
                                            items: [
                                                {
                                                    xtype: 'button',
                                                    text: 'MyButton'
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    xtype: 'panel',
                                    id: 'AnnotatePanel',
                                    width: 150,
                                    resizable: true,
                                    resizeHandles: 'w',
                                    title: 'Annotate',
                                    flex: 2
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
                            xtype: 'DeviceEditorMainMenuBar'
                        }
                        ,
                        {
                            xtype: 'toolbar',
                            id: 'MainMenuBar',
                            autoScroll: false,
                            flex: 1,
                            hidden: true,
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
                                                text: 'Restriction Enzymes Manager',
                                                listeners: {
                                                    click: {
                                                        fn: me.onMenuitemClick1,
                                                        scope: me
                                                    }
                                                }
                                            },
                                            {
                                                xtype: 'menuitem',
                                                id: 'simulateDigestionMenuItem',
                                                text: 'Simulate Digestion',
                                                listeners: {
                                                    click: {
                                                        fn: me.onMenuitemClick,
                                                        scope: me
                                                    }
                                                }
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
                            hidden: false,
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
    },

    onMenuitemClick1: function(item, e, options) {
        Ext.create("MyApp.view.RestrictionEnzymesManagerWindow").show();
    },

    onMenuitemClick: function(item, e, options) {

    }

});