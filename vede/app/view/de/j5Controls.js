/**
 * j5 controls view
 * @class Vede.view.de.j5Controls
 */
Ext.define('Vede.view.de.j5Controls', {
    extend: 'Ext.window.Window',

    height: 500,
    width: 852,
    title: 'j5 Controls',
    modal: true,
    autoScroll: true,

    initComponent: function () {
        var me = this;

        Ext.applyIf(me, {
            items: [{
                xtype: 'tabpanel',
                height: 467,
                padding: 5,
                activeTab: 0,
                items: [{
                    xtype: 'panel',
                    height: 272,
                    padding: 5,
                    layout: {
                        align: 'stretch',
                        type: 'vbox'
                    },
                    title: 'Run j5 on Server',
                    items: [{
                        xtype: 'button',
                        flex: 1,
                        cls: 'editj5ParamsBtn',
                        maxHeight: 23,
                        maxWidth: 130,
                        minHeight: 23,
                        text: '<b>Edit j5 Parameters</b>'
                    }, {
                        xtype: 'container',
                        flex: 1,
                        padding: 2,
                        layout: {
                            align: 'stretch',
                            type: 'hbox'
                        },
                        items: [{
                            xtype: 'radiofield',
                            cls: 'useServerPlasmidsRadioBtn',
                            name: 'plasmidsListSource',
                            fieldLabel: '<b>Master Plasmids List</b>',
                            labelWidth: 200,
                            boxLabel: 'Use latest server version'
                        }, {
                            xtype: 'radiofield',
                            cls: 'useEmptyPlasmidsRadioBtn',
                            flex: 0.7,
                            margin: 'left: 10px',
                            name: 'plasmidsListSource',
                            fieldLabel: 'or',
                            labelPad: 15,
                            labelSeparator: ' ',
                            labelWidth: 10,
                            boxLabel: 'Generate empty file',
                            checked: true
                        }, {
                            xtype: 'filefield',
                            flex: 1,
                            cls: 'plasmidsListFileSelector',
                            validateOnChange: false,
                            allowBlank: false,
                            margin: '',
                            fieldLabel: 'or',
                            hideLabel: false,
                            labelPad: 10,
                            labelSeparator: ' ',
                            labelWidth: 10,
                            preventMark: false,
                            buttonOnly: false,
                            buttonText: '<b>Choose File</b>'
                        }]
                    }, {
                        xtype: 'container',
                        flex: 1,
                        padding: 2,
                        layout: {
                            align: 'stretch',
                            type: 'hbox'
                        },
                        items: [{
                            xtype: 'radiofield',
                            cls: 'useServerOligosRadioBtn',
                            name: 'oligosListSource',
                            fieldLabel: '<b>Master Oligos List</b>',
                            labelWidth: 200,
                            boxLabel: 'Use latest server version'
                        }, {
                            xtype: 'radiofield',
                            cls: 'useEmptyOligosRadioBtn',
                            flex: 0.7,
                            margin: 'left: 10px',
                            name: 'oligosListSource',
                            fieldLabel: 'or',
                            labelPad: 15,
                            labelSeparator: ' ',
                            labelWidth: 10,
                            boxLabel: 'Generate empty file',
                            checked: true
                        }, {
                            xtype: 'filefield',
                            flex: 1,
                            cls: 'oligosListFileSelector',
                            validateOnChange: false,
                            margin: '',
                            fieldLabel: 'or',
                            hideLabel: false,
                            labelPad: 10,
                            labelSeparator: ' ',
                            labelWidth: 10,
                            preventMark: false,
                            buttonOnly: false,
                            buttonText: '<b>Choose File</b>'
                        }]
                    }, {
                        xtype: 'container',
                        flex: 1,
                        padding: 2,
                        layout: {
                            align: 'stretch',
                            type: 'hbox'
                        },
                        items: [{
                            xtype: 'radiofield',
                            cls: 'useServerSynthesesRadioBtn',
                            name: 'directSynthesesListSource',
                            fieldLabel: '<b>Master Direct Syntheses List</b>',
                            labelWidth: 200,
                            boxLabel: 'Use latest server version'
                        }, {
                            xtype: 'radiofield',
                            cls: 'useEmptySynthesesRadioBtn',
                            flex: 0.7,
                            margin: 'left: 10px',
                            name: 'directSynthesesListSource',
                            fieldLabel: 'or',
                            labelPad: 15,
                            labelSeparator: ' ',
                            labelWidth: 10,
                            boxLabel: 'Generate empty file',
                            checked: true
                        }, {
                            xtype: 'filefield',
                            flex: 1,
                            cls: 'directSynthesesFileSelector',
                            validateOnChange: false,
                            margin: '',
                            fieldLabel: 'or',
                            hideLabel: false,
                            labelPad: 10,
                            labelSeparator: ' ',
                            labelWidth: 10,
                            preventMark: false,
                            buttonOnly: false,
                            buttonText: '<b>Choose File</b>'
                        }]
                    }, {
                        xtype: 'combobox',
                        flex: 1,
                        cls: 'assemblyMethodSelector',
                        maxWidth: 300,
                        padding: 2,
                        fieldLabel: '<b>Assembly Method:</b>',
                        labelSeparator: ' ',
                        labelWidth: 120,
                        queryMode: 'local',
                        store: ['Mock Assembly', 'SLIC/Gibson/CPEC', 'Golden Gate', 'Combinatorial Mock Assembly', 'Combinatorial SLIC/Gibson/CPEC', 'Combinatorial Golden Gate'],
                        value: 'Mock Assembly'
                    }, {
                        xtype: 'button',
                        flex: 1,
                        height: 23,
                        cls: 'runj5Btn',
                        maxHeight: 23,
                        maxWidth: 60,
                        minHeight: 23,
                        enableToggle: true,
                        pressed: false,
                        text: '<b>Run j5</b>'
                    }, {
                        xtype: 'button',
                        flex: 1,
                        height: 23,
                        cls: 'downloadj5Btn',
                        maxHeight: 23,
                        maxWidth: 140,
                        minHeight: 23,
                        enableToggle: true,
                        pressed: false,
                        text: '<b>Download Results</b>',
                        hidden: true
                    }, {
                        xtype: 'displayfield',
                        flex: 1,
                        hidden: true,
                        border: 1,
                        style: {
                            borderColor: '#c5c5c5',
                            borderStyle: 'solid'
                        },
                        cls: 'j5ResponseTextField',
                        value: '',
                        hideLabel: true
                    }, {
                        xtype: 'container',
                        flex: 1,
                        layout: {
                            align: 'stretch',
                            pack: 'end',
                            type: 'hbox'
                        },
                        items: [{
                            xtype: 'filefield',
                            height: 23,
                            buttonOnly: true,
                            cls: 'loadAssemblyBtn',
                            validateOnChange: false,
                            margin: '10 0 10 0',
                            maxHeight: 23,
                            minHeight: 23,
                            buttonText: '<b>Load Existing Assembly File</b>'
                        }]
                    }, {
                        xtype: 'gridpanel',
                        flex: 1,
                        height: 178,
                        cls: 'plasmidsGrid',
                        margin: '10 0 5 0',
                        minHeight: 178,
                        width: 786,
                        title: 'Plasmids',
                        columnLines: true,
                        disableSelection: true,
                        enableColumnHide: false,
                        enableColumnMove: false,
                        forceFit: true,
                        rowLines: false,
                        columns: [{
                            xtype: 'gridcolumn',
                            dataIndex: 'name',
                            text: '<b>Name</b>'
                        }, {
                            xtype: 'gridcolumn',
                            dataIndex: 'size',
                            text: 'size',
                            draggable: false,
                            resizable: false,
                            sortable: false,
                            hideable: false
                        }, {
                            xtype: 'gridcolumn',
                            dataIndex: 'fileContent',
                            draggable: false,
                            resizable: false,
                            sortable: false,
                            hideable: false
                        }],
                        viewConfig: {
                            deferEmptyText: false,
                            emptyText: '',
                            enableTextSelection: true
                        }
                    }]
                }, {
                    xtype: 'panel',
                    height: 366,
                    padding: 5,
                    title: 'Condense Assembly Files',
                    items: [{
                        xtype: 'filefield',
                        cls: 'condenseAssemblyFilesSelector',
                        validateOnChange: false,
                        maxWidth: 500,
                        width: 500,
                        fieldLabel: '<b>Assembly Files To Condense List:</b>',
                        labelSeparator: ' ',
                        labelWidth: 200,
                        buttonText: '<b>Choose File</b>'
                    }, {
                        xtype: 'filefield',
                        cls: 'zippedAssemblyFilesSelector',
                        validateOnChange: false,
                        width: 500,
                        fieldLabel: '<b>Zipped Assembly Files:</b>',
                        labelSeparator: ' ',
                        labelWidth: 200,
                        buttonText: '<b>Choose File</b>'
                    }, {
                        xtype: 'button',
                        cls: 'condenseAssembliesBtn',
                        text: '<b>Condense Assemblies</b>'
                    }]
                }, {
                    xtype: 'panel',
                    height: 342,
                    padding: 5,
                    title: 'Downstream Automation',
                    items: [{
                        xtype: 'radiogroup',
                        margin: '5 0 0 0',
                        padding: 0,
                        width: 650,
                        fieldLabel: '<b>Downstream Automation Parameters File:</b>',
                        labelSeparator: ' ',
                        labelWidth: 265,
                        items: [{
                            xtype: 'radiofield',
                            boxLabel: 'Use latest server version',
                            name: 'automationParamsFileSource'
                        }, {
                            xtype: 'radiofield',
                            boxLabel: 'Use custom parameters',
                            name: 'automationParamsFileSource',
                            checked: true
                        }]
                    }, {
                        xtype: 'button',
                        cls: 'customizeAutomationParamsBtn',
                        margin: '0 0 15 0',
                        text: '<b>Customize Automation Parameters</b>'
                    }, {
                        xtype: 'filefield',
                        cls: 'sourcePlateListSelector',
                        validateOnChange: false,
                        width: 350,
                        fieldLabel: '<b>Source Plate List:</b>',
                        labelSeparator: ' ',
                        labelWidth: 130,
                        buttonText: '<b>Choose File</b>'
                    }, {
                        xtype: 'filefield',
                        cls: 'zippedPlateFilesSelector',
                        validateOnChange: false,
                        width: 350,
                        fieldLabel: '<b>Zipped Plate Files:</b>',
                        labelSeparator: ' ',
                        labelWidth: 130,
                        buttonText: '<b>Choose File</b>'
                    }, {
                        xtype: 'filefield',
                        cls: 'assemblyFileSelector',
                        validateOnChange: false,
                        width: 350,
                        fieldLabel: '<b>j5 Assembly File:</b>',
                        labelSeparator: ' ',
                        labelWidth: 130,
                        buttonText: '<b>Choose File</b>'
                    }, {
                        xtype: 'button',
                        cls: 'distributePCRBtn',
                        margin: '15 0 0 0',
                        text: '<b>Distribute PCR Reactions</b>'
                    }, {
                        xtype: 'button',
                        cls: 'downloadDownstreamAutomationBtn',
                        enableToggle: true,
                        pressed: false,
                        text: '<b>Download Results</b>',
                        hidden: true,
                        margin: '15 0 0 0'
                    }]
                }, {
                    xtype: 'panel',
                    title: 'j5 Files',
                    layout: {
                        align: 'stretch',
                        type: 'vbox'
                    },
                    items: [{
                        xtype: 'container',
                        flex: 1,
                        layout: {
                            align: 'stretch',
                            type: 'hbox'
                        },
                        items: [{
                            xtype: 'container',
                            flex: 1,
                            padding: 5,
                            layout: {
                                align: 'stretch',
                                type: 'vbox'
                            },
                            height: 366,
                            items: [{
                                xtype: 'button',
                                flex: 1,
                                cls: 'generatej5SequenceFileBtn',
                                margin: 3,
                                maxHeight: 23,
                                text: '<b>Generate j5 Sequence File</b>',
                                tooltip: "The sequences list file is a CSV file that contains a list of all of the source/template sequences from which DNA parts will be defined."
                            }, {
                                xtype: 'button',
                                flex: 1,
                                cls: 'generatej5PartsFileBtn',
                                margin: 3,
                                maxHeight: 23,
                                text: '<b>Generate j5 Parts File</b>',
                                tooltip: 'The parts list file is a CSV file that contains the definitions of all of the DNA parts that may be utilized during the assembly process.'
                            }, {
                                xtype: 'button',
                                flex: 1,
                                cls: 'generatej5TargetPartsFileBtn',
                                margin: 3,
                                maxHeight: 23,
                                text: '<b>Generate j5 Target Parts File</b>',
                                tooltip: 'The target part order list file is a CSV file that determines how the DNA parts will be arranged in the assembly. The order of combinatorial bins or parts in the file matches the order of bins or parts in the resulting assembly (the last bin or part in the list will be cyclicly followed by the first bin or part). The same part may be utilized more than once in any given assembly.'
                            }, {
                                xtype: 'button',
                                flex: 1,
                                cls: 'generatej5EugeneRulesFileBtn',
                                margin: 3,
                                maxHeight: 23,
                                text: '<b>Generate j5 Eugene Rules File</b>',
                                tooltip: 'The Eugene (a biological design specification computer language) rules list file is a text file that contains a list of design rules. j5 checks that these rules are satisfied prior to designing an assembly. Currently, j5 only enforces three types of Eugene rules (NOTMORETHAN, NOTWITH, and WITH) and ignores all other rules and declarations; all lines that do not begin with "Rule" are ignored, as well as everything following the commenting escape characters "//".'
                            }]
                        }, {
                            xtype: 'container',
                            flex: 1,
                            padding: 5,
                            layout: {
                                align: 'stretch',
                                type: 'vbox'
                            },
                            items: [{
                                xtype: 'button',
                                flex: 1,
                                cls: 'generatej5GenbankFileBtn',
                                margin: 3,
                                maxHeight: 23,
                                text: '<b>Generate Genbank File</b>',
                                tooltip: 'Genbank format sequence files generally contain a single sequence each (although at times, you may see multiple ORF translated sequences embedded as feature annotations within a long DNA sequence). Feature annotations within Genbank format files are extremely useful for being able to view a DNA sequence at a higher/more functional level, and allow for rapidly checking if a designed DNA assembly process will result in the desired sequence.<br><br>Currently, j5 does not properly handle "join"-ed features (as may be used to annotate eukaryotic coding sequences where introns intersperse exons), and the "label=" field for a given feature annotation is used to determine if two features (with the same name/label) should be spliced at a DNA assembly junction.'
                            }, {
                                xtype: 'button',
                                flex: 1,
                                cls: 'generatej5FastaFileBtn',
                                margin: 3,
                                maxHeight: 23,
                                text: '<b>Generate FASTA File</b>',
                                tooltip: 'A FASTA file is a text file that may contain one or more sequences. FASTA files do not contain sequence annotation. For the purposes of j5, and for maintaining well documented sequences in general, the Genbank file format is much preferred. Note that there is no standard file extension for FASTA files; j5 uses (.fas).'
                            }, {
                                xtype: 'button',
                                flex: 1,
                                cls: 'generatej5jbeiSeqFileBtn',
                                margin: 3,
                                maxHeight: 23,
                                text: '<b>Generate jbei-seq File</b>',
                                tooltip: 'jbei-seq format sequence files generally contain a single sequence each (although at times, you may see multiple ORF translated sequences embedded as feature annotations within a long DNA sequence). Feature annotations within jbei-seq format files are extremely useful for being able to view a DNA sequence at a higher/more functional level, and allow for rapidly checking if a designed DNA assembly process will result in the desired sequence.<br><br>Currently, the "seq:label" field for a given feature annotation is used to determine if two features (with the same name/label) should be spliced at a DNA assembly junction.<br><br>The jbei-seq format is based upon XML. Unlike Genbank format files, there is no requisite white space character counts for formatting purposes, and it is much easier for a computer program to parse.<br><br>For more information about the jbei-seq format, see the j5 manual'
                            }]
                        }, {
                            xtype: 'container',
                            flex: 1.3,
                            padding: 5,
                            layout: {
                                align: 'stretch',
                                type: 'vbox'
                            },
                            items: [{
                                xtype: 'button',
                                flex: 1,
                                cls: 'generatej5ParamsFileBtn',
                                margin: 3,
                                maxHeight: 23,
                                text: '<b>Generate j5 Parameters File</b>',
                                tooltip: 'The j5 parameters file is a CSV file that contains a list of all of the parameters that controls how j5 designs DNA assemblies.<br><br>The j5 parameters may be edited by clicking on the Edit Parameters button on the Run j5 on Server tab. Note that ASSEMBLY_PRODUCT_TYPE is the exception and is determined from the collection.'
                            }, {
                                xtype: 'button',
                                flex: 1,
                                cls: 'generatej5AutomationParamsBtn',
                                margin: 3,
                                maxHeight: 23,
                                text: '<b>Generate Downstream Automation Parameters File</b>',
                                tooltip: 'The downstream parameters file is a CSV file that contains a list of all of the parameters that controls how j5 designs downstream automation processes (such as distributing PCR reactions across a thermocycler block annealing temperature gradient).<br><br>The downstream automation parameters may be edited by clicking on the Edit Parameters button on the Downstream Automation tab.'
                            }]
                        }]
                    }, {
                        xtype: 'container',
                        flex: 0.3,
                        margin: 20,
                        layout: {
                            align: 'stretch',
                            pack: 'center',
                            type: 'hbox'
                        },
                        items: [{
                            xtype: 'button',
                            cls: 'downloadAllj5FilesBtn',
                            maxWidth: 150,
                            maxHeight: 23,
                            text: '<b>Download All Files</b>'
                        }]
                    }]
                }]
            }]
        });

        me.callParent(arguments);
    }

});
