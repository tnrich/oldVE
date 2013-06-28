/**
 * Simulate digestion window
 * @class Vede.view.SimulateDigestionWindow
 * @author Doug Hershberger
 * @author Micah Lerner
 */
Ext.define("Vede.view.ve.SimulateDigestionWindow", {
    extend: "Ext.window.Window",
    requires: ["Ext.form.Panel", "Vede.view.form.ItemSelector"],
    height: 500,
    width: 900,
    layout: {
        align: "stretch",
        type: "hbox"
    },
    resizable: true,
    constrainHeader: true,
    title: "Gel Digest",
    modal: true,
    cls: "simulateDigestion",
    initComponent: function() {
        var groupStore = Ext.create("Ext.data.Store",{
            fields: [ {name: "name", type: "string"} ],
            data: []
        });

        var enzymeListStore = Ext.create("Ext.data.Store",{
            // store configs
            fields: [ {name: "name", type: "string"} ],
            data: [],
            autoLoad: true,
            sorters: [{property: "name", direction: "ASC"}]
        });

        var me = this;
        Ext.applyIf(me, {
                items: [{
                    xtype: "container",
                    height: "100%",
                    width: "100%",
                    layout: {
                        align: "stretch",
                        type: "hbox"
                    },
                    items: [ {
                        xtype: "panel",
                        width: 300,
                        title: "Enzyme Groups",
                        layout: {
                            align: "stretch",
                            type: "vbox"
                        },
                        items: [
                                {
                                    xtype: "container",
                                    layout: {
                                        type: "hbox",
                                        align: "stretch"
                                    },
                                    items: [
                                            {
                                                xtype: "combobox",
                                                hideTrigger: true,
                                                valueField: "name",
                                                emptyText: "Search for Enzyme in...",
                                                id: "enzymeGroupSelector-search",
                                                queryMode: "local",
                                                disabled: false,
                                                maxWidth: 134
                                            },
                                            {
                                                xtype: "combobox",
                                                id: "enzymeGroupSelector-digest",
                                                store: groupStore, //change this store to query database
                                                editable: false,
                                                queryMode: "local",
                                                value: "All Enzymes",
                                                displayField: "name",
                                                flex:1
                                            }
                                            ]
                                },
                                {
                                    xtype: "itemselectorvede",
                                    name: "itemselectorvede",
                                    flex: 1,
                                    id: "enzymeListSelector-digest",
                                    store: enzymeListStore,
                                    displayField: "name",
                                    valueField: "name",
                                    buttons: ["addAll", "add", "remove", "removeAll"],
                                    buttonsText: {add:"Add", addAll:"Add All", remove:"Remove", removeAll:"Remove All"},
                                    msgTarget: "side",
                                    fromTitle: "Available",
                                    toTitle: "Active",
                                    doCopy: true
                                },
                                {
                                    xtype: "container",
                                    layout: {
                                        type: "hbox",
                                        defaultMargins: 10,
                                        pack: "center"
                                    },
                                    items: [{
                                        xtype: "button",
                                        cls: "simulateDigestionSaveButton",
                                        width: 69,
                                        text: "Save"
                                    },
                                    {
                                        xtype: "button",
                                        cls: "simulateDigestionCancelButton",
                                        width: 69,
                                        text: "Cancel"
                                    }]
                                }]
                    },
                    {
                        xtype: "panel",
                        flex: 1,
                        layout: {
                            align: "stretch",
                            type: "vbox"
                        },
                        title: "Digest Results",

                        items: [ {
                            xtype: "fieldcontainer",
                            height: 40,
                            padding: "10 0 30 10",
                            width: 400,
                            fieldLabel: "",
                            flex: 0,
                            items: [ {
                                xtype: "combobox",
                                height: 21,
                                id: "ladderSelector",
                                padding: " 10 0 0 10",
                                width: 425,
                                value: "GeneRuler 1 kb Plus DNA Ladder 75-20,000 bp",
                                store: ["GeneRuler 1 kb Plus DNA Ladder 75-20,000 bp",
                                        "GeneRuler 100 bp Plus DNA Ladder 100-3000 bp",
                                        "GeneRuler Low Range DNA Ladder 25-700 bp"],
                                        fieldLabel: "Ladder",
                                        editable: false
                            }]},
                            {
                                xtype: "panel",
                                flex: 1,
                                layout: {
                                    type: "vbox",
                                    align: "stretch"
                                },
                                bodyStyle: {
                                    background: "#000"
                                },
                                items: [{
                                    xtype: "draw",
                                    id: "drawingSurface",
                                    flex: 1,
                                    x: 0,
                                    y: 0
                                }]
                            }]
                    }]
                }]
        });
        me.callParent(arguments);
    }

});
