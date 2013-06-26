/**
 * A controller that handles events in the SimulateDigestionWindow
 * @class Vede.controller.SimulateDigestionController
 * @author Doug Hershberger
 * @author Micah Lerner
 */
Ext.define("Vede.controller.VectorEditor.SimulateDigestionController", {
    extend: "Ext.app.Controller",
    requires:
        ["Teselagen.bio.tools.DigestionCalculator",
         "Teselagen.bio.sequence.DNATools",
         "Teselagen.manager.RestrictionEnzymeGroupManager",
         "Teselagen.manager.SimulateDigestionManager",
         "Teselagen.manager.UserManager",
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
     
     UserManager: null,

     /**
      * @member Vede.controller.SimulateDigestionController
      */
     init: function() {
         this.GroupManager = Teselagen.manager.RestrictionEnzymeGroupManager;
         this.UserManager = Teselagen.manager.UserManager;
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
             },
             "button[cls=simulateDigestionSaveButton]": {
                click: this.onSaveButtonClick
            },
            "button[cls=simulateDigestionCancelButton]": {
                click: this.onCancelButtonClick
            },

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
         var me = this;
         this.managerWindow = manager;
         var groupSelector = this.managerWindow.query("#enzymeGroupSelector-digest")[0];
         var searchCombobox = this.managerWindow.query("#enzymeGroupSelector-search")[0];
         var ladderSelector = this.managerWindow.query("#ladderSelector")[0];
         this.digestPanel = this.managerWindow.query("#drawingSurface")[0];
         this.digestManager.digestPanel = this.digestPanel;
         this.enzymeListSelector = this.managerWindow.query("#enzymeListSelector-digest")[0];
         this.digestManager.enzymeListSelector = this.enzymeListSelector;
         this.UserManager.loadUser(function(pSuccess) {
             if (pSuccess) {
                 if(!me.GroupManager.getIsInitialized()) {
                     me.GroupManager.initialize();
                 }
                 //Add names of groups to combobox
                 Ext.each(me.GroupManager.getGroupNames(), function(name) {
                     groupSelector.store.add({"name": name});
                 });
                 me.digestManager.filterEnzymes(searchCombobox, groupSelector);
                 me.updateLadderLane(ladderSelector);
                 me.digestManager.drawGel();
             }
             else {
                console.error("Error launching Simulate Digestion");
            }
         });
     },

     /**
     * Saves to database.
     */
    onSaveButtonClick: function() {
        this.UserManager.update(function(pSuccess) {
            if (!pSuccess) {
                console.warn("Unable to save restriction enzymes");
            }
        });
    },
    
    /**
     * Closes the window.
     */
    onCancelButtonClick: function() {
        this.managerWindow.close();
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
      * Populates the itemselector fromField with enzyme names.
      * Called when the user selects a new group in the combobox.
      */
     onEnzymeGroupSelected: function() {
         var searchCombobox = this.managerWindow.query("#enzymeGroupSelector-search")[0];
         var groupSelector = this.managerWindow.query("#enzymeGroupSelector-digest")[0];
         this.digestManager.filterEnzymes(searchCombobox, groupSelector);
     },
     /**
      * Searches the itemselector fromField for enzyme names
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
