/**
 * Class controlling the device display portion of Device Editor.
 * @class Vede.controller.DeviceEditor.GridController
 */
/*global $*/
Ext.define("Vede.controller.DeviceEditor.GridController", {
    extend: "Ext.app.Controller",

    requires: ["Teselagen.event.DeviceEvent",
               "Teselagen.event.GridEvent",
               "Teselagen.manager.DeviceDesignManager",
               "Teselagen.manager.GridManager",
               "Teselagen.models.DeviceEditorProject",
               "Teselagen.constants.SBOLIcons",
               "Teselagen.utils.Logger"],

    statics: {
        DEFAULT_ROWS: 2
    },

    DeviceEvent: null,
    ProjectEvent: null,
    DeviceDesignManager: null,

    activeBins: null,
    activeProject: null,
    grid: null,
    GridManager: null,
    tabPanel: null,

    ReRenderDevice: function(){
        var tab = Ext.getCmp("mainAppPanel").getActiveTab();
        this.GridManager.renderGrid(tab.model);
    },

    /**
     * Changes the selected bin's icon to the clicked icon button.
     * @param {Ext.button.Button} button The clicked button.
     */
    onPartPanelButtonClick: function(button) {
        var selectedBin = Teselagen.manager.GridManager.selectedGridBin;
        if(selectedBin) {
            var oldIcon = selectedBin.datum().get("iconID");
            selectedBin.datum().set("iconID",button.data.iconKey);
            Teselagen.manager.GridCommandPatternManager.addCommand({
                type: "BIN",
                data: {
                    type: "ICON",
                    x: parseInt(selectedBin.attr("deGridBinIndex")),
                    oldData: oldIcon,
                    newData: button.data.iconKey
                }
            });
        }
    },

    /**
     * Flips a bin icon and reverses its direction when the reverse button is
     * clicked.
     * @param {Ext.button.Button} button The clicked reverse button.
     */
    onFlipBinButtonClick: function(button) {

        this.application.fireEvent(this.GridEvent.BIN_HEADER_CLICK, button.up());
        parentBin.set("directionForward", !parentBin.get("directionForward"));
    },


    onBeforeTabChange: function(tabPanel, newTab, oldTab) {

        if(oldTab && oldTab.initialCls === "DeviceEditorTab" && this.grid.el) {
            var selectedBin = this.GridManager.selectedGridBin;
            var selectedCell = this.GridManager.selectedGridPart;

            if(!oldTab.options) {
                oldTab.options = {};
            }

            oldTab.options.scrollLeft = this.grid.el.getScrollLeft();
            oldTab.options.scrollTop = this.grid.el.getScrollTop();

            // Save the previous tab's selected part and/or bin.
            if(selectedBin) {
                if(selectedCell) {
                    oldTab.options.selection = {
                        x: Number(selectedBin.attr("deGridBinIndex")),
                        y: Number(selectedCell.attr("deGridRowIndex"))
                    };
                } else {
                    oldTab.options.selection = {
                        x: Number(selectedBin.attr("deGridBinIndex"))
                    }
                }
            } else {
                oldTab.options.selection = null;
            }

            if(oldTab && oldTab.model && oldTab.model.setActive) {
                oldTab.model.setActive(false);
            }
        }
    },

    /**
     * When the tab changes on the main panel, handles loading and rendering the
     * new device design, assuming the new tab is a device editor tab. Also sets
     * all the event listeners on the new device.
     * @param {Ext.tab.Panel} tabPanel The tabpanel.
     * @param {Ext.Component} newTab The tab that is being switched to.
     */
    onTabChange: function(tabPanel, newTab, oldTab) {
        if(newTab.initialCls === "DeviceEditorTab") { // It is a DE tab
            this.grid = newTab.down("component[cls='designGrid']");

            this.activeProject = newTab.model;
            this.activeTab = newTab;

            this.cutPartMenuItem = this.activeTab.down("menuitem[text='Cut Part']");
            this.copyPartMenuItem = this.activeTab.down("menuitem[text='Copy Part']");
            this.pastePartMenuItem = this.activeTab.down("menuitem[text='Paste Part']");
            this.removeRowMenuItem = this.activeTab.down("menuitem[text='Remove Row']");
            this.clearPartMenuItem = this.activeTab.down("menuitem[text='Clear Part']");
            this.removeColumnMenuItem = this.activeTab.down("menuitem[text='Remove Column']");

            this.columnLeftMenuItem = this.activeTab.down("menuitem[text='Column Left']");
            this.columnRightMenuItem = this.activeTab.down("menuitem[text='Column Right']");

            this.rowAboveMenuItem = this.activeTab.down("menuitem[text='Row Above']");
            this.rowBelowMenuItem = this.activeTab.down("menuitem[text='Row Below']");

            // These two are used by the GridCommandPatternManager.
            this.GridManager.undoMenuItem = this.activeTab.down("menuitem[text='Undo']");
            this.GridManager.redoMenuItem = this.activeTab.down("menuitem[text='Redo']");

            this.totalColumns = this.DeviceDesignManager.binCount(this.activeProject);

            this.activeBins = this.activeProject.bins();

            this.activeProject.setActive(true);

            this.totalRows = this.DeviceDesignManager.findMaxNumParts(
                                                            this.activeProject);

            if(this.totalRows === 0) {
                this.totalRows = this.self.DEFAULT_ROWS;
            }

            this.GridManager.renderGrid(newTab.model);

            // Load the new tab's saved options, if they exist.
            if(newTab.options) {
                var scroll = this.grid.el.getScroll();

                if(scroll.left !== newTab.options.scrollLeft) {
                    this.grid.el.setScrollLeft(newTab.options.scrollLeft);
                }

                if(scroll.top !== newTab.options.scrollTop) {
                    this.grid.el.setScrollTop(newTab.options.scrollTop);
                }

                if(newTab.options.selection) {
                    if(newTab.options.selection.y !== undefined) {
                        var coords = newTab.options.selection;
                        var cell = this.activeProject.bins().getAt(coords.x)
                                                     .cells().getAt(coords.y);

                        this.application.fireEvent(this.DeviceEvent.SELECT_CELL,
                                                   cell, coords.x, coords.y);
                    } else {
                        this.GridManager.selectGridBinHeaderByIndex(newTab.options.selection.x);
                    }
                }
            }
        }
    },

    onAddRowAbove: function() {
        this.GridManager.addRowAbove();
    },

    onAddRowBelow: function() {
        this.GridManager.addRowBelow();
    },

    onAddColumnLeft: function() {
        this.GridManager.addColumnLeft();
    },

    onAddColumnRight: function() {
        this.GridManager.addColumnRight();
    },

    /**
     * Checks the current design to see if pPart is already mapped to a cell, or
     * if a nonidentical part with the same name is mapped to a cell.
     * @param {Teselagen.models.Part} pPart The part to check for duplication.
     * @param {String} name The name of the part to use to check.
     * @param {Function(Teselagen.models.Part)} cb Callback taking the identical
     * part as an argument.
     * @param {String} errorMessage The error message to display if a non-identical
     * part exists in the design.
     */
    onValidateDuplicatedPartNameEvent: function(pPart, name, partSource, cb, errorMessage){
        var me = this;
        var duplicated = false;
        var nonidentical = false;
        var partSourceNonidentical = false;
        var identicalPart = null;
        var conflictPart;

        if(!pPart.isMapped()) {
            cb(null);
        }

        this.activeProject.parts().each(function(part, partIndex){
            if(part.isMapped() && part.get("name") === name && part.get("id") !== pPart.get("id")) {
                nonidentical = true;
            } else if (part.isMapped() && part.get("partSource") === partSource && part.get("id") !== pPart.get("id")) {
                console.log(part.getSequenceFile().raw.hash !== pPart.getSequenceFile().raw.hash);
                if(part.getSequenceFile().raw.hash !== pPart.getSequenceFile().raw.hash) {
                    partSourceNonidentical = true;
                    conflictPart = part;
                }
            } else if(part.get("id") === pPart.get("id")) {
                identicalPart = part;
            }
        });

        if(nonidentical)
        {
            Ext.MessageBox.show({
                title: "Error",
                msg: errorMessage || "Another non-identical part with that name already exists in the design. Please select the same part or a part with another name.",
                buttons: Ext.MessageBox.OK,
                icon:Ext.MessageBox.ERROR
            });
        } else if (partSourceNonidentical) {
            Ext.MessageBox.show({
                title: "Error",
                msg: errorMessage || 'The part you have selected, "' + pPart.get('name') + '", may not be used in the current design because its source sequence "' + pPart.get('partSource') + '" has the same name but is not identical to the source sequence "' + conflictPart.get('partSource') + '" for another part "' + conflictPart.get('name') + '" in the current design.' ,
                buttons: Ext.MessageBox.OK,
                icon:Ext.MessageBox.ERROR
            });
        }else {
            cb(identicalPart);
        }
    },

    toggleCutCopyPastePartOptions: function(state){
        this.cutPartMenuItem.setDisabled(!state||false);
        this.copyPartMenuItem.setDisabled(!state||false);
        this.pastePartMenuItem.setDisabled(!state||false);
        this.removeRowMenuItem.setDisabled(!state||false);
        this.clearPartMenuItem.setDisabled(!state||false);
        this.removeColumnMenuItem.setDisabled(!state||false);
    },

    toggleRemoveColumnOptions: function(state) {
        this.removeColumnMenuItem.setDisabled(!state||false);
    },

    toggleInsertOptions: function(state) {
        this.columnLeftMenuItem.setDisabled(!state||false);
        this.columnRightMenuItem.setDisabled(!state||false);
    },

    toggleInsertRowAboveOptions: function(state) {
        this.rowAboveMenuItem.setDisabled(!state||false);
    },

    toggleInsertRowBelowOptions: function(state) {
        this.rowBelowMenuItem.setDisabled(!state||false);
    },

    onCutPartMenuItemClick: function() {
        this.application.fireEvent(this.DeviceEvent.CUT_PART);
    },

    onCopyPartMenuItemClick: function() {
        this.application.fireEvent(this.DeviceEvent.COPY_PART);
    },

    onPastePartMenuItemClick: function() {
        this.application.fireEvent(this.DeviceEvent.PASTE_PART);
    },

    onCutPart: function() {
        var gridManager = Teselagen.manager.GridManager;
        if(gridManager.selectedGridPart) {
            gridManager.clipboardPart = gridManager.selectedGridPart.datum().getPart();

            gridManager.clearSelectedPart();
            gridManager.InspectorController.clearPartInfo();
        }
    },

    onCopyPart: function() {
        var gridManager = Teselagen.manager.GridManager;
        if(gridManager.selectedGridPart) {
            gridManager.clipboardPart = gridManager.selectedGridPart.datum().getPart();
        }
    },

    onPastePart: function() {
        var gridManager = Teselagen.manager.GridManager;
        var selectedCell = gridManager.selectedGridPart.datum();
        var self = this;
        var design = this.activeProject;

        if(gridManager.clipboardPart && selectedCell) {
            Vede.application.fireEvent(this.DeviceEvent.VALIDATE_DUPLICATED_PART_NAME, gridManager.clipboardPart, gridManager.clipboardPart.get("name"), gridManager.clipboardPart.get("partSource"), function(identicalPart) {
                var xIndex = parseInt(gridManager.selectedGridBin.attr("deGridBinIndex"));
                var yIndex = parseInt(gridManager.selectedGridPart.attr("deGridRowIndex"));
                var oldPart = selectedCell.getPart();
                var newPart = gridManager.clipboardPart;

                selectedCell.setPart(gridManager.clipboardPart);

                if(design.parts().indexOf(newPart) === -1) {
                    design.parts().add(newPart);
                }

                if(oldPart && self.DeviceDesignManager.isPartInCollection(design, oldPart)) {
                    design.parts().remove(oldPart);
                }

                Vede.application.fireEvent(self.DeviceEvent.SELECT_CELL, selectedCell, xIndex, yIndex);

                Teselagen.manager.GridCommandPatternManager.addCommand({
                    type: "PART",
                    data: {
                        type: "PASTE",
                        x: xIndex,
                        y: yIndex,
                        oldPart: oldPart,
                        newPart: newPart
                    }
                });
            },"Invalid Paste");
        }
    },

    onSelectBin: function(j5Bin, binIndex) {
        if(binIndex===null || binIndex===undefined) binIndex = this.activeProject.bins().indexOf(j5Bin);
        this.GridManager.selectGridBinHeaderByIndex(binIndex);
    },

    onSelectCell: function(cell, xIndex, yIndex) {
        this.GridManager.selectGridCellByIndex(xIndex, yIndex);
    },

    onClearPart: function() {
        this.GridManager.clearSelectedPart();
    },

    onRemoveColumn: function() {
        this.GridManager.removeColumn();
    },

    onRemoveRow: function() {
        this.GridManager.removeRow();
    },

    scrollToBinOrCell: function(xIndex, yIndex, horizPadding, vertPadding) {
        horizPadding = horizPadding || 0;
        vertPadding = vertPadding || 0;

        var scrollTop = this.grid.el.getScrollTop();
        var scrollLeft = this.grid.el.getScrollLeft();
        var clientHeight = this.grid.el.dom.clientHeight;
        var clientWidth = this.grid.el.dom.clientWidth;

        if(yIndex>0 || yIndex===0) {
            var bottomBound;
            var topBound;

            bottomBound = this.GridManager.BIN_HEIGHT+10+this.GridManager.BIN_PART_GAP_HEIGHT+this.GridManager.PART_HEIGHT*(yIndex+1)-clientHeight;
            topBound = this.GridManager.BIN_HEIGHT+10+this.GridManager.BIN_PART_GAP_HEIGHT+this.GridManager.PART_HEIGHT*yIndex;
            bottomBound += vertPadding;
            topBound -= vertPadding;

            var isInVertBounds = scrollTop<=topBound && scrollTop>=bottomBound;

            if(!isInVertBounds) {
                var newScrollTop = scrollTop>topBound ? topBound : bottomBound;
                this.grid.el.setScrollTop(newScrollTop);
            }
        } else {
            this.grid.el.setScrollTop(0);
        }

        var leftBound = 10+this.GridManager.COLUMN_WIDTH*(xIndex+1) - clientWidth;
        var rightBound = 10+this.GridManager.COLUMN_WIDTH*xIndex;
        leftBound += horizPadding;
        rightBound -= horizPadding;

        var isInHorizBounds = scrollLeft<=rightBound && scrollLeft>=leftBound;

        if(!isInHorizBounds) {
            var newScrollLeft = scrollLeft>rightBound ? rightBound : leftBound;
            this.grid.el.setScrollLeft(newScrollLeft);
        }
    },

    onLaunch: function() {
        this.tabPanel = Ext.getCmp("mainAppPanel");
        this.DeviceDesignManager = Teselagen.manager.DeviceDesignManager;

        this.InspectorController = this.application.getDeviceEditorInspectorControllerController();
    },

    /**
     * @member Vede.controller.DeviceEditor.GridController
     */
    init: function() {
        this.callParent();

        this.control({
            "#mainAppPanel": {
                beforetabchange: this.onBeforeTabChange,
                tabchange: this.onTabChange
            },
            "DeviceEditorPartPanel button": {
                click: this.onPartPanelButtonClick
            },
            "button[cls='editMenu'] > menu > menuitem[text='Copy Part']": {
                click: this.onCopyPartMenuItemClick
            },
            "button[cls='editMenu'] > menu > menuitem[text='Paste Part']": {
                click: this.onPastePartMenuItemClick
            },
            "button[cls='editMenu'] > menu > menuitem[text='Cut Part']": {
                click: this.onCutPartMenuItemClick
            }
        });


        this.DeviceEvent = Teselagen.event.DeviceEvent;
        this.GridEvent = Teselagen.event.GridEvent;
        this.ProjectEvent = Teselagen.event.ProjectEvent;
        this.Logger = Teselagen.utils.Logger;

        this.GridManager = Teselagen.manager.GridManager;

        this.application.on(this.DeviceEvent.ADD_ROW_ABOVE,
                            this.onAddRowAbove,
                            this);

        this.application.on(this.DeviceEvent.ADD_ROW_BELOW,
                            this.onAddRowBelow,
                            this);

        this.application.on(this.DeviceEvent.ADD_COLUMN_LEFT,
                            this.onAddColumnLeft,
                            this);

        this.application.on(this.DeviceEvent.ADD_COLUMN_RIGHT,
                            this.onAddColumnRight,
                            this);

        this.application.on(this.DeviceEvent.CUT_PART,
                            this.onCutPart,
                            this);

        this.application.on(this.DeviceEvent.COPY_PART,
                            this.onCopyPart,
                            this);

        this.application.on(this.DeviceEvent.PASTE_PART,
                            this.onPastePart,
                            this);

        this.application.on(this.DeviceEvent.CLEAR_PART,
                            this.onClearPart,
                            this);

        this.application.on(this.DeviceEvent.REMOVE_COLUMN,
                            this.onRemoveColumn,
                            this);

        this.application.on(this.DeviceEvent.REMOVE_ROW,
                            this.onRemoveRow,
                            this);

        this.application.on(this.DeviceEvent.SELECT_BIN,
                            this.onSelectBin,
                            this);

        this.application.on(this.DeviceEvent.SELECT_CELL,
                            this.onSelectCell,
                            this);

        this.application.on(this.DeviceEvent.VALIDATE_DUPLICATED_PART_NAME,
                            this.onValidateDuplicatedPartNameEvent,
                            this);

        this.application.on(this.DeviceEvent.RERENDER_DE_CANVAS,
                            this.ReRenderDevice,
                            this);
    }
});
