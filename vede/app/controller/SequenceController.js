/**
 * @class Vede.controller.SequenceController
 * Parent class of AnnotatePanelController, PieController, and RailController.
 * Handles general user input and events for sequence display and manipulation.
 */
Ext.define("Vede.controller.SequenceController", {
    extend: "Ext.app.Controller",

    requires: ["Teselagen.event.CaretEvent",
               "Teselagen.event.MapperEvent",
               "Teselagen.event.MenuItemEvent",
               "Teselagen.event.SequenceManagerEvent",
               "Teselagen.event.SelectionEvent",
               "Teselagen.event.SelectionLayerEvent",
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
    MenuItemEvent: null,
    SelectionEvent: null,
    SelectionLayerEvent: null,
    SequenceManagerEvent: null,
    VisibilityEvent: null,

    WireframeSelectionLayer: null,
    SelectionLayer: null,

    mouseIsDown: false,
    startSelectionIndex: 0,
    selectionDirection: 0,
    caretIndex: 0,

    clickedAnnotationStart: null,
    clickedAnnotationEnd: null,

    listeners:{
    },

    init: function() {
        this.CaretEvent = Teselagen.event.CaretEvent;
        this.MapperEvent = Teselagen.event.MapperEvent;
        this.MenuItemEvent = Teselagen.event.MenuItemEvent;
        this.SelectionEvent = Teselagen.event.SelectionEvent;
        this.SelectionLayerEvent = Teselagen.event.SelectionLayerEvent;
        this.SequenceManagerEvent = Teselagen.event.SequenceManagerEvent;
        this.VisibilityEvent = Teselagen.event.VisibilityEvent;

        var listenersObject = {
            SequenceManagerChanged: this.onSequenceManagerChanged,
            ActiveEnzymesChanged: this.onActiveEnzymesChanged,
            VectorPanelAnnotationClicked: this.onVectorPanelAnnotationClicked,
            AnnotatePanelAnnotationClicked: this.onAnnotatePanelAnnotationClicked,
            ViewModeChanged: this.onViewModeChanged,
            scope: this
        };

        listenersObject[this.VisibilityEvent.SHOW_FEATURES_CHANGED] = 
            this.onShowFeaturesChanged;
        listenersObject[this.VisibilityEvent.SHOW_CUTSITES_CHANGED] = 
            this.onShowCutSitesChanged;
        listenersObject[this.VisibilityEvent.SHOW_ORFS_CHANGED] = 
            this.onShowOrfsChanged;

        listenersObject[this.VisibilityEvent.SHOW_FEATURE_LABELS_CHANGED] = 
            this.onShowFeatureLabelsChanged;
        listenersObject[this.VisibilityEvent.SHOW_CUTSITE_LABELS_CHANGED] =
            this.onShowCutSiteLabelsChanged;

        listenersObject[this.MapperEvent.AA_MAPPER_UPDATED] = 
            this.onAAManagerUpdated;
        listenersObject[this.MapperEvent.ORF_MAPPER_UPDATED] = 
            this.onORFManagerUpdated;
        listenersObject[this.MapperEvent.RESTRICTION_ENZYME_MAPPER_UPDATED] =
            this.onRestrictionEnzymeManagerUpdated;

        listenersObject[this.SelectionEvent.SELECTION_CHANGED] = 
            this.onSelectionChanged;
        listenersObject[this.SelectionEvent.SELECTION_CANCELED] =
            this.onSelectionCanceled;

        listenersObject[this.CaretEvent.CARET_POSITION_CHANGED] = 
            this.onCaretPositionChanged;

        this.application.on(listenersObject);

        this.application.on(this.MenuItemEvent.REVERSE_COMPLEMENT,
            this.onReverseComplementSequence, this);
        this.application.on(this.MenuItemEvent.REBASE_SEQUENCE, 
            this.onRebaseSequence, this);

        this.application.on(this.SequenceManagerEvent.SEQUENCE_CHANGING,
            this.onSequenceChanging, this);
        this.application.on(this.SequenceManagerEvent.SEQUENCE_CHANGED,
            this.onSequenceChanged, this);
    },

    onLaunch: function() {
        // TODO: maybe put managers in statics so they are shared by all 
        // child controllers? 
        
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
    },

    onRebaseSequence: function() {
        if(this.SequenceManager) {
            this.SequenceManager.rebaseSequence(this.caretIndex);
            this.changeCaretPosition(0);
        }

        // Return false to cancel the event. This makes sure the method is
        // called only once per event.
        return false;
    },

    onReverseComplementSequence: function(e) {
        if(this.SequenceManager) {
            this.SequenceManager.doReverseComplementSequence();
        }

        // Return false to cancel the event. This makes sure the method is
        // called only once per event.
        return false;
    },

    // kind is the type of Sequence Changed/Changing that occurs
    // Obj is a SequenceManagerMemento, feature, or some other {} input that needs to be remembered
    onSequenceChanged: function(kind, obj) {
        if(!this.SequenceManager) {
            return;
        }

        console.log("parent of " + this.$className);
        Ext.each(this.Managers, function(manager) {
            if(manager.sequenceChanged) {
                manager.sequenceChanged();
            }
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
            case Teselagen.event.SequenceManagerEvent.KIND_INITIALIZED:
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

    onSelectionChanged: function(scope, start, end) {
    },

    onSelectionCanceled: function() {
        if(this.SelectionLayer && this.SelectionLayer.selected) {
            this.SelectionLayer.deselect();
        }
    },

    onCaretPositionChanged: function(scope, index) {
        if(scope !== this && this.SelectionLayer && 
           !this.SelectionLayer.selecting) {
            this.changeCaretPosition(index, true);
        }
    },

    onVectorPanelAnnotationClicked: function(start, end) {
    },

    onAnnotatePanelAnnotationClicked: function(start, end) {
    },

    onShowCutSitesChanged: function(show) {
    },

    onShowFeaturesChanged: function(show) {
    },

    onShowOrfsChanged: function(show) {
    },

    onShowFeatureLabelsChanged: function(show) {
    },

    onShowCutSiteLabelsChanged: function(show) {
    },

    onViewModeChanged: function(viewMode) {
    },

    changeCaretPosition: function(index, silent) {
        this.caretIndex = index;

        if(!silent && this.SequenceManager) {
            this.application.fireEvent(this.CaretEvent.CARET_POSITION_CHANGED,
                                       this,
                                       index);
        }
    }
});
