/**
 * This class is the datastructure for bands of a Restriction digest.
 * @author Doug Hershberger
 */

Ext.define("Teselagen.models.digest.GelBand", {

    config: {
        /**
         * {String}  color for this band
         */
        BAND_COLOR: "#fff",
        /**
         * {String}  color for the connectors for this band
         */
        CONNECTOR_COLOR: "#999999",
        /**
         * size of the font for labels (in pixels)
         */
        labelSize: 16,
        /**
         * The hight (thickness) of this band in pixels
         */
        bandHeight: 4,
        /**
         * Width of the band
         */
        actualWidth: 400,//null
        /**
         * The horizontal (X) offset of this lane relative to the whoel gel
         */
        xOffset: 100,//null
        /**
         * Vertical (Y) position of this band relative to the whole gel
         */
        bandYPosition: null,
        /**
         * Text of the size label for this band
         */
        bandSizeLabel: null,
        /**
         * Vertical (Y) position of this band"s label relative to the whole gel
         */
        bandSizeLabelYPosition: null,
        /**
         * height of the gel
         */
        actualHeight: 800,
        /**
         * Horizontal padding for bands and labels (as a fraction of 1)
         */
        hPad: 0.1,
        /**
         * Name of this band
         */
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
         * The {Number} size of the band in base pairs
         */
        size: 0,
        /**
         * A {Teselagen.bio.sequence.dna.DigestionFragment} that represents this particular band
         */
        digestionFragment: null
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
        var scalingFactor = -(0.1 * Math.sin(2*3.14*normalizedLogDifference));
        this.bandYPosition = (0.9 * height - (scalingFactor + normalizedLogDifference) * ladderHeight);
        /*
         * Alternate way to calculate
         *
         * I looked on the web for a formula to calculate band size in agarose gels. The only thing
         * I found was that the distance traveled is inversely proportional to the log of size:
         *
         *  d(this) = 1/Math.log(this.size);
         *
         *  If we assume that the minimum sized fragment runs the full height of the lane then
         *
         *  d(min) = height = 1/Math.log(min);
         *
         *  to solve for d(this) using ratios
         *
         *  d(this)       1/Math.log(this.size)
         *  -------   =   ---------------------
         *  height        1/Math.log(min)
         *
         *  simplifies to
         *
         *  d(this)       Math.log(min)
         *  -------   =   ---------------------
         *  height        Math.log(this.size)
         *
         *  simplifies to
         *
         *                        Math.log(min)
         *  d(this)  =  height  ---------------------
         *                      Math.log(this.size)
         *
         *  But ultimately this doesn"t look as nice as the other way, so I"m keeping that even though I don"t understand it.
         *
         */
        var altY = ladderHeight * Math.log(min) / Math.log(this.size);
        var maxY = ladderHeight * Math.log(min) / Math.log(20000);
        var scaled = (altY - maxY) * ladderHeight / (ladderHeight - maxY);
        scaled = scaled + height * 0.1;
        if (scaled >= height - 4) {
            scaled = height - 4;
        }
        //this.bandYPosition = scaled;
        /*
         *
         */
        var halfWidth = this.actualWidth / 2;
//        var type = "ladder";
        var gelBand = Ext.create("Ext.draw.Sprite", {
            type: "rect",
            fill: this.BAND_COLOR,
            height: this.bandHeight,
            width: halfWidth * (1 - 2 * this.hPad),
            x: this.xOffset + halfWidth + (halfWidth * this.hPad),
            y: this.bandYPosition
        });
        if (this.isDigest()){
            gelBand.bandType = "digest";
            gelBand.size = this.getSize();
            gelBand.start = this.digestionFragment.getStart();
            gelBand.end = this.digestionFragment.getEnd();
            gelBand.startRE = this.digestionFragment.getStartRE().getName();
            gelBand.endRE = this.digestionFragment.getEndRE().getName();
        }
        return gelBand;
    },
    /**
     * Returns a sprite that corresponds to the label for this band
     * @return {Ext.draw.Sprite}
     *
     */
    drawLabels: function(){
        var halfWidth = this.actualWidth / 2;
        var sizeString = this.size.toString();
        var txtOffset = halfWidth * (1 - this.hPad) - sizeString.length * this.labelSize / 2;
        var gelLabel = Ext.create("Ext.draw.Sprite", {
            type: "text",
            text: sizeString,
            fill: this.BAND_COLOR,
            font: this.labelSize + "px 'monospace'",
            style: {
                textAlign: "right",
                display: "block",
                width: "50px"
            },
            x: txtOffset + this.xOffset + (halfWidth * this.hPad),
            y: this.bandYPosition
        });
        return gelLabel;
    },
    /**
     * Returns true if this band is the product of a digest, otherwise false
     * @return {Boolean}
     *
     */
    isDigest: function(){
        return (this.digestionFragment !== null);
    }
});
 
