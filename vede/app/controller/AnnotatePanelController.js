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
        this.callParent(arguments);
        
        this.AnnotatePanel = Ext.getCmp('AnnotatePanel');
        
        this.SequenceAnnotationManager = Ext.create("Teselagen.manager.SequenceAnnotationManager", {
            sequenceManager: this.SequenceManager,
            orfManager: this.ORFManager,
            aaManager: this.AAManager,
            restrictionEnzymeManager: this.RestrictionEnzymeManager,
            annotatePanel: this.AnnotatePanel,
            showCutSites: Ext.getCmp("cutSitesMenuItem").checked,
            showFeatures: Ext.getCmp("featuresMenuItem").checked,
            showOrfs: Ext.getCmp("orfsMenuItem").checked
        });

        this.AnnotatePanel.add(this.SequenceAnnotationManager.getAnnotator());
        this.AnnotatePanel.show(true);

        this.Managers.push(this.SequenceAnnotationManager);
    },

    onSequenceManagerChanged: function(pSeqMan){
        this.callParent(arguments);

        this.SequenceAnnotationManager.setSequenceManager(pSeqMan);
        this.SequenceAnnotationManager.sequenceChanged(pSeqMan);
    },

    onSequenceChanged: function(kind, obj) {
        Ext.each(this.Managers, function(manager) {
            manager.sequenceChanged();
        });

        console.log(kind);
    },

    onShowCutSitesChanged: function(show) {
        this.SequenceAnnotationManager.setShowCutSites(show);
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
