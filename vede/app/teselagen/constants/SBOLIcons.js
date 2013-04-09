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
            url_large: "resources/images/icons/device/large/user-defined.png"
        },
        "ASSEMBLY-SCAR": {
            key: "ASSEMBLY_JUNCTION",
            name: "assembly_junction",
            url_small: "resources/images/icons/device/small/assembly-scar.png",
            url_large: "resources/images/icons/device/large/assembly-scar.png"
        },
        "BLUNT-RESTRICTION-SITE": {
            key: "BLUNT_RESTRICTION_SITE",
            name: "blunt_restriction_site",
            url_small: "resources/images/icons/device/small/blunt-restriction-site.png",
            url_large: "resources/images/icons/device/large/blunt-restriction-site.png"
        },
        "CDS": {
            key: "CDS",
            name: "cds",
            url_small: "resources/images/icons/device/small/cds.png",
            url_large: "resources/images/icons/device/large/cds.png"
        },
        "FIVE-PRIME-OVERHANG": {
            key: "FIVE_PRIME_OVERHANG",
            name: "five_prime_overhang",
            url_small: "resources/images/icons/device/small/five-prime-overhang.png",
            url_large: "resources/images/icons/device/large/five-prime-overhang.png"
        },
        "FIVE-PRIME-UTR": { //As "ribosome entry site" in SBOL 1.0.0
            key: "FIVE_PRIME_UTR",
            name: "five_prime_utr",
            url_small: "resources/images/icons/device/small/ribosome-entry-site.png",
            url_large: "resources/images/icons/device/large/ribosome-entry-site.png",
        },
        "FIVE-PRIME-STICKY-RESTRICTION-SITE": { //New in SBOL 1.0.0
            key: "FIVE_PRIME_RESTRICTION_SITE",
            name: "five_prime_restriction_site",
            url_small: "resources/images/icons/device/small/five-prime-sticky-restriction-site.png",
            url_large: "resources/images/icons/device/large/five-prime-sticky-restriction-site.png"
        },
        "INSULATOR": {
            key: "INSULATOR",
            name: "insulator",
            url_small: "resources/images/icons/device/small/insulator.png",
            url_large: "resources/images/icons/device/large/insulator.png"
        },
        "OPERATOR": {
            key: "OPERATOR_SITE",
            name: "operator_site",
            url_small: "resources/images/icons/device/small/operator.png",
            url_large: "resources/images/icons/device/large/operator.png"
        },
        "ORIGIN-OF-REPLICATION": {
            key: "ORIGIN_OF_REPLICATION",
            name: "origin_of_replication",
            url_small: "resources/images/icons/device/small/origin-of-replication.png",
            url_large: "resources/images/icons/device/large/origin-of-replication.png"
        },
        "PRIMER-BINDING-SITE": {
            key: "PRIMER_BINDING_SITE",
            name: "primer_binding_site",
            url_small: "resources/images/icons/device/small/primer-binding-site.png",
            url_large: "resources/images/icons/device/large/primer-binding-site.png"
        },
        "PROMOTER": {
            key: "PROMOTER",
            name: "promoter",
            url_small: "resources/images/icons/device/small/promoter.png",
            url_large: "resources/images/icons/device/large/promoter.png"
        },
        "PROTEASE-SITE": {
            key: "PROTEASE_SITE",
            name: "protease_site",
            url_small: "resources/images/icons/device/small/protease-site.png",
            url_large: "resources/images/icons/device/large/protease-site.png"
        },
        "PROTEIN-STABILITY-ELEMENT": {
            key: "PROTEIN_STABILITY_ELEMENT",
            name: "protein_stability_element",
            url_small: "resources/images/icons/device/small/protein_stability_element.png",
            url_large: "resources/images/icons/device/large/protein-stability-element.png"
        },
        "RESTRICTION-ENZYME-RECOGNITION-SITE": {
            key: "RESTRICTION_ENZYME_RECOGNITION_SITE",
            name: "restriction_enzyme_recognition_site",
            url_small: "resources/images/icons/device/small/restriction-enzyme-recognition-site.png",
            url_large: "resources/images/icons/device/large/restriction-enzyme-recognition-site.png"
        },
        "RESTRICTION-SITE-NO-OVERHANG": {
            key: "RESTRICTION_SITE_NO_OVERHANG",
            name: "restriction_site_no_overhang",
            url_small: "resources/images/icons/device/small/restriction-site-with-no-overhang.png",
            url_large: "resources/images/icons/device/large/restriction-site-with-no-overhang.png"
        },
        "RIBONUCLEASE-SITE": {
            key: "RIBONUCLEASE_SITE",
            name: "ribonuclease_site",
            url_small: "resources/images/icons/device/small/ribonuclease-site.png",
            url_large: "resources/images/icons/device/large/ribonuclease-site.png"
        },
        "RIBOSOME-ENTRY-SITE": {
            key: "RIBOSOME_ENTRY_SITE",
            name: "ribosome_entry_site",
            url_small: "resources/images/icons/device/small/ribosome-entry-site.png",
            url_large: "resources/images/icons/device/large/ribosome-entry-site.png",
        },
        "RNA-STABILITY-ELEMENT": {
            key: "RNA_STABILITY_ELEMENT",
            name: "rna_stability_element",
            url_small: "resources/images/icons/device/small/rna-stability-element.png",
            url_large: "resources/images/icons/device/large/rna-stability-element.png"
        },
        "SIGNATURE": {
            key: "SIGNATURE",
            name: "signature",
            url_small: "resources/images/icons/device/small/signature.png",
            url_large: "resources/images/icons/device/large/signature.png"
        },
        "TERMINATOR": {
            key: "TERMINATOR",
            name: "terminator",
            url_small: "resources/images/icons/device/small/terminator.png",
            url_large: "resources/images/icons/device/large/terminator.png"
        },
        "THREE-PRIME-OVERHANG": {
            key: "THREE_PRIME_OVERHANG",
            name: "three_prime_overhang",
            url_small: "resources/images/icons/device/small/three-prime-overhang.png",
            url_large: "resources/images/icons/device/large/three-prime-overhang.png"
        },
        "THREE-PRIME-RESTRICTION-SITE": {
            key: "THREE_PRIME_RESTRICTION_SITE",
            name: "three_prime_restriction_site",
            url_small: "resources/images/icons/device/small/three-prime-sticky-restriction-site.png",
            url_large: "resources/images/icons/device/large/three-prime-sticky-restriction-site.png"
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