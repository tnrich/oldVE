/**
 * @singleton
 * @class Teselagen.event.DeviceEvent
 * Events which are fired when a device is edited.
 * @author Nick Elsbree
 */
Ext.define("Teselagen.event.DeviceEvent", {
    singleton: true,

    ADD_COLUMN_LEFT: "AddColumnLeft",
    ADD_COLUMN_RIGHT: "AddColumnRight",
    ADD_ROW_ABOVE: "AddRowAbove",
    ADD_ROW_BELOW: "AddRowBelow",

    CHECK_J5_READY: "CheckJ5Ready",

    SELECT_BIN: "SelectBin",
    SELECT_PART: "SelectPart",
    CLEAR_PART: "ClearPart",
    REMOVE_COLUMN: "RemoveColumn",
    REMOVE_ROW: "RemoveRow",

    INSERT_PART_AT_SELECTION: "InsertPartAtSelection",

    MAP_PART: "MapPart",
    MAP_PART_SELECT: "MapPartSelect",
    MAP_PART_NOTSELECT: "MapPartNotSelect",

    // TODO: Not used?
    ADD_SELECT_ALERTS: "AddSelectAlerts",

    FILL_BLANK_CELLS: "FillBlankCells",

    RERENDER_COLLECTION_INFO: "RerenderCollectionInfo",
    RERENDER_DE_CANVAS: "RerenderDECanvas",

    OPEN_PART_LIBRARY: "OpenPartLibrary"
});
