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
    }
});
