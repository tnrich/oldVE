/**
 * Class controlling the device display portion of Device Editor.
 */
Ext.define("Vede.controller.DeviceEditor.GridController", {
    extend: "Ext.app.Controller",

    grid: null,

    onPartPanelButtonClick: function(button) {
        console.log(button.cls);
    },

    onLaunch: function() {
        this.grid = Ext.ComponentQuery.query("component[cls='designGrid']")[0];

        // Create a sample bin and associated parts to render.
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

        var bin = Ext.create("Vede.view.de.grid.Bin", {
            bin: binModel
        });

        this.grid.add(bin);    
    },

    init: function() {
        this.callParent();

        this.control({
            "DeviceEditorPartPanel button": {
                click: this.onPartPanelButtonClick
            }
        });
    },
});
