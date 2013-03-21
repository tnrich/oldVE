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
                	xOffset: this.getXOffset()
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
        for (var i = 0; i < this.bands.length; ++i){
//            var bandSize = this.bands[i].size;
//            var currentLogDifference =  Math.log(bandSize / min);
//            var normalizedLogDifference =  currentLogDifference/ totalLogDifference;
//            var scalingFactor = -(.1 * Math.sin(2*3.14*normalizedLogDifference));
//            this.bandSprites.push(0.9 * this.actualHeight - (scalingFactor + normalizedLogDifference) * ladderHeight);
            this.bandSprites.push(this.bands[i].draw(totalLogDifference, min, this.getActualHeight()));
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
            	xOffset: this.getXOffset()
            	}));
        }
    },

    /**
     * Finds the minimum fragment length out of all bands in this lane
     * @return {Number}
     */
    calculateMinMax: function(){
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
