Ext.define("Teselagen.models.sequence.Row", {
    config: {
        rowData: null,
        metrics: {"height": 20, "width": 917},
        sequenceMetrics: null,
        index: null,
    },

    constructor: function(inData){
        this.initConfig(inData);
    },
});
