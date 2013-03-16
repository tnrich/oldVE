/**
 * A controller that handles events in the SimulateDigestionWindow
 * @class Vede.controller.SimulateDigestionController
 */
Ext.define('Vede.controller.SimulateDigestionController', {
	extend: 'Ext.app.Controller',
	views: 
		[ 'SimulateDigestionWindow' ],

	requires: 
		["Teselagen.manager.RestrictionEnzymeGroupManager",
		 "Teselagen.bio.tools.DigestionCalculator",
		 "Teselagen.bio.sequence.DNATools",
		 "Teselagen.manager.SimulateDigestionManager",
		 "Ext.util.TaskRunner"],

	 GroupManager: null,
	 DigestionCalculator: null,
	 DNATools: null,
	 digestManager: null,

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
	 filterTaskRunner: null,
	 filterTask: null,

	 init: function() {
		 this.GroupManager = Teselagen.manager.RestrictionEnzymeGroupManager;
		 this.DigestionCalculator = Teselagen.bio.tools.DigestionCalculator;
		 this.DNATools = Teselagen.bio.sequence.DNATools;
		 this.filterTaskRunner = new Ext.util.TaskRunner();
		 this.control({
			 "#enzymeGroupSelector-digest": {
				 change: this.onEnzymeGroupSelected
			 },
			 '#digestButton':{
				 click: this.onDigestButtonClick
			 },

			 "#ladderSelector": {
				 change: this.updateLadderLane
			 },
			 "#enzymeGroupSelector-search": {
				 change: this.searchEnzymes
			 }
		 });

		 this.application.on({
			 SequenceManagerChanged: this.getSequenceManagerData,
			 SimulateDigestionWindowOpened: this.onSimulateDigestionOpened, 
			 scope: this
		 }); 
	 },

	 getSequenceManagerData: function(pSequenceManager){
		 if (pSequenceManager.getSequence().seqString()){
			 this.dnaSequence = Teselagen.bio.sequence.DNATools.createDNASequence("testSeq", pSequenceManager.getSequence().seqString());
		 } else {
			 this.dnaSequence = ""; 
		 };

//				 console.log("able to deal with completeSequence");
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
		 this.digestManager = Ext.create("Teselagen.manager.SimulateDigestionManager", {
		     digestPanel: this.digestPanel,
		     groupManager: this.GroupManager,
		     enzymeListSelector: this.enzymeListSelector
		 });
         this.digestManager.showSprites(this.digestSpriteGroup);
         this.digestManager.updateLadderLane(ladderSelector);
		 //'// Makes it look nicer in vim
	 },

	 /**
	  * Populates the itemselector field with enzyme names.
	  * Called when the user selects a new group in the combobox.
	  */
	 onEnzymeGroupSelected: function(combobox) {
		 var searchCombobox = this.managerWindow.query("#enzymeGroupSelector-search")[0];
		 var groupSelector = this.managerWindow.query("#enzymeGroupSelector-digest")[0];
		 this.digestManager.filterEnzymes(searchCombobox, groupSelector);
	 },
	 /**
	  * Searches the itemselector field for enzyme names
	  */
	 searchEnzymes: function(combobox) {
		 var searchCombobox = this.managerWindow.query("#enzymeGroupSelector-search")[0];
		 var groupSelector = this.managerWindow.query("#enzymeGroupSelector-digest")[0];
		 this.digestManager.filterEnzymes(searchCombobox, groupSelector);
	 },


	 /* 
	  * Redigests your sequence with selected enzymes.
	  */
	 onDigestButtonClick: function(){
		 console.log(this.enzymeListSelector.toField.store); 
		 console.log("Digesting!");
		 this.digestManager.updateSampleLane(this.enzymeListSelector.toField.store);
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

		 this.ladderSpriteGroup = Ext.create('Ext.draw.CompositeSprite', {
			 surface: this.digestPanel.surface
		 });

		 this.ladderLane = Ext.create("Teselagen.models.digest.LadderLane", {
			 ladder: "1kb",
		 });
		 var ladderSelector = this.managerWindow.query("#ladderSelector")[0];
	 },
	 /*
	  * Updates the Ladder based on the selection in the ladder drop down.
	  */
	 updateLadderLane: function(combobox){
	     this.digestManager.updateLadderLane(combobox.getValue());
	 }

});
