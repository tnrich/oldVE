/**
 * @class Teselagen.models.digest.GelLane
 * Class describing a lane of a gel
 * @author Doug Hershberger
 */
Ext.require("Teselagen.bio.tools.DigestionCalculator");

Ext.define("Teselagen.models.digest.GelLane", {
    config: {
        /**
         * {String} name of this gel
         */
        name: "default",
        /**
         * {String} default color for all bands of this gel (can be overridden by lane or by band)
         */
        BAND_COLOR: "#fff",
        /**
         * {String} default color for all connectors in this gel (can be overridden by lane or by band)
         */
        CONNECTOR_COLOR: "#999999",
        /**
         * The ladder associated with this gel
         */
        ladder: null,
        /**
         * Convenience object for accesssing the static Teselagen.models.gigest.Ladder object
         */
        ladderDefs: null,
        /**
         * Length of the shortest band in this gel
         */
        min: null,
        /**
         * Length of the longest band in this gel
         */
        max: null,
        /**
         * Height of the gel
         */
        actualHeight: 400,
        /**
         * Width of the gel
         */
        actualWidth: 400,
        /**
         * size of the font for labels (in pixels)
         */
        labelSize: 16,
        /**
         * holds the sprites for all the bands
         */
        bandSprites: null,
        /**
         * holds the sprites for all the band size labels
         */
        bandSizeLabels: null,
        /**
         * holds the vertical (Y) positions for all the band size labels
         */
        bandSizeLabelYPositions: null,
        /**
         * An {Teselagen.bio.enzymes.RestrictionEnzyme[]} of the restriction enzymes to use to cut the DNA in sequence
         */
        enzymes: null,
        /**
         * The {Teselagen.bio.sequence.dna.DNASequence} DNA sequence to digest.
         */
        sequence: null,
        //just here so that we can conveniently call digestionCalculator instead of using its full name
        digestionCalculator: null,
        //Here for convenience to allow us to refer to Teselagen.models.digest.Ladder using the shortcut "Ladder"
        Ladder: null,
        /**
         * A {Teselagen.models.digest.GelBand[]} array of bands contained in this lane
         *
         */
        bands: null,
        /**
         * A {String} the type of lane this is
         *
         */
        laneType: "ladder",
        /**
         * Horizontal padding for bands and labels (as a fraction of 1)
         */
        hPad: 0.1,
        /**
         * The horizontal (X) offset of this lane relative to the whoel gel
         */
        xOffset: 100
    },

    /**
     * Makes a new GelLane with either a ladder or a set of restriction fragments as the bands
     * NOTE that right now, the sum of all of the fragments is longer than the original sequence
     * because the recognition sites are counted twice. I'm not sure this is right for any enzymes
     * and pretty sure that it is wrong for TypeIIs enzymes for example.
     * @param  {Object} InData
     */
    constructor: function(inData){
        this.bands = [];
        this.initConfig(inData);
        this.digestionCalculator = Teselagen.bio.tools.DigestionCalculator;
        this.Ladder = Ext.create("Teselagen.models.digest.Ladder");
        if (inData.ladder !== undefined){
            for (var i = 0; i < inData.ladder.length; ++i){
                this.bands.push(Ext.create("Teselagen.models.digest.GelBand", {
                    size: inData.ladder[i],
                    actualWidth: this.getActualWidth(),
                    xOffset: this.getXOffset(),
                    labelSize: this.getLabelSize()
                    }));
            }
        } else {
            this.laneType = "digest";
        }
    },
    /**
     * Sets the actualWidth of this lane and all of it's bands
     * @param {Number} newValue the new value
     */
    setActualWidth: function(newValue){
        for (var i = 0; i < this.bands.length; ++i){
            this.bands[i].setActualWidth(newValue);
        }
        this.actualWidth = newValue;
    },
    /**
     * Sets the xOffset of this lane and all of it's bands
     * @param {Number} newValue the new value
     */
    setXOffset: function(newValue){
        console.log("setXOffset", newValue);
        for (var i = 0; i < this.bands.length; ++i){
            this.bands[i].setXOffset(newValue);
        }
        this.xOffset = newValue;
    },
    /**
     * Returns an array of sprites that correspond to the bands and labels for this lane
     * @param {Number} totalLogDifference the log difference of the max band divided by the min band for this gel
     * @param {Number} the minimum value of the minimum band in this gel (provided by the gel)
     * @return {Ext.draw.Sprite[]}
     */
    draw: function(totalLogDifference, min){
//        var ladderHeight = this.actualHeight * 0.8;
        this.bandSprites = [];
        this.refreshDigestion();
        for (var i = 0; i < this.bands.length; ++i){
            var bandSprite = this.bands[i].draw(totalLogDifference, min, this.getActualHeight());
            this.bandSprites.push(bandSprite);
            if (this.laneType === "ladder"){
                var label = this.bands[i].drawLabels();
                //reset label.shifted
                label.shifted = false;
                //check the previous label to make sure we don't collide
                if (this.bandSprites.length > 1){
                    var previousLabel = this.bandSprites[this.bandSprites.length-2];
                    var overlap = previousLabel.y - label.y - this.getLabelSize();
                    if (overlap < 0 && previousLabel.shifted !== true) {
                        label.setAttributes({
                            translate: {
                                x: this.getLabelSize()/2 * -6,
                                y: 0
                               }
                             }, true);
                        label.shifted = true;
                        var connector = Ext.create("Ext.draw.Sprite", {
                            type: "rect",
                            fill: this.CONNECTOR_COLOR,
                            height: 1,
                            width: bandSprite.x - label.x + this.getLabelSize()/2 * (6 - label.text.length),
                            x: label.x - this.getLabelSize()/2 * (6 - label.text.length),
                            y: label.y
                        });
                        this.bandSprites.push(connector);
                    }
                }
                this.bandSprites.push(label);
            }
        }
        if (this.laneType === "digest"){
            var laneLabelText;
            if (this.bands.length > 0){
                laneLabelText = this.bands.length + " fragment";
                if (this.bands.length > 1){
                    laneLabelText = laneLabelText + "s";
                }
            } else {
                if (this.sequence === null){
                    laneLabelText = "No Sequence";
                } else {
                    laneLabelText = "No Digestion";
                }
            }
            var halfWidth = this.actualWidth / 2;
            var txtOffset = halfWidth;
//            var txtOffset = 0;
            var laneLabel = Ext.create("Ext.draw.Sprite", {
                type: "text",
                text: laneLabelText,
                fill: this.BAND_COLOR,
                font: this.labelSize + "px 'monospace'",
                x: txtOffset + this.xOffset + (halfWidth * this.hPad),
                y: 10
            });
            console.log("txtOffset", txtOffset, this.xOffset, halfWidth*this.hPad);
            this.bandSprites.push(laneLabel);
        }
        return this.bandSprites;
    },
    /**
     * Returns a sprite that corresponds to the label for this lane
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
     * recuts this.sequence based on this.enzymes
     */
    refreshDigestion: function(){
        //If the fragments are the result of a digestion, then they can change
        if (this.sequence !== null && this.enzymes !== null && this.enzymes.length > 0) {
            this.mapFragmentsToBands(this.digestionCalculator.digestSequence(this.sequence, this.enzymes));
        }
        //else this must be a ladder
        //sort the bands in reverse size order
        this.bands.sort(function(x, y){ return x.size - y.size; });
    },
    
    /**
     * Maps an array of digestion fragments to bands replacing the current bands
     * @param {Teselagen.bio.sequence.dna.DigestionFragment[]} the array of digestion fragments to be mapped
     */
    mapFragmentsToBands: function(fragments){
        this.bands = [];
        for (var i = 0; i < fragments.length; ++i){
            this.bands.push(Ext.create("Teselagen.models.digest.GelBand", {
                digestionFragment: fragments[i],
                actualWidth: this.getActualWidth(),
                xOffset: this.getXOffset(),
                labelSize: this.getLabelSize()
                }));
        }
    },

    /**
     * Finds the minimum fragment length out of all bands in this lane
     * @return {Number}
     */
    calculateMinMax: function(){
        this.refreshDigestion();
        this.max = -Infinity, this.min = +Infinity;
         
        for (var i = 0; i < this.getBands().length; i++) {
          if (this.getBands()[i].size > this.max) {
              this.max = this.getBands()[i].size;
          }
          if (this.getBands()[i].size < this.min) {
              this.min = this.getBands()[i].size;
          }
        }
    },
    /**
     * Returns the minimum fragment length in all lanes on this gel
     * @return {Number}
     */
    getMin: function(){
        this.calculateMinMax();
        return this.min;
    },
    /**
     * Returns the maximum fragment length in all lanes on this gel
     * @return {Number}
     */
    getMax: function(){
        this.calculateMinMax();
        return this.max;
    }
    

    
});
