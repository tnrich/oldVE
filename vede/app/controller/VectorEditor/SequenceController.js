/**
 * @class Vede.controller.VectorEditor.SequenceController
 * Parent class of AnnotatePanelController, PieController, and RailController.
 * Handles general user input and events for sequence display and manipulation.
 */
Ext.define("Vede.controller.VectorEditor.SequenceController", {
    extend: "Ext.app.Controller",

    requires: ["Teselagen.bio.sequence.alphabets.DNAAlphabet",
               "Teselagen.bio.sequence.DNATools",
               "Teselagen.event.CaretEvent",
               "Teselagen.event.MapperEvent",
               "Teselagen.event.MenuItemEvent",
               "Teselagen.event.SequenceManagerEvent",
               "Teselagen.event.SelectionEvent",
               "Teselagen.event.SelectionLayerEvent",
               "Teselagen.event.VisibilityEvent",
               "Teselagen.manager.AAManager",
               "Teselagen.manager.ORFManager",
               "Teselagen.manager.RestrictionEnzymeGroupManager",
               "Teselagen.manager.RestrictionEnzymeManager",
               "Vede.view.ve.SafeEditWindow"],

    AAManager: null,
    ORFManager: null,
    RestrictionEnzymeManager: null,
    SequenceManager: null,

    RestrictionEnzymeGroupManager: null,

    Managers: null,

    CaretEvent: null,
    MapperEvent: null,
    MenuItemEvent: null,
    SelectionEvent: null,
    SelectionLayerEvent: null,
    SequenceManagerEvent: null,
    VisibilityEvent: null,

    WireframeSelectionLayer: null,
    SelectionLayer: null,

    DNAAlphabet: null,
    DNATools: null,

    mouseIsDown: false,
    startSelectionIndex: 0,
    selectionDirection: 0,
    caretIndex: 0,

    safeEditing: true,

    activeTab: null,

    invisibleText: null,

    clickedAnnotationStart: null,
    clickedAnnotationEnd: null,

    init: function() {
        this.DNAAlphabet = Teselagen.bio.sequence.alphabets.DNAAlphabet;
        this.DNATools = Teselagen.bio.sequence.DNATools;

        this.CaretEvent = Teselagen.event.CaretEvent;
        this.MapperEvent = Teselagen.event.MapperEvent;
        this.MenuItemEvent = Teselagen.event.MenuItemEvent;
        this.SelectionEvent = Teselagen.event.SelectionEvent;
        this.SelectionLayerEvent = Teselagen.event.SelectionLayerEvent;
        this.SequenceManagerEvent = Teselagen.event.SequenceManagerEvent;
        this.VisibilityEvent = Teselagen.event.VisibilityEvent;

        var listenersObject = {
            SequenceManagerChanged: this.onSequenceManagerChanged,
            ActiveEnzymesChanged: this.onActiveEnzymesChanged,
            VectorPanelAnnotationClicked: this.onVectorPanelAnnotationClicked,
            AnnotatePanelAnnotationClicked: this.onAnnotatePanelAnnotationClicked,
            ViewModeChanged: this.onViewModeChanged,
            scope: this
        };

        listenersObject[this.VisibilityEvent.SHOW_FEATURES_CHANGED] = 
            this.onShowFeaturesChanged;
        listenersObject[this.VisibilityEvent.SHOW_CUTSITES_CHANGED] = 
            this.onShowCutSitesChanged;
        listenersObject[this.VisibilityEvent.SHOW_ORFS_CHANGED] = 
            this.onShowOrfsChanged;

        listenersObject[this.VisibilityEvent.SHOW_FEATURE_LABELS_CHANGED] = 
            this.onShowFeatureLabelsChanged;
        listenersObject[this.VisibilityEvent.SHOW_CUTSITE_LABELS_CHANGED] =
            this.onShowCutSiteLabelsChanged;

        listenersObject[this.MapperEvent.AA_MAPPER_UPDATED] = 
            this.onAAManagerUpdated;
        listenersObject[this.MapperEvent.ORF_MAPPER_UPDATED] = 
            this.onORFManagerUpdated;
        listenersObject[this.MapperEvent.RESTRICTION_ENZYME_MAPPER_UPDATED] =
            this.onRestrictionEnzymeManagerUpdated;

        listenersObject[this.SelectionEvent.SELECTION_CHANGED] = 
            this.onSelectionChanged;
        listenersObject[this.SelectionEvent.SELECTION_CANCELED] =
            this.onSelectionCanceled;

        listenersObject[this.CaretEvent.CARET_POSITION_CHANGED] = 
            this.onCaretPositionChanged;

        listenersObject[this.MenuItemEvent.SELECT_ALL] = this.onSelectAll;
        listenersObject[this.MenuItemEvent.SELECT_INVERSE] = this.onSelectInverse;

        listenersObject[this.MenuItemEvent.SAFE_EDITING_CHANGED] = this.onSafeEditingChanged;

        listenersObject[this.MenuItemEvent.REVERSE_COMPLEMENT] = 
            this.onReverseComplementSequence;
        listenersObject[this.MenuItemEvent.REBASE_SEQUENCE] = 
            this.onRebaseSequence;

        listenersObject[this.SequenceManagerEvent.SEQUENCE_CHANGING] =
            this.onSequenceChanging;
        listenersObject[this.SequenceManagerEvent.SEQUENCE_CHANGED] =
            this.onSequenceChanged;

        this.application.on(listenersObject, this);
    },

    getActiveTab: function() {
        return Ext.getCmp('mainAppPanel').getActiveTab();
    },

    onTabChange: function(mainAppPanel, newTab, oldTab) {
        this.activeTab = newTab;

        //this.invisibleText = Ext.getCmp("InvisibleTextarea");

        // Load the sequencemanager associated with the new tab, and select the
        // tab's saved selection.
        if(newTab.initialCls === "VectorEditorPanel") {
            this.onSequenceManagerChanged(newTab.model);

            this.caretIndex = 0;
        }
    },

    onLaunch: function() {
        this.RestrictionEnzymeGroupManager = 
            Teselagen.manager.RestrictionEnzymeGroupManager;

        if(!this.RestrictionEnzymeGroupManager.isInitialized) {
            this.RestrictionEnzymeGroupManager.initialize();
        }

        this.AAManager = Teselagen.manager.AAManager;
        this.ORFManager = Teselagen.manager.ORFManager;
        this.RestrictionEnzymeManager = Teselagen.manager.RestrictionEnzymeManager;

        this.AAManager.initialize();
        this.ORFManager.initialize();
        this.RestrictionEnzymeManager.initialize();

        this.AAManager.setSequenceManager(this.SequenceManager);
        this.ORFManager.setSequenceManager(this.SequenceManager);
        this.RestrictionEnzymeManager.setSequenceManager(this.SequenceManager);
        this.RestrictionEnzymeManager.setRestrictionEnzymeGroup(this.RestrictionEnzymeGroupManager.getActiveGroup());

        this.Managers = [this.AAManager, 
                         this.RestrictionEnzymeManager,
                         this.ORFManager];
    },

    onKeydown: function(event) {
        var character = String.fromCharCode(event.getCharCode()).toLowerCase();

        // Focus on an invisible textarea so we can paste from the clipboard.
        /*if(event.ctrlKey) {
            this.invisibleText.focus();
        }*/

        if(event.ctrlKey && event.getKey() === event.LEFT) {
            // Ctrl + Left: Move caret to start of previous block of 10 bases.
            if(this.caretIndex % 10 === 0) {
                this.changeCaretPosition(this.caretIndex - 10);
            } else {
                this.changeCaretPosition(Math.round(this.caretIndex / 10) * 10);
            }
        } else if(event.ctrlKey && event.getKey() === event.RIGHT) {
            // Ctrl + Right: Move caret to end of current block of 10 bases.
            if(this.caretIndex % 10 === 0) {
                this.changeCaretPosition(this.caretIndex + 10);
            } else {
                this.changeCaretPosition(Math.round(this.caretIndex / 10 + 1) * 10);
            }
        } else if(event.ctrlKey && event.getKey() === event.HOME) {
            // Ctrl + Home: Move caret to start of sequence.
            this.changeCaretPosition(0);
        } else if(event.ctrlKey && event.getKey() === event.END) {
            // Ctrl + End: Move caret to end of sequence.
            this.changeCaretPosition(
                this.SequenceManager.getSequence().toString().length - 1);
        } else if(event.ctrlKey && event.getKey() === event.X) {
            // Ctrl + X: Cut.
            //this.cutSelection();

            // We can only write to the clipboard using a click event. Stupid Flash.
            Ext.Msg.alert('Cut Shortcut', 'Please use the Edit->Cut menu item for cut functionality.');

        } else if(event.ctrlKey && event.getKey() === event.C) {
            // Ctrl + C: Copy.
            this.copySelection();

            //Ext.Msg.alert('Copy Shortcut', 'Please use the Edit->Copy menu item for copy functionality.');
        } else if(event.ctrlKey && event.getKey() === event.V) {
            // Ctrl + V: Paste.
            //this.pasteFromClipboard();
        } else if(event.ctrlKey && event.getKey() === event.Z) {
            // Ctrl + Z: Undo last action.
            this.application.fireEvent(this.MenuItemEvent.UNDO);
        } else if(event.ctrlKey && event.getKey() === event.U) {
            // Ctrl + U: Redo last action.
            this.application.fireEvent(this.MenuItemEvent.REDO); 
        } else if(event.ctrlKey && event.getKey() === event.A) {
            // Ctrl + A: Select everything.
            this.application.fireEvent(this.MenuItemEvent.SELECT_ALL);
        } else if(event.ctrlKey && event.getKey() === event.I) {
            // Ctrl + I: Invert selection.
            this.application.fireEvent(this.MenuItemEvent.SELECT_INVERSE);
        } else if(event.getKey() === event.LEFT) {
            // Left: Move caret down one base.
            this.changeCaretPosition(this.caretIndex - 1);
        } else if(event.getKey() === event.RIGHT) {
            // Right: Move caret right one base.
            this.changeCaretPosition(this.caretIndex + 1);
        } else if(!event.ctrlKey && !event.altKey) {
            // This statement handles all key presses not accompanied by
            // Control or Alt.

            if(this.DNAAlphabet.symbolByValue(character)) {
                // If key is a valid nucleotide, insert it.
                if(this.SelectionLayer.selected) {
                    if(this.safeEditing) {
                        this.safeDelete(this.SelectionLayer.start,
                                        this.SelectionLayer.end);

                        this.SequenceManager.insertSequence(
                            this.DNATools.createDNA(character), this.caretIndex);
                    } else {
                        this.deleteSequence(this.SelectionLayer.start,
                                            this.SelectionLayer.end);

                        this.SequenceManager.insertSequence(
                            this.DNATools.createDNA(character), this.caretIndex);

                        this.changeCaretPosition(this.caretIndex + 1);
                    }
                } else {
                    if(this.safeEditing) {
                        this.safeInsert(character, this.caretIndex);
                    } else {
                        this.SequenceManager.insertSequence(
                            this.DNATools.createDNA(character), this.caretIndex);

                        this.changeCaretPosition(this.caretIndex + 1);
                    }
                }
            } else if(event.getKey() === event.DELETE) {
                // Delete: Delete the next character or the selection.
                if(this.SelectionLayer.selected) {
                    if(this.safeEditing) {
                        this.safeDelete(this.SelectionLayer.start,
                                        this.SelectionLayer.end);
                    } else {
                        this.deleteSequence(this.SelectionLayer.start,
                                            this.SelectionLayer.end);
                    }
                } else {
                    if(this.safeEditing) {
                        this.safeDelete(this.caretIndex, this.caretIndex + 1);
                    } else {
                        this.deleteSequence(this.SelectionLayer.start,
                                            this.SelectionLayer.end);
                    }
                }
            } else if(event.getKey() === event.BACKSPACE && this.caretIndex > 0) {
                // Backspace: Delete the previous character or the selection.
                if(this.SelectionLayer.selected) {
                    if(this.safeEditing) {
                        this.safeDelete(this.SelectionLayer.start,
                                        this.SelectionLayer.end);
                    } else {
                        this.deleteSequence(this.SelectionLayer.start,
                                            this.SelectionLayer.end);
                    }
                } else {
                    if(this.safeEditing) {
                        this.safeDelete(this.caretIndex - 1, this.caretIndex);
                    } else {
                        this.deleteSequence(this.caretIndex - 1, this.caretIndex);
                    }
                }
            }
        }
    },

    onPaste: function(event) {
        var e = event.browserEvent;
        var text;

        if(e.clipboardData && e.clipboardData.getData) {
            text = e.clipboardData.getData(e.clipboardData.types[0]);

            this.application.ClipBoardData = null;
            this.pasteFromClipboard(text);
        }

        e.preventDefault();
    },

    safeEditPrompt: function(features, callback) {
        var self = this;
        var promptWindow = Ext.create("Vede.view.ve.SafeEditWindow").show();
        var grid = promptWindow.down("gridpanel");

        promptWindow.callback = callback;
        grid.reconfigure(features);

        // Add a label to the checkbox column.
        grid.columns[0].setWidth(160);

        promptWindow.on('close', function() {
            Ext.getCmp("mainAppPanel").getActiveTab().down("component[cls='AnnotateContainer']").el.focus();
        }, this);

        promptWindow.down("displayfield").on("click", function() {
            this.application.fireEvent(this.MenuItemEvent.SAFE_EDITING_CHANGED, false);
            promptWindow.close();
        }, this);
    },

    safeInsert: function(sequence, index, insertSequenceManager) {
        var self = this;
        var affectedFeatures = this.SequenceManager.featuresAt(index);
        var sequenceLength;

        if(affectedFeatures.length > 0) {
            this.safeEditPrompt(affectedFeatures, function() {
                if(insertSequenceManager) {
                    self.SequenceManager.insertSequenceManager(sequence, index);
                    sequenceLength = sequence.getSequence().toString().length;
                } else {
                    self.SequenceManager.insertSequence(self.DNATools.createDNA(sequence),
                                                        index);
                    sequenceLength = sequence.length;
                }

                // 'this' will refer to the SafeEditWindow.
                var selected = this.down('gridpanel').selModel.getSelection();
                var featureModel;

                for(var i = 0; i < selected.length; i++) {
                    featureModel = selected[i];
                    self.SequenceManager.removeFeature(featureModel.data.field1);
                }

                self.changeCaretPosition(index + sequenceLength);
            });
        } else {
            if(insertSequenceManager) {
                this.SequenceManager.insertSequenceManager(sequence, index);
                sequenceLength = sequence.getSequence().toString().length;
            } else {
                this.SequenceManager.insertSequence(this.DNATools.createDNA(sequence),
                                                    index);
                sequenceLength = sequence.length;
            }

            self.changeCaretPosition(index + sequenceLength);
        }
    },

    safeDelete: function(start, end) {
        var self = this;
        var affectedFeatures = this.SequenceManager.featuresByRange(start, end);

        if(affectedFeatures.length > 0) {
            this.safeEditPrompt(affectedFeatures, function() {
                self.deleteSequence(start, end);

                // 'this' will refer to the SafeEditWindow.
                var selected = this.down('gridpanel').selModel.getSelection();
                var featureModel;
                for(var i = 0; i < selected.length; i++) {
                    featureModel = selected[i];
                    self.SequenceManager.removeFeature(featureModel.data.field1);
                }
            });
        } else {
            this.deleteSequence(start, end);
        }
    },

    cutSelection: function() {
        if(this.SelectionLayer.selected) {
            this.application.ClipBoardData = this.SequenceManager.subSequenceManager(
                this.SelectionLayer.start, this.SelectionLayer.end);

            this.safeDelete(this.SelectionLayer.start, this.SelectionLayer.end);
        }
    },

    copySelection: function() {
        if(this.SelectionLayer.selected) {
            this.application.ClipBoardData = this.SequenceManager.subSequenceManager(
                this.SelectionLayer.start, this.SelectionLayer.end);

            var copySequenceWindow = Ext.create("Vede.view.ve.CopySequenceWindow").show();
            var copyTextArea = copySequenceWindow.down("textarea");

            copyTextArea.setValue(this.application.ClipBoardData.getSequence().toString());

            Ext.defer(function() {
                copyTextArea.selectText();
            }, 10);
        }
    },

    pasteFromClipboard: function(text) {
        if(this.application.ClipBoardData || (text && typeof text === 'string')) {
            var confirmationWindow = Ext.create("Vede.view.ve.PasteConfirmationWindow").show();

            confirmationWindow.down("button[cls='pasteConfirmationOkButton']").on("click", function() {
                var pasteSequenceManager;

                if(this.SelectionLayer.selected) {
                    this.changeCaretPosition(this.SelectionLayer.start);

                    this.deleteSequence(this.SelectionLayer.start,
                                        this.SelectionLayer.end);
                }

                if(text && typeof text === 'string') {
                    pasteSequenceManager = Ext.create("Teselagen.manager.SequenceManager", {
                        sequence: Teselagen.bio.sequence.DNATools.createDNA(text)
                    });
                } else {
                    pasteSequenceManager = this.application.ClipBoardData.clone();
                }

                if(confirmationWindow.down("radiogroup").getValue().pasteFormatField === "reverse") {
                    pasteSequenceManager.doReverseComplementSequence();
                }

                confirmationWindow.close();

                if(this.safeEditing) {
                    this.safeInsert(pasteSequenceManager, this.caretIndex, true);
                } else {
                    this.SequenceManager.insertSequenceManager(pasteSequenceManager, index);

                    var sequenceLength = sequence.getSequence().toString().length;

                    this.changeCaretPosition(index + sequenceLength);
                }
            }, this);

            confirmationWindow.down("button[cls='pasteConfirmationCancelButton']").on("click", function() {
                confirmationWindow.close();
            });
        }
    },

    deleteSequence: function(start, end) {
        this.SequenceManager.removeSequence(start, end);

        this.changeCaretPosition(start);

        if(this.SelectionLayer.selected) {
            this.SelectionLayer.deselect();
            this.application.fireEvent(
                this.SelectionEvent.SELECTION_CANCELED);
        }
    },

    onActiveEnzymesChanged: function() {
        this.RestrictionEnzymeManager.setRestrictionEnzymeGroup(
            this.RestrictionEnzymeGroupManager.getActiveGroup());
    },

    onSequenceManagerChanged: function(pSeqMan) {
        this.SequenceManager = pSeqMan;
        var activeTab = this.getActiveTab();
        activeTab.el.unmask();
        activeTab.sequenceManager = pSeqMan;

        Ext.suspendLayouts();

        if(this.SelectionLayer && this.SelectionLayer.selected) {
            this.SelectionLayer.deselect();
        }

        var manager;
        for(var i = 0; i < this.Managers.length; i++) {
            manager = this.Managers[i];
            manager.setSequenceManager(pSeqMan);
        }

        Ext.resumeLayouts(true);
    },

    onSelectAll: function() {
        if(this.SequenceManager) {
            this.select(0, this.SequenceManager.getSequence().toString().length);

            this.application.fireEvent(this.SelectionEvent.SELECTION_CHANGED,
                                       this, this.SelectionLayer.start, this.SelectionLayer.end);
        }
    },

    onSelectInverse: function() {
        if(this.SequenceManager && this.SelectionLayer) {
            this.select(this.SelectionLayer.end, this.SelectionLayer.start);
            this.application.fireEvent(this.SelectionEvent.SELECTION_CHANGED,
                                       this, this.SelectionLayer.start, this.SelectionLayer.end);
        }
    },

    onSafeEditingChanged: function(enabled) {
        this.safeEditing = enabled;
    },

    onRebaseSequence: function() {
        var selectionEnd;

        if(this.SequenceManager) {
            this.SequenceManager.rebaseSequence(this.caretIndex);
            this.changeCaretPosition(0);

            if(this.SelectionLayer.start > this.SelectionLayer.end) {
                selectionEnd = this.SequenceManager.getSequence().toString().length - 
                    this.SelectionLayer.start + this.SelectionLayer.end;
            } else {
                selectionEnd = this.SelectionLayer.end - this.SelectionLayer.start;
            }

            this.SelectionLayer.deselect();
            this.application.fireEvent(this.SelectionEvent.SELECTION_CANCELED);

            this.select(0, selectionEnd);
            this.application.fireEvent(this.SelectionEvent.SELECTION_CHANGED,
                                       this, 0, selectionEnd);
        }

        // Return false to cancel the event. This makes sure the method is
        // called only once per event.
        return false;
    },

    onReverseComplementSequence: function(e) {
        if(this.SequenceManager) {
            this.SequenceManager.doReverseComplementSequence();

            var seqLen = this.SequenceManager.getSequence().toString().length;

            var newSelectionEnd = seqLen - this.SelectionLayer.start;
            var newSelectionStart = seqLen - this.SelectionLayer.end;

            var oldCaretPosition = this.caretIndex;

            this.application.fireEvent(this.SelectionEvent.SELECTION_CHANGED, 
                                       null, newSelectionStart, newSelectionEnd);

            this.application.fireEvent(this.CaretEvent.CARET_POSITION_CHANGED,
                                       null, seqLen - oldCaretPosition);
        }

        // Return false to cancel the event. This makes sure the method is
        // called only once per event.
        return false;
    },

    // kind is the type of Sequence Changed/Changing that occurs
    // Obj is a SequenceManagerMemento, feature, or some other {} input that needs to be remembered
    onSequenceChanged: function(kind, obj) {
        if(!this.SequenceManager) {
            return;
        }

        Ext.suspendLayouts();

        var manager;
        for(var i = 0; i < this.Managers.length; i++) {
            manager = this.Managers[i];
            if(manager.sequenceChanged) {
                manager.sequenceChanged();
            }
        }

        Ext.resumeLayouts(true);
    },

    onSequenceChanging: function(kind, obj) {
    },

    onAAManagerUpdated: function() {
    },

    onORFManagerUpdated: function() {
    },

    onRestrictionEnzymeManagerUpdated: function() {
    },

    onSelectionChanged: function(scope, start, end) {
    },

    onSelectionCanceled: function() {
        if(this.SelectionLayer && this.SelectionLayer.selected) {
            this.SelectionLayer.deselect();
        }
    },

    onCaretPositionChanged: function(scope, index) {
        if(scope !== this && this.SelectionLayer && 
           !this.SelectionLayer.selecting) {
            this.changeCaretPosition(index, true, true);
        }
    },

    onVectorPanelAnnotationClicked: function(start, end) {
    },

    onAnnotatePanelAnnotationClicked: function(start, end) {
    },

    onShowCutSitesChanged: function(show) {
    },

    onShowFeaturesChanged: function(show) {
    },

    onShowOrfsChanged: function(show) {
    },

    onShowFeatureLabelsChanged: function(show) {
    },

    onShowCutSiteLabelsChanged: function(show) {
    },

    onViewModeChanged: function(viewMode) {
    },

    changeCaretPosition: function(index, silent) {
        this.caretIndex = index;
        if(!silent && this.SequenceManager) {
            this.application.fireEvent(this.CaretEvent.CARET_POSITION_CHANGED,
                                       this, index);
        }
    },

    select: function() {
    }
});
