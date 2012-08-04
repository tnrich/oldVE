Ext.define("Vede.controller.SequenceController", {
    extend: "Ext.app.Controller",

    requires: ["Teselagen.event.SequenceManagerEvent",
               "Teselagen.event.MapperEvent"],

    SequenceManager: null,
    AAManager: null,
    ORFManager: null,
    RestrictionEnzymeManager: null,
    TraceManager: null,

    Managers: null,

    listeners:{


    },

    onLaunch: function() {
        this.SequenceManager = Ext.create("Teselagen.manager.SequenceManager", {
            name: "sequenceManager",
            circular: false,
        });

        // Listeners in each Manager

        this.SequenceManager.on(Teselagen.event.SequenceManagerEvent.SEQUENCE_CHANGED, 
                                this.onSequenceChanged, this);

        this.SequenceManager.on(Teselagen.event.SequenceManagerEvent.SEQUENCE_CHANGING, 
                                this.onSequenceChanging, this);

        this.AAManager.on(Teselagen.event.MapperEvent.AA_MAPPER_UPDATED,
                          this.onAAManagerUpdated, this);

        this.ORFManager.on(Teselagen.event.MapperEvent.ORF_MAPPER_UPDATED,
                          this.onORFManagerUpdated, this);

        this.RestrictionEnzymeManager.on(Teselagen.event.MapperEvent.RESTRICTION_ENZYME_MAPPER_UPDATED,
                          this.onRestrictionEnzymeManagerUpdated, this);

        this.TraceManager.on(Teselagen.event.MapperEvent.ORF_MAPPER_UPDATED,
                          this.onTraceManagerUpdated, this);

    },

    // kind is the type of Sequence Changed/Changing that occurs
    // Obj is a SequenceManagerMemento, feature, or some other {} input that needs to be remembered
    onSequenceChanged: function(kind, obj) {
        Ext.each(this.Managers, function(manager) {
            manager.sequenceChanged();
        });

        swtich (kind) {
            case Teselagen.event.SequenceManagerEvent.KIND_FEATURE_ADD:
                break;
            case Teselagen.event.SequenceManagerEvent.KIND_FEATURE_REMOVE:
                break;
            case Teselagen.event.SequenceManagerEvent.KIND_FEATURES_ADD:
                break;
            case Teselagen.event.SequenceManagerEvent.KIND_FEATURES_REMOVE:
                break;
            case Teselagen.event.SequenceManagerEvent.KIND_SEQUENCE_INSERT:
                break;
            case Teselagen.event.SequenceManagerEvent.KING_SEQUENCE_REMOVE:
                break;
            case Teselagen.event.SequenceManagerEvent.KIND_MANUAL_UPDATE:
                break;
            case Teselagen.event.SequenceManagerEvent.KIND_SET_MEMENTO:
                break;
            case Teselagen.event.SequenceManagerEvent.KING_INITIALIZED:
                break;
        };

        var objType = Ext.getClassName(obj);

        if (objType.match(/SequenceManagerMemento/)) {
            // Put in stack of SeqMgr Mementos
        } // else ?


    },

    onSequenceChanging: function(kind, obj) {
    },

    onAAManagerUpdated: function() {
    },

    onORFManagerUpdated: function() {
    },

    onRestrictionEnzymeManagerUpdated: function() {
    },

    onTraceManagerUpdated: function() {
    }
});
