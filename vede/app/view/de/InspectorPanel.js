/**
 * Device Editor Inspector panel
 * @class Vede.view.de.InspectorPanel
 */
Ext.define('Vede.view.de.InspectorPanel', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.InspectorPanel',

    cls: 'InspectorPanel',

    activeTab: 1,
    animCollapse: false,
    dock: 'right',
    floatable: true,
    frame: true,
    minWidth: 350,
    bodyBorder: false,
    collapseDirection: 'right',
    collapsible: true,
    frameHeader: false,
    hideCollapseTool: false,
    overlapHeader: false,
    plain: false,
    title: 'Inspector',
    titleCollapse: false,
    removePanelHeader: false,
    resizable: true,
    width: 100,
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
                    text : 'Open Part Library',
                    cls: 'changeSequenceBtn'
                },
                {
                    xtype: 'button',
                    text : 'Change Part Definition',
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
                    autoScroll: true,
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
                            rowLines: true,
                            minHeight: 180,
                            maxHeight: 180,
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
                            margin: '5 5 5 5',
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
                type: 'auto'
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
                            height:132,
                            minHeight:132,
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
                                    },
                                    renderer: function (value, meta, record) {
                                    meta.tdAttr = 'data-qtip="' + value + '"';
                                    return value;
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
                                            metadata.tdAttr = 'data-qtip="' + record.parts().getRange()[0].get("fas") + '"';
                                            return record.parts().getRange()[0].get("fas");
                                        } else {
                                            metadata.tdAttr = 'data-qtip="' + value + '"';
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
                        }
                    ]
                },
                {
                    xtype: 'form',
                    flex: 1,
                    title: 'Column Content',
                    items: [
                        {
                            xtype: 'displayfield',
                            cls: 'columnContentDisplayField',
                            margin: 10,
                            fieldLabel: '',
                        }
                    ]
                }
            ]
        }
    ]
}


);
