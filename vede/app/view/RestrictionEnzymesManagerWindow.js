/**
 * Restriction enzymes manager window
 * @ignore
 * @class Vede.view.RestrictionEnzymesManagerWindow
 * @author Nick Elsbree
 */
Ext.define("Vede.view.RestrictionEnzymesManagerWindow", {
    extend: "Ext.window.Window",
    requires: ["Vede.view.form.ItemSelector"],

    height: 474,
    width: 551,
    layout: {
        align: "stretch",
        type: "vbox"
    },
    title: "Restriction Enzyme Manager",
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
                    xtype: "container",
                    layout: {
                        align: "stretch",
                        type: "hbox"
                    },
//                    flex: 1,
                    items: [
                        {
                            xtype: "container",
                            layout: {
                                align: "stretch",
                                type: "vbox"
                            },
//                            flex: 1,
                            items: [
                                {
                                    xtype: "combobox",
                                    id: "enzymeGroupSelector",
                                    store: groupStore,
                                    displayField: "name",
                                    fieldLabel: "Enzyme Groups",
                                    labelAlign: "top",
                                    queryMode: "local",
                                    editable: false
                                },
                                {
                                    xtype: "textfield",
                                    id: "enzymeSearchField",
                                    fieldLabel: "Label",
                                    hideLabel: true,
//                                    margin: 10,
                                    emptyText: "Search for Enzyme",
//                                    maxWidth: 150,
                                    enableKeyEvents: true
                                }
                            ]
                        },
                        {
                            xtype: "combobox",
                            id: "enzymeUserGroupSelector",
//                                  store: groupStore,
                            displayField: "name",
                            fieldLabel: "User Enzyme Groups",
                            labelAlign: "top",
                            queryMode: "local",
                            editable: false
                        }
                    ]
                },
                {
                    xtype: "container",
                    layout: {
                        align: "stretch",
                        type: "hbox"
                    },
                    flex: 1,
                    items: [
                        {
                            xtype: "itemselectorvede",
                            id: "enzymeSelector",
                            store: enzymeListStore,
                            displayField: "name",
                            flex: 1,
                            buttons: ["add", "remove"],
                            buttonsText: {add:"Add to Active", remove:"Remove from Active"},
                            doCopy: true
                        },
                        {
                            xtype: "container",
//                            height: 100,
//                            padding: 2,
//                            width: 130,
                            layout: {
                                align: "stretch",
//                                padding: 2,
                                type: "vbox"
                            },
                            items: [
                                {
                                    xtype: "button",
//                                    margin: 2,
                                    text: "Save as Group",
                                    id: "saveGroupButton",
//                                                flex: 1
                                },
                                {
                                    xtype: "button",
//                                    margin: 2,
                                    text: "Delete Group",
                                    id: "deleteGroupButton",
//                                                flex: 1
                                },
                                {
                                    xtype: "button",
//                                    margin: 2,
                                    text: "Make Active",
                                    id: "makeActiveButton",
//                                            flex: 1
                                }
                            ]
                        }
                    ]
                },
                {
                    xtype: "container",
//                    margin: "",
//                    padding: 0,
                    layout: {
                        align: "stretch",
//                                    padding: 2,
                        type: "hbox"
                    },
                    items: [
                        {
                            xtype: "button",
//                            height: 23,
                            id: "restrictionEnzymesManagerOKButton",
//                            margin: 2,
//                            maxHeight: 28,
//                            padding: "",
//                            width: 69,
                            text: "OK"
                        },
                        {
                            xtype: "button",
                            id: "restrictionEnzymesManagerCancelButton",
//                            margin: 2,
//                            maxHeight: 28,
//                            width: 69,
                            text: "Cancel"
                        }
                    ]
                }
            ]
        });

        me.callParent(arguments);
    }

});
