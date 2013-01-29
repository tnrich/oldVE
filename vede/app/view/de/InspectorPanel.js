/**
 * Device Editor Inspector panel
 * @class Vede.view.de.InspectorPanel
 */
Ext.define('Vede.view.de.InspectorPanel', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.InspectorPanel',

    dock: 'right',
    floatable: true,
    frame: true,
    cls: 'InspectorPanel',
    resizable: true,
    margin: '0 0 10 0',
    minWidth: 350,
    width: 100,
    bodyBorder: false,
    animCollapse: false,
    collapseDirection: 'right',
    collapsed: true,
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
            autoScroll: true,
            items: [
                /*
                {
                    xtype: 'tbseparator',
                    height: 20
                },
                */
                {
                    xtype: 'button',
                    text : 'Map empty sequence',
                    cls: 'emptySequenceBtn'
                },
                {
                    xtype: 'button',
                    text : 'Map sequence',
                    cls: 'changeSequenceBtn'
                },
                {
                    xtype: 'button',
                    text : 'Change part definition',
                    cls: 'changePartDefinitionBtn'
                },
                /*
                {
                    xtype: 'tbseparator',
                    height: 20
                },
                */
                {
                    xtype: 'form',
                    flex: 1,
                    cls: 'PartPropertiesForm',
                    width: 287,
                    layout: {
                        align: 'stretch',
                        type: 'vbox'
                    },
                    minHeight: 150,
                    maxHeight: 150,
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
                    minHeight: 80,
                    maxHeight: 80,
                    bodyPadding: 10,
                    title: 'Forced Assembly Strategy',
                    items: [
                        {
                            xtype: 'combobox',
                            cls: 'forcedAssemblyComboBox',
                            name: 'fas',
                            queryMode: 'local',
                            anchor: '100%',
                            store: ['None', 'DIGEST', 'Direct Synthesis', 'PCR',
                                    'Embed_in_primer_reverse',
                                    'Embed_in_primer_forward', 'Annealed Oligos'],
                            value: 'None'
                        }
                    ]
                },
                {
                    xtype: 'form',
                    cls: 'eugeneRulesForm',
                    flex: 1,
                    minHeight: 180,
                    bodyPadding: 10,
                    title: 'Eugene Rules',
                    items: [
                        {
                            xtype: 'gridpanel',
                            cls: 'eugeneRulesGrid',
                            viewConfig: {
                                markDirty: false
                            },
                            plugins: {
                                ptype: 'rowediting',
                                clicksToEdit: 2
                            },
                            columnLines: true,
                            minHeight: 100,
                            maxHeight: 160,
                            columns: [
                                {
                                    xtype: 'gridcolumn',
                                    width: 100,
                                    text: 'Name',
                                    dataIndex: 'name',
                                    editor: {
                                        xtype: 'textfield',
                                        allowBlank: false
                                    }
                                },
                                {
                                    xtype: 'gridcolumn',
                                    text: 'Operand 1',
                                    dataIndex: 'operand1_id',
                                    renderer: function(id, metaData, rule) {
                                        return rule.getOperand1().get("name");
                                    }
                                },
                                {
                                    xtype: 'booleancolumn',
                                    text: 'Negated?',
                                    dataIndex: 'negationOperator',
                                    trueText: 'Yes',
                                    falseText: 'No',
                                    editor: {
                                        xtype: 'checkbox'
                                    }
                                },
                                {
                                    xtype: 'gridcolumn',
                                    text: 'Operator',
                                    dataIndex: 'compositionalOperator',
                                    editor: {
                                        xtype: 'combobox',
                                        store: Teselagen.constants.Constants.COMPOP_LIST
                                    }
                                },
                                {
                                    xtype: 'gridcolumn',
                                    text: 'Operand 2',
                                    dataIndex: 'operand2_id',
                                    renderer: function(id, metaData, rule) {
                                        if(rule.get("operand2isNumber")) {
                                            return rule.get("operand2Number");
                                        } else {
                                            return rule.getOperand2().get("name");
                                        }
                                    }
                                }
                            ]
                        },
                        {
                            xtype: 'container',
                            layout: {
                                type: 'hbox'
                            },
                            items: [
                                {
                                    xtype: 'button',
                                    cls: 'addEugeneRuleBtn',
                                    text: 'Add Rule'
                                },
                                {
                                    xtype: 'button',
                                    cls: 'deleteEugeneRuleBtn',
                                    text: 'Delete Rule',
                                }
                            ]
                        }
                    ],
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
                            viewConfig: {
                                markDirty: false
                            },
                            autoScroll: true,
                            columnLines: true,
                            height:200,
                            minHeight:200,
                            plugins: {
                                ptype: 'rowediting',
                                clicksToEdit: 2,
                                errorSummary: false
                            },
                            columns: [
                                {
                                    xtype: 'gridcolumn',
                                    width: 100,
                                    text: 'Column Name',
                                    dataIndex: 'binName',
                                    editor: {
                                        xtype: 'textfield',
                                        allowBlank: false,
                                    }
                                },
                                {
                                    xtype: 'gridcolumn',
                                    text: 'Direction',
                                    dataIndex: 'directionForward',
                                    editor: {
                                        xtype: 'combobox',
                                        store: [[true, "Forward"], [false, "Reverse"]]
                                    },
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
                                    dataIndex: 'fas',
                                    renderer: function(value, metadata, record) {
                                        if(record.parts().getRange().length > 0) {
                                            return record.parts().getRange()[0].get("fas");
                                        } else {
                                            return value;
                                        }
                                    }
                                },
                                {
                                    xtype: 'booleancolumn',
                                    text: 'DSF',
                                    dataIndex: 'dsf',
                                    editor: {
                                        xtype: 'checkbox'
                                    }
                                },
                                {
                                    xtype: 'gridcolumn',
                                    text: 'FRO',
                                    dataIndex: 'fro',
                                    editor: {
                                        xtype: 'textfield',
                                    },
                                    renderer: function(value) {
                                        if(value === 'None') {
                                            return '';
                                        } else {
                                            return value;
                                        }
                                    }
                                },
                                {
                                    xtype: 'numbercolumn',
                                    text: '5\' Ex',
                                    dataIndex: 'extra5PrimeBps',
                                    editor: {
                                        xtype: 'numberfield',
                                        allowDecimals: false,
                                        decimalPrecision: 1,
                                        emptyText: '',
                                        hideTrigger: true
                                    },
                                    renderer: Ext.util.Format.numberRenderer('0')
                                },
                                {
                                    xtype: 'numbercolumn',
                                    text: '3\' Ex',
                                    dataIndex: 'extra3PrimeBps',
                                    editor: {
                                        xtype: 'numberfield',
                                        allowDecimals: false,
                                        decimalPrecision: 1,
                                        emptyText: '',
                                        hideTrigger: true
                                    },
                                    renderer: Ext.util.Format.numberRenderer('0')
                                }
                            ],
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
