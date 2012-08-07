/**
 * @class Vede.controller.PieController
 * Controller for Pie drawing.
 */
Ext.define('Vede.controller.PieController', {
    requires: ["Teselagen.bio.sequence.DNATools",
               "Teselagen.bio.orf.ORFFinder",
               "Teselagen.manager.RestrictionEnzymeGroupManager",
               "Teselagen.event.SequenceManagerEvent",
               "Teselagen.event.SelectionEvent"],

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

    SelectionEvent: null,

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

        this.application.on("SequenceManagerChanged", 
                            this.onSequenceManagerChanged, this);

        this.SelectionEvent = Teselagen.event.SelectionEvent;
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
    
    groupMan: null,

    onLaunch: function() {
        var pieContainer, pie;

        if(!this.enzymeGroupManager.isInitialized) {
            this.enzymeGroupManager.initialize();
        }

        this.pieManager = Ext.create("Teselagen.manager.PieManager", {
            center: {x: 100, y: 100},
            railRadius: 100,
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

    onMousedown: function(pEvt, pOpts) {
        this.startSelectionAngle = this.getClickAngle(pEvt);
        this.mouseIsDown = true;

        this.pieManager.adjustCaret(this.startSelectionAngle);

        if(this.pieManager.sequenceManager) {
            this.startSelectionIndex = this.bpAtAngle(this.startSelectionAngle);
        }

        this.selectionDirection = 0;
    },

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
            this.wireframeSelectionLayer.select(start, end, this.selectionDirection);

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

            this.pieManager.adjustCaret(this.startSelectionAngle);
        }
    },

    onMouseup: function(pEvt, pOpts) {
        this.mouseIsDown = false;

        if(this.wireframeSelectionLayer.selected && 
           this.wireframeSelectionLayer.selecting) {

            this.wireframeSelectionLayer.endSelecting();
            this.wireframeSelectionLayer.deselect();

            this.selectionLayer.endSelecting();

            this.application.fireEvent(this.SelectionEvent.SELECTION_CHANGED,
                                       this.selectionLayer.start,
                                       this.selectionLayer.end);
        }
    },

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

    bpAtAngle: function(angle) {
        return Math.floor(angle * 
            this.pieManager.sequenceManager.getSequence().seqString().length
            / (2 * Math.PI));
    },

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
