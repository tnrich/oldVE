Ext.define("Vede.controller.SequenceController", {
    extend: "Ext.app.Controller",

    SequenceManager: null,
    AAManager: null,
    ORFManager: null,
    RestrictionEnzymeManager: null,
    TraceManager: null,

    onLaunch: function() {
        this.SequenceManager = Ext.create("Teselagen.manager.SequenceManager", {
            name: "sequenceManager",
            circular: false,
        });
    }
});
