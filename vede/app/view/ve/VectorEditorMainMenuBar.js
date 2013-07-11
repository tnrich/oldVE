/**
 * Vector Editor main menu bar
 * @class Vede.view.ve.VectorEditorMainMenuBar
 */
Ext.define('Vede.view.ve.VectorEditorMainMenuBar', {
    extend: 'Ext.toolbar.Toolbar',
    cls: 'VectorEditorMainMenuBar',
    alias: 'widget.VectorEditorMainMenuBar',
    items: [
     {
         xtype: 'button',
         text: 'File',
         menu: {
             xtype: 'menu',
             cls: 'veFileMenu',
             minWidth: 140,
             hideMode: 'offsets',
             items: [
            {
                xtype: 'menuitem',
                text: 'New Sequence',
                identifier: 'newBlankVectorEditorMenuItem'
            },                  
            /*{
                //Disabled until VE is refactored to open multiple tabs.
            	xtype: 'menuitem',
                text: 'Close',
                disabled: true,
                identifier: 'closeMenuItem'
            },*/
            {
                xtype: 'menuseparator'
            },
            {
            	xtype: 'menuitem',
                text: 'Save',
                identifier: 'saveMenuItem'
            },
            {
            	xtype: 'menuitem',
                text: 'Save As...',
                identifier: 'saveAsMenuItem'
            },
            /*{
                xtype: 'menuseparator'
            },
            {
                xtype: 'menuitem',
                text: 'Share',
                identifier: 'shareItem',
                disabled: true
                menu: {
                	xtype: 'menu',
                	width: 120,
                	items []
                }
            },*/
            {
                xtype: 'menuseparator'
            },
            {
                xtype: 'filefield',
                buttonOnly: true,
                identifier: 'importSequenceBtn',
                identifier: 'importSequenceMenuItem',
                text: 'Import File',
                buttonConfig: {
                    border: false,
                    text: 'Open a Sequence File',
                    style: {
                        left: "-6px"
                    }
                }
            },
            {
                xtype: 'menuitem',
                identifier: 'exportToFileMenuItem',
                text: 'Export to File'
            },                                
            /*{ //Move 'Permissions' functionality to inside of 'Properties' window.
                xtype: 'menuitem',
                text: 'Permissions',
                identifier: 'permissionsMenuItem'
            },*/
            {
                xtype: 'menuseparator'
            },
            /*{ //Commented out until we learn what to put in 'Print Setup...'.
            	xtype: 'menuitem',
                text: 'Print Setup...',
                identifier: 'printSetupMenuItem'
            },*/
            {
                xtype: 'menuitem',
                text: 'Print',
                menu: {
                    xtype: 'menu',
                    width: 120,
                    items: [{
                        xtype: 'menuitem',
                        identifier: 'printSequenceViewMenuItem',
                        text: 'Sequence'
                    }, {
                        xtype: 'menuitem',
                        identifier: 'printCircularViewMenuItem',
                        text: 'Circular View'
                    }, {
                        xtype: 'menuitem',
                        identifier: 'printLinearViewMenuItem',
                        text: 'Linear View'
                    }]
                }
            },
            /*{
                xtype: 'menuseparator'
            },
            {
            	xtype: 'menuitem',
                text: 'Properties...',
                identifier: 'propertiesMenuItem'
            }*/]
         }
     },
    {
        xtype: 'button',
        text: 'Edit',
        menu: {
            xtype: 'menu',
            minWidth: 150,
            items: [{
                xtype: 'menuitem',
                identifier: 'cutMenuItem',
                text: 'Cut'
            }, {
                xtype: 'menuitem',
                identifier: 'copyMenuItem',
                text: 'Copy'
            }, {
                xtype: 'menuitem',
                identifier: 'pasteMenuItem',
                text: 'Paste'
            }, {
                xtype: 'menuseparator'
            }, {
                xtype: 'menuitem',
                identifier: 'undoMenuItem',
                text: 'Undo'
            }, {
                xtype: 'menuitem',
                identifier: 'redoMenuItem',
                text: 'Redo'
            }, {
                xtype: 'menuseparator'
            }, {
                xtype: 'menucheckitem',
                identifier: 'safeEditingMenuItem',
                text: 'Safe Editing',
                checked: true
            }, {
                xtype: 'menuseparator'
            }, {
                xtype: 'menuitem',
                identifier: 'findMenuItem',
                text: 'Find...'
            }, {
                xtype: 'menuitem',
                identifier: 'gotoMenuItem',
                text: 'Go To...'
            }, {
                xtype: 'menuseparator'
            }, {
                xtype: 'menuitem',
                identifier: 'selectMenuItem',
                text: 'Select...'
            }, {
                xtype: 'menuitem',
                identifier: 'selectAllMenuItem',
                text: 'Select All'
            }, {
                xtype: 'menuitem',
                identifier: 'selectInverseMenuItem',
                text: 'Select Inverse'
            }, {
                xtype: 'menuseparator'
            }, {
                xtype: 'menucheckitem',
                identifier: 'sequenceLinearMenuItem',
                text: 'Sequence Linear'
            }, {
                xtype: 'menuseparator'
            }, {
                xtype: 'menuitem',
                identifier: 'reverseComplementMenuItem',
                text: 'Reverse Complement Entire Sequence'
            },
            {
                xtype: 'menuitem',
                identifier: 'rebaseMenuItem',
                text: 'Rotate to Here'
            }/*,{
                xtype: 'menuseparator'
            },
            {
                xtype: 'menuitem',
                identifier: 'createNewFeatureMenuItem',
                text: 'Annotate as new Sequence Feature',
                disabled: true
            }*/
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
                identifier: 'circularViewMenuItem',
                text: 'Circular',
                checked: true,
                //group: 'lineType'
            }, {
                xtype: 'menucheckitem',
                identifier: 'linearViewMenuItem',
                text: 'Linear',
                checked: false,
                //group: 'lineType'
            }, {
                xtype: 'menuseparator'
            }, {
                xtype: 'menucheckitem',
                identifier: 'mapCaretMenuItem',
                text: 'Map Caret',
                checked: true
            }, {
                xtype: 'menucheckitem',
                identifier: 'featuresMenuItem',
                text: 'Features',
                checked: true
            }, {
                xtype: 'menucheckitem',
                identifier: 'cutSitesMenuItem',
                text: 'Cut Sites'
            }, {
                xtype: 'menucheckitem',
                identifier: 'orfsMenuItem',
                text: 'ORF'
            }, {
                xtype: 'menuseparator'
            }, {
                xtype: 'menucheckitem',
                identifier: 'showComplementaryMenuItem',
                text: 'Complementary',
                checked: true
            }, {
                xtype: 'menucheckitem',
                identifier: 'showSpacesMenuItem',
                text: 'Spaces',
                checked: true
            }, {
                xtype: 'menucheckitem',
                identifier: 'showSequenceAAMenuItem',
                text: 'Sequence AA'
            }, {
                xtype: 'menucheckitem',
                identifier: 'showRevcomAAMenuItem',
                text: 'Revcom AA'
            }, {
                xtype: 'menuseparator'
            }, {
                xtype: 'menucheckitem',
                identifier: 'featureLabelsMenuItem',
                text: 'Feature Labels',
                checked: true
            }, {
                xtype: 'menucheckitem',
                identifier: 'cutSiteLabelsMenuItem',
                text: 'Cut Site Labels',
                checked: true
            }, {
                xtype: 'menuitem',
                identifier: 'zoomInMenuItem',
                hideOnClick: false,
                text: 'Zoom In (+)'
            }, {
                xtype: 'menuitem',
                identifier: 'zoomOutMenuItem',
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
             
            {
                xtype: 'menuitem',
                identifier: 'restrictionEnzymesManagerMenuItem',
                text: 'Restriction Enzymes Manager'
            },
            {
                xtype: 'menuitem',
                identifier: 'simulateDigestionMenuItem',
                text: 'Simulate Digestion'
            }
//            {
//                xtype: 'menuitem',
//                text: 'Properties'
//            }, {
//                xtype: 'menuseparator'
//            }, {
//                xtype: 'menuitem',
//                text: 'Preferences'
//            },
            ]
        }
    }
    ]
});
