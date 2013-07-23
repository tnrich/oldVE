/**
 * @class Vede.controller.VectorEditor.RailController
 * Controller for Rail drawing.
 */
Ext.define('Vede.controller.VectorEditor.RailController', {
    extend: 'Vede.controller.VectorEditor.SequenceController',

    requires: ["Teselagen.manager.RailManager",
               "Teselagen.renderer.rail.SelectionLayer",
               "Teselagen.renderer.rail.WireframeSelectionLayer",
               "Teselagen.event.CaretEvent",
               "Teselagen.event.VisibilityEvent"],

    statics: {
        SELECTION_THRESHOLD: 2 * Math.PI / 360
    },
    
    /*refs: [
        {ref: "railContainer", selector: "#RailContainer"}
    ],*/

    railManager: null,

    mouseIsDown: false,
    startSelectionAngle: 0,
    startSelectionIndex: 0,

    clickedAnnotationStart: null,
    clickedAnnotationEnd: null,

    /**
     * @member Vede.controller.VectorEditor.RailController
     */
    init: function() {
        this.callParent();
        this.application.on(Teselagen.event.VisibilityEvent.SHOW_MAP_CARET_CHANGED, this.onShowMapCaretChanged, this);
        this.application.on(Teselagen.event.CaretEvent.RAIL_NAMEBOX_CLICKED, this.onRailNameBoxClick, this);

        this.control({
            "#mainAppPanel": {
                tabchange: this.onTabChange
            },
            "menuitem[cls='zoomInMenuItem']": {
                click: this.onZoomInMenuItemClick
            },
            "menuitem[cls='zoomOutMenuItem']": {
                click: this.onZoomOutMenuItemClick
            }
        });

    },

    onTabChange: function(mainAppPanel, newTab, oldTab) {
        if(newTab.initialCls == "VectorEditorPanel") {
            if(this.railContainer && this.railContainer.el) {
                this.railContainer.el.un("keydown", this.onKeydown, this);
            }

            this.railContainer = newTab.down("component[cls='RailContainer']");
            this.initRail(newTab);
        }

        this.callParent(arguments);
    },

    initRail: function(newTab) {
        this.railManager.initRail(newTab);
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
        
        rail.on("contextmenu", function() {
            self.onRightMouseDown(self);
        });

        // When rail is resized, scale the graphics in the rail.
        this.railContainer.on("resize", function() {
            this.railManager.fitWidthToContent(this.railManager);
        }, this);

        // Set the tabindex attribute in order to receive keyboard events on a div.
        this.railContainer.el.dom.setAttribute("tabindex", "0");
        this.railContainer.el.on("keydown", this.onKeydown, this);

        if(newTab.down("menucheckitem[identifier*='circularViewMenuItem']").checked) {
            this.railContainer.hide();
        }
    },

    onLaunch: function() {
        var rail;
        var self = this;

        this.callParent(arguments);

        this.railManager = Ext.create("Teselagen.manager.RailManager", {
            reference: {x: 0, y: 0},
            railWidth: 400,
        });

        // When window is resized, scale the graphics in the rail.
        var timeOut = null;

        window.onresize = function(){
            if (timeOut != null)
                clearTimeout(timeOut);

            timeOut = setTimeout(function(){
                self.railManager.fitWidthToContent(self.railManager);
            }, 400);
        };

        this.Managers.push(this.railManager);

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
        // Handle zooming in/out with the +/- keys.
        if(event.getKey() === 187) {
            this.railManager.zoomIn();
        } else if (event.getKey() === 189) {
            this.railManager.zoomOut();
        } else {
            this.callParent(arguments);
        }
    },

    onSequenceChanged: function() {
        if(!this.SequenceManager) {
            return;
        }

        this.callParent();
        this.railManager.setCutSites(this.RestrictionEnzymeManager.getCutSites());
        this.railManager.setOrfs(this.ORFManager.getOrfs());
        this.railManager.setFeatures(this.SequenceManager.getFeatures());

        this.railManager.render();

        this.railManager.updateNameBox();
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

    onViewModeChanged: function(viewMode) {
        if(viewMode == "circular") {
            this.activeTab.down("component[cls='RailContainer']").hide();
        } else {
            this.activeTab.down("component[cls='RailContainer']").show();
        }
    },

    onSelectionChanged: function(scope, start, end) {
        if(scope != this) {
            this.SelectionLayer.select(start, end);
            this.changeCaretPosition(start, true);
        }
    },

    onSequenceManagerChanged: function(pSeqMan) {
        this.callParent(arguments);

        this.railManager.setOrfs(this.ORFManager.getOrfs());
        this.railManager.setCutSites(this.RestrictionEnzymeManager.getCutSites());
        this.railManager.setFeatures(pSeqMan.getFeatures());

        this.railManager.render();

        this.WireframeSelectionLayer.setSequenceManager(pSeqMan);
        this.WireframeSelectionLayer.setSelectionSVG(this.railManager.wireframeSVG);

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

    onShowMapCaretChanged: function(show) {
        var showMapCaret = this.activeTab.down("component[identifier='mapCaretMenuItem']").checked;
        var angle = this.startSelectionAngle;
        var bp = this.bpAtAngle(angle);
        if (showMapCaret) {
            this.railManager.caret.svgObject.style("visibility", "visible");
        }
        else {
            this.railManager.caret.svgObject.style("visibility", "hidden");
        }
    },

    /**
     * Initiates a click-and-drag sequence and moves the caret to click location.
     */
    onMousedown: function(self) {
    	
    	if(d3.event.button == 2) {				//
    		d3.event.preventDefault();			//
    		return;								//
    	}										//
    	
    	self.startSelectionAngle = self.getClickLocation();  	
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
    	if(d3.event.button == 2) {
    		d3.event.preventDefault();
    		return;
    	}
    	var endSelectionAngle = self.getClickLocation();
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

            if(d3.event.ctrlKey) {
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
    onMouseup: function(self) {

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
                self.application.fireEvent(self.SelectionEvent.SELECTION_CANCELED);
            }
        } else if(d3.event.button == 2) {
        	d3.event.preventDefault();
        	if(self.clickedAnnotationStart !== null && 
                self.clickedAnnotationEnd !== null){
    			
    			self.select(self.clickedAnnotationStart,
                            self.clickedAnnotationEnd);

    			self.application.fireEvent(self.SelectionEvent.SELECTION_CHANGED,
                                           self,
                                           self.SelectionLayer.start,
                                           self.SelectionLayer.end);

    			self.clickedAnnotationStart = null;
    			self.clickedAnnotationEnd = null;
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

        this.changeCaretPosition(this.SelectionLayer.start, true);
    },

    /**
     * Given a click event, converts the document-relative coordinates to a
     * value representing where the user clicked as a proportion of the total
     * length of the sequence.
     * @param {Ext.direct.Event} event The click event to determine the angle of.
     */
    getClickLocation: function() {
        var svg = d3.select(".railParent");
        var transformValues;
        var scrolled = this.railContainer.el.getScroll();

        transformValues = svg.attr("transform").match(/[-.\d]+/g);

        var fraction = (d3.event.layerX - transformValues[4] + scrolled.left) / 
                        (d3.select(".railParent > rect")[0][0].width.baseVal.value * transformValues[0]);

        if(fraction > 1) {
            fraction = 1;
        }

        return fraction;
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
     * @param {Boolean} silent If true, don't fire a position changed event.
     */
    changeCaretPosition: function(index, silent) {
        if(index >= 0 && this.caretIndex !== index &&
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
    },
    
    onRightMouseDown: function(self) {
    	d3.event.preventDefault();
    	Vede.application.fireEvent(Teselagen.event.ContextMenuEvent.PIE_RIGHT_CLICKED);
		var svg = d3.select(".railParent");
	    var transformValues;
	    var scrolled = this.railContainer.el.getScroll();
	
	    transformValues = svg.attr("transform").match(/[-.\d]+/g);
	    
	    var relX = d3.event.layerX - transformValues[4] + scrolled.left;
	    var relY = d3.event.layerY - transformValues[5] + scrolled.top; 
	    var fraction = (d3.event.layerX - transformValues[4] + scrolled.left) / 
        (d3.select(".railParent > rect")[0][0].width.baseVal.value * transformValues[0]);
	    
	    var wireHeight = (this.SelectionLayer.reference.y + this.SelectionLayer.self.WIREFRAME_OFFSET)* transformValues[3];
	    
	    var startAngle = this.SelectionLayer.startAngle;
        var endAngle = this.SelectionLayer.endAngle;
        if(fraction>=startAngle&&fraction<=endAngle&&relY>=-wireHeight&&relY<=wireHeight+2) {
        	d3.event.preventDefault();
    		var contextMenu = Ext.create('Ext.menu.Menu',{items: []});
    		contextMenu.add({
        	  text: 'Annotate as new Sequence Feature',
        	  handler: function() {
        		  var createNewFeatureWindow = Ext.create("Vede.view.ve.CreateNewFeatureWindow");     	
        		  createNewFeatureWindow.show();
        		  createNewFeatureWindow.center();
        	  }
    		});
    		
    		contextMenu.show(); 
            contextMenu.setPagePosition(d3.event.pageX+1,d3.event.pageY-5);
        }
    },

    onRailNameBoxClick: function() {
        var menuitem = this.activeTab.down("component[identifier='mapCaretMenuItem']");
        var checked = menuitem.checked;

        if (checked) {
            menuitem.setChecked(false);
        }
        else {
            menuitem.setChecked(true);
        }
    }
});






