Ext.define("Vede.controller.RestrictionEnzymeController", {
    extend: "Ext.app.Controller",

    requires: ["Teselagen.manager.RestrictionEnzymeGroupManager"],

    GroupManager: null,
    managerWindow: null,

    unsavedActiveEnzymes: [],
    enzymeSelector: null,

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
     * manage window is opened.
     */
    onEnzymeManagerOpened: function(manager) {
        this.managerWindow = manager;
        this.enzymeSelector = manager.query("#enzymeSelector")[0];

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

        // Load data into the enzyme selector.
        var startGroup = this.GroupManager.groupByName(groupSelector.getValue());
        var groupArray = [];
        Ext.each(startGroup.getEnzymes(), function(enzyme) {
            groupArray.push({name: enzyme.getName()});
        });
        this.enzymeSelector.store.loadData(groupArray);
        this.enzymeSelector.bindStore(this.enzymeSelector.store);

        this.displayActiveGroup();

        // Add listeners to the 'toField' on the enzyme selector.
        this.enzymeSelector.toField.store.un("add", this.onEnzymeAdded, this);
        this.enzymeSelector.toField.store.un("remove", this.onEnzymeRemoved, this);

        //this.enzymeSelector.toField.store.on("add", this.onEnzymeAdded, this);
        //this.enzymeSelector.toField.store.on("remove", this.onEnzymeRemoved, this);
    },

    onEnzymeAdded: function(toStore, enzymes) {
        var newActive = [];
        toStore.each(function(rec) {
            newActive.push(rec.data.name);
        });

        this.unsavedActiveEnzymes = newActive;
    },

    onEnzymeRemoved: function(toStore, enzyme) {
        var enzIndex = this.unsavedActiveEnzymes.indexOf(enzyme);
        this.unsavedActiveEnzymes.splice(enzIndex, 1);
    },

    displayActiveGroup: function() {
        if(this.unsavedActiveEnzymes.length == 0) {
            var activeGroup = this.GroupManager.getActiveGroup();
            var names = [];

            Ext.each(activeGroup.getEnzymes(), function(enzyme) {
                names.push({name: enzyme.getName()});
                this.unsavedActiveEnzymes.push(enzyme.getName());
            }, this);

            this.enzymeSelector.toField.store.loadData(names, false);
            this.enzymeSelector.toField.bindStore(this.enzymeSelector.toField.store);
        } else {
            this.enzymeSelector.toField.store.loadData(
                this.unsavedActiveEnzymes, false);
            this.enzymeSelector.toField.bindStore(this.enzymeSelector.toField.store);
        }
    },

    /**
     * Populates the itemselector field with enzyme names.
     * Called when the user selects a new group in the combobox.
     */
    onEnzymeGroupSelected: function(combobox) {
        var newGroup = this.GroupManager.groupByName(combobox.getValue());
        var newStoreData = [];

        var enzymeArray = [];

        Ext.each(newGroup.getEnzymes(), function(enzyme) {
            enzymeArray.push({name: enzyme.getName()});
        });

        this.enzymeSelector.fromField.store.loadData(enzymeArray, false);
        this.enzymeSelector.fromField.bindStore(this.enzymeSelector.fromField.store);

        //this.displayActiveGroups();
    },

    /**
     * Saves active enzymes and closes the window.
     */
    onOKButtonClick: function() {
        var newActiveGroup = this.GroupManager.createGroupByEnzymes("active", 
                                                this.unsavedActiveEnzymes);

        this.GroupManager.setActiveGroup(newActiveGroup);
        this.unsavedActiveEnzymes = [];

        this.managerWindow.close();
    }
});
