Ext.define('Vede.controller.AnnotatePanelController', {
    extend: 'Vede.controller.SequenceController',

    requires: ["Teselagen.event.SequenceManagerEvent",
               "Teselagen.event.MapperEvent"],

    AnnotatePanel: null,

    SequenceAnnotationManager: null,

    startHandleResizing: false,
    endHandleResizing: false,

    init: function(){
        this.callParent();

        this.control({
            "#AnnotateContainer" : {
                render: function(c) {
                    c.el.on("mousedown", this.onMousedown, this);
                    c.el.on("mouseup", this.onMouseup, this);
                    c.el.on("mousemove", this.onMousemove, this);
                }
            }
        });

        var listenersObject = {scope: this};
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

        console.log(this.SequenceAnnotationManager.annotator);
        this.AnnotatePanel.add(this.SequenceAnnotationManager.annotator);

        // disable default selection action on the page
        document.onselectstart = function(){return false;};

        this.Managers.push(this.SequenceAnnotationManager);

        this.SelectionLayer = Ext.create("Teselagen.renderer.annotate.SelectionLayer", {
            sequenceAnnotator: this.SequenceAnnotationManager.annotator
        });
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
            this.changeCaretPosition(end);
        }
    },

    onSequenceManagerChanged: function(pSeqMan){
        this.callParent(arguments);
        this.SelectionLayer.setSequenceManager(pSeqMan);
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
            var adjustedX = pEvt.browserEvent.layerX + 10;
            var adjustedY = pEvt.browserEvent.layerY;

            var index = this.SequenceAnnotationManager.bpAtPoint(adjustedX,
                                                                 adjustedY);

            this.mouseIsDown = true;

            this.changeCaretPosition(index);

            if(this.SelectionLayer.selected) {
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
            var x = pEvt.browserEvent.layerX + 10;
            var y = pEvt.browserEvent.layerY;

            var bpIndex = this.SequenceAnnotationManager.bpAtPoint(x, y);

            if(bpIndex == -1) {
                return;
            }

            var endSelectionIndex;

            if(this.startHandleResizing) {
                this.startSelectionIndex = bpIndex;
                this.selectionDirection = 1; // ignore direction on resizing

                this.changeCaretPosition(bpIndex); //NEED TO SET ENDSELECTIONINDEX
            } else if(this.endHandleResizing) {
                endSelectionIndex = bpIndex;
                this.selectionDirection = 1;

                this.changeCaretPosition(endSelectionIndex);
            } else {
                endSelectionIndex = bpIndex; 

                this.changeCaretPosition(endSelectionIndex);
            }

            if(this.SequenceAnnotationManager.annotator.isValidIndex(this.startSelectionIndex) &&
               this.SequenceAnnotationManager.annotator.isValidIndex(endSelectionIndex)) {
                var start = this.startSelectionIndex;
                var end = endSelectionIndex;

                if(this.selectionDirection == 0 && 
                   this.startSelectionIndex != endSelectionIndex) {
                    if(this.startSelectionIndex < endSelectionIndex) {
                        this.selectionDirection = 1;
                    } else {
                        this.selectionDirection = -1;
                    }
                }

                if(this.selectionDirection === -1) {
                    start = endSelectionIndex;
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
        this.SelectionLayer.select(start, end);
        this.changeCaretPosition(this.SelectionLayer.end);
    },

    changeCaretPosition: function(index) {
        this.SequenceAnnotationManager.adjustCaret(index);
        if(this.SequenceAnnotationManager.sequenceManager) {
            this.application.fireEvent(this.CaretEvent.CARET_POSITION_CHANGED,
                                       index);
        }
    },

    onSequenceChanged: function(kind, obj) {
        Ext.each(this.Managers, function(manager) {
            manager.sequenceChanged();
        });

        console.log(kind);
    },

    onActiveEnzymesChanged: function() {
        this.callParent();

        if(this.SequenceAnnotationManager.sequenceManager && 
           this.SequenceAnnotationManager.showCutSites) {
            this.SequenceAnnotationManager.render();
        }
    },

    onSelectionChanged: function() {
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
        this.SequenceAnnotationManager.setShowAminoAcids(show);
        if(this.SequenceAnnotationManager.sequenceManager) {
            this.SequenceAnnotationManager.render();
        }
    },

    onShowRevcomAAChanged: function(show) {
        this.SequenceAnnotationManager.setShowAminoAcidsRevCom(show);
        if(this.SequenceAnnotationManager.sequenceManager) {
            this.SequenceAnnotationManager.render();
        }
    },
});
