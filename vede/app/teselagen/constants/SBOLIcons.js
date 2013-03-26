/**
 * @class Teselagen.constants.SBOLIcons
 * Class with constants.
 * @author Diana Wong
 */
Ext.define("Teselagen.constants.SBOLIcons", {
    singleton: true,

    requires: [
    ],

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

    ICON_1_0_LIST: {
    //ICONS: {
        GENERIC: {
            key: "GENERIC",
            name: "generic",
            url_small: "resources/images/icons/device/small/generic.png",
            url_large: "resources/images/icons/device/large/user-defined.png"
        },
        ASSEMBLY_JUNCTION: { //As "assembly scar" in SBOL 1.0.0
            key: "ASSEMBLY_JUNCTION",
            name: "assembly_junction",
            url_small: "resources/images/icons/device/small/assembly-scar.png",
            url_small: "resources/images/icons/device/small/assembly-scar.png"
        },
        BLUNT_RESTRICTION_SITE: { //New in SBOL 1.0.0
            key: "BLUNT_RESTRICTION_SITE",
            name: "blunt_restriction_site",
            url_small: "resources/images/icons/device/small/blunt-restriction-site.png",
            url_large: "resources/images/icons/device/large/blunt-restriction-site.png"
        },
        CDS: {
            key: "CDS",
            name: "cds",
            url_small: "resources/images/icons/device/small/cds.png",
            url_large: "resources/images/icons/device/small/cds.png"
        },
        FIVE_PRIME_OVERHANG: {
            key: "FIVE_PRIME_OVERHANG",
            name: "five_prime_overhang",
            url_small: "resources/images/icons/device/small/five-prime-overhang.png",
            url_large: "resources/images/icons/device/large/five-prime-overhang.png"
        },
        // DW NOTE: SBOL standards keep changing for this. A translational-start-site === five_prime_utr
        FIVE_PRIME_UTR: { //As "ribosome entry site" in SBOL 1.0.0
            key: "FIVE_PRIME_UTR",
            name: "five_prime_utr",
            url_small: "resources/images/icons/device/small/ribosome-entry-site.png",
            url_large: "resources/images/icons/device/large/ribosome-entry-site.png",
        },
        FIVE_PRIME_RESTRICTION_SITE: { //New in SBOL 1.0.0
            key: "FIVE_PRIME_RESTRICTION_SITE",
            name: "five_prime_restriction_site",
            url_small: "resources/images/icons/device/small/five-prime-sticky-restriction-site.png"
        },
        INSULATOR: {
            key: "INSULATOR",
            name: "insulator",
            url_small: "resources/images/icons/device/small/insulator.png",
            url_large: "resources/images/icons/device/large/insulator.png"
        },
        OPERATOR_SITE: {
            key: "OPERATOR_SITE",
            name: "operator_site",
            url_small: "resources/images/icons/device/small/operator.png",
            url_large: "resources/images/icons/device/large/operator.png"
        },
        ORIGIN_OF_REPLICATION: {
            key: "ORIGIN_OF_REPLICATION",
            name: "origin_of_replication",
            url_small: "resources/images/icons/device/small/origin-of-replication.png",
            url_large: "resources/images/icons/device/large/origin-of-replication.png"
        },
        PRIMER_BINDING_SITE: {
            key: "PRIMER_BINDING_SITE",
            name: "primer_binding_site",
            url_small: "resources/images/icons/device/small/primer-binding-site.png",
            url_large: "resources/images/icons/device/large/primer-binding-site.png"
        },
        PROMOTER: {
            key: "PROMOTER",
            name: "promoter",
            url_small: "resources/images/icons/device/small/promoter.png",
            url_large: "resources/images/icons/device/large/promoter.png"
        },
        PROTEASE_SITE: {
            key: "PROTEASE_SITE",
            name: "protease_site",
            url_small: "resources/images/icons/device/small/protease-site.png",
            url_large: "resources/images/icons/device/large/protease-site.png"
        },
        PROTEIN_STABILITY_ELEMENT: {
            key: "PROTEIN_STABILITY_ELEMENT",
            name: "protein_stability_element",
            url_small: "resources/images/icons/device/small/protein_stability_element.png",
            url_large: "resources/images/icons/device/large/protein-stability-element.png"
        },
        RESTRICTION_ENZYME_RECOGNITION_SITE: {
            key: "RESTRICTION_ENZYME_RECOGNITION_SITE",
            name: "restriction_enzyme_recognition_site",
            url_small: "resources/images/icons/device/small/restriction-enzyme-recognition-site.png",
            url_large: "resources/images/icons/device/large/restriction-enzyme-recognition-site.png"
        },
        RESTRICTION_SITE_NO_OVERHANG: {
            key: "RESTRICTION_SITE_NO_OVERHANG",
            name: "restriction_site_no_overhang",
            url_small: "resources/images/icons/device/small/restriction-site-no-overhang.png",
            url_large: "resources/images/icons/device/large/restriction-site-no-overhang.png"
        },
        RIBONUCLEASE_SITE: {
            key: "RIBONUCLEASE_SITE",
            name: "ribonuclease_site",
            url_small: "resources/images/icons/device/small/ribonuclease-site.png",
            url_large: "resources/images/icons/device/large/ribonuclease-site.png"
        },
        RIBOSOME_ENTRY_SITE: { //New in SBOL 1.0.0
            key: "RIBOSOME_ENTRY_SITE",
            name: "ribosome_entry_site",
            url_small: "resources/images/icons/device/small/ribosome-entry-site.png",
            url_large: "resources/images/icons/device/large/ribosome-entry-site.png",
        },
        RNA_STABILITY_ELEMENT: {
            key: "RNA_STABILITY_ELEMENT",
            name: "rna_stability_element",
            url_small: "resources/images/icons/device/small/rna-stability-element.png",
            url_large: "resources/images/icons/device/large/rna-stability-element.png"
        },
        SIGNATURE: {
            key: "SIGNATURE",
            name: "signature",
            url_small: "resources/images/icons/device/small/signature.png",
            url_large: "resources/images/icons/device/large/signature.png"
        },
        TERMINATOR: {
            key: "TERMINATOR",
            name: "terminator",
            url_small: "resources/images/icons/device/small/terminator.png",
            url_large: "resources/images/icons/device/large/terminator.png"
        },
        THREE_PRIME_OVERHANG: {
            key: "THREE_PRIME_OVERHANG",
            name: "three_prime_overhang",
            url_small: "resources/images/icons/device/small/three-prime-overhang.png",
            url_large: "resources/images/icons/device/large/three-prime-overhang.png"
        },
        THREE_PRIME_RESTRICTION_SITE: { //New in SBOL 1.0.0
            key: "THREE_PRIME_RESTRICTION_SITE",
            name: "three_prime_restriction_site",
            url_small: "resources/images/icons/device/small/three-prime-sticky-restriction-site.png",
            url_large: "resources/images/icons/device/large/three-prime-sticky-restriction-site.png"
        }
    },

    // DW 11.27.12: THIS IS NOT BEST PRACTICE! Using the constructor seems to mess up the J5Bin.js call for
    // validation (list: Teselagen.constants.SBOLIcons.ICON_LIST) in the app.
    // This seems to be a synchronous loading issue. Duplicating the keys here is bad practice,
    // but this should only be a temporary fix.

    ICON_LIST: [
        "GENERIC",
        "ASSEMBLY_JUNCTION",
        "BLUNT_RESTRICTION_SITE", //New in SBOL 1.0.0
        "CDS",
        "FIVE_PRIME_OVERHANG",
        "FIVE_PRIME_RESTRICTION_SITE", //New in SBOL 1.0.0
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
        "THREE_PRIME_OVERHANG",
        "THREE_PRIME_RESTRICTION_SITE" //New in SBOL 1.0.0
    ],

    constructor: function() {
        var list = [];
        // Set ICONS to the version you want to use
        this.ICONS = this.ICON_1_0_LIST;

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