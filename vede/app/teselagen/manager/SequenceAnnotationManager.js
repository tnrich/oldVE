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
        showFeatures: null,
        showCutSites: null,
        showOrfs: null,
        showComplementarySequence: true,
        bpPerRow: 60,
        sequenceFontSize: 11,
        labelFontSize: 10,
        showSpaceEvery10Bp: true,
        showAminoAcids1: false,
        showAminoAcids2: false,
        showAminoAcids3: false,

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
    statics: {
       DEFAULT_BP_PER_ROW: 60,
    },

    constructor: function(inData){
        this.initConfig(inData);
        console.log("Bar");
        var that = this;
        this.lineRenderer = Ext.create("Teselagen.renderer.annotate.LineRenderer");
        //this.sequenceRenderer = Ext.create("Teselagen.renderer.annotate.TextRenderer");
        this.RowManager = Ext.create("Teselagen.manager.RowManager", {
            sequenceAnnotator: that,
        });
        console.log("syntax error");
        this.annotator = Ext.create("Vede.view.annotate.Annotator", {
            sequenceAnnotator: that,
        });
        console.log("syntax error");
    },

    setSequenceManager: function(pSeqMan){
        this.sequenceManager = pSeqMan;
    },

    sequenceChanged: function(){
        this.RowManager.setSequenceAnnotator(this);
        this.RowManager.update();

        this.aaManager.setSequenceManager(this.sequenceManager);
        this.features = this.sequenceManager.getFeatures();

        console.log(this.annotator.getSequenceAnnotator().getSequenceManager().getFeatures());

        this.annotator.setSequenceAnnotator(this);
        this.annotator.render();
        console.log("Foo");
    }

});
