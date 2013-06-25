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
    width: 450,
    layout: {
        align: "stretch",
        type: "vbox"
    },
    title: "Restriction Enzyme Manager",
    resizable: false,
    draggable: false,
    modal: true,
    cls: "restrictionEnzymeManager",

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
                        align: "middle",
                        type: "hbox"
                    },
                    items: [
                        {
                            xtype: "container",
                            layout: {
                                align: "stretch",
                                type: "vbox"
                            },
                            width: 180,
                            items: [
                                {
                                    xtype: "combobox",
                                    cls: "enzymeGroupSelector",
                                    store: groupStore,
                                    displayField: "name",
                                    fieldLabel: "Enzyme Groups",
                                    labelAlign: "top",
                                    queryMode: "local",
                                    maxWidth: 150,
                                    editable: false
                                },
                                {
                                    xtype: "textfield",
                                    cls: "enzymeSearchField",
                                    fieldLabel: "Label",
                                    hideLabel: true,
                                    emptyText: "Search for Enzyme",
                                    maxWidth: 150,
                                    enableKeyEvents: true
                                }
                            ]
                        },
                        {
                            xtype: "combobox",
                            cls: "userEnzymeGroupSelector",
                            displayField: "name",
                            fieldLabel: "User Enzyme Groups",
                            labelAlign: "top",
                            queryMode: "local",
                            width: 150,
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
                            cls: "enzymeSelector",
                            store: enzymeListStore,
                            displayField: "name",
                            width: 330,
                            buttons: ["addAll", "add", "remove", "removeAll"],
                            buttonsText: {add:"Add", addAll:"Add All", remove:"Remove",
                                removeAll:"Remove All"},
                            doCopy: true
                        },
                        {
                            xtype: "container",
                            layout: {
                                type: "vbox",
                                align: "stretch",
                                defaultMargins: 5
                            },
                            items: [
                                {
                                    xtype: "button",
                                    text: "New Group",
                                    cls: "newGroupButton"
                                },
                                {
                                    xtype: "button",
                                    text: "Copy Group",
                                    cls: "copyGroupButton"
                                },
                                {
                                    xtype: "button",
                                    text: "Delete Group",
                                    cls: "deleteGroupButton"
                                },
                                {
                                    xtype: "button",
                                    text: "Make Active",
                                    cls: "makeActiveButton"
                                }
                            ]
                        }
                    ]
                },
                {
                    xtype: "container",
                    layout: {
                        type: "hbox",
                        defaultMargins: 10,
                        pack: "center"
                    },
                    items: [
                        {
                            xtype: "button",
                            cls: "restrictionEnzymesManagerSaveButton",
                            width: 69,
                            text: "Save"
                        },
                        {
                            xtype: "button",
                            cls: "restrictionEnzymesManagerCancelButton",
                            width: 69,
                            text: "Cancel"
                        }
                    ]
                }
            ]
        });

        me.callParent(arguments);
    }

});
