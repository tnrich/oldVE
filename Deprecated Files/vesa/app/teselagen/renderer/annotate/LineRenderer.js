/**
 *
 * @class Teselagen.renderer.annotate.LineRenderer
 * A class that renders lines for the Annotation Panel
 *
 */

Ext.define("Teselagen.renderer.annotate.LineRenderer", {

    config: {
        sequenceMananger: null,
        svgCanvas: null,
        panel: null,
        horizontalLines: null,

        featureHeight: 10,
        numFeatures: 2,
    },
    constructor: function(inData){
        this.initConfig(inData);
        this.callParent(inData);

        
        this.horizontalLines = [];
    },

    recalculateLines: function(){
        
        
    },
    
});
