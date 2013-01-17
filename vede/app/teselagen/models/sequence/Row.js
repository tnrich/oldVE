/**
 * Sequence row
 * @class Teselagen.models.sequence.Row
 */
Ext.define("Teselagen.models.sequence.Row", {
    config: {
        rowData: null,
        metrics: {"x": 0, "y": 0, "width": 0, "height": 0},
        sequenceMetrics: {"x": 0, "y": 0, "width": 0, "height": 0},
        index: null,
    },

    constructor: function(inData){
        this.initConfig(inData);
    },
});
