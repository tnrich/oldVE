/**
 * @class Vede.view.ve.EditSequenceFeatureWindow
 */
Ext.define('Vede.view.ve.EditSequenceFeatureWindow', {
    extend: 'Ext.window.Window',

    height: 450,
    id: 'EditSequenceFeature',
    modal: true,
    width: 400,
    layout: {
        type: 'fit'
    },
    title: 'Edit Feature',

    initComponent: function() {
    	var me = this;

        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'form',
                    height: 452,
                    width: 282,
                    bodyPadding: 10,
                    items: [
                        {
                        	xtype: 'textfield',
                            width: 325,
                            fieldLabel: 'Name',
                            id: 'editSequenceFeatureWindowNameField',
                            allowBlank: false
                        },
                        {
                            xtype: 'radiogroup',
                            height: 30,
                            width: 326,
                            fieldLabel: 'Strand',
                            id: 'editSequenceFeatureWindowStrandRadioGroup',
                            allowBlank: false,
                            items: [
                                {
                                    xtype: 'radiofield',
                                    name: 'strandSelector',
                                    labelAlign: 'right',
                                    boxLabel: 'Positive',
                                    id: 'editSequenceFeatureWindowPositiveCheckBox',
                                    inputValue: 1
                                },
                                {
                                    xtype: 'radiofield',
                                    name: 'strandSelector',
                                    labelAlign: 'right',
                                    boxLabel: 'Negative',
                                    id: 'editSequenceFeatureWindowNegativeCheckBox',
                                    inputValue: -1
                                }
                            ]
                        },
                        {
                            xtype: 'combobox',
                            width: 323,
                            fieldLabel: 'Type',
                            id: 'editSequenceFeatureWindowTypeComboBox',
                            editable: false,
                            store: {
                            	fields: ['label', 'data'],
                            	data: Teselagen.constants.Constants.FEATURE_TYPES
                            },
                            queryMode: 'local',
                            displayField: 'label',
                            valueField: 'data'
                        },
                        {
                            xtype: 'fieldcontainer',
                            height: 68,
                            width: 331,
                            fieldLabel: 'Location',
                            items: [
                                {
                                    xtype: 'numberfield',
                                    allowDecimals: false,
                                    width: 217,
                                    fieldLabel: 'Start',
                                    id: 'editSequenceFeatureWindowStartField',
                                    labelWidth: 50,
                                    value: 1,
                                    minValue: 1,
                                    allowBlank: false,
                                    maxValue: 1
                                },
                                {
                                    xtype: 'numberfield',
                                    allowDecimals: false,
                                    width: 217,
                                    fieldLabel: 'End',
                                    id: 'editSequenceFeatureWindowEndField',
                                    labelWidth: 50,
                                    value: 1,
                                    minValue: 1,
                                    allowBlank: false,
                                    maxValue: 1
                                }
                            ]
                        },
                        {
                            xtype: 'fieldcontainer',
                            height: 144,
                            fieldLabel: 'Attributes',                           
                            items: [
                                {
                                    xtype: 'gridpanel',
                                    id: 'editSequenceFeatureWindowAttributesGridPanel',
                                    width: 216,
                                    height: 144,                                  
                                    forceFit: true,
                                    scroll: 'vertical',
                                    columnLines: true,                         
                                    store: {
                                    	fields: ['key', 'value'],
                                    	data: [
                                    	    {key: '', value: ''},
                                    	    {key: '', value: ''},
                                    	    {key: '', value: ''},
                                    	    {key: '', value: ''}
                                    	]
                                    },
                                    numberOfLines: 1, 
                                    columns: [
                                        {header: 'Key', dataIndex: 'key', editor: 'textfield'},
                                        {header: 'Value', dataIndex: 'value', editor: 'textfield'}
                                    ],
                                    viewConfig: { 
                                    },                                  
                                    selType: 'cellmodel',
                                    plugins: [
                                        Ext.create('Ext.grid.plugin.CellEditing', {
                                            ptype: 'cellediting',
                                            clicksToEdit: 1,
                                            listeners: {
                                                beforeedit: function(editor, e){
                                                	if (e.rowIdx >= Ext.getCmp("editSequenceFeatureWindowAttributesGridPanel").numberOfLines)
                                                        return false;
                                                }
                                            }
                                        })
                                    ]
                                }
                            ]
                        }
                    ],
                    dockedItems: [
                        {
                            xtype: 'panel',
                            dock: 'bottom',
                            border: 0,
                            dockedItems: [
                                {
                                    xtype: 'panel',
                                    dock: 'top',
                                    layout: {
                                        pack: 'end',
                                        type: 'hbox'
                                    },
                                    items: [
                                        {
                                            xtype: 'button',
                                            margin: 10,
                                            padding: 5,
                                            text: 'Cancel',
                                            handler: function() {me.close();}
                                        },
                                        {
                                            xtype: 'tbseparator'
                                        },
                                        {
                                            xtype: 'button',
                                            id: 'editSequenceFeatureWindowOKButton',
                                            margin: 10,
                                            padding: 5,
                                            text: 'Ok'                                          
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