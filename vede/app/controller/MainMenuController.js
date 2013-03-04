/**
 * Main menu controller
 * @class Vede.controller.MainMenuController
 */
Ext.define('Vede.controller.MainMenuController', {
    extend: 'Ext.app.Controller',

    requires: ['Teselagen.event.MenuItemEvent',
               'Teselagen.event.VisibilityEvent',
               'Teselagen.manager.ProjectManager',
               'Teselagen.utils.FormatUtils'],

    FormatUtils: null,
    MenuItemEvent: null,
    ProjectManager: null,
    VisibilityEvent: null,

    onUndoMenuItemClick: function() {
        this.application.fireEvent(this.MenuItemEvent.UNDO);
    },

    onRedoMenuItemClick: function() {
        this.application.fireEvent(this.MenuItemEvent.REDO);
    },

    onFindMenuItemClick: function() {
        this.application.fireEvent(this.MenuItemEvent.FIND_PANEL_OPENED);
    },

    onSelectMenuItemClick: function() {
        var selectWindow = Ext.create("Vede.view.SelectWindow");

        selectWindow.show();
        selectWindow.center();

        this.application.fireEvent(this.MenuItemEvent.SELECT_WINDOW_OPENED,
                                   selectWindow);
    },

    onSelectAllMenuItemClick: function() {
        this.application.fireEvent(this.MenuItemEvent.SELECT_ALL);
    },

    onSelectInverseMenuItemClick: function() {
        this.application.fireEvent(this.MenuItemEvent.SELECT_INVERSE);
    },

    onReverseComplementMenuItemClick: function() {
        this.application.fireEvent(this.MenuItemEvent.REVERSE_COMPLEMENT);
    },

    onRebaseMenuItemClick: function() {
        this.application.fireEvent(this.MenuItemEvent.REBASE_SEQUENCE);
    },

    onCancelButtonClick: function(button, e, options) {
        if(button.up('window')) {
            button.up('window').close();
        }
    },
    
    onImportMenuItemChange: function(pBtn) {
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
        pBtn.up("menu").hide();
    },
    
    onImportFileLoad: function(pFile, pExt, pEvt) {
        var result  = pEvt.target.result;
        var gb      = this.FormatUtils.fileToGenbank(result, pExt);
        var seqMgr = this.FormatUtils.genbankToSequenceManager(gb);
        //console.log(gb.toString());
        //console.log(seqMgr.getName());
        this.application.fireEvent("SequenceManagerChanged", seqMgr);
        var sequence = this.ProjectManager.workingSequence;
        sequence.set('sequenceFileContent',gb.toString());
        sequence.set('sequenceFileFormat',"GENBANK");
        sequence.set('sequenceFileName',pFile.name);
        var veproject = this.ProjectManager.workingVEProject;
        veproject.set('name',seqMgr.getName());
        var parttext = Ext.getCmp('VectorEditorStatusPanel').down('tbtext[id="VectorEditorStatusBarAlert"]');
        parttext.animate({duration: 1000, to: {opacity: 1}}).setText('Sequence Parsed Successfully');
        parttext.animate({duration: 5000, to: {opacity: 0}});
    },

    onImportFileError: function(pEvt) {
        var err = pEvt.target.error;
        if (err) {
            throw err;
        }
    },
    
    
//    onImportMenuItemClick: function(item, e, options) {
//        Vede.application.fireEvent("ImportFileToSequence",Teselagen.manager.ProjectManager.workingSequence);
//    },

    onCircularViewMenuItemCheckChange: function(menucheckitem, checked, options) {
        var viewMode;

        if (checked) {
            viewMode = "circular";
        }
        else {
            viewMode = "linear";
        }

        this.application.fireEvent("ViewModeChanged", viewMode);
    },

    onFeaturesMenuItemCheckChange: function(menucheckitem, checked, options) {
        var btn = Ext.ComponentQuery.query('#featuresBtn')[0];
        if (checked) {
            btn.toggle(true, true);
        }
        else {
            btn.toggle(false, true);
        }

        this.application.fireEvent(this.VisibilityEvent.SHOW_FEATURES_CHANGED,
                                   checked);
    },

    onCutSitesMenuItemCheckChange: function(menucheckitem, checked, options) {
        var btn = Ext.ComponentQuery.query("#cutsitesBtn")[0];
        if(checked) {
            btn.toggle(true, true);
        } else {
            btn.toggle(false, true);
        }
        
        this.application.fireEvent(this.VisibilityEvent.SHOW_CUTSITES_CHANGED,
                                   checked);
    },

    onOrfsMenuItemCheckChange: function(menucheckitem, checked, options) {
        var btn = Ext.ComponentQuery.query("#orfsBtn")[0];
        if(checked) {
            btn.toggle(true, true);
        } else {
            btn.toggle(false, true);
        }

        this.application.fireEvent(this.VisibilityEvent.SHOW_ORFS_CHANGED,
                                   checked);
    },

    onShowComplementaryMenuItemCheckChange: function(menucheckitem, checked) {
        this.application.fireEvent(this.VisibilityEvent.SHOW_COMPLEMENTARY_CHANGED,
                                   checked);
    },

    onShowSpacesMenuItemCheckChange: function(menucheckitem, checked) {
        this.application.fireEvent(this.VisibilityEvent.SHOW_SPACES_CHANGED,
                                   checked);
    },

    onShowSequenceAAMenuItemCheckChange: function(menucheckitem, checked) {
        this.application.fireEvent(this.VisibilityEvent.SHOW_SEQUENCE_AA_CHANGED,
                                   checked);
    },

    onShowRevcomAAMenuItemCheckChange: function(menucheckitem, checked) {
        this.application.fireEvent(this.VisibilityEvent.SHOW_REVCOM_AA_CHANGED,
                                   checked);
    },
    
    onFeatureLabelsMenuItemCheckChange: function(menucheckitem, checked) {
        this.application.fireEvent(this.VisibilityEvent.SHOW_FEATURE_LABELS_CHANGED,
                                   checked);
    },

    onCutSiteLabelsMenuItemCheckChange: function(menucheckitem, checked) {
        this.application.fireEvent(this.VisibilityEvent.SHOW_CUTSITE_LABELS_CHANGED,
                                   checked);
    },

    onSimulateDigestionMenuItemClick: function() {
        console.log("called");
        var simulateDigestionWindow = Ext.create("Vede.view.SimulateDigestionWindow");
        simulateDigestionWindow.show();
        simulateDigestionWindow.center();
        this.application.fireEvent("SimulateDigestionWindowOpened", simulateDigestionWindow);
    },    

    onCreateNewFeatureMenuItemClick: function() {
        var createNewFeatureWindow = Ext.create(
            "Vede.view.CreateNewFeatureWindow");

        createNewFeatureWindow.show();
        createNewFeatureWindow.center();

        this.application.fireEvent("RestrictionEnzymeManagerOpened",
                                   restrictionEnzymesManagerWindow);
    },

    onRestrictionEnzymesManagerMenuItemClick: function() {
        var restrictionEnzymesManagerWindow = Ext.create(
            "Vede.view.RestrictionEnzymesManagerWindow");

        restrictionEnzymesManagerWindow.show();
        restrictionEnzymesManagerWindow.center();

        this.application.fireEvent("RestrictionEnzymeManagerOpened",
                                   restrictionEnzymesManagerWindow);
    },

    onViewModeChanged: function(viewMode) {
        var circularMenuItem = Ext.getCmp("circularViewMenuItem");
        var linearMenuItem = Ext.getCmp("linearViewMenuItem");

        if(viewMode == "linear") {
            circularMenuItem.setChecked(false, true);
            linearMenuItem.setChecked(true, true);
        } else {
            circularMenuItem.setChecked(true, false);
            linearMenuItem.setChecked(false, true);
        }
    },

    onDownloadGenbankMenuItemClick: function (item, e, options) {
        console.log("Download genbank called");


        var saveFile = function (name, gb) {
                var flag;
                var text = gb.toString();
                var filename = name;
                var bb = new BlobBuilder();
                bb.append(text);
                saveAs(bb.getBlob("text/plain;charset=utf-8"), filename);
            };

        var sequenceFileManager = Teselagen.manager.ProjectManager.workingSequenceFileManager;
        var fileName = sequenceFileManager.getName()+".gb";
        saveFile(fileName, sequenceFileManager.toGenbank());

    },

    onRenameSequenceItemClick: function(item, e, options){

        var onPromptClosed = function (answer, text) {
            Teselagen.manager.ProjectManager.workingVEProject.set('name',text);
            Teselagen.manager.ProjectManager.workingVEProject.save({callback: function(){
                Vede.application.fireEvent("renderProjectsTree");
            }});
        };

        Ext.MessageBox.prompt("Rename Sequence", 'New name:', onPromptClosed, this);
    },
    onHelpBtnClick: function(button, e, options) {
        if(!this.helpWindow || !this.helpWindow.body) this.helpWindow = Ext.create("Vede.view.HelpWindow").show();
    },

    init: function() {
        this.control({
            "#undoMenuItem": {
                click: this.onUndoMenuItemClick
            },
            "#redoMenuItem": {
                click: this.onRedoMenuItemClick
            },
            "#findMenuItem": {
                click: this.onFindMenuItemClick
            },
            "#selectMenuItem": {
                click: this.onSelectMenuItemClick
            },
            "#selectAllMenuItem": {
                click: this.onSelectAllMenuItemClick
            },
            "#selectInverseMenuItem": {
                click: this.onSelectInverseMenuItemClick
            },
            "#reverseComplementMenuItem": {
                click: this.onReverseComplementMenuItemClick
            },
            "#rebaseMenuItem": {
                click: this.onRebaseMenuItemClick
            },
            "#VectorEditorPanel > button[text=Cancel]": {
                click: this.onCancelButtonClick
            },
            "#downloadGenbankMenuItem": {
                click: this.onDownloadGenbankMenuItemClick
            },
            "#importMenuItem": {
                change: this.onImportMenuItemChange
            },
            "#renameSequenceItem": {
                click: this.onRenameSequenceItemClick
            },
            "#circularViewMenuItem": {
                checkchange: this.onCircularViewMenuItemCheckChange
            },
            "#featuresMenuItem": {
                checkchange: this.onFeaturesMenuItemCheckChange
            },
            "#cutSitesMenuItem": {
                checkchange: this.onCutSitesMenuItemCheckChange
            },
            "#orfsMenuItem": {
                checkchange: this.onOrfsMenuItemCheckChange
            },
            "#showComplementaryMenuItem": {
                checkchange: this.onShowComplementaryMenuItemCheckChange
            },
            "#showSpacesMenuItem": {
                checkchange: this.onShowSpacesMenuItemCheckChange
            },
            "#showSequenceAAMenuItem": {
                checkchange: this.onShowSequenceAAMenuItemCheckChange
            },
            "#showRevcomAAMenuItem": {
                checkchange: this.onShowRevcomAAMenuItemCheckChange
            },
            "#featureLabelsMenuItem": {
                checkchange: this.onFeatureLabelsMenuItemCheckChange
            },
            "#cutSiteLabelsMenuItem": {
                checkchange: this.onCutSiteLabelsMenuItemCheckChange
            },
            "#simulateDigestionMenuItem": {
                click: this.onSimulateDigestionMenuItemClick
            },
            "#createNewFeatureMenuItem": {
                click: this.onCreateNewFeatureMenuItemClick
            },
            "#restrictionEnzymesManagerMenuItem": {
                click: this.onRestrictionEnzymesManagerMenuItemClick
            }
        });

        this.FormatUtils = Teselagen.utils.FormatUtils;
        this.MenuItemEvent = Teselagen.event.MenuItemEvent;
        this.ProjectManager = Teselagen.manager.ProjectManager;
        this.VisibilityEvent = Teselagen.event.VisibilityEvent;

        this.application.on("ViewModeChanged", this.onViewModeChanged, this);
    }
});
