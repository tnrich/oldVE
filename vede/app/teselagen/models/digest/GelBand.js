/**
 * This class is the datastructure for bands of a Restriction digest.
 * @author Doug Hershberger
 */

Ext.define("Teselagen.models.digest.GelBand", {

    config: {
        BAND_COLOR: '#fff',
//        BAND_COLOR: '0000',
        CONNECTOR_COLOR: '#999999',
        bandHeight: 2,
        actualWidth: 400,//null
        xOffset: 100,//null
        bandYPosition: null,
        bandSizeLabel: null,
        bandSizeLabelYPosition: null,
        actualHeight: 800,
        hPad: .1,
        name: "default",
        /**
         * A {Text} label to associate with the start usually the restriction enzyme at this end
         */
        start: null,
        /**
         * A {Text} label to associate with the end usually the restriction enzyme at this end
         */
        end: null,
        /**
         * The size of the band in base pairs
         */
        size: 0
    },
    /**
     * You can provide a {Teselagen.bio.sequence.dna.DigestionFragment} to inData as
     * digestionFragment. If you do, then size, start and stop will be calculated from that
     */
    constructor: function(inData){
        this.initConfig(inData);
        if (inData.digestionFragment !== undefined){
            this.size =  inData.digestionFragment.getLength();
            if (inData.digestionFragment.getStartRE() !== null) {
            	this.start =  inData.digestionFragment.getStartRE().getName();
            }
            if (inData.digestionFragment.getEndRE() !== null) {
            	this.end =  inData.digestionFragment.getEndRE().getName();
            }
        }
    },
    
    /**
     * Returns a sprite that corresponds to the band and label for this band
     * @param {Number} totalLogDifference the log difference of the max band divided by the min band for this gel
     * @param {Number} min the minimum value of the minimum band in this gel (provided by the gel)
     * @param {Number} height the height of this lane (provided by the lane)
     * @return {Ext.draw.Sprite}
     * 
     */
    draw: function(totalLogDifference, min, height){
    	var ladderHeight = height * 0.8;
    	var currentLogDifference =  Math.log(this.size / min);
    	var normalizedLogDifference =  currentLogDifference/ totalLogDifference;
    	var scalingFactor = -(.1 * Math.sin(2*3.14*normalizedLogDifference));
    	this.bandYPosition = (0.9 * height - (scalingFactor + normalizedLogDifference) * ladderHeight);
        var gelBand = Ext.create('Ext.draw.Sprite', {
            type: 'rect',
            fill: this.BAND_COLOR,
            height: this.bandHeight,
            width: this.actualWidth * (1 - 2 * this.hPad),
            x: this.xOffset + (this.actualWidth * this.hPad),
            y: this.bandYPosition
        });
    	return gelBand;
    }
    

});
 
