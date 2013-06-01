/**
 * @class Teselagen.models.digest.SampleLane
 * Class describing a ladder of a gel digest
 * @author Micah Lerner
 */
Ext.define("Teselagen.models.digest.SampleLane", {
    config: {
        BAND_COLOR: "#fff",
        CONNECTOR_COLOR: "#999999",

        fragments: null,
        ladder: null,
        bandYPositions: null,
        bandSizeLabels: null,
        bandSizeLabelYPositions: null,

        actualWidth: 200,
        actualHeight: 400,

        ladderChanged: true
    },

    statics: {
        BP_LADDER_BANDS: ["20000", "10000", "7000", "5000", "4000", "2000", "1500", "1000", "700", "500", "400", "300", "200", "75"],
        KB_LADDER_BANDS: ["3000", "2000", "1500", "1200", "1000", "900", "800", "700", "600", "500", "400", "300", "200", "100"]
    },

    constructor: function(inData){
        this.initConfig(inData);
        this.statics();
        this.setLadder(inData.ladder);
        return this;
    },

    setLadder: function(pLadder){
        if (pLadder.indexOf("1kb") > -1 ){
            this.ladder = this.self.BP_LADDER_BANDS;
        }else {
            this.ladder = this.self.KB_LADDER_BANDS;
        }
    },


    redrawBands: function(){
        var ladderHeight = this.actualHeight * 0.8;
        var ladderMin = this.ladder[this.ladder.length - 1];
        var ladderMax = this.ladder[0];
        var totalLogDifference = Math.log(ladderMax / ladderMin);
        this.bandYPositions = [];
        
        for (var i = 0; i < this.fragments.length; ++i){
            console.log(this.fragments[i].getLength());
            console.log(Number(ladderMin));
            var currentLogDifference = Math.log(this.fragments[i].getLength() / Number(ladderMin));
            var normalizedLogDifference = currentLogDifference / totalLogDifference;
            var scalingFactor = -(0.1 * Math.sin(2*3.14*normalizedLogDifference));
            var bandYPosition = 0.9 * this.actualHeight - (scalingFactor + normalizedLogDifference) * ladderHeight;
            console.log(bandYPosition);
            this.bandYPositions.push(bandYPosition);
        }
    }
});
