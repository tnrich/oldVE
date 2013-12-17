/**
 * @singleton
 * @class Teselagen.event.CommonEvent
 * Common events for all pie, rail, and sequence annotator components.
 * @author Nick Elsbree
 * @author Zinovii Dmytriv (original author of CommonEvent.as)
 */
Ext.define("Teselagen.event.CommonEvent", {
    singleton: true,

    BEFORE_UPDATE: "BeforeUpdate",
    AFTER_UPDATE: "AfterUpdate",

    EDIT_FEATURE: "EditFeature",
    REMOVE_FEATURE: "RemoveFeature",
    CREATE_FEATURE: "CreateFeature",

    DELETE_PART: "DeletePart",
    DELETE_SEQUENCE: "DeleteSequence",

    RUN_J5: "RunJ5",
    J5_RUN_STATUS_CHANGED: "J5RunStatusChanged",
    LOAD_J5_RUNS: "LoadJ5Runs",
    JUMPTOJ5RUN: "jumpToJ5Run",
    RESET_J5BTN: "resetJ5ActiveRun",

    // Loads possible j5 assembly methods.
    LOAD_ASSEMBLY_METHODS: "LoadAssemblyMethods",

    ACTION_MESSAGE: "ActionMessage",

    LOAD_PRESETS: "LoadPresets"
});
