Ext.define('Vede.view.DeviceEditor.j5Controls', {
    extend: 'Ext.window.Window',

    height: 412,
    width: 852,
    title: 'j5 Controls',
    resizable: false,
    draggable: false,
    modal: true,

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
                                            id: 'useServerPlasmidsRadioBtn',
                                            name: 'plasmidsListSource',
                                            fieldLabel: '<b>Master Plasmids List</b>',
                                            labelWidth: 200,
                                            boxLabel: 'Use latest server version'
                                        },
                                        {
                                            xtype: 'radiofield',
                                            id: 'useEmptyPlasmidsRadioBtn',
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
                                            allowBlank: false,
                                            margin: '',
                                            fieldLabel: 'or',
                                            hideLabel: false,
                                            labelPad: 15,
                                            labelSeparator: ' ',
???LINES MISSING
???LINES MISSING
???LINES MISSING
???LINES MISSING
???LINES MISSING
???LINES MISSING
???LINES MISSING
                                                {
                                                    xtype: 'button',
                                                    flex: 1,
                                                    id: 'generatej5AutomationParamsBtn',
                                                    margin: 3,
                                                    maxHeight: 23,
                                                    text: '<b>Generate Downstream Automation Parameters File</b>',
                                                    tooltip: 'The downstream parameters file is a CSV file that contains a list of all of the parameters that controls how j5 designs downstream automation processes (such as distributing PCR reactions across a thermocycler block annealing temperature gradient).<br><br>The downstream automation parameters may be edited by clicking on the Edit Parameters button on the Downstream Automation tab.'
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
