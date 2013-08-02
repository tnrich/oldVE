/**
 * Widget that takes in a SequenceManager object and renders a read-only view 
 * of the sequence.
 * @class Vede.view.ve.VectorViewer
 */
Ext.define("Vede.view.ve.VectorViewer", {
    extend: "Ext.panel.Panel",
    alias: "widget.vectorviewer",
    cls: "VectorViewer",
    floating: true,
    width: 320,
    height: 320,
    part: null,
    viewManager: null,
    setPart: function(part) {
        this.part = part;
        this.setTitle(part.get("name"));
        this.renderViewer();

        return this;
    },
    renderViewer: function() {
        var self = this;
        this.part.getSequenceFile({
            callback: function(sequenceFile) {
                if(sequenceFile) {
                    var sequenceManager = sequenceFile.getSequenceManager();

                    if(!sequenceManager) {
                        if(sequenceFile.get("sequenceFileContent")) {
                            sequenceManager = Teselagen.manager.SequenceFileManager.sequenceFileToSequenceManager(sequenceFile);
                        } else {
                            self.hide();
                            return;
                        }
                    }

                    if(!this.viewManager) {
                        this.viewManager = Ext.create("Teselagen.manager.VectorViewerManager", {
                            sequenceManager: sequenceManager,
                            center: {
                                x: 100,
                                y: 100
                            },
                            railRadius: 70
                        });
                    } else {
                        this.viewManager.setSequenceManager(sequenceManager);
                    }

                    this.viewManager.initPie(self.down());
                    this.viewManager.updateNameBox();
                    this.viewManager.render();
                }
            }
        });
    }
});
