Ext.define('Vede.view.de.InspectorPanel', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.InspectorPanel',


    dock: 'right',
    floating: false,
    frame: true,
    cls: 'InspectorPanel',
    margin: '10 0 10 0',
    minWidth: 350,
    width: 100,
    bodyBorder: false,
    animCollapse: false,
    collapseDirection: 'right',
    collapsed: false,
    collapsible: true,
    frameHeader: false,
    hideCollapseTool: false,
    overlapHeader: false,
    title: 'Inspector',
    titleCollapse: false,
    activeTab: 0,
    plain: false,
    removePanelHeader: false,
    layout: {
        deferredRender: false,
        type: 'card'
    },
    items: [
        {
            xtype: 'panel',
            layout: {
                align: 'stretch',
                type: 'vbox'
            },
            preventHeader: true,
            title: 'Part Info',
            items: [
                {
                    xtype: 'form',
                    flex: 1,
                    cls: 'PartPropertiesForm',
                    width: 287,
                    layout: {
                        align: 'stretch',
                        type: 'vbox'
                    },
                    bodyPadding: 10,
                    title: 'Properties',
                    items: [
                        {
                            xtype: 'textfield',
                            cls: 'partNameField',
                            fieldLabel: 'Part Name'
                        },
                        {
                            xtype: 'displayfield',
                            height: 20,
                            cls: 'partSourceField',
                            fieldLabel: 'Part Source'
                        },
                        {
                            xtype: 'displayfield',
                            height: 20,
                            cls: 'reverseComplementField',
                            fieldLabel: 'Reverse Complement',
                            labelWidth: 160
                        },
                        {
                            xtype: 'displayfield',
                            height: 20,
                            cls: 'startBPField',
                            fieldLabel: 'Start BP'
                        },
                        {
                            xtype: 'displayfield',
                            height: 20,
                            cls: 'stopBPField',
                            fieldLabel: 'End BP'
                        }
                    ]
                },
                {
                    xtype: 'form',
                    flex: 1,
                    maxHeight: 80,
                    bodyPadding: 10,
                    title: 'Forced Assembly Strategy',
                    items: [
                        {
                            xtype: 'combobox',
                            anchor: '100%'
                        }
                    ]
                },
                {
                    xtype: 'form',
                    flex: 1,
                    bodyPadding: 10,
                    title: 'Eugene Rules',
                    dockedItems: [
                        {
                            xtype: 'button',
                            dock: 'top',
                            text: 'Add Rule'
                        },
                        {
                            xtype: 'button',
                            dock: 'top',
                            text: 'List'
                        }
                    ]
                }
            ]
        },
        {
            xtype: 'panel',
            layout: {
                type: 'fit'
            },
            title: 'Collection Info',
            items: [
                {
                    xtype: 'form',
                    cls: 'collectionInfoForm',
                    bodyBorder: false,
                    bodyPadding: 10,
                    items: [
                        {
                            xtype: 'displayfield',
                            anchor: '100%',
                            cls: 'j5_ready_field',
                            value: 'Display Field',
                            fieldLabel: 'j5 Ready'
                        },
                        {
                            xtype: 'displayfield',
                            anchor: '100%',
                            cls: 'combinatorial_field',
                            value: 'Display Field',
                            fieldLabel: 'Combinatorial'
                        },
                        {
                            xtype: 'radiogroup',
                            cls: 'plasmid_geometry',
                            fieldLabel: 'Plasmid Type',
                            allowBlank: false,
                            items: [
                                {
                                    xtype: 'radiofield',
                                    cls: 'circular_plasmid_radio',
                                    name: 'plasmidtype',
                                    boxLabel: 'Circular',
                                    checked: true
                                },
                                {
                                    xtype: 'radiofield',
                                    cls: 'linear_plasmid_radio',
                                    name: 'plasmidtype',
                                    boxLabel: 'Linear'
                                }
                            ]
                        },
                        {
                            xtype: 'gridpanel',
                            margin: 10,
                            autoScroll: true,
                            columnLines: true,
                            columns: [
                                {
                                    xtype: 'rownumberer',
                                    width: 50,
                                    text: 'Column'
                                },
                                {
                                    xtype: 'gridcolumn',
                                    text: 'Direction'
                                },
                                {
                                    xtype: 'numbercolumn',
                                    text: 'Items'
                                },
                                {
                                    xtype: 'gridcolumn',
                                    text: 'FAS'
                                },
                                {
                                    xtype: 'booleancolumn',
                                    text: 'DSF'
                                },
                                {
                                    xtype: 'gridcolumn',
                                    text: 'FRO'
                                },
                                {
                                    xtype: 'numbercolumn',
                                    text: '5\' Ex'
                                },
                                {
                                    xtype: 'numbercolumn',
                                    text: '3\' Ex'
                                }
                            ],
                            viewConfig: {

                            }
                        },
                        {
                            xtype: 'container',
                            cls: 'inspector_containerActions',
                            margin: 10,
                            items: [
                                {
                                    xtype: 'button',
                                    text: 'Add Column'
                                },
                                {
                                    xtype: 'button',
                                    width: 100,
                                    text: 'Remove Column'
                                }
                            ]
                        },
                        {
                            xtype: 'textfield',
                            anchor: '100%',
                            height: 200,
                            margin: 10,
                            width: 269,
                            fieldLabel: 'Column Content',
                            labelAlign: 'top'
                        }
                    ]
                }
            ]
        }]
}


);
