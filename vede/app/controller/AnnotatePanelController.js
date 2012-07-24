Ext.define('Vede.controller.AnnotatePanelController', {
    extend: 'Ext.app.Controller',

    requires: ["Teselagen.event.SequenceManagerEvent",
               "Teselagen.event.MapperEvent"],

    /*init: {
        updateSequenceChanged: Teselagen.manager.SequenceManagerEvent.SEQUENCE_CHANGED,
        updateSequenceChanging:     Teselagen.manager.SequenceManagerEvent.SEQUENCE_CHANGING
        //updateKindFeatureAdd:       Teselagen.manager.SequenceManagerEvent.KIND_FEATURE_ADD,
        //updateKindFeatureRemove:    Teselagen.manager.SequenceManagerEvent.KIND_FEATURE_REMOVE,
        //updateKindFeaturesAdd:      Teselagen.manager.SequenceManagerEvent.KIND_FEATURES_ADD,
        //updateKindFeaturesRemove:   Teselagen.manager.SequenceManagerEvent.KIND_FEATURES_REMOVE,
        //updateKindSequenceInsert:   Teselagen.manager.SequenceManagerEvent.KIND_SEQUENCE_INSERT,
        //updateKindSequenceRemove:   Teselagen.manager.SequenceManagerEvent.KIND_SEQUENCE_REMOVE,
        //updateKindKManualUpdate:    Teselagen.manager.SequenceManagerEvent.KIND_MANUAL_UPDATE,
        //updateKindSetMeento:        Teselagen.manager.SequenceManagerEvent.KIND_SET_MEMENTO,
        //updateKindInitialized:      Teselagen.manager.SequenceManagerEvent.KIND_INITIALIZED,
    },*/

    AAManager: null,
    ORFManager: null,
    RestrictionEnzymeManager: null,
    SequenceManager: null,
    TraceManager: null,

    Managers: null,
    
    onLaunch: function() {
        var ap = Ext.getCmp('AnnotatePanel');
        var box = Ext.create('Ext.draw.Sprite',{
            type: 'rect',
            fill: '#79BB3F',
            width: 100,
            height: 30,
            x: 10,
            y: 10,
            listeners: {
                //click: this.onClickPie
            }
        });
        
        var drawComponent2 = Ext.create('Ext.draw.Component', {
            items: [box]
        });
        ap.add(drawComponent2);
        //console.log(ap);
        
        // Instantiate the managers.
        this.SequenceManager = Ext.create("Teselagen.manager.SequenceManager", {
            name: "Sequence Manager"
        });

        this.AAManager = Ext.create("Teselagen.manager.AAManager", {
            sequenceManager: this.SequenceManager
        });
        
        this.ORFManager = Ext.create("Teselagen.manager.ORFManager", {
            sequenceManager: this.SequenceManager
        });

        this.RestrictionEnzymeManager = Ext.create("Teselagen.manager.RestrictionEnzymeManager", {
            sequenceManager: this.SequenceManager
        });

        this.TraceManager = Ext.create("Teselagen.manager.TraceManager", {
            sequenceManager: this.SequenceManager
        });

        this.Managers = [this.AAManager, 
                         this.ORFManager, 
                         this.RestrictionEnzymeManager, 
                         this.TraceManager];

        // Add event listeners to managers.
        this.SequenceManager.on(Teselagen.event.SequenceManagerEvent.SEQUENCE_CHANGED, 
                                this.onSequenceChanged, this);

        this.AAManager.on(Teselagen.event.MapperEvent.AA_MAPPER_UPDATED,
                          this.onAAManagerUpdated, this);

        this.ORFManager.on(Teselagen.event.MapperEvent.ORF_MAPPER_UPDATED,
                          this.onORFManagerUpdated, this);

        this.RestrictionEnzymeManager.on(Teselagen.event.MapperEvent.RESTRICTION_ENZYME_MAPPER_UPDATED,
                          this.onRestrictionEnzymeManagerUpdated, this);

        this.TraceManager.on(Teselagen.event.MapperEvent.ORF_MAPPER_UPDATED,
                          this.onTraceManagerUpdated, this);
    },

    onSequenceChanged: function() {
        Ext.each(this.Managers, function(manager) {
            manager.sequenceChanged();
        });
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
