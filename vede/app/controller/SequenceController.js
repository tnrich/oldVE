Ext.define("Vede.controller.SequenceController", {
    extend: "Ext.app.Controller",

    requires: ["Teselagen.event.CaretEvent",
               "Teselagen.event.MapperEvent",
               "Teselagen.event.SequenceManagerEvent",
               "Teselagen.event.SelectionEvent",
               "Teselagen.event.VisibilityEvent",
               "Teselagen.manager.RestrictionEnzymeGroupManager"],

    AAManager: null,
    ORFManager: null,
    RestrictionEnzymeManager: null,
    SequenceManager: null,

    RestrictionEnzymeGroupManager: null,

    Managers: null,

    CaretEvent: null,
    MapperEvent: null,
    SelectionEvent: null,
    VisibilityEvent: null,

    WireframeSelectionLayer: null,
    SelectionLayer: null,

    listeners:{
    },

    init: function() {
        this.CaretEvent = Teselagen.event.CaretEvent;
        this.MapperEvent = Teselagen.event.MapperEvent;
        this.SelectionEvent = Teselagen.event.SelectionEvent;
        this.VisibilityEvent = Teselagen.event.VisibilityEvent;

        var listenersObject = {
            SequenceManagerChanged: this.onSequenceManagerChanged,
            ActiveEnzymesChanged: this.onActiveEnzymesChanged,
            AnnotationClicked: this.onAnnotationClicked,
            ViewModeChanged: this.onViewModeChanged,
            SequenceManagerChanged: this.onSequenceManagerChanged,
            scope: this
        };

        listenersObject[this.VisibilityEvent.SHOW_FEATURES_CHANGED] = 
            this.onShowFeaturesChanged;
        listenersObject[this.VisibilityEvent.SHOW_CUTSITES_CHANGED] = 
            this.onShowCutSitesChanged;
        listenersObject[this.VisibilityEvent.SHOW_ORFS_CHANGED] = 
            this.onShowOrfsChanged;

        listenersObject[this.MapperEvent.AA_MAPPER_UPDATED] = 
            this.onAAManagerUpdated;
        listenersObject[this.MapperEvent.ORF_MAPPER_UPDATED] = 
            this.onORFManagerUpdated;
        listenersObject[this.MapperEvent.RESTRICTION_ENZYME_MAPPER_UPDATED] =
            this.onRestrictionEnzymeManagerUpdated;

        console.log(listenersObject);
        this.application.on(listenersObject);
    },

    onLaunch: function() {
        // TODO: maybe put managers in statics so they are shared by all 
        // child constructors? 
        
        this.RestrictionEnzymeGroupManager = 
            Teselagen.manager.RestrictionEnzymeGroupManager;

        if(!this.RestrictionEnzymeGroupManager.isInitialized) {
            this.RestrictionEnzymeGroupManager.initialize();
        }

        this.AAManager = Ext.create("Teselagen.manager.AAManager", {
            sequenceManager: this.SequenceManager
        });
        
        this.ORFManager = Ext.create("Teselagen.manager.ORFManager", {
            sequenceManager: this.SequenceManager
        });

        this.RestrictionEnzymeManager = 
            Ext.create("Teselagen.manager.RestrictionEnzymeManager", {
                sequenceManager: this.SequenceManager,
                restrictionEnzymeGroup: 
                    this.RestrictionEnzymeGroupManager.getActiveGroup()
        });

        this.Managers = [this.AAManager, 
                         this.RestrictionEnzymeManager,
                         this.ORFManager];
    },

    onActiveEnzymesChanged: function() {
        this.RestrictionEnzymeManager.setRestrictionEnzymeGroup(
            this.RestrictionEnzymeGroupManager.getActiveGroup());
    },

    onSequenceManagerChanged: function(pSeqMan) {
        this.SequenceManager = pSeqMan;

        Ext.each(this.Managers, function(manager) {
            manager.setSequenceManager(pSeqMan);
        });

        this.SequenceManager.on(Teselagen.event.SequenceManagerEvent.SEQUENCE_CHANGED, 
                                this.onSequenceChanged, this);

        this.SequenceManager.on(Teselagen.event.SequenceManagerEvent.SEQUENCE_CHANGING, 
                                this.onSequenceChanging, this);
    },



    // kind is the type of Sequence Changed/Changing that occurs
    // Obj is a SequenceManagerMemento, feature, or some other {} input that needs to be remembered
    onSequenceChanged: function(kind, obj) {
        Ext.each(this.Managers, function(manager) {
            manager.sequenceChanged();
        });

        switch (kind) {
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
    },

    onAnnotationClicked: function(start, end) {
    },

    onShowCutSitesChanged: function(show) {
    },

    onShowFeaturesChanged: function(show) {
    },

    onShowOrfsChanged: function(show) {
    },

    onViewModeChanged: function(viewMode) {
    },
});
