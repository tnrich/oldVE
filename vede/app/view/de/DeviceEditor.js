Ext.define('Vede.view.de.DeviceEditor', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.DeviceEditorPanel',

                            id: 'DeviceEditorPanel',
                            layout: {
                                type: 'fit'
                            },
                            frameHeader: false,
                            title: 'Device Editor',
                            dockedItems: [
                                {
                                    xtype: 'panel',
                                    dock: 'top',
                                    hidden: false,
                                    id: 'DeviceEditorMenuPanel',
                                    width: 150,
                                    layout: {
                                        type: 'fit'
                                    },
                                    dockedItems: [
                                        {
                                            xtype: 'toolbar',
                                            dock: 'top',
                                            id: 'DeviceEditorMenuBar',
                                            items: [
                                                {
                                                    xtype: 'button',
                                                    text: 'New'
                                                },
                                                {
                                                    xtype: 'button',
                                                    text: 'Load',
                                                    menu: {
                                                        xtype: 'menu',
                                                        minWidth: 140,
                                                        width: 140,
                                                        items: [
                                                            {
                                                                xtype: 'menuitem',
                                                                text: 'Design XML'
                                                            },
                                                            {
                                                                xtype: 'menuitem',
                                                                text: 'j5 File'
                                                            },
                                                            {
                                                                xtype: 'menuitem',
                                                                text: 'Example Design',
                                                                menu: {
                                                                    xtype: 'menu',
                                                                    minWidth: 220,
                                                                    width: 220,
                                                                    items: [
                                                                        {
                                                                            xtype: 'menuitem',
                                                                            text: 'SLIC/Gibson/CPEC'
                                                                        },
                                                                        {
                                                                            xtype: 'menuitem',
                                                                            text: 'Combinatorial SLIC/Gibson/CPEC'
                                                                        },
                                                                        {
                                                                            xtype: 'menuitem',
                                                                            text: 'Golden Gate'
                                                                        },
                                                                        {
                                                                            xtype: 'menuitem',
                                                                            text: 'Combinatorial Golden Gate'
                                                                        }
                                                                    ]
                                                                }
                                                            }
                                                        ]
                                                    }
                                                },
                                                {
                                                    xtype: 'button',
                                                    text: 'Save'
                                                },
                                                {
                                                    xtype: 'button',
                                                    text: 'Export'
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    xtype: 'panel',
                                    dock: 'top',
                                    hidden: false,
                                    id: 'DeviceEditorToolPanel',
                                    width: 150,
                                    layout: {
                                        type: 'fit'
                                    },
                                    dockedItems: [
                                        {
                                            xtype: 'toolbar',
                                            dock: 'top',
                                            items: [
                                                {
                                                    xtype: 'button',
                                                    id: 'add_column_Btn',
                                                    icon: 'resources/images/icons/device/add_column.png',
                                                    scale: 'large',
                                                    tooltip: 'Add Column'
                                                },
                                                {
                                                    xtype: 'tbseparator'
                                                },
                                                {
                                                    xtype: 'button',
                                                    id: 'add_row_Btn',
                                                    icon: 'resources/images/icons/device/add_row.png',
                                                    scale: 'large',
                                                    tooltip: 'Add Row'
                                                },
                                                {
                                                    xtype: 'tbseparator'
                                                },
                                                {
                                                    xtype: 'button',
                                                    id: 've_init_Btn',
                                                    icon: 'resources/images/icons/device/ve_icon.png',
                                                    scale: 'large',
                                                    tooltip: 'Vector Editor',
                                                    menu: {
                                                        xtype: 'menu',
                                                        id: 'de_ve_menu',
                                                        minWidth: 160,
                                                        width: 120,
                                                        items: [
                                                            {
                                                                xtype: 'menuitem',
                                                                text: 'Map From Clipboard'
                                                            },
                                                            {
                                                                xtype: 'menuitem',
                                                                text: 'Map From Genbank'
                                                            },
                                                            {
                                                                xtype: 'menuitem',
                                                                text: 'Go To Vector Editor'
                                                            }
                                                        ]
                                                    }
                                                },
                                                {
                                                    xtype: 'tbseparator'
                                                },
                                                {
                                                    xtype: 'button',
                                                    id: 'j5_init_Btn',
                                                    icon: 'resources/images/icons/device/j5_icon.png',
                                                    scale: 'large',
                                                    tooltip: 'j5'
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    xtype: 'panel',
                                    dock: 'bottom',
                                    height: 23,
                                    id: 'StatusPanel',
                                    layout: {
                                        type: 'fit'
                                    },
                                    headerPosition: 'bottom',
                                    dockedItems: [
                                        {
                                            xtype: 'toolbar',
                                            dock: 'top',
                                            id: 'StatusBar',
                                            items: [
                                                {
                                                    xtype: 'tbfill'
                                                },
                                                {
                                                    xtype: 'tbseparator'
                                                },
                                                {
                                                    xtype: 'tbtext',
                                                    text: 'Read only'
                                                },
                                                {
                                                    xtype: 'tbseparator'
                                                },
                                                {
                                                    xtype: 'tbspacer',
                                                    width: 10
                                                },
                                                {
                                                    xtype: 'tbseparator'
                                                },
                                                {
                                                    xtype: 'tbtext',
                                                    text: '- : -'
                                                },
                                                {
                                                    xtype: 'tbseparator'
                                                },
                                                {
                                                    xtype: 'tbtext',
                                                    text: '0'
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ],
                            items: [
                                {
                                    xtype: 'container',
                                    id: 'DeviceEditorContainer',
                                    layout: {
                                        align: 'stretch',
                                        type: 'hbox'
                                    },
                                    items: [
                                        {
                                            xtype: 'panel',
                                            flex: 1,
                                            id: 'DeviceEditorCanvas',
                                            width: 159,
                                            layout: {
                                                type: 'fit'
                                            },
                                            animCollapse: false,
                                            dockedItems: [
                                                {
                                                    xtype: 'panel',
                                                    dock: 'top',
                                                    id: 'DeviceEditorPartPanel',
                                                    collapseDirection: 'top',
                                                    collapsed: true,
                                                    collapsible: true,
                                                    hideCollapseTool: false,
                                                    title: 'Parts',
                                                    titleCollapse: true,
                                                    dockedItems: [
                                                        {
                                                            xtype: 'toolbar',
                                                            dock: 'top',
                                                            height: 45,
                                                            id: 'DeviceEditorPartsBar',
                                                            enableOverflow: true,
                                                            layout: {
                                                                align: 'middle',
                                                                pack: 'center',
                                                                type: 'hbox'
                                                            },
                                                            items: [
                                                                {
                                                                    xtype: 'button',
                                                                    id: 'ori_Btn',
                                                                    icon: 'resources/images/symbols/origin-of-replication.png',
                                                                    scale: 'large',
                                                                    tooltip: 'Origin of Replication'
                                                                },
                                                                {
                                                                    xtype: 'tbseparator'
                                                                },
                                                                {
                                                                    xtype: 'button',
                                                                    id: 'cds_Btn',
                                                                    icon: 'resources/images/symbols/cds.png',
                                                                    scale: 'large',
                                                                    tooltip: 'CDS'
                                                                },
                                                                {
                                                                    xtype: 'tbseparator'
                                                                },
                                                                {
                                                                    xtype: 'button',
                                                                    id: 'five_prime_ov_Btn',
                                                                    icon: 'resources/images/symbols/five-prime-overhang.png',
                                                                    scale: 'large',
                                                                    tooltip: '5\' Overhang'
                                                                },
                                                                {
                                                                    xtype: 'tbseparator'
                                                                },
                                                                {
                                                                    xtype: 'button',
                                                                    id: 'three_prime_ov_Btn',
                                                                    icon: 'resources/images/symbols/three-prime-overhang.png',
                                                                    scale: 'large',
                                                                    tooltip: '3\' Overhang'
                                                                },
                                                                {
                                                                    xtype: 'tbseparator'
                                                                },
                                                                {
                                                                    xtype: 'button',
                                                                    id: 'translational_start_site_Btn',
                                                                    icon: 'resources/images/symbols/translational-start-site.png',
                                                                    scale: 'large',
                                                                    tooltip: 'Translational Start Site'
                                                                },
                                                                {
                                                                    xtype: 'tbseparator'
                                                                },
                                                                {
                                                                    xtype: 'button',
                                                                    id: 'promoter_Btn',
                                                                    icon: 'resources/images/symbols/promoter.png',
                                                                    scale: 'large',
                                                                    tooltip: 'Promoter'
                                                                },
                                                                {
                                                                    xtype: 'tbseparator'
                                                                },
                                                                {
                                                                    xtype: 'button',
                                                                    id: 'primer_binding_site_Btn',
                                                                    icon: 'resources/images/symbols/primer-binding-site.png',
                                                                    scale: 'large',
                                                                    tooltip: 'Primer Binding Site'
                                                                },
                                                                {
                                                                    xtype: 'tbseparator'
                                                                },
                                                                {
                                                                    xtype: 'button',
                                                                    id: 'restriction_enz_recog_site_Btn',
                                                                    icon: 'resources/images/symbols/restriction-enzyme-recognition-site.png',
                                                                    scale: 'large',
                                                                    tooltip: 'Restriction Enzyme Recognition Site'
                                                                },
                                                                {
                                                                    xtype: 'tbseparator'
                                                                },
                                                                {
                                                                    xtype: 'button',
                                                                    id: 'restriction_site_w_no_overhang_Btn',
                                                                    icon: 'resources/images/symbols/restriction-site-with-no-overhang.png',
                                                                    scale: 'large',
                                                                    tooltip: 'Restriction Site With No Overhangs'
                                                                },
                                                                {
                                                                    xtype: 'tbseparator'
                                                                },
                                                                {
                                                                    xtype: 'button',
                                                                    id: 'protease_site_Btn',
                                                                    icon: 'resources/images/symbols/protease-site.png',
                                                                    scale: 'large',
                                                                    tooltip: 'Protease Site'
                                                                },
                                                                {
                                                                    xtype: 'tbseparator'
                                                                },
                                                                {
                                                                    xtype: 'button',
                                                                    id: 'protein_stability_element_Btn',
                                                                    icon: 'resources/images/symbols/protein-stability-element.png',
                                                                    scale: 'large',
                                                                    tooltip: 'Protein Stability Element'
                                                                },
                                                                {
                                                                    xtype: 'tbseparator'
                                                                },
                                                                {
                                                                    xtype: 'button',
                                                                    id: 'assembly_junction_Btn',
                                                                    icon: 'resources/images/symbols/assembly-junction.png',
                                                                    scale: 'large',
                                                                    tooltip: 'Assembly Junction'
                                                                },
                                                                {
                                                                    xtype: 'tbseparator'
                                                                },
                                                                {
                                                                    xtype: 'button',
                                                                    id: 'insulator_Btn',
                                                                    icon: 'resources/images/symbols/insulator.png',
                                                                    scale: 'large',
                                                                    tooltip: 'Insulator'
                                                                },
                                                                {
                                                                    xtype: 'tbseparator'
                                                                },
                                                                {
                                                                    xtype: 'button',
                                                                    id: 'operator_Btn',
                                                                    icon: 'resources/images/symbols/operator.png',
                                                                    scale: 'large',
                                                                    tooltip: 'Operator'
                                                                },
                                                                {
                                                                    xtype: 'tbseparator'
                                                                },
                                                                {
                                                                    xtype: 'button',
                                                                    id: 'ribonuclease_site_Btn',
                                                                    icon: 'resources/images/symbols/ribonuclease-site.png',
                                                                    scale: 'large',
                                                                    tooltip: 'Ribonuclease Site'
                                                                },
                                                                {
                                                                    xtype: 'tbseparator'
                                                                },
                                                                {
                                                                    xtype: 'button',
                                                                    id: 'rna_stability_element_Btn',
                                                                    icon: 'resources/images/symbols/rna-stability-element.png',
                                                                    scale: 'large',
                                                                    tooltip: 'RNA Stability Element'
                                                                },
                                                                {
                                                                    xtype: 'tbseparator'
                                                                },
                                                                {
                                                                    xtype: 'button',
                                                                    id: 'terminator_Btn',
                                                                    icon: 'resources/images/symbols/terminator.png',
                                                                    scale: 'large',
                                                                    tooltip: 'Terminator'
                                                                },
                                                                {
                                                                    xtype: 'tbseparator'
                                                                },
                                                                {
                                                                    xtype: 'button',
                                                                    id: 'signature_Btn',
                                                                    icon: 'resources/images/symbols/signature.png',
                                                                    params: 'Signature',
                                                                    scale: 'large',
                                                                    tooltip: 'Signature'
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ],
                                            items: [
                                                {
                                                    xtype: 'container',
                                                    id: 'designContainer',
                                                    margin: 10
                                                }
                                            ]
                                        },
                                        {
                                            xtype: 'tabpanel',
                                            flex: 2,
                                            id: 'InspectorPanel',
                                            maxWidth: 400,
                                            collapseDirection: 'right',
                                            collapsed: false,
                                            collapsible: true,
                                            headerPosition: 'left',
                                            hideCollapseTool: false,
                                            title: 'Inspector',
                                            titleCollapse: true,
                                            activeTab: 0,
                                            minTabWidth: 130,
                                            plain: false,
                                            removePanelHeader: false,
                                            items: [
                                                {
                                                    xtype: 'panel',
                                                    layout: {
                                                        align: 'stretch',
                                                        type: 'vbox'
                                                    },
                                                    title: 'Part Info',
                                                    items: [
                                                        {
                                                            xtype: 'form',
                                                            flex: 1,
                                                            height: 160,
                                                            id: 'PartPropertiesForm',
                                                            maxHeight: 170,
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
                                                                    id: 'partNameField',
                                                                    fieldLabel: 'Part Name'
                                                                },
                                                                {
                                                                    xtype: 'displayfield',
                                                                    height: 20,
                                                                    id: 'partSourceField',
                                                                    fieldLabel: 'Part Source'
                                                                },
                                                                {
                                                                    xtype: 'displayfield',
                                                                    height: 20,
                                                                    id: 'reverseComplementField',
                                                                    fieldLabel: 'Reverse Complement',
                                                                    labelWidth: 120
                                                                },
                                                                {
                                                                    xtype: 'displayfield',
                                                                    height: 20,
                                                                    id: 'startBPField',
                                                                    fieldLabel: 'Start BP'
                                                                },
                                                                {
                                                                    xtype: 'displayfield',
                                                                    height: 20,
                                                                    id: 'stopBPField',
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
                                                            id: 'collectionInfoForm',
                                                            bodyBorder: false,
                                                            bodyPadding: 10,
                                                            items: [
                                                                {
                                                                    xtype: 'displayfield',
                                                                    anchor: '100%',
                                                                    id: 'j5_ready_field',
                                                                    value: 'Display Field',
                                                                    fieldLabel: 'j5 Ready'
                                                                },
                                                                {
                                                                    xtype: 'displayfield',
                                                                    anchor: '100%',
                                                                    id: 'combinatorial_field',
                                                                    value: 'Display Field',
                                                                    fieldLabel: 'Combinatorial'
                                                                },
                                                                {
                                                                    xtype: 'radiogroup',
                                                                    id: 'plasmid_geometry',
                                                                    fieldLabel: 'Plasmid Type',
                                                                    allowBlank: false,
                                                                    items: [
                                                                        {
                                                                            xtype: 'radiofield',
                                                                            id: 'circular_plasmid_radio',
                                                                            name: 'plasmidtype',
                                                                            boxLabel: 'Circular',
                                                                            checked: true
                                                                        },
                                                                        {
                                                                            xtype: 'radiofield',
                                                                            id: 'linear_plasmid_radio',
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
                                                                    id: 'inspector_containerActions',
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
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }

);