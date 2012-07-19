/*
 * File: app/view/RestrictionEnzymeManagerWindow.js
 *
 * This file was generated by Sencha Architect version 2.0.0.
 * http://www.sencha.com/products/architect/
 *
 * This file requires use of the Ext JS 4.0.x library, under independent license.
 * License of Sencha Architect does not include license for Ext JS 4.0.x. For more
 * details see http://www.sencha.com/license or contact license@sencha.com.
 *
 * This file will be auto-generated each and everytime you save your project.
 *
 * Do NOT hand edit this file.
 */

Ext.define('MyApp.view.RestrictionEnzymeManagerWindow', {
    extend: 'Ext.window.Window',

    height: 468,
    width: 545,
    resizable: false,
    layout: {
        align: 'stretch',
        type: 'vbox'
    },
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
                    flex: 1,
                    items: [
                        {
                            xtype: 'container',
                            padding: 2,
                            layout: {
                                align: 'stretch',
                                padding: 2,
                                type: 'vbox'
                            },
                            flex: 1.5,
                            items: [
                                {
                                    xtype: 'combobox',
                                    id: 'enzymeCollectionSelector',
                                    fieldLabel: 'Enzymes',
                                    labelAlign: 'top',
                                    allowBlank: false,
                                    forceSelection: true,
                                    flex: 0.5
                                },
                                {
                                    xtype: 'textfield',
                                    id: 'enzymeSearchField',
                                    fieldLabel: 'Label',
                                    hideLabel: true,
                                    emptyText: 'Enzyme name',
                                    flex: 0.5
                                }
                            ]
                        },
                        {
                            xtype: 'container',
                            layout: {
                                type: 'absolute'
                            },
                            flex: 0.6,
                            items: [
                                {
                                    xtype: 'container',
                                    height: 70,
                                    width: 70,
                                    layout: {
                                        align: 'stretch',
                                        padding: 5,
                                        type: 'vbox'
                                    },
                                    x: 0,
                                    y: 100,
                                    items: [
                                        {
                                            xtype: 'button',
                                            border: '',
                                            height: 23,
                                            id: 'addEnzymeToGroupBtn',
                                            margin: 2,
                                            maxHeight: 23,
                                            minHeight: 23,
                                            padding: '',
                                            width: 52,
                                            text: '>'
                                        },
                                        {
                                            xtype: 'button',
                                            height: 23,
                                            id: 'addAllToGroupBtn',
                                            margin: 2,
                                            maxHeight: 23,
                                            minHeight: 23,
                                            padding: '',
                                            text: '>>',
                                            flex: 1
                                        }
                                    ]
                                },
                                {
                                    xtype: 'container',
                                    height: 70,
                                    width: 70,
                                    layout: {
                                        align: 'stretch',
                                        padding: 5,
                                        type: 'vbox'
                                    },
                                    x: 0,
                                    y: 300,
                                    items: [
                                        {
                                            xtype: 'button',
                                            border: '',
                                            height: 23,
                                            id: 'activateEnzymeBtn',
                                            margin: 2,
                                            maxHeight: 23,
                                            minHeight: 23,
                                            padding: '',
                                            width: 52,
                                            text: '>'
                                        },
                                        {
                                            xtype: 'button',
                                            height: 23,
                                            id: 'activateAllBtn',
                                            margin: 2,
                                            maxHeight: 23,
                                            minHeight: 23,
                                            padding: '',
                                            text: '>>',
                                            flex: 1
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            xtype: 'container',
                            layout: {
                                align: 'stretch',
                                type: 'vbox'
                            },
                            flex: 1.5,
                            items: [
                                {
                                    xtype: 'combobox',
                                    id: 'enzymeGroupSelector',
                                    padding: 2,
                                    fieldLabel: 'Groups',
                                    labelAlign: 'top',
                                    allowBlank: false,
                                    forceSelection: true,
                                    flex: 1
                                }
                            ]
                        },
                        {
                            xtype: 'container',
                            layout: {
                                type: 'absolute'
                            },
                            flex: 1,
                            items: [
                                {
                                    xtype: 'container',
                                    height: 130,
                                    width: 120,
                                    layout: {
                                        align: 'stretch',
                                        type: 'vbox'
                                    },
                                    x: -2,
                                    y: 50,
                                    items: [
                                        {
                                            xtype: 'button',
                                            id: 'newGroupBtn',
                                            margin: 2,
                                            maxHeight: 23,
                                            minHeight: 23,
                                            text: 'New Group',
                                            flex: 1
                                        },
                                        {
                                            xtype: 'button',
                                            id: 'removeGroupBtn',
                                            margin: 2,
                                            maxHeight: 23,
                                            minHeight: 23,
                                            text: 'Remove Group',
                                            flex: 1
                                        },
                                        {
                                            xtype: 'button',
                                            id: 'removeEnzymeBtn',
                                            margin: 2,
                                            maxHeight: 23,
                                            minHeight: 23,
                                            text: 'Remove Enzyme',
                                            flex: 1
                                        },
                                        {
                                            xtype: 'button',
                                            id: 'makeActiveBtn',
                                            margin: 2,
                                            maxHeight: 23,
                                            minHeight: 23,
                                            text: 'Make Active',
                                            flex: 1
                                        }
                                    ]
                                },
                                {
                                    xtype: 'container',
                                    height: 60,
                                    width: 120,
                                    layout: {
                                        align: 'stretch',
                                        type: 'vbox'
                                    },
                                    x: -2,
                                    y: 300,
                                    items: [
                                        {
                                            xtype: 'button',
                                            id: 'saveGroupBtn',
                                            margin: 2,
                                            maxHeight: 23,
                                            minHeight: 23,
                                            text: 'Save as Group',
                                            flex: 1
                                        },
                                        {
                                            xtype: 'button',
                                            id: 'removeEnzymeBtn',
                                            margin: 2,
                                            maxHeight: 23,
                                            minHeight: 23,
                                            text: 'Remove Enzyme',
                                            flex: 1
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    xtype: 'container',
                    layout: {
                        align: 'stretch',
                        type: 'hbox'
                    },
                    flex: 0.1,
                    items: [
                        {
                            xtype: 'splitter',
                            width: 100,
                            flex: 2
                        },
                        {
                            xtype: 'container',
                            height: 40,
                            width: 240,
                            layout: {
                                align: 'stretch',
                                padding: 2,
                                type: 'hbox'
                            },
                            flex: 1,
                            items: [
                                {
                                    xtype: 'button',
                                    margin: 2,
                                    text: 'OK',
                                    flex: 1
                                },
                                {
                                    xtype: 'button',
                                    margin: 2,
                                    padding: '',
                                    text: 'Cancel',
                                    flex: 1
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