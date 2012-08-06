Ext.define('Vede.controller.AnnotatePanelController', {
    extend: 'Ext.app.Controller',

    requires: ["Teselagen.event.SequenceManagerEvent",
               "Teselagen.event.MapperEvent"],


    AnnotatePanel: null,

    AAManager: null,
    ORFManager: null,
    RestrictionEnzymeManager: null,
    SequenceManager: null,
    TraceManager: null,
    SequenceAnnotationManager: null,

    Managers: null,
    
    onLaunch: function() {
        this.AnnotatePanel = Ext.getCmp('AnnotatePanel');
        

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

        this.SequenceAnnotationManager = Ext.create("Teselagen.manager.SequenceAnnotationManager", {
            sequenceManager: this.SequenceManager,
            orfManager: this.ORFManager,
            aaManager: this.AAManager,
            restrictionEnzymeManager: this.RestrictionEnzymeManager,
            annotatePanel: this.AnnotatePanel,
        });

        this.TraceManager = Ext.create("Teselagen.manager.TraceManager", {
            sequenceManager: this.SequenceManager
        });

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
        
        this.AnnotatePanel.add(this.SequenceAnnotationManager.getAnnotator());
        this.AnnotatePanel.show(true);
        this.Managers = [this.AAManager, 
                         this.ORFManager, 
                         this.RestrictionEnzymeManager, 
                         this.TraceManager];

        // Add event listeners to managers.
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

    listeners: {
    },

    onSequenceChanged: function(kind, obj) {
        Ext.each(this.Managers, function(manager) {
            manager.sequenceChanged();
        });

        console.log(kind);
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
