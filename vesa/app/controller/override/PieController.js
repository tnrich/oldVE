Ext.define('Vesa.controller.override.PieController', {
    requires: 'Vesa.controller.PieController'
}, function() {
    Ext.override(Vesa.controller.PieController, {
        extend: 'Vesa.controller.SequenceController',

    refs: [
        {ref: "pieContainer", selector: "#PieContainer"}
    ],
    
    statics: {
        SELECTION_THRESHOLD: 2 * Math.PI / 360
    },

    pieManager: null,
    pieContainer: null,

    startSelectionAngle: 0,

    /**
     * @member Vesa.controller.PieController
     */
    init: function() {
        this.callParent();

        this.control({
            "#Pie" : {
                mousedown: this.onMousedown,
                mousemove: this.onMousemove,
                mouseup: this.onMouseup,
            }
        });
    },

    initPie: function() {
        this.pieManager.initPie();
        // Set the tabindex attribute in order to receive keyboard events on a div.
        this.pieContainer.el.dom.setAttribute("tabindex", "0");
        this.pieContainer.el.on("keydown", this.onKeydown, this);
    },
    
    onLaunch: function() {
        var pie;

        this.callParent(arguments);
        this.pieContainer = this.getPieContainer();

        this.pieManager = Ext.create("Teselagen.manager.PieManager", {
            center: {x: 100, y: 100},
            railRadius: 100,
            showCutSites: Ext.getCmp("cutSitesMenuItem").checked,
            showFeatures: Ext.getCmp("featuresMenuItem").checked,
            showOrfs: Ext.getCmp("orfsMenuItem").checked
        });

        this.Managers.push(this.pieManager);

        pie = this.pieManager.getPie();
        this.pieContainer.add(pie);

        this.Managers.push(this.pieManager);

        this.WireframeSelectionLayer = Ext.create("Teselagen.renderer.pie.WireframeSelectionLayer", {
            center: this.pieManager.center,
            radius: this.pieManager.railRadius
        });

        this.SelectionLayer = Ext.create("Teselagen.renderer.pie.SelectionLayer", {
            center: this.pieManager.center,
            radius: this.pieManager.railRadius
        });
    },

    onKeydown: function(event) {
        this.callParent(arguments);
    },

    onSequenceChanged: function() {
        if(!this.SequenceManager) {
            return;
        }

        this.callParent();
        this.pieManager.setCutSites(this.RestrictionEnzymeManager.getCutSites());
        this.pieManager.setOrfs(this.ORFManager.getOrfs());
        this.pieManager.setFeatures(this.SequenceManager.getFeatures());

        this.pieManager.render();
    },

    onActiveEnzymesChanged: function() {
        this.callParent();

        this.pieManager.setCutSites(this.RestrictionEnzymeManager.getCutSites());

        if(this.pieManager.sequenceManager && this.pieManager.showCutSites) {
            this.pieManager.render();
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
        if(viewMode == "linear") {
            Ext.getCmp("PieContainer").hide();
        } else {
            Ext.getCmp("PieContainer").show();
        }
    },

    onSelectionChanged: function(scope, start, end) {
        if(scope !== this) {
            this.SelectionLayer.select(start, end);
            this.changeCaretPosition(end);
        }

        this.pieManager.pie.surface.add(this.SelectionLayer.selectionSprite);
        this.SelectionLayer.selectionSprite.show(true);
    },

    onSequenceManagerChanged: function(pSeqMan) {
        this.callParent(arguments);

        this.pieManager.setOrfs(this.ORFManager.getOrfs());
        this.pieManager.setCutSites(this.RestrictionEnzymeManager.getCutSites());
        this.pieManager.setFeatures(pSeqMan.getFeatures());

        this.pieManager.render();

        this.WireframeSelectionLayer.setSequenceManager(pSeqMan);
        this.SelectionLayer.setSequenceManager(pSeqMan);
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

    onShowFeatureLabelsChanged: function(show) {
        this.pieManager.setShowFeatureLabels(show);

        if(this.pieManager.sequenceManager) {
            this.pieManager.render();
        }
    },

    onShowCutSiteLabelsChanged: function(show) {
        this.pieManager.setShowCutSiteLabels(show);

        if(this.pieManager.sequenceManager) {
            this.pieManager.render();
        }
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

            var endSelectionIndex = this.bpAtAngle(endSelectionAngle);
            this.pieManager.pie.surface.remove(this.WireframeSelectionLayer.selectionSprite, true);

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
                start = endSelectionIndex;
                end = this.startSelectionIndex;
            } else {
                start = this.startSelectionIndex;
                end = endSelectionIndex;
            }

            this.WireframeSelectionLayer.startSelecting();
            this.WireframeSelectionLayer.select(start, end);

            this.pieManager.pie.surface.add(this.WireframeSelectionLayer.selectionSprite);
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
                this.application.fireEvent(this.SelectionEvent.SELECTION_CANCELED);
            }
        }
    },

    select: function(start, end) {
        if(start == 0 && end == this.SequenceManager.getSequence().toString().length) {
            this.SelectionLayer.select(start, end-1);
        } else {
            this.SelectionLayer.select(start, end);
        }

        this.pieManager.pie.surface.add(this.SelectionLayer.selectionSprite);
        this.SelectionLayer.selectionSprite.show(true);

        this.changeCaretPosition(this.SelectionLayer.end);
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
     * @param {Boolean} silent If true, don't fire a position changed event.
     */
    changeCaretPosition: function(index, silent) {
        if(index >= 0 &&
           index <= this.SequenceManager.getSequence().toString().length) {
            this.callParent(arguments);
            this.pieManager.adjustCaret(index);
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
                    this.application.fireEvent(
                        this.SelectionEvent.SELECTION_CANCELED);
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
            this.application.fireEvent(this.SelectionEvent.SELECTION_CANCELED);
        }
    }
    });
});