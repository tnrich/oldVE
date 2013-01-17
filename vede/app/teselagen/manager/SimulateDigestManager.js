/**
 * Simulate digestion manager
 * @class Teselagen.manager.SimulateDigestManager
 */
Ext.create("Teselagen.manager.SimulateDigestManager", {
    config: {
        digestPanel: null,
        background: null,
        sampleLane: null,
        ladderLane: null,
        
        backgroundSpriteGroup: null,
        sampleSpriteGroup: null,
        laddderSpriteGroup: null,

    },

    constructor: function(inData){
        this.initConfig(inData);
        this.drawBG();
    },

    drawBG: function(){
        this.backgroundSpriteGroup.add(this.background);
        this.showSprites(this.backgroundSpriteGroup);
    },
    updateLadderLane: function(pLadder){
        this.ladderLane.updateLadderLane(pLadder);
        this.redrawLadder();
    },

    redrawLadder: function(){
        this.ladderSpriteGroup.destroy();
        this.ladderSpriteGroup = Ext.create('Ext.draw.CompositeSprite', {
            surface: this.digestPanel.surface
        });
        Ext.each(this.ladderLane.getBandYPositions(), function(yPosition, index){
             var gelBand = Ext.create('Ext.draw.Sprite', {
                type: 'rect',
                fill: '#fff',
                height: 2,
                width: 100,
                x: 100,
                y: yPosition
            });
            var bandText = Ext.create('Ext.draw.Sprite', {
                type: 'text',
                text: this.ladderLane.getLadder()[index],
                fill: '#fff',
                size: 50,
                surface: this.digestPanel.surface,
                x: 40,
                y: yPosition
            });

            this.ladderSpriteGroup.add(bandText); 
            this.ladderSpriteGroup.add(gelBand); 
        
        }, this);
        this.showSprites(this.ladderSpriteGroup);

    },
   /*
     * A helper method to show a sprite group - the builtin wasn't working.
     */
    showSprites: function(pSpriteGroup){
       var tempSurface = this.digestPanel.surface;
       pSpriteGroup.each(function(band){
           tempSurface.add(band);
       });
       pSpriteGroup.show(true);

    },

 
});
