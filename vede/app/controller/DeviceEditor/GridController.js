/**
 * Class controlling the device display portion of Device Editor.
 */
Ext.define("Vede.controller.DeviceEditor.GridController", {
    extend: "Ext.app.Controller",

    requires: ["Teselagen.event.DeviceEvent"],

    DeviceEvent: null,

    grid: null,
    tabPanel: null,

    totalRows: 1,

    onPartPanelButtonClick: function(button) {
        console.log(button.cls);
    },

    onAddColumn: function(j5Bin) {
        if(j5Bin) {
            this.addJ5Bin(j5Bin);
        } else {
            this.grid.add(Ext.create("Vede.view.de.grid.Bin", {
                totalRows: this.totalRows
            }));
        }
    },

    onAddRow: function() {
        this.totalRows += 1;
        this.updateBinsWithTotalRows();
    },

    addJ5Bin: function(j5Bin) {
        this.grid.add(Ext.create("Vede.view.de.grid.Bin", {
            bin: j5Bin,
            totalRows: this.totalRows
        }));
    },

    updateBinsWithTotalRows: function() {
        this.grid.items.each(function(bin) {
            bin.setTotalRows(this.totalRows);
        }, this);
    },

    onLaunch: function() {
        this.grid = Ext.ComponentQuery.query("component[cls='designGrid']")[0];
        this.tabPanel = Ext.getCmp("tabPanel");

        // Create a sample bin and associated parts to render.
        this.totalRows = 2;
        var binModel = Ext.create("Teselagen.models.J5Bin", {
            binName: "promoter",
        });

        var partModel1 = Ext.create("Teselagen.models.Part", {
            name: "p_con",
        });

        var partModel2 = Ext.create("Teselagen.models.Part", {
            name: "p_bad",
        });

        binModel.parts().add(partModel1);
        binModel.parts().add(partModel2);

        this.grid.add(Ext.create("Vede.view.de.grid.Bin", {
            bin: binModel,
            totalRows: this.totalRows
        }));
    },

    init: function() {
        this.callParent();

        this.control({
            "DeviceEditorPartPanel button": {
                click: this.onPartPanelButtonClick
            },
        });

        this.DeviceEvent = Teselagen.event.DeviceEvent;

        this.application.on(this.DeviceEvent.ADD_COLUMN,
                            this.onAddColumn,
                            this);

        this.application.on(this.DeviceEvent.ADD_ROW,
                            this.onAddRow,
                            this);
    },
});
