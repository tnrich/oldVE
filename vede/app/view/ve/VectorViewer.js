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
    width: 250,
    height: 250,
    listeners: {
        render: function() {
            if(this.part.getSequenceFile()) {
                var sequenceManager = Teselagen.manager.SequenceFileManager.sequenceFileToSequenceManager(this.part.getSequenceFile());

                var pieManager = Ext.create("Teselagen.manager.PieManager", {
                    sequenceManager: sequenceManager,
                    center: {
                        x: 125,
                        y: 125
                    }
                });

                pieManager.initPie(this);
            }
        }
    }
});
