Ext.define("Teselagen.renderer.common.TextRenderer", {

    config: {
        textWidth: -1,
        textHeight: -1,
        widthGap: 0,
        heightGap: 0,
    },
    constructor: function(inData){
        this.initConfig(inData);
    },

    textToSVG: function(){},
});