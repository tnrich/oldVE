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
        bandYPositions: null,
        bandSizeLabels: null,
        bandSizeLabelYPositions: null,
        name: "default",
        min: null,
        max: null,
        enzymes: null,
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
        
        ladderDefs: null,

        actualWidth: 200,
        actualHeight: 400,

        ladderChanged: true,
        needsRemeasurement: true,
    },

    /**
     * Constructor
     * @param  {String} ladder name of the ladder
     */
    constructor: function(inData){
        this.bands = [];
        this.initConfig(inData);
        this.digestionCalculator = Teselagen.bio.tools.DigestionCalculator;
        this.Ladder = Teselagen.models.digest.Ladder;
        if (inData.ladder !== null){
            for (var i = 0; i < inData.ladder.length; ++i){
                this.bands.push(Ext.create("Teselagen.models.digest.GelBand", {size: inData.ladder[i]}));
            }
        }
        return this;
    },

    /**
     * Calculates Band Y positions
     * @param {Number} totalLogDifference the log difference of the max band divided by the min band for this gel
     * @param {Number} the minimum value of the minimum band in this gel (provided by the gel)
     * 
     */
    draw: function(totalLogDifference, min){
        var ladderHeight = this.actualHeight * 0.8;
        this.bandYPositions = [];
        //If the fragments are the result of a digestion, then they can change
        if (this.sequence !== null) {
            this.bands = this.digestionCalculator.digestSequence(this.sequence, this.enzymes);
        }
        //else this must be a ladder
        for (var i = 0; i < this.bands.length; ++i){
            var bandSize = this.bands[i].size;

            var currentLogDifference =  Math.log(bandSize / min);
            var normalizedLogDifference =  currentLogDifference/ totalLogDifference;
            var scalingFactor = -(.1 * Math.sin(2*3.14*normalizedLogDifference));
            this.bandYPositions.push(0.9 * this.actualHeight - (scalingFactor + normalizedLogDifference) * ladderHeight);
        }
    },

    /**
     * Maps an array of digestion fragments to bands replacing the current bands
     * @param {Teselagen.bio.sequence.dna.DigestionFragment[]} the array of digestion fragments to be mapped
     */
    mapFragmentsToBands: function(fragments){
        this.bands = [];
        for (var i = 0; i < fragments.length; ++i){
            this.bands.push(Ext.create("Teselagen.models.digest.GelBand", {digestionFragment: fragments[i]}));
        }
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
