Ext.define("Teselagen.models.sequence.Row", {
    config: {
        rowData: null,
        metrics: {"x": 20, "y": 917, "width": 0, "height": 0},
        sequenceMetrics: {"x": 20, "y": 917, "width": 0, "height": 0},
        index: null,
    },

    constructor: function(inData){
        this.initConfig(inData);
    },
});
