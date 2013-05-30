/**
 * @class Teselagen.models.digest.LadderLane
 * Class describing a ladder of a gel digest
 * @author Micah Lerner
 */
Ext.define("Teselagen.models.digest.LadderLane", {
    config: {
        BAND_COLOR: "#fff",
        CONNECTOR_COLOR: "#999999",
        ladder: null,
        bandYPositions: null,
        bandSizeLabels: null,
        bandSizeLabelYPositions: null,

        actualWidth: 200,
        actualHeight: 400,

        ladderChanged: true,
        needsRemeasurement: true
    },

    statics: {
        BP_LADDER_BANDS: ["20000", "10000", "7000", "5000", "4000", "2000", "1500", "1000", "700", "500", "400", "300", "200", "75"],
        KB_LADDER_BANDS: ["3000", "2000", "1500", "1200", "1000", "900", "800", "700", "600", "500", "400", "300", "200", "100"]
    },

    /**
     * Constructor
     * @param  {String} ladder name of the ladder
     */
    constructor: function(inData){
        this.initConfig(inData);
        this.statics();
        if (inData.ladder.indexOf("1kb") > -1 ){
            this.ladder = this.self.BP_LADDER_BANDS;
        }else {
            this.ladder = this.self.KB_LADDER_BANDS;
        }
        return this;
    },
    
    /**
     * Updates the ladder being used to calculate band placement
     * @param  {String} pLadder new ladder
     */
    updateLadderLane: function(pLadder){
        if (pLadder.indexOf("1kb") > -1 ){
            this.ladder = this.self.BP_LADDER_BANDS;
        }else {
            this.ladder = this.self.KB_LADDER_BANDS;
        }
       this.redrawBands();
        this.redrawBandSizeLabels();
        //redrawConnectors();*/
    },

    /**
     * Recalculates Band Y positions
     */
    redrawBands: function(){
        var ladderHeight = this.actualHeight * 0.8;
        var ladderMin = this.ladder[this.ladder.length - 1];
        var ladderMax = this.ladder[0];
        var totalLogDifference = Math.log(ladderMax / ladderMin);
        this.bandYPositions = [];

        for (var i = 0; i < this.ladder.length; ++i){
//            var bandSize = this.ladder[i];

            var currentLogDifference =  Math.log(this.ladder[i] / ladderMin);
            var normalizedLogDifference =  currentLogDifference/ totalLogDifference;
            var scalingFactor = -(0.1 * Math.sin(2*3.14*normalizedLogDifference));
            this.bandYPositions.push(0.9 * this.actualHeight - (scalingFactor + normalizedLogDifference) * ladderHeight);
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
//            var labelText = this.ladder[i];
//            var labelWidth = 40;
            //var defaultLabelYPosition = bandYPositions[i] - 10;
            if(i === 0){
                this.bandSizeLabelYPositions.push(50);
            } else {
                this.bandSizeLabelYPositions.push(100);
            }
        
        }
        console.log("redrew bands");
    }
    

    
});
