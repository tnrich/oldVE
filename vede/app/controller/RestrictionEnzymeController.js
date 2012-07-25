Ext.define("Vede.controller.RestrictionEnzymeController", {
    extend: "Ext.app.Controller",

    requires: ["Teselagen.manager.RestrictionEnzymeGroupManager"],

    GroupManager: null,
    managerWindow: null,

    init: function() {
        this.GroupManager = Teselagen.manager.RestrictionEnzymeGroupManager;

        this.control({
            "#enzymeGroupSelector": {
                change: this.onEnzymeGroupSelected
            },
            "#restrictionEnzymesManagerOKButton": {
                click: this.onOKButtonClick
            },
            "#saveGroupButton": {
                click: this.onSaveButtonClick
            },
            "#deleteGroupButton": {
                click: this.onDeleteGroupButtonClick
            },
        });

        this.application.on({
            RestrictionEnzymeManagerOpened: this.onEnzymeManagerOpened, 
            scope: this
        });
    },

    /**
     * Populates the group selector combobox when the restriction enzyme
     * manager window is opened.
     */
    onEnzymeManagerOpened: function(manager) {
        this.managerWindow = manager;
        if(!this.GroupManager.getIsInitialized()) {
            this.GroupManager.initialize();
        }

        var nameData = [];
        var groupSelector = this.managerWindow.query("#enzymeGroupSelector")[0];

        Ext.each(this.GroupManager.getGroupNames(), function(name) {
            groupSelector.store.add({name: name});
        });

        // Set the value in the combobox to the first element by default.
        groupSelector.setValue(groupSelector.store.getAt("0").get("name"));
    },

    displayActiveGroups: function(unsavedSelections) {
        // Set values in the itemselector to current active enzymes.
        var enzymeSelector = this.managerWindow.query("#enzymeListSelector")[0];
        var activeEnzymes = [];

        Ext.each(this.GroupManager.getActiveGroup(), function(enzyme) {
            enzymeSelector.toField.store.add({name: enzyme.getName()});
        });

        if(unsavedSelections) {
            Ext.each(unsavedSelections, function(selection) {
                enzymeSelector.toField.store.add(selection);
            });
        }

        // Remove duplicate values from the left enzyme box.
        /*var testArray = [];
        enzymeSelector.toField.store.each(function(record) {
            testArray.push(record.name);
        });
        enzymeSelector.fromField.store.filterBy(function(record) {
            if(testArray.indexOf(record.name) == -1) {
                return true;
            }
        });*/
    },

    /**
     * Populates the itemselector field with enzyme names.
     * Called when the user selects a new group in the combobox.
     */
    onEnzymeGroupSelected: function(combobox) {
        var newGroup = this.GroupManager.groupByName(combobox.getValue());
        var selector = this.managerWindow.query("#enzymeListSelector")[0];
        var newStoreData = [];

        // If we have unsaved items in the active enzyme box, we must save them
        // so we can restore them after clearing the store.
        var rightStore = selector.toField.store;
        var unsavedSelections = null;
        if(rightStore.getCount() > 0) {
            unsavedSelections = [];

            rightStore.each(function(item) {
                unsavedSelections.push(item);
            });
        }

        selector.fromField.store.removeAll(true);

        Ext.each(newGroup.getEnzymes(), function(enzyme) {
            selector.fromField.store.add({name: enzyme.getName()});
        });

        selector.fromField.store.sort();

        this.displayActiveGroups(unsavedSelections);
    },

    /**
     * Saves active enzymes and closes the window.
     */
    onOKButtonClick: function() {
        var selected = this.managerWindow.query("#enzymeListSelector")[0].getValue();
        var newActiveGroup = [];

        Ext.each(selected, function(name) {
            newActiveGroup.push(this.GroupManager.getEnzymeByName(name));
        }, this);

        this.GroupManager.setActiveGroup(newActiveGroup);

        this.managerWindow.close();
    }
});
