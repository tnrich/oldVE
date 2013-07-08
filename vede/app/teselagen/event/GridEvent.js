/**
 * @singleton
 * @class Teselagen.event.GridEvent
 * Events which are fired by the DE grid, such as clicking a bin header, etc.
 * @author Nick Elsbree
 */
Ext.define("Teselagen.event.GridEvent", {
    singleton: true,

    // Fired when a bin header is clicked.
    BIN_HEADER_CLICK: "BinHeaderClick",

    // Suspend/resume alerts on the parts store.
    SUSPEND_PART_ALERTS: "SuspendPartAlerts",
    RESUME_PART_ALERTS: "ResumePartAlerts",
});
