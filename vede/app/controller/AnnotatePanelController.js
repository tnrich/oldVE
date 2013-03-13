/**
 * @class Vede.controller.AnnotatePanelController
 * Class which handles user input and events specific to the annotate panel.
 */
Ext.define('Vede.controller.AnnotatePanelController', {
    extend: 'Vede.controller.SequenceController',

    requires: ["Teselagen.event.SequenceManagerEvent",
               "Teselagen.event.MapperEvent"],

    AnnotatePanel: null,

    SequenceAnnotationManager: null,

    startHandleResizing: false,
    endHandleResizing: false,

    endSelectionIndex: null,

    init: function(){
        this.callParent();

        this.control({
            "#AnnotateContainer" : {
                render: this.onRender
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

//        this.AnnotatePanel.add(this.SequenceAnnotationManager.annotator);

        // disable default selection action on the page
        document.onselectstart = function(){return false;};

        this.Managers.push(this.SequenceAnnotationManager);

        this.SelectionLayer = Ext.create("Teselagen.renderer.annotate.SelectionLayer", {
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
    
    onKeydown: function(event) {
        this.callParent(arguments);

        if(event.getKey() == event.UP) {
            this.changeCaretPosition(this.caretIndex -
                                     this.SequenceAnnotationManager.bpPerRow);
        } else if(event.getKey() == event.DOWN) {
            this.changeCaretPosition(this.caretIndex +
                                     this.SequenceAnnotationManager.bpPerRow);
        }
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
            this.changeCaretPosition(start);
        }
    },

    onSequenceManagerChanged: function(pSeqMan){
        this.callParent(arguments);
        this.SelectionLayer.setSequenceManager(pSeqMan);

        this.changeCaretPosition(0, true);
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

            this.changeCaretPosition(index);

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

                this.changeCaretPosition(bpIndex); 
            } else if(this.endHandleResizing) {
                this.endSelectionIndex = bpIndex;
                this.selectionDirection = 1;

                this.changeCaretPosition(this.startSelectionIndex);
            } else {
                this.endSelectionIndex = bpIndex; 

                this.changeCaretPosition(this.startSelectionIndex);
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
        this.changeCaretPosition(start);
        this.SelectionLayer.select(start, end);
    },

    changeCaretPosition: function(index, silent) {
        if(index >= 0 &&
           index <= this.SequenceManager.getSequence().toString().length) {
            
            this.callParent(arguments);
            this.SequenceAnnotationManager.adjustCaret(index);
            
            var metrics = this.SequenceAnnotationManager.annotator.bpMetricsByIndex(index);
            var el = Ext.getCmp("AnnotateContainer").el;

            if(!(metrics.getY() < el.getScroll().top + el.getViewSize().height &&
                 metrics.getY() > el.getScroll().top)) {
                el.scrollTo("top", metrics.getY());
            }
        }
    },

    onSequenceChanged: function(kind, obj) {
        this.callParent(arguments);
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
