/**
 * @class Vede.controller.RailController
 * Controller for Rail drawing.
 */
Ext.define('Vede.controller.RailController', {
    extend: 'Vede.controller.SequenceController',

    statics: {
        SELECTION_THRESHOLD: 2 * Math.PI / 360
    },

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
            "#Rail" : {
                mousedown: this.onMousedown,
                mousemove: this.onMousemove,
                mouseup: this.onMouseup
            }
        });
    },

    onLaunch: function() {
        this.callParent(arguments);

        var railContainer;
        var rail;

        this.railManager = Ext.create("Teselagen.manager.RailManager", {
            reference: {x: 0, y: 0},
            railWidth: 300,
            showCutSites: Ext.getCmp("cutSitesMenuItem").checked,
            showFeatures: Ext.getCmp("featuresMenuItem").checked,
            showOrfs: Ext.getCmp("orfsMenuItem").checked
        });

        railContainer = Ext.getCmp('RailContainer');
        rail = this.railManager.getRail();
        railContainer.add(rail);

        // Set the tabindex attribute in order to receive keyboard events on the div.
        railContainer.el.dom.setAttribute("tabindex", "0");
        railContainer.el.on("keydown", this.onKeydown, this);

//        console.log(rail);

//        this.railManager.initRail();

        this.Managers.push(this.railManager);
        railContainer.hide();

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
            this.changeCaretPosition(end);
        }

        this.railManager.rail.surface.add(this.SelectionLayer.selectionSprite);
        this.SelectionLayer.selectionSprite.show(true);
    },

    onSequenceManagerChanged: function(pSeqMan) {
        this.callParent(arguments);

        this.railManager.setOrfs(this.ORFManager.getOrfs());
        this.railManager.setCutSites(this.RestrictionEnzymeManager.getCutSites());
        this.railManager.setFeatures(pSeqMan.getFeatures());

        this.railManager.render();

        this.WireframeSelectionLayer.setSequenceManager(pSeqMan);
        this.SelectionLayer.setSequenceManager(pSeqMan);
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
    onMousedown: function(pEvt, pOpts) {
        this.startSelectionAngle = this.getClickAngle(pEvt);
        this.mouseIsDown = true;


        if(this.railManager.sequenceManager) {
            this.startSelectionIndex = this.bpAtAngle(this.startSelectionAngle);
            this.changeCaretPosition(this.startSelectionIndex);
        }

        this.selectionDirection = 0;
    },

    /**
     * Moves the caret along with the mouse, drawing the wireframe and doing a
     * sticky select (when the ctrl key is not held) as the mouse moves during a
     * click-and-drag.
     */
    onMousemove: function(pEvt, pOpts) {
        var endSelectionAngle = this.getClickAngle(pEvt);
        var start;
        var end;
        var multirend;
        
        if(this.mouseIsDown && Math.abs(this.startSelectionAngle -
                    endSelectionAngle) > this.self.SELECTION_THRESHOLD &&
                    this.railManager.sequenceManager) {

            this.endSelectionIndex = this.bpAtAngle(endSelectionAngle);
            this.railManager.rail.surface.remove(this.WireframeSelectionLayer.selectionSprite, true);

            // Set the direction of selection if it has not yet been determined.
            if(this.selectionDirection == 0) {
                if(this.startSelectionAngle < endSelectionAngle) {
                    this.selectionDirection = -1;
                    if(endSelectionAngle >= this.startSelectionAngle) {
                        this.selectionDirection = 1;
                    }
                } else {
                    this.selectionDirection = 1;
                    if(endSelectionAngle <= this.startSelectionAngle) {
                        this.selectionDirection = -1;
                    }
                }
            }

            if(this.selectionDirection == -1) {
                start = this.endSelectionIndex;
                end = this.startSelectionIndex;
            } else {
                start = this.startSelectionIndex;
                end = this.endSelectionIndex;
            }

            this.WireframeSelectionLayer.startSelecting();
            this.WireframeSelectionLayer.select(start, end);

            this.railManager.rail.surface.add(this.WireframeSelectionLayer.selectionSprite);
            this.WireframeSelectionLayer.selectionSprite.show(true);

            if(pEvt.ctrlKey) {
                this.SelectionLayer.startSelecting();

                this.select(start, end);

                this.application.fireEvent(this.SelectionEvent.SELECTION_CHANGED, 
                                           this,
                                           this.SelectionLayer.start, 
                                           this.SelectionLayer.end);
            } else {
                this.stickySelect(start, end);
            }
            this.changeCaretPosition(end);
        }
    },

    /**
     * Finalizes a selection at the end of a click-and-drag sequence.
     */
    onMouseup: function(pEvt, pOpts) {

        if(this.mouseIsDown) {
            this.mouseIsDown = false;

            if(this.WireframeSelectionLayer.selected && 
                this.WireframeSelectionLayer.selecting) {

                // If this is the end of a click-and-drag, fire a selection event.
                this.WireframeSelectionLayer.endSelecting();
                this.WireframeSelectionLayer.deselect();

                this.SelectionLayer.endSelecting();

                if(this.SelectionLayer.end != -1) {
                    this.changeCaretPosition(this.SelectionLayer.end);
                }

            } else if(this.clickedAnnotationStart && this.clickedAnnotationEnd){
                // If we've clicked a sprite, select it.
                this.select(this.clickedAnnotationStart,
                            this.clickedAnnotationEnd);

                this.application.fireEvent(this.SelectionEvent.SELECTION_CHANGED,
                                           this,
                                           this.SelectionLayer.start,
                                           this.SelectionLayer.end);

                this.clickedAnnotationStart = null;
                this.clickedAnnotationEnd = null;
            } else {
                this.SelectionLayer.deselect();
            }
        }
    },

    select: function(start, end) {
        this.SelectionLayer.select(start, end);

        this.railManager.rail.surface.add(this.SelectionLayer.selectionSprite);
        this.SelectionLayer.selectionSprite.show(true);

        this.changeCaretPosition(this.SelectionLayer.end);
    },

    /**
     * Given a click event, converts the document-relative coordinates to an
     * angle relative to the vertical.
     * @param {Ext.direct.Event} event The click event to determine the angle of.
     */
    getClickAngle: function(event) {
        var el = this.railManager.getRail().surface.el;
        var relX = (event.getX() - (Math.round(el.getBox().x)))/(el.getBox().width);
        var relY = event.getY() - (Math.round(el.getBox().height / 2) + el.getBox().y);;
        var angle = relX;
        return angle;
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
