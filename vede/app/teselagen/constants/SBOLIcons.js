/**
 * @class Teselagen.constants.SBOLIcons
 * Class with constants.
 * @author Diana Wong
 * @author ? original
 */
Ext.define("Teselagen.constants.SBOLIcons", {
    singleton: true,

    requires: [
    ],

    proxy: {
        type: "memory"
    },

    /*ASSEMBLY_JUNCTION:                      "assembly_junction",
    CDS:                                    "cds",
    FIVE_PRIME_OVERHANG:                    "five_prime_overhang",
    FIVE_PRIME_UTR:                         "five_prime_utr",
    GENERIC:                                "generic",
    INSULATOR:                              "insulator",
    OPERATOR_SITE:                          "operator_site",
    ORIGIN_OF_REPLICATION:                  "origin_of_replication",
    PRIMER_BINDING_SITE:                    "primer_binding_site",
    PROMOTER:                               "promoter",
    PROTEASE_SITE:                          "protease_site",
    PROTEIN_STABILITY_ELEMENT:              "protein_stability_element",
    RESTRICTION_ENZYME_RECOGNITION_SITE:    "restriction_enzyme_recognition_site",
    RESTRICTION_SITE_NO_OVERHANG:           "restriction_site_no_overhang",
    RIBONUCLEASE_SITE:                      "ribonuclease_site",
    RNA_STABILITY_ELEMENT:                  "rna_stability_element",
    SIGNATURE:                              "signature",
    TERMINATOR:                             "terminator",
    THREE_PRIME_OVERHANG:                   "three_prime_overhang",*/

    ICONS: {},

    ICON_v1_0_0_LIST: {
    //ICONS: {
        GENERIC: {
            key: "GENERIC",
            name: "generic",
            url: "resources/images/SBOLv1.1.0_SymbolsPDF/NEEDFILE",
            url_small: "resources/images/icons/device/small/blank.png",
            url_big: "resources/images/symbols/blank.png"
        },
        ASSEMBLY_JUNCTION: {
            key: "ASSEMBLY_JUNCTION",
            name: "assembly_junction",
            url: "resources/images/SBOLv1.1.0_SymbolsPDF/assembly-junction.png",
            url_small: "resources/images/icons/device/small/assembly_junction.png",
            url_big: "resources/images/symbols/assembly.png"
        },
        CDS: {
            key: "CDS",
            name: "cds",
            url: "resources/images/SBOLv1.1.0_SymbolsPDF/cds.png",
            url_small: "resources/images/icons/device/small/cds.png",
            url_big: "resources/images/symbols/cds.png"
        },
        FIVE_PRIME_OVERHANG: {
            key: "FIVE_PRIME_OVERHANG",
            name: "five_prime_overhang",
            url: "resources/images/SBOLv1.1.0_SymbolsPDF/five-prime-overhang.png",
            url_small: "resources/images/icons/device/small/assembly_junction_reverse.png",
            url_big: "resources/images/symbols/assembly-junction.png"
        },
        FIVE_PRIME_UTR: {
            key: "FIVE_PRIME_UTR",
            name: "five_prime_utr",
            url: "resources/images/SBOLv1.1.0_SymbolsPDF/NEEDFILE",
            url_small: "resources/images/icons/device/small/assembly_junction_reverse.png",
            url_big: "resources/images/symbols/assembly-junction.png"
        },
        INSULATOR: {
            key: "INSULATOR",
            name: "insulator",
            url: "resources/images/SBOLv1.1.0_SymbolsPDF/insulator.png",
            url_small: "resources/images/icons/device/small/assembly_junction_reverse.png",
            url_big: "resources/images/symbols/assembly-junction.png"
        },
        OPERATOR_SITE: {
            key: "OPERATOR_SITE",
            name: "operator_site",
            url: "resources/images/SBOLv1.1.0_SymbolsPDF/operator.png",
            url_small: "resources/images/icons/device/small/assembly_junction_reverse.png",
            url_big: "resources/images/symbols/assembly-junction.png"
        },
        ORIGIN_OF_REPLICATION: {
            key: "ORIGIN_OF_REPLICATION",
            name: "origin_of_replication",
            url: "resources/images/SBOLv1.1.0_SymbolsPDF/origin-of-replication.png",
            url_small: "resources/images/icons/device/small/assembly_junction_reverse.png",
            url_big: "resources/images/symbols/assembly-junction.png"
        },
        PRIMER_BINDING_SITE: {
            key: "PRIMER_BINDING_SITE",
            name: "primer_binding_site",
            url: "resources/images/SBOLv1.1.0_SymbolsPDF/primer-binding-site.png",
            url_small: "resources/images/icons/device/small/assembly_junction_reverse.png",
            url_big: "resources/images/symbols/assembly-junction.png"
        },
        PROMOTER: {
            key: "PROMOTER",
            name: "promoter",
            url: "resources/images/SBOLv1.1.0_SymbolsPDF/promoter.png",
            url_small: "resources/images/icons/device/small/assembly_junction_reverse.png",
            url_big: "resources/images/symbols/assembly-junction.png"
        },
        PROTEASE_SITE: {
            key: "PROTEASE_SITE",
            name: "protease_site",
            url: "resources/images/SBOLv1.1.0_SymbolsPDF/protease-site.png",
            url_small: "resources/images/icons/device/small/assembly_junction_reverse.png",
            url_big: "resources/images/symbols/assembly-junction.png"
        },
        PROTEIN_STABILITY_ELEMENT: {
            key: "PROTEIN_STABILITY_ELEMENT",
            name: "protein_stability_element",
            url: "resources/images/SBOLv1.1.0_SymbolsPDF/protein-stability-element.png",
            url_small: "resources/images/icons/device/small/assembly_junction_reverse.png",
            url_big: "resources/images/symbols/assembly-junction.png"
        },
        RESTRICTION_ENZYME_RECOGNITION_SITE: {
            key: "RESTRICTION_ENZYME_RECOGNITION_SITE",
            name: "restriction_enzyme_recognition_site",
            url: "resources/images/SBOLv1.1.0_SymbolsPDF/restriction-enzyme-recognition-site.png",
            url_small: "resources/images/icons/device/small/assembly_junction_reverse.png",
            url_big: "resources/images/symbols/assembly-junction.png"
        },
        RESTRICTION_SITE_NO_OVERHANG: {
            key: "RESTRICTION_SITE_NO_OVERHANG",
            name: "restriction_site_no_overhang",
            url: "resources/images/SBOLv1.1.0_SymbolsPDF/restriction-site-with-no-overhang.png",
            url_small: "resources/images/icons/device/small/assembly_junction_reverse.png",
            url_big: "resources/images/symbols/assembly-junction.png"
        },
        RIBONUCLEASE_SITE: {
            key: "RIBONUCLEASE_SITE",
            name: "ribonuclease_site",
            url: "resources/images/SBOLv1.1.0_SymbolsPDF/ribonuclease-site.png",
            url_small: "resources/images/icons/device/small/assembly_junction_reverse.png",
            url_big: "resources/images/symbols/assembly-junction.png"
        },
        RNA_STABILITY_ELEMENT: {
            key: "RNA_STABILITY_ELEMENT",
            name: "rna_stability_element",
            url: "resources/images/SBOLv1.1.0_SymbolsPDF/rna-stability-element.png",
            url_small: "resources/images/icons/device/small/assembly_junction_reverse.png",
            url_big: "resources/images/symbols/assembly-junction.png"
        },
        SIGNATURE: {
            key: "SIGNATURE",
            name: "signature",
            url: "resources/images/SBOLv1.1.0_SymbolsPDF/signature.png",
            url_small: "resources/images/icons/device/small/assembly_junction_reverse.png",
            url_big: "resources/images/symbols/assembly-junction.png"
        },
        TERMINATOR: {
            key: "TERMINATOR",
            name: "terminator",
            url: "resources/images/SBOLv1.1.0_SymbolsPDF/terminator.png",
            url_small: "resources/images/icons/device/small/assembly_junction_reverse.png",
            url_big: "resources/images/symbols/assembly-junction.png"
        },
        THREE_PRIME_OVERHANG: {
            key: "THREE_PRIME_OVERHANG",
            name: "three_prime_overhang",
            url: "resources/images/SBOLv1.1.0_SymbolsPDF/three-prime-overhang.png",
            url_small: "resources/images/icons/device/small/assembly_junction_reverse.png",
            url_big: "resources/images/symbols/assembly-junction.png"
        }
    },

    ICON_LIST: [],

    constructor: function() {
        var list = [];
        this.ICONS = this.ICON_v1_0_0_LIST;
        Ext.Object.each(this.ICONS , function(key, value, myself) {
            //console.log(key + ":" + value.name);
            list.push(key);
        });
        this.ICON_LIST = list;
        //console.log(list);
    },

    /*makeList: function() {
        var list = [];
        var CURRENT_ICON = this.ICON_LINKS;
        Ext.Object.each(CURRENT_ICON , function(key, value, myself) {
            //console.log(key + ":" + value.name);
            list.push(key);
        });
        this.ICON_LIST = list;
        return list;
    },*/
    

    statics: {
        
        //private static var _iconInfoMap:Object,
        //private static var _sbolvIconsDataProvider:ArrayCollection,
    }

});