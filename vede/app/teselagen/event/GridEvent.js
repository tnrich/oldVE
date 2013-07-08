/**
 * @singleton
 * @class Teselagen.event.GridEvent
 * Events which are fired by the DE grid, such as clicking a bin header, etc.
 * @author Nick Elsbree
 */
Ext.define("Teselagen.event.GridEvent", {
    singleton: true,

    BIN_HEADER_CLICK: "BinHeaderClick",
    PART_CELL_CLICK: "PartCellClick",
    PART_CELL_DBLCLICK: "PartCellDblClick",

    PART_CELL_MOUSEOVER: "PartCellMouseover",
    PART_CELL_MOUSEOUT: "PartCellMouseout",

    // Suspend/resume alerts on the parts store.
    SUSPEND_PART_ALERTS: "SuspendPartAlerts",
    RESUME_PART_ALERTS: "ResumePartAlerts",
});
