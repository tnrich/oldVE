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
    filterEnzymes: function(searchCombo, groupSelector){
    	//First we poulate the store with the right enzymes 
    	var currentList = this.GroupManager.groupByName(groupSelector.getValue());
        var enzymeArray = [];
        Ext.each(newGroup.getEnzymes(), function(enzyme) {
            enzymeArray.push({name: enzyme.getName()});
        });
        var tempSelectedEnzymes = this.enzymeListSelector.toField.store.data.items;
        this.enzymeListSelector.store.loadData(enzymeArray, false);
        this.enzymeListSelector.bindStore(this.enzymeListSelector.store);
        this.enzymeListSelector.toField.store.loadData(tempSelectedEnzymes, false);
        this.enzymeListSelector.toField.bindStore(this.enzymeListSelector.toField.store);
        //remove any items on the left that are on the right
        var list = this.enzymeListSelector.fromField.boundList;
        var store = list.getStore();
        store.suspendEvents();
        tempSelectedEnzymes = this.enzymeListSelector.toField.store.getRange();
        tempSelectedEnzymes.forEach(function(enzyme) {
     	   var deleted = store.query("name",enzyme.get("name"));
     	   store.remove(deleted.items[0], false);;
        });
        store.resumeEvents();
        list.refresh();
        //Now we filter based on the search input
    	//the default searchphrase will match anything
    	var searchPhrase = ".";
    	if (searchCombo.getValue() !== null){
    		searchPhrase = searchCombo.getValue();
    	}
    	try {
    		var regEx = new RegExp(searchPhrase, "i");
    	} catch(err) {
    		//We can safely ignore errors in the regex. they'll just result in not getting what you are looking for
    		regEx = null;
    	}
    	this.enzymeListSelector.fromField.store.filterBy(function(enzyme){
    		return enzyme.get("name").search(regEx) !== -1;
    	}, this);
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
