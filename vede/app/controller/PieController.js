/**
 * @class Vede.controller.PieController
 * Controller for Pie drawing.
 */
Ext.define('Vede.controller.PieController', {
    requires: ["Teselagen.bio.sequence.DNATools",
               "Teselagen.bio.orf.ORFFinder",
               "Teselagen.manager.RestrictionEnzymeGroupManager",
               "Teselagen.event.CaretEvent",
               "Teselagen.event.SequenceManagerEvent",
               "Teselagen.event.SelectionEvent",
               "Teselagen.event.VisibilityEvent"],

    extend: 'Ext.app.Controller',

    statics: {
        SELECTION_THRESHOLD: 2 * Math.PI / 360
    },

    pieManager: null,
    enzymeGroupManager: null,

    mouseIsDown: false,
    startSelectionAngle: 0,
    startSelectionIndex: 0,

    wireframeSelectionLayer: null,
    selectionLayer: null,

    CaretEvent: null,
    SelectionEvent: null,
    VisibilityEvent: null,

    clickedAnnotationStart: null,
    clickedAnnotationEnd: null,

    /**
     * @member Vede.controller.PieController
     */
    init: function() {

        this.control({
            "#Pie" : {
                mousedown: this.onMousedown,
                mousemove: this.onMousemove,
                mouseup: this.onMouseup
            }
        });

        this.enzymeGroupManager = 
            Teselagen.manager.RestrictionEnzymeGroupManager;

        if(!this.enzymeGroupManager.getIsInitialized) {
            this.enzymeGroupManager.initialize();
        }

        this.CaretEvent = Teselagen.event.CaretEvent;
        this.SelectionEvent = Teselagen.event.SelectionEvent;
        this.VisibilityEvent = Teselagen.event.VisibilityEvent;

        this.application.on("AnnotationClicked", this.onAnnotationClicked, this);

        this.application.on("ViewModeChanged", this.onViewModeChanged, this);

        this.application.on("SequenceManagerChanged",
                            this.onSequenceManagerChanged, this);

        this.application.on(this.VisibilityEvent.SHOW_FEATURES_CHANGED,
                            this.onShowFeaturesChanged, this);
        this.application.on(this.VisibilityEvent.SHOW_CUTSITES_CHANGED,
                            this.onShowCutSitesChanged, this);
        this.application.on(this.VisibilityEvent.SHOW_ORFS_CHANGED,
                            this.onShowOrfsChanged, this);
    },

    /**
     * Catches events from the annotation sprites' onclick listeners. When a
     * mouseup event is detected, we check to see if this.clickedAnnotationStart
     * and end have been defined to see if an annotation has been clicked. If it
     * has we can easily select it.
     */
    onAnnotationClicked: function(start, end) {
        this.clickedAnnotationStart = start;
        this.clickedAnnotationEnd = end;
    },

    onViewModeChanged: function(viewMode) {
        if(viewMode == "linear") {
            Ext.getCmp("PieContainer").hide();
        } else {
            Ext.getCmp("PieContainer").show();
        }
    },

    onSequenceManagerChanged: function(pSeqMan) {
        var orfManager = Ext.create("Teselagen.manager.ORFManager", {
            sequenceManager: pSeqMan,
            minORFSize: 300
        });

        var enzymeManager = Ext.create("Teselagen.manager.RestrictionEnzymeManager", {
            sequenceManager: pSeqMan,
            restrictionEnzymeGroup: this.enzymeGroupManager.getActiveGroup()
        });

        this.pieManager.setSequenceManager(pSeqMan);
        this.pieManager.setOrfs(orfManager.getOrfs());
        this.pieManager.setCutSites(enzymeManager.getCutSites());
        this.pieManager.setFeatures(pSeqMan.getFeatures());

        this.pieManager.render();

        this.wireframeSelectionLayer.setSequenceManager(pSeqMan);
        this.selectionLayer.setSequenceManager(pSeqMan);
    },

    onShowFeaturesChanged: function(show) {
        this.pieManager.setShowFeatures(show);

        if(this.pieManager.sequenceManager) {
            this.pieManager.render();
        }
    },

    onShowCutSitesChanged: function(show) {
        this.pieManager.setShowCutSites(show);

        if(this.pieManager.sequenceManager) {
            this.pieManager.render();
        }
    },

    onShowOrfsChanged: function(show) {
        this.pieManager.setShowOrfs(show);

        if(this.pieManager.sequenceManager) {
            this.pieManager.render();
        }
    },

    onLaunch: function() {
        var pieContainer, pie;

        if(!this.enzymeGroupManager.isInitialized) {
            this.enzymeGroupManager.initialize();
        }

        this.pieManager = Ext.create("Teselagen.manager.PieManager", {
            center: {x: 100, y: 100},
            railRadius: 100,
            showCutSites: Ext.getCmp("cutSitesMenuItem").checked,
            showFeatures: Ext.getCmp("featuresMenuItem").checked,
            showOrfs: Ext.getCmp("orfsMenuItem").checked
        });

        pieContainer = Ext.getCmp('PieContainer');
        pie = this.pieManager.getPie();
        pieContainer.add(pie);
        this.pieManager.initPie();

        this.wireframeSelectionLayer = Ext.create("Teselagen.renderer.pie.WireframeSelectionLayer", {
            center: this.pieManager.center,
            radius: this.pieManager.railRadius
        });

        this.selectionLayer = Ext.create("Teselagen.renderer.pie.SelectionLayer", {
            center: this.pieManager.center,
            radius: this.pieManager.railRadius
        });
    },

    /**
     * Initiates a click-and-drag sequence and moves the caret to click location.
     */
    onMousedown: function(pEvt, pOpts) {
        this.startSelectionAngle = this.getClickAngle(pEvt);
        this.mouseIsDown = true;


        if(this.pieManager.sequenceManager) {
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

        if(this.mouseIsDown && Math.abs(this.startSelectionAngle -
                    endSelectionAngle) > this.self.SELECTION_THRESHOLD &&
                    this.pieManager.sequenceManager) {

            this.endSelectionIndex = this.bpAtAngle(endSelectionAngle);
            this.pieManager.pie.surface.remove(this.wireframeSelectionLayer.selectionSprite, true);

            // Set the direction of selection if it has not yet been determined.
            if(this.selectionDirection == 0) {
                if(this.startSelectionAngle < Math.PI) {
                    this.selectionDirection = -1;
                    if(endSelectionAngle >= this.startSelectionAngle && 
                       endSelectionAngle <= (this.startSelectionAngle + Math.PI)) {
                        this.selectionDirection = 1;
                    }
                } else {
                    this.selectionDirection = 1;
                    if(endSelectionAngle <= this.startSelectionAngle &&
                       endSelectionAngle >= (this.startSelectionAngle - Math.PI)) {
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

            this.wireframeSelectionLayer.startSelecting();
            this.wireframeSelectionLayer.select(start, end);

            this.pieManager.pie.surface.add(this.wireframeSelectionLayer.selectionSprite);
            this.wireframeSelectionLayer.selectionSprite.show(true);

            if(pEvt.ctrlKey) {
                this.selectionLayer.startSelecting();
                this.selectionLayer.select(start, end);

                this.pieManager.pie.surface.add(this.selectionLayer.selectionSprite);
                this.selectionLayer.selectionSprite.show(true);

                this.application.fireEvent(this.SelectionEvent.SELECTION_CHANGED, 
                                           this.selectionLayer.start, 
                                           this.selectionLayer.end);
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

            if(this.wireframeSelectionLayer.selected && 
                this.wireframeSelectionLayer.selecting) {

                // If this is the end of a click-and-drag, fire a selection event.
                this.wireframeSelectionLayer.endSelecting();
                this.wireframeSelectionLayer.deselect();

                this.selectionLayer.endSelecting();

                if(this.selectionLayer.endAngle) {
                    this.changeCaretPosition(this.selectionLayer.end);
                }

                this.application.fireEvent(this.SelectionEvent.SELECTION_CHANGED,
                                           this.selectionLayer.start,
                                           this.selectionLayer.end);
            } else if(this.clickedAnnotationStart && this.clickedAnnotationEnd){
                // If we've clicked a sprite, select it.
                this.selectionLayer.select(this.clickedAnnotationStart,
                                           this.clickedAnnotationEnd);

                this.pieManager.pie.surface.add(this.selectionLayer.selectionSprite);
                this.selectionLayer.selectionSprite.show(true);

                this.changeCaretPosition(this.selectionLayer.end);

                this.application.fireEvent(this.SelectionEvent.SELECTION_CHANGED,
                                           this.selectionLayer.start,
                                           this.selectionLayer.end);

                this.clickedAnnotationStart = null;
                this.clickedAnnotationEnd = null;
            } else {
                this.selectionLayer.deselect();
            }
        }
    },

    /**
     * Given a click event, converts the document-relative coordinates to an
     * angle relative to the vertical.
     * @param {Ext.direct.Event} event The click event to determine the angle of.
     */
    getClickAngle: function(event) {
        var el = this.pieManager.getPie().surface.el;
        var relX = event.getX() - (Math.round(el.getBox().width / 2) + el.getBox().x);
        var relY = event.getY() - (Math.round(el.getBox().height / 2) + el.getBox().y);

        var angle = Math.atan(relY / relX) + Math.PI / 2;
        if(relX < 0) {
            angle += Math.PI;
        }

        return angle;
    },

    /**
     * Returns the nucleotide index of a given angle.
     * @param {Number} angle The angle to return the index of.
     */
    bpAtAngle: function(angle) {
        return Math.floor(angle * 
            this.pieManager.sequenceManager.getSequence().seqString().length
            / (2 * Math.PI));
    },

    /**
     * Changes the caret position to a specified index.
     * @param {Int} index The nucleotide index to move the caret to.
     */
    changeCaretPosition: function(index) {
        this.pieManager.adjustCaret(index);
        if(this.pieManager.sequenceManager) {
            this.application.fireEvent(this.CaretEvent.CARET_POSITION_CHANGED,
                                       index);
        }
    },

    /**
     * Performs a "sticky select"- automatically locks the selection to ends of
     * annotations enclosed in the selection.
     * @param {Int} start The index of where dragging began.
     * @param {Int} end The current index of the caret.
     */
    stickySelect: function(start, end) {
        var annotations = this.pieManager.getAnnotationsInRange(start, end);

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

                this.selectionLayer.startSelecting();
                this.selectionLayer.select(minStart, maxEnd);

                this.pieManager.pie.surface.add(this.selectionLayer.selectionSprite);
                this.selectionLayer.selectionSprite.show(true);
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
                    this.selectionLayer.deselect();
                } else {
                    this.selectionLayer.startSelecting();
                    this.selectionLayer.select(selStart, selEnd);

                    this.pieManager.pie.surface.add(this.selectionLayer.selectionSprite);
                    this.selectionLayer.selectionSprite.show(true);
                }
            }
        } else {
            this.selectionLayer.deselect();
        }
    }
});
