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
    SELECT_CELL: "SelectCell",
    CLEAR_PART: "ClearPart",
    REMOVE_COLUMN: "RemoveColumn",
    REMOVE_ROW: "RemoveRow",

    INSERT_PART_AT_SELECTION: "InsertPartAtSelection",

    MAP_PART: "MapPart",
//    MAP_PART_SELECT: "MapPartSelect",
//    MAP_PART_NOTSELECT: "MapPartNotSelect",

//    ADD_SELECT_ALERTS: "AddSelectAlerts",

    // Fired when cells in the grid which have no associated part should be 
    // filled with phantom parts.
    FILL_BLANK_CELLS: "FillBlankCells",

    RERENDER_COLLECTION_INFO: "RerenderCollectionInfo",
    RERENDER_DE_CANVAS: "RerenderDECanvas",

    // Loads given design from server.
    RELOAD_DESIGN: "ReloadDesign",

    SAVE_DESIGN: "SaveDesign",

    // Loads Eugene rules from the server for a given design.
    LOAD_EUGENE_RULES: "LoadEugeneRules",

    OPEN_PART_LIBRARY: "OpenPartLibrary",
    OPEN_CHANGE_PART_DEFINITION: "OpenChangePartDefinition",

    // Fired when a new part is created and needs to be defined.
    CREATE_PART_DEFINITION: "CreatePartDefinition",

    //Fired when you need to create a new part inside of the design.
    CREATE_PART_IN_DESIGN: "CreatePartInDesign",

    // Fired when a new part has been defined.
    PART_CREATED: "PartCreated",

    VALIDATE_DUPLICATED_PART_NAME: "ValidateDuplicatedPartName",

    CLOSE_PART_CREATE_WINDOW: "ClosePartCreateWindow",
    
    CUT_PART: "CutPart",
    COPY_PART: "CopyPart",
    PASTE_PART: "PastePart",

    SUSPEND_TABS: "Suspend_tabs",
    RESUME_TABS: "Resume_tabs"
    
});
