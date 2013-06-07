/**
 * Vector Editor main menu bar
 * @class Vede.view.ve.VectorEditorMainMenuBar
 */
Ext.define('Vede.view.ve.VectorEditorMainMenuBar', {
    extend: 'Ext.toolbar.Toolbar',
    id: 'VectorEditorMainMenuBar',
    alias: 'widget.VectorEditorMainMenuBar',
    items: [
    // {
    //     xtype: 'button',
    //     text: 'File',
    //     menu: {
    //         xtype: 'menu',
    //         id: 'veFileMenu',
    //         minWidth: 140,
    //         items: [
    //             {
    //             xtype: 'filefield',
    //             buttonOnly: true,
    //             id: 'importMenuItem',
    //             buttonConfig: {
    //                 border: false,
    //                 text: 'Import from File',
    //                listeners: {
    //                    click: function() {
    //                        Ext.getCmp('veFileMenu').hide();
    //                    }
    //                }
    //             }
    //         },
    //        {
    //            xtype: 'menuitem',
    //            text: 'Download Genbank',
    //            id: 'downloadGenbankMenuItem'
    //        },
    //        {
    //            xtype: 'menuitem',
    //            text: 'Rename Sequence',
    //            id: 'renameSequenceItem'
    //        },
    //        {
    //            xtype: 'menuseparator'
    //        },
    //        {
    //            xtype: 'menuitem',
    //            text: 'Project Properties'
    //        },
    //        {
    //            xtype: 'menuitem',
    //            text: 'Print',
    //            menu: {
    //                xtype: 'menu',
    //                width: 120,
    //                items: [{
    //                    xtype: 'menuitem',
    //                    text: 'Sequence'
    //                }, {
    //                    xtype: 'menuitem',
    //                    text: 'Circular View'
    //                }, {
    //                    xtype: 'menuitem',
    //                    text: 'Linear View'
    //                }]
    //            }
    //        }

    //         ]
    //     }
    // }, 
    {
        xtype: 'button',
        text: 'Edit',
        menu: {
            xtype: 'menu',
            minWidth: 150,
            items: [{
                xtype: 'menuitem',
                id: 'cutMenuItem',
                text: 'Cut'
            }, {
                xtype: 'menuitem',
                id: 'copyMenuItem',
                text: 'Copy'
            }, {
                xtype: 'menuitem',
                id: 'pasteMenuItem',
                text: 'Paste'
            }, {
                xtype: 'menuseparator'
            }, {
                xtype: 'menuitem',
                id: 'undoMenuItem',
                text: 'Undo'
            }, {
                xtype: 'menuitem',
                id: 'redoMenuItem',
                text: 'Redo'
            }, {
                xtype: 'menuseparator'
            }, {
                xtype: 'menucheckitem',
                id: 'safeEditingMenuItem',
                text: 'Safe Editing',
                checked: true
            }, {
                xtype: 'menuseparator'
            }, {
                xtype: 'menuitem',
                id: 'findMenuItem',
                text: 'Find...'
            }, {
                xtype: 'menuitem',
                id: 'gotoMenuItem',
                text: 'Go To...'
            }, {
                xtype: 'menuseparator'
            }, {
                xtype: 'menuitem',
                id: 'selectMenuItem',
                text: 'Select...'
            }, {
                xtype: 'menuitem',
                id: 'selectAllMenuItem',
                text: 'Select All'
            }, {
                xtype: 'menuitem',
                id: 'selectInverseMenuItem',
                text: 'Select Inverse'
            }, {
                xtype: 'menuseparator'
            }, {
                xtype: 'menuitem',
                itemId: 'reverseComplementMenuItem',
                text: 'Reverse Complement Entire Sequence'
            },
            {
                xtype: 'menuitem',
                id: 'rebaseMenuItem',
                text: 'Rotate to Here'
            }
            ]
        }
    }, {
        xtype: 'button',
        text: 'View',
        menu: {
            xtype: 'menu',
            minWidth: 140,
            items: [{
                xtype: 'menucheckitem',
                id: 'circularViewMenuItem',
                text: 'Circular',
                checked: true,
                group: 'lineType'
            }, {
                xtype: 'menucheckitem',
                id: 'linearViewMenuItem',
                text: 'Linear',
                group: 'lineType'
            }, {
                xtype: 'menuseparator'
            }, {
                xtype: 'menucheckitem',
                id: 'featuresMenuItem',
                text: 'Features',
                checked: true
            }, {
                xtype: 'menucheckitem',
                id: 'cutSitesMenuItem',
                text: 'Cut Sites'
            }, {
                xtype: 'menucheckitem',
                id: 'orfsMenuItem',
                text: 'ORF'
            }, {
                xtype: 'menuseparator'
            }, {
                xtype: 'menucheckitem',
                id: 'showComplementaryMenuItem',
                text: 'Complementary',
                checked: true
            }, {
                xtype: 'menucheckitem',
                id: 'showSpacesMenuItem',
                text: 'Spaces',
                checked: true
            }, {
                xtype: 'menucheckitem',
                id: 'showSequenceAAMenuItem',
                text: 'Sequence AA'
            }, {
                xtype: 'menucheckitem',
                id: 'showRevcomAAMenuItem',
                text: 'Revcom AA'
            }, {
                xtype: 'menuseparator'
            }, {
                xtype: 'menucheckitem',
                id: 'featureLabelsMenuItem',
                text: 'Feature Labels',
                checked: true
            }, {
                xtype: 'menucheckitem',
                id: 'cutSiteLabelsMenuItem',
                text: 'Cut Site Labels',
                checked: true
            }, {
                xtype: 'menuitem',
                id: 'zoomInMenuItem',
                hideOnClick: false,
                text: 'Zoom In (+)'
            }, {
                xtype: 'menuitem',
                id: 'zoomOutMenuItem',
                hideOnClick: false,
                text: 'Zoom Out (-)'
            }]
        }
    }
    ,{
        xtype: 'button',
        text: 'Tools',
        menu: {
            xtype: 'menu',
            minWidth: 140,
            items: [
//            {
//                xtype: 'menuitem',
//                id: 'createNewFeatureMenuItem',
//                text: 'Create New Feature'
//            },
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
//            {
//                xtype: 'menuitem',
//                text: 'Properties'
//            }, {
//                xtype: 'menuseparator'
//            }, {
//                xtype: 'menuitem',
//                text: 'Preferences'
//            },
            {
                xtype: 'menuitem',
                id: 'exportToFileMenuItem',
                text: 'Export to File'
            }]
        }
    }
    ]
});
