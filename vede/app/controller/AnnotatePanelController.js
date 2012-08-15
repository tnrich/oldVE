Ext.define('Vede.controller.AnnotatePanelController', {
    extend: 'Vede.controller.SequenceController',

    requires: ["Teselagen.event.SequenceManagerEvent",
               "Teselagen.event.MapperEvent"],

    AnnotatePanel: null,

    SequenceAnnotationManager: null,

    init: function(){
        this.callParent();

        this.control({
            "#AnnotateContainer" : {
                render: function(c) {
                    c.el.on("mousedown", this.onMousedown, this);
                    c.el.on("mouseup", this.onMouseup, this);
                    c.el.on("mousemove", this.onMousemove, this);
                }
            }
        });

        var listenersObject = {scope: this};
        listenersObject[this.VisibilityEvent.SHOW_COMPLEMENTARY_CHANGED] = 
            this.onShowComplementaryChanged;
        listenersObject[this.VisibilityEvent.SHOW_SPACES_CHANGED] = 
            this.onShowSpacesChanged;
        listenersObject[this.VisibilityEvent.SHOW_SEQUENCE_AA_CHANGED] = 
            this.onShowSequenceAAChanged;
        listenersObject[this.VisibilityEvent.SHOW_REVCOM_AA_CHANGED] = 
            this.onShowRevcomAAChanged;

        this.application.on(listenersObject);
    },

    onLaunch: function() {
        this.callParent();

        this.AnnotatePanel = Ext.getCmp('AnnotateContainer');

        this.SequenceAnnotationManager = Ext.create("Teselagen.manager.SequenceAnnotationManager", {
            sequenceManager: this.SequenceManager,
            orfManager: this.ORFManager,
            aaManager: this.AAManager,
            restrictionEnzymeManager: this.RestrictionEnzymeManager,
            annotatePanel: this.AnnotatePanel,
        });

        console.log(this.SequenceAnnotationManager.annotator);
        this.AnnotatePanel.add(this.SequenceAnnotationManager.annotator);

        this.Managers.push(this.SequenceAnnotationManager);
    },


    onSequenceManagerChanged: function(pSeqMan){
        this.callParent(arguments);
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

    onMousedown: function(pEvt, pOpts) {
        console.log(pEvt.getX() + " " + pEvt.getY() + " " + Ext.getCmp("AnnotateContainer").el.getScroll().top);
        if(this.SequenceAnnotationManager.sequenceManager) {
            var index = this.SequenceAnnotationManager.bpAtPoint(pEvt.getX(),
                                                                 pEvt.getY());

            this.changeCaretPosition(index);
        }
    },

    onMousemove: function(pEvt, pOpts) {
    },

    onMouseup: function(pEvt, pOpts) {
    },

    changeCaretPosition: function(index) {
        this.SequenceAnnotationManager.adjustCaret(index);
        if(this.SequenceAnnotationManager.sequenceManager) {
            this.application.fireEvent(this.CaretEvent.CARET_POSITION_CHANGED,
                                       index);
        }
    },

    onSequenceChanged: function(kind, obj) {
        Ext.each(this.Managers, function(manager) {
            manager.sequenceChanged();
        });

        console.log(kind);
    },

    onActiveEnzymesChanged: function() {
        this.callParent();

        if(this.SequenceAnnotationManager.sequenceManager && 
           this.SequenceAnnotationManager.showCutSites) {
            this.SequenceAnnotationManager.render();
        }
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

    onShowComplementaryChanged: function(show) {
        this.SequenceAnnotationManager.setShowComplementarySequence(show);
        if(this.SequenceAnnotationManager.sequenceManager) {
            this.SequenceAnnotationManager.render();
        }
    },

    onShowSpacesChanged: function(show) {
        this.SequenceAnnotationManager.setShowSpaceEvery10Bp(show);
        if(this.SequenceAnnotationManager.sequenceManager) {
            this.SequenceAnnotationManager.render();
        }
    },

    onShowSequenceAAChanged: function(show) {
        this.SequenceAnnotationManager.setShowAminoAcids(show);
        if(this.SequenceAnnotationManager.sequenceManager) {
            this.SequenceAnnotationManager.render();
        }
    },

    onShowRevcomAAChanged: function(show) {
        this.SequenceAnnotationManager.setShowAminoAcidsRevCom(show);
        if(this.SequenceAnnotationManager.sequenceManager) {
            this.SequenceAnnotationManager.render();
        }
    },
});
