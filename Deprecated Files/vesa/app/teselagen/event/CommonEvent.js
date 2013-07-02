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

    ACTION_MESSAGE: "ActionMessage"
});
