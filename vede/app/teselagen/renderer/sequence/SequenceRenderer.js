Ext.create("Teselagen.renderer.sequence.SequenceRenderer", {

    requires: ["Teselagen.bio.enzymes.RestrictionCutSite",
               "Teselagen.bio.orf.ORF",
               "Teselagen.bio.sequence.common.Annotation"],
    config: {
        contentHolder: null,

        rows: null,
        featureToRowMap: null,
        orfToRowMap: null,
        cutSiteToRowMap: null,
        showORfs: false,
        numRows: 0,
    },

    constructor: function(inData){
        this.initConfig(inData);
    },

    update: function(){
        this.rows = [];

        this.numRows = int (Math.ceil(((contentHolder.sequenceProvider.sequence.length + 1) / 50)));
    },
});
