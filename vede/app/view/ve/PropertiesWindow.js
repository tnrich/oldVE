Ext.define('Vede.view.ve.PropertiesWindow', {
    extend: 'Ext.window.Window',
    requires: ['Teselagen.manager.ProjectManager'],
    title: 'Properties',
    cls: 'PropertiesWindow',
    modal: true,
    layout: {
        type: 'vbox'
    },
    width: 500,
    resizable: false,
    initComponent: function() {
        var me = this;
        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'tabpanel',
                    width: 500,
                    items: [
                        {
                            xtype: 'panel',
                            cls: 'propertiesGeneral',
                            title: 'General',
                            layout: {
                                align: 'stretch',
                                type: 'vbox'
                            },
                            margins: '5 5 5 10',
                            items: [
                                {
                                    xtype: 'textfield',
                                    cls: 'propertiesWindowSequenceNameField',
                                    fieldLabel: 'Sequence Name',
                                    labelAlign: 'right',
                                    maxWidth: 400,
                                    allowBlank: false
                                }, {
                                    xtype: 'textareafield',
                                    cls: 'propertiesWindowDescriptionArea',
                                    fieldLabel: 'Description',
                                    labelAlign: 'right',
                                    maxWidth: 400,
                                    height: 100
                                }, {
                                    xtype: 'displayfield',
                                    cls: 'propertiesWindowOwnerField',
                                    fieldLabel: 'Owner',
                                    labelAlign: 'right'
                                }, {
                                    xtype: 'displayfield',
                                    cls: 'propertiesWindowCreatedField',
                                    fieldLabel: 'Created',
                                    labelAlign: 'right'
                                }, {
                                    xtype: 'displayfield',
                                    cls: 'propertiesWindowLastModifiedField',
                                    fieldLabel: 'Last Modified',
                                    labelAlign: 'right'
                                }
                            ]
                        },
                        {
                            xtype: 'panel',
                            cls: 'propertiesFeatures',
                            title: 'Features',
                            layout: {
                                align: 'stretch',
                                type: 'vbox'
                            },
                            margins: '5 5 5 10',
                            items: [
                                {
                                    xtype: 'textfield',
                                    cls: 'featureSearchField',
                                    emptyText: 'Search by Name or Type',
                                    enableKeyEvents: true,
                                    maxWidth: 300
                                },
                                {
                                    xtype: 'container',
                                    layout: {
                                        type: 'hbox'
                                    },
                                    items: [
                                        {
                                            xtype: 'gridpanel',
                                            cls: 'featuresGridPanel',
                                            name: 'featuresGridPanel',
                                            width: 400,
                                            minHeight: 200,
                                            maxHeight: 360,
                                            columns: [
                                                {
                                                    xtype: 'gridcolumn',
                                                    cls: 'featuresNameColumn',
                                                    dataIndex: 'name',
                                                    text: 'Name',
                                                    width: 150
                                                },
                                                {
                                                    xtype: 'gridcolumn',
                                                    cls: 'featuresTypeColumn',
                                                    dataIndex: 'type',
                                                    text: 'Type',
                                                },
                                                {
                                                    xtype: 'gridcolumn',
                                                    cls: 'featuresPositionColumn',
                                                    dataIndex: 'locations',
                                                    text: 'Position',
                                                },
                                                {
                                                    xtype: 'gridcolumn',
                                                    cls: 'featuresStrandColumn',
                                                    dataIndex: 'strand',
                                                    text: 'Strand',
                                                    width: 50,
                                                    renderer: function (value) {
                                                        if (value > 0) {
                                                            return '+';
                                                        } else { return '-'; }
                                                    }
                                                }
                                            ]
                                        },
                                        {
                                            xtype: 'container',
                                            layout: {
                                                type: 'vbox',
                                            },
                                            margins: '0 10 0 5',
                                            items: [
                                                {
                                                    xtype: 'button',
                                                    cls: 'featuresNewButton',
                                                    text: 'New',
                                                    width: 70,
                                                    margins: '0 0 5 0',
                                                    handler: function () {
                                                        Vede.application.fireEvent('newFeatureinProperties');
                                                    }
                                                },
                                                {
                                                    xtype: 'button',
                                                    cls: 'featuresEditButton',
                                                    text: 'Edit',
                                                    width: 70,
                                                    margins: '0 0 5 0',
                                                    disabled: true,
                                                    handler: function () {
                                                        Vede.application.fireEvent('editFeatureinProperties');
                                                    }
                                                },
                                                {
                                                    xtype: 'button',
                                                    cls: 'featuresRemoveButton',
                                                    text: 'Remove',
                                                    width: 70,
                                                    disabled: true,
                                                    handler: function () {
                                                        Vede.application.fireEvent('removeFeatureinProperties');
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
                            cls: 'propertiesCutSites',
                            title: 'CutSites',
                            layout: {
                                align: 'stretch',
                                type: 'vbox'
                            },
                            margins: '5 5 5 10',
                            items: [
                                {
                                    xtype: 'container',
                                    layout: {
                                        align: 'stretch',
                                        type: 'vbox'
                                    },
                                    items: [
                                        {
                                            xtype: 'container',
                                            layout: {
                                                align: 'stretch',
                                                type: 'hbox'
                                            },
                                            items: [
                                                {
                                                    xtype: 'button',
                                                    cls: 'expandAllCutSites',
                                                    text: 'Expand All',
                                                    margins: '0 5 5 0',
                                                    handler: function () {
                                                        Vede.application.fireEvent('expandAllCutSites');
                                                    }
                                                },
                                                {
                                                    xtype: 'button',
                                                    cls: 'collapseAllCutSites',
                                                    text: 'Collapse All',
                                                    disabled: true,
                                                    margins: '0 0 5 0',
                                                    handler: function () {
                                                        Vede.application.fireEvent('collapseAllCutSites');
                                                    }
                                                },
                                            ]
                                        },
                                        {
                                            xtype: 'gridpanel',
                                            cls: 'cutSitesGridPanel',
                                            name: 'cutSitesGridPanel',
                                            viewConfig: {
                                                getRowClass: function(record, rowIndex, rowParams, store) {
                                                    if (record.data.numCuts) {
                                                        var expanded = Vede.application.fireEvent('setRestrictionEnzymeRowCls', record, rowIndex, store);
                                                        if (expanded) {
                                                            return 'restrictionEnzymeExpandedCls';
                                                        } else {
                                                            return 'restrictionEnzymeCollapsedCls';
                                                        }
                                                    } else {
                                                        return 'cutSiteCls';
                                                    }
                                                }
                                            },
                                            maxWidth: 470,
                                            minHeight: 200,
                                            maxHeight: 320,
                                            columns: [
                                                {
                                                    xtype: 'gridcolumn',
                                                    cls: 'cutSitesNameColumn',
                                                    dataIndex: 'name',
                                                    text: 'Name',
                                                    width: 200
                                                },
                                                {
                                                    xtype: 'gridcolumn',
                                                    cls: 'cutSitesNumCutsColumn',
                                                    dataIndex: 'numCuts',
                                                    text: '# Cuts',
                                                    maxWidth: 50
                                                },
                                                {
                                                    xtype: 'gridcolumn',
                                                    cls: 'cutSitesPositionColumn',
                                                    dataIndex: 'position',
                                                    text: 'Position',
                                                    width: 170
                                                },
                                                {
                                                    xtype: 'gridcolumn',
                                                    cls: 'cutSitesStrandColumn',
                                                    dataIndex: 'strand',
                                                    text: 'Strand',
                                                    maxWidth: 50,
                                                    renderer: function (value) {
                                                        if (value > 0) {
                                                            return '+';
                                                        } else if (value < 0) {
                                                            return '-';
                                                        } else { return null;}
                                                    }
                                                }
                                            ]
                                        },
                                        {
                                            xtype: 'displayfield',
                                            cls: 'maxCutOffsField',
                                            value: '<b>unlimited</b>',
                                            fieldLabel: 'Max Cut Offs',
                                            labelWidth: 80,
                                            margins: '10 0 5 0'
                                        },
                                        {
                                            xtype: 'container',
                                            layout: {
                                                align: 'stretch',
                                                type: 'hbox'
                                            },
                                            items: [
                                                {
                                                    xtype: 'label',
                                                    text: 'Adjust Max Cut Offs in',
                                                    margins: '0 5 15 0'
                                                },
                                                {
                                                    xtype: 'label',
                                                    cls: 'linktoPreferences',
                                                    text: 'Preferences',
                                                    style: {
                                                        color: 'blue'
                                                    },
                                                    listeners: {
                                                        render: function(c){
                                                            c.getEl().on('click', function(){
                                                                me.close();
                                                                Vede.application.fireEvent('preferencesLinkClick');
                                                            }, c);
                                                        }
                                                    }
                                                }
                                            ]

                                        },
                                        {
                                            xtype: 'label',
                                            cls: 'linktoRestrictionEnzymesManager',
                                            text: 'Manage Restriction Enzymes',
                                            style: {
                                                color: 'blue'
                                            },
                                            margins: '0 0 10 0',
                                            listeners: {
                                                render: function(c){
                                                    c.getEl().on('click', function(){
                                                        me.close();
                                                        Vede.application.fireEvent('restrictionEnzymesManagerLinkClick');
                                                    }, c);
                                                }
                                            }
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            xtype: 'panel',
                            cls: 'propertiesORFs',
                            title: 'ORFs',
                            layout: {
                                align: 'stretch',
                                type: 'vbox'
                            },
                            margins: '5 5 5 10',
                            items: [
                                {
                                    xtype: 'container',
                                    layout: {
                                        align: 'stretch',
                                        type: 'vbox'
                                    },
                                    items: [
                                        {
                                            xtype: 'gridpanel',
                                            cls: 'ORFsGridPanel',
                                            name: 'ORFsGridPanel',
                                            maxWidth: 470,
                                            minHeight: 200,
                                            maxHeight: 320,
                                            columnLines: true,
                                            columns: [
                                                {
                                                    xtype: 'gridcolumn',
                                                    cls: 'ORFsPositionColumn',
                                                    dataIndex: 'position',
                                                    text: 'Position',
                                                    width: 200
                                                },
                                                {
                                                    xtype: 'gridcolumn',
                                                    cls: 'ORFsLengthColumn',
                                                    dataIndex: 'length',
                                                    text: 'Length',
                                                    width: 120,
                                                },
                                                {
                                                    xtype: 'gridcolumn',
                                                    cls: 'ORFsFrameColumn',
                                                    dataIndex: 'frame',
                                                    text: 'Frame',
                                                },
                                                {
                                                    xtype: 'gridcolumn',
                                                    cls: 'ORFsStrandColumn',
                                                    dataIndex: 'strand',
                                                    text: 'Strand',
                                                    maxWidth: 50,
                                                    renderer: function (value) {
                                                        if (value > 0) {
                                                            return '+';
                                                        } else { return '-'; }
                                                    }
                                                }
                                            ]
                                        },
                                        {
                                            xtype: 'displayfield',
                                            cls: 'minORFLengthField',
                                            fieldLabel: 'Minimum ORF Length',
                                            labelWidth: 130,
                                            margins: '10 0 5 0'
                                        },
                                        {
                                            xtype: 'container',
                                            layout: {
                                                align: 'stretch',
                                                type: 'hbox'
                                            },
                                            items: [
                                                {
                                                    xtype: 'label',
                                                    text: 'Adjust minimum ORF length in',
                                                    margins: '0 5 10 0'
                                                },
                                                {
                                                    xtype: 'label',
                                                    cls: 'linktoPreferences',
                                                    text: 'Preferences',
                                                    style: {
                                                        color: 'blue'
                                                    },
                                                    listeners: {
                                                        render: function(c){
                                                            c.getEl().on('click', function(){
                                                                me.close();
                                                                Vede.application.fireEvent('preferencesLinkClick');
                                                            }, c);
                                                        }
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
                            cls: 'propertiesGenBank',
                            title: 'GenBank',
                            layout: {
                                align: 'stretch',
                                type: 'vbox'
                            },
                            margins: '5 5 5 10',
                            items: [
                                {
                                    xtype: 'textareafield',
                                    cls: 'propertiesWindowGenBankData',
                                    maxWidth: 470,
                                    height: 400,
                                    readOnly: true
                                }
                            ]
                        },
                    ]
                },
                {
                    xtype: 'container',
                    layout: {
                        type: 'hbox'
                    },
                    margins: '0 0 0 415',
                    items: [
                        {
                            xtype: 'button',
                            cls: 'propertiesWindowOKButton',
                            text: 'Ok',
                            width: 70,
                            margin: '4 2 2 2',
                            padding: 2
                        }
                    ]
                }
            ]
        });
        me.callParent(arguments);
    }
});
