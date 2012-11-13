/**
 * Class controlling the device display portion of Device Editor.
 */
Ext.define("Vede.controller.DeviceEditor.GridController", {
    extend: "Ext.app.Controller",

    requires: ["Teselagen.event.DeviceEvent",
               "Teselagen.manager.DeviceDesignManager",
               "Teselagen.models.DeviceEditorProject"],

    DeviceEvent: null,
    ProjectEvent: null,

    DeviceDesignManager: null,

    activeBins: null,
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

        if(this.selectedPart) {
            this.selectedPart.deselect();
            this.selectedPart = null;
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

    onTabChange: function(tabPanel, newTab, oldTab) {
        this.grid = newTab.query("component[cls='designGrid']")[0];
        console.log(this.grid);
        var bins = this.grid.query("Bin");
        bins.forEach(function(index){
            if(this.grid && this.grid.query("Bin")[index]) this.grid.remove(this.grid.query("Bin")[index]);
        });

        if(newTab.model) {
            if(this.activeBins) {
                this.activeBins.un("add", this.onAddToBins, this);
                this.activeBins.un("update", this.onBinsUpdate, this);
                this.activeBins.un("remove", this.onRemoveFromBins, this);
            }

            this.activeProject = newTab.model.getDesign();
            this.activeBins = this.activeProject.getJ5Collection().bins();

            this.activeBins.on("add", this.onAddToBins, this);
            this.activeBins.on("update", this.onBinsUpdate, this);
            this.activeBins.on("remove", this.onRemoveFromBins, this);

            this.renderDevice();
        }
    },

    onAddToBins: function(activeBins, addedBins, index) {
        Ext.each(addedBins, function(j5Bin) {
            this.addJ5Bin(j5Bin);
        }, this);
    },

    onBinsUpdate: function(activeBins, updatedBin, operation, modified) {

    },

    onRemoveFromBins: function(activeBins, removedBin, index) {
        if(this.selectedBin.getBin() == removedBin) {
            this.selectedBin = null;
        }

        this.grid.remove(this.grid.query("Bin")[index]);
    },

    onAddRow: function() {
        this.totalRows += 1;
        this.updateBinsWithTotalRows();
    },

    onSelectBin: function(j5Bin) {
        var gridBin = this.getGridBinFromJ5Bin(j5Bin);

        if(this.selectedBin) {
            this.selectedBin.deselect();
        }

        this.selectedBin = gridBin;
        gridBin.select();
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

    getGridBinFromJ5Bin: function(j5Bin) {
        var targetGridBin = null;

        Ext.each(this.grid.query("Bin"), function(gridBin) {
            if(gridBin.getBin() === j5Bin) {
                targetGridBin = gridBin;
                return false;
            }
        }, this);

        return targetGridBin;
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

        var deproject = Ext.create("Teselagen.models.DeviceEditorProject", {
            name: "Untitled Project"
        });

        var design = this.DeviceDesignManager.createDeviceDesignFromBins([binModel]);

        deproject.setDesign(design);

        this.tabPanel.down("DeviceEditorPanel").model = deproject;

        this.tabPanel.on("tabchange",
                         this.onTabChange,
                         this);
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

        this.application.on(this.DeviceEvent.ADD_ROW,
                            this.onAddRow,
                            this);

        this.application.on(this.DeviceEvent.SELECT_BIN,
                            this.onSelectBin,
                            this);

        this.application.on("BinHeaderClick",
                            this.onBinHeaderClick,
                            this);
 
        this.application.on("PartCellClick",
                            this.onPartCellClick,
                            this);
        },
});
