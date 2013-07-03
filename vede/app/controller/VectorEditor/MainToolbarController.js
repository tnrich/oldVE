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

        if (button.pressed) {
            viewMode = "circular";
        }
        else {
            viewMode = "linear";
        }

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
        var menuItem = Ext.ComponentQuery.query('#featuresMenuItem')[0];
        if (pressed) {
            menuItem.setChecked(true, true);
        }
        else {
            menuItem.setChecked(false, true);
        }

        this.application.fireEvent(this.VisibilityEvent.SHOW_FEATURES_CHANGED,
                                   pressed);
    },

    onCutSitesButtonToggle: function(button, pressed, options) {
        var menuItem = Ext.ComponentQuery.query('#cutSitesMenuItem')[0];
        if (pressed) {
            menuItem.setChecked(true, true);
        }
        else {
            menuItem.setChecked(false, true);
        }
        this.application.fireEvent(this.VisibilityEvent.SHOW_CUTSITES_CHANGED,
                                   pressed);
    },

    onOrfsButtonToggle: function(button, pressed, options) {
        var menuItem = Ext.ComponentQuery.query('#orfsMenuItem')[0];
        if (pressed) {
            menuItem.setChecked(true, true);
        }
        else {
            menuItem.setChecked(false, true);
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

        if (button.pressed) {
            viewMode = "linear";
        }
        else {
            viewMode = "circular";
        }

        this.application.fireEvent("ViewModeChanged", viewMode);
    },

    onViewModeChanged: function(viewMode) {
        var circularButton = Ext.getCmp("circularViewBtn");
        var linearButton = Ext.getCmp("linearViewBtn");

        if(viewMode == "linear") {
            circularButton.toggle(false, true);
            linearButton.toggle(true, true);
        } else {
            circularButton.toggle(true, false);
            linearButton.toggle(false, true);
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
        Ext.get("VectorEditorStatusPanel").hide();
        Ext.get("FindPanel").hide();        
    },

    showPanels: function(){
        //Ext.getCmp('AnnotatePanel').expand();
        Ext.getCmp('ProjectPanel').show();
        //Ext.get('headerPanel').show();
        //Ext.get('VectorEditorMainMenuPanel').show();
        Ext.get("VectorEditorStatusPanel").show();
        Ext.get("FindPanel").show();        
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
            "#importBtn": {
                change: this.onImportBtnChange
            },
            "#importSequenceMenuItem": {
                change: this.onImportBtnChange
            },
            "#circularViewBtn": {
                click: this.onCircularViewButtonClick
            },
            "#undoViewBtn": {
                click: this.onUndoButtonClick
            },
            "#redoViewBtn": {
                click: this.onRedoButtonClick
            },
            "#findBtn": {
                click: this.onFindButtonClick
            },
            "#featuresBtn": {
                toggle: this.onFeaturesButtonToggle
            },
            "#cutsitesBtn": {
                toggle: this.onCutSitesButtonToggle
            },
            "#orfsBtn": {
                toggle: this.onOrfsButtonToggle
            },
            "#reBtn": {
                click: this.onREButtonClick
            },
            "#linearViewBtn": {
                click: this.onLinearViewBtnClick
            },
            "#exportBtn": {
//                click: this.onSaveToRegistryButtonClick
            },
            "#saveToRegistryConfirmation": {
                click: this.onSaveToRegistryConfirmationButtonClick
            },
            "#fullscreen": {
                click: this.onFullscreenButtonClick
            },
        });

        this.application.on("ViewModeChanged", this.onViewModeChanged, this);
        this.registerFullScreenEventListener();
    }

});
