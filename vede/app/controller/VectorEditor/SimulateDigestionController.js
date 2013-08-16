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
     /*
      * The object that represents the dropdown for selecting enzyme groups
      */
     groupSelector: null,
     /*
      * The object that represents the multiSelect control for selecting enzymes
      */
     enzymeListSelector: null,
     addAllBtn: null,
     Logger: null,
     
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
         if (pSequenceManager.getSequence().seqString()){
             this.dnaSequence = Teselagen.bio.sequence.DNATools.createDNASequence("testSeq", pSequenceManager.getSequence().seqString());
         } else {
             this.dnaSequence = "";
         }
//         this.digestManager.setDnaSequence(this.dnaSequence);
     },
     /**
      * Initializes several items in this controller and the manager
      * @param {Object} manager the calling object
      */
     onSimulateDigestionOpened: function(manager) {
         var me = this;
         this.managerWindow = manager;
         this.groupSelector = this.managerWindow.query("#enzymeGroupSelector-digest")[0];
         this.searchCombobox = this.managerWindow.query("#enzymeGroupSelector-search")[0];
         var ladderSelector = this.managerWindow.query("#ladderSelector")[0];
         this.enzymeListSelector = this.managerWindow.query("#enzymeListSelector-digest")[0];
         this.addAllBtn = this.enzymeListSelector.down("button[cls=enzymeSelector-btn]");
         this.digestManager = Ext.create("Teselagen.manager.SimulateDigestionManager");
         this.digestManager.setDnaSequence(this.dnaSequence);
         this.digestManager.digestPanel = this.managerWindow.query("#drawingSurface")[0];
         this.enzymeListSelector.toField.bindStore(this.GroupManager.getActiveUserGroup().userRestrictionEnzymes());
         if(!me.GroupManager.getIsInitialized()) {
             me.GroupManager.initialize();
         }
         //Add names of groups to combobox
         Ext.each(me.GroupManager.getGroupNames(), function(name) {
             me.groupSelector.store.add({"name": name});
         });
         this.onEnzymeGroupSelected();
         me.updateLadderLane(ladderSelector);
         this.digestManager.updateSampleLane(this.enzymeListSelector.toField.getStore());
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
        var currentGroup = this.GroupManager.groupByName(this.groupSelector.getValue());
        var enzymeArray = [];
        var fromStore = this.enzymeListSelector.fromField.getStore();
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
         this.digestManager.filterEnzymes(this.searchCombobox.getValue(),
                 this.enzymeListSelector.fromField.getStore());
     },

     /**
      * Redigests your sequence with selected enzymes from the enzymeListSelector
      */
     onEnzymeListChange: function(){
         this.digestManager.updateSampleLane(this.enzymeListSelector.toField.getStore());
         this.enzymeListSelector.toField.getStore().sort("name", "ASC");
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
     
     destroy: function() {
         this.enzymeListSelector.fromField.getStore().removeAll();
         this.enzymeListSelector.toField.bindStore(null);
         this.enzymeListSelector = null;
         this.groupSelector.store.removeAll();
         this.groupSelector = null;
         this.dnaSequence = null;
         this.addAllBtn = null;
         this.digestManager = null;
         this.managerWindow.destroy();
         this.managerWindow = null;
     },
     
     /**
     * After window is closed.
     */
    onWindowClose: function() {
        // Reload user to rollback any unsaved changes
        this.GroupManager.loadUserGroups();
        this.destroy();
    },
    
    /**
     * Disable Add All button for large enzyme groups
     */
    setAddAllBtnState: function() {
        var count = this.enzymeListSelector.fromField.getStore().getCount();
         if (count > 50) {
             this.addAllBtn.disable();
         }
         else {
             this.addAllBtn.enable();
         }
    }

});
