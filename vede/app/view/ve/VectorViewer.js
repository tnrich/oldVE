/**
 * Widget that takes in a SequenceManager object and renders a read-only view 
 * of the sequence.
 * @class Vede.view.ve.VectorViewer
 */
Ext.define("Vede.view.ve.VectorViewer", {
    extend: "Ext.panel.Panel",

    requires: ["Teselagen.manager.VectorViewerManager"],

    statics: {
        PIE_CENTER: {
            x: 107,
            y: 97
        },
        RAIL_RADIUS: 70,
        RAIL_WIDTH: 200,
        RAIL_REFERENCE: {
            x: 7,
            y: 50
        }
    },

    alias: "widget.vectorviewer",
    cls: "VectorViewer",
    floating: true,
    width: 320,
    height: 320,
    part: null,
    sequenceFile: null,
    viewManager: null,
    header: {
        style: {
            cursor: "pointer"
        }
    },
    style: {
        cursor: "pointer"
    },
    listeners: {
        afterrender: function() {
            var self = this;
            this.el.on("click", function() {
                if(self.sequenceFile) {
                    Vede.application.fireEvent(Teselagen.event.ProjectEvent.OPEN_SEQUENCE_IN_VE,
                                               self.sequenceFile);
                } else if(self.part) {
                    Vede.application.fireEvent(Teselagen.event.ProjectEvent.OPEN_SEQUENCE_IN_VE,
                                               self.part.getSequenceFile(), self.part);
                }
            });

            this.el.setStyle("cursor", "pointer");
        }
    },
    items: [{
        xtype: 'container',
        cls: 'vectorViewerContainer'
    }],

    setPart: function(part) {
        this.part = part;

        if(part) {
            this.setSequenceFile(null);

            this.setTitle(part.get("name"));
            this.renderViewer();
        }

        return this;
    },
    setSequenceFile: function(sequenceFile) {
        this.sequenceFile = sequenceFile;

        if(sequenceFile) {
            this.setPart(null);

            this.setTitle(sequenceFile.get("name"));
            this.renderViewer();
        }

        return this;
    },
    renderViewer: function() {
        var self = this;
        if(this.part) {
            this.part.getSequenceFile({
                callback: function(sequenceFile) {
                    //debugger;
                    if(sequenceFile) {
                        var sequenceManager = sequenceFile.getSequenceManager();

                        if(!sequenceManager) {
                            if(sequenceFile.get("sequenceFileContent")) {
                                sequenceManager = Teselagen.manager.SequenceFileManager.sequenceFileToSequenceManager(sequenceFile);
                            } else {
                                self.hide();
                                console.log("No sequence file content.");
                                return;
                            }
                        }

                        if(!this.viewManager) {
                            this.viewManager = Ext.create("Teselagen.manager.VectorViewerManager", {
                                sequenceManager: sequenceManager,
                                center: self.self.PIE_CENTER,
                                railRadius: self.self.RAIL_RADIUS,
                                railWidth: self.self.RAIL_WIDTH,
                                railHeight: 0,
                                railGap: 0,
                                reference: self.self.RAIL_REFERENCE
                            });
                        } else {
                            this.viewManager.setSequenceManager(sequenceManager);
                            this.viewManager.setFeatures(sequenceManager.getFeatures());
                        }

                        this.viewManager.init(self.down('container[cls="vectorViewerContainer"]'));
                        this.viewManager.updateNameBox();
                        this.viewManager.render();

                        this.viewManager.select(self.part.get("genbankStartBP"),
                                                self.part.get("endBP"));
                    }
                }
            });
        } else if(this.sequenceFile) {
            var sequenceManager = this.sequenceFile.getSequenceManager();

            if(!sequenceManager) {
                if(this.sequenceFile.get("sequenceFileContent")) {
                    sequenceManager = Teselagen.manager.SequenceFileManager.sequenceFileToSequenceManager(this.sequenceFile);
                } else {
                    self.hide();
                    console.log("No sequence file content.");
                    return;
                }
            }

            if(!this.viewManager) {
                this.viewManager = Ext.create("Teselagen.manager.VectorViewerManager", {
                    sequenceManager: sequenceManager,
                    center: self.self.PIE_CENTER,
                    railRadius: self.self.RAIL_RADIUS,
                    railWidth: self.self.RAIL_WIDTH,
                    railHeight: 0,
                    railGap: 0,
                    reference: self.self.RAIL_REFERENCE
                });
            } else {
                this.viewManager.setSequenceManager(sequenceManager);
                this.viewManager.setFeatures(sequenceManager.getFeatures());
            }

            this.viewManager.init(self.down('container[cls="vectorViewerContainer"]'));
            this.viewManager.updateNameBox();
            this.viewManager.render();

            this.viewManager.deselect();
        } else {
            return;
        }
    }
});
