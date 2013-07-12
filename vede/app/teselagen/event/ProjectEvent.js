/**
 * Project events.
 * @class Teselagen.event.ProjectEvent
 * @author Rodrigo Pavez
 */
Ext.define("Teselagen.event.ProjectEvent", {
    singleton: true,
    OPEN_PROJECT: "openProject",
    SAVE_PROJECT: "saveProject",
    CLOSE_PROJECT: "closeProject",
    LOAD_PROJECT_TREE: "loadProjectTree",

    IMPORT_FILE_TO_SEQUENCE: "ImportFileToSequence",
    OPEN_SEQUENCE_IN_VE: "OpenSequenceInVectorEditor",
});
