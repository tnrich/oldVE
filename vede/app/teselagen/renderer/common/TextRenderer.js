/**
 * A Generic class that stores data about a text sequence you want to render
 * @class Teselagen.renderer.common.TextRenderer
 */
Ext.define("Teselagen.renderer.common.TextRenderer", {

    config: {
        textWidth: -1,
        textHeight: -1,
        widthGap: 0,
        heightGap: 0,
        textMap: 0,
        textField: "",
        fillColor: "black",
        fontFace: "Verdana",
        fontSize: 20,
        svgGroup: null
    },
    constructor: function(inData){
        this.initConfig(inData);
    },

    renderText: function(pText, pWidthGap, pHeightHap){}

    
});
