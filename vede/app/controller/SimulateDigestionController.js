/*
 * A controller that handles events in the SimulateDigestionWindow
 */
Ext.define('Vede.controller.SimulateDigestionController', {
    extend: 'Ext.app.Controller',

    requires: ["Teselagen.manager.RestrictionEnzymeGroupManager",
               "Teselagen.bio.tools.DigestionCalculator",
               "Teselagen.bio.sequence.DNATools"],

    GroupManager: null,
    DigestionCalculator: null,
    DNATools: null,

    managerWindow: null,
    digestPanel: null,

    digestSpriteGroup: null,
    ladderSpriteGroup: null,
    sampleSpriteGroup: null,

    ladderLane: null,
    sampleLane: null,
    dnaSequence: null,

    groupSelector: null,
    sampleLaneInitialized: false,
    enzymeListSelector: null,

    init: function() {
        this.GroupManager = Teselagen.manager.RestrictionEnzymeGroupManager;
        this.DigestionCalculator = Teselagen.bio.tools.DigestionCalculator;
        this.DNATools = Teselagen.bio.sequence.DNATools;
                this.control({
            "#enzymeGroupSelector-digest": {
                change: this.onEnzymeGroupSelected
            },
            '#digestButton':{
                click: this.onDigestButtonClick
            },
        
            "#ladderSelector": {
                change: this.updateLadderLane
            }
        });

        this.application.on({
            SequenceManagerChanged: this.onSequenceManagerChanged,
            SimulateDigestionWindowOpened: this.onSimulateDigestionOpened, 
            scope: this
        });
    },

    onSequenceManagerChanged: function(pSequenceManager){
        this.dnaSequence = Teselagen.bio.sequence.DNATools.createDNASequence("testSeq", pSequenceManager.getSequence().seqString());
        console.log("able to deal with completeSequence");
    },

    onSimulateDigestionOpened: function(manager) {
        this.managerWindow = manager;
        //this.DigestionCalculator = Teselagen.bio.tools.DigestionCalculator;
        //this.DNATools = Teselagen.bio.sequence.DNATools;
var groupSelector = this.managerWindow.query("#enzymeGroupSelector-digest")[0];
        this.enzymeListSelector = this.managerWindow.query("#enzymeListSelector-digest")[0];
        console.log("trying to init");
        if(!this.GroupManager.getIsInitialized()) {
            this.GroupManager.initialize();
        }
        console.log("fired");

        var nameData = [];
        //Add names of groups to combobox
        Ext.each(this.GroupManager.getGroupNames(), function(name) {
            groupSelector.store.add({"name": name});
        });

        // Set the value in the group combobox to the first element by default.
        groupSelector.setValue(groupSelector.store.getAt("0").get("name"));

        var startGroup = this.GroupManager.groupByName(groupSelector.store.getAt("0").get("name"));
        var groupArray = [];
        Ext.each(startGroup.getEnzymes(), function(enzyme) {
            groupArray.push({name: enzyme.getName()});
        });
        console.log(groupArray)
        this.enzymeListSelector.store.loadData(groupArray);
        this.enzymeListSelector.bindStore(this.enzymeListSelector.store);

        this.initializeDigestDrawingPanel();
        //'// Makes it look nicer in vim
        },

    /**
     * Populates the itemselector field with enzyme names.
     * Called when the user selects a new group in the combobox.
     */
    onEnzymeGroupSelected: function(combobox) {
        var newGroup = this.GroupManager.groupByName(combobox.getValue());

        var enzymeArray = [];

        Ext.each(newGroup.getEnzymes(), function(enzyme) {
            enzymeArray.push({name: enzyme.getName()});
        });

        this.enzymeListSelector.fromField.store.loadData(enzymeArray, false);
        this.enzymeListSelector.fromField.bindStore(this.enzymeListSelector.fromField.store);
    },

    
    /* 
     * Redigests your sequence with selected enzymes.
     */
    onDigestButtonClick: function(){
        console.log(this.enzymeListSelector.toField.store); 
        console.log("Digesting!");
        this.updateSampleLane(this.enzymeListSelector.toField.store);
    },

    /*
     * Initializes components of the drawing panel
     */
    initializeDigestDrawingPanel: function(){
        this.digestPanel = this.managerWindow.query("#drawingSurface")[0];
        this.digestSpriteGroup = Ext.create('Ext.draw.CompositeSprite', {
            surface: this.digestPanel.surface
        });
       this.sampleSpriteGroup = Ext.create('Ext.draw.CompositeSprite', {
            surface: this.digestPanel.surface
        });
       this.sampleLane = Ext.create("Teselagen.models.digest.SampleLane", {
            ladder: "1kb",
        });
          console.log('test');
        //console.log(this.ladderLane.getLadder());
       var digestBG = Ext.create('Ext.draw.Sprite', {
            type: 'rect',
            height: 400,
            width: 445,
            fill: '#000',
            x: 0,
            y: 0
        });
        this.digestSpriteGroup.add(digestBG);
        this.showSprites(this.digestSpriteGroup);
       
        this.ladderSpriteGroup = Ext.create('Ext.draw.CompositeSprite', {
            surface: this.digestPanel.surface
        });

               this.ladderLane = Ext.create("Teselagen.models.digest.LadderLane", {
            ladder: "1kb",
        });
        var ladderSelector = this.managerWindow.query("#ladderSelector")[0];
        this.updateLadderLane(ladderSelector);

       
 },

    /*
     * Updates the Ladder based on the selection in the ladder drop down.
     */
    updateLadderLane: function(combobox){
        //Destroy all previous ladder bands
        this.ladderSpriteGroup.destroy();
        this.ladderSpriteGroup = Ext.create('Ext.draw.CompositeSprite', {
            surface: this.digestPanel.surface
        });
        //Set the sample lane ladder so that sample ladder bands scale
        //correctly
       this.sampleLane.setLadder(combobox.getValue());
        this.ladderLane.updateLadderLane(combobox.getValue());

        //Draw all ladder bands and text labels
        Ext.each(this.ladderLane.getBandYPositions(), function(yPosition, index){
             var gelBand = Ext.create('Ext.draw.Sprite', {
                type: 'rect',
                fill: '#fff',
                height: 2,
                width: 100,
          //      surface: this.digestPanel.surface,
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

        //Draw all ladder sprites using helper method
        this.showSprites(this.ladderSpriteGroup);
        console.log("changing ladder");

        //Update sample lane everytime the ladder changes (to rescale band
        //placement). The first time you do this, there won't be any enzymes
        //selected, so an error would be thrown. A slightly hacky way to deal
        //with this issue.
        this.updateSampleLane(this.enzymeListSelector.toField.store);
        this.sampleLaneInitialized = true;
    },

    /*
     * Updates sample lane contents, including rescaling based on ladder
     * selection
     */
    updateSampleLane: function(selectedEnzymes){
        console.log("Updating sample...");
        console.log(selectedEnzymes);
        if (!this.sampleLaneInitialized) return;

        var currentSequence = "";
        
        //This array contains the actual RestrictionEnzyme datastructures.
        var enzymes = [];
        selectedEnzymes.each(function(enzyme){
            console.log(enzyme.data.name);
            enzymes.push(Teselagen.manager.RestrictionEnzymeGroupManager.getEnzymeByName(enzyme.data.name));
        });

        //Digest the sequence with all of the restriction enzymes you've
        //selected
        var newFragments = this.DigestionCalculator.digestSequence(this.dnaSequence, enzymes);
        this.sampleSpriteGroup.destroy();
        this.sampleSpriteGroup = Ext.create('Ext.draw.CompositeSprite', {
            surface: this.digestPanel.surface
        });
        this.sampleLane.setFragments(newFragments);
       // console.log(this.sampleLane.getBandYPositions());
        this.sampleLane.redrawBands(); 

        //Draw all bands in the sample lane
        Ext.each(this.sampleLane.getBandYPositions(), function(yPosition, index){
             var gelBand = Ext.create('Ext.draw.Sprite', {
                    type: 'rect',
                    fill: '#fff',
                    height: 2,
                    width: 100,
                    x: 300,
                    y: yPosition
                });
                
                this.sampleSpriteGroup.add(gelBand); 
            
            }, this);
           // this.ladderSpriteGroup.show(true);
                this.showSprites(this.sampleSpriteGroup);
        console.log("changing sample");

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
