Ext.define('Vede.view.RestrictionEnzymesManagerWindow', {
    extend: 'Ext.window.Window',
    requires: ['Ext.ux.form.Multiselect',
               'Ext.ux.form.ItemSelector'],

    height: 474,
    width: 551,
    layout: {
        align: 'stretch',
        type: 'vbox'
    },
    title: 'Restriction Enzyme Manager',
    resizable: false,
    draggable: false,
    modal: true,

    initComponent: function() {
        var groupStore = Ext.create("Ext.data.Store", {
            fields: [{name: "name", type: "string"}],
            data: []
        });

        var enzymeListStore = Ext.create("Ext.data.Store", {
            fields: [{name: "name", type: "string"}],
            data: [],
            sorters: [{property: "name", direction: "ASC"}]
        });

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
                            id: 'selectionAreaContainer',
                            layout: {
                                align: 'stretch',
                                type: 'hbox'
                            },
                            flex: 1,
                            items: [
                                {
                                    xtype: 'container',
                                    id: 'leftEnzymeSelectionContainer',
                                    padding: 3,
                                    layout: {
                                        align: 'stretch',
                                        padding: 3,
                                        type: 'vbox'
                                    },
                                    flex: 1,
                                    items: [
                                        {
                                            xtype: 'container',
                                            id: 'leftDropdownContainer',
                                            flex: 0.15,
                                            items: [
                                                {
                                                    xtype: 'combobox',
                                                    id: 'enzymeGroupSelector',
                                                    store: groupStore,
                                                    displayField: 'name',
                                                    fieldLabel: 'Enzymes',
                                                    labelAlign: 'top',
                                                    queryMode: 'local',
                                                    editable: false,
                                                    fieldLabel: 'Active Enzymes'

                                                }
                                            ]
                                        },
                                        {
                                            xtype: 'textfield',
                                            id: 'enzymeSearchField',
                                            fieldLabel: 'Label',
                                            hideLabel: true,
                                            emptyText: 'Enzyme name',
                                            maxWidth: 150
                                        },
                                        {
                                            xtype: 'itemselector',
                                            id: 'enzymeListSelector',
                                            imagePath: '../../../extjs/examples/ux/css/images/',
                                            store: enzymeListStore,
                                            displayField: 'name', 
                                            flex: 1,
                                            buttons: ["oneRight", "allRight",
                                                      "oneLeft", "allLeft"],
                                            buttonsText: {oneRight: ">", allRight: ">>",
                                                          oneLeft: "<", allLeft: "<<"}
                                        }
                                    ]
                                },
                            ]
                        },
                        {
                            xtype: 'container',
                            id: 'enzymeWindowRightButtonContainer',
                            layout: {
                                type: 'absolute'
                            },
                            flex: 0.3,
                            items: [
                                /*{
                                    xtype: 'container',
                                    height: 140,
                                    id: 'upperEnzymeGroupButtonContainer',
                                    padding: 2,
                                    width: 130,
                                    layout: {
                                        align: 'stretch',
                                        padding: 2,
                                        type: 'vbox'
                                    },
                                    x: -5,
                                    y: 60,
                                    items: [
                                        {
                                            xtype: 'button',
                                            margin: 2,
                                            text: 'New Group',
                                            flex: 1
                                        },
                                        {
                                            xtype: 'button',
                                            margin: 2,
                                            text: 'Remove Group',
                                            flex: 1
                                        },
                                        {
                                            xtype: 'button',
                                            margin: 2,
                                            text: 'Remove Enzyme',
                                            flex: 1
                                        },
                                        {
                                            xtype: 'button',
                                            margin: 2,
                                            text: 'Make Active',
                                            flex: 1
                                        }
                                    ]
                                },*/
                                {
                                    xtype: 'container',
                                    height: 70,
                                    id: 'lowerEnzymeGroupButtonContainer',
                                    padding: 2,
                                    width: 130,
                                    layout: {
                                        align: 'stretch',
                                        padding: 2,
                                        type: 'vbox'
                                    },
                                    x: -5,
                                    y: 170,
                                    items: [
                                        {
                                            xtype: 'button',
                                            margin: 2,
                                            text: 'Save as Group',
                                            id: 'saveGroupButton',
                                            flex: 1
                                        },
                                        {
                                            xtype: 'button',
                                            margin: 2,
                                            text: 'Delete Group',
                                            id: 'deleteGroupButton',
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
                    id: 'bottomButtonContainer',
                    margin: '',
                    padding: 0,
                    layout: {
                        type: 'absolute'
                    },
                    flex: 0.1,
                    items: [
                        {
                            xtype: 'container',
                            height: 40,
                            id: 'enzymeWindowCloseButtonContainer',
                            padding: 2,
                            width: 160,
                            layout: {
                                align: 'stretch',
                                padding: 2,
                                type: 'hbox'
                            },
                            x: 380,
                            y: 0,
                            items: [
                                {
                                    xtype: 'button',
                                    height: 23,
                                    id: 'restrictionEnzymesManagerOKButton',
                                    margin: 2,
                                    maxHeight: 28,
                                    padding: '',
                                    width: 69,
                                    text: 'OK'
                                },
                                {
                                    xtype: 'button',
                                    id: 'restrictionEnzymesManagerCancelButton',
                                    margin: 2,
                                    maxHeight: 28,
                                    width: 69,
                                    text: 'Cancel'
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
