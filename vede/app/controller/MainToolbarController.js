Ext.define('Vede.controller.MainToolbarController', {
    extend: 'Ext.app.Controller',

    requires: ["Teselagen.event.VisibilityEvent"],

    VisibilityEvent: null,

    onFeaturesButtonClick: function(button, e, options) {
        var menuItem = Ext.ComponentQuery.query('#featuresMenuItem')[0];
        if (button.pressed) {
            menuItem.setChecked(true, true);
        }
        else {
            menuItem.setChecked(false, true);
        }

        this.application.fireEvent(this.VisibilityEvent.SHOW_FEATURES_CHANGED,
                                   button.pressed);
    },

    onCutSitesButtonClick: function(button, e, options) {
        var menuItem = Ext.ComponentQuery.query('#cutSitesMenuItem')[0];
        if (button.pressed) {
            menuItem.setChecked(true, true);
        }
        else {
            menuItem.setChecked(false, true);
        }
        this.application.fireEvent(this.VisibilityEvent.SHOW_CUTSITES_CHANGED,
                                   button.pressed);
    },

    onOrfsButtonClick: function(button, e, options) {
        var menuItem = Ext.ComponentQuery.query('#orfsMenuItem')[0];
        if (button.pressed) {
            menuItem.setChecked(true, true);
        }
        else {
            menuItem.setChecked(false, true);
        }
        this.application.fireEvent(this.VisibilityEvent.SHOW_ORFS_CHANGED,
                                   button.pressed);
    },

    onREButtonClick: function() {
        var restrictionEnzymesManagerWindow = Ext.create(
            "Vede.view.RestrictionEnzymesManagerWindow");

        restrictionEnzymesManagerWindow.show();
        restrictionEnzymesManagerWindow.center();

        this.application.fireEvent("RestrictionEnzymeManagerOpened",
                                   restrictionEnzymesManagerWindow);
    },

    init: function() {
        this.control({
            "#featuresBtn": {
                click: this.onFeaturesButtonClick
            },
            "#cutsitesBtn": {
                click: this.onCutSitesButtonClick
            },
            "#orfsBtn": {
                click: this.onOrfsButtonClick
            },
            "#reBtn": {
                click: this.onREButtonClick
            }
        });

        this.VisibilityEvent = Teselagen.event.VisibilityEvent;
    }

});
