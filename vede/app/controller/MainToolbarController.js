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

    init: function() {
        this.control({
            "#featuresBtn": {
                click: this.onFeaturesButtonClick
            }
        });

    }

});
