/**
 * @class Teselagen.models.digest.LadderLane
 * Class describing a ladder of a gel digest
 * @author Micah Lerner
 */
Ext.define("Teselagen.models.digest.LadderLane", {
	extend: "Ext.data.Model",
    config: {
        BAND_COLOR:  '#fff',
        CONNECTOR_COLOR:  '#999999',
        ladder: null,
        bandYPositions: null,
        bandSizeLabels: null,
        bandSizeLabelYPositions: null,  
        
        actualWidth: null,
        actualHeight: null,

        ladderChanged: true,
        needsRemeasurement: true,
    },

    statics: {
        100BP_LADDER_BANDS:['20000', 
                            '10000',
                            '7000',
                            '5000',
                            '4000',
                            '2000',
                            '1500',
                            '1000',
                            '700',
                            '500'
                            '400',
                            '300',
                            '200',
                            '75'],
        1KB_LADDER_BANDS: ['3000',
                           '2000', 
                           '1500', 
                           '1200', 
                           '1000', 
                           '900', 
                           '800', 
                           '700', 
                           '600', 
                           '500', 
                           '400', 
                           '300', 
                           '200', 
                           '100'],
    },

    constructor: function(inData){
        if (inData.ladder === '100BP_LADDER_BANDS'){
            this.ladder = this.self.100BP_LADDER_BANDS; 
        }else {
            
    },
    
    setLadder: function(pLadder){
        if(ladder != pLadder){
            ladder = pLadder;
            ladderChanged = true;
            needsRemeasurement = true;
        }
    },

    updateLadderLane: function(){
        redrawBands();
        redrawBandSizeLabels();
        redrawConnectors();
    },

    redrawBands: function(){
        var ladderMin = 
    },
    redrawBandSizeLabels: function(){},
    removeBandSizeLabels: function(){},
    createBandSizeLabels: function(){},
    redrawConnectors: function(){},
    

    
});
