Ext.define("Teselagen.manager.SequenceAnnotationManager", {
    requires: ["Teselagen.manager.RowManager",
               "Teselagen.renderer.annotate.LineRenderer",
               "Vede.view.annotate.Annotator",
               "Vede.view.annotate.Caret"],

    config: {
        sequenceManager: null,
        orfManager: null,
        aaManager: null,
        restrictionEnzymeManager: null,
        highlights: null,

        features: null,

        contentHolder: null,
        annotator: null,

        readOnly: null,
        showFeatures: true,
        showCutSites: false,
        showOrfs: false,
        showComplementarySequence: true,
        showSpaceEvery10Bp: true,
        showAminoAcids: false,
        showAminoAcidsRevCom: false,
        aminoAcidFrames: [],
        aminoAcidRevComFrames: [],
        orfFrames: [],

        bpPerRow: 60,
        sequenceFontSize: 11,
        labelFontSize: 10,

        sequenceManagerChanged: false,
        orfManagerChanged: false,
        aaManagerChanged: false,
        restrictionEnzymeManagerChanged: false,
        bpPerRowChanged: false,
        sequenceFontSizeChanged: false,
        labelFontSizeChanged: false,
        showFeaturesChanged: false,
        showCutSitesChanged: false,
        showOrfsChanged: false,
        showComplementarySequenceChanged: false,
        showSpaceEvery10BpChanged: false,
        showAminoAcidsChanged: false,
        showAminoAcidsRevComChanged: false,
        editingMode: false,
        floatingWidthChanged: false,

        lineRenderer: null,
        sequenceRenderer: null,
        complementRenderer: null,
        renderers: null,

        RowManager: null
    },
    renderers: [],
    caret: null,
    statics: {
       DEFAULT_BP_PER_ROW: 60
    },

    constructor: function(inData){
        this.initConfig(inData);
        var that = this;
        this.lineRenderer = Ext.create("Teselagen.renderer.annotate.LineRenderer");
        this.RowManager = Ext.create("Teselagen.manager.RowManager", {
            sequenceAnnotator: that
        });

        this.annotator = Ext.create("Vede.view.annotate.Annotator", {
            sequenceAnnotator: that
        });

        this.caret = Ext.create("Vede.view.annotate.Caret", {
            sequenceAnnotator: that.annotator
        });
    },

    tabChanged: function() {
        if(this.caret.caretSVG) {
            this.caret.caretSVG.remove();
            this.caret.caretSVG = null;
        }
    },

    setSequenceManager: function(pSeqMan){
        this.sequenceManager = pSeqMan;

        this.RowManager.setSequenceAnnotator(this);
        this.RowManager.update();

        this.aaManager.setSequenceManager(this.sequenceManager);
        this.features = this.sequenceManager.getFeatures();

        this.annotator.setSequenceAnnotator(this);
        this.annotator.render();
    },

    render: function() {
        this.RowManager.update();
        this.annotator.render();

        this.caret.setPosition(this.caret.getPosition());
    },

    sequenceChanged: function(){
        this.RowManager.setSequenceAnnotator(this);
        this.RowManager.update();

        this.aaManager.setSequenceManager(this.sequenceManager);
        this.features = this.sequenceManager.getFeatures();

        this.annotator.setSequenceAnnotator(this);
        this.annotator.render();
    },

    adjustCaret: function(index) {
        this.caret.setPosition(index);
    },

    bpAtPoint: function(x, y) {
        var numberOfRows = this.RowManager.rows.length;
        var bpIndex = -1;

        for(var i = 0; i < numberOfRows; i++) {
            var row = this.RowManager.rows[i];

            if((y >= row.metrics.y) && (y <= row.metrics.y + row.metrics.height)) {
                bpIndex = i * this.bpPerRow;

                if(x < row.sequenceMetrics.x) {
                } else if(x > row.sequenceMetrics.x + row.sequenceMetrics.width) {
                    bpIndex += row.rowData.sequence.length;
                } else {
                    var numberOfCharactersFromBeginning = Math.floor((x - 
                                        row.sequenceMetrics.x + 15 / 2) / 
                                        this.annotator.self.CHAR_WIDTH);

                    var numberOfSpaces = 0;

                    if(this.showSpaceEvery10Bp) {
                        numberOfSpaces = Math.floor(numberOfCharactersFromBeginning / 11);
                    }

                    var numberOfValidCharacters = numberOfCharactersFromBeginning - 
                                                  numberOfSpaces;

                    bpIndex += numberOfValidCharacters;
                }

                break;
            }
        }
        return bpIndex;
    },

    applySequenceManager: function(pSeqMan) {
        if(this.SequenceManager !== pSeqMan) {
            this.sequenceManagerChanged = true;
        }
        return pSeqMan;
    },

    applyBpPerRow: function(pBpPerRow) {
        if(this.bpPerRow !== pBpPerRow) {
            this.bpPerRowChanged = true;
        }
        return pBpPerRow;
    },

    applyShowFeatures: function(pShow) {
        if(this.showFeatures !== pShow) {
            this.showFeaturesChanged = true;
        }
        return pShow;
    },

    applyShowCutSites: function(pShow) {
        if(this.showCutSites !== pShow) {
            this.showCutSitesChanged = true;
        }
        return pShow;
    },

    applyShowOrfs: function(pShow) {
        if(this.showOrfs !== pShow) {
            this.showOrfsChanged = true;
        }
        return pShow;
    },

    applyShowComplementarySequence: function(pShow) {
        if(this.showComplementarySequence !== pShow) {
            this.showComplementarySequenceChanged = true;

            if(this.caret) {
                if(pShow) {
                    this.caret.setHeight(this.caret.self.DOUBLE_HEIGHT);
                    this.caret.setPosition(this.caret.getPosition());
                } else {
                    this.caret.setHeight(this.caret.self.SINGLE_HEIGHT);
                    this.caret.setPosition(this.caret.getPosition());
                }
            }
        }
        return pShow;
    },

    applyShowSpaceEvery10Bp: function(pShow) {
        if(this.showSpaceEvery10Bp !== pShow) {
            this.showSpaceEvery10BpChanged = true;
        }
        return pShow;
    }
});
