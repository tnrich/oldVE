Ext.define('Vede.view.ve.VectorEditorMainMenuBar', {
    extend: 'Ext.toolbar.Toolbar',
    id: 'VectorEditorMainMenuBar',
    alias: 'widget.VectorEditorMainMenuBar',
    items: [{
        xtype: 'button',
        text: 'File',
        menu: {
            xtype: 'menu',
            minWidth: 140,
            items: [{
                xtype: 'menuitem',
                id: 'importMenuItem',
                text: 'Import from File'
            }, {
                xtype: 'menuitem',
                text: 'Download Genbank',
                id: 'downloadGenbankMenuItem'
            }, {
                xtype: 'menuseparator'
            }, {
                xtype: 'menuitem',
                text: 'Project Properties'
            }, {
                xtype: 'menuitem',
                text: 'Print',
                menu: {
                    xtype: 'menu',
                    width: 120,
                    items: [{
                        xtype: 'menuitem',
                        text: 'Sequence'
                    }, {
                        xtype: 'menuitem',
                        text: 'Circular View'
                    }, {
                        xtype: 'menuitem',
                        text: 'Linear View'
                    }]
                }
            }

            ]
        }
    }, {
        xtype: 'button',
        text: 'Edit',
        menu: {
            xtype: 'menu',
            minWidth: 150,
            items: [{
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
                xtype: 'menuitem',
                text: 'Copy'
            }, {
                xtype: 'menuitem',
                text: 'Cut'
            }, {
                xtype: 'menuitem',
                text: 'Paste'
            }, {
                xtype: 'menuseparator'
            }, {
                xtype: 'menuitem',
                id: 'findMenuItem',
                text: 'Find...'
            }, {
                xtype: 'menuitem',
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
                text: 'Reverse Complement'
            }, {
                xtype: 'menuitem',
                id: 'rebaseMenuItem',
                text: 'Rotate to Here'
            }]
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
            }]
        }
    }, {
        xtype: 'button',
        text: 'Tools',
        menu: {
            xtype: 'menu',
            minWidth: 140,
            items: [{
                xtype: 'menuitem',
                text: 'Create New Feature'
            }, {
                xtype: 'menuitem',
                id: 'restrictionEnzymesManagerMenuItem',
                text: 'Restriction Enzymes Manager'
            }, {
                xtype: 'menuitem',
                id: 'simulateDigestionMenuItem',
                text: 'Simulate Digestion'
            }, {
                xtype: 'menuitem',
                text: 'Properties'
            }, {
                xtype: 'menuseparator'
            }, {
                xtype: 'menuitem',
                text: 'Preferences'
            }]
        }
    }, {
        xtype: 'button',
        text: 'Help',
        menu: {
            xtype: 'menu',
            minWidth: 140,
            items: [{
                xtype: 'menuitem',
                text: 'Suggest Feature'
            }, {
                xtype: 'menuitem',
                text: 'Report Bug'
            }, {
                xtype: 'menuseparator'
            }, {
                xtype: 'menuitem',
                text: 'About'
            }]
        }
    }, {
        xtype: 'tbfill'
    }, {
        xtype: 'button',
        text: 'Save changes',
        cls: 'saveSequenceBtn',
        hidden: true
    }]
});