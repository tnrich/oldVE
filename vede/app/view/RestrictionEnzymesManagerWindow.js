/**
 * Restriction enzymes manager window
 * @class Vede.view.RestrictionEnzymesManagerWindow
 * @author Jenhan Tao
 */
Ext.define('Vede.view.RestrictionEnzymesManagerWindow', {
    extend: 'Ext.window.Window',

    height: 460,
    id: 'RestrictionEnzymeWindowManager',
    modal: true,
    width: 340,
    title: 'Restriction Enzyme Manager',

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
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
                            items: [
                                {
                                    xtype: 'combobox',
                                    id: 'GroupComboBox',
                                    width: 150,
                                    fieldLabel: 'Active Enzymes:',
                                    labelAlign: 'top'
                                },
                                {
                                    xtype: 'textfield',
                                    id: 'EnzymeSearchBox',
                                    fieldLabel: '',
                                    emptyText: 'Search...'
                                }
                            ]
                        },
                        {
                            xtype: 'container',
                            flex: 1,
                            layout: {
                                align: 'center',
                                defaultMargins: {
                                    top: 5,
                                    right: 5,
                                    bottom: 5,
                                    left: 5
                                },
                                type: 'vbox'
                            },
                            items: [
                                {
                                    xtype: 'button',
                                    height: 30,
                                    id: 'SaveGroupButton',
                                    maxHeight: 30,
                                    maxWidth: 100,
                                    minHeight: 30,
                                    minWidth: 100,
                                    width: 100,
                                    text: 'Save as Group'
                                },
                                {
                                    xtype: 'button',
                                    flex: 1,
                                    height: 30,
                                    id: 'DeleteGroupButton',
                                    maxHeight: 30,
                                    maxWidth: 100,
                                    minHeight: 30,
                                    minWidth: 100,
                                    width: 100,
                                    text: 'Delete Group'
                                }
                            ]
                        }
                    ]
                },
                {
                    xtype: 'container',
                    width: 322,
                    layout: {
                        align: 'stretch',
                        type: 'hbox'
                    },
                    items: [
                        {
                            xtype: 'gridpanel',
                            height: 305,
                            id: 'AvailableEnzymeGridPanel',
                            width: 148,
                            frameHeader: false,
                            title: '',
                            enableColumnHide: false,
                            enableColumnMove: false,
                            enableColumnResize: false,
                            columns: [
                                {
                                    xtype: 'gridcolumn',
                                    draggable: false,
                                    width: 139,
                                    resizable: false,
                                    detachOnRemove: false,
                                    sortable: false,
                                    dataIndex: 'string',
                                    hideable: false,
                                    text: ''
                                }
                            ]
                        },
                        {
                            xtype: 'container',
                            flex: 1,
                            maxWidth: 30,
                            minWidth: 30,
                            width: 30,
                            layout: {
                                type: 'column'
                            },
                            items: [
                                {
                                    xtype: 'button',
                                    id: 'selectAllButton',
                                    maxWidth: 30,
                                    minWidth: 30,
                                    text: '>>'
                                },
                                {
                                    xtype: 'button',
                                    id: 'selectButton',
                                    maxWidth: 30,
                                    minWidth: 30,
                                    text: '>'
                                },
                                {
                                    xtype: 'button',
                                    id: 'deselectButton',
                                    maxWidth: 30,
                                    minWidth: 30,
                                    text: '<'
                                },
                                {
                                    xtype: 'button',
                                    id: 'deselectAllButton',
                                    maxWidth: 30,
                                    minWidth: 30,
                                    text: '<<'
                                }
                            ]
                        },
                        {
                            xtype: 'gridpanel',
                            height: 305,
                            id: 'SelectedEnzymeGridPanel',
                            width: 141,
                            frameHeader: false,
                            title: '',
                            enableColumnHide: false,
                            enableColumnMove: false,
                            enableColumnResize: false,
                            columns: [
                                {
                                    xtype: 'gridcolumn',
                                    draggable: false,
                                    width: 139,
                                    resizable: false,
                                    detachOnRemove: false,
                                    sortable: false,
                                    dataIndex: 'string',
                                    hideable: false,
                                    text: ''
                                }
                            ]
                        }
                    ]
                },
                {
                    xtype: 'container',
                    height: 43,
                    items: [
                        {
                            xtype: 'button',
                            id: 'OkButton',
                            text: 'Ok'
                        },
                        {
                            xtype: 'button',
                            id: 'CancelButton',
                            text: 'Cancel'
                        }
                    ]
                }
            ]
        });

        me.callParent(arguments);
    }

});