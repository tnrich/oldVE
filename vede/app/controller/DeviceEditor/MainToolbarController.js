/**
 * Main toolbar controller
 * @class Vede.controller.DeviceEditor.MainToolbarController
 */
Ext.define('Vede.controller.DeviceEditor.MainToolbarController', {
    extend: 'Ext.app.Controller',

    requires: ["Teselagen.event.DeviceEvent",
               "Teselagen.manager.DeviceDesignManager",
               "Teselagen.manager.DeviceDesignParsersManager"],

    DeviceDesignManager: null,
    DeviceEvent: null,

    onAddRowClick: function() {
        this.application.fireEvent(this.DeviceEvent.ADD_ROW, null);
    },

    onAddColumnClick: function() {
        this.application.fireEvent(this.DeviceEvent.ADD_COLUMN);
    },

    onOpenj5Click: function(button, e, options) {
        Vede.application.fireEvent("openj5");
    },

    onImportBtnChange: function(pBtn){
        if (typeof window.FileReader !== 'function') {
            Ext.Msg.alert('Browser does not support File API.');
        }
        else {
            var fileInput = pBtn.extractFileInput();
            var file = fileInput.files[0];
            var ext = file.name.match(/^.*\.(genbank|gb|fas|fasta|xml|json)$/i);
            if (ext) {
                Ext.getCmp('mainAppPanel').getActiveTab().el.mask('Parsing File');
                var fr = new FileReader();
                fr.onload = this.onImportFileLoad.bind(this, file, ext[1]);
                fr.onerror = this.onImportFileError;
                fr.readAsText(file);
            }
            else {
                Ext.MessageBox.alert('Error', 'Invalid file format');
            }
        }
    },

    onImportFileLoad: function(pFile, pExt, pEvt) {
        //try
        //{
          if(pExt === 'json' || pExt === 'JSON') Teselagen.manager.DeviceDesignParsersManager.parseJSON(pEvt.target.result,pFile.name);
          else if(pExt === 'xml' || pExt === 'XML') Teselagen.manager.DeviceDesignParsersManager.parseXML(pEvt.target.result,pFile.name);
          else Ext.MessageBox.alert('Error', 'Invalid file format');
        //}
        //catch(exception)
        //{
        //    console.log(exception);
        //    Ext.MessageBox.alert('Error', "Error parsing file");
        //    Ext.getCmp('mainAppPanel').getActiveTab().el.unmask();
        //}
    },

    onImportEugeneRulesFileLoad: function(pFile, pExt, pEvt) {
        //try
        //{
            var design = Ext.getCmp('mainAppPanel').getActiveTab().model;
            Teselagen.manager.DeviceDesignParsersManager.parseEugeneRules(pEvt.target.result,pFile.name,design);
        //}
        //catch(exception)
        //{
        //    console.log(exception);
        //    Ext.MessageBox.alert('Error', "Error parsing file");
        //    Ext.getCmp('mainAppPanel').getActiveTab().el.unmask();
        //}
    },

    onImportEugeneRulesBtnChange: function(pBtn){
        if (typeof window.FileReader !== 'function') {
            Ext.Msg.alert('Browser does not support File API.');
        }
        else {
            var fileInput = pBtn.extractFileInput();
            var file = fileInput.files[0];
            var ext = file.name.match(/^.*\.(eug)$/i);
            if (ext) {
                //Ext.getCmp('mainAppPanel').getActiveTab().el.mask('Loading Eugene Rules');
                var fr = new FileReader();
                fr.onload = this.onImportEugeneRulesFileLoad.bind(this, file, ext[1]);
                fr.onerror = this.onImportFileError;
                fr.readAsText(file);
            }
            else {
                Ext.MessageBox.alert('Error', 'Invalid file format');
            }
        }
    },

    init: function() {
        this.control({
            "button[cls='add_row_Btn']": {
                click: this.onAddRowClick
            },
            "button[cls='add_column_Btn']": {
                click: this.onAddColumnClick
            },
            "button[cls='j5_init_Btn']": {
                click: this.onOpenj5Click
            },
            "filefield[cls='DEimportBtn']": {
                change: this.onImportBtnChange
            },
            "button[cls='fileMenu'] menu filefield": {
                change: this.onImportEugeneRulesBtnChange
            }
        });

        this.DeviceDesignManager = Teselagen.manager.DeviceDesignManager;
        this.DeviceEvent = Teselagen.event.DeviceEvent;
    }
});
