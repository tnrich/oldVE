Ext.define("Teselagen.models.sequence.Row", {
    config: {
        rowData: null,
        metrics: null,
        sequenceMetrics: null,
        index: null,
    },

    constructor: function(inData){
        this.initConfig(inData);
    },
});
