/**
 * Sequence selection events.
 * @singleton
 * @class Teselagen.event.SelectionEvent
 * @author Nick Elsbree
 * @author Zinovii Dmytriv (original author of SelectionEvent.as)
 */
Ext.define("Teselagen.event.SelectionEvent", {
    singleton: true,

    SELECTION_CHANGED: "SelectionChanged",
    SELECTION_CANCELED: "SelectionCanceled",

    HIGHLIGHT: "Highlight",
    CLEAR_HIGHLIGHT: "ClearHighlight"
});
