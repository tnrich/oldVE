/**
 * Simulate digestion manager
 * @class Teselagen.manager.SimulateDigestionManager
 */
Ext.require("Teselagen.models.digest.Ladder");
Ext.define("Teselagen.manager.SimulateDigestionManager", {
    config: {
        digestPanel: null,
        sampleLane: null,
        groupManager: null,
        enzymeListSelector: null,
        /**
         * The {Teselagen.models.digest.Gel} which represents this digestion gel
         */
        gel: null, 
        /**
         * The {Teselagen.models.digest.Ladder} which contains definition of various ladders
         */
        Ladder: null,
        /**
         * The {Teselagen.bio.enzyme.RestrictionEnzyme[]} which contains the enzymes to use to digest the 
         */
        enzymes: null,
        /**
         * The {Teselagen.bio.sequence.dna.DNASequence} which contains the sequence to be digested
         */
        dnaSequence: null
    },
    constructor: function(inData){
        this.initConfig(inData);
    	this.Ladder = Ext.create("Teselagen.models.digest.Ladder");
        //this.initializeDigestDrawingPanel();
    },
    /**
     * Updates the DNA sequence to be digested
     * @param {Teselagen.bio.sequence.dna.DNASequence} dnaSequence which contains the sequence to be digested
     */
    setDnaSequence: function(dnaSequence){
    	this.dnaSequence = dnaSequence;
    	//For right now, vector editor does not set the sequence as circular when reading from GenBank but 
    	// the digestion assumes that it is circular
    	dnaSequence.setCircular(true);
    },
    /**
     * Filters the list of enzymes in the itemSelector based on the enzyme group selected and the search term
     * @param {Object} searchCombo which contains the search term
     * @param {Object} groupSelector which contains the restriction enzyme group to be searched
     */
    filterEnzymes: function(searchCombo, groupSelector){
        //First we populate the store with the right enzymes 
        var currentList = this.groupManager.groupByName(groupSelector.getValue());
        var enzymeArray = [];
        Ext.each(currentList.getEnzymes(), function(enzyme) {
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
    /**
     * Updates the Ladder based on the selection in the ladder drop down.
     * @param {String} ladder the string in the ladder dropdown for this particular ladder
     */
    updateLadderLane: function(ladder){
        this.selectedLadder = this.Ladder.ladderTypes.get(ladder);
        //Trigger redrawing everything after the ladder has changed
        this.drawGel();
    },
    /*
     * Updates sample lane contents, including rescaling based on ladder
     * selection
     * @param {Ext.data.Store} selectedEnzymes the enzymes to be used to digest the Sample
     */
    updateSampleLane: function(selectedEnzymes){
        //Clear the enzymes array
        //Have to use local scope because calls to this in the each loop refer to the selectedEnzymes object, not this
        var tempEnzymes = [];
        selectedEnzymes.each(function(enzyme){
            tempEnzymes.push(Teselagen.manager.RestrictionEnzymeGroupManager.getEnzymeByName(enzyme.data.name));
        });
        this.enzymes = tempEnzymes;
        this.drawGel();
    },
    /**
     * Draws the gel by making gel objects, populating them with the right fragments and the calling draw on each of them
     */
    drawGel: function(){
    	if (this.digestPanel === null) {
    		//We got here before the manager is initialized so bail
    		return;
    	}
    	var tempSurface = this.digestPanel.surface;
    	var height = this.digestPanel.surface.height;
    	var width = this.digestPanel.surface.width;
    	var gel = Ext.create("Teselagen.models.digest.Gel", {name: "Gel", actualHeight: height, actualWidth: width});
    	var ladderLane = Ext.create("Teselagen.models.digest.GelLane", {name: "TestLadder", ladder: this.selectedLadder});
    	gel.insertLane(ladderLane);
    	var sampleLane = Ext.create("Teselagen.models.digest.GelLane", {name: "TestA", sequence: this.dnaSequence, enzymes: this.enzymes});
    	gel.insertLane(sampleLane);
    	var sprites = gel.draw();
    	if (this.ladderSpriteGroup !== undefined && this.ladderSpriteGroup !== null) {
    		this.ladderSpriteGroup.destroy();
    	}
    	this.ladderSpriteGroup = Ext.create('Ext.draw.CompositeSprite', {
    		surface: this.digestPanel.surface
    	});
    	for (var i in sprites){
    		this.ladderSpriteGroup.add(sprites[i]);
    	}
    	this.ladderSpriteGroup.each(function(band){
    		tempSurface.add(band);
    	});
    	this.ladderSpriteGroup.show(true);

    	for (var i in sprites){
    		//only show tooltips for the products of digestion. I tried to make these tooltips while making the sprites but
    		// it doesn't work. It seems you have to wait until the sprites have rendered to make the tooltips.
    		// http://garysieling.com/blog/extjs-tooltip-example
    		if (sprites[i].bandType === "digest") {
	            var tip = Ext.create('Ext.tip.ToolTip', {
	                target: sprites[i].id,
	                showDelay: 0, //Show this tip immediately after the mouseover
	                dismissDelay: 0, //Never hide this tooltip if the mouse is still over the sprite
	                html: sprites[i].size + " bp, " + sprites[i].start + "(" + sprites[i].startRE + ").." + sprites[i].end + "(" + sprites[i].endRE + ")"
	            });
    		}
    	}
    }
});