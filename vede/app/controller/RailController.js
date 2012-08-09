/**
 * @class Vede.controller.RailController
 * Controller for Rail drawing.
 */
Ext.define('Vede.controller.RailController', {
    requires: ["Teselagen.bio.sequence.DNATools",
               "Teselagen.bio.orf.ORFFinder",
               "Teselagen.manager.RestrictionEnzymeGroupManager",
               "Teselagen.event.SequenceManagerEvent"],

    extend: 'Ext.app.Controller',

    RailManager: null,

    enzymeGroupManager: null,

    /**
     * @member Vede.controller.RailController
     */
    init: function() {

        this.control({
            "#Rail" : {
                click : this.onClickRail
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

    listeners: {
        SequenceManagerChanged: function(pSeqMan) {
            this.onSequenceManagerChanged(pSeqMan);
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

        this.RailManager.setSequenceManager(pSeqMan);
        this.RailManager.setOrfs(orfManager.getOrfs());
        this.RailManager.setCutSites(enzymeManager.getCutSites());
        this.RailManager.setFeatures(pSeqMan.getFeatures());

        this.RailManager.render();
    },
    
    groupMan: null,

    onLaunch: function() {
        var RailContainer, Rail;

        if(!this.enzymeGroupManager.isInitialized) {
            this.enzymeGroupManager.initialize();
        }

        this.RailManager = Ext.create("Teselagen.manager.RailManager", {
            reference: {x: 0, y: 0},
            railGap: 3,
        });

        RailContainer = Ext.getCmp('RailContainer');
        Rail = this.RailManager.getRail();
        RailContainer.add(Rail);
        this.RailManager.initRail();
    },

    onClickRail: function(pEvt, pOpts) {
        var el = this.RailManager.getRail().surface.el;
        var relEvtX = pEvt.getX()-el.getLeft();
        var relEvtY = pEvt.getY()-el.getTop();
        this.RailManager.render();
    }
});
