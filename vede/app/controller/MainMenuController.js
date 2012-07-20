Ext.define('Vede.controller.MainMenuController', {
    extend: 'Ext.app.Controller',

    onCancelButtonClick: function(button, e, options) {
        button.up('window').close();
    },

    onImportButtonClick: function(button, e, options) {
        if (typeof window.FileReader !== 'function') {
            Ext.Msg.alert('Browser does not support File API.');
        }
        else {
            var form = button.up('form').getForm();
            var fileField = form.findField('importedFile');
            var fileInput = fileField.extractFileInput();
            var file = fileInput.files[0];
            fr = new FileReader();
            fr.onload = processText;
            fr.readAsText(file);
        }
        button.up('window').close();

        function processText() {
            var result = fr.result;
            var gbm = Ext.create('Teselagen.bio.parsers.GenbankManager');
            var gb = gbm.parseGenbankFile(result);
            console.log(gb);
        }
    },

    onImportMenuItemClick: function(item, e, options) {
        Ext.create("Vede.view.FileImportWindow").show();
    },

    onFeaturesMenuItemCheckChange: function(menucheckitem, checked, options) {
        var btn = Ext.ComponentQuery.query('#featuresBtn')[0];
        if (checked) {
            btn.toggle(true);
        }
        else {
            btn.toggle(false);
        }

    },

        onSimulateDigestionMenuItemClick: function(item, e, options) {
        console.log("called");
        var simulateDigestionWindow = Ext.create("Vede.view.SimulateDigestionWindow");
        simulateDigestionWindow.show();
        simulateDigestionWindow.center();

    },


    init: function() {
        this.control({
            "button[text=Cancel]": {
                click: this.onCancelButtonClick
            },
            "button[text='Import']": {
                click: this.onImportButtonClick
            },
            "#importMenuItem": {
                click: this.onImportMenuItemClick
            },
            "#featuresMenuItem": {
                checkchange: this.onFeaturesMenuItemCheckChange
            },

                    "#simulateDigestionMenuItem": {
                click: this.onSimulateDigestionMenuItemClick
            }
        });

    }

});
