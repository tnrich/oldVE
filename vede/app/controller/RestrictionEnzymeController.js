/**
 * Restriction enzyme controller
 * @class Vede.controller.RestrictionEnzymeController
 * @ignore
 * @author Nick Elsbree
 */
Ext.define("Vede.controller.RestrictionEnzymeController", {
    extend: "Ext.app.Controller",

    requires: ["Teselagen.event.AuthenticationEvent", "Teselagen.manager.RestrictionEnzymeGroupManager",
               "Teselagen.manager.UserManager", "Vede.view.RestrictionEnzymesManagerWindow"],

    GroupManager: null,
    UserManager: null,
    managerWindow: null,

    enzymeSelector: null,
    userEnzymeGroupSelector: null,
    
    refs: [{ref:"deleteGroupBtn", selector:"button[cls=deleteGroupButton]"},
           {ref:"makeActiveBtn", selector:"button[cls=makeActiveButton]"},
           {ref:"enzymeGroupSelector", selector:"combobox[cls=enzymeGroupSelector]"},
           {ref:"userEnzymeGroupSelector", selector:"combobox[cls=userEnzymeGroupSelector]"},
           {ref:"enzymeSelector", selector:"itemselectorvede[cls=enzymeSelector]"}],
    
    init: function() {
        this.GroupManager = Teselagen.manager.RestrictionEnzymeGroupManager;
        this.UserManager = Teselagen.manager.UserManager;

        this.control({
            "combobox[cls=enzymeGroupSelector]": {
                change: this.onEnzymeGroupChange
            },
            "combobox[cls=userEnzymeGroupSelector]": {
                change: this.onUserEnzymeGroupChange
            },
            "textfield[cls=enzymeSearchField]": {
                keyup: this.onEnzymeSearchFieldKeyup
            },
            "itemselectorvede[cls=enzymeSelector]": {
                 change: this.onEnzymeListChange
             },
            "button[cls=restrictionEnzymesManagerSaveButton]": {
                click: this.onSaveButtonClick
            },
            "button[cls=restrictionEnzymesManagerCancelButton]": {
                click: this.onCancelButtonClick
            },
            "button[cls=newGroupButton]": {
                click: this.onNewGroupButtonClick
            },
            "button[cls=copyGroupButton]": {
                click: this.onCopyGroupButtonClick
            },
            "button[cls=deleteGroupButton]": {
                click: this.onDeleteGroupButtonClick
            },
            "button[cls=makeActiveButton]": {
                click: this.onMakeActiveButtonClick
            },
             "window[cls=restrictionEnzymeManager]": {
                 close: this.onWindowClose
             }
        });

        var listeners = {
            RestrictionEnzymeManagerOpened: this.onEnzymeManagerOpened,
            scope: this
        };
        this.application.on(listeners);
    },
    
    /**
     * Populates the group selector combobox when the restriction enzyme
     * manage window is opened.
     */
    onEnzymeManagerOpened: function(manager) {
        var me = this;
        this.managerWindow = manager;
        this.enzymeSelector = this.getEnzymeSelector();
        var groupSelector = this.getEnzymeGroupSelector();
        
        this.UserManager.loadUser(function(pSuccess) {
            if (pSuccess) {
                if(!me.GroupManager.getIsInitialized()) {
                    me.GroupManager.initialize();
                }
                me.GroupManager.setActiveEnzymesChanged(false);


                Ext.each(me.GroupManager.getGroupNames(), function(name) {
                    groupSelector.store.add({name: name});
                });

                // Set the value in the combobox to the first element by default.
                groupSelector.setValue(groupSelector.store.getAt("0").get("name"));

                // Load data into the enzyme selector.
                var startGroup = me.GroupManager.groupByName(groupSelector.getValue());
                var groupArray = [];
                Ext.each(startGroup.getEnzymes(), function(enzyme) {
                    groupArray.push({name: enzyme.getName()});
                });
                me.enzymeSelector.store.loadData(groupArray);
                me.enzymeSelector.bindStore(me.enzymeSelector.store);

                // Set user enzyme selector
                me.GroupManager.initActiveUserGroup();
                me.userEnzymeGroupSelector = me.getUserEnzymeGroupSelector();
                me.userEnzymeGroupSelector.bindStore(me.UserManager.getUser().userRestrictionEnzymeGroups());
                me.userEnzymeGroupSelector.setValue(me.GroupManager.ACTIVE);
            }
            else {
                console.error("Error launching Restriction Enzyme Manager");
            }
        });

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
      * When the enzyme list is changed.
      */
     onEnzymeListChange: function(pThis, pNewValue, pOldValue){
         this.enzymeSelector.toField.boundList.getStore().sort("name", "ASC");
         if (this.userEnzymeGroupSelector.getValue()===this.GroupManager.ACTIVE) {
             this.GroupManager.setActiveEnzymesChanged(true);
         }
     },

     /**
     * Copies the current user group to a new group.
     */
    onCopyGroupButtonClick: function() {
        this.groupPrompt(false);
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
     * Saves to database and closes the window.
     */
    onSaveButtonClick: function() {
//        var names = [];
//        this.enzymeSelector.toField.store.each(function(obj) {
//            names.push(obj.data.name);
//        });
//        var newActiveGroup = this.GroupManager.createGroupByEnzymes("active",
//                                                                    names);
        this.managerWindow.close();
        this.UserManager.update(function(pSuccess) {
            if (!pSuccess) {
                console.warn("Unable to save restriction enzymes");
            }
        });

//        if(newActiveGroup !== this.GroupManager.getActiveGroup()){
//            this.GroupManager.setActiveGroup(newActiveGroup);
//            this.application.fireEvent("ActiveEnzymesChanged");
//        }
    },
    
    /**
     * Closes the window and does not save to database.
     */
    onCancelButtonClick: function() {
        this.managerWindow.close();
    },
    
     /**
     * Creates a new user group.
     */
    onNewGroupButtonClick: function() {
        this.groupPrompt(true);
    },

     /**
     * Shows a prompt for naming the group
     */
    groupPrompt: function(pIsNew) {
        return Ext.MessageBox.prompt("Group Name", "Please enter a unique group name:", this.onGroupPrompt.bind(this, pIsNew), this);
    },
    
    /**
     * Handler for the group prompt
     * @param {Boolean} isNew True if creating a new group
     * @param {String} btnId "ok" or "cancel"
     * @param {String} text Group name entered
     */
    onGroupPrompt: function(pIsNew, pBtnId, pText) {
        if (pBtnId==="ok") {
            if (!pText || this.userEnzymeGroupSelector.findRecordByValue(pText)) {
                // Name is not unique so show prompt again.
                var msgbox = this.groupPrompt();
                // For some reason the prompt will be placed behind the manager window.
                // This is a hacky way of moving the prompt but for some reason accessing the Ext.WindowManager
                // here does not work.
                Ext.defer(function () {
                    msgbox.zIndexManager.bringToFront(msgbox);
                }, 100);
            }
            else {
                if (pIsNew) {
                    this.GroupManager.createUserGroup(pText, []);
                }
                else {
                    this.GroupManager.copyUserGroup(this.userEnzymeGroupSelector.getValue(), pText);
                }
                this.userEnzymeGroupSelector.setValue(pText);
            }
        }
    },

    /**
     * After window is closed.
     */
    onWindowClose: function() {
        if (this.GroupManager.getActiveEnzymesChanged()) {
            this.GroupManager.changeActiveGroup();
            this.application.fireEvent("ActiveEnzymesChanged");
        }
    }
});
