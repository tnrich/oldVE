/**
 * Sequence row data
 * @class Teselagen.models.sequence.RowData
 */
Ext.define("Teselagen.models.sequence.RowData", {
    config: {
        start: null,
        end: null,
        sequence: null,
        oppositeSequence: null,
        featuresAlignment: null,
        cutSitesAlignment: null,
        orfAlignment: null
    },

    constructor: function(inData){
        this.initConfig(inData);
    },
});
