/**
 * Class controlling the device display portion of Device Editor.
 */
Ext.define("Vede.controller.DeviceEditor.GridController", {
    extend: "Ext.app.Controller",

    requires: ["Teselagen.event.DeviceEvent",
               "Teselagen.manager.DeviceDesignManager"],

    DeviceEvent: null,
    ProjectEvent: null,

    DeviceDesignManager: null,

    activeProject: null,
    grid: null,
    tabPanel: null,

    selectedBin: null,
    selectedPart: null,

    totalRows: 1,

    /**
     * Renders a given DeviceDesign.
     * @param {Teselagen.models.DeviceDesign} The design to render.
     */
    renderDevice: function() {
        var bins = this.activeProject.getJ5Collection().bins();

        bins.each(function(j5Bin) {
            this.addJ5Bin(j5Bin);
        }, this);
    },

    onPartPanelButtonClick: function(button) {
        console.log(button.cls);
    },

    onFlipBinButtonClick: function(button) {
        if(button.icon === Vede.view.de.grid.Bin.forwardButtonIconPath) {
            button.setIcon(Vede.view.de.grid.Bin.reverseButtonIconPath);
        } else {
            button.setIcon(Vede.view.de.grid.Bin.forwardButtonIconPath);
        }

        // Get the bin that the button refers to and reverse its direction.
        var parentBin = button.up().up().up().getBin();
        parentBin.set("directionForward", !parentBin.get("directionForward"));
    },

    /**
     * This is a hack that allows binHeaders and partCells (and any container,
     * theoretically) to fire a 'click' event, which ExtJS for some reason does
     * not allow.
     */
    addBinHeaderClickEvent: function(binHeader) {
        binHeader.body.on("click", function() {
            this.application.fireEvent("BinHeaderClick", binHeader);
        }, this);
    },

    addPartCellClickEvent: function(partCell) {
        partCell.body.on("click", function() {
            this.application.fireEvent("PartCellClick", partCell);
        },this);
    },

    onBinHeaderClick: function(binHeader) {
        var gridBin = binHeader.up().up();
        var j5Bin = gridBin.getBin();

        if(this.selectedBin) {
            this.selectedBin.deselect();
        }

        this.selectedBin = gridBin;
        gridBin.select();

        this.application.fireEvent(this.DeviceEvent.SELECT_BIN, j5Bin);
    },

    onPartCellClick: function(partCell) {
        var gridPart = partCell.up().up();
        var j5Part = gridPart.getPart();

        if(this.selectedPart) {
            this.selectedPart.deselect();
        }

        this.selectedPart = gridPart;
        gridPart.select();

        this.application.fireEvent(this.DeviceEvent.SELECT_PART, j5Part);
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
        this.DeviceDesignManager = Teselagen.manager.DeviceDesignManager;
        
        this.grid = Ext.ComponentQuery.query("component[cls='designGrid']")[0];
        this.tabPanel = Ext.getCmp("mainAppPanel");

        // Create a sample bin and associated parts to render.
        this.totalRows = 2;
        var binModel = Ext.create("Teselagen.models.J5Bin", {
            binName: "promoter",
            iconID: ""
        });

        var partModel1 = Ext.create("Teselagen.models.Part", {
            name: "p_con",
        });

        var partModel2 = Ext.create("Teselagen.models.Part", {
            name: "p_bad",
        });

        binModel.parts().add(partModel1);
        binModel.parts().add(partModel2);

        this.activeProject = this.DeviceDesignManager.createDeviceDesignFromBins([binModel]);

        this.renderDevice();
    },

    init: function() {
        this.callParent();

        this.control({
            "DeviceEditorPartPanel button": {
                click: this.onPartPanelButtonClick
            },
            "button[cls='flipBinButton']": {
                click: this.onFlipBinButtonClick
            },
            "component[cls='binHeader']": {
                render: this.addBinHeaderClickEvent
            },
            "component[cls='gridPartCell']": {
                render: this.addPartCellClickEvent
            }
        });

        this.DeviceEvent = Teselagen.event.DeviceEvent;
        this.ProjectEvent = Teselagen.event.ProjectEvent;

        this.application.on(this.DeviceEvent.ADD_COLUMN,
                            this.onAddColumn,
                            this);

        this.application.on(this.DeviceEvent.ADD_ROW,
                            this.onAddRow,
                            this);

        this.application.on("BinHeaderClick",
                            this.onBinHeaderClick,
                            this);
 
        this.application.on("PartCellClick",
                            this.onPartCellClick,
                            this);
    },
});
