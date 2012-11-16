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
                    overflowY: 'auto',
                    bodyPadding: 10,
                    title: 'Properties',
                    items: [
                        {
                            xtype: 'textfield',
                            cls: 'partNameField',
                            name: "name",
                            fieldLabel: 'Part Name',
                            enableKeyEvents: true
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
                            name: 'revComp',
                            fieldLabel: 'Reverse Complement',
                            labelWidth: 160
                        },
                        {
                            xtype: 'displayfield',
                            height: 20,
                            cls: 'startBPField',
                            name: 'genbankStartBP',
                            fieldLabel: 'Start BP'
                        },
                        {
                            xtype: 'displayfield',
                            height: 20,
                            cls: 'stopBPField',
                            name: 'endBP',
                            fieldLabel: 'End BP'
                        }
                    ]
                },
                {
                    xtype: 'form',
                    cls: 'forcedAssemblyStrategyForm',
                    flex: 1,
                    maxHeight: 80,
                    bodyPadding: 10,
                    title: 'Forced Assembly Strategy',
                    items: [
                        {
                            xtype: 'combobox',
                            cls: 'forcedAssemblyComboBox',
                            name: 'fas',
                            anchor: '100%',
                            store: ['None', 'DIGEST', 'Direct Synthesis', 'PCR',
                                    'Embed_in_primer_reverse',
                                    'Embed_in_primer_forward', 'Annealed Oligos']
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
                    overflowY: 'auto',
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
                            cls: 'inspectorGrid',
                            margin: 10,
                            autoScroll: true,
                            columnLines: true,
                            selType: 'cellmodel',
                            plugins: [
                                Ext.create('Ext.grid.plugin.CellEditing', {
                                    clicksToEdit: 2
                                })
                            ],
                            columns: [
                                {
                                    xtype: 'gridcolumn',
                                    width: 100,
                                    text: 'Column',
                                    dataIndex: 'binName',
                                    editor: {
                                        xtype: 'textfield',
                                        allowBlank: false
                                    }
                                },
                                {
                                    xtype: 'gridcolumn',
                                    text: 'Direction',
                                    dataIndex: 'directionForward',
                                    renderer: function(forward) {
                                        if(forward) {
                                            return "Forward";
                                        } else {
                                            return "Reverse";
                                        }
                                    }
                                },
                                {
                                    xtype: 'numbercolumn',
                                    text: 'Items',
                                    renderer: function(value, metadata, record) {
                                        return record.parts().getRange().length;
                                    }
                                },
                                {
                                    xtype: 'gridcolumn',
                                    text: 'FAS',
                                    dataIndex: 'fas'
                                },
                                {
                                    xtype: 'booleancolumn',
                                    text: 'DSF',
                                    dataIndex: 'dsf'
                                },
                                {
                                    xtype: 'gridcolumn',
                                    text: 'FRO',
                                    dataIndex: 'fro'
                                },
                                {
                                    xtype: 'numbercolumn',
                                    text: '5\' Ex',
                                    dataIndex: 'extra5PrimeBps'
                                },
                                {
                                    xtype: 'numbercolumn',
                                    text: '3\' Ex',
                                    dataIndex: 'extra3PrimeBps'
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
                                    cls: 'inspectorAddColumnBtn',
                                    text: 'Add Column'
                                },
                                {
                                    xtype: 'button',
                                    cls: 'inspectorRemoveColumnBtn',
                                    width: 130,
                                    text: 'Remove Column'
                                }
                            ]
                        },
                        {
                            xtype: 'displayfield',
                            cls: 'columnContentDisplayField',
                            margin: 10,
                            fieldLabel: 'Column Content',
                            labelAlign: 'top'
                        }
                    ]
                }
            ]
        }]
}


);
