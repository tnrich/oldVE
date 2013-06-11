/**
 * @singleton
 * Events for when menu items are clicked.
 */
Ext.define("Teselagen.event.MenuItemEvent", {
    singleton: true,
    
    NEW_BLANK_VECTOR_EDITOR: "NewBlankVectorEditor",
    
    CUT: "Cut",
    COPY: "Copy",
    PASTE: "Paste",

    UNDO: "Undo",
    REDO: "Redo",

    SAFE_EDITING_CHANGED: "SafeEditingChanged",

    SELECT_ALL: "SelectAll",
    SELECT_INVERSE: "SelectInverse",

    FIND_PANEL_OPENED: "FindPanelOpened",
    GOTO_WINDOW_OPENED: "GoToWindowOpened",
    SELECT_WINDOW_OPENED: "SelectWindowOpened",

    REVERSE_COMPLEMENT: "ReverseComplement",
    REBASE_SEQUENCE: "RebaseSequence",
});
