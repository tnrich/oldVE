/**
 * Device Editor Inspector panel
 * @class Vede.view.de.InspectorPanel
 */
Ext.define('Vede.view.de.InspectorPanel', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.InspectorPanel',
<<<<<<< HEAD
    requires: ["Teselagen.event.DeviceEvent","Ext.form.RadioGroup", "Ext.grid.column.Boolean",
               "Ext.grid.column.Column", "Ext.grid.column.Number", "Ext.grid.Panel", 
               "Ext.grid.plugin.RowEditing", "Teselagen.models.EugeneRule", "Vede.view.de.grid.Part"],
=======
    requires: ["Teselagen.event.DeviceEvent",
               "Ext.form.RadioGroup", 
               "Ext.grid.column.Boolean",
               "Ext.grid.column.Column", 
               "Ext.grid.column.Number", 
               "Ext.grid.Panel", 
               "Ext.grid.plugin.RowEditing",
               "Vede.view.de.InspectorCollectionInfoGrid"],
>>>>>>> 3f34cb444aa02a388e51acb570b6e7b440b69b7e
    cls: 'InspectorPanel',

    activeTab: 1,
    animCollapse: false,
    dock: 'right',
    frame: true,
    minWidth: 350,
    bodyBorder: false,
    collapseDirection: 'right',
    collapsible: true,
    frameHeader: false,
    overlapHeader: false,
    title: 'Inspector',
    titleCollapse: false,
    removePanelHeader: false,
    resizable: true,
    width: 100,
    layout: {
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
            cls: 'partInfoTab',
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
                    text : 'Clear Part',
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
                    minHeight: 170,
                    maxHeight: 170,
                    bodyPadding: 10,
                    title: 'Properties',
                    margin: '5px 0px 5px 0px',
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
                    margin: '5px 0px 5px 0px',
                    title: 'Forced Assembly Strategy',
                    items: [
                        {
                            xtype: 'combobox',
                            cls: 'forcedAssemblyComboBox',
                            name: 'fas',
                            editable: false,
                            queryMode: 'local',
                            anchor: '100%',
                            store: []
                        }
                    ]
                },
                {
                    xtype: 'form',
                    cls: 'eugeneRulesForm',
                    flex: 1,
                    autoScroll: true,
                    bodyPadding: 10,
                    margin: '5px 0px 0px 0px',
                    title: 'Eugene Rules',
                    items: [
                        {
                            xtype: 'gridpanel',
                            cls: 'eugeneRulesGrid',
                            layout: 'fit',
                            viewConfig: {
                                markDirty: false
                            },
                            plugins: Ext.create('Ext.grid.plugin.RowEditing',{
                                clicksToEdit: 2,
                                listeners: {
                                    edit: function (editor, e, eOpts) {
                                        var updatedField = e.field;
                                        var newId = e.newValues.operand2_id;
                                        var ruleName = e.record.raw.name;
                                        var oldId = e.value;
                                        if (updatedField === "operand2_id") {
                                            Vede.application.fireEvent('operand2Changed', newId, ruleName, oldId, e);
                                        };
                                    }
                                }
                            }),
                            listeners: {
                                afterrender: function () {
                                    Vede.application.fireEvent('populateOperand2Field');
                                }
                            },
                            columnLines: true,
                            rowLines: true,
                            minHeight: 140,
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
                                    trueText: 'NOT',
                                    falseText: null,
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
                                    cls: "operand2_field",
                                    editor: {
                                        xtype: 'combobox',
                                        store: [],
                                        cls: "operand2_combobox"
                                    },
                                    
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
                                    text: 'Delete Rule'
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            xtype: 'panel',
            cls: 'collectionInfoTab',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            title: 'Collection Info',
            margin: "5px 0px 5px 0px",
            items: [
                {
                    xtype: 'form',
                    cls: 'collectionInfoForm',
                    flex: 2,
                    bodyBorder: false,
                    autoScroll: true,
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
                            anchor: '100%',
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
                            anchor:"100% 65%",
                            xtype: 'collectioninfogrid'
                        }
                            
                        // {
                        //     xtype: 'container',
                        //     cls: 'inspector_containerActions',
                        //     margin: '10px 0 10px 0',
                        //     layout: {
                        //         type: 'hbox',
                        //     },
                        //     items: [
                        //         {
                        //             xtype: 'button',
                        //             flex: 1,
                        //             cls: 'inspectorAddColumnBtn',
                        //             border: 0,
                        //             overCls: 'inspectorAddColumnBtn-over',
                        //             text: 'Add Column'
                        //         },
                        //         {
                        //             xtype: 'button',
                        //             flex: 1,
                        //             cls: 'inspectorRemoveColumnBtn',
                        //             border: 0,
                        //             overCls: 'inspectorRemoveColumnBtn-over',
                        //             margin: '0 0 0 5',
                        //             text: 'Remove Column'
                        //         }
                        //     ]
                        // }
                    ]
                },
                {
                    xtype: 'form',
                    autoScroll: true,
                    flex: 1,
                    title: 'Column Content',
                    margin: '5px 0px 5px 0px',
                    cls: 'columnContentForm',
                    items: [
                        {
                            xtype: 'displayfield',
                            cls: 'columnContentDisplayField',
                            margin: 10,
                            fieldLabel: ''
                        }
                    ]
                }
            ]
        },
        {
            xtype: 'panel',
            cls: 'j5InfoTab',
            title:'j5',
            bodyCls: 'j5InfoTab-body',
            disabled: true,
            preventHeader: true,
            autoScroll: true,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            margin: "5px 0px 5px 0px",
            items: [
                {
                    xtype: 'button',
                    text : 'Submit Run to j5',
                    cls: 'runj5Btn',
                    overCls: 'runj5Btn-over',
                    margin: '2.5 0 2.5 0',
                    height: 40,
                    border: 0
                },
                {
                    xtype: 'button',
                    text : 'Edit J5 Parameters',
                    cls: 'editj5ParamsBtn',
                    overCls: 'editj5ParamsBtn-over',
                    margin: '2.5 0 2.5 0',
                    height: 30,
                    border: 0
                },
                {
                    xtype: 'button',
                    text : 'Condense Assemblies',
                    cls: 'condenseAssembliesBtn',
                    overCls: 'condenseAssembliesBtn-over',
                    margin: '2.5 0 2.5 0',
                    height: 40,
                    border: 0,
                    hidden: true
                },
                {
                    xtype: 'button',
                    text : 'Distribute PCR Reactions',
                    cls: 'distributePCRBtn',
                    overCls: 'distributePCRBtn-over',
                    margin: '2.5 0 2.5 0',
                    height: 40,
                    border: 0,
                    hidden: true
                },
                {
                    xtype: 'tabpanel',
                    activeTab: 0,
                    cls: 'j5InfoTab-Sub',
                    animCollapse: false,
                    collapsible: false,
                    removePanelHeader: true,
                    margin: '10 0 0 0',
                    items: [
                        {
                            xtype: 'form',
                            flex: 1,
                            cls: 'j5InfoTab-Basic',
                            width: 287,
                            layout: {
                                align: 'stretch',
                                type: 'vbox'
                            },
                            bodyPadding: 10,
                            title: 'Basic',
                            margin: '5px 0px 5px 0px',
                            items: [
                                {
                                    xtype: 'combobox',
                                    cls: 'assemblyMethodSelector',
                                    fieldLabel: '<b>Assembly Method:</b>',
                                    labelCls: 'assembly-label',
                                    editable: false,
                                    labelSeparator: ' ',
                                    labelWidth: 110,
                                    width:350,
                                    queryMode: 'local',
                                    displayField: 'assemblyMethod',
                                    valueField: 'assemblyMethod'
                                },
                                {   
                                    xtype: 'container',
                                    html: '<b>Master Plasmids List</b>',
                                    cls: 'masterPlasmidsList-box',
                                    margin: '20 0 0 0',
                                    layout: {
                                        align: 'stretch',
                                        type: 'vbox'
                                    },
                                    items: [{
                                        xtype: 'radiofield',
                                        cls: 'useServerPlasmidsRadioBtn',
                                        name: 'plasmidsListSource',
                                        margin: '20 0 0 25',
                                        labelWidth: 110,
                                        boxLabel: 'Use latest server version',
                                        checked: true
                                    }, {
                                        xtype: 'radiofield',
                                        cls: 'useEmptyPlasmidsRadioBtn',
                                        name: 'plasmidsListSource',
                                        margin: '5 0 0 25',
                                        fieldLabelCls: 'align-middle',
                                        labelWidth: 110,
                                        boxLabel: 'Generate empty file'
                                    }, {
                                        xtype: 'filefield',
                                        cls: 'plasmidsListFileSelector',
                                        margin: '10 0 0 25',
                                        validateOnChange: false,
                                        padding: 0,
                                        height: 23,
                                        allowBlank: false,
                                        hideLabel: false,
                                        labelWidth: 10,
                                        preventMark: false,
                                        buttonOnly: false,
                                        buttonText: '<b>Choose File</b>',
                                        buttonConfig: {
                                            stlye: {
                                                paddingTop: '0px !important'
                                            }
                                        }
                                    }]
                                },
                                {   
                                    xtype: 'container',
                                    html: '<b>Master Oligos List</b>',
                                    margin: '20 0 0 0',
                                    layout: {
                                        align: 'stretch',
                                        type: 'vbox'
                                    },
                                    items: [{
                                        xtype: 'radiofield',
                                        cls: 'useServerOligosRadioBtn',
                                        name: 'oligosListSource',
                                        margin: '20 0 0 25',
                                        labelWidth: 110,
                                        boxLabel: 'Use latest server version',
                                        checked: true
                                    }, {
                                        xtype: 'radiofield',
                                        cls: 'useEmptyOligosRadioBtn',
                                        name: 'oligosListSource',
                                        margin: '5 0 0 25',
                                        fieldLabelCls: 'align-middle',
                                        labelWidth: 110,
                                        boxLabel: 'Generate empty file'
                                    }, {
                                        xtype: 'filefield',
                                        cls: 'oligosListFileSelector',
                                        margin: '10 0 0 25',
                                        validateOnChange: false,
                                        padding: 0,
                                        height: 23,
                                        allowBlank: false,
                                        hideLabel: false,
                                        labelWidth: 10,
                                        preventMark: false,
                                        buttonOnly: false,
                                        buttonText: '<b>Choose File</b>'
                                    }]
                                },
                                {   
                                    xtype: 'container',
                                    html: '<b>Master Direct Syntheses List</b>',
                                    margin: '20 0 0 0',
                                    layout: {
                                        align: 'stretch',
                                        type: 'vbox'
                                    },
                                    items: [{
                                        xtype: 'radiofield',
                                        cls: 'useServerSynthesesRadioBtn',
                                        name: 'directSynthesesListSource',
                                        margin: '20 0 0 25',
                                        labelWidth: 110,
                                        boxLabel: 'Use latest server version',
                                        checked: true
                                    }, {
                                        xtype: 'radiofield',
                                        cls: 'useEmptySynthesesRadioBtn',
                                        name: 'directSynthesesListSource',
                                        margin: '5 0 0 25',
                                        fieldLabelCls: 'align-middle',
                                        labelWidth: 110,
                                        boxLabel: 'Generate empty file'
                                    }, {
                                        xtype: 'filefield',
                                        cls: 'directSynthesesFileSelector',
                                        margin: '10 0 0 25',
                                        validateOnChange: false,
                                        padding: 0,
                                        height: 23,
                                        allowBlank: false,
                                        hideLabel: false,
                                        labelWidth: 10,
                                        preventMark: false,
                                        buttonOnly: false,
                                        buttonText: '<b>Choose File</b>'
                                    }]
                                }
                            ]
                        },
                        {
                            xtype: 'tabpanel',
                            activeTab: 0,
                            cls: 'j5InfoTab-Sub-Advanced',
                            animCollapse: false,
                            collapsible: false,
                            removePanelHeader: true,
                            bodyPadding: 10,
                            title: 'Advanced',
                            border: 0,
                            bodyCls: 'j5InfoTab-Sub-Advanced-Body',
                            margin: '5px 0px 0px 0px',
                            items: [
                                {   
                                    xtype: 'container',
                                    title: 'Condense Assembly Files',
                                    cls: 'condenseAssemblyFiles-box',
                                    margin: '0 0 0 0',
                                    layout: {
                                        align: 'stretch',
                                        type: 'vbox'
                                    },
                                    items: [
                                        {   
                                        xtype: 'container',
                                        html: 'Assembly Files To Condense List:',
                                        margin: '10 0 0 0',
                                        layout: {
                                            align: 'stretch',
                                            type: 'vbox'
                                        },
                                        items: [
                                            {
                                                xtype: 'filefield',
                                                cls: 'condenseAssemblyFilesSelector',
                                                validateOnChange: false,
                                                labelSeparator: ' ',
                                                labelWidth: 10,
                                                allowBlank: false,
                                                hideLabel: false,
                                                labelWidth: 10,
                                                preventMark: false,
                                                buttonOnly: false,
                                                buttonText: 'Choose File',
                                                margin: '20 0 0 0'
                                            }]
                                        },
                                        {   
                                        xtype: 'container',
                                        html: 'Zipped Assembly Files:',
                                        cls: 'condenseAssemblyFiles-box',
                                        margin: '15 0 0 0',
                                        layout: {
                                            align: 'stretch',
                                            type: 'vbox'
                                        },
                                        items: [
                                            {
                                                xtype: 'filefield',
                                                cls: 'zippedAssemblyFilesSelector',
                                                validateOnChange: false,
                                                labelSeparator: ' ',
                                                labelWidth: 10,
                                                allowBlank: false,
                                                hideLabel: false,
                                                labelWidth: 10,
                                                preventMark: false,
                                                buttonOnly: false,
                                                buttonText: 'Choose File',
                                                margin: '20 0 0 0'
                                            }
                                            ]
                                        },
                                        {
                                            xtype: 'button',
                                            margin: '20 0 0 0',
                                            cls: 'downloadCondenseAssemblyResultsBtn',
                                            text: 'Download Results',
                                            hidden:true
                                        }
                                    ]   
                                },
                                {   
                                    xtype: 'container',
                                    title: 'Downstream Automation',
                                    cls: 'downstreamAutomation-box',
                                    layout: {
                                        align: 'stretch',
                                        type: 'vbox'
                                    },
                                    items: [
                                        {   
                                        xtype: 'container',
                                        html: '',
                                        cls: 'downstreamAutomationParameters-box',
                                        margin: '5 0 0 0',
                                        layout: {
                                            align: 'stretch',
                                            type: 'vbox'
                                        },
                                        items: [
                                        // {
                                        //     xtype: 'radiofield',
                                        //     name: 'automationParamsFileSource',
                                        //     margin: '20 0 0 25',
                                        //     labelWidth: 110,
                                        //     boxLabel: 'Use latest server version',
                                        //     checked: true
                                        // }, {
                                        //     xtype: 'radiofield',
                                        //     name: 'automationParamsFileSource',
                                        //     margin: '5 0 0 25',
                                        //     fieldLabelCls: 'align-middle',
                                        //     labelWidth: 110,
                                        //     boxLabel: 'Use custom parameters'
                                        // },
                                        {
                                            xtype: 'filefield',
                                            cls: 'sourcePlateListSelector',
                                            margin: '30 0 0 0',
                                            validateOnChange: false,
                                            fieldLabel: 'Source Plate List:',
                                            labelWidth: 110,
                                            labelSeparator: ' ',
                                            buttonText: 'Choose File'
                                        }, {
                                            xtype: 'filefield',
                                            cls: 'zippedPlateFilesSelector',
                                            fieldLabel: 'Zipped Plate Files:',
                                            margin: '15 0 0 0',
                                            labelWidth: 110,
                                            labelSeparator: ' ',
                                            buttonText: 'Choose File'
                                        }, {
                                            xtype: 'filefield',
                                            cls: 'assemblyFileSelector',
                                            validateOnChange: false,
                                            fieldLabel: 'j5 Assembly File:',
                                            margin: '15 0 0 0',
                                            labelWidth: 110,
                                            labelSeparator: ' ',
                                            buttonText: 'Choose File'
                                        },
                                        {
                                            xtype: 'button',
                                            cls: 'customizeAutomationParamsBtn',
                                            margin: '20 0 0 0',
                                            height: 30,
                                            text: 'Edit Automation Parameters'
                                        },
                                        {
                                            xtype: 'button',
                                            cls: 'downloadDownstreamAutomationBtn',
                                            pressed: false,
                                            text: 'Download Results',
                                            hidden: true,
                                            margin: '15 0 0 0'
                                        }
                                        ]
                                    }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ],
    listeners: {
        'tabchange': function(tabPanel, tab) {
            if (tab.cls=='j5InfoTab')
            {   
                Vede.application.fireEvent("openj5");
            }
        }
    },

    init: function () {
        console.log(workingProject);
        
    }
}


);
