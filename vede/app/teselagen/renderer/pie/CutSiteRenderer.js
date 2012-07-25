Ext.define("Teselagen.renderer.CutSiteRenderer", {
    extend: "Teselagen.renderer.AnnotationRenderer",
    
    statics: {
        FRAME_COLOR: 0x606060,
        CURVY_LINE_COLOR: 0xFF0000
    },

    config: {
        cutSites: [],
        middlePoint: 0
    },

    constructor: function(inData) {
        this.callParent(arguments);

        this.initConfig(inData);
    },

    render: function() {
        Ext.each(this.getCutSites(), function(site) {
            var angle = site.getStart() * 2 * Math.PI / 
                        this.sequenceManager.getSequence().seqString().length;

            
        });
    },
});
