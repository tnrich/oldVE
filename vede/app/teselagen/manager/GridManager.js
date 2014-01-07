/**
 * @class Teselagen.manager.GridManager
 */
Ext.define("Teselagen.manager.GridManager", {

    requires: [
        "Teselagen.constants.Constants",
        "Teselagen.constants.SBOLIcons",
        "Teselagen.event.DeviceEvent",
        "Teselagen.manager.DeviceDesignManager",
        "Teselagen.manager.GridCommandPatternManager",
        "Teselagen.manager.InspectorPanelManager",
        "Teselagen.manager.ProjectManager",
        "Teselagen.renderer.de.BinHeaderRenderer",
        "Teselagen.renderer.de.PartRenderer"
    ],

    singleton: true,

    // vvv Below is useful for typing into console. vvv
    //Teselagen.manager.ProjectManager.workingProject.designsStore.data.items[0]
    //().binsStore.data.items[0].partsStore.data.items

    COLUMN_WIDTH: 125,

    BIN_HEIGHT: 100,
    BIN_FILL_COLOR: "#fefefe",
    BIN_OUTLINE_COLOR: "#ecf0f1",
    BIN_OUTLINE_WIDTH: 1,    // Not really sure right now.
    BIN_HOVER_OUTLINE_COLOR: "#4A4B4C",
    BIN_SELECTED_OUTLINE_COLOR: "#006CAB",
    BIN_SELECTED_FILL_COLOR: "rgb(240,240,240)",

    BIN_PART_GAP_HEIGHT: 10,

    PART_HEIGHT: 40,
    PART_FILL_COLOR: "#fefefe",
    PART_OUTLINE_COLOR: "#ecf0f1",
    PART_UNMAPPED_OUTLINE_COLOR: "#e10000",
    PART_MAPPED_OUTLINE_COLOR: "#006CAB",
    PART_OUTLINE_WIDTH: 1,    // Not really sure right now.
    PART_HOVER_OUTLINE_COLOR: "#4A4B4C",
    PART_SELECTED_OUTLINE_COLOR: "#006CAB",
    PART_SELECTED_FILL_COLOR: "#ECF0F1",

    FLIP_ARROW_PATH: "m 27.64032,9.92550 -9.35672,-6.23781 0,3.36062 -6.61209,0 0,5.75438 6.61209,0 0,3.36062 9.35672,-6.23781 z",

    currentTab: null,
    activeProject: null,

    rulesData: [],
    partsWithRules: [],

    //binsData: [],
    //partsData: [],

    grid: null,

    parentSVG: null,
    gridSVG: null,
    gridBinSVG: null,
    gridPartSVG: null,

    gridBinRectSVG: null,
    gridBinTextSVG: null,
    gridBinSbolIconSVG: null,
    gridBinFlipButtonSVG: null,
    gridBinFlipButtonArrowSVG: null,
    gridBinDsfSVG: null,

    gridPartRectSVG: null,
    gridPartTextSVG: null,
    gridPartFasIndicatorSVG: null,
    //gridPartDsfSVG: null,

    // The selected parts and bins are each a d3 selection (i.e., an array of arrays of elements).
    selectedGridPart: null,
    selectedGridBin: null,
    clipboardPart: null,

    GridController: null,
    InspectorController: null,

    totalRows: 0,
    totalColumns: 0,

    listenersEnabled: true,

    removeGrid: function() {
        if(this.grid) this.grid.remove();
    },

    renderGrid: function(model) {
        var me = this;

        this.removeGrid();

        // Save xIndex and yIndex of selected part/bins so we can select them
        // after they are re-rendered.
        if(model === this.activeProject && this.selectedGridBin) {
            this.selectedColumnIndex = Number(this.selectedGridBin.attr("deGridBinIndex"));

            if(this.selectedGridPart) {
                this.selectedPartIndex = Number(this.selectedGridPart.attr("deGridRowIndex"));
            }
        } else {
            this.selectedGridPart = null;
            this.selectedGridBin = null;

            this.selectedColumnIndex = null;
            this.selectedPartIndex = null;
        }

        this.currentTab = Ext.getCmp("mainAppPanel").getActiveTab();
        this.activeProject = model;

        if(!this.GridController) {
            this.GridController = Vede.application.getController("DeviceEditor.GridController");
        }

        if(!this.InspectorController) {
            this.InspectorController = Vede.application.getController("DeviceEditor.InspectorController");
        }

        this.totalColumns = model.bins().count();

        if(this.totalColumns > 0) {
            this.totalRows = model.bins().getAt(0).cells().count();
        } else {
            this.totalRows = 0;
        }

        this.grid = d3.select(this.currentTab.el.dom)
            .select(".designGrid")
            .append("svg:svg")
            .attr("class", "gridSVG")
            .attr("overflow", "auto")
            .attr("width",me.COLUMN_WIDTH*me.totalColumns)
            .attr("height",me.BIN_HEIGHT+me.BIN_PART_GAP_HEIGHT+me.PART_HEIGHT*me.totalRows);

        this.parentSVG = this.grid.append("svg:g")
             .attr("class", "gridParent");

        this.gridBinSVG = this.parentSVG.selectAll("g")
            .data(me.activeProject.bins().getRange())
            .enter()
            .append("g")
            .attr("class", "gridBinSVG")
            .attr("deGridBinIndex", function(d, i) {return i;})
            .attr("width", me.COLUMN_WIDTH-1)
            .attr("height", me.BIN_HEIGHT+me.BIN_PART_GAP_HEIGHT+me.PART_HEIGHT*me.totalRows)
            .attr('transform', function(d, i) { return 'translate('+(i*me.COLUMN_WIDTH)+', 0)';});

        this.gridBinHeaderSVG = this.gridBinSVG
            .append("g")
            .attr("class", "gridBinHeaderSVG")
            .attr("width", me.COLUMN_WIDTH)
            .attr("height", me.BIN_HEIGHT);
            //.attr('transform', function(d, i) { return 'translate('+(i*me.COLUMN_WIDTH)+', 0)';});

        this.binHeaderRenderer = Ext.create("Teselagen.renderer.de.BinHeaderRenderer", {
            gridManager: me,
            gridBinHeaderSVG: this.gridBinHeaderSVG
        });
        this.binHeaderRenderer.renderBinHeaders();

        this.gridPartParentSVG = this.gridBinSVG
            .append("g")
            .attr("class", "gridPartParentSVG")
            .attr("width", me.COLUMN_WIDTH)
            .attr("height", me.PART_HEIGHT*me.totalRows)
            .attr('transform', 'translate(0, '+(me.BIN_HEIGHT+me.BIN_PART_GAP_HEIGHT)+')');

        this.gridPartSVG = this.gridPartParentSVG.selectAll("g")
            .data(function(d) { return d.cells().getRange();})
            .enter()
            .append("g")
            .attr("class", "gridPartSVG")
            .attr("deGridRowIndex", function(d, i) {return i;})
            .attr("width", me.COLUMN_WIDTH)
            .attr("height", me.PART_HEIGHT)
            .attr('transform', function(d, i) { return 'translate(0, '+(i*me.PART_HEIGHT)+')';});

        this.partRenderer = Ext.create("Teselagen.renderer.de.PartRenderer", {
            gridManager: me,
            gridPartParentSVG: this.gridPartParentSVG,
            gridPartSVG: this.gridPartSVG
        });
        this.partRenderer.renderParts();

        this.gridBinDsfSVG = this.gridBinSVG
            .append("svg:line")
            .attr("class", "gridBinDsfSVG")
            .attr("x1", function (d) {
                if(d.get("dsf")) return me.COLUMN_WIDTH-1;
                else d3.select(this).remove();
            })
            .attr("y1", 1)
            .attr("x2", me.COLUMN_WIDTH-1)
            .attr("y2", me.BIN_HEIGHT+me.BIN_PART_GAP_HEIGHT+me.totalRows*me.PART_HEIGHT)
            .attr("stroke", "red")
            .attr("stroke-width", 1)
            .attr("shape-rendering", "crispEdges")
            .attr("stroke-dasharray",(me.BIN_HEIGHT-2)+", "+(me.BIN_PART_GAP_HEIGHT+1)+", "+(me.totalRows*me.PART_HEIGHT+1)+",0");


        if(this.selectedColumnIndex !== null) {
            this.selectGridBinHeaderByIndex(this.selectedColumnIndex, true);

            if(this.selectedPartIndex !== null) {
                this.selectGridCellByIndex(this.selectedColumnIndex, this.selectedPartIndex, true);
            }
        }
    },

    setListenersEnabled: function(value) {
        this.listenersEnabled = value;
    },

    areListenersEnabled: function() {
        return this.listenersEnabled;
    },

    addRowBelow: function() {
        var me = this;
        var rowIndex;
        var newCell;
        var bin;

        this.setListenersEnabled(false);

        if(this.selectedGridPart==null) rowIndex = -1;
        else rowIndex = parseInt(this.selectedGridPart.attr("deGridRowIndex"));

        for(var i=0; i < this.activeProject.bins().count(); i++) {
            bin = this.activeProject.bins().getAt(i);
            newCell = Ext.create("Teselagen.models.Cell", {
                index: rowIndex + 1
            });
            newCell.setJ5Bin(bin);
            bin.cells().insert(rowIndex + 1, newCell);
            this.selectedGridPart = null;
        }

        //this.totalRows++;

        this.setListenersEnabled(true);
        Teselagen.manager.GridCommandPatternManager.addCommand({
            type: "ROW",
            data: {
                type: "ADD",
                y: rowIndex,
                loc: "BELOW"
            }
        });

        Vede.application.fireEvent(Teselagen.event.DeviceEvent.RERENDER_DE_CANVAS, true);

        if(this.selectedColumnIndex !== null) {
            this.selectGridBinHeaderByIndex(this.selectedColumnIndex, true);
            this.selectGridCellByIndex(this.selectedColumnIndex, rowIndex, true);
        }
    },

    addRowAbove: function() {
        var me = this;
        var newCell;
        var bin;
        var rowIndex = parseInt(this.selectedGridPart.attr("deGridRowIndex"));
        var binCount = this.activeProject.bins().count();

        this.setListenersEnabled(false);

        this.selectedColumnIndex = Number(this.selectedGridBin.attr("deGridBinIndex"));

        for(var i=0;i<binCount;i++) {
            bin = this.activeProject.bins().getAt(i);
            newCell = Ext.create("Teselagen.models.Cell", {
                index: rowIndex
            });
            newCell.setJ5Bin(bin);
            bin.cells().insert(rowIndex, newCell);
            this.selectedGridPart = null;
        }

        this.setListenersEnabled(true);
        // Fire event to re-render grid. This might be the wrong event or wrong eventArgs to fire, though.
        // this.activeProject.bins().getAt(0).cells().fireEvent("add");
        // this.InspectorController.clearPartInfo();
        //this.activeProject.bins().fireEvent("update");

        this.GridController.toggleCutCopyPastePartOptions(false);
        this.GridController.toggleInsertOptions(false);
        this.GridController.toggleInsertRowAboveOptions(false);
        this.GridController.toggleInsertRowBelowOptions(false);

        Teselagen.manager.GridCommandPatternManager.addCommand({
            type: "ROW",
            data: {
                type: "ADD",
                y: rowIndex,
                loc: "ABOVE"
            }
        });

        Vede.application.fireEvent(Teselagen.event.DeviceEvent.RERENDER_DE_CANVAS, true);

        if(this.selectedColumnIndex !== null) {
            this.selectGridBinHeaderByIndex(this.selectedColumnIndex, true);
            this.selectGridCellByIndex(this.selectedColumnIndex, rowIndex+1, true);
        }
    },

    addColumnRight: function() {
        var me = this;
        var columnIndex = parseInt(this.selectedGridBin.attr("deGridBinIndex"));

        this.setListenersEnabled(false);

        this.selectedGridPart = null;
        this.selectedGridBin = null;
        //var newBin = this.activeProject.addNewBinByIndex(columnIndex+1);

        var newBin = this.activeProject.generateDefaultNewBin();
        this.setListenersEnabled(true);
        this.activeProject.bins().insert(columnIndex+1, newBin);

        Vede.application.fireEvent(Teselagen.event.DeviceEvent.SELECT_BIN, null, columnIndex+1);

        Teselagen.manager.GridCommandPatternManager.addCommand({
            type: "BIN",
            data: {
                type: "ADD",
                x: columnIndex,
                loc: "RIGHT",
                data: newBin
            }
        });
    },

    addColumnLeft: function() {
        var me = this;
        var columnIndex = parseInt(this.selectedGridBin.attr("deGridBinIndex"));

        this.setListenersEnabled(false);

        this.selectedGridPart = null;
        this.selectedGridBin = null;

        var digestFasIndices = [];
        if(columnIndex===0) {
            var firstBinCells = this.activeProject.bins().getAt(0).cells();
            for(var i=0;i<firstBinCells.count();i++) {
                var cell = firstBinCells.getAt(i);
                if(cell.get("fas")==="DIGEST") {
                    digestFasIndices.push(i);
                    cell.set("fas", "None");
                }
            }
        }

        var newBin = this.activeProject.generateDefaultNewBin();
        this.setListenersEnabled(true);
        this.activeProject.bins().insert(columnIndex, newBin);

        Vede.application.fireEvent(Teselagen.event.DeviceEvent.SELECT_BIN, null, columnIndex);

        Teselagen.manager.GridCommandPatternManager.addCommand({
            type: "BIN",
            data: {
                type: "ADD",
                x: columnIndex,
                loc: "LEFT",
                data: newBin,
                digests: digestFasIndices
            }
        });
    },

    removeColumn: function() {
        var me = this;
        var columnIndex = parseInt(this.selectedGridBin.attr("deGridBinIndex"));
        var oneBinLeft = false;

        this.selectedGridPart = null;
        this.selectedGridBin = null;

        this.setListenersEnabled(false);
        var removedStuff = Teselagen.manager.DeviceDesignManager.removeRulesAndPartsAssocWithBin(this.activeProject, null, columnIndex);
        var removedBin = this.activeProject.bins().getAt(columnIndex);
        this.setListenersEnabled(true);
        Teselagen.manager.DeviceDesignManager.removeBinByIndex(this.activeProject, columnIndex);

        if(this.activeProject.bins().count()===0) {
            oneBinLeft = true;
            this.activeProject.addNewBinByIndex(0);
        }

        //Vede.application.fireEvent(Teselagen.event.DeviceEvent.RERENDER_DE_CANVAS);

        this.GridController.toggleCutCopyPastePartOptions(false);
        this.GridController.toggleInsertOptions(false);
        this.GridController.toggleInsertRowAboveOptions(false);
        this.GridController.toggleInsertRowBelowOptions(false);

        Teselagen.manager.GridCommandPatternManager.addCommand({
            type: "BIN",
            data: {
                type: "DEL",
                x: columnIndex,
                data: removedBin,
                oneBinLeft: oneBinLeft,
                rules: removedStuff.removedRules,
                parts: removedStuff.removedParts
            }
        });
    },

    removeRow: function() {
        var me = this;
        var rowIndex = parseInt(this.selectedGridPart.attr("deGridRowIndex"));
        var oneRowLeft = false;
        var removedRow = [];

        this.setListenersEnabled(false);

        this.selectedGridPart = null;
        this.selectedGridBin = null;

        var removedStuff = Teselagen.manager.DeviceDesignManager.removeRulesAndPartsAssocWithRow(this.activeProject, rowIndex);

        if(this.activeProject.bins().getAt(0).cells().count()===1) {
            oneRowLeft = true;
            var newCell;
            for(var i=0;i<this.activeProject.bins().count();i++) {
                var cells = this.activeProject.bins().getAt(i).cells();
                removedRow.push(cells.getAt(rowIndex));
                cells.removeAt(rowIndex);
                newCell = Ext.create("Teselagen.models.Cell", {
                    index: rowIndex
                });
                cells.add(newCell);
            }
        } else {
            for(var i=0;i<this.activeProject.bins().count();i++) {
                var cells = this.activeProject.bins().getAt(i).cells();
                removedRow.push(cells.getAt(rowIndex));
                cells.removeAt(rowIndex);
            }
        }


        this.GridController.toggleCutCopyPastePartOptions(false);
        this.GridController.toggleInsertOptions(false);
        this.GridController.toggleInsertRowAboveOptions(false);
        this.GridController.toggleInsertRowBelowOptions(false);

        //Vede.application.fireEvent(Teselagen.event.DeviceEvent.RERENDER_DE_CANVAS);
        this.setListenersEnabled(true);
        // Fire event to re-render grid. This might be the wrong event or wrong eventArgs to fire, though.
        this.activeProject.bins().getAt(0).cells().fireEvent("remove");
        //this.activeProject.bins().getAt(0).cells().fireEvent("update");

        Teselagen.manager.GridCommandPatternManager.addCommand({
            type: "ROW",
            data: {
                type: "DEL",
                y: rowIndex,
                data: removedRow,
                oneRowLeft: oneRowLeft,
                rules: removedStuff.removedRules,
                parts: removedStuff.removedParts
            }
        });
    },

    clearSelectedPart: function() {
        var cell = this.selectedGridPart.datum();

        var xIndex = parseInt(this.selectedGridBin.attr("deGridBinIndex"));
        var yIndex = parseInt(this.selectedGridPart.attr("deGridRowIndex"));

        this.setListenersEnabled(false);

        var removedStuff = Teselagen.manager.DeviceDesignManager.removeRulesAndPartsAssocWithCell(this.activeProject, cell);
        var oldPart = cell.getPart();
        var oldFas = cell.get("fas");

        cell.setPart();
        cell.set("part_id", null);
        cell.set("fas", "None");
        this.setListenersEnabled(true);
        // Fire event to re-render grid. This might be the wrong event or wrong eventArgs to fire, though.
        this.activeProject.bins().getAt(0).cells().fireEvent("remove");


        //Vede.application.fireEvent(Teselagen.event.DeviceEvent.RERENDER_DE_CANVAS);

        this.GridController.toggleCutCopyPastePartOptions(false);
        this.GridController.toggleInsertOptions(false);
        this.GridController.toggleInsertRowAboveOptions(false);
        this.GridController.toggleInsertRowBelowOptions(false);

        Teselagen.manager.GridCommandPatternManager.addCommand({
            type: "PART",
            data: {
                type: "DEL",
                x: xIndex,
                y: yIndex,
                data: {
                    oldPart: oldPart,
                    oldFas: oldFas
                },
                rules: removedStuff.removedRules,
                part: removedStuff.removedPart
            }
        });

    },

    cutSelectedPart: function() {

    },

    selectGridCell: function(gridCell) {
        var gridManager = Teselagen.manager.GridManager;
        gridManager.GridController.toggleCutCopyPastePartOptions(true);
        gridManager.GridController.toggleInsertOptions(true);
        gridManager.GridController.toggleInsertRowAboveOptions(true);
        gridManager.GridController.toggleInsertRowBelowOptions(true);

        if(d3.select(gridCell.parentNode.parentNode.parentNode).select(".gridBinHeaderRectSVG").attr("isSelected")!="true") {
            d3.selectAll(".gridBinHeaderRectSVG")
                .attr("fill", gridManager.BIN_FILL_COLOR)
                .attr("stroke", gridManager.BIN_OUTLINE_COLOR)
                .attr("isSelected", "false");
            d3.select(gridCell.parentNode.parentNode.parentNode).select(".gridBinHeaderRectSVG")
                .transition()
                .duration(30)
                .attr("stroke", gridManager.BIN_SELECTED_OUTLINE_COLOR)
                .attr("fill", gridManager.BIN_SELECTED_FILL_COLOR)
                .attr("isSelected", "true");
            gridManager.selectedGridBin = d3.select(gridCell.parentNode.parentNode.parentNode);
        }

        if(d3.select(gridCell).attr("isSelected")=="true") return;

        d3.selectAll(".gridPartRectSVG")
            .attr("fill", gridManager.PART_FILL_COLOR)
            .attr("stroke", function(d) {
                var part = d.getPart();

                if(!part) {
                    return gridManager.PART_OUTLINE_COLOR;
                }

                if(!part.isMapped()) {
                    return gridManager.PART_UNMAPPED_OUTLINE_COLOR;
                } else {
                    return gridManager.PART_OUTLINE_COLOR;
                }
            })
            .attr("isSelected", "false");

        d3.select(gridCell).transition()
            .duration(30)
            .attr("stroke", gridManager.PART_HOVER_OUTLINE_COLOR)
            .attr("fill", gridManager.PART_SELECTED_FILL_COLOR)
            .attr("isSelected", "true");

        gridManager.selectedGridPart = d3.select(gridCell.parentNode);
    },

    selectGridCellByIndex: function(xIndex, yIndex) {
        var me = Teselagen.manager.GridManager;
        var gridCell = me.parentSVG.selectAll(".gridBinSVG")
            .filter(function(d, i) {return i===xIndex;})
            .selectAll(".gridPartSVG")
            .filter(function(d, i) {return i===yIndex;})
            .select(".gridPartRectSVG")
            .node();
        me.selectGridCell(gridCell);
    },

    selectGridBinHeader: function(gridBin) {
        var gridManager = Teselagen.manager.GridManager;
        gridManager.GridController.toggleCutCopyPastePartOptions(false);
        gridManager.GridController.toggleRemoveColumnOptions(true);
        gridManager.GridController.toggleInsertOptions(true);
        gridManager.GridController.toggleInsertRowAboveOptions(false);
        gridManager.GridController.toggleInsertRowBelowOptions(true);

        if(gridManager.selectedGridPart != null) {
            d3.selectAll(".gridPartRectSVG")
                .attr("fill", gridManager.PART_FILL_COLOR)
                .attr("stroke", function(d) {
                    var part = d.getPart();

                    if(!part) {
                        return gridManager.PART_OUTLINE_COLOR;
                    }

                    if(!part.isMapped()) {
                        return gridManager.PART_UNMAPPED_OUTLINE_COLOR;
                    } else {
                        return gridManager.PART_OUTLINE_COLOR;
                    }
                })
                .attr("isSelected", "false");
            gridManager.selectedGridPart = null;
        }

        if(d3.select(gridBin).attr("isSelected")=="true") return;

        d3.selectAll(".gridBinHeaderRectSVG")
            .attr("fill", gridManager.BIN_FILL_COLOR)
            .attr("stroke", gridManager.BIN_OUTLINE_COLOR)
            .attr("isSelected", "false");

        d3.select(gridBin).transition()
            .duration(30)
            .attr("stroke", gridManager.BIN_SELECTED_OUTLINE_COLOR)
            .attr("fill", gridManager.BIN_SELECTED_FILL_COLOR)
            .attr("isSelected", "true");

        gridManager.selectedGridBin = d3.select(gridBin.parentNode.parentNode);
    },

    selectGridBinHeaderByIndex: function(xIndex) {
        var me = Teselagen.manager.GridManager;
        var gridBinHeaderRect = me.parentSVG.selectAll(".gridBinSVG")
            .filter(function(d, i) {return i===xIndex;})
            .select(".gridBinHeaderRectSVG")
            .node();
        me.selectGridBinHeader(gridBinHeaderRect);
    },

    onFlipBinButtonClick: function() {
        var gridBin = d3.select(this.parentNode.parentNode);
        var j5Bin = gridBin.datum();
        var xIndex = parseInt(gridBin.attr("deGridBinIndex"));
        var event = document.createEvent('UIEvents');

        event.initUIEvent('click', true, true, window, 1);
        this.parentNode.parentNode.dispatchEvent(event);

        j5Bin.set("directionForward", !j5Bin.get("directionForward"));

        Teselagen.manager.GridCommandPatternManager.addCommand({
            type: "BIN",
            data: {
                type: "DIR",
                x: xIndex,
                oldData: !j5Bin.get("directionForward")
            }
        });
        //Teselagen.manager.GridManager.selectGridBinHeaderByIndex(xIndex);
    }
});
