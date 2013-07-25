/**
 * @class Teselagen.constants.SBOLIcons
 * Class with constants.
 * @author Diana Wong
 */
Ext.define("Teselagen.constants.SBOLIcons", {
    singleton: true,

    requires: [],

    ICONS: {},

    ICONS_4_TO_4_1_UPDATE: {
        "ASSEMBLY_JUNCTION": "ASSEMBLY-SCAR",
        "BLUNT_RESTRICTION_SITE": "BLUNT-RESTRICTION-SITE",
        "CDS": "CDS",
        "FIVE_PRIME_OVERHANG": "FIVE-PRIME-OVERHANG",
        "FIVE_PRIME_UTR": "FIVE-PRIME-UTR",
        "FIVE_PRIME_STICKY_RESTRICTION_SITE": "FIVE-PRIME-STICKY-RESTRICTION-SITE",
        "INSULATOR": "INSULATOR",
        "OPERATOR_SITE": "OPERATOR",
        "ORIGIN_OF_REPLICATION": "ORIGIN-OF-REPLICATION",
        "PRIMER_BINDING_SITE": "PRIMER-BINDING-SITE",
        "PROMOTER": "PROMOTER",
        "PROTEASE_SITE": "PROTEASE-SITE",
        "PROTEIN_STABILITY_ELEMENT": "PROTEIN-STABILITY-ELEMENT",
        "RESTRICTION_ENZYME_RECOGNITION": "RESTRICTION-ENZYME-RECOGNITION-SITE",
        "RIBOSOME_ENTRY_SITE": "RIBOSOME-ENTRY-SITE",
        "RNA_STABILITY_ELEMENT": "RNA-STABILITY-ELEMENT",
        "SIGNATURE": "SIGNATURE",
        "TERMINATOR": "TERMINATOR",
        "THREE_PRIME_OVERHANG": "THREE-PRIME-OVERHANG",
        "THREE_PRIME_RESTRICTION": "THREE-PRIME-RESTRICTION-SITE"
    },

    ICON_1_0_LIST: {
        "USER-DEFINED": {
            key: "USER-DEFINED",
            name: "generic",
            url_small: "resources/images/icons/device/small/generic.png",
            url_large: "resources/images/icons/device/large/user-defined.png",
            path: "M 5 40 L 5 60 L 45 60 L 45 40 Z"
        },
        "ASSEMBLY-SCAR": {
            key: "ASSEMBLY_JUNCTION",
            name: "assembly_junction",
            url_small: "resources/images/icons/device/small/assembly-scar.png",
            url_large: "resources/images/icons/device/large/assembly-scar.png",
            path: "M 13 46 L 37 46 M 13 54 L 37 54"
        },
        "BLUNT-RESTRICTION-SITE": {
            key: "BLUNT_RESTRICTION_SITE",
            name: "blunt_restriction_site",
            url_small: "resources/images/icons/device/small/blunt-restriction-site.png",
            url_large: "resources/images/icons/device/large/blunt-restriction-site.png",
            path: "M 19 37 L 22 37 L 22 63 L 19 63 M 31 37 L 28 37 L 28 63 L 31 63"
        },
        "CDS": {
            key: "CDS",
            name: "cds",
            url_small: "resources/images/icons/device/small/cds.png",
            url_large: "resources/images/icons/device/large/cds.png",
            path: "M 9 65 L 27 65 L 42 50 L 27 35 L 9 35 L 9 65 Z"
        },
        "FIVE-PRIME-OVERHANG": {
            key: "FIVE_PRIME_OVERHANG",
            name: "five_prime_overhang",
            url_small: "resources/images/icons/device/small/five-prime-overhang.png",
            url_large: "resources/images/icons/device/large/five-prime-overhang.png",
            path: "M 10 46 L 40 46 M 25 54 L 40 54"
        },
        "FIVE-PRIME-UTR": { //As "ribosome entry site" in SBOL 1.0.0
            key: "FIVE_PRIME_UTR",
            name: "five_prime_utr",
            url_small: "resources/images/icons/device/small/ribosome-entry-site.png",
            url_large: "resources/images/icons/device/large/ribosome-entry-site.png",
            path: "M 12 50 L 38 50 L 38 45 C 38 35 32 30 25 30 C 18 30 12 35 12 45  Z"
        },
        "FIVE-PRIME-STICKY-RESTRICTION-SITE": { //New in SBOL 1.0.0
            key: "FIVE_PRIME_RESTRICTION_SITE",
            name: "five_prime_restriction_site",
            url_small: "resources/images/icons/device/small/five-prime-sticky-restriction-site.png",
            url_large: "resources/images/icons/device/large/five-prime-sticky-restriction-site.png",
            path: "M 10 37 L 10 50 L 40 50 L 40 63"
        },
        "INSULATOR": {
            key: "INSULATOR",
            name: "insulator",
            url_small: "resources/images/icons/device/small/insulator.png",
            url_large: "resources/images/icons/device/large/insulator.png",
            path: "M 17 58 L 33 58 L 33 42 L 17 42 L 17 58 Z M 10 65 L 40 65 L 40 35 L 10 35 L 10 65 Z"
        },
        "OPERATOR": {
            key: "OPERATOR_SITE",
            name: "operator_site",
            url_small: "resources/images/icons/device/small/operator.png",
            url_large: "resources/images/icons/device/large/operator.png",
            path: "M 15 60 L 35 60 L 35 40 L 15 40 L 15 60 Z"
        },
        "ORIGIN-OF-REPLICATION": {
            key: "ORIGIN_OF_REPLICATION",
            name: "origin_of_replication",
            url_small: "resources/images/icons/device/small/origin-of-replication.png",
            url_large: "resources/images/icons/device/large/origin-of-replication.png",
            path: "M 25, 50  m -12, 0  a 12,12 0 1,0 24,0  a 12,12 0 1,0 -24,0"
        },
        "PRIMER-BINDING-SITE": {
            key: "PRIMER_BINDING_SITE",
            name: "primer_binding_site",
            url_small: "resources/images/icons/device/small/primer-binding-site.png",
            url_large: "resources/images/icons/device/large/primer-binding-site.png",
            path: "M 12 45 L 38 45 L 28 38"
        },
        "PROMOTER": {
            key: "PROMOTER",
            name: "promoter",
            url_small: "resources/images/icons/device/small/promoter.png",
            url_large: "resources/images/icons/device/large/promoter.png",
            path: "M 31.5 15.5 L 40 23 L 31.5 30.3333 M 10 50 L 10 23 L 39 23"
        },
        "PROTEASE-SITE": {
            key: "PROTEASE_SITE",
            name: "protease_site",
            url_small: "resources/images/icons/device/small/protease-site.png",
            url_large: "resources/images/icons/device/large/protease-site.png",
            path: "M 25 50 L 25 25 M 17 16 L 33 32 M 33 16 L 17 32"
        },
        "PROTEIN-STABILITY-ELEMENT": {
            key: "PROTEIN_STABILITY_ELEMENT",
            name: "protein_stability_element",
            url_small: "resources/images/icons/device/small/protein_stability_element.png",
            url_large: "resources/images/icons/device/large/protein-stability-element.png",
            path: "M 25 50 L 25 37 " +
            "M 25, 25  m -7, 0  a 7,7 0 1,0 14,0  a 7,7 0 1,0 -14,0"
        },
        "RESTRICTION-ENZYME-RECOGNITION-SITE": {
            key: "RESTRICTION_ENZYME_RECOGNITION_SITE",
            name: "restriction_enzyme_recognition_site",
            url_small: "resources/images/icons/device/small/restriction-enzyme-recognition-site.png",
            url_large: "resources/images/icons/device/large/restriction-enzyme-recognition-site.png",
            path: "M 25 37 L 25 63"
        },
        "RESTRICTION-SITE-NO-OVERHANG": {
            key: "RESTRICTION_SITE_NO_OVERHANG",
            name: "restriction_site_no_overhang",
            url_small: "resources/images/icons/device/small/restriction-site-with-no-overhang.png",
            url_large: "resources/images/icons/device/large/restriction-site-with-no-overhang.png",
            path: ""
        },
        "RIBONUCLEASE-SITE": {
            key: "RIBONUCLEASE_SITE",
            name: "ribonuclease_site",
            url_small: "resources/images/icons/device/small/ribonuclease-site.png",
            url_large: "resources/images/icons/device/large/ribonuclease-site.png",
            path: "M 25 50 L 25 45 M 25 38 L 25 33 M 17 16 L 33 32 M 33 16 L 17 32 "
        },
        "RIBOSOME-ENTRY-SITE": {
            key: "RIBOSOME_ENTRY_SITE",
            name: "ribosome_entry_site",
            url_small: "resources/images/icons/device/small/ribosome-entry-site.png",
            url_large: "resources/images/icons/device/large/ribosome-entry-site.png",
            path: "M 12 50 L 38 50 L 38 45 C 38 35 32 30 25 30 C 18 30 12 35 12 45  Z"
        },
        "RNA-STABILITY-ELEMENT": {
            key: "RNA_STABILITY_ELEMENT",
            name: "rna_stability_element",
            url_small: "resources/images/icons/device/small/rna-stability-element.png",
            url_large: "resources/images/icons/device/large/rna-stability-element.png",
            path: "M 25 50 L 25 46 M 25 41 L 25 37 " +
                    "M 25, 25  m -7, 0  a 7,7 0 1,0 14,0  a 7,7 0 1,0 -14,0"
        },
        "SIGNATURE": {
            key: "SIGNATURE",
            name: "signature",
            url_small: "resources/images/icons/device/small/signature.png",
            url_large: "resources/images/icons/device/large/signature.png",
            path: "M 5 45 L 5 20 L 45 20 L 45 45 Z M 10 27 L 20 37 M 10 37 L 20 27 M 24 39 L 40 39"
        },
        "TERMINATOR": {
            key: "TERMINATOR",
            name: "terminator",
            url_small: "resources/images/icons/device/small/terminator.png",
            url_large: "resources/images/icons/device/large/terminator.png",
            path: "M 25 50 L 25 26 M 10 25 L 40 25"
        },
        "THREE-PRIME-OVERHANG": {
            key: "THREE_PRIME_OVERHANG",
            name: "three_prime_overhang",
            url_small: "resources/images/icons/device/small/three-prime-overhang.png",
            url_large: "resources/images/icons/device/large/three-prime-overhang.png",
            path: "M 10 46 L 40 46 M 25 54 L 10 54"
        },
        "THREE-PRIME-RESTRICTION-SITE": {
            key: "THREE_PRIME_RESTRICTION_SITE",
            name: "three_prime_restriction_site",
            url_small: "resources/images/icons/device/small/three-prime-sticky-restriction-site.png",
            url_large: "resources/images/icons/device/large/three-prime-sticky-restriction-site.png",
            path: "M 40 37 L 40 50 L 10 50 L 10 63"
        }
    },

    ICON_LIST: [
        "GENERIC",
        "ASSEMBLY-JUNCTION",
        "BLUNT-RESTRICTION-SITE", //New in SBOL 1.0.0
    "CDS",
        "FIVE-PRIME-OVERHANG",
        "FIVE-PRIME-RESTRICTION-SITE", //New in SBOL 1.0.0
    "FIVE-PRIME-UTR",
        "INSULATOR",
        "OPERATOR-SITE",
        "ORIGIN-OF-REPLICATION",
        "PRIMER-BINDING-SITE",
        "PROMOTER",
        "PROTEASE-SITE",
        "PROTEIN-STABILITY-ELEMENT",
        "RESTRICTION-ENZYME-RECOGNITION-SITE",
        "RESTRICTION-SITE-NO-OVERHANG",
        "RIBONUCLEASE-SITE",
        "RNA-STABILITY-ELEMENT",
        "SIGNATURE",
        "TERMINATOR",
        "THREE-PRIME-OVERHANG",
        "THREE-PRIME-RESTRICTION_SITE" //New in SBOL 1.0.0
    ],

    constructor: function() {
        var list = [];
        // Set ICONS to the version you want to use
        this.ICONS = this.ICON_1_0_LIST;

        // Set the ICON_LIST to be an array of the key values
        Ext.Object.each(this.ICONS, function(key, value, myself) {
            list.push(key);
        });
        this.ICON_LIST = list;
    }

});
