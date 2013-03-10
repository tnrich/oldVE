/**
 * @singleton
 * @class Teselagen.event.DeviceEvent
 * Events which are fired when a device is edited.
 * @author Nick Elsbree
 */
Ext.define("Teselagen.event.DeviceEvent", {
    singleton: true,

    ADD_COLUMN: "AddColumn",
    ADD_ROW: "AddRow",

    SELECT_BIN: "SelectBin",
    SELECT_PART: "SelectPart",
    MAP_PART: "MapPart",
    MAP_PART_SELECT: "MapPartSelect",
    MAP_PART_NOTSELECT: "MapPartNotSelect"
});