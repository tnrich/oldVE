Ext.define("Teselagen.manager.SequenceAnnotationManager", {

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
        showComplementarySequence: false,
        showSpaceEvery10Bp: false,
        showAminoAcids1: false,
        showAminoAcidsRevCom: false,
        showAminoAcids2: false,
        showAminoAcids3: false,

        bpPerRow: 60,
        sequenceFontSize: 11,
        labelFontSize: 10,

        sequenceProviderChanged: false,
        orfMapperChanged: false,
        aaMapperChanged: false,
        restrictionEnzymeMapperChanged: false,
        highlightsChanged: false,
        needsMeasurement: false,
        bpPerRowChanged: false,
        showFeaturesChanged: false,
        showCutSitesChanged: false,
        showComplementaryChanged: false,
        sequenceFontSizeChanged: false,
        labelFontSizeChanged: false,
       showSpaceEvery10BpChanged: false,
        showAminoAcids1Changed: false,
        showAminoAcids2Changed: false,
        showAminoAcids3Changed: false,
        showORFsChanged: false,
        editingMode: false,
        floatingWidthChanged: false,

        lineRenderer: null,
        sequenceRenderer: null,
        complementRenderer: null,
        renderers: null,

        RowManager: null,
    },
    renderers: [],
    caret: null,
    statics: {
       DEFAULT_BP_PER_ROW: 60,
    },

    constructor: function(inData){
        this.initConfig(inData);
        var that = this;
        this.lineRenderer = Ext.create("Teselagen.renderer.annotate.LineRenderer");
        //this.sequenceRenderer = Ext.create("Teselagen.renderer.annotate.TextRenderer");
        this.RowManager = Ext.create("Teselagen.manager.RowManager", {
            sequenceAnnotator: that,
        });
        this.annotator = Ext.create("Vede.view.annotate.Annotator", {
            sequenceAnnotator: that,
            items: [
                Ext.create("Ext.draw.Sprite", {
                    type: "path",
                    path: ""
                })
            ]
        });
        this.caret = Ext.create("Vede.view.annotate.Caret", {
            sequenceAnnotator: that.annotator
        });
    },

    setSequenceManager: function(pSeqMan){
        this.sequenceManager = pSeqMan;

        this.RowManager.setSequenceAnnotator(this);
        this.RowManager.update();

        this.aaManager.setSequenceManager(this.sequenceManager);
        this.features = this.sequenceManager.getFeatures();

        this.annotator.setSequenceAnnotator(this);
        this.annotator.render();

        this.caret.render();
    },

    render:function() {
        this.RowManager.update();
        this.annotator.render();
    },

    sequenceChanged: function(){
        this.RowManager.setSequenceAnnotator(this);

        this.aaManager.setSequenceManager(this.sequenceManager);
        this.features = this.sequenceManager.getFeatures();

        console.log(this.annotator.getSequenceAnnotator().getSequenceManager().getFeatures());

        this.annotator.setSequenceAnnotator(this);
        this.annotator.render();
    },

    adjustCaret: function(index) {
        this.caret.setPosition(index);
        this.caret.render();
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
                    var numberOfCharactersFromBeginning = Math.floor((x - row.sequenceMetrics.x + 15 / 2) / 16);
                    
                    var numberOfSpaces = 0;
                    
                    if(this.showSpaceEvery10Bp) {
                        numberOfSpaces = Math.round(numberOfCharactersFromBeginning / 11);
                    }
                    
                    var numberOfValidCharacters = numberOfCharactersFromBeginning - numberOfSpaces;
                    
                    bpIndex += numberOfValidCharacters;
                }
                
                break;
            }
        }
        return bpIndex;
    }
});
