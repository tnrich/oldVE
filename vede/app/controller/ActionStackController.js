Ext.define("Vede.controller.ActionStackController", {
    extend: "Ext.app.Controller",

    requires: ["Teselagen.event.MenuItemEvent",
               "Teselagen.event.SequenceManagerEvent"],

    ActionStackManager: null,
    SequenceManager: null,

    MenuItemEvent: null,
    SequenceManagerEvent: null,

    init: function() {
        this.MenuItemEvent = Teselagen.event.MenuItemEvent;
        this.SequenceManagerEvent = Teselagen.event.SequenceManagerEvent;

        this.application.on(this.SequenceManagerEvent.SEQUENCE_MANAGER_CHANGED,
                            this.onSequenceManagerChanged, this);
        
        this.application.on(this.SequenceManagerEvent.SEQUENCE_CHANGING,
                            this.onSequenceChanging, this);

        this.application.on(this.MenuItemEvent.UNDO,
                            this.onUndo, this);
        this.application.on(this.MenuItemEvent.REDO,
                            this.onRedo, this);
        this.application.on("saveCurrentVEProject",
                    this.onsaveCurrentVEProject, this);

    },

    onLaunch: function() {
        this.ActionStackManager = Ext.create("Teselagen.manager.ActionStackManager");
    },

    onSequenceManagerChanged: function(pSeqMan) {
        this.SequenceManager = pSeqMan;
        this.ActionStackManager.setSequenceManager(pSeqMan);
        this.ActionStackManager.clear();
    },

    onSequenceChanging: function(kind, memento) {
        console.log("adding memento");
        this.ActionStackManager.add(memento);
    },

    onUndo: function() {
        if(this.SequenceManager && this.ActionStackManager.undoStack.length != 0) {
            this.ActionStackManager.undo();
        }
    },

    onRedo: function() {
        if(this.SequenceManager && this.ActionStackManager.redoStack.length != 0) {
            this.ActionStackManager.redo();
        }
    },
    onsaveCurrentVEProject: function() {
        var workingSequence = Teselagen.manager.ProjectManager.workingSequence;
        var updatedGenbankSequence = this.SequenceManager.toGenbank().toString();
        workingSequence.set('sequenceFileFormat',updatedGenbankSequence);
        workingSequence.save({
            callback:function(){
                console.log("Working sequence updated!");
        }});
    },
});
