/**
 * @singleton
 * Events for when menu items are clicked.
 */
Ext.define("Teselagen.event.MenuItemEvent", {
    singleton: true,

    UNDO: "Undo",
    REDO: "Redo",

    SELECT_ALL: "SelectAll",
    SELECT_INVERSE: "SelectInverse",

    REVERSE_COMPLEMENT: "ReverseComplement",
    REBASE_SEQUENCE: "RebaseSequence",
});
