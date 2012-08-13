Ext.define("Vede.controller.RestrictionEnzymeController", {
    extend: "Ext.app.Controller",

    requires: ["Teselagen.manager.RestrictionEnzymeGroupManager"],

    GroupManager: null,
    managerWindow: null,

    enzymeSelector: null,

    init: function() {
        this.GroupManager = Teselagen.manager.RestrictionEnzymeGroupManager;

        this.control({
            "#enzymeGroupSelector": {
                change: this.onEnzymeGroupSelected
            },
            "#enzymeSearchField": {
                keyup: this.onEnzymeSearchFieldKeyup
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
    },

    displayActiveGroup: function() {
        var activeGroup = this.GroupManager.getActiveGroup();
        var names = [];

        Ext.each(activeGroup.getEnzymes(), function(enzyme) {
            names.push({name: enzyme.getName()});
        }, this);

        this.enzymeSelector.toField.store.loadData(names, false);
        this.enzymeSelector.toField.bindStore(this.enzymeSelector.toField.store);
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
    },

    onEnzymeSearchFieldKeyup: function(field) {
        this.enzymeSelector.fromField.store.filterBy(function(rec) {
            if(rec.data.name.search(new RegExp(field.getValue(), "i")) != -1) {
                return true;
            }
        });

        this.enzymeSelector.fromField.bindStore(this.enzymeSelector.fromField.store);
    },

    /**
     * Saves active enzymes and closes the window.
     */
    onOKButtonClick: function() {
        var names = [];
        this.enzymeSelector.toField.store.each(function(obj) {
            names.push(obj.data.name);
        });

        var newActiveGroup = this.GroupManager.createGroupByEnzymes("active", 
                                                                    names);
        this.managerWindow.close();

        if(newActiveGroup !== this.GroupManager.getActiveGroup()){
            this.GroupManager.setActiveGroup(newActiveGroup);
            this.application.fireEvent("ActiveEnzymesChanged");
        }
    }
});
