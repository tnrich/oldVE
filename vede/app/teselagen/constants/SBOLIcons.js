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
            url_svg: "resources/images/SBOLv1.1.0_SymbolsSVG/DUMMYFILE.svg",
            url_png: "resources/images/symbols/DUMMYFILE.png",
            url_small: "resources/images/icons/device/small/generic.png",
            url_smallRev: "resources/images/icons/device/small/generic_reverse.png"
        },
        ASSEMBLY_JUNCTION: {
            key: "ASSEMBLY_JUNCTION",
            name: "assembly_junction",
            url_svg: "resources/images/SBOLv1.1.0_SymbolsSVG/assembly-junction.svg",
            url_png: "resources/images/symbols/assembly-junction.png",
            url_small: "resources/images/icons/device/small/assembly_junction.png",
            url_smallRev: "resources/images/icons/device/small/assembly_junction_reverse.png"
        },
        CDS: {
            key: "CDS",
            name: "cds",
            url_svg: "resources/images/SBOLv1.1.0_SymbolsSVG/cds.svg",
            url_png: "resources/images/symbols/cds.png",
            url_small: "resources/images/icons/device/small/cds.png",
            url_smallRev: "resources/images/icons/device/small/cds_reverse.png"
        },
        FIVE_PRIME_OVERHANG: {
            key: "FIVE_PRIME_OVERHANG",
            name: "five_prime_overhang",
            url_svg: "resources/images/SBOLv1.1.0_SymbolsSVG/five-prime-overhang.svg",
            url_png: "resources/images/symbols/five-prime-overhang.png",
            url_small: "resources/images/icons/device/small/five_prime_overhang.png",
            url_smallRev: "resources/images/icons/device/small/five_prime_overhang_reverse.png"
        },
        FIVE_PRIME_UTR: {
            key: "FIVE_PRIME_UTR",
            name: "five_prime_utr",
            url_svg: "resources/images/SBOLv1.1.0_SymbolsSVG/DUMMYFILE.svg",
            url_png: "resources/images/symbols/DUMMYFILE.png",
            url_small: "resources/images/icons/device/small/five_prime_utr.png",
            url_smallRev: "resources/images/icons/device/small/five_prime_utr_reverse.png"
        },
        INSULATOR: {
            key: "INSULATOR",
            name: "insulator",
            url_svg: "resources/images/SBOLv1.1.0_SymbolsSVG/insulator.svg",
            url_png: "resources/images/symbols/insulator.png",
            url_small: "resources/images/icons/device/small/insulator.png",
            url_smallRev: "resources/images/icons/device/small/insulator_reverse.png"
        },
        OPERATOR_SITE: {
            key: "OPERATOR_SITE",
            name: "operator_site",
            url_svg: "resources/images/SBOLv1.1.0_SymbolsSVG/operator.svg",
            url_png: "resources/images/symbols/operator.png",
            url_small: "resources/images/icons/device/small/operator_site.png",
            url_smallRev: "resources/images/icons/device/small/operator_site_reverse.png"
        },
        ORIGIN_OF_REPLICATION: {
            key: "ORIGIN_OF_REPLICATION",
            name: "origin_of_replication",
            url_svg: "resources/images/SBOLv1.1.0_SymbolsSVG/origin-of-replication.svg",
            url_png: "resources/images/symbols/origin-of-replication.png",
            url_small: "resources/images/icons/device/small/origin_of_replication.png",
            url_smallRev: "resources/images/icons/device/small/origin_of_replication_reverse.png"
        },
        PRIMER_BINDING_SITE: {
            key: "PRIMER_BINDING_SITE",
            name: "primer_binding_site",
            url_svg: "resources/images/SBOLv1.1.0_SymbolsSVG/primer-binding-site.svg",
            url_png: "resources/images/symbols/primer-binding-site.png",
            url_small: "resources/images/icons/device/small/primer_binding_site.png",
            url_smallRev: "resources/images/icons/device/small/primer_binding_site_reverse.png"
        },
        PROMOTER: {
            key: "PROMOTER",
            name: "promoter",
            url_svg: "resources/images/SBOLv1.1.0_SymbolsSVG/promoter.svg",
            url_png: "resources/images/symbols/promoter.png",
            url_small: "resources/images/icons/device/small/promoter.png",
            url_smallRev: "resources/images/icons/device/small/promoter_reverse.png"
        },
        PROTEASE_SITE: {
            key: "PROTEASE_SITE",
            name: "protease_site",
            url_svg: "resources/images/SBOLv1.1.0_SymbolsSVG/protease-site.svg",
            url_png: "resources/images/symbols/protease-site.png",
            url_small: "resources/images/icons/device/small/protease_site.png",
            url_smallRev: "resources/images/icons/device/small/protease_site_reverse.png"
        },
        PROTEIN_STABILITY_ELEMENT: {
            key: "PROTEIN_STABILITY_ELEMENT",
            name: "protein_stability_element",
            url_svg: "resources/images/SBOLv1.1.0_SymbolsSVG/protein-stability-element.svg",
            url_png: "resources/images/symbols/protein-stability-element.png",
            url_small: "resources/images/icons/device/small/protein_stability_element.png",
            url_smallRev: "resources/images/icons/device/small/protein_stability_element_reverse.png"
        },
        RESTRICTION_ENZYME_RECOGNITION_SITE: {
            key: "RESTRICTION_ENZYME_RECOGNITION_SITE",
            name: "restriction_enzyme_recognition_site",
            url_svg: "resources/images/SBOLv1.1.0_SymbolsSVG/restriction-enzyme-recognition-site.svg",
            url_png: "resources/images/symbols/restriction-enzyme-recognition-site.png",
            url_small: "resources/images/icons/device/small/restriction_enzyme_recognition_site.png",
            url_smallRev: "resources/images/icons/device/small/restriction_enzyme_recognition_site_reverse.png"
        },
        RESTRICTION_SITE_NO_OVERHANG: {
            key: "RESTRICTION_SITE_NO_OVERHANG",
            name: "restriction_site_no_overhang",
            url_svg: "resources/images/SBOLv1.1.0_SymbolsSVG/restriction-site-with-no-overhang.svg",
            url_png: "resources/images/symbols/restriction-site-with-no-overhang.png",
            url_small: "resources/images/icons/device/small/restriction_site_no_overhang.png",
            url_smallRev: "resources/images/icons/device/small/restriction_site_no_overhang_reverse.png"
        },
        RIBONUCLEASE_SITE: {
            key: "RIBONUCLEASE_SITE",
            name: "ribonuclease_site",
            url_svg: "resources/images/SBOLv1.1.0_SymbolsSVG/ribonuclease-site.svg",
            url_png: "resources/images/symbols/ribonuclease-site.png",
            url_small: "resources/images/icons/device/small/ribonuclease_site.png",
            url_smallRev: "resources/images/icons/device/small/ribonuclease_site_reverse.png"
        },
        RNA_STABILITY_ELEMENT: {
            key: "RNA_STABILITY_ELEMENT",
            name: "rna_stability_element",
            url_svg: "resources/images/SBOLv1.1.0_SymbolsSVG/rna-stability-element.svg",
            url_png: "resources/images/symbols/rna-stability-element.png",
            url_small: "resources/images/icons/device/small/rna_stability_element.png",
            url_smallRev: "resources/images/icons/device/small/rna_stability_element_reverse.png"
        },
        SIGNATURE: {
            key: "SIGNATURE",
            name: "signature",
            url_svg: "resources/images/SBOLv1.1.0_SymbolsSVG/signature.svg",
            url_png: "resources/images/symbols/signature.png",
            url_small: "resources/images/icons/device/small/signature.png",
            url_smallRev: "resources/images/icons/device/small/signature_reverse.png"
        },
        TERMINATOR: {
            key: "TERMINATOR",
            name: "terminator",
            url_svg: "resources/images/SBOLv1.1.0_SymbolsSVG/terminator.svg",
            url_png: "resources/images/symbols/terminator.png",
            url_small: "resources/images/icons/device/small/terminator.png",
            url_smallRev: "resources/images/icons/device/smallterminator/_reverse.png"
        },
        THREE_PRIME_OVERHANG: {
            key: "THREE_PRIME_OVERHANG",
            name: "three_prime_overhang",
            url_svg: "resources/images/SBOLv1.1.0_SymbolsSVG/three-prime-overhang.svg",
            url_png: "resources/images/symbols/three-prime-overhang.png",
            url_small: "resources/images/icons/device/small/three_prime_overhang.png",
            url_smallRev: "resources/images/icons/device/small/three_prime_overhang_reverse.png"
        }
    },

    // DW 11.27.12: THIS IS NOT BEST PRACTICE! Using the constructor seems to mess up the J5Bin.js call for
    // validation (list: Teselagen.constants.SBOLIcons.ICON_LIST) in the app.
    // This seems to be a synchronous loading issue. Duplicating the keys here is bad practice,
    // but this should only be a temporary fix.

    ICON_LIST: [
        "GENERIC",
        "ASSEMBLY_JUNCTION",
        "CDS",
        "FIVE_PRIME_OVERHANG",
        "FIVE_PRIME_UTR",
        "INSULATOR",
        "OPERATOR_SITE",
        "ORIGIN_OF_REPLICATION",
        "PRIMER_BINDING_SITE",
        "PROMOTER",
        "PROTEASE_SITE",
        "PROTEIN_STABILITY_ELEMENT",
        "RESTRICTION_ENZYME_RECOGNITION_SITE",
        "RESTRICTION_SITE_NO_OVERHANG",
        "RIBONUCLEASE_SITE",
        "RNA_STABILITY_ELEMENT",
        "SIGNATURE",
        "TERMINATOR",
        "THREE_PRIME_OVERHANG"
    ],

    constructor: function() {
        var list = [];
        // Set ICONS to the version you want to use
        this.ICONS = this.ICON_v1_0_0_LIST;

        // Set the ICON_LIST to be an array of the key values
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