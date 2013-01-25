/**
 * Selection layer events.
 * @class Teselagen.event.SelectionLayerEvent
 */
Ext.define("Teselagen.event.SelectionLayerEvent", {
    singleton: true,

    OVER: "overSelectionEvent",
    OUT: "outOfSelectionEvent",
    SELECT: "selectEvent",
    DESELECT: "deselectEvent",
    SELECTION_CHANGED: "selectionLayerSelectionChanged",
    HANDLE_CLICKED: "handleClickedEvent",
    HANDLE_RELEASED: "handleReleasedEvent"
});
