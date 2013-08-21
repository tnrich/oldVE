/**
 * Simulate digestion manager
 * @class Teselagen.manager.SimulateDigestionManager
 * @author Doug Hershberger
 * @author Micah Lerner
 */
Ext.define("Teselagen.manager.SimulateDigestionManager", {
    requires: ["Ext.draw.CompositeSprite",
               "Ext.tip.ToolTip",
               "Teselagen.manager.RestrictionEnzymeGroupManager",
               "Teselagen.models.digest.Gel",
               "Teselagen.models.digest.GelLane",
               "Teselagen.models.digest.Ladder"],
    config: {
        /**
         * The {Teselagen.models.digest.Ladder} which contains definition of various ladders
         */
        Ladder: null,
        /**
         * The {Teselagen.bio.enzyme.RestrictionEnzyme[]} which contains the enzymes to use to digest the
         * sequence
         */
        enzymes: null,
        /**
         * The {Teselagen.bio.sequence.dna.DNASequence} which contains the sequence to be digested
         */
        dnaSequence: null
    },
    /*
     * The panel where the gel is drawn
     */
    digestPanel: null,
    /*
     * The object that represents the multiSelect control for selecting enzymes
     */
    selectedLadder: null,
    ladderSpriteGroup: null,
    GroupManager: null,
    
    /**
     * @member Teselagen.manager.SimulateDigestionManager
     */
    constructor: function(inData){
        this.initConfig(inData);
        this.Ladder = Ext.create("Teselagen.models.digest.Ladder");
        this.GroupManager = Teselagen.manager.RestrictionEnzymeGroupManager;
        //this.initializeDigestDrawingPanel();
    },
    /**
     * Updates the DNA sequence to be digested
     * @param {Teselagen.bio.sequence.dna.DNASequence} dnaSequence which contains the sequence to be digested
     */
    setDnaSequence: function(dnaSequence){
        if (dnaSequence !== null && dnaSequence !== "") {
            this.dnaSequence = dnaSequence;
            //For right now, vector editor does not set the sequence as circular when reading from GenBank but
            // the digestion assumes that it is circular
            dnaSequence.setCircular(true);
        }
    },
    /**
     * Filters the list of enzymes in the itemSelector based on the search term
     * @param {Object} searchCombo which contains the search term
     * @param {Object} store Store which will be filtered
     */
    filterEnzymes: function(searchTerm, store){
        //The default searchphrase will match anything
        var searchPhrase = ".";
        if (searchTerm !== null){
            searchPhrase = searchTerm;
        }
        try {
            var regEx = new RegExp(searchPhrase, "i");
        } catch(err) {
            //We can safely ignore errors in the regex. they'll just result in not getting what you are looking for
            regEx = null;
        }
        store.filterBy(function(enzyme){
            return enzyme.get("name").search(regEx) !== -1;
        }, this);
        store.sort("name", "ASC");
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
        var me = this;
        //Clear the enzymes array
        //Have to use local scope because calls to this in the each loop refer to the selectedEnzymes object, not this
        var tempEnzymes = [];
        selectedEnzymes.each(function(enzyme){
            tempEnzymes.push(me.GroupManager.getEnzymeByName(enzyme.data.name));
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
        this.ladderSpriteGroup = Ext.create("Ext.draw.CompositeSprite", {
            surface: this.digestPanel.surface
        });
        for (var i=0; i < sprites.length; i++){
            this.ladderSpriteGroup.add(sprites[i]);
        }
        this.ladderSpriteGroup.each(function(band){
            tempSurface.add(band);
        });
        this.ladderSpriteGroup.show(true);

        for (i = 0; i < sprites.length; i++){
            //only show tooltips for the products of digestion. I tried to make these tooltips while making the sprites but
            // it doesn't work. It seems you have to wait until the sprites have rendered to make the tooltips.
            // http://garysieling.com/blog/extjs-tooltip-example
            if (sprites[i].bandType === "digest") {
                Ext.create("Ext.tip.ToolTip", {
                    target: sprites[i].id,
                    showDelay: 0, //Show this tip immediately after the mouseover
                    dismissDelay: 0, //Never hide this tooltip if the mouse is still over the sprite
                    html: sprites[i].size + " bp, " + sprites[i].start + "(" + sprites[i].startRE + ").." + sprites[i].end + "(" + sprites[i].endRE + ")"
                });
            }
        }
    },
    
    destroy: function() {
        if (this.digestPanel) {
            this.digestPanel.destroy();
        }
        this.digestPanel = null;
        if (this.Ladder) {
            this.Ladder.destroy();
        }
        this.Ladder = null;
        this.enzymes = null;
        this.dnaSequence = null;
        if (this.ladderSpriteGroup) {
            this.ladderSpriteGroup.destroy();
        }
        this.ladderSpriteGroup = null;
        this.GroupManager = null;
    }
    
});