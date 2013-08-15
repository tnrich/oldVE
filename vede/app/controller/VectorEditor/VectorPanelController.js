/*global Vede*/
/**
 * @class Vede.controller.VectorEditor.VectorPanelController
 * Controller for Vector Panel
 */
Ext.define("Vede.controller.VectorEditor.VectorPanelController", {
    extend: "Ext.app.Controller",

    requires: ["Teselagen.manager.ProjectManager"],

    isRendered: false,
    
    init: function () {
        this.control({
            "#VectorPanel": {
                afterrender: this.onRender,
                resize: this.onResize,
                collapse: this.onCollapse
            }
        });
    },

    onTabChange: function (tabPanel, newTab, oldTab) {
        var self = this;
        if(newTab.xtype == "VectorEditorPanel") {
            if(!Teselagen.manager.ProjectManager.workingSequence) {
                console.log("Opening VE Direct Mode");
                Teselagen.manager.ProjectManager.directVEEditingMode = true;
    
                //Create empty VEProject/Sequence
                Teselagen.manager.ProjectManager.workingSequence = Ext.create("Teselagen.models.VectorEditorProject", {
                    name: "Untitled VEProject"
                });
    
                Teselagen.manager.ProjectManager.workingSequence = Ext.create("Teselagen.models.SequenceFile", {
                    sequenceFileFormat: "GENBANK",
                    sequenceFileContent: "LOCUS       NO_NAME                    0 bp    DNA     circular     19-DEC-2012\nFEATURES             Location/Qualifiers\n\nNO ORIGIN\n//",
                    sequenceFileName: "untitled.gb",
                    partSource: "Untitled sequence"
                });
            }
        }
    },

    onLaunch: function () {
        this.tabPanel = Ext.getCmp("mainAppPanel");
        this.tabPanel.on("tabchange", this.onTabChange, this);
    },

    onRender: function () {
        if(!this.isRendered) {
            this.tabPanel = Ext.getCmp("mainAppPanel");
            this.tabPanel.setActiveTab(0);
            /*Vede.application.getController("VectorEditor.PieController").initPie();
            Vede.application.getController("VectorEditor.RailController").initRail();*/
            this.isRendered = true;
        }
    },

    onResize: function () {
        //        console.log("resize");
    },

    onCollapse: function () {
        var annotatePanel = Ext.getCmp("AnnotatePanel");
        if (annotatePanel.collapsed) {
            annotatePanel.expand([true])
        }
    }
});
