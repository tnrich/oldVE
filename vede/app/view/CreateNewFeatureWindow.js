/**
 * Restriction enzymes manager window
 * @class Vede.view.RestrictionEnzymesManagerWindow
 * @author Jenhan Tao
 */
Ext.define('Vede.view.CreateNewFeatureWindow', {
    extend: 'Ext.window.Window',

    height: 326,
    id: 'CreateNewFeature',
    modal: true,
    width: 400,
    layout: {
        type: 'fit'
    },
    title: 'CreateNewFeature',

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
                            fieldLabel: 'Name'
                        },
                        {
                            xtype: 'radiogroup',
                            fieldLabel: 'Strand',
                            items: [
                                {
                                    xtype: 'radiofield',
                                    boxLabel: 'Positive'
                                },
                                {
                                    xtype: 'radiofield',
                                    boxLabel: 'Negative'
                                }
                            ]
                        },
                        {
                            xtype: 'combobox',
                            fieldLabel: 'Type'
                        },
                        {
                            xtype: 'fieldcontainer',
                            height: 68,
                            width: 359,
                            fieldLabel: 'Location',
                            items: [
                                {
                                    xtype: 'numberfield',
                                    fieldLabel: 'Start'
                                },
                                {
                                    xtype: 'numberfield',
                                    fieldLabel: 'End'
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
                                    width: 230,
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

                                    }
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