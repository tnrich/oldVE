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
               "Vede.view.ve.RestrictionEnzymesManagerWindow",
               "Vede.view.ve.PropertiesWindow",
               "Vede.view.ve.SelectWindow",
               "Vede.view.ve.SimulateDigestionWindow"],

    CaretEvent: null,
    MenuItemEvent: null,
    ProjectManager: null,
    VisibilityEvent: null,
    SequenceManagerEvent: null,
    sequenceManager: null,
    VEManager: null,

    onImportBtnChange: function(pBtn) {
        alert("hi");
    },
    
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

    onSequenceLinearMenuItemCheckChange: function(checkitem, checked) {
        this.sequenceManager.setCircular(!checked);
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

        this.application.fireEvent(this.VisibilityEvent.VIEW_MODE_CHANGED, viewMode);
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

    onMapCaretMenuItemCheckChange: function(menucheckitem, checked) {
        this.application.fireEvent(this.VisibilityEvent.SHOW_MAP_CARET_CHANGED,
                                    checked);
    },

    onSimulateDigestionMenuItemClick: function() {
        var simulateDigestionWindow = Ext.create("Vede.view.ve.SimulateDigestionWindow");
        simulateDigestionWindow.show();
        simulateDigestionWindow.center();
        this.application.fireEvent("SimulateDigestionWindowOpened", simulateDigestionWindow);
    },    

    onRestrictionEnzymesManagerMenuItemClick: function() {
        var restrictionEnzymesManagerWindow = Ext.create(
            "Vede.view.ve.RestrictionEnzymesManagerWindow");

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
    
    onSequenceManagerChanged: function(sequenceManager) {
        Ext.getCmp("sequenceLinearMenuItem").setChecked(
                                        !sequenceManager.getCircular(), true);

    	this.sequenceManager = sequenceManager;
    },
    
    onPrintSequenceViewMenuItemClick: function() {
    	Teselagen.manager.PrintManager.printSequenceView();
    },
    
    onPrintCircularViewMenuItemClick: function() {
    	Teselagen.manager.PrintManager.printCircularView();
    },
    
    onPrintLinearViewMenuItemClick: function() {
    	Teselagen.manager.PrintManager.printLinearView();
    },
    
    onPropertiesMenuItemClick: function() {
    	var propertiesWindow = Ext.create("Vede.view.ve.PropertiesWindow");
    	Ext.getCmp('propertiesWindowOwnerField').setFieldStyle('border-color:transparent;background-color:transparent');
    	Ext.getCmp('propertiesWindowCreatedField').setFieldStyle('border-color:transparent;background-color:transparent');
    	Ext.getCmp('propertiesWindowLastModifiedField').setFieldStyle('border-color:transparent;background-color:transparent');
    	
    	Ext.getCmp('propertiesWindowSequenceNameField').setValue(
            Teselagen.manager.ProjectManager.workingSequence.get("name"));

    	propertiesWindow.show();
    	propertiesWindow.center();
    },
    
    onPropertiesWindowOKButtonClick: function() {
    	var name = Ext.getCmp('propertiesWindowSequenceNameField').getValue();
    	if(name == null || name.match(/^\s*$/) || name.length==0) {
    		Ext.getCmp('propertiesWindowSequenceNameField').setFieldStyle("border-color:red");
    	} else {
    		var sequenceStore = Teselagen.manager.ProjectManager.sequenceStore;
    		var workingSequence = Teselagen.manager.ProjectManager.workingSequence;
    		var selectedProj = Teselagen.manager.ProjectManager.workingProject;
    		
    		var oldName = workingSequence.data.name;
    		// It is very likely that the following code contains inconsistencies in what the name means.
    		
    		var idx = -1;
    		//Maybe make more efficient in the future.
    		for(var i=0;i<sequenceStore.data.items.length;i++) {
    			if(name==sequenceStore.data.items[i].data.name && selectedProj.internalId==sequenceStore.data.items[i].data.project_id) {
    				if(name!=oldName) {
	    				// Put better way of alerting user. The following line of code is just temporary.
	    				// Following code isn't completely correct. It's just in place for testing purposes.
	    				Ext.alert('A sequence with the name "'+name+'" already exists in the project "'+selectedProj.data.name+'."\nPlease select another name.');
						return;
    				}
    			}
    		}

            this.sequenceManager.setName(name);
            workingSequence.set("name", name);
    		workingSequence.save({
                callback: function () {
                    Vede.application.fireEvent(Teselagen.event.ProjectEvent.LOAD_PROJECT_TREE, function () {
                        Ext.getCmp("projectTreePanel").expandPath("/root/" + selectedProj.data.id + "/" + workingSequence.data.id);
                        //Ext.getCmp("mainAppPanel").getActiveTab().el.unmask();
                    });
                }
            });
    		
    		Ext.getCmp('PropertiesWindow').close();
    	}
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
            "#sequenceLinearMenuItem": {
                checkchange: this.onSequenceLinearMenuItemCheckChange
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
            "#mapCaretMenuItem": {
                checkchange: this.onMapCaretMenuItemCheckChange
            },
            "#simulateDigestionMenuItem": {
                click: this.onSimulateDigestionMenuItemClick
            },
            "#restrictionEnzymesManagerMenuItem": {
                click: this.onRestrictionEnzymesManagerMenuItemClick
            },
            "#newBlankVectorEditorMenuItem": {
                click: this.onNewBlankVectorEditorMenuItemClick
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
            "#propertiesWindowOKButton": {
                click: this.onPropertiesWindowOKButtonClick
            },
        });

        this.CaretEvent = Teselagen.event.CaretEvent;
        this.MenuItemEvent = Teselagen.event.MenuItemEvent;
        this.ProjectManager = Teselagen.manager.ProjectManager;
        this.VisibilityEvent = Teselagen.event.VisibilityEvent;
        this.SequenceManagerEvent = Teselagen.event.SequenceManagerEvent;

        this.application.on(this.MenuItemEvent.SAFE_EDITING_CHANGED,
                            this.validateSafeEditingMenuItem, this);

        this.application.on(this.VisibilityEvent.VIEW_MODE_CHANGED, this.onViewModeChanged, this);
        this.application.on(Teselagen.event.SequenceManagerEvent.SEQUENCE_MANAGER_CHANGED, 
                this.onSequenceManagerChanged,this);
    }
});
