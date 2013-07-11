/**
 * Main toolbar controller
 * @class Vede.controller.VectorEditor.MainToolbarController
 */
Ext.define('Vede.controller.VectorEditor.MainToolbarController', {
    extend: 'Ext.app.Controller',

    requires: ['Teselagen.event.VisibilityEvent',
               'Teselagen.manager.ProjectManager',
               'Teselagen.bio.parsers.GenbankManager',
               'Vede.view.ve.RestrictionEnzymesManagerWindow'],

    MenuItemEvent: null,
    VisibilityEvent: null,

    onTabChange: function(mainAppPanel, newTab, oldTab) {
        this.activeTab = newTab;
    },

    onImportBtnChange: function(pBtn) {
        // This will be refactored into a manager (Teselagen.Utils.FileUtils.js).
        // Change this at a later date when that class is tested. --DW 10.17.2012
        if (typeof window.FileReader !== 'function') {
            Ext.Msg.alert('Browser does not support File API.');
        }
        else {
            var fileInput = pBtn.extractFileInput();
            var file = fileInput.files[0];
            var ext = file.name.match(/^.*\.(genbank|gb|fas|fasta|xml|json)$/i);
            if (ext) {
                Ext.getCmp('mainAppPanel').getActiveTab().el.mask('Parsing File', "loader rspin");
                $(".loader").html("<span class='c'></span><span class='d spin'><span class='e'></span></span><span class='r r1'></span><span class='r r2'></span><span class='r r3'></span><span class='r r4'></span>");

                var fr = new FileReader();
                fr.onload = this.onImportFileLoad.bind(this, file, ext[1]);
                fr.onerror = this.onImportFileError;
//              fr.onprogress = importFileProgress; // Unimplemented handler to show load progress
                fr.readAsText(file);
            }
            else {
                Ext.MessageBox.alert('Error', 'Invalid file format');
            }
        }
    },

    onImportFileLoad: function(pFile, pExt, pEvt) {
        Vede.application.fireEvent("ImportFileToSequence",pFile, pExt, pEvt,Teselagen.manager.ProjectManager.workingSequence);
    },

    onImportFileError: function(pEvt) {
        var err = pEvt.target.error;
        if (err) {
            throw err;
        }
    },

    onCircularViewButtonClick: function(button, e, options) {
        var viewMode;

        viewMode = "circular";

        this.application.fireEvent("ViewModeChanged", viewMode);
    },

    onUndoButtonClick: function() {
        this.application.fireEvent(this.MenuItemEvent.UNDO);
    },

    onRedoButtonClick: function() {
        this.application.fireEvent(this.MenuItemEvent.REDO);
    },

    onFindButtonClick: function() {
        this.application.fireEvent(this.MenuItemEvent.FIND_PANEL_OPENED);
    },

    onFeaturesButtonToggle: function(button, pressed, options) {
        var checkitems = Ext.ComponentQuery.query("menucheckitem[identifier='featuresMenuItem']");
        var buttons = Ext.ComponentQuery.query("button[cls='featuresBtn']");

        for(var i = 0; i < buttons.length; i++) {
            buttons[i].toggle(checked, true);
        }

        for(i = 0; i < checkitems.length; i++) {
            checkitems[i].setChecked(checked, true);
        }

        this.application.fireEvent(this.VisibilityEvent.SHOW_FEATURES_CHANGED,
                                   pressed);
    },

    onCutSitesButtonToggle: function(button, pressed, options) {
        var checkitems = Ext.ComponentQuery.query("menucheckitem[identifier='cutSitesMenuItem']");
        var buttons = Ext.ComponentQuery.query("button[cls='cutSitesBtn']");

        for(var i = 0; i < buttons.length; i++) {
            buttons[i].toggle(checked, true);
        }

        for(i = 0; i < checkitems.length; i++) {
            checkitems[i].setChecked(checked, true);
        }

        this.application.fireEvent(this.VisibilityEvent.SHOW_CUTSITES_CHANGED,
                                   pressed);
    },

    onOrfsButtonToggle: function(button, pressed, options) {
        var checkitems = Ext.ComponentQuery.query("menucheckitem[identifier='orfsMenuItem']");
        var buttons = Ext.ComponentQuery.query("button[cls='orfsBtn']");

        for(var i = 0; i < buttons.length; i++) {
            buttons[i].toggle(checked, true);
        }

        for(i = 0; i < checkitems.length; i++) {
            checkitems[i].setChecked(checked, true);
        }

        this.application.fireEvent(this.VisibilityEvent.SHOW_ORFS_CHANGED,
                                   pressed);
    },

    onREButtonClick: function() {
        var restrictionEnzymesManagerWindow = Ext.create(
            "Vede.view.ve.RestrictionEnzymesManagerWindow");

        restrictionEnzymesManagerWindow.show();
        restrictionEnzymesManagerWindow.center();

        this.application.fireEvent("RestrictionEnzymeManagerOpened",
                                   restrictionEnzymesManagerWindow);
    },

    onLinearViewBtnClick: function(button, e, options) {
        var viewMode;

        viewMode = "linear";

        this.application.fireEvent("ViewModeChanged", viewMode);
    },

    onViewModeChanged: function(viewMode) {
        var circularButtons = Ext.ComponentQuery.query("button[cls='circularBtn']");
        var linearButtons = Ext.ComponentQuery.query("button[cls='linearBtn']");

        if(viewMode == "linear") {
            for(var i = 0; i < circularButtons.length; i++) {
                circularButtons[i].toggle(false, true);
                linearButtons[i].toggle(true, true);
            }
        } else {
            for(var i = 0; i < circularButtons.length; i++) {
                circularButtons[i].toggle(true, true);
                linearButtons[i].toggle(false, true);
            }
        }
    },

    onSaveToRegistryButtonClick: function(){
        Ext.create("Vede.view.SaveToRegistryWindow").show();
    },

    onSaveToRegistryConfirmationButtonClick: function(button, e, options) {
        var form = button.up('form').getForm();
        var name = form.findField('Name');
        console.log(name.value);
        var gbMng = Teselagen.bio.parsers.GenbankManager;
        //console.log(gbMng.);
    },

    hidePanels: function(){
        //Ext.getCmp('AnnotatePanel').collapse();
        Ext.getCmp('ProjectPanel').hide();
        //Ext.get('headerPanel').hide();
        //Ext.get('VectorEditorMainMenuPanel').hide();
        Ext.each(Ext.ComponentQuery.query("component[cls='VectorEditorStatusPanel']"), function(panel) {
            panel.hide();
        });
        Ext.each(Ext.ComponentQuery.query("component[cls='FindPanel']"), function(panel) {
            panel.hide();
        });
    },

    showPanels: function(){
        //Ext.getCmp('AnnotatePanel').expand();
        Ext.getCmp('ProjectPanel').show();
        //Ext.get('headerPanel').show();
        //Ext.get('VectorEditorMainMenuPanel').show();
        Ext.each(Ext.ComponentQuery.query("component[cls='VectorEditorStatusPanel']"), function(panel) {
            panel.show();
        });
        /*Ext.each(Ext.ComponentQuery.query("component[cls='FindPanel']"), function(panel) {
            panel.show();
        });*/
    },

    registerFullScreenEventListener: function(){
        var self = this;

        document.addEventListener("fullscreenchange", function () {
            if(!(document.fullscreenElement)) self.showPanels();
            else self.hidePanels();
        }, false);
        
        document.addEventListener("mozfullscreenchange", function () {
            if(!(document.mozFullScreen)) self.showPanels();
            else self.hidePanels();
        }, false);
        
        document.addEventListener("webkitfullscreenchange", function () {
            if(!(document.webkitIsFullScreen)) self.showPanels();
            else self.hidePanels();
        }, false);
    },

    onFullscreenButtonClick: function(){

        if(document.fullscreenElement || document.mozFullScreen || document.webkitIsFullScreen)
        {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
            else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            }
            else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            }
        }
        else
        {
            var docElm = document.documentElement;
            if (docElm.requestFullscreen) {
                docElm.requestFullscreen();
            }
            else if (docElm.mozRequestFullScreen) {
                docElm.mozRequestFullScreen();
            }
            else if (docElm.webkitRequestFullScreen) {
                docElm.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
            }
        }
    },

    init: function() {
        this.MenuItemEvent = Teselagen.event.MenuItemEvent;
        this.VisibilityEvent = Teselagen.event.VisibilityEvent;

        this.control({
            "#mainAppPanel": {
                tabchange: this.onTabChange
            },
            "component[cls='importSequenceBtn']": {
                change: this.onImportBtnChange
            },
            "filefield[text='Import File']": {
                change: this.onImportBtnChange
            },
            "button[cls='undoBtn']": {
                click: this.onUndoButtonClick
            },
            "button[cls='redoBtn']": {
                click: this.onRedoButtonClick
            },
            "button[cls='findBtn']": {
                click: this.onFindButtonClick
            },
            "button[cls='featuresBtn']": {
                toggle: this.onFeaturesButtonToggle
            },
            "button[cls='cutSitesBtn']": {
                toggle: this.onCutSitesButtonToggle
            },
            "button[cls='orfsBtn']": {
                toggle: this.onOrfsButtonToggle
            },
            "button[cls='reBtn']": {
                click: this.onREButtonClick
            },
            "button[cls='circularBtn']": {
                click: this.onCircularViewButtonClick
            },
            "button[cls='linearBtn']": {
                click: this.onLinearViewBtnClick
            },
            "button[cls='exportBtn']": {
//                click: this.onSaveToRegistryButtonClick
            },
            "#saveToRegistryConfirmation": {
                click: this.onSaveToRegistryConfirmationButtonClick
            },
            "button[cls='fullscreenBtn']": {
                click: this.onFullscreenButtonClick
            },
        });

        this.application.on("ViewModeChanged", this.onViewModeChanged, this);
        this.registerFullScreenEventListener();
    }

});
