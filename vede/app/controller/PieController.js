/**
 * @class Vede.controller.PieController
 * Controller for Pie drawing.
 */
Ext.define('Vede.controller.PieController', {
    requires: ["Teselagen.bio.sequence.DNATools",
               "Teselagen.bio.orf.ORFFinder",
               "Teselagen.manager.RestrictionEnzymeGroupManager"],

    extend: 'Ext.app.Controller',

    pieManager: null,

    enzymeGroupManager: null,

    /**
     * @member Vede.controller.PieController
     */
    init: function() {
        this.control({
            "#Pie" : {
                click : this.onClickPie
            }
        });

        this.enzymeGroupManager = 
            Teselagen.manager.RestrictionEnzymeGroupManager;

        if(!this.enzymeGroupManager.getIsInitialized) {
            this.enzymeGroupManager.initialize();
        }

        this.application.on("SequenceManagerChanged", 
                            this.onSequenceManagerChanged, this);
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
    },

    onClickPie: function(pEvt, pOpts) {
        var el = this.pieManager.getPie().surface.el;
        var relEvtX = pEvt.getX()-el.getLeft();
        var relEvtY = pEvt.getY()-el.getTop();
        this.pieManager.render();
    }
});
