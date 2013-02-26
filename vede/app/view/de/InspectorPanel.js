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
                {
                    xtype: 'button',
                    text : 'Open Part Library',
                    cls: 'openPartLibraryBtn',
                    overCls: 'openPartLibraryBtn-over',
                    margin: '2.5 0 2.5 0',
                    border: 0
                },
                {
                    xtype: 'button',
                    text : 'Change Part Definition',
                    cls: 'changePartDefinitionBtn',
                    overCls: 'changePartDefinitionBtn-over',
                    margin: '2.5 0 2.5 0',
                    border: 0
                },
                {
                    xtype: 'button',
                    text : 'Delete Part',
                    cls: 'deletePartBtn',
                    overCls: 'deletePartBtn-over',
                    margin: '2.5 0 2.5 0',
                    border: 0
                },
                {
                    xtype: 'form',
                    flex: 1,
                    cls: 'PartPropertiesForm',
                    width: 287,
                    layout: {
                        align: 'stretch',
                        type: 'vbox'
                    },
                    minHeight: 180,
                    maxHeight: 200,
                    bodyPadding: 10,
                    title: 'Properties',
                    items: [
                        {
                            xtype: 'container',
                            cls: 'mapAlert',
                            html: 'Map Part to Edit!',
                            margin: '0 0 10 0',
                            opacity: 0
                        },
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
                            name: "partSource",
                            cls: 'partSourceField',
                            fieldLabel: 'Part Source'
                        },
                        {
                            xtype: 'displayfield',
                            height: 20,
                            cls: 'reverseComplementField',
                            name: 'revComp',
                            fieldLabel: 'Reverse Complement? (on source)',
                            labelWidth: 210
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
                            fieldLabel: 'Stop BP'
                        }
                    ]
                },
                {
                    xtype: 'form',
                    cls: 'forcedAssemblyStrategyForm',
                    flex: 1,
                    minHeight: 70,
                    maxHeight: 70,
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
                            minHeight: 150,
                            maxHeight: 150,
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
                                    text: 'NOT?',
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
                            margin: '10 0 10 0',
                            layout: {
                                type: 'hbox'
                            },
                            items: [
                                {
                                    xtype: 'button',
                                    flex: 1,
                                    cls: 'addEugeneRuleBtn',
                                    overCls: 'addEugeneRuleBtn-over',
                                    border: 0,
                                    text: 'Add Rule'
                                },
                                {
                                    xtype: 'button',
                                    flex: 1,
                                    cls: 'deleteEugeneRuleBtn',
                                    margin: '0 0 0 5',
                                    overCls: 'deleteEugeneRuleBtn-over',
                                    border: 0,
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
                            value: 'false',
                            fieldLabel: 'j5 Ready'
                        },
                        {
                            xtype: 'displayfield',
                            anchor: '100%',
                            cls: 'combinatorial_field',
                            value: 'false',
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
                                    text: '<div data-qtip="Column Name">Column Name</div>',
                                    dataIndex: 'binName',
                                    editor: {
                                        xtype: 'textfield',
                                        allowBlank: false,
                                    },
                                    renderer: function(value, metadata) {
                                        metadata.tdAttr = 'data-qtip="' + value + '"';
                                        return value;
                                    }
                                },
                                {
                                    xtype: 'gridcolumn',
                                    text: '<div data-qtip="Direction">Direction</div>',
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
                                    text: '<div data-qtip="Items">Items</div>',
                                    renderer: function(value, metadata, record) {
                                        return record.parts().getRange().length;
                                    }
                                },
                                {
                                    xtype: 'gridcolumn',
                                    text: '<div data-qtip="Forced Assembly Strategy">FAS</div>',
                                    dataIndex: 'fas',
                                    renderer: function(value, metadata, record) {
                                        metadata.tdAttr = 'data-qtip="' + value + '"';

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
                                    text: '<div data-qtip="Direct Synthesis Firewall">DSF</div>',
                                    dataIndex: 'dsf',
                                    editor: {
                                        xtype: 'checkbox'
                                    }
                                },
                                {
                                    xtype: 'gridcolumn',
                                    text: '<div data-qtip="Forced Relative Overhang">FRO</div>',
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
                                    text: '<div data-qtip="5\' Extra CPEC Overhang Bps">5\' Ex</div>',
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
                                    text: '<div data-qtip="3\' Extra CPEC Overhang Bps">3\' Ex</div>',
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
                            margin: '10 0 10 0',
                            layout: {
                                type: 'hbox',
                            },
                            items: [
                                {
                                    xtype: 'button',
                                    flex: 1,
                                    cls: 'inspectorAddColumnBtn',
                                    border: 0,
                                    overCls: 'inspectorAddColumnBtn-over',
                                    text: 'Add Column'
                                },
                                {
                                    xtype: 'button',
                                    flex: 1,
                                    cls: 'inspectorRemoveColumnBtn',
                                    border: 0,
                                    overCls: 'inspectorRemoveColumnBtn-over',
                                    margin: '0 0 0 5',
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
