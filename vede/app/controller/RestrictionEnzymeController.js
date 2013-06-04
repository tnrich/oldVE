/**
 * Restriction enzyme controller
 * @class Vede.controller.RestrictionEnzymeController
 * @author Jenhan Tao
 */
Ext.define("Vede.controller.RestrictionEnzymeController", {
    extend: "Ext.app.Controller",

    requires: ["Teselagen.manager.RestrictionEnzymeGroupManager"],

    GroupManager: null,
    managerWindow: null,

    enzymeSelector: null,
    
    init: function() {
        this.GroupManager = Teselagen.manager.RestrictionEnzymeGroupManager;

        this.control({
            "#OkButton": {
                click: this.onOkButtonClick
            },
            "#GroupComboBox": {
                 change: this.onGroupComboBoxChange
             },
            "#EnzymeSearchBox": {
                 keyup: this.onEnzymeSearchBoxKeyup
             },
            "#SaveGroupButton": {
                 click: this.onSaveButtonClick
             },
             "#DeleteGroupButton": {
                 click: this.onDeleteGroupButtonClick
             },
             "#selectAllButton": {
                 click: this.onSelectAllButtonClick
             },
             "#selectButton": {
                 click: this.onSelectButtonClick
             },
             "#deselectButton": {
                 click: this.onDeselectButtonClick
             },
             "#deselectAllButton": {
                 click: this.onDeselectAllButtonClick
             }
        });

        this.application.on({
            RestrictionEnzymeManagerOpened: this.onEnzymeManagerOpened,
            scope: this
        });
    },
    
    /**
     * Populates the group selector combobox when the restriction enzyme
     * manage window is opened.
     */
    onEnzymeManagerOpened: function(manager) {
        // this.managerWindow = manager;
        // this.enzymeSelector = manager.query("#enzymeSelector")[0];

        // if(!this.GroupManager.getIsInitialized()) {
            // this.GroupManager.initialize();
        // }

        // var nameData = [];
        // var groupSelector = this.managerWindow.query("#enzymeGroupSelector")[0];

        // Ext.each(this.GroupManager.getGroupNames(), function(name) {
            // groupSelector.store.add({name: name});
        // });

        // // Set the value in the combobox to the first element by default.
        // groupSelector.setValue(groupSelector.store.getAt("0").get("name"));

        // // Load data into the enzyme selector.
        // var startGroup = this.GroupManager.groupByName(groupSelector.getValue());
        // var groupArray = [];
        // Ext.each(startGroup.getEnzymes(), function(enzyme) {
            // groupArray.push({name: enzyme.getName()});
        // });
        // this.enzymeSelector.store.loadData(groupArray);
        // this.enzymeSelector.bindStore(this.enzymeSelector.store);

        // this.displayActiveGroup();
    },

    displayActiveGroup: function() {
        // var activeGroup = this.GroupManager.getActiveGroup();
        // var names = [];

        // Ext.each(activeGroup.getEnzymes(), function(enzyme) {
            // names.push({name: enzyme.getName()});
        // }, this);

        // this.enzymeSelector.toField.store.loadData(names, false);
        // this.enzymeSelector.toField.bindStore(this.enzymeSelector.toField.store);
    },

    /**
     * Populates the itemselector field with enzyme names.
     * Called when the user selects a new group in the combobox.
     */
    onGroupComboBoxChange: function(combobox) {
        alert("enzyme group combo box changed, no function yet");
        // var newGroup = this.GroupManager.groupByName(combobox.getValue());
        // var newStoreData = [];

        // var enzymeArray = [];

        // Ext.each(newGroup.getEnzymes(), function(enzyme) {
            // enzymeArray.push({name: enzyme.getName()});
        // });

        // this.enzymeSelector.fromField.store.loadData(enzymeArray, false);
        // this.enzymeSelector.fromField.bindStore(this.enzymeSelector.fromField.store);
    },

    onEnzymeSearchBoxKeyup: function(field) {
        alert("enzyme search box click detected, no function yet");
        // this.enzymeSelector.fromField.store.filterBy(function(rec) {
            // if(rec.data.name.search(new RegExp(field.getValue(), "i")) != -1) {
                // return true;
            // }
        // });

        // this.enzymeSelector.fromField.bindStore(this.enzymeSelector.fromField.store);
    },

    /**
     * Saves the active enzymes to a group.
     * Not implemented in the flex version.
     */
    onSaveButtonClick: function() {
         alert("save button clicked, no function yet")
    },

    /**
     * Deletes the current active enzyme group.
     * Also not implemented in the flex version.
     */
    onDeleteGroupButtonClick: function() {
         alert("delete button clicked, no function yet")
    },

    /**
     * Saves active enzymes and closes the window.
     */
    onOkButtonClick: function() {
        alert("Ok button clicked, no function yet");
        // var names = [];
        // this.enzymeSelector.toField.store.each(function(obj) {
            // names.push(obj.data.name);
        // });

        // var newActiveGroup = this.GroupManager.createGroupByEnzymes("active",
                                                                    // names);
        // this.managerWindow.close();

        // if(newActiveGroup !== this.GroupManager.getActiveGroup()){
            // this.GroupManager.setActiveGroup(newActiveGroup);
            // this.application.fireEvent("ActiveEnzymesChanged");
        // }
    },
    
    /**
    * closes window without saving selected enzymes
    */
    onCancelButtonClick: function() {
        alert("cancel button clicked, no function yet");
    },
    
    /**
    * for every enzyme in AvailableEnzymeGridPanel and not in SelectedEnzymeGridPanel, add enzyme to SelectedEnzymeGridPanel
    */
    onSelectAllButtonClick: function() {
        alert("select all button clicked, no function yet");
    },
    
    /**
    * if there is at least one enzyme selected in AvailableEnzymeGrid, add each selected enzyme to SelectedEnzymeGrid
    */
    onSelectButtonClick: function() {
        alert("select button clicked, no function yet");
    },
    
    /**
    * if there is at least one enzyme selected in SelectedEnzymeGrid, remove each selected enzyme from SelectedEnzymeGrid
    */
    onDeselectButtonClick: function() {
        alert("deselect button clicked, no function yet");
    },
    
    /**
    * remove all enzymes from SelectedEnzymeGrid
    */
    onDeselectAllButtonClick: function() {
        alert("deselect all button clicked, no function yet");
    }
});
