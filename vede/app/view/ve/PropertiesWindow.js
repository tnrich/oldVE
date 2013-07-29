Ext.define('Vede.view.ve.PropertiesWindow', {
    extend: 'Ext.window.Window',
    requires: ["Teselagen.manager.ProjectManager"],
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
                                    maxWidth: 400,
                                    allowBlank: false
                                }, {
                                    xtype: 'textareafield',
                                    cls: 'propertiesWindowDescriptionArea',
                                    fieldLabel: 'Description',
                                    maxWidth: 400,
                                    height: 100
                                }, {
                                    xtype: 'displayfield',
                                    cls: 'propertiesWindowOwnerField',
                                    fieldLabel: 'Owner'
                                }, {
                                    xtype: 'displayfield',
                                    cls: 'propertiesWindowCreatedField',
                                    fieldLabel: 'Created'
                                }, {
                                    xtype: 'displayfield',
                                    cls: 'propertiesWindowLastModifiedField',
                                    fieldLabel: 'Last Modified'
                                },
                                // {
                                //     xtype: 'gridpanel',
                                //     forceFit: true,
                                //     id: 'propertiesWindowPermissionsGrid',
                                    
                                // }
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
                                    emptyText: 'Enter Name or Type',
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
                                                            return '+'
                                                        } else { return '-' }
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
                                            xtype: 'gridpanel',
                                            cls: 'cutSitesGridPanel',
                                            maxWidth: 470,
                                            minHeight: 200,
                                            columns: [
                                                {
                                                    xtype: 'gridcolumn',
                                                    cls: 'cutSitesNameColumn',
                                                    text: 'Name',
                                                    width: 200
                                                },
                                                {
                                                    xtype: 'gridcolumn',
                                                    cls: 'cutSites#CutsColumn',
                                                    text: '# Cuts',
                                                },
                                                {
                                                    xtype: 'gridcolumn',
                                                    cls: 'cutSitesPositionColumn',
                                                    text: 'Position',
                                                },
                                                {
                                                    xtype: 'gridcolumn',
                                                    cls: 'cutSitesStrandColumn',
                                                    text: 'Strand',
                                                }
                                            ]
                                        },
                                        {
                                            xtype: 'displayfield',
                                            cls: 'maxCutOffsField',
                                            fieldLabel: 'Max Cut Offs',
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
                                            maxWidth: 470,
                                            minHeight: 200,
                                            columns: [
                                                {
                                                    xtype: 'gridcolumn',
                                                    cls: 'ORFsPositionColumn',
                                                    text: 'Position',
                                                    width: 200
                                                },
                                                {
                                                    xtype: 'gridcolumn',
                                                    cls: 'ORFsLengthColumn',
                                                    text: 'Length',
                                                },
                                                {
                                                    xtype: 'gridcolumn',
                                                    cls: 'ORFsStrandColumn',
                                                    text: 'Strand',
                                                },
                                                {
                                                    xtype: 'gridcolumn',
                                                    cls: 'ORFsFrameColumn',
                                                    text: 'Frame',
                                                }
                                            ]
                                        },
                                        {
                                            xtype: 'displayfield',
                                            cls: 'minORFLengthField',
                                            fieldLabel: 'Minimun ORF Length',
                                            labelWidth: 200,
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
                    margins: '0 0 0 400',
                    items: [
                        {
                            xtype: 'button',
                            cls: 'propertiesWindowOKButton',
                            text: 'Ok', 
                            margin: '4 2 2 2',
                            padding: 2                                   
                        }, {
                            xtype: 'button',
                            text: 'Cancel',
                            margin: '4 2 2 2',
                            padding: 2,
                            handler: function() {
                                me.close();
                            }
                        }
                    ]
                }
	        ]
    	});
    	me.callParent(arguments);
    }
});
