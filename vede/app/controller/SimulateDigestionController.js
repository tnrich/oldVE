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
//			 "Teselagen.manager.SimulateDigestManager",
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
//				 this.digestManager = Ext.create("Teselagen.manager.SimulateDigestManager", {
//				 digestPanel: this.digestPanel
//				 });
		 //'// Makes it look nicer in vim
	 },

	 /**
	  * Populates the itemselector field with enzyme names.
	  * Called when the user selects a new group in the combobox.
	  */
	 onEnzymeGroupSelected: function(combobox) {
		 var searchCombobox = this.managerWindow.query("#enzymeGroupSelector-search")[0];
		 var groupSelector = this.managerWindow.query("#enzymeGroupSelector-digest")[0];
		 this.filterEnzymes(searchCombobox, groupSelector);

//				 var newGroup = this.GroupManager.groupByName(combobox.getValue());

//				 var enzymeArray = [];

//				 Ext.each(newGroup.getEnzymes(), function(enzyme) {
//				 enzymeArray.push({name: enzyme.getName()});
//				 });
//				 var tempSelectedEnzymes = this.enzymeListSelector.toField.store.data.items;
//				 this.enzymeListSelector.store.loadData(enzymeArray, false);
//				 this.enzymeListSelector.bindStore(this.enzymeListSelector.store);

//				 this.enzymeListSelector.toField.store.loadData(tempSelectedEnzymes, false);
//				 this.enzymeListSelector.toField.bindStore(this.enzymeListSelector.toField.store);
//				 var list = this.enzymeListSelector.fromField.boundList;
//				 var store = list.getStore();
//				 store.suspendEvents();
//				 tempSelectedEnzymes = this.enzymeListSelector.toField.store.getRange();
//				 tempSelectedEnzymes.forEach(function(enzyme) {
//				 var deleted = store.query("name",enzyme.get("name"));
//				 store.remove(deleted.items[0], false);;
//				 });
//				 store.resumeEvents();
//				 list.refresh();
//				 //Trigger an update of the filter also
//				 this.searchEnzymes(null);
	 },

    filterEnzymes: function(searchCombo, groupSelector){
    	//First we poulate the store with the right enzymes 
    	var currentList = this.GroupManager.groupByName(groupSelector.getValue());
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
	  * Searches the itemselector field for enzyme names
	  */
	 searchEnzymes: function(combobox) {
		 var searchCombobox = this.managerWindow.query("#enzymeGroupSelector-search")[0];
		 var groupSelector = this.managerWindow.query("#enzymeGroupSelector-digest")[0];
		 this.filterEnzymes(searchCombobox, groupSelector);
//				 if (this.filterTask) {
//				 this.filterTaskRunner.stop(this.filterTask);
//				 }
//				 if (combobox === null) {
//				 combobox = this.managerWindow.query("#enzymeGroupSelector-search")[0];
//				 }
//				 var groupSelector = this.managerWindow.query("#enzymeGroupSelector-digest")[0];
//				 var currentList = this.GroupManager.groupByName(groupSelector.getValue());
//				 //var currentList = this.enzymeListSelector.fromField.store.data.items;
//				 //var enzymeArray = [];
//				 var searchPhrase = ".";
//				 if (combobox.getValue() !== null){
//				 searchPhrase = combobox.getValue();
//				 }
//				 try {
//				 var regEx = new RegExp(searchPhrase, "i");
//				 } catch(err) {
//				 //We can safely ignore errors in the regex. they'll just result in not getting what you are looking for
//				 regEx = null;
//				 }
//				 this.enzymeListSelector.fromField.store.filterBy(function(enzyme){
//				 return enzyme.data.name.search(regEx) !== -1;
//				 }, this);
////				 this.filterTask = this.filterTaskRunner.start({
////				 run: this.filterEnzymes(currentList, regEx),
////				 repeat: 1,
////				 scope: this
////				 });
//				 var temp = 0;
////				 function pausecomp(millis) {
////				 var date = new Date();
////				 var curDate = null;

////				 do { curDate = new Date(); } 
////				 while(curDate-date < millis);
////				 };
////				 Ext.each(currentList.getEnzymes(), function(enzyme) {
////				 var temp = 0;
////				 pausecomp(100);
////				 if (enzyme.getName().search(regEx) !== -1) {
////				 enzymeArray.push({name: enzyme.getName()});
////				 }
////				 });
////				 var tempSelectedEnzymes = this.enzymeListSelector.toField.store.data.items;
////				 this.enzymeListSelector.store.loadData(enzymeArray, false);
////				 this.enzymeListSelector.bindStore(this.enzymeListSelector.store);

////				 this.enzymeListSelector.toField.store.loadData(tempSelectedEnzymes, false);
////				 this.enzymeListSelector.toField.bindStore(this.enzymeListSelector.toField.store);
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
		 /*
   this.digestManager = Ext.create("Teselagen.manager.SimulateDigestManager", {
        digestPanel: this.digestPanel,
        background: Ext.create('Ext.draw.Sprite', {
            type: 'rect',
            height: 400,
            width: 445,
            fill: '#000',
            x: 0,
            y: 0
        }),

        sampleLane: Ext.create("Teselagen.models.digest.SampleLane", {
            ladder: "1kb",
        }),

        ladderLane: Ext.create("Teselagen.models.digest.LadderLane", {
            ladder: "1kb",
        }),
   });*/
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
