/**
 * @class Teselagen.models.digest.Gel
 * Class describing a simulated agarose gel for simulating gel digests
 * @author Doug Hershberger
 */
Ext.define("Teselagen.models.digest.Gel", {
    requires: 
        ["Teselagen.models.digest.Ladder",
         "Teselagen.models.digest.GelLane",
         "Teselagen.models.digest.GelBand"
         ],
    config: {
    	/**
    	 * {String} name of this gel
    	 */
        name: "default",
        /**
         * {String} default color for all bands of this gel (can be overridden by lane or by band)
         */
        BAND_COLOR: '#fff',
        /**
         * {String} default color for all connectors in this gel (can be overridden by lane or by band)
         */
        CONNECTOR_COLOR: '#999999',
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
        actualWidth: 400
    },
	/*
	 * This is the array that stores the lanes in this gel
	 */
    lanes: null,
    getLanes: function(){
        return this.lanes;
    },

    constructor: function(inData){
        this.initConfig(inData);
        this.lanes = [];
        this.ladderDefs = Ext.create("Teselagen.models.digest.Ladder", {ladderName: "1kb"});
    },

    /**
     * Sets the ladder for this Gel by searching for key phrases in the ladderName provided 
     * @param {String} ladderName
     */
    setLadder: function(ladderName){
        if (ladderName.indexOf('1kb') > -1 ){
            this.ladder = ladderDefs.BP_LADDER_BANDS; 
        }else {
            this.ladder = ladderDefs.KB_LADDER_BANDS;
        }
    },
    /**
     * Creates a new lane at the index specified. If index is not provided then inserts it at the end
     * @param {String} newLaneName
     * @param {Number} index 0 based index to insert at
     */
    createLane: function(newLaneName, index){
        var newLane = Ext.create("Teselagen.models.digest.GelLane", {name: newLaneName});
        this.insertLane(newLane, index);
    },
    /**
     * Inserts a lane at the index specified. If index is not provided then inserts it at the end
     * @param {Teselagen.models.digest.GelLane} newlane
     * @param {Number} index 0 based index to insert at
     */
    insertLane: function(newLane, index){
    	newLane.setActualHeight(this.getActualHeight());
        if(typeof index === 'undefined') {
            index = this.getLanes().length;
        }
        this.getLanes().splice(index, 0, newLane);
        //recalculate the width of the lanes based on the number of lanes there are
        var widthUnit = this.actualWidth / this.getLanes().length;
        for (var i = 0; i < this.getLanes().length; i++) {
            this.getLanes()[i].setActualWidth(widthUnit);
            this.getLanes()[i].setXOffset(i * widthUnit);
        }
    },
    /**
     * clears all of the lanes from this gel
     */
    clearLanes: function(){
//        this.setLanes([]);
        this.lanes = [];
    },
    /**
     * Get a lane with the specified name.
     * @param {String} laneName the lane to fetch
     * @return {Teselagen.models.digest.GelLane} the lane named laneName
     */
    getLane: function(laneName){
        var lane = null;
        for (var i = 0; i < this.getLanes().length; i++) {
            if (this.getLanes()[i].name === laneName) {
                lane = this.getLanes()[i];
            }
        }
        return lane;
    },
    /**
     * Finds the minimum fragment length in all lanes on this gel
     * @return {Number}
     */
    calculateMinMax: function(){
        this.max = -Infinity, this.min = +Infinity;
         
        for (var i = 0; i < this.getLanes().length; i++) {
          if (this.getLanes()[i].getMax() > this.max) {
              this.max = this.getLanes()[i].getMax();
          }
          if (this.getLanes()[i].getMin() < this.min) {
              this.min = this.getLanes()[i].getMin();
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
     * Returns an array of sprites that correspond to all of the bands and labels on this gel
     * @return {Ext.draw.Sprite[]}
     */
    draw: function(){
        this.calculateMinMax();
        var ladderHeight = this.actualHeight * 0.8;
        var totalLogDifference = Math.log(this.max / this.min);
        var laneBands = [];
        for (var i = 0; i < this.getLanes().length; ++i){
            //totalLogDifference, this.min are the two things we need to know to calculate the relative positions of all of the bands
            laneBands.push(this.getLanes()[i].draw(totalLogDifference, this.min));
        }
        /*
         * Javascript recipe for joining N arrays
         * [].concat.apply([], arrays);
         * http://stackoverflow.com/questions/5080028/what-is-the-most-efficient-way-to-concatenate-n-arrays-in-javascript
         */
        var bands = [].concat.apply([], laneBands);
        return bands;
    }
});
