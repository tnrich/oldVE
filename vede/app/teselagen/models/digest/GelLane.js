/**
 * @class Teselagen.models.digest.GelLane
 * Class describing a lane of a gel
 * @author Doug Hershberger
 */
Ext.require("Teselagen.bio.tools.DigestionCalculator");

Ext.define("Teselagen.models.digest.GelLane", {
    config: {
        BAND_COLOR: '#fff',
        CONNECTOR_COLOR: '#999999',
        labelSize: 16,
        ladder: null,
        bandSprites: null,
        bandSizeLabels: null,
        bandSizeLabelYPositions: null,
        name: "default",
        min: null,
        max: null,
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

        xOffset: 100,
        actualWidth: 400,
        actualHeight: 600,

        ladderChanged: true,
        needsRemeasurement: true,
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
        this.Ladder = Teselagen.models.digest.Ladder;
        if (inData.ladder !== undefined){
            for (var i = 0; i < inData.ladder.length; ++i){
                this.bands.push(Ext.create("Teselagen.models.digest.GelBand", {
                	size: inData.ladder[i], 
                	actualWidth: this.getActualWidth(),
                	xOffset: this.getXOffset(),
                    labelSize: this.getLabelSize()
                	}));
            }
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
        var ladderHeight = this.actualHeight * 0.8;
        this.bandSprites = [];
        this.refreshDigestion();
        for (var i = this.bands.length - 1; i >= 0; --i){
            var bandSprite = this.bands[i].draw(totalLogDifference, min, this.getActualHeight());
            this.bandSprites.push(bandSprite);
            var label = this.bands[i].drawLabels();
            //check the previous label to make sure we don't collide
            if (this.bandSprites.length > 1){
                var previousLabel = this.bandSprites[this.bandSprites.length-2];
                var overlap = previousLabel.y - label.y - this.getLabelSize();
                if (overlap < 0 && previousLabel.shifted != true) {
                    label.setAttributes({
                        translate: {
                            x: this.getLabelSize()/2 * -6,
                            y: 0
                           }
                         }, true);
                    label.shifted = true;
                    var connector = Ext.create('Ext.draw.Sprite', {
                        type: 'rect',
                        fill: this.CONNECTOR_COLOR,
                        height: 1,
                        width: bandSprite.x - label.x + this.getLabelSize()/2 * (6 - label.text.length),
                        x: label.x - this.getLabelSize()/2 * (6 - label.text.length),
                        y: label.y
                    });
                    
//                    var connector = Ext.create('Ext.draw.Sprite', {
//                        type: "path",
//                        path: "M-118.774 81.262C-118.774 81.262 -119.323 83.078 -120.092 82.779C-120.86 82.481 -119.977 31.675 -140.043 26.801C-140.043 26.801 -120.82 25.937 -118.774 81.262z",
//                        "stroke-width": "0.172",
//                        stroke: "#000",
//                        fill: "#fff"
//                        type: 'path',
//                        fill: this.BAND_COLOR,
//                        //path: "M-" + label.x + " " + label.y + "L-" + (label.x + 96) + " " + label.y + "z",
//                        path: "M-66.6 26C-66.6 26 -75 22 -78.2 18.4C-81.4 14.8 -80.948 19.966 " +
//                        "-85.8 19.6C-91.647 19.159 -90.6 3.2 -90.6 3.2L-94.6 10.8C-94.6 " +
//                        "10.8 -95.8 25.2 -87.8 22.8C-83.893 21.628 -82.6 23.2 -84.2 " +
//                        "24C-85.8 24.8 -78.6 25.2 -81.4 26.8C-84.2 28.4 -69.8 23.2 -72.2 " +
//                        "33.6L-66.6 26z",
//                        stroke: this.BAND_COLOR,     
//                        'stroke-width': 1
//                    });
                    this.bandSprites.push(connector);
                }
            }
            this.bandSprites.push(label);
        }
        return this.bandSprites;
    },
    /**
     * recuts this.sequence based on this.enzymes
     */
    refreshDigestion: function(){
        //If the fragments are the result of a digestion, then they can change
        if (this.sequence !== null) {
        	this.mapFragmentsToBands(this.digestionCalculator.digestSequence(this.sequence, this.enzymes));
        }
        //else this must be a ladder
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
    },

    /**
     *  Recalculates Band Size labels
     *  @deprecated
     */
    redrawBandSizeLabels: function(){
        this.bandSizeLabelYPositions = [];
        console.log("about to redraw bands");
        for (var i = 0; i < this.ladder.length; ++i){
            console.log("you are drawing");
            var labelText = this.ladder[i];
            var labelWidth = 40;
            //var defaultLabelYPosition = bandYPositions[i] - 10;
            if(i === 0){
                this.bandSizeLabelYPositions.push(50);
            } else {
                this.bandSizeLabelYPositions.push(100);
            }
        
        }
        console.log("redrew bands");
    },
    

    
});
