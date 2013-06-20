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
                                    id: "enzymeGroupSelector",
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
                                    id: "enzymeSearchField",
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
                            id: "userEnzymeGroupSelector",
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
                            id: "enzymeSelector",
                            store: enzymeListStore,
                            displayField: "name",
//                            flex: 1,
                            width: 330,
                            buttons: ["add", "remove"],
                            buttonsText: {add:"Add to Active", remove:"Remove from Active"},
                            doCopy: true
                        },
                        {
                            xtype: "container",
                            layout: {
                                align: "stretch",
                                type: "vbox"
                            },
//                            flex: 1,
                            items: [
                                {
                                    xtype: "button",
                                    text: "Save as Group",
                                    id: "saveGroupButton"
                                },
                                {
                                    xtype: "button",
                                    text: "Delete Group",
                                    id: "deleteGroupButton"
                                },
                                {
                                    xtype: "button",
                                    text: "Make Active",
                                    id: "makeActiveButton"
                                }
                            ]
                        }
                    ]
                },
                {
                    xtype: "container",
                    layout: {
                        align: "stretch",
                        type: "hbox"
                    },
                    items: [
                        {
                            xtype: "button",
                            id: "restrictionEnzymesManagerSaveButton",
                            width: 69,
                            text: "Save"
                        },
                        {
                            xtype: "button",
                            id: "restrictionEnzymesManagerCancelButton",
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
