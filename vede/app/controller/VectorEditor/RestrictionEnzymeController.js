/**
 * Restriction enzyme controller
 * @class Vede.controller.RestrictionEnzymeController
 * @ignore
 * @author Nick Elsbree
 */
Ext.define("Vede.controller.VectorEditor.RestrictionEnzymeController", {
    extend: "Ext.app.Controller",

    requires: ["Teselagen.event.AuthenticationEvent", "Teselagen.manager.RestrictionEnzymeGroupManager",
               "Teselagen.manager.UserManager", "Vede.view.ve.RestrictionEnzymesManagerWindow"],

    GroupManager: null,
    Logger: null,
    UserManager: null,

    refs: [{ref:"deleteGroupBtn", selector:"button[cls=deleteGroupButton]"},
           {ref:"makeActiveBtn", selector:"button[cls=makeActiveButton]"},
           {ref:"enzymeGroupSelector", selector:"combobox[cls=enzymeGroupSelector]"},
           {ref:"userEnzymeGroupSelector", selector:"combobox[cls=userEnzymeGroupSelector]"},
           {ref:"enzymeSelector", selector:"itemselectorvede[cls=enzymeSelector]"}],

    init: function() {
        this.GroupManager = Teselagen.manager.RestrictionEnzymeGroupManager;
        this.Logger = Teselagen.utils.Logger;
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

        listeners[Teselagen.event.AuthenticationEvent.LOGGED_IN] = this.onLoggedIn;

        this.application.on(listeners);
    },

    /**
     * Populates the group selector combobox when the restriction enzyme
     * manage window is opened.
     */
    onEnzymeManagerOpened: function() {
        var me = this;
        var enzymeSelector = this.getEnzymeSelector();
        var groupSelector = this.getEnzymeGroupSelector();
        var userEnzymeGroupSelector = this.getUserEnzymeGroupSelector();

        if(!me.GroupManager.getIsInitialized()) {
            me.GroupManager.initialize();
        }

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

        enzymeSelector.store.loadData(groupArray);
        enzymeSelector.bindStore(enzymeSelector.store);

        // Set user enzyme selector
        me.GroupManager.initActiveUserGroup();
        userEnzymeGroupSelector.bindStore(me.UserManager.getUser().userRestrictionEnzymeGroups());
        userEnzymeGroupSelector.setValue(me.GroupManager.ACTIVE);
    },

    /**
     * Initializing after login
     */
    onLoggedIn: function() {
         this.GroupManager.initActiveUserGroup();
    },

    /**
     * Populates the itemselector fromField with enzyme names.
     * Called when the user selects a new group in the combobox.
     */
    onEnzymeGroupChange: function(combobox) {
        var newGroup = this.GroupManager.groupByName(combobox.getValue());
        var enzymeArray = [];
        var enzymeSelector = this.getEnzymeSelector();

        Ext.each(newGroup.getEnzymes(), function(enzyme) {
            enzymeArray.push({name: enzyme.getName()});
        });
        var fromStore = enzymeSelector.fromField.getStore();
        fromStore.loadData(enzymeArray);
        fromStore.sort("name", "ASC");
    },

    /**
     * Populates the itemselector toField with enzyme names.
     * Called when the user selects a new group in the combobox.
     */
    onUserEnzymeGroupChange: function(combobox) {
        var groupName = combobox.getValue();
        var record = combobox.findRecordByValue(groupName);
        var enzymeSelector = this.getEnzymeSelector();
        enzymeSelector.toField.bindStore(record.userRestrictionEnzymes());
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
        var enzymeSelector = this.getEnzymeSelector();
        enzymeSelector.fromField.store.filterBy(function(rec) {
            if(rec.data.name.search(new RegExp(field.getValue(), "i")) !== -1) {
                return true;
            }
        });

        enzymeSelector.fromField.bindStore(enzymeSelector.fromField.store);
    },

     /**
      * When the enzyme list is changed.
      */
     onEnzymeListChange: function(){
         var enzymeSelector = this.getEnzymeSelector();
         var userEnzymeGroupSelector = this.getUserEnzymeGroupSelector();

         enzymeSelector.toField.boundList.getStore().sort("name", "ASC");

         if(userEnzymeGroupSelector.getValue() === this.GroupManager.ACTIVE) {
             this.GroupManager.removeUserGroup(this.GroupManager.ACTIVE);
             this.GroupManager.createUserGroup(this.GroupManager.ACTIVE,
                                               enzymeSelector.toField.boundList.getStore().collect("name"));

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
        var userEnzymeGroupSelector = this.getUserEnzymeGroupSelector();
        var name = userEnzymeGroupSelector.getValue();
        this.GroupManager.removeUserGroup(name);
        userEnzymeGroupSelector.setValue(this.GroupManager.ACTIVE);
    },

    /**
     * Makes active the currently shown user enzyme group.
     */
    onMakeActiveButtonClick: function() {
        var userEnzymeGroupSelector = this.getUserEnzymeGroupSelector();
        this.GroupManager.makeActive(userEnzymeGroupSelector.getValue());
    },

    /**
     * Saves to database and closes the window.
     */
    onSaveButtonClick: function() {
        var me = this;
        this.GroupManager.saveUserGroups(function(pSuccess) {
            if (pSuccess) {
                me.Logger.notifyInfo("User enzyme groups saved");
            }
        });
    },

    /**
     * Closes the window and does not save to database.
     */
    onCancelButtonClick: function(pBtn) {
        pBtn.up("window").close();
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
        var userEnzymeGroupSelector = this.getUserEnzymeGroupSelector();
        if (pBtnId==="ok") {
            var foundRec = userEnzymeGroupSelector.findRecordByValue(pText);
            if (!pText || foundRec) {
                if (foundRec) {
                    this.Logger.notifyWarn(Ext.String.format("The group '{0}' already exists.", pText));
                }
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
                    this.GroupManager.copyUserGroup(userEnzymeGroupSelector.getValue(), pText);
                }
                userEnzymeGroupSelector.setValue(pText);
            }
        }
    },

     /**
     * After window is closed.
     */
    onWindowClose: function() {
        // Reload user to rollback any unsaved changes
        this.GroupManager.loadUserGroups();
    }
});
