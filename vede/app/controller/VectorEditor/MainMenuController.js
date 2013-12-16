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
               "Vede.view.ve.PreferencesWindow",
               "Vede.view.ve.SelectWindow",
               "Vede.view.ve.SimulateDigestionWindow"],

    CaretEvent: null,
    MenuItemEvent: null,
    ProjectManager: null,
    VisibilityEvent: null,
    SequenceManagerEvent: null,
    sequenceManager: null,
    VEManager: null,

    onTabChange: function(mainAppPanel, newTab, oldTab) {
        this.activeTab = newTab;

        if(newTab.initialCls === "VectorEditorPanel") {
            this.sequenceManager = newTab.model;

            newTab.down("component[identifier*='sequenceLinearMenuItem']").setChecked(
                                            !this.sequenceManager.getCircular(), true);

            this.loadTabOptions(newTab.options);
        }

        // Store current feature/cut site/orf visibility settings on the old
        // tab, and load those from the new tab.
        if(oldTab && oldTab.initialCls === "VectorEditorPanel") {
            var menuPanel = oldTab.down("VectorEditorMainMenuPanel");

            if(menuPanel) {
                oldTab.options.features = menuPanel.down("component[identifier='featuresMenuItem']").checked,
                oldTab.options.cutSites = menuPanel.down("component[identifier='cutSitesMenuItem']").checked,
                oldTab.options.orfs = menuPanel.down("component[identifier='orfsMenuItem']").checked,
                oldTab.options.circular = menuPanel.down("component[identifier='circularViewMenuItem']").checked,
                oldTab.options.mapCaret = menuPanel.down("component[identifier='mapCaretMenuItem']").checked,
                oldTab.options.complementary = menuPanel.down("component[identifier='showComplementaryMenuItem']").checked,
                oldTab.options.spaces = menuPanel.down("component[identifier='showSpacesMenuItem']").checked,
                oldTab.options.sequenceAA = menuPanel.down("component[identifier='showSequenceAAMenuItem']").checked,
                oldTab.options.revComAA = menuPanel.down("component[identifier='showRevcomAAMenuItem']").checked,
                oldTab.options.featureLabels = menuPanel.down("component[identifier='featureLabelsMenuItem']").checked,
                oldTab.options.cutSiteLabels = menuPanel.down("component[identifier='cutSiteLabelsMenuItem']").checked
            }
        }
    },

    onCutMenuItemClick: function() {
        this.application.fireEvent(this.MenuItemEvent.CUT);
    },

    onCopyMenuItemClick: function(item) {
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
        Ext.each(this.activeTab.query("component[identifier*='safeEditingMenuItem']"), function(item) {
            item.setChecked(checked);
        });
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

        if (checked) {
            viewMode = "linear";
            this.sequenceManager.setCircular(false);
        }
        else {
            viewMode = "circular";
            this.sequenceManager.setCircular(true);
        }

        this.application.fireEvent(this.VisibilityEvent.VIEW_MODE_CHANGED, viewMode);
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

    onLinearViewMenuItemCheckChange: function(menucheckitem, checked, options) {
        var viewMode;

        if (checked) {
            viewMode = "linear";
        }
        else {
            viewMode = "circular";
        }

        this.application.fireEvent("ViewModeChanged", viewMode);
    },

    loadTabOptions: function(tabOptions) {
        if(tabOptions) {
            var menuPanel = this.activeTab.down("VectorEditorMainMenuPanel");

            menuPanel.down("component[cls='featuresBtn']").toggle(tabOptions.features);
            menuPanel.down("component[cls='cutSitesBtn']").toggle(tabOptions.cutSites);
            menuPanel.down("component[cls='orfsBtn']").toggle(tabOptions.orfs);
            menuPanel.down("component[cls='circularBtn']").toggle(tabOptions.circular);
            menuPanel.down("component[cls='linearBtn']").toggle(!tabOptions.circular);
            menuPanel.down("component[identifier='circularViewMenuItem']").setChecked(tabOptions.circular);
            menuPanel.down("component[identifier='mapCaretMenuItem']").setChecked(tabOptions.mapCaret);
            menuPanel.down("component[identifier='showComplementaryMenuItem']").setChecked(tabOptions.complementary);
            menuPanel.down("component[identifier='showSpacesMenuItem']").setChecked(tabOptions.spaces);
            menuPanel.down("component[identifier='showSequenceAAMenuItem']").setChecked(tabOptions.sequenceAA);
            menuPanel.down("component[identifier='showRevcomAAMenuItem']").setChecked(tabOptions.revComAA);
            menuPanel.down("component[identifier='featureLabelsMenuItem']").setChecked(tabOptions.featureLabels);
            menuPanel.down("component[identifier='cutSiteLabelsMenuItem']").setChecked(tabOptions.cutSiteLabels);
        }
    },

    onFeaturesMenuItemCheckChange: function(menucheckitem, checked, options) {
        var buttons = this.activeTab.query('component[cls="featuresBtn"]');
        var checkitems = this.activeTab.query('menucheckitem[identifier="featuresMenuItem"]');

        for(var i = 0; i < buttons.length; i++) {
            buttons[i].toggle(checked, true);
        }

        for(i = 0; i < checkitems.length; i++) {
            checkitems[i].setChecked(checked, true);
        }

        this.application.fireEvent(this.VisibilityEvent.SHOW_FEATURES_CHANGED,
                                   checked);
    },

    onCutSitesMenuItemCheckChange: function(menucheckitem, checked, options) {
        var buttons = this.activeTab.query('component[cls="cutSitesBtn"]');
        var checkitems = this.activeTab.query('menucheckitem[identifier="cutSitesMenuItem"]');

        for(var i = 0; i < buttons.length; i++) {
            buttons[i].toggle(checked, true);
        }

        for(i = 0; i < checkitems.length; i++) {
            checkitems[i].setChecked(checked, true);
        }
        this.application.fireEvent(this.VisibilityEvent.SHOW_CUTSITES_CHANGED,
                                   checked);
    },

    onOrfsMenuItemCheckChange: function(menucheckitem, checked, options) {
        var buttons = this.activeTab.query('component[cls="orfsBtn"]');
        var checkitems = this.activeTab.query('menucheckitem[identifier="orfsMenuItem"]');

        var frame = menucheckitem.frameNumber;

        if(frame === 'all') {
            for(var i = 0; i < buttons.length; i++) {
                buttons[i].toggle(checked, true);
            }

            for(i = 0; i < checkitems.length; i++) {
                checkitems[i].setChecked(checked, true);
            }
            this.application.fireEvent(this.VisibilityEvent.SHOW_ORFS_CHANGED,
                                       [checked, checked, checked]);
        } else {
            var isFrame1Visible = checkitems[1].checked;
            var isFrame2Visible = checkitems[2].checked;
            var isFrame3Visible = checkitems[3].checked;

            if(!isFrame1Visible || !isFrame2Visible || !isFrame3Visible) {
                for(var i = 0; i < buttons.length; i++) {
                    buttons[i].toggle(false, true);
                }

                checkitems[0].setChecked(false, true);
            } else {
                for(var i = 0; i < buttons.length; i++) {
                    buttons[i].toggle(true, true);
                }

                checkitems[0].setChecked(true, true);
            }

            this.application.fireEvent(this.VisibilityEvent.SHOW_ORFS_CHANGED,
                                       [isFrame1Visible, isFrame2Visible, isFrame3Visible]);
        }
    },

    onShowComplementaryMenuItemCheckChange: function(menucheckitem, checked) {
        Ext.each(this.activeTab.query("component[identifier*='showComplementaryMenuItem']"), function(item) {
            item.setChecked(checked);
        });

        this.application.fireEvent(this.VisibilityEvent.SHOW_COMPLEMENTARY_CHANGED,
                                   checked);
    },

    onShowSpacesMenuItemCheckChange: function(menucheckitem, checked) {
        Ext.each(this.activeTab.query("component[identifier*='showSpacesMenuItem']"), function(item) {
            item.setChecked(checked);
        });

        this.application.fireEvent(this.VisibilityEvent.SHOW_SPACES_CHANGED,
                                   checked);
    },

    onShowSequenceAAMenuItemCheckChange: function(menucheckitem, checked) {
        var checkitems = this.activeTab.query("component[identifier*='showSequenceAAMenuItem']");
        var frame = menucheckitem.frameNumber;

        if(frame === 'all') {
            for(i = 0; i < checkitems.length; i++) {
                checkitems[i].setChecked(checked, true);
            }

            this.application.fireEvent(this.VisibilityEvent.SHOW_SEQUENCE_AA_CHANGED,
                                       [checked, checked, checked]);
        } else {
            var isFrame1Visible = checkitems[1].checked;
            var isFrame2Visible = checkitems[2].checked;
            var isFrame3Visible = checkitems[3].checked;

            if(!isFrame1Visible || !isFrame2Visible || !isFrame3Visible) {
                checkitems[0].setChecked(false, true);
            } else {
                checkitems[0].setChecked(true, true);
            }

            this.application.fireEvent(this.VisibilityEvent.SHOW_SEQUENCE_AA_CHANGED,
                                       [isFrame1Visible, isFrame2Visible, isFrame3Visible]);
        }
    },

    onShowRevcomAAMenuItemCheckChange: function(menucheckitem, checked) {
        var checkitems = this.activeTab.query("component[identifier*='showRevcomAAMenuItem']");
        var frame = menucheckitem.frameNumber;

        if(frame === 'all') {
            for(i = 0; i < checkitems.length; i++) {
                checkitems[i].setChecked(checked, true);
            }

            this.application.fireEvent(this.VisibilityEvent.SHOW_REVCOM_AA_CHANGED,
                                       [checked, checked, checked]);
        } else {
            var isFrame1Visible = checkitems[1].checked;
            var isFrame2Visible = checkitems[2].checked;
            var isFrame3Visible = checkitems[3].checked;

            if(!isFrame1Visible || !isFrame2Visible || !isFrame3Visible) {
                checkitems[0].setChecked(false, true);
            } else {
                checkitems[0].setChecked(true, true);
            }

            this.application.fireEvent(this.VisibilityEvent.SHOW_REVCOM_AA_CHANGED,
                                       [isFrame1Visible, isFrame2Visible, isFrame3Visible]);
        }
    },

    onFeatureLabelsMenuItemCheckChange: function(menucheckitem, checked) {
        Ext.each(this.activeTab.query("component[identifier*='featureLabelsMenuItem']"), function(item) {
            item.setChecked(checked);
        });

        this.application.fireEvent(this.VisibilityEvent.SHOW_FEATURE_LABELS_CHANGED,
                                   checked);
    },

    onCutSiteLabelsMenuItemCheckChange: function(menucheckitem, checked) {
        Ext.each(this.activeTab.query("component[identifier*='cutSiteLabelsMenuItem']"), function(item) {
            item.setChecked(checked);
        });

        this.application.fireEvent(this.VisibilityEvent.SHOW_CUTSITE_LABELS_CHANGED,
                                   checked);
    },

    onMapCaretMenuItemCheckChange: function(menucheckitem, checked) {
        Ext.each(this.activeTab.query("component[identifier*='mapCaretMenuItem']"), function(item) {
            item.setChecked(checked);
        });

        this.application.fireEvent(this.VisibilityEvent.SHOW_MAP_CARET_CHANGED,
                                    checked);
    },

    onSimulateDigestionMenuItemClick: function() {
        var simulateDigestionWindow = Ext.create("Vede.view.ve.SimulateDigestionWindow");
        simulateDigestionWindow.show();
        simulateDigestionWindow.center();
        this.application.fireEvent(this.MenuItemEvent.SIMULATE_DIGESTION_WINDOW_OPENED, simulateDigestionWindow);
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
        var circularMenuItems = this.activeTab.query("component[identifier*='circularViewMenuItem']");
        var linearMenuItems = this.activeTab.query("component[identifier*='linearViewMenuItem']");
        var sequenceLinearMenuItem = this.activeTab.query("component[identifier*='sequenceLinearMenuItem']");

        if(viewMode == "linear") {
            for(var i = 0; i < circularMenuItems.length; i++) {
                circularMenuItems[i].setChecked(false, true);
                linearMenuItems[i].setChecked(true, true);
                sequenceLinearMenuItem[i].setChecked(true,true);
            }
        } else {
            for(var i = 0; i < circularMenuItems.length; i++) {
                circularMenuItems[i].setChecked(true, false);
                linearMenuItems[i].setChecked(false, true);
                sequenceLinearMenuItem[i].setChecked(false,true);
            }
        }
    },

    onDownloadGenbankMenuItemClick: function (item, e, options) {
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
        Teselagen.manager.ProjectManager.sequences.load().each(function (sequence) {
            sequencesNames.push(sequence.data.name);
        });
        Teselagen.manager.ProjectManager.createNewSequence(project, sequencesNames);
    },

    onSequenceManagerChanged: function(sequenceManager) {
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

    onPreferencesMenuItemClick: function() {
        var preferencesWindow = Ext.create("Vede.view.ve.PreferencesWindow");
        preferencesWindow.show();

    },

    init: function() {
        // For some reason, menu items' 'cls' attributes are set to null when
        // the parent menu is opened and then closed. For this reason, we can't
        // query them by class, so we must query them by a different field. I
        // added the field 'identifier' to make this easier.
        this.control({
            "#mainAppPanel": {
                tabchange: this.onTabChange
            },
            "component[identifier*='cutMenuItem']": {
                click: this.onCutMenuItemClick
            },
            "component[identifier*='copyMenuItem']": {
                click: this.onCopyMenuItemClick
            },
            "component[identifier*='pasteMenuItem']": {
                click: this.onPasteMenuItemClick
            },
            "component[identifier*='undoMenuItem']": {
                click: this.onUndoMenuItemClick
            },
            "component[identifier*='redoMenuItem']": {
                click: this.onRedoMenuItemClick
            },
            "component[identifier*='safeEditingMenuItem']": {
                checkchange: this.onSafeEditingMenuItemCheckChange
            },
            "component[identifier*='findMenuItem']": {
                click: this.onFindMenuItemClick
            },
            "component[identifier*='gotoMenuItem']": {
                click: this.onGotoMenuItemClick
            },
            "component[identifier*='selectMenuItem']": {
                click: this.onSelectMenuItemClick
            },
            "component[identifier*='selectAllMenuItem']": {
                click: this.onSelectAllMenuItemClick
            },
            "component[identifier*='selectInverseMenuItem']": {
                click: this.onSelectInverseMenuItemClick
            },
            "component[identifier*='sequenceLinearMenuItem']": {
                checkchange: this.onSequenceLinearMenuItemCheckChange
            },
            "component[identifier*='reverseComplementMenuItem']": {
                click: this.onReverseComplementMenuItemClick
            },
            "component[identifier*='rebaseMenuItem']": {
                click: this.onRebaseMenuItemClick
            },
            "component[identifier='VectorEditorPanel'] > button[text=Cancel]": {
                click: this.onCancelButtonClick
            },
            "component[identifier*='downloadGenbankMenuItem']": {
                click: this.onDownloadGenbankMenuItemClick
            },
            "component[identifier*='renameSequenceItem']": {
                click: this.onRenameSequenceItemClick
            },
            "component[identifier*='circularViewMenuItem']": {
                checkchange: this.onCircularViewMenuItemCheckChange
            },
            "component[identifier*='linearViewMenuItem']": {
                checkchange: this.onLinearViewMenuItemCheckChange
            },
            "component[identifier*='featuresMenuItem']": {
                checkchange: this.onFeaturesMenuItemCheckChange
            },
            "component[identifier*='cutSitesMenuItem']": {
                checkchange: this.onCutSitesMenuItemCheckChange
            },
            "component[identifier*='orfsMenuItem']": {
                checkchange: this.onOrfsMenuItemCheckChange
            },
            "component[identifier*='showComplementaryMenuItem']": {
                checkchange: this.onShowComplementaryMenuItemCheckChange
            },
            "component[identifier*='showSpacesMenuItem']": {
                checkchange: this.onShowSpacesMenuItemCheckChange
            },
            "component[identifier*='showSequenceAAMenuItem']": {
                checkchange: this.onShowSequenceAAMenuItemCheckChange
            },
            "component[identifier*='showRevcomAAMenuItem']": {
                checkchange: this.onShowRevcomAAMenuItemCheckChange
            },
            "component[identifier*='featureLabelsMenuItem']": {
                checkchange: this.onFeatureLabelsMenuItemCheckChange
            },
            "component[identifier*='cutSiteLabelsMenuItem']": {
                checkchange: this.onCutSiteLabelsMenuItemCheckChange
            },
            "component[identifier*='mapCaretMenuItem']": {
                checkchange: this.onMapCaretMenuItemCheckChange
            },
            "component[identifier*='simulateDigestionMenuItem']": {
                click: this.onSimulateDigestionMenuItemClick
            },
            "component[identifier*='restrictionEnzymesManagerMenuItem']": {
                click: this.onRestrictionEnzymesManagerMenuItemClick
            },
            "component[identifier*='newBlankVectorEditorMenuItem']": {
                click: this.onNewBlankVectorEditorMenuItemClick
            },
            "component[identifier*='printSequenceViewMenuItem']": {
                click: this.onPrintSequenceViewMenuItemClick
            },
            "component[identifier*='printCircularViewMenuItem']": {
                click: this.onPrintCircularViewMenuItemClick
            },
            "component[identifier*='printLinearViewMenuItem']": {
                click: this.onPrintLinearViewMenuItemClick
            },
             "component[identifier*='preferencesMenuItem']": {
                click: this.onPreferencesMenuItemClick
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

        Vede.application.on('restrictionEnzymesManagerLinkClick', this.onRestrictionEnzymesManagerMenuItemClick, this);
        Vede.application.on('preferencesLinkClick', this.onPreferencesMenuItemClick, this);
    }
});
