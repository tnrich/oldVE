Ext.define('Vede.controller.MainMenuController', {
    extend: 'Ext.app.Controller',

    requires: 'Teselagen.bio.parsers.GenbankManager',

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

        var seqMgr;
        var that = this;

        function processText() {
            var result  = fr.result;
            //var gbm     = Ext.create('Teselagen.bio.parsers.GenbankManager');
            //var gb      = gbm.parseGenbankFile(result);
            var gb      = Teselagen.bio.parsers.GenbankManager.parseGenbankFile(result);
            seqMgr  = Ext.create("Teselagen.manager.SequenceManager", {}); 
            seqMgr.fromGenbank(gb);
            that.application.fireEvent("SequenceManagerCreated", seqMgr);
            console.log(gb.toString());
            console.log(seqMgr.getName());
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

        onSimulateDigestionMenuItemClick: function() {
        console.log("called");
        var simulateDigestionWindow = Ext.create("Vede.view.SimulateDigestionWindow");
        simulateDigestionWindow.show();
        simulateDigestionWindow.center();
        this.application.fireEvent("SimulateDigestionWindowOpened", simulateDigestionWindow);
    },

    onRestrictionEnzymesManagerMenuItemClick: function() {
        var restrictionEnzymesManagerWindow = Ext.create(
            "Vede.view.RestrictionEnzymesManagerWindow");

        restrictionEnzymesManagerWindow.show();
        restrictionEnzymesManagerWindow.center();

        this.application.fireEvent("RestrictionEnzymeManagerOpened",
                                   restrictionEnzymesManagerWindow);
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
            },
            "#restrictionEnzymesManagerMenuItem": {
                click: this.onRestrictionEnzymesManagerMenuItemClick
            },
        });

        this.application.on("SequenceManagerCreated", this.onSequenceManagerCreated); 
    },

    onSequenceManagerCreated: function(seqMgr) {
        //alert("sequence manager created yay");
    }

});
