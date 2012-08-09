Ext.define('Vede.controller.AnnotatePanelController', {
    extend: 'Vede.controller.SequenceController',

    requires: ["Teselagen.event.SequenceManagerEvent",
               "Teselagen.event.MapperEvent"],

    AnnotatePanel: null,

    SequenceAnnotationManager: null,

    init: function(){
        this.callParent();
    },
    onLaunch: function() {
        this.callParent();

        this.AnnotatePanel = Ext.getCmp('AnnotatePanel');

        this.SequenceAnnotationManager = Ext.create("Teselagen.manager.SequenceAnnotationManager", {
            sequenceManager: this.SequenceManager,
            orfManager: this.ORFManager,
            aaManager: this.AAManager,
            restrictionEnzymeManager: this.RestrictionEnzymeManager,
            annotatePanel: this.AnnotatePanel,
        });

        this.Managers.push(this.SequenceAnnotationManager);

        this.AnnotatePanel.add(this.SequenceAnnotationManager.getAnnotator());
        this.AnnotatePanel.show(true);
    },


    onSequenceManagerChanged: function(pSeqMan){
        this.callParent(arguments);

        this.SequenceAnnotationManager.setSequenceManager(pSeqMan);
    },

    onShowFeaturesChanged: function(show) {
        this.SequenceAnnotationManager.setShowFeatures(show);

        if(this.SequenceAnnotationManager.sequenceManager) {
            this.SequenceAnnotationManager.render();
        }
    },

    onShowCutSitesChanged: function(show) {
        this.SequenceAnnotationManager.setShowCutSites(show);

        if(this.SequenceAnnotationManager.sequenceManager) {
            this.SequenceAnnotationManager.render();
        }
    },

    onShowOrfsChanged: function(show) {
        this.SequenceAnnotationManager.setShowOrfs(show);

        if(this.SequenceAnnotationManager.sequenceManager) {
            this.SequenceAnnotationManager.render();
        }
    },

    onSequenceChanged: function(kind, obj) {
        Ext.each(this.Managers, function(manager) {
            manager.sequenceChanged();
        });

        console.log(kind);
    },

    onSelectionChanged: function() {
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
