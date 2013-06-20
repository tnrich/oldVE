/**
 * Main menu controller
 * @class Vede.controller.VectorEditor.MainMenuController
 */
Ext.define('Vede.controller.VectorEditor.MainMenuController', {
    extend: 'Ext.app.Controller',

    requires: ['Teselagen.event.CaretEvent',
               'Teselagen.event.MenuItemEvent',
               'Teselagen.event.VisibilityEvent',
               'Teselagen.manager.PrintManager',
               'Teselagen.manager.ProjectManager',
               'Teselagen.manager.VectorEditorManager',
               'Teselagen.utils.FormatUtils',
               "Vede.view.ve.GoToWindow",
               "Vede.view.RestrictionEnzymesManagerWindow",
               "Vede.view.ve.SelectWindow",
               "Vede.view.ve.SimulateDigestionWindow"],

    CaretEvent: null,
    MenuItemEvent: null,
    ProjectManager: null,
    VisibilityEvent: null,
    SequenceManagerEvent: null,
    VEManager: null,
    
    onCutMenuItemClick: function() {
        this.application.fireEvent(this.MenuItemEvent.CUT);
    },

    onCopyMenuItemClick: function() {
        this.application.fireEvent(this.MenuItemEvent.COPY);
    },

    onPasteMenuItemClick: function() {
        this.application.fireEvent(this.MenuItemEvent.PASTE);
    },

    onUndoMenuItemClick: function() {
        this.application.fireEvent(this.MenuItemEvent.UNDO);
    },

    onRedoMenuItemClick: function() {
        this.application.fireEvent(this.MenuItemEvent.REDO);
    },

    onSafeEditingMenuItemCheckChange: function(checkbox, checked) {
        this.application.fireEvent(this.MenuItemEvent.SAFE_EDITING_CHANGED, checked);
    },

    validateSafeEditingMenuItem: function(checked) {
        Ext.getCmp("safeEditingMenuItem").setChecked(checked);
    },

    onFindMenuItemClick: function() {
        this.application.fireEvent(this.MenuItemEvent.FIND_PANEL_OPENED);
    },

    onGotoMenuItemClick: function() {
        var gotoWindow = Ext.create("Vede.view.ve.GoToWindow");

        this.application.fireEvent(this.MenuItemEvent.GOTO_WINDOW_OPENED,
                                   gotoWindow);
    },

    onSelectMenuItemClick: function() {
        var selectWindow = Ext.create("Vede.view.ve.SelectWindow");

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
        var simulateDigestionWindow = Ext.create("Vede.view.ve.SimulateDigestionWindow");
        simulateDigestionWindow.show();
        simulateDigestionWindow.center();
        this.application.fireEvent("SimulateDigestionWindowOpened", simulateDigestionWindow);
    },    

    onCreateNewFeatureMenuItemClick: function() {
        var createNewFeatureWindow = Ext.create(
            "Vede.view.ve.CreateNewFeatureWindow");

        createNewFeatureWindow.show();
        createNewFeatureWindow.center();

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
            Teselagen.manager.ProjectManager.workingSequence.set('name',text);
            Teselagen.manager.ProjectManager.workingSequence.save({callback: function(){
                Vede.application.fireEvent(Teselagen.event.ProjectEvent.LOAD_PROJECT_TREE);
            }});
        };

        Ext.MessageBox.prompt("Rename Sequence", 'New name:', onPromptClosed, this);
    },
    onHelpBtnClick: function(button, e, options) {
        if(!this.helpWindow || !this.helpWindow.body) this.helpWindow = Ext.create("Vede.view.HelpWindow").show();
    },
    
    onNewBlankVectorEditorMenuItemClick: function() {
    	var project = Teselagen.manager.ProjectManager.workingProject;
    	var sequencesNames = [];
        project.sequences().load().each(function (sequence) {
            sequencesNames.push(sequence.data.name);
        });
        Teselagen.manager.ProjectManager.createNewSequence(project, sequencesNames);  	
    },
    
    onSelectionCancelled: function(scope) {
    	Ext.getCmp("createNewFeatureMenuItem").disable();
    },
    onSelectionChanged: function(scope) {
    	Ext.getCmp("createNewFeatureMenuItem").enable();
    },
    onSequenceManagerChanged: function(scope) {
    	Ext.getCmp("createNewFeatureMenuItem").disable();
    },
    
    onImportFileMenuItemClick: function() {
    	// Add something here eventually.
    	
    	debugger; // This debugger is here just for debugging util purposes.   	
    },
    
    onPrintSequenceViewMenuItemClick: function() {
    	
    	/*var svgHtml = Ext.getCmp("AnnotateContainer").el.getHTML();
    	var myWindow = window.open('', '', 'width=200,height=100');
        myWindow.document.write('<html><head>');
        myWindow.document.write('<title>' + this.ProjectManager.workingSequence.data.name + '</title>');
        myWindow.document.write('<script type="text/javascript" src="../../../resources/js/d3.v2.min.js"></script>');
        myWindow.document.write('</head><body>');
        myWindow.document.write(svgHtml);
        myWindow.document.write('</body></html>');
        myWindow.print();
        myWindow.close();*/
    },
    
    onPrintCircularViewMenuItemClick: function() {
    	Teselagen.manager.PrintManager.printCircularView();
    	/*var svgHtml = d3.select(".pieParent").node().parentNode.parentElement.innerHTML;
        var myWindow = window.open('', '', 'width=200,height=100');      
        myWindow.document.write('<html><head>');
        myWindow.document.write('<title>' + this.ProjectManager.workingSequence.data.name + '</title>');
        myWindow.document.write('<script type="text/javascript" src="../../../resources/js/d3.v2.min.js"></script>');
        myWindow.document.write('</head><body>');
        myWindow.document.write(svgHtml);
        myWindow.document.write('</body></html>');
        myWindow.print();
        myWindow.close();*/
    },
    
    onPrintLinearViewMenuItemClick: function() {
    	var svgHtml = Ext.getCmp("RailContainer").el.getHTML();
    	var myWindow = window.open('', '', 'width=200,height=100');      
        myWindow.document.write('<html><head>');
        myWindow.document.write('<title>' + this.ProjectManager.workingSequence.data.name + '</title>');
        myWindow.document.write('<script type="text/javascript" src="../../../resources/js/d3.v2.min.js"></script>');
        myWindow.document.write('</head><body>');
        myWindow.document.write(svgHtml);
        myWindow.document.write('</body></html>');
        myWindow.print();
        myWindow.close();
    },
    
    onPropertiesMenuItemClick: function() {
    	var propertiesWindow = Ext.create("Vede.view.ve.PropertiesWindow");
    	
    	propertiesWindow.show();
    	propertiesWindow.center();
    },
    
    init: function() {
        this.control({
            "#cutMenuItem": {
                click: this.onCutMenuItemClick
            },
            "#copyMenuItem": {
                click: this.onCopyMenuItemClick
            },
            "#pasteMenuItem": {
                click: this.onPasteMenuItemClick
            },
            "#undoMenuItem": {
                click: this.onUndoMenuItemClick
            },
            "#redoMenuItem": {
                click: this.onRedoMenuItemClick
            },
            "#safeEditingMenuItem": {
                checkchange: this.onSafeEditingMenuItemCheckChange
            },
            "#findMenuItem": {
                click: this.onFindMenuItemClick
            },
            "#gotoMenuItem": {
                click: this.onGotoMenuItemClick
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
            },
            "#newBlankVectorEditorMenuItem": {
                click: this.onNewBlankVectorEditorMenuItemClick
            },
            "#importFileMenuItem": {
                click: this.onImportFileMenuItemClick
            },
            "#printSequenceViewMenuItem": {
                click: this.onPrintSequenceViewMenuItemClick
            },
            "#printCircularViewMenuItem": {
                click: this.onPrintCircularViewMenuItemClick
            },
            "#printLinearViewMenuItem": {
                click: this.onPrintLinearViewMenuItemClick
            },
            "#propertiesMenuItem": {
                click: this.onPropertiesMenuItemClick
            },
        });

        this.CaretEvent = Teselagen.event.CaretEvent;
        this.MenuItemEvent = Teselagen.event.MenuItemEvent;
        this.ProjectManager = Teselagen.manager.ProjectManager;
        this.VisibilityEvent = Teselagen.event.VisibilityEvent;
        this.SequenceManagerEvent = Teselagen.event.SequenceManagerEvent;

        this.application.on(this.MenuItemEvent.SAFE_EDITING_CHANGED,
                            this.validateSafeEditingMenuItem, this);

        this.application.on("ViewModeChanged", this.onViewModeChanged, this);
        this.application.on(Teselagen.event.SelectionEvent.SELECTION_CANCELED, 
                this.onSelectionCancelled,this);
        this.application.on(Teselagen.event.SelectionEvent.SELECTION_CHANGED, 
                this.onSelectionChanged,this);
        this.application.on(Teselagen.event.SequenceManagerEvent.SEQUENCE_MANAGER_CHANGED, 
                this.onSequenceManagerChanged,this);
    }
});
