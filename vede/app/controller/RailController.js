/**
 * @class Vede.controller.RailController
 * Controller for Rail drawing.
 */
Ext.define('Vede.controller.RailController', {
    extend: 'Vede.controller.SequenceController',

    statics: {
        SELECTION_THRESHOLD: 2 * Math.PI / 360
    },
    
    refs: [
        {ref: "railContainer", selector: "#RailContainer"}
    ],

    railManager: null,

    mouseIsDown: false,
    startSelectionAngle: 0,
    startSelectionIndex: 0,

    clickedAnnotationStart: null,
    clickedAnnotationEnd: null,

    /**
     * @member Vede.controller.RailController
     */
    init: function() {
        this.callParent();

        this.control({
            "#zoomInMenuItem": {
                click: this.onZoomInMenuItemClick
            },
            "#zoomOutMenuItem": {
                click: this.onZoomOutMenuItemClick
            }
        });

    },

    initRail: function() {
        this.railManager.initRail();
        var rail = this.railManager.getRail();
        var self = this;

        rail.on("mousedown", function() {
            self.onMousedown(self);
        });

        rail.on("mouseup", function() {
            self.onMouseup(self);
        });

        rail.on("mousemove", function() {
            self.onMousemove(self);
        });

        // Set the tabindex attribute in order to receive keyboard events on a div.
        this.railContainer.el.dom.setAttribute("tabindex", "0");
        this.railContainer.el.on("keydown", this.onKeydown, this);
    },

    onLaunch: function() {
        var rail;

        this.callParent(arguments);
        this.railContainer = this.getRailContainer();

        this.railManager = Ext.create("Teselagen.manager.RailManager", {
            reference: {x: 0, y: 0},
            railWidth: 300,
            showCutSites: Ext.getCmp("cutSitesMenuItem").checked,
            showFeatures: Ext.getCmp("featuresMenuItem").checked,
            showOrfs: Ext.getCmp("orfsMenuItem").checked
        });

        rail = this.railManager.getRail();
        this.railContainer.add(rail);

        this.Managers.push(this.railManager);
        this.railContainer.hide();

        this.WireframeSelectionLayer = Ext.create("Teselagen.renderer.rail.WireframeSelectionLayer", {
            reference: this.railManager.reference,
            railWidth: this.railManager.railWidth
        });

        this.SelectionLayer = Ext.create("Teselagen.renderer.rail.SelectionLayer", {
            reference: this.railManager.reference,
            railWidth: this.railManager.railWidth
        });
    },

    onKeydown: function(event) {
        this.callParent(arguments);
    },

    onActiveEnzymesChanged: function() {
        this.callParent();

        this.railManager.setCutSites(this.RestrictionEnzymeManager.getCutSites());

        if(this.railManager.sequenceManager && this.railManager.showCutSites) {
            this.railManager.render();
        }
    },

    /**
     * Catches events from the vector panel annotation sprites' onclick listeners. 
     * When a mouseup event is detected, we check to see if 
     * this.clickedAnnotationStart and end have been defined to see if an 
     * annotation has been clicked. If it has we can easily select it.
     */
    onVectorPanelAnnotationClicked: function(start, end) {
        this.clickedAnnotationStart = start;
        this.clickedAnnotationEnd = end;
    },

    onAnnotatePanelAnnotationClicked: function(start, end) {
        this.select(start, end);
    },

    onViewModeChanged: function(viewMode) {
        if(viewMode == "circular") {
            Ext.getCmp("RailContainer").hide();
        } else {
            Ext.getCmp("RailContainer").show();
        }
    },

    onSelectionChanged: function(scope, start, end) {
        if(scope != this) {
            this.SelectionLayer.select(start, end);
            this.changeCaretPosition(start);
        }
    },

    onSequenceManagerChanged: function(pSeqMan) {
        this.callParent(arguments);

        this.railManager.setOrfs(this.ORFManager.getOrfs());
        this.railManager.setCutSites(this.RestrictionEnzymeManager.getCutSites());
        this.railManager.setFeatures(pSeqMan.getFeatures());

        this.railManager.render();

        this.WireframeSelectionLayer.setSequenceManager(pSeqMan);
        this.WireframeSelectionLayer.setSelectionSVG(this.railManager.selectionSVG);

        this.SelectionLayer.setSequenceManager(pSeqMan);
        this.SelectionLayer.setSelectionSVG(this.railManager.selectionSVG);
    },

    onShowFeaturesChanged: function(show) {
        this.railManager.setShowFeatures(show);

        if(this.railManager.sequenceManager) {
            this.railManager.render();
        }
    },

    onShowCutSitesChanged: function(show) {
        this.railManager.setShowCutSites(show);

        if(this.railManager.sequenceManager) {
            this.railManager.render();
        }
    },

    onShowOrfsChanged: function(show) {
        this.railManager.setShowOrfs(show);

        if(this.railManager.sequenceManager) {
            this.railManager.render();
        }
    },

    onShowFeatureLabelsChanged: function(show) {
        this.railManager.setShowFeatureLabels(show);

        if(this.railManager.sequenceManager) {
            this.railManager.render();
        }
    },

    onShowCutSiteLabelsChanged: function(show) {
        this.railManager.setShowCutSiteLabels(show);

        if(this.railManager.sequenceManager) {
            this.railManager.render();
        }
    },

    /**
     * Initiates a click-and-drag sequence and moves the caret to click location.
     */
    onMousedown: function(self) {
        self.startSelectionAngle = self.getClickAngle();
        self.mouseIsDown = true;

        if(self.railManager.sequenceManager) {
            self.startSelectionIndex = self.bpAtAngle(self.startSelectionAngle);
            self.changeCaretPosition(self.startSelectionIndex);
        }

        self.selectionDirection = 0;
    },

    /**
     * Moves the caret along with the mouse, drawing the wireframe and doing a
     * sticky select (when the ctrl key is not held) as the mouse moves during a
     * click-and-drag.
     */
    onMousemove: function(self) {
        var endSelectionAngle = self.getClickAngle();
        var start;
        var end;
        var multirend;
        
        if(self.mouseIsDown && Math.abs(self.startSelectionAngle -
                    endSelectionAngle) > self.self.SELECTION_THRESHOLD &&
                    self.railManager.sequenceManager) {

            self.endSelectionIndex = self.bpAtAngle(endSelectionAngle);

            // Set the direction of selection if it has not yet been determined.
            if(self.selectionDirection == 0) {
                if(self.startSelectionAngle < endSelectionAngle) {
                    self.selectionDirection = -1;
                    if(endSelectionAngle >= self.startSelectionAngle) {
                        self.selectionDirection = 1;
                    }
                } else {
                    self.selectionDirection = 1;
                    if(endSelectionAngle <= self.startSelectionAngle) {
                        self.selectionDirection = -1;
                    }
                }
            }

            if(self.selectionDirection == -1) {
                start = self.endSelectionIndex;
                end = self.startSelectionIndex;
            } else {
                start = self.startSelectionIndex;
                end = self.endSelectionIndex;
            }

            self.WireframeSelectionLayer.startSelecting();
            self.WireframeSelectionLayer.select(start, end);

            if(pEvt.ctrlKey) {
                self.SelectionLayer.startSelecting();

                self.select(start, end);

                self.application.fireEvent(self.SelectionEvent.SELECTION_CHANGED, 
                                           self,
                                           self.SelectionLayer.start, 
                                           self.SelectionLayer.end);
            } else {
                self.stickySelect(start, end);
            }
            self.changeCaretPosition(start);
        }
    },

    /**
     * Finalizes a selection at the end of a click-and-drag sequence.
     */
    onMouseup: function(pEvt, pOpts) {

        if(self.mouseIsDown) {
            self.mouseIsDown = false;

            if(self.WireframeSelectionLayer.selected && 
                self.WireframeSelectionLayer.selecting) {

                // If self is the end of a click-and-drag, fire a selection event.
                self.WireframeSelectionLayer.endSelecting();
                self.WireframeSelectionLayer.deselect();

                self.SelectionLayer.endSelecting();

                if(self.SelectionLayer.end != -1) {
                    self.changeCaretPosition(self.SelectionLayer.start);
                }

            } else if(self.clickedAnnotationStart && self.clickedAnnotationEnd){
                // If we've clicked a sprite, select it.
                self.select(self.clickedAnnotationStart,
                            self.clickedAnnotationEnd);

                self.application.fireEvent(self.SelectionEvent.SELECTION_CHANGED,
                                           self,
                                           self.SelectionLayer.start,
                                           self.SelectionLayer.end);

                self.clickedAnnotationStart = null;
                self.clickedAnnotationEnd = null;
            } else {
                self.SelectionLayer.deselect();
            }
        }
    },

    onZoomInMenuItemClick: function() {
        this.railManager.zoomIn();
    },

    onZoomOutMenuItemClick: function() {
        this.railManager.zoomOut();
    },

    select: function(start, end) {
        this.SelectionLayer.select(start, end);

        this.changeCaretPosition(this.SelectionLayer.start);
    },

    /**
     * Given a click event, converts the document-relative coordinates to an
     * angle relative to the vertical.
     * @param {Ext.direct.Event} event The click event to determine the angle of.
     */
    getClickAngle: function() {
        return d3.event.layerX;
    },

    /**
     * Returns the nucleotide index of a given angle.
     * @param {Number} angle The angle to return the index of.
     */
    bpAtAngle: function(angle) {
        return Math.floor(angle * 
            this.railManager.sequenceManager.getSequence().seqString().length);
    },

    /**
     * Changes the caret position to a specified index.
     * @param {Int} index The nucleotide index to move the caret to.
     */
    changeCaretPosition: function(index) {
        if(index >= 0 && 
           index <= this.SequenceManager.getSequence().toString().length) {
            this.callParent(arguments);
            this.railManager.adjustCaret(index);
        }
    },

    /**
     * Performs a "sticky select"- automatically locks the selection to ends of
     * annotations enclosed in the selection.
     * @param {Int} start The index of where dragging began.
     * @param {Int} end The current index of the caret.
     */
    stickySelect: function(start, end) {
        var annotations = this.railManager.getAnnotationsInRange(start, end);

        if(annotations.length > 0) {
            if(start <= end) { // Selection doesn't touch beginning of sequence.
                var minStart = annotations[0].getStart();
                var maxEnd = annotations[0].getEnd();

                Ext.each(annotations, function(annotation) {
                    if(annotation.getStart() < minStart) {
                        minStart = annotation.getStart();
                    }
                    if(annotation.getEnd() > maxEnd) {
                        maxEnd = annotation.getEnd();
                    }

                });

                this.SelectionLayer.startSelecting();
                this.select(minStart, maxEnd);

                this.application.fireEvent(this.SelectionEvent.SELECTION_CHANGED,
                                           this,
                                           this.SelectionLayer.start,
                                           this.SelectionLayer.end);
            } else { // Selection crosses over the beginning of sequence.
                var minStart1 = -1;
                var maxEnd1 = -1;
                
                var minStart2 = -1;
                var maxEnd2 = -1;
                
                Ext.each(annotations, function(annotation) {
                    if(annotation.getStart() > start) {
                        if(minStart1 == -1) { 
                            minStart1 = annotation.getStart(); 
                        }
                        
                        if(annotation.getStart() < minStart1) { 
                            minStart1 = annotation.getStart(); 
                        }
                    } else {
                        if(minStart2 == -1) { 
                            minStart2 = annotation.getStart(); 
                        }
                        
                        if(annotation.getStart() < minStart2) { 
                            minStart2 = annotation.getStart(); 
                        }
                    }
                    
                    if(annotation.getEnd() > end) {
                        if(maxEnd1 == -1) { 
                            maxEnd1 = annotation.getEnd(); 
                        }
                        
                        if(annotation.getEnd() > maxEnd1) { 
                            maxEnd1 = annotation.getEnd(); 
                        }
                    } else {
                        if(maxEnd2 == -1) { 
                            maxEnd2 = annotation.getEnd(); 
                        }
                        
                        if(annotation.getEnd() > maxEnd2) { 
                            maxEnd2 = annotation.getEnd(); 
                        }
                    }
                });
                
                var selStart = minStart1;
                var selEnd;
                
                if(minStart1 == -1 && minStart2 != -1) {
                    selStart = minStart2;
                } else if(minStart1 != -1 && minStart2 == -1) {
                    selStart = minStart1;
                } else if(minStart1 != -1 && minStart2 != -1) {
                    selStart = minStart1;
                }
                
                if(maxEnd1 == -1 && maxEnd2 != -1) {
                    selEnd = maxEnd2;
                } else if(maxEnd1 != -1 && maxEnd2 == -1) {
                    selEnd = maxEnd1;
                } else if(maxEnd1 != -1 && maxEnd2 != -1) {
                    selEnd = maxEnd2;
                }
                
                if(selEnd == -1 || selStart == -1) {
                    this.SelectionLayer.deselect();
                } else {
                    this.SelectionLayer.startSelecting();
                    this.select(selStart, selEnd);

                    this.application.fireEvent(this.SelectionEvent.SELECTION_CHANGED,
                                               this,
                                               this.SelectionLayer.start,
                                               this.SelectionLayer.end);
                }
            }
        } else {
            this.SelectionLayer.deselect();
        }
    }
});
