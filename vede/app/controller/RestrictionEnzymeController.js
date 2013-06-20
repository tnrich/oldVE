/**
 * Restriction enzyme controller
 * @class Vede.controller.RestrictionEnzymeController
 * @ignore
 * @author Nick Elsbree
 */
Ext.define("Vede.controller.RestrictionEnzymeController", {
    extend: "Ext.app.Controller",

    requires: ["Teselagen.event.AuthenticationEvent", "Teselagen.manager.RestrictionEnzymeGroupManager",
               "Teselagen.manager.UserManager"],

    GroupManager: null,
    UserManager: null,
    managerWindow: null,

    enzymeSelector: null,
    userEnzymeGroupSelector: null,
    
    refs: [{ref:"deleteGroupBtn", selector:"#deleteGroupButton"},
           {ref:"makeActiveBtn", selector:"#makeActiveButton"}],
    
    init: function() {
        this.GroupManager = Teselagen.manager.RestrictionEnzymeGroupManager;
        this.UserManager = Teselagen.manager.UserManager;

        this.control({
            "#enzymeGroupSelector": {
                change: this.onEnzymeGroupChange
            },
            "#userEnzymeGroupSelector": {
                change: this.onUserEnzymeGroupChange
            },
            "#enzymeSearchField": {
                keyup: this.onEnzymeSearchFieldKeyup
            },
            "#restrictionEnzymesManagerOKButton": {
                click: this.onOKButtonClick
            },
            "#restrictionEnzymesManagerCancelButton": {
                click: this.onCancelButtonClick
            },
            "#saveGroupButton": {
                click: this.onSaveGroupButtonClick
            },
            "#deleteGroupButton": {
                click: this.onDeleteGroupButtonClick
            },
            "#makeActiveButton": {
                click: this.onMakeActiveButtonClick
            },
            "#enzymeSelector": {
                 change: this.onEnzymeListChange
             }
        });

        var listeners = {
            RestrictionEnzymeManagerOpened: this.onEnzymeManagerOpened,
            scope: this
        };
        listeners[Teselagen.event.AuthenticationEvent.LOGGED_IN] = this.onLoggedIn;
        this.application.on(listeners);
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

//        this.displayActiveGroup();
        
        // Set user enzyme selector
        this.userEnzymeGroupSelector = this.managerWindow.query("#userEnzymeGroupSelector")[0];
        this.userEnzymeGroupSelector.bindStore(this.UserManager.getUser().userRestrictionEnzymeGroups());
        this.userEnzymeGroupSelector.setValue(this.GroupManager.ACTIVE);
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
     * Populates the itemselector fromField with enzyme names.
     * Called when the user selects a new group in the combobox.
     */
    onEnzymeGroupChange: function(combobox) {
        var newGroup = this.GroupManager.groupByName(combobox.getValue());
        var enzymeArray = [];

        Ext.each(newGroup.getEnzymes(), function(enzyme) {
            enzymeArray.push({name: enzyme.getName()});
        });

        this.enzymeSelector.fromField.store.loadData(enzymeArray, false);
        this.enzymeSelector.fromField.bindStore(this.enzymeSelector.fromField.store);
    },

    /**
     * Populates the itemselector toField with enzyme names.
     * Called when the user selects a new group in the combobox.
     */
    onUserEnzymeGroupChange: function(combobox) {
        var groupName = combobox.getValue();
        var record = combobox.findRecordByValue(groupName);
        this.enzymeSelector.toField.bindStore(record.userRestrictionEnzymes());
        if (groupName === this.GroupManager.ACTIVE) {
            this.getDeleteGroupBtn().disable();
            this.getMakeActiveBtn().disable();
        }
        else {
            this.getDeleteGroupBtn().enable();
            this.getMakeActiveBtn().enable();
        }
    },

    /**
     * Filters the itemselector fromField based on input in the search field.
     */
    onEnzymeSearchFieldKeyup: function(field) {
        this.enzymeSelector.fromField.store.filterBy(function(rec) {
            if(rec.data.name.search(new RegExp(field.getValue(), "i")) !== -1) {
                return true;
            }
        });

        this.enzymeSelector.fromField.bindStore(this.enzymeSelector.fromField.store);
    },

     /**
      * Resorts the enzyme lists
      */
     onEnzymeListChange: function(){
//         this.enzymeSelector.fromField.boundList.getStore().sort("name", "ASC");
         this.enzymeSelector.toField.boundList.getStore().sort("name", "ASC");
     },

     /**
      * Initializing after login
      */
     onLoggedIn: function() {
         this.GroupManager.initActive();
     },
     
     /**
     * Saves the current user group to a new group.
     */
    onSaveGroupButtonClick: function() {
        this.saveGroupPrompt();
    },

     /**
     * Shows a prompt for naming the group
     */
    saveGroupPrompt: function() {
        return Ext.MessageBox.prompt("Group Name", "Please enter a unique group name:", this.onSaveGroupPrompt, this);
    },
    
    /**
     * Handler for the save group prompt
     */
    onSaveGroupPrompt: function(pBtnId, pText) {
        if (pBtnId==="ok") {
            if (this.userEnzymeGroupSelector.findRecordByValue(pText)) {
                // Name is not unique so show prompt again.
                var msgbox = this.saveGroupPrompt();
                // For some reason the prompt will be placed behind the manager window.
                // This is a hacky way of moving the prompt but for some reason accessing the Ext.WindowManager
                // here does not work.
                Ext.defer(function () {
                    msgbox.zIndexManager.bringToFront(msgbox);
                }, 100);
            }
            else {
                this.GroupManager.copyUserGroup(this.userEnzymeGroupSelector.getValue(), pText);
                this.userEnzymeGroupSelector.setValue(pText);
            }
        }
    },
    
    /**
     * Deletes the currently shown user enzyme group.
     */
    onDeleteGroupButtonClick: function() {
        var name = this.userEnzymeGroupSelector.getValue();
        this.GroupManager.removeUserGroup(name);
        this.userEnzymeGroupSelector.setValue(this.GroupManager.ACTIVE);
    },

    /**
     * Makes active the currently shown user enzyme group.
     */
    onMakeActiveButtonClick: function() {
        this.GroupManager.makeActive(this.userEnzymeGroupSelector.getValue());
    },
        
    /**
     * Saves to database, fires event and closes the window.
     */
    onOKButtonClick: function() {
//        var names = [];
//        this.enzymeSelector.toField.store.each(function(obj) {
//            names.push(obj.data.name);
//        });
//        var newActiveGroup = this.GroupManager.createGroupByEnzymes("active",
//                                                                    names);
        this.managerWindow.close();

        if(newActiveGroup !== this.GroupManager.getActiveGroup()){
            this.GroupManager.setActiveGroup(newActiveGroup);
            this.application.fireEvent("ActiveEnzymesChanged");
        }
    },
    
    /**
     * Closes the window and does not save to database.
     */
    onCancelButtonClick: function() {
        this.managerWindow.close();
    }
});
