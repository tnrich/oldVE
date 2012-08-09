Ext.define('Vede.controller.MainToolbarController', {
    extend: 'Ext.app.Controller',

    onFeaturesButtonClick: function(button, e, options) {
        var menuItem = Ext.ComponentQuery.query('#featuresMenuItem')[0];
        if (button.pressed) {
            menuItem.setChecked(true, false);
        }
        else {
            menuItem.setChecked(false, false);
        }
    },

    onREButtonClick: function() {
        var restrictionEnzymesManagerWindow = Ext.create(
            "Vede.view.RestrictionEnzymesManagerWindow");

        restrictionEnzymesManagerWindow.show();
        restrictionEnzymesManagerWindow.center();

        this.application.fireEvent("RestrictionEnzymeManagerOpened",
                                   restrictionEnzymesManagerWindow);
    },
    
//    onLinearViewBtnClick: function() {
//        var linearViewManagerWindow = Ext.create(
//                "Vede.view.rail.LinearViewManagerWindow");
//        
//        linearViewManagerWindow.show();
//        
//        this.application.fireEvent("LinearViewManagerOpened,"
//                                    linearViewManagerWindow);
//    },

    init: function() {
        this.control({
            "#featuresBtn": {
                click: this.onFeaturesButtonClick
            },
            "#reBtn": {
                click: this.onREButtonClick
            },
//            "#linearViewBtn": {
//                click: this.onLinearViewBtnClick
//            }
        });
    }

});
