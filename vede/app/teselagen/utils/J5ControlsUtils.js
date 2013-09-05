/**
 * @class Teselagen.utils.J5ControlsUtils
 * @singleton
 *
 * Contains utility functions used by the j5 options dialog to generate j5
 * input .csv files (Sequences, Parts, Targets, Eugene Rules) and their headers.
 *
 * @author Nick Elsbree
 * @author Zinovii Dmytriv (original author of J5ControlsUtils.as)
 */
Ext.define("Teselagen.utils.J5ControlsUtils", {
singleton: true,

    createJ5SeqList: function() {
        var seqListString = this.getSeqListInfo();

        if(seqListString) {
            return this.createSeqListHeader() + seqListString;
        } else {
            return null;
        }
    },

    createJ5PartList: function() {
        var partListString = this.getPartListInfo();

        if(partListString) {
           return this.createPartListHeader() + partListString;
        } else {
           return null;
        }
    },

    createJ5TargetList: function() {
        var targetListString = this.getTargetListInfo();

        if(targetListString) {
            return this.createTargetListHeader() + targetListString;
        } else {
            return null;
        }
    },

    createJ5EugeneRulesList: function() {
        var eugeneRulesList = "";
    },

    generateEmptyPlasmidsList: function() {
        return "Plasmid Name,Alias,Contents,Length,Sequence\npj5_00000,,,,";
    },

    generateEmptyOligosList: function() {
        return "Oligo Name,Length,Tm,Tm (3' only),Sequence\nj5_00000,,,,";
    },

    generateEmptyDirectSynthesesList: function() {
        return "Direct Synthesis Name,Alias,Contents,Length,Sequence\ndsj5_00000,,,,";
    },

    createSeqListHeader: function() {
        return "Sequence File Name,Format";
    },

    createPartListHeader: function() {
        return "Part Name,Part Source (Sequence Display ID),Reverse Compliment?,Start (bp),End (bp)";
    },

    createTargetListHeader: function() {
        return "(>Bin) or Part Name,Direction,Forced Assembly Strategy?,Forced Relative Overhang Position?,Direct Synthesis Firewall?,Extra 5' CPEC overlap bps,Extra 3' CPEC overlap bps";
    },

    getSeqListInfo: function() {
        var returnString = "\n";
    }
});
