/**
 * @class Vede.controller.VectorEditor.PieController
 * Class which handles user input and events specific to the Pie vector view.
 */
Ext.define('Vede.controller.VectorEditor.PieController', {
    extend: 'Vede.controller.VectorEditor.SequenceController',

    requires: ["Teselagen.manager.PieManager",
               "Teselagen.renderer.pie.SelectionLayer",
               "Teselagen.renderer.pie.WireframeSelectionLayer",
               "Teselagen.event.CaretEvent",
               "Teselagen.event.ContextMenuEvent",
               "Teselagen.event.VisibilityEvent"],
    statics: {
        SELECTION_THRESHOLD: 2 * Math.PI / 360,
        PIE_CENTER: {x: 100, y: 100},
        RAIL_RADIUS: 100
    },

    pieManager: null,
    pieContainer: null,
    pieParent: null,

    startSelectionAngle: 0,

    /**
     * @member Vede.controller.VectorEditor.PieController
     */
    init: function() {
        this.callParent();
        this.application.on(Teselagen.event.VisibilityEvent.SHOW_MAP_CARET_CHANGED, this.onShowMapCaretChanged, this);
        this.application.on(Teselagen.event.CaretEvent.PIE_NAMEBOX_CLICKED, this.onPieNameBoxClick, this);

        this.control({
            "#mainAppPanel": {
                beforetabchange: this.onBeforeTabChange,
                tabchange: this.onTabChange
            },
            "menuitem[identifier='zoomInMenuItem']": {
                click: this.onZoomInMenuItemClick
            },
            "menuitem[identifier='zoomOutMenuItem']": {
                click: this.onZoomOutMenuItemClick
            }
        });
    },

    onBeforeTabChange: function(mainAppPanel, newTab, oldTab) {
        // Save the selection to the old tab so we can reselect it when we
        // switch back to it later.
        if(oldTab && oldTab.initialCls === "VectorEditorPanel") {
            if(this.SelectionLayer.selected) {
                oldTab.options.selection = {
                    start: this.SelectionLayer.start,
                    end: this.SelectionLayer.end
                }
            }
        }
    },

    onTabChange: function(mainAppPanel, newTab, oldTab) {
        if(newTab.initialCls == "VectorEditorPanel") {
            // Remove listeners from previous pieContainer.
            if(this.pieContainer && this.pieContainer.el) {
                this.pieContainer.el.un("keydown", this.onKeydown, this);
            }

            this.pieContainer = newTab.down("component[cls='PieContainer']");
            this.initPie(newTab);

            this.pieParent = d3.select("#" + newTab.el.dom.id + " .pieParent");

            this.callParent(arguments);

            // Defer firing the selection event to give the sequence a chance
            // to render.
            Ext.defer(function() {
                this.application.fireEvent(this.SelectionEvent.SELECTION_CHANGED,
                                       null, newTab.options.selection.start,
                                       newTab.options.selection.end);
            }, 10, this);
        }
    },

    initPie: function(newTab) {
        this.pieManager.initPie(newTab);
        var pie = this.pieManager.getPie();
        var self = this;

        pie.on("mousedown", function() {
            self.onMousedown(self);
        });

        pie.on("mouseup", function() {
            self.onMouseup(self);
        });

        pie.on("mousemove", function() {
            self.onMousemove(self);
        });
        pie.on("contextmenu",function() {
            return d3.event.preventDefault();
        });
        // When pie is resized, scale the graphics in the pie.
        this.pieContainer.on("resize", function() {
            this.pieManager.fitWidthToContent(this.pieManager, true);
        }, this);

        // Set the tabindex attribute in order to receive keyboard events on a div.
        this.pieContainer.el.dom.setAttribute("tabindex", "0");
        this.pieContainer.el.on("keydown", this.onKeydown, this);

        if(newTab.down("component[identifier='circularViewMenuItem']").checked) {
            this.pieContainer.show();
        } else {
            this.pieContainer.hide();
        }

        // Set the relevant view options to the tab's saved settings.
        this.pieManager.setShowCutSites(newTab.options.cutSites);
        this.pieManager.setShowFeatures(newTab.options.features);
        this.pieManager.setShowOrfs(newTab.options.orfs);
        this.pieManager.setShowFeatureLabels(newTab.options.featureLabels);
        this.pieManager.setShowCutSiteLabels(newTab.options.cutSiteLabels);
    },

    onLaunch: function() {
        var pie;
        var self = this;

        this.callParent(arguments);

        this.pieManager = Ext.create("Teselagen.manager.PieManager", {
            center: this.self.PIE_CENTER,
            railRadius: this.self.RAIL_RADIUS
        });

        pie = this.pieManager.getPie();

        // When window is resized, scale the graphics in the pie.
        var timeOut = null;

        window.onresize = function(){
            if (timeOut != null)
                clearTimeout(timeOut);

            timeOut = setTimeout(function(){
                self.pieManager.fitWidthToContent(self.pieManager, true);
            }, 400);
        };

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
        // Handle zooming in/out with the +/- keys.
        if(event.getKey() === 187) {
            this.pieManager.zoomIn();
        } else if (event.getKey() === 189) {
            this.pieManager.zoomOut();
        } else {
            this.callParent(arguments);
        }
    },

    onSequenceChanged: function() {
        if(!this.SequenceManager) {
            return;
        }

        var currentTab = Ext.getCmp("mainAppPanel").getActiveTab();

        this.callParent();
        this.pieManager.setCutSites(this.RestrictionEnzymeManager.getCutSites());
        this.pieManager.setOrfs(this.ORFManager.getOrfs());
        this.pieManager.setFeatures(this.SequenceManager.getFeatures());

        this.pieManager.render();

        this.pieManager.updateNameBox();

        if(currentTab.title !== this.SequenceManager.getName()) {
            currentTab.setTitle(this.SequenceManager.getName());
        }
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

    onViewModeChanged: function(viewMode) {
        if(viewMode == "linear") {
            Ext.getCmp("mainAppPanel").getActiveTab().down("component[cls='PieContainer']").hide();
        } else {
            Ext.getCmp("mainAppPanel").getActiveTab().down("component[cls='PieContainer']").show();
        }
    },

    onSelectionChanged: function(scope, start, end) {
        if(scope !== this) {
            this.select(start, end);
        }
    },

    onSequenceManagerChanged: function(pSeqMan) {
        this.callParent(arguments);

        this.pieManager.setOrfs(this.ORFManager.getOrfs());
        this.pieManager.setCutSites(this.RestrictionEnzymeManager.getCutSites());
        this.pieManager.setFeatures(pSeqMan.getFeatures());

        this.pieManager.render();

        this.pieManager.fitWidthToContent(this.pieManager, true);

        this.WireframeSelectionLayer.setSequenceManager(pSeqMan);
        this.WireframeSelectionLayer.setSelectionSVG(this.pieManager.wireframeSVG);

        this.SelectionLayer.setSequenceManager(pSeqMan);
        this.SelectionLayer.setSelectionSVG(this.pieManager.selectionSVG);

        // Set the title of the tab.
        Ext.getCmp("mainAppPanel").getActiveTab().setTitle(pSeqMan.getName());
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
        var frameArray = [];
        for(var i = 0; i < show.length; i++) {
            if(show[i]) {
                frameArray.push(i);
            }
        }

        this.pieManager.setOrfs(this.ORFManager.getOrfsByFrame(frameArray));
        this.pieManager.setShowOrfs(frameArray.length > 0);

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

    onShowMapCaretChanged: function(show) {
        var showMapCaret = this.activeTab.down("component[identifier='mapCaretMenuItem']").checked;
        var angle = this.startSelectionAngle;
        var bp = this.bpAtAngle(angle);
        if (showMapCaret) {
            this.pieManager.caret.svgObject.style("visibility", "visible");
        }
        else {
            this.pieManager.caret.svgObject.style("visibility", "hidden");
        }
    },

    /**
     * Initiates a click-and-drag sequence and moves the caret to click location.
     */
    onMousedown: function(self) {
        if(d3.event.button == 2) {
            d3.event.preventDefault();
            this.onRightMouseDown(self);
        } else {
            Vede.application.fireEvent(Teselagen.event.ContextMenuEvent.PIE_NONRIGHT_MOUSE_DOWN);
            self.startSelectionAngle = self.getClickAngle();
            self.mouseIsDown = true;


            if(self.pieManager.sequenceManager) {
                self.startSelectionIndex = self.bpAtAngle(self.startSelectionAngle);

                self.changeCaretPosition(self.startSelectionIndex);
            }

            self.selectionDirection = 0;
        }
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

        var endSelectionAngle = self.getClickAngle();
        var start;
        var end;

        if(self.mouseIsDown && Math.abs(self.startSelectionAngle -
                    endSelectionAngle) > self.self.SELECTION_THRESHOLD &&
                    self.SequenceManager.getSequence().toString().length > 0 &&
                    self.pieManager.sequenceManager) {

            var endSelectionIndex = self.bpAtAngle(endSelectionAngle);

            // Set the direction of selection if it has not yet been determined.
            if(self.selectionDirection == 0) {
                if(self.startSelectionAngle < Math.PI) {
                    self.selectionDirection = -1;
                    if(endSelectionAngle >= self.startSelectionAngle &&
                       endSelectionAngle <= (self.startSelectionAngle + Math.PI)) {
                        self.selectionDirection = 1;
                    }
                } else {
                    self.selectionDirection = 1;
                    if(endSelectionAngle <= self.startSelectionAngle &&
                       endSelectionAngle >= (self.startSelectionAngle - Math.PI)) {
                        self.selectionDirection = -1;
                    }
                }
            }

            if(self.selectionDirection == -1) {
                start = endSelectionIndex;
                end = self.startSelectionIndex;
            } else {
                start = self.startSelectionIndex;
                end = endSelectionIndex;
            }

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

            self.WireframeSelectionLayer.startSelecting();
            self.WireframeSelectionLayer.select(start, end);
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

                // If self is at the end of a click-and-drag, fire a selection event.
                self.WireframeSelectionLayer.endSelecting();
                self.WireframeSelectionLayer.deselect();

                self.SelectionLayer.endSelecting();

                if(self.SelectionLayer.end != -1) {
                    self.changeCaretPosition(self.SelectionLayer.start);
                }

            } else if(self.clickedAnnotationStart !== null &&
                      self.clickedAnnotationEnd !== null){
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
        this.pieManager.zoomIn();
    },

    onZoomOutMenuItemClick: function() {
        this.pieManager.zoomOut();
    },

    select: function(start, end) {
        if(start == 0 && end == this.SequenceManager.getSequence().toString().length) {
            this.SelectionLayer.select(start, end-1);
        } else {
            this.SelectionLayer.select(start, end);
        }

        // Don't fire a caretPositionChanged event, since controllers will
        // move their caret positions when the select event is fired.
        this.changeCaretPosition(this.SelectionLayer.start, true);
    },

    /**
     * Given a click event, converts the document-relative coordinates to an
     * angle relative to the vertical.
     */
    getClickAngle: function() {
        var svg = this.pieParent;
        var transformValues;
        var scrolled = this.pieContainer.el.getScroll();

        transformValues = svg.attr("transform").match(/[-.\d]+/g);

        var relX = d3.event.layerX - transformValues[4] -
            this.pieManager.center.x * transformValues[0] + scrolled.left;

        var relY = d3.event.layerY - transformValues[5] -
            this.pieManager.center.y * transformValues[3] + scrolled.top;

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
            this.pieManager.sequenceManager.getSequence().seqString().length/ (2 * Math.PI));
    },

    /**
     * Changes the caret position to a specified index.
     * @param {Int} index The nucleotide index to move the caret to.
     * @param {Boolean} silent If true, don't fire a position changed event.
     */
    changeCaretPosition: function(index, silent) {
        if(index >= 0 && this.SequenceManager && this.caretIndex !== index &&
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
    },

    onRightMouseDown: function(self) {
        d3.event.preventDefault();
        Vede.application.fireEvent(Teselagen.event.ContextMenuEvent.PIE_RIGHT_CLICKED);

        var svg = this.pieParent;
        var transformValues;
        var scrolled = this.pieContainer.el.getScroll();

        transformValues = svg.attr("transform").match(/[-.\d]+/g);

        // actualRadius will be accurate only if transformValues[0] == transformValues[3],
        // (i.e., the pie is scaled equally in the x and y directions)
        var actualRadius = this.pieManager.railRadius * transformValues[0];

        var relX = d3.event.layerX - transformValues[4] -
            this.pieManager.center.x * transformValues[0] + scrolled.left;

        var relY = d3.event.layerY - transformValues[5] -
            this.pieManager.center.y * transformValues[3] + scrolled.top;

        var relDist = Math.sqrt(relX*relX+relY*relY);

        var angle = Math.atan(relY / relX) + Math.PI / 2;
        if(relX < 0) {
            angle += Math.PI;
        }

        var startAngle = this.SelectionLayer.startAngle;
        var endAngle = this.SelectionLayer.endAngle;

        if(angle>=startAngle && angle<=endAngle && relDist<=actualRadius) {
            Vede.application.fireEvent(Teselagen.event.ContextMenuEvent.PIE_SELECTION_LAYER_RIGHT_CLICKED);
        }
    },

    onPieNameBoxClick: function(show) {
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






