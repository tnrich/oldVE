/**
 * A controller that handles events in the SimulateDigestionWindow
 * @class Vede.controller.SimulateDigestionController
 * @author Doug Hershberger
 * @author Micah Lerner
 */
Ext.define("Vede.controller.VectorEditor.SimulateDigestionController", {
    extend: "Ext.app.Controller",
    requires:
        ["Teselagen.manager.RestrictionEnzymeGroupManager",
         "Teselagen.bio.tools.DigestionCalculator",
         "Teselagen.bio.sequence.DNATools",
         "Teselagen.manager.SimulateDigestionManager",
         "Ext.util.TaskRunner"],
    /*
     * The enzymeGroupManager that manages the groups of enzymes in this control
     */
     GroupManager: null,
     /*
      * The DNATools object for manipulating DNA
      */
     DNATools: null,
     /*
      * The SimulateDigestionManager for this Controller
      */
     digestManager: null,
     /*
      * The window that calls this controller
      */
     managerWindow: null,
     /*
      * The panel where the gel is drawn
      */
     digestPanel: null,
     /*
      * The dnaSequence to be digested
      */
     dnaSequence: null,
     /*
      * The object that represents the dropdown for selecting enzyme groups
      */
     groupSelector: null,
     /*
      * The object that represents the multiSelect control for selecting enzymes
      */
     enzymeListSelector: null,

     /**
      * @member Vede.controller.SimulateDigestionController
      */
     init: function() {
         this.GroupManager = Teselagen.manager.RestrictionEnzymeGroupManager;
         this.DigestionCalculator = Teselagen.bio.tools.DigestionCalculator;
         this.DNATools = Teselagen.bio.sequence.DNATools;
         this.filterTaskRunner = new Ext.util.TaskRunner();
         this.digestManager = Ext.create("Teselagen.manager.SimulateDigestionManager", {});
         this.control({
             "#enzymeGroupSelector-digest": {
                 change: this.onEnzymeGroupSelected
             },
             "#ladderSelector": {
                 change: this.updateLadderLane
             },
             "#enzymeGroupSelector-search": {
                 change: this.searchEnzymes
             },
             "#drawingSurface": {
                 resize: this.onGelResize
             },
             "#enzymeListSelector-digest": {
                 change: this.onEnzymeListChange
             }
         });
         this.application.on({
             SequenceManagerChanged: this.getSequenceManagerData,
             SimulateDigestionWindowOpened: this.onSimulateDigestionOpened,
             scope: this
         });
     },

     /**
      * Gets data for the sequence from the provided sequenceManager
      * @param {Object} pSequenceManager the sequenceManager with the sequence in it
      */
     getSequenceManagerData: function(pSequenceManager){
         if (pSequenceManager.getSequence().seqString()){
             this.dnaSequence = Teselagen.bio.sequence.DNATools.createDNASequence("testSeq", pSequenceManager.getSequence().seqString());
         } else {
             this.dnaSequence = "";
         }
         this.digestManager.setDnaSequence(this.dnaSequence);
     },
     /**
      * Initializes several items in this controller and the manager
      * @param {Object} manager the calling object
      */
     onSimulateDigestionOpened: function(manager) {
         this.managerWindow = manager;
         this.managerWindow.on({
             beforeclose: this.onSimulateDigestionWindowClosed,
             scope: this
             });
         this.digestPanel = this.managerWindow.query("#drawingSurface")[0];
         this.digestManager.digestPanel = this.digestPanel;
         //this.DigestionCalculator = Teselagen.bio.tools.DigestionCalculator;
         //this.DNATools = Teselagen.bio.sequence.DNATools;
         var groupSelector = this.managerWindow.query("#enzymeGroupSelector-digest")[0];
         this.enzymeListSelector = this.managerWindow.query("#enzymeListSelector-digest")[0];
         if(!this.GroupManager.getIsInitialized()) {
             this.GroupManager.initialize();
         }

//         var nameData = [];
         //Add names of groups to combobox
         Ext.each(this.GroupManager.getGroupNames(), function(name) {
             groupSelector.store.add({"name": name});
         });

//         var startGroup = this.GroupManager.groupByName(groupSelector.store.getAt("0").get("name"));
//         var groupArray = [];
//         Ext.each(startGroup.getEnzymes(), function(enzyme) {
//             groupArray.push({name: enzyme.getName()});
//         });
//         this.enzymeListSelector.store.loadData(groupArray);
//         this.enzymeListSelector.bindStore(this.enzymeListSelector.store);
         this.digestManager.setDigestPanel(this.digestPanel);
         this.digestManager.setGroupManager(this.GroupManager);
         this.digestManager.setEnzymeListSelector(this.enzymeListSelector);
         var searchCombobox = this.managerWindow.query("#enzymeGroupSelector-search")[0];
         this.digestManager.filterEnzymesInternal(searchCombobox, groupSelector);
         var ladderSelector = this.managerWindow.query("#ladderSelector")[0];
         this.updateLadderLane(ladderSelector);
         this.digestManager.drawGel();
         //"// Makes it look nicer in vim
     },
     /**
      * Calls the manager to save the currently selected enzymes
      * @param {Ext.panel.Panel} the window that is closed
      */
     onSimulateDigestionWindowClosed: function(){
         this.digestManager.onClose();
     },
     /**
      * Redraws the gel when the window is resized
      * @param {Ext.draw.Surface} drawingSurface the surface the gel is drawn on
      * @param {Number} width the width of the surface the gel is drawn on
      * @param {Number} height the height of the surface the gel is drawn on
      */
     onGelResize: function(drawingSurface, width, height) {
         //having a chicken and the egg problem where this.digestManager is not being made until after this is called
         if (this.digestManager === undefined || this.digestManager === null) {return;}
         this.digestManager.drawGel(drawingSurface, width, height);
     },
     /**
      * Populates the itemselector field with enzyme names.
      * Called when the user selects a new group in the combobox.
      */
     onEnzymeGroupSelected: function() {
         var searchCombobox = this.managerWindow.query("#enzymeGroupSelector-search")[0];
         var groupSelector = this.managerWindow.query("#enzymeGroupSelector-digest")[0];
         this.digestManager.filterEnzymes(searchCombobox, groupSelector);
     },
     /**
      * Searches the itemselector field for enzyme names
      */
     searchEnzymes: function() {
         var searchCombobox = this.managerWindow.query("#enzymeGroupSelector-search")[0];
         var groupSelector = this.managerWindow.query("#enzymeGroupSelector-digest")[0];
         this.digestManager.filterEnzymes(searchCombobox, groupSelector);
     },

     /**
      * Redigests your sequence with selected enzymes from the enzymeListSelector
      */
     onEnzymeListChange: function(){
         this.digestManager.updateSampleLane(this.enzymeListSelector.toField.store);
         this.enzymeListSelector.fromField.boundList.getStore().sort("name", "ASC");
         this.enzymeListSelector.toField.boundList.getStore().sort("name", "ASC");
     },
     /**
      * Updates the Ladder based on the selection in the ladder drop down.
      * @param {Object} combobox the calling object
      */
     updateLadderLane: function(combobox){
         this.digestManager.updateLadderLane(combobox.getValue());
     }

});
