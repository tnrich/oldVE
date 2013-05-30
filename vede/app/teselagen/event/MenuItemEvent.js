/**
 * @singleton
 * Events for when menu items are clicked.
 */
Ext.define("Teselagen.event.MenuItemEvent", {
    singleton: true,

    CUT: "Cut",
    COPY: "Copy",
    PASTE: "Paste",

    UNDO: "Undo",
    REDO: "Redo",

    SELECT_ALL: "SelectAll",
    SELECT_INVERSE: "SelectInverse",

    FIND_PANEL_OPENED: "FindPanelOpened",
    SELECT_WINDOW_OPENED: "SelectWindowOpened",

    REVERSE_COMPLEMENT: "ReverseComplement",
    REBASE_SEQUENCE: "RebaseSequence",
});
