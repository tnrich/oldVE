/**
 * @class Vede.controller.AnnotatePanelController
 * Class which handles user input and events specific to the annotate panel.
 */
Ext.define('Vede.controller.AnnotatePanelController', {
    extend: 'Vede.controller.SequenceController',

    requires: ["Teselagen.event.SequenceManagerEvent",
               "Teselagen.event.MapperEvent",
               "Teselagen.manager.SequenceAnnotationManager",
               "Teselagen.renderer.annotate.HighlightLayer",
               "Teselagen.renderer.annotate.SelectionLayer"],

    statics: {
        MIN_BP_PER_ROW: 20
    },

    AnnotatePanel: null,

    SequenceAnnotationManager: null,

    HighlightLayer: null,

    startHandleResizing: false,
    endHandleResizing: false,

    endSelectionIndex: null,

    init: function(){

        this.callParent();

        this.control({
            "#AnnotateContainer" : {
                render: this.onRender
            },
            "#AnnotatePanel": {
                resize: this.onResize,
                beforecollapse: this.onBeforeCollapse
            }
        });

        var listenersObject = {scope: this};

        listenersObject[this.MenuItemEvent.CUT] = this.cutSelection;
        listenersObject[this.MenuItemEvent.COPY] = this.copySelection;
        listenersObject[this.MenuItemEvent.PASTE] = this.pasteFromClipboard;

        listenersObject[this.MenuItemEvent.GOTO_WINDOW_OPENED] = this.onGoToWindowOpened;

        listenersObject[this.VisibilityEvent.SHOW_COMPLEMENTARY_CHANGED] = 
            this.onShowComplementaryChanged;
        listenersObject[this.VisibilityEvent.SHOW_SPACES_CHANGED] = 
            this.onShowSpacesChanged;
        listenersObject[this.VisibilityEvent.SHOW_SEQUENCE_AA_CHANGED] = 
            this.onShowSequenceAAChanged;
        listenersObject[this.VisibilityEvent.SHOW_REVCOM_AA_CHANGED] = 
            this.onShowRevcomAAChanged;

        listenersObject[this.SelectionLayerEvent.HANDLE_CLICKED] = 
            this.onHandleClicked;
        listenersObject[this.SelectionLayerEvent.HANDLE_RELEASED] =
            this.onHandleReleased;

        listenersObject[this.SelectionEvent.HIGHLIGHT] = this.onHighlight;
        listenersObject[this.SelectionEvent.CLEAR_HIGHLIGHT] = this.onClearHighlight;

        this.application.on(listenersObject);
    },

    onLaunch: function() {
        this.callParent();

        this.AnnotatePanel = Ext.getCmp('AnnotateContainer');

        this.SequenceAnnotationManager = Ext.create("Teselagen.manager.SequenceAnnotationManager", {
            sequenceManager: this.SequenceManager,
            orfManager: this.ORFManager,
            aaManager: this.AAManager,
            restrictionEnzymeManager: this.RestrictionEnzymeManager,
            annotatePanel: this.AnnotatePanel,
        });

//        this.AnnotatePanel.add(this.SequenceAnnotationManager.annotator);

        // disable default selection action on the page
        document.onselectstart = function(){return false;};

        this.Managers.push(this.SequenceAnnotationManager);

        this.SelectionLayer = Ext.create("Teselagen.renderer.annotate.SelectionLayer", {
            sequenceAnnotator: this.SequenceAnnotationManager.annotator
        });

        this.HighlightLayer = Ext.create("Teselagen.renderer.annotate.HighlightLayer", {
            sequenceAnnotator: this.SequenceAnnotationManager.annotator
        });
    },

    onRender: function(pCmp) {
        pCmp.el.on("mousedown", this.onMousedown, this);
        pCmp.el.on("mouseup", this.onMouseup, this);
        pCmp.el.on("mousemove", this.onMousemove, this);
        // Set the tabindex attribute in order to receive keyboard events on the div.
        pCmp.el.dom.setAttribute("tabindex", "0");
        pCmp.el.on("keydown", this.onKeydown, this);
        this.SequenceAnnotationManager.annotator.init();
    },

    onResize: function(annotatePanel, width, height, oldWidth, oldHeight) {
        // Calculate the BP's per row, rounded to the nearest 10.
        var newBpPerRow = Math.floor((width - 60) / 10 / 10) * 10;
        var selectionStart;
        var selectionEnd;

        if(newBpPerRow < this.self.MIN_BP_PER_ROW) {
            newBpPerRow = this.self.MIN_BP_PER_ROW;
        }

        this.SequenceAnnotationManager.setBpPerRow(newBpPerRow);

        if(this.SequenceManager) {
            this.SequenceAnnotationManager.render();

            this.SelectionLayer.refresh();
        }
    },
    
    onKeydown: function(event) {
        this.callParent(arguments);

        if(event.getKey() == event.UP) {
            this.changeCaretPosition(this.caretIndex -
                                     this.SequenceAnnotationManager.bpPerRow,
                                     false,
                                     true);
        } else if(event.getKey() == event.DOWN) {
            this.changeCaretPosition(this.caretIndex +
                                     this.SequenceAnnotationManager.bpPerRow,
                                     false,
                                     true);
        }
    },

    cutSelection: function() {
        this.callParent(arguments);
    },

    copySelection: function() {
        this.callParent(arguments);
    },

    pasteSelection: function() {
        this.callParent(arguments);
    },

    onGoToWindowOpened: function(goToWindow) {
        var numberField = goToWindow.down("numberfield");

        goToWindow.CaretEvent = this.CaretEvent;
        
        numberField.on("keyup", function(field, event) {
            if(event.getKey() === event.ENTER) {
                goToWindow.goto();
            }
        }, this);

        goToWindow.show();

        numberField.setValue(this.caretIndex + 1);
        numberField.setMaxValue(
                        this.SequenceManager.getSequence().getSymbolsLength());

        numberField.maxText = "Position must be at most " + numberField.maxValue + ".";

        numberField.focus(true, 10);
    },

    onHandleClicked: function(type) {
        if(type == "left") {
            this.startHandleResizing = true;
        } else {
            this.endHandleResizing = true;
        }
    },

    onHandleReleased: function() {
        this.startHandleResizing = false;
        this.endHandleResizing = false;
    },

    onHighlight: function(indices) {
        this.HighlightLayer.clearHighlights();
        this.HighlightLayer.addAllHighlights(indices);
    },

    onClearHighlight: function() {
        this.HighlightLayer.clearHighlights();
    },

    onVectorPanelAnnotationClicked: function(start, end) {
        this.select(start, end);
    },

    onAnnotatePanelAnnotationClicked: function(start, end) {
        this.clickedAnnotationStart = start;
        this.clickedAnnotationEnd = end;
    },

    onSelectionChanged: function(scope, start, end) {
        if(scope !== this) {
            this.SelectionLayer.select(start, end);
            this.changeCaretPosition(start, false, true);
        }
    },

    onSequenceManagerChanged: function(pSeqMan){
        this.callParent(arguments);
        this.SelectionLayer.setSequenceManager(pSeqMan);
        this.HighlightLayer.setSequenceManager(pSeqMan);

        this.changeCaretPosition(0, true, true);
    },

    onShowFeaturesChanged: function(show) {
        this.SequenceAnnotationManager.setShowFeatures(show);

        if(this.SequenceAnnotationManager.sequenceManager) {
            this.SequenceAnnotationManager.render();
        }
    },

    onShowCutSitesChanged: function(show) {
        this.SequenceAnnotationManager.setShowCutSites(show);

        if(this.SequenceAnnotationManager.sequenceManager) {
            this.SequenceAnnotationManager.render();
        }
    },

    onShowOrfsChanged: function(show) {
        this.SequenceAnnotationManager.setShowOrfs(show);

        if(this.SequenceAnnotationManager.sequenceManager) {
            this.SequenceAnnotationManager.render();
        }
    },

    onMousedown: function(pEvt, pOpts) {
        if(this.SequenceAnnotationManager.sequenceManager) {
            var el = Ext.getCmp("AnnotateContainer").el;
            var adjustedX = pEvt.getX() - el.getX();
            var adjustedY = pEvt.getY() + el.getScroll().top - el.getY();

            var index = this.SequenceAnnotationManager.bpAtPoint(adjustedX,
                                                                 adjustedY);

            this.mouseIsDown = true;

            this.changeCaretPosition(index, false, true);

            if(this.SelectionLayer.selected && 
               pEvt.target.id !== "selectionRectangle") {
                this.SelectionLayer.deselect();
                this.application.fireEvent(
                    this.SelectionEvent.SELECTION_CANCELED);
            }

            if(!this.startHandleResizing && !this.endHandleResizing) {
                this.startSelectionIndex = index;
                this.selectionDirection = 0;
            }
        }
    },

    onMousemove: function(pEvt, pOpts) {
        if(this.mouseIsDown) {
            var el = Ext.getCmp("AnnotateContainer").el;
            var x = pEvt.getX() - el.getX();
            var y = pEvt.getY() + el.getScroll().top - el.getY();

            var bpIndex = this.SequenceAnnotationManager.bpAtPoint(x, y);

            if(bpIndex == -1) {
                return;
            }

            if(this.startHandleResizing) {
                this.startSelectionIndex = bpIndex;
                this.selectionDirection = 1; // ignore direction on resizing

                this.changeCaretPosition(bpIndex, false, false); 
            } else if(this.endHandleResizing) {
                this.endSelectionIndex = bpIndex;
                this.selectionDirection = 1;

                this.changeCaretPosition(this.startSelectionIndex, false, false);
            } else {
                this.endSelectionIndex = bpIndex; 

                this.changeCaretPosition(this.endSelectionIndex, false, false);
            }
                
            if(this.SequenceAnnotationManager.annotator.isValidIndex(this.startSelectionIndex) &&
               this.SequenceAnnotationManager.annotator.isValidIndex(this.endSelectionIndex)) {
                var start = this.startSelectionIndex;
                var end = this.endSelectionIndex;

                if(this.selectionDirection == 0 && 
                   this.startSelectionIndex != this.endSelectionIndex) {
                    if(this.startSelectionIndex < this.endSelectionIndex) {
                        this.selectionDirection = 1;
                    } else {
                        this.selectionDirection = -1;
                    }
                }

                if(this.selectionDirection === -1) {
                    start = this.endSelectionIndex;
                    end = this.startSelectionIndex;
                }

                this.SelectionLayer.startSelecting();
                this.SelectionLayer.select(start, end);
            }
        }
    },

    onMouseup: function(pEvt, pOpts) {
        if(!(this.mouseIsDown || this.startHandleResizing || 
             this.endHandleResizing)) {
            return;
        }

        this.startHandleResizing = false;
        this.endHandleResizing = false;

        this.mouseIsDown = false;
        
        if(this.SelectionLayer.selected && this.SelectionLayer.selecting) {
            this.SelectionLayer.endSelecting();
            this.application.fireEvent(this.SelectionEvent.SELECTION_CHANGED,
                                       this,
                                       this.SelectionLayer.start,
                                       this.SelectionLayer.end);

            // Depending on selection direction, move caret either to start or 
            // end of selection.
            if(this.selectionDirection === 1) {
                this.changeCaretPosition(this.SelectionLayer.end, false, false);
            } else {
                this.changeCaretPosition(this.SelectionLayer.start, false, false);
            }
        } else if(this.clickedAnnotationStart && this.clickedAnnotationEnd) {
            // If we've clicked a sprite, select it.
            this.SelectionLayer.endSelecting();
            this.select(this.clickedAnnotationStart, this.clickedAnnotationEnd);

            this.clickedAnnotationStart = null;
            this.clickedAnnotationEnd = null;

            this.application.fireEvent(this.SelectionEvent.SELECTION_CHANGED,
                                       this,
                                       this.SelectionLayer.start,
                                       this.SelectionLayer.end);
        } else {
            this.SelectionLayer.deselect();
            this.application.fireEvent(this.SelectionEvent.SELECTION_CANCELED);
        }
    },

    select: function(start, end) {
        this.changeCaretPosition(start, false, true);
        this.SelectionLayer.select(start, end);
    },

    changeCaretPosition: function(index, silent, scrollToCaret) {
        if(index >= 0 &&
           index <= this.SequenceManager.getSequence().toString().length) {
            
            this.callParent(arguments);
            this.SequenceAnnotationManager.adjustCaret(index);

            // Only scroll to the location of the caret if we're not currently
            // dragging to make a selection.
            if(scrollToCaret) {
                var metrics = this.SequenceAnnotationManager.annotator.bpMetricsByIndex(index);
                var el = Ext.getCmp("AnnotateContainer").el;

                if(!(metrics.getY() < el.getScroll().top + el.getViewSize().height &&
                     metrics.getY() > el.getScroll().top)) {
                    el.scrollTo("top", metrics.getY());
                }
            }
        }
    },

    onSequenceChanged: function(kind, obj) {
        this.callParent(arguments);

        this.SelectionLayer.refresh();
        this.changeCaretPosition(this.caretIndex, true, false);
    },

    onActiveEnzymesChanged: function() {
        this.callParent();

        if(this.SequenceAnnotationManager.sequenceManager && 
           this.SequenceAnnotationManager.showCutSites) {
            this.SequenceAnnotationManager.render();
        }
    },

    onSelectionChanged: function(scope, start, end) {
        if(scope !== this) {
            this.select(start, end);
        }
    },

    onSequenceChanging: function(kind, obj) {
    },

    onAAManagerUpdated: function() {
    },

    onORFManagerUpdated: function() {
    },

    onRestrictionEnzymeManagerUpdated: function() {
    },

    onShowComplementaryChanged: function(show) {
        this.SequenceAnnotationManager.setShowComplementarySequence(show);
        if(this.SequenceAnnotationManager.sequenceManager) {
            this.SequenceAnnotationManager.render();
        }
    },

    onShowSpacesChanged: function(show) {
        this.SequenceAnnotationManager.setShowSpaceEvery10Bp(show);
        if(this.SequenceAnnotationManager.sequenceManager) {
            this.SequenceAnnotationManager.render();
        }
    },

    onShowSequenceAAChanged: function(show) {
        var start = this.SelectionLayer.start;
        var end = this.SelectionLayer.end;

        this.SequenceAnnotationManager.setShowAminoAcids(show);
        if(this.SequenceAnnotationManager.sequenceManager) {
            this.SequenceAnnotationManager.render();

            this.SelectionLayer.deselect();
            this.select(start, end);
        }
    },

    onShowRevcomAAChanged: function(show) {
        var start = this.SelectionLayer.start;
        var end = this.SelectionLayer.end;

        this.SequenceAnnotationManager.setShowAminoAcidsRevCom(show);
        if(this.SequenceAnnotationManager.sequenceManager) {
            this.SequenceAnnotationManager.render();

            this.SelectionLayer.deselect();
            this.select(start, end);
        }
    },

    onBeforeCollapse: function() {
        var vectorPanel = Ext.getCmp("VectorPanel");
        if (vectorPanel.collapsed) {
            vectorPanel.expand()
        }
    }
});
