Ext.define('Vede.view.DeviceEditor.j5Controls', {
    extend: 'Ext.window.Window',

    height: 412,
    width: 852,
    title: 'j5 Controls',

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'tabpanel',
                    height: 379,
                    padding: 5,
                    activeTab: 0,
                    items: [
                        {
                            xtype: 'panel',
                            height: 272,
                            padding: 5,
                            layout: {
                                align: 'stretch',
                                type: 'vbox'
                            },
                            title: 'Run j5 on Server',
                            items: [
                                {
                                    xtype: 'button',
                                    flex: 1,
                                    id: 'editj5ParamsBtn',
                                    maxHeight: 23,
                                    maxWidth: 100,
                                    minHeight: 23,
                                    text: 'Edit j5 Parameters'
                                },
                                {
                                    xtype: 'container',
                                    flex: 1,
                                    padding: 2,
                                    layout: {
                                        align: 'stretch',
                                        type: 'hbox'
                                    },
                                    items: [
                                        {
                                            xtype: 'radiofield',
                                            name: 'plasmidsListSource',
                                            fieldLabel: '<b>Master Plasmids List</b>',
                                            labelWidth: 200,
                                            boxLabel: 'Use latest server version'
                                        },
                                        {
                                            xtype: 'radiofield',
                                            flex: 0.5,
                                            margin: 'left: 10px',
                                            name: 'plasmidsListSource',
                                            fieldLabel: 'or',
                                            labelPad: 15,
                                            labelSeparator: ' ',
                                            labelWidth: 10,
                                            boxLabel: 'Generate empty file',
                                            checked: true
                                        },
                                        {
                                            xtype: 'filefield',
                                            flex: 1,
                                            id: 'plasmidsListFileSelector',
                                            margin: '',
                                            fieldLabel: 'or',
                                            hideLabel: false,
                                            labelPad: 15,
                                            labelSeparator: ' ',
                                            labelWidth: 10,
                                            preventMark: false,
                                            buttonOnly: false,
                                            buttonText: '<b>Choose File</b>'
                                        }
                                    ]
                                },
                                {
                                    xtype: 'container',
                                    flex: 1,
                                    padding: 2,
                                    layout: {
                                        align: 'stretch',
                                        type: 'hbox'
                                    },
                                    items: [
                                        {
                                            xtype: 'radiofield',
                                            name: 'oligosListSource',
                                            fieldLabel: '<b>Master Oligos List</b>',
                                            labelWidth: 200,
                                            boxLabel: 'Use latest server version'
                                        },
                                        {
                                            xtype: 'radiofield',
                                            flex: 0.5,
                                            margin: 'left: 10px',
                                            name: 'oligosListSource',
                                            fieldLabel: 'or',
                                            labelPad: 15,
                                            labelSeparator: ' ',
                                            labelWidth: 10,
                                            boxLabel: 'Generate empty file',
                                            checked: true
                                        },
                                        {
                                            xtype: 'filefield',
                                            flex: 1,
                                            id: 'oligosListFileSelector',
                                            margin: '',
                                            fieldLabel: 'or',
                                            hideLabel: false,
                                            labelPad: 15,
                                            labelSeparator: ' ',
                                            labelWidth: 10,
                                            preventMark: false,
                                            buttonOnly: false,
                                            buttonText: '<b>Choose File</b>'
                                        }
                                    ]
                                },
                                {
                                    xtype: 'container',
                                    flex: 1,
                                    padding: 2,
                                    layout: {
                                        align: 'stretch',
                                        type: 'hbox'
                                    },
                                    items: [
                                        {
                                            xtype: 'radiofield',
                                            name: 'directSynthesesListSource',
                                            fieldLabel: '<b>Master Direct Syntheses List</b>',
                                            labelWidth: 200,
                                            boxLabel: 'Use latest server version'
                                        },
                                        {
                                            xtype: 'radiofield',
                                            flex: 0.5,
                                            margin: 'left: 10px',
                                            name: 'directSynthesesListSource',
                                            fieldLabel: 'or',
                                            labelPad: 15,
                                            labelSeparator: ' ',
                                            labelWidth: 10,
                                            boxLabel: 'Generate empty file',
                                            checked: true
                                        },
                                        {
                                            xtype: 'filefield',
                                            flex: 1,
                                            id: 'directSynthesesFileSelector',
                                            margin: '',
                                            fieldLabel: 'or',
                                            hideLabel: false,
                                            labelPad: 15,
                                            labelSeparator: ' ',
                                            labelWidth: 10,
                                            preventMark: false,
                                            buttonOnly: false,
                                            buttonText: '<b>Choose File</b>'
                                        }
                                    ]
                                },
                                {
                                    xtype: 'combobox',
                                    flex: 1,
                                    id: 'assemblyMethodSelector',
                                    maxWidth: 300,
                                    padding: 2,
                                    fieldLabel: '<b>Assembly Method:</b>',
                                    labelSeparator: ' ',
                                    labelWidth: 120,
                                    queryMode: 'local',
                                    store: [
                                        '<b>Mock Assembly</b>',
                                        '<b>SLIC/Gibson/CPEC</b>',
                                        'Golden Gate'
                                    ]
                                },
                                {
                                    xtype: 'button',
                                    flex: 1,
                                    height: 23,
                                    id: 'runj5Btn',
                                    maxHeight: 23,
                                    maxWidth: 60,
                                    minHeight: 23,
                                    enableToggle: true,
                                    pressed: false,
                                    text: '<b>Run j5</b>'
                                },
                                {
                                    xtype: 'displayfield',
                                    flex: 1,
                                    hidden: true,
                                    id: 'j5ResponseTextField',
                                    value: 'Display Field',
                                    hideLabel: true
                                },
                                {
                                    xtype: 'container',
                                    flex: 1,
                                    layout: {
                                        align: 'stretch',
                                        pack: 'end',
                                        type: 'hbox'
                                    },
                                    items: [
                                        {
                                            xtype: 'button',
                                            flex: 1,
                                            floating: false,
                                            height: 23,
                                            id: 'loadAssemblyBtn',
                                            margin: '10 0 10 0',
                                            maxHeight: 23,
                                            maxWidth: 200,
                                            minHeight: 23,
                                            width: 100,
                                            text: '<b>Load Existing Assembly File</b>'
                                        }
                                    ]
                                },
                                {
                                    xtype: 'gridpanel',
                                    flex: 1,
                                    height: 100,
                                    id: 'plasmidsGrid',
                                    margin: '10 0 5 0',
                                    minHeight: 110,
                                    width: 786,
                                    title: 'Plasmids',
                                    columnLines: true,
                                    disableSelection: true,
                                    enableColumnHide: false,
                                    enableColumnMove: false,
                                    forceFit: true,
                                    rowLines: false,
                                    columns: [
                                        {
                                            xtype: 'gridcolumn',
                                            dataIndex: 'string',
                                            text: '<b>Name</b>'
                                        },
                                        {
                                            xtype: 'gridcolumn',
                                            draggable: false,
                                            resizable: false,
                                            sortable: false,
                                            hideable: false,
                                            text: ''
                                        },
                                        {
                                            xtype: 'gridcolumn',
                                            draggable: false,
                                            resizable: false,
                                            sortable: false,
                                            hideable: false,
                                            text: ''
                                        }
                                    ],
                                    viewConfig: {
                                        deferEmptyText: false,
                                        emptyText: '',
                                        enableTextSelection: true
                                    }
                                }
                            ]
                        },
                        {
                            xtype: 'panel',
                            height: 366,
                            padding: 5,
                            title: 'Condense Assembly Files',
                            items: [
                                {
                                    xtype: 'filefield',
                                    id: 'condenseAssemblyFilesSelector',
                                    maxWidth: 500,
                                    width: 500,
                                    fieldLabel: '<b>Assembly Files To Condense List:</b>',
                                    labelSeparator: ' ',
                                    labelWidth: 200,
                                    buttonText: '<b>Choose File</b>'
                                },
                                {
                                    xtype: 'filefield',
                                    id: 'zippedAssemblyFilesSelector',
                                    width: 500,
                                    fieldLabel: '<b>Zipped Assembly Files:</b>',
                                    labelSeparator: ' ',
                                    labelWidth: 200,
                                    buttonText: '<b>Choose File</b>'
                                },
                                {
                                    xtype: 'button',
                                    id: 'condenseAssembliesBtn',
                                    text: '<b>Condense Assemblies</b>'
                                }
                            ]
                        },
                        {
                            xtype: 'panel',
                            height: 342,
                            padding: 5,
                            title: 'Downstream Automation',
                            items: [
                                {
                                    xtype: 'radiogroup',
                                    margin: '5 0 0 0',
                                    padding: 0,
                                    width: 650,
                                    fieldLabel: '<b>Downstream Automation Parameters File:</b>',
                                    labelSeparator: ' ',
                                    labelWidth: 265,
                                    items: [
                                        {
                                            xtype: 'radiofield',
                                            boxLabel: 'Use latest server version'
                                        },
                                        {
                                            xtype: 'radiofield',
                                            boxLabel: 'Use custom parameters',
                                            checked: true
                                        }
                                    ]
                                },
                                {
                                    xtype: 'button',
                                    margin: '0 0 15 0',
                                    text: '<b>Customize Automation Parameters</b>'
                                },
                                {
                                    xtype: 'filefield',
                                    id: 'sourcePlateListSelector',
                                    width: 350,
                                    fieldLabel: '<b>Source Plate List:</b>',
                                    labelSeparator: ' ',
                                    labelWidth: 130,
                                    buttonText: '<b>Choose File</b>'
                                },
                                {
                                    xtype: 'filefield',
                                    id: 'zippedPlateFilesSelector',
                                    width: 350,
                                    fieldLabel: '<b>Zipped Plate Files:</b>',
                                    labelSeparator: ' ',
                                    labelWidth: 130,
                                    buttonText: '<b>Choose File</b>'
                                },
                                {
                                    xtype: 'filefield',
                                    id: 'assemblyFileSelector',
                                    width: 350,
                                    fieldLabel: '<b>j5 Assembly File:</b>',
                                    labelSeparator: ' ',
                                    labelWidth: 130,
                                    buttonText: '<b>Choose File</b>'
                                },
                                {
                                    xtype: 'button',
                                    id: 'distributePCRBtn',
                                    margin: '15 0 0 0',
                                    text: '<b>Distribute PCR Reactions</b>'
                                }
                            ]
                        },
                        {
                            xtype: 'panel',
                            title: 'j5 Files',
                            items: [
                                {
                                    xtype: 'container',
                                    layout: {
                                        align: 'stretch',
                                        type: 'hbox'
                                    },
                                    items: [
                                        {
                                            xtype: 'container',
                                            flex: 1,
                                            padding: 5,
                                            layout: {
                                                align: 'stretch',
                                                type: 'vbox'
                                            },
                                            items: [
                                                {
                                                    xtype: 'button',
                                                    flex: 1,
                                                    id: 'generatej5SequenceFileBtn',
                                                    margin: 3,
                                                    text: '<b>Generate j5 Sequence File</b>'
                                                },
                                                {
                                                    xtype: 'button',
                                                    flex: 1,
                                                    id: 'generatej5PartsFileBtn',
                                                    margin: 3,
                                                    text: '<b>Generate j5 Parts File</b>'
                                                },
                                                {
                                                    xtype: 'button',
                                                    flex: 1,
                                                    id: 'generatej5TargetPartsFileBtn',
                                                    margin: 3,
                                                    text: '<b>Generate j5 Target Parts File</b>'
                                                },
                                                {
                                                    xtype: 'button',
                                                    flex: 1,
                                                    id: 'generatej5EugeneRulesFileBtn',
                                                    margin: 3,
                                                    text: '<b>Generate j5 Eugene Rules File</b>'
                                                }
                                            ]
                                        },
                                        {
                                            xtype: 'container',
                                            flex: 1,
                                            padding: 5,
                                            layout: {
                                                align: 'stretch',
                                                type: 'vbox'
                                            },
                                            items: [
                                                {
                                                    xtype: 'button',
                                                    flex: 1,
                                                    id: 'generatej5GenbankFileBtn',
                                                    margin: 3,
                                                    maxHeight: 23,
                                                    text: '<b>Generate Genbank File</b>'
                                                },
                                                {
                                                    xtype: 'button',
                                                    flex: 1,
                                                    id: 'generatej5FastaFileBtn',
                                                    margin: 3,
                                                    maxHeight: 23,
                                                    text: '<b>Generate FASTA File</b>'
                                                },
                                                {
                                                    xtype: 'button',
                                                    flex: 1,
                                                    id: 'generatej5jbeiSeqFileBtn',
                                                    margin: 3,
                                                    maxHeight: 23,
                                                    text: '<b>Generate jbei-seq File</b>'
                                                }
                                            ]
                                        },
                                        {
                                            xtype: 'container',
                                            flex: 1.3,
                                            padding: 5,
                                            layout: {
                                                align: 'stretch',
                                                type: 'vbox'
                                            },
                                            items: [
                                                {
                                                    xtype: 'button',
                                                    flex: 1,
                                                    id: 'generatej5ParamsFileBtn',
                                                    margin: 3,
                                                    maxHeight: 23,
                                                    text: '<b>Generate j5 Parameters File</b>'
                                                },
                                                {
                                                    xtype: 'button',
                                                    flex: 1,
                                                    id: 'generatej5AutomationParamsBtn',
                                                    margin: 3,
                                                    maxHeight: 23,
                                                    text: '<b>Generate Downstream Automation Parameters File</b>'
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    xtype: 'container',
                                    margin: 20,
                                    layout: {
                                        align: 'stretch',
                                        pack: 'center',
                                        type: 'hbox'
                                    },
                                    items: [
                                        {
                                            xtype: 'button',
                                            id: 'downloadAllj5FilesBtn',
                                            maxWidth: 150,
                                            text: '<b>Download All Files</b>'
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        me.callParent(arguments);
    }

});
