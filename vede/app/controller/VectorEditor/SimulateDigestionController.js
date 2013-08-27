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
         "Teselagen.event.MenuItemEvent",
         "Teselagen.event.SequenceManagerEvent",
         "Teselagen.manager.RestrictionEnzymeGroupManager",
         "Teselagen.manager.SimulateDigestionManager",
         "Teselagen.utils.Logger"],
    /*
     * The enzymeGroupManager that manages the groups of enzymes in this control
     */
     GroupManager: null,
     /*
      * The DNATools object for manipulating DNA
      */
     DNATools: null,
     Logger: null,
     /*
      * The SimulateDigestionManager for this Controller
      */
     digestManager: null,
     /*
      * The window that calls this controller
      */
     managerWindow: null,
     /*
      * The dnaSequence to be digested
      */
     dnaSequence: null,

     
     refs: [{ref:"drawingSurface", selector: "draw[cls=drawingSurface]"},
            {ref:"enzymeGroupSelectorDigest", selector:"combobox[cls=enzymeGroupSelector-digest]"},
            {ref:"enzymeGroupSelectorSearch", selector:"combobox[cls=enzymeGroupSelector-search]"},
            {ref:"enzymeListSelectorDigest", selector:"itemselectorvede[cls=enzymeListSelector-digest]"},
            {ref:"ladderSelector", selector: "combobox[cls=ladderSelector]"}
     ],
     
     /**
      * @member Vede.controller.SimulateDigestionController
      */
    init: function() {
        this.GroupManager = Teselagen.manager.RestrictionEnzymeGroupManager;
        this.DigestionCalculator = Teselagen.bio.tools.DigestionCalculator;
        this.DNATools = Teselagen.bio.sequence.DNATools;
        this.Logger = Teselagen.utils.Logger;
        this.control({
            "#mainAppPanel": {
                tabchange: this.onTabChange
            },
            "combobox[cls=enzymeGroupSelector-digest]": {
                change: this.onEnzymeGroupSelected
            },
            "combobox[cls=ladderSelector]": {
                change: this.updateLadderLane
            },
            "combobox[cls=enzymeGroupSelector-search]": {
                change: this.searchEnzymes
            },
            "draw[cls=drawingSurface]": {
                resize: this.onGelResize
            },
            "itemselectorvede[cls=enzymeListSelector-digest]": {
                change: this.onEnzymeListChange
            },
            "button[cls=simulateDigestionSaveButton]": {
                click: this.onSaveButtonClick
            },
            "button[cls=simulateDigestionCancelButton]": {
                click: this.onCancelButtonClick
            },
            "window[cls=simulateDigestion]": {
                close: this.onWindowClose
            }
        });

        this.application.on(Teselagen.event.SequenceManagerEvent.SEQUENCE_MANAGER_CHANGED,
                            this.getSequenceManagerData, this);

        this.application.on(Teselagen.event.MenuItemEvent.SIMULATE_DIGESTION_WINDOW_OPENED,
                            this.onSimulateDigestionOpened, this);
    },

    onTabChange: function(mainAppPanel, newTab) {
        this.activeTab = newTab;

        if(newTab.initialCls === "VectorEditorPanel") {
            this.getSequenceManagerData(newTab.model);
        }
    },

     /**
      * Gets data for the sequence from the provided sequenceManager
      * @param {Object} pSequenceManager the sequenceManager with the sequence in it
      */
     getSequenceManagerData: function(pSequenceManager){
         if (pSequenceManager && pSequenceManager.getSequence().seqString()){
             this.dnaSequence = this.DNATools.createDNASequence("testSeq", pSequenceManager.getSequence().seqString());
         } else {
             this.dnaSequence = null;
         }
     },
     /**
      * Initializes several items in this controller and the manager
      * @param {Object} manager the calling object
      */
     onSimulateDigestionOpened: function() {
         var groupSelector = this.getEnzymeGroupSelectorDigest();
         var ladderSelector = this.getLadderSelector();
         var enzymeListSelector = this.getEnzymeListSelectorDigest();
         this.digestManager = Ext.create("Teselagen.manager.SimulateDigestionManager");
         this.digestManager.setDnaSequence(this.dnaSequence);
         this.digestManager.digestPanel = this.getDrawingSurface();
         enzymeListSelector.toField.bindStore(this.GroupManager.getActiveUserGroup().userRestrictionEnzymes());
         if(!this.GroupManager.getIsInitialized()) {
             this.GroupManager.initialize();
         }
         //Add names of groups to combobox
         Ext.each(this.GroupManager.getGroupNames(), function(name) {
             groupSelector.store.add({"name": name});
         });
         this.onEnzymeGroupSelected();
         this.updateLadderLane(ladderSelector);
         this.digestManager.updateSampleLane(enzymeListSelector.toField.getStore());
     },

     /**
     * Saves to database.
     */
    onSaveButtonClick: function() {
        var me = this;
        this.GroupManager.saveUserGroups(function(pSuccess) {
            if (pSuccess) {
                me.Logger.notifyInfo("Active enzyme group saved");
            }
        });
    },
    
    /**
     * Closes the window.
     */
    onCancelButtonClick: function(pBtn) {
        pBtn.up("window").close();
    },

     /**
      * Redraws the gel when the window is resized
      */
     onGelResize: function() {
         if (this.digestManager) {
             this.digestManager.drawGel();
         }
     },
     
     /**
      * Populates the itemselector fromField with enzyme names.
      * Called when the user selects a new group in the combobox.
      */
     onEnzymeGroupSelected: function() {
         var enzymeListSelector = this.getEnzymeListSelectorDigest();
         var groupSelector = this.getEnzymeGroupSelectorDigest();
         var currentGroup = this.GroupManager.groupByName(groupSelector.getValue());
         var enzymeArray = [];
         var fromStore = enzymeListSelector.fromField.getStore();
         Ext.each(currentGroup.getEnzymes(), function(enzyme) {
             enzymeArray.push({name: enzyme.getName()});
         });
         fromStore.loadData(enzymeArray);
         fromStore.sort("name", "ASC");
         this.setAddAllBtnState();
     },
     
     /**
      * Searches the itemselector fromField for enzyme names
      */
     searchEnzymes: function() {
         var enzymeListSelector = this.getEnzymeListSelectorDigest();
         var searchCombobox = this.getEnzymeGroupSelectorSearch();
         this.digestManager.filterEnzymes(searchCombobox.getValue(),
                 enzymeListSelector.fromField.getStore());
     },

     /**
      * Redigests your sequence with selected enzymes from the enzymeListSelector
      */
     onEnzymeListChange: function(){
         var enzymeListSelector = this.getEnzymeListSelectorDigest();
         this.digestManager.updateSampleLane(enzymeListSelector.toField.getStore());
         enzymeListSelector.toField.boundList.getStore().sort("name", "ASC");
         // Add if statement when other user groups are added
         //if (this.userEnzymeGroupSelector.getValue()===this.GroupManager.ACTIVE) {
             this.GroupManager.setActiveEnzymesChanged(true);
         //}
     },
     
     /**
      * Updates the Ladder based on the selection in the ladder drop down.
      * @param {Object} combobox the calling object
      */
     updateLadderLane: function(combobox){
         this.digestManager.updateLadderLane(combobox.getValue());
     },
     
     /**
     * After window is closed.
     */
    onWindowClose: function() {
        // Reload user to rollback any unsaved changes
        this.GroupManager.loadUserGroups();
        this.digestManager.destroy();
        this.digestManager = null;
    },
    
    /**
     * Disable Add All button for large enzyme groups
     */
    setAddAllBtnState: function() {
        var enzymeListSelector = this.getEnzymeListSelectorDigest();
        var addAllBtn = enzymeListSelector.down("button[cls=enzymeSelector-btn]");
        var count = enzymeListSelector.fromField.getStore().getCount();
         if (count > 50) {
             addAllBtn.disable();
         }
         else {
             addAllBtn.enable();
         }
    }

});
