/**
 * Restriction enzymes manager window
 * @class Vede.view.RestrictionEnzymesManagerWindow
 * @author Jenhan Tao
 */
Ext.define('Vede.view.CreateNewFeatureWindow', {
    extend: 'Ext.window.Window',

    height: 450,
    id: 'CreateNewFeature',
    modal: true,
    width: 400,
    layout: {
        type: 'fit'
    },
    title: 'Create New Feature',

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
                            allowBlank: false,
                        },
                        {
                            xtype: 'radiogroup',
                            height: 30,
                            width: 326,
                            fieldLabel: 'Strand',
                            allowBlank: false,
                            items: [
                                {
                                    xtype: 'radiofield',
                                    name: 'strandSelector',
                                    labelAlign: 'right',
                                    boxLabel: 'Positive'
                                },
                                {
                                    xtype: 'radiofield',
                                    name: 'strandSelector',
                                    labelAlign: 'right',
                                    boxLabel: 'Negative'
                                }
                            ]
                        },
                        {
                            xtype: 'combobox',
                            width: 323,
                            fieldLabel: 'Type'
                        },
                        {
                            xtype: 'fieldcontainer',
                            height: 68,
                            width: 331,
                            fieldLabel: 'Location',
                            items: [
                                {
                                    xtype: 'numberfield',
                                    width: 217,
                                    fieldLabel: 'Start',
                                    labelWidth: 50
                                },
                                {
                                    xtype: 'numberfield',
                                    width: 217,
                                    fieldLabel: 'End',
                                    labelWidth: 50
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
                                    width: 216,
                                    forceFit: true,
                                    columnLines: true,
                                    columns: [
                                        {
                                            xtype: 'gridcolumn',
                                            dataIndex: 'string',
                                            text: 'Key'
                                        },
                                        {
                                            xtype: 'gridcolumn',
                                            dataIndex: 'string',
                                            text: 'Value'
                                        }
                                    ],
                                    viewConfig: {

                                    },
                                    plugins: [
                                        Ext.create('Ext.grid.plugin.CellEditing', {
                                            ptype: 'cellediting'
                                        }),
                                        Ext.create('Ext.grid.plugin.RowEditing', {
                                            ptype: 'rowediting'
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
                                    xtype: 'toolbar',
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
                                            text: 'Cancel'
                                        },
                                        {
                                            xtype: 'tbseparator'
                                        },
                                        {
                                            xtype: 'button',
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