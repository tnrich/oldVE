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
            groupSelector.store.add({"name": name});
        });

        // Set the value in the combobox to the first element by default.
        groupSelector.setValue(groupSelector.store.getAt("0").get("name"));
    },

    /**
     * Populates the itemselector field with enzyme names.
     * Called when the user selects a new group in the combobox.
     */
    onEnzymeGroupSelected: function(combobox) {
        var newGroup = this.GroupManager.groupByName(combobox.getValue());
        var selector = this.managerWindow.query("#enzymeListSelector")[0];
        var newStoreData = [];

        selector.store.removeAll(true);

        Ext.each(newGroup.getEnzymes(), function(enzyme) {
            selector.store.add({"name": enzyme.getName()});
        });

        selector.store.sort();
        selector.bindStore(selector.store);
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
