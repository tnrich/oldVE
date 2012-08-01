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

    /**
     * @member Vede.controller.PieController
     */
    init: function() {
        this.control({
            "#Pie" : {
                click : this.onClickPie
            }
        });
    },
    
    groupMan: null,

    onLaunch: function() {
        var pieContainer, pie;

        this.groupMan = Teselagen.manager.RestrictionEnzymeGroupManager;
        this.groupMan.initialize();

        var sequence = Teselagen.bio.sequence.DNATools.createDNA(
                            "atgatgctacgatatcatgacgcagtctgactgattgcagccattag");

        var orfs = Teselagen.bio.orf.ORFFinder.calculateORFBothDirections(sequence,
                    Teselagen.bio.sequence.DNATools.reverseComplement(sequence));

        var sequenceManager = Ext.create("Teselagen.manager.SequenceManager", {
            name: "seqman",
            circular: true,
            sequence: sequence
        });

        var reManager = Ext.create("Teselagen.manager.RestrictionEnzymeManager", {
            sequenceManager: sequenceManager,
            restrictionEnzymeGroup: this.groupMan.groupByName("Fermentas Fast Digest")
        });

        this.pieManager = Ext.create("Teselagen.manager.PieManager", {
            sequenceManager: sequenceManager,
            center: {x: 100, y: 100},
            railRadius: 100,
            cutSites: reManager.getAllCutSites(),
            features: [Ext.create("Teselagen.bio.sequence.dna.Feature", {
                    name: "Super Awesome Feature",
                    type: "misc_marker",
                    start: 0,
                    end: 5,
                    strand: 1
                }),
                Ext.create("Teselagen.bio.sequence.dna.Feature", {
                    name: "Reverse feature",
                    type: "terminator",
                    start: 38,
                    end: 40,
                    strand: -1 
                }),
                Ext.create("Teselagen.bio.sequence.dna.Feature", {
                    name: "A long reversed feature",
                    type: "promoter",
                    start: 0,
                    end: 37,
                    strand: -1 
                })
            ],
            orfs: orfs
        });
        pieContainer = Ext.getCmp('PieContainer');
        pie = this.pieManager.getPie();
        pieContainer.add(pie);
        this.pieManager.initPie();
        this.pieManager.render();
    },

    onClickPie: function(pEvt, pOpts) {
        var el = this.pieManager.getPie().surface.el;
        var relEvtX = pEvt.getX()-el.getLeft();
        var relEvtY = pEvt.getY()-el.getTop();
        var reManager = Ext.create("Teselagen.manager.RestrictionEnzymeManager", {
            sequenceManager: this.pieManager.sequenceManager,
            restrictionEnzymeGroup: this.groupMan.groupByName("Fermentas Fast Digest")
        });
        reManager.getAllCutSites();
        this.pieManager.render();
    }
});
