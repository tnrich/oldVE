/**
 * Device Editor part panel
 * @class Vede.view.de.DeviceEditorPartPanel
 */
Ext.define('Vede.view.de.DeviceEditorPartPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.DeviceEditorPartPanel',


    dock: 'top',
    cls: 'DeviceEditorPartPanel',
    collapseDirection: 'top',
    collapsed: false,
    hideCollapseTool: true,
    titleCollapse: true,
    dockedItems: [{
        xtype: 'toolbar',
        dock: 'top',
        height: 45,
        cls: 'DeviceEditorPartsBar',
        enableOverflow: true,
        layout: {
            align: 'left',
            pack: 'center',
            type: 'hbox'
        },
        items: [{
            xtype: 'button',
            cls: 'ori_Btn',
            data: { iconKey : 'ORIGIN-OF-REPLICATION' },
            icon: 'resources/images/icons/device/small/origin-of-replication.png',
            scale: 'large',
            tooltip: 'Origin of Replication'
        }, {
            xtype: 'tbseparator',
            cls: 'parttoolbarseparator',
            height: 40
        }, {
            xtype: 'button',
            cls: 'cds_Btn',
            data: { iconKey : 'CDS' },
            icon: 'resources/images/icons/device/small/cds.png',
            scale: 'large',
            tooltip: 'CDS'
        }, {
            xtype: 'tbseparator',
            height: 40
        }, {
            xtype: 'button',
            cls: 'five_prime_ov_Btn',
            data: { iconKey : 'FIVE-PRIME-OVERHANG' },
            icon: 'resources/images/icons/device/small/five-prime-overhang.png',
            scale: 'large',
            tooltip: '5\' Overhang'
        }, {
            xtype: 'tbseparator',
            height: 40
        }, {
            xtype: 'button',
            cls: 'three_prime_ov_Btn',
            data: { iconKey : 'THREE-PRIME-OVERHANG' },
            icon: 'resources/images/icons/device/small/three-prime-overhang.png',
            scale: 'large',
            tooltip: '3\' Overhang'
        }, {
            xtype: 'tbseparator',
            height: 40
        }, {
            xtype: 'button',
            cls: 'promoter_Btn',
            data: { iconKey : 'PROMOTER' },
            icon: 'resources/images/icons/device/small/promoter.png',
            scale: 'large',
            tooltip: 'Promoter'
        }, {
            xtype: 'tbseparator',
            height: 40
        }, {
            xtype: 'button',
            cls: 'primer_binding_site_Btn',
            data: { iconKey : 'PRIMER-BINDING-SITE' },
            icon: 'resources/images/icons/device/small/primer-binding-site.png',
            scale: 'large',
            tooltip: 'Primer Binding Site'
        }, {
            xtype: 'tbseparator',
            height: 40
        }, {
            xtype: 'button',
            cls: 'five_prime_restriction_site_Btn',
            data: { iconKey : 'FIVE-PRIME-STICKY-RESTRICTION-SITE' },
            icon: 'resources/images/icons/device/small/five-prime-sticky-restriction-site.png',
            scale: 'large',
            tooltip: '5\' Sticky Restriction Site'
        }, {
            xtype: 'tbseparator',
            height: 40
        },{
            xtype: 'button',
            cls: 'three_prime_restriction_site_Btn',
            data: { iconKey : 'THREE-PRIME-RESTRICTION-SITE' },
            icon: 'resources/images/icons/device/small/three-prime-sticky-restriction-site.png',
            scale: 'large',
            tooltip: '3\' Sticky Restriction Site'
        }, {
            xtype: 'tbseparator',
            height: 40
        },{
            xtype: 'button',
            cls: 'restriction_enz_recog_site_Btn',
            data: { iconKey : 'RESTRICTION-ENZYME-RECOGNITION-SITE' },
            icon: 'resources/images/icons/device/small/restriction-enzyme-recognition-site.png',
            scale: 'large',
            tooltip: 'Restriction Enzyme Recognition Site'
        }, {
            xtype: 'tbseparator',
            height: 40
        },{
            xtype: 'button',
            cls: 'blunt_restriction_site_Btn',
            data: { iconKey : 'BLUNT-RESTRICTION-SITE' },
            icon: 'resources/images/icons/device/small/blunt-restriction-site.png',
            scale: 'large',
            tooltip: 'Blunt Restriction Site'
        }, {
            xtype: 'tbseparator',
            height: 40
        }, {
            xtype: 'button',
            cls: 'restriction_site_w_no_overhang_Btn',
            data: { iconKey : 'RESTRICTION-SITE-NO-OVERHANG' },
            icon: 'resources/images/icons/device/small/restriction-site-with-no-overhang.png',
            scale: 'large',
            tooltip: 'Restriction Site With No Overhangs'
        }, {
            xtype: 'tbseparator',
            height: 40
        }, {
            xtype: 'button',
            cls: 'protease_site_Btn',
            data: { iconKey : 'PROTEASE-SITE' },
            icon: 'resources/images/icons/device/small/protease-site.png',
            scale: 'large',
            tooltip: 'Protease Site'
        }, {
            xtype: 'tbseparator',
            height: 40
        }, {
            xtype: 'button',
            cls: 'protein_stability_element_Btn',
            data: { iconKey : 'PROTEIN-STABILITY-ELEMENT' },
            icon: 'resources/images/icons/device/small/protein-stability-element.png',
            scale: 'large',
            tooltip: 'Protein Stability Element'
        }, {
            xtype: 'tbseparator',
            height: 40
        }, {
            xtype: 'button',
            cls: 'assembly_junction_Btn',
            data: { iconKey : 'ASSEMBLY-SCAR' },
            icon: 'resources/images/icons/device/small/assembly-scar.png',
            scale: 'large',
            tooltip: 'Assembly Junction'
        }, {
            xtype: 'tbseparator',
            height: 40
        }, {
            xtype: 'button',
            cls: 'insulator_Btn',
            data: { iconKey : 'INSULATOR' },
            icon: 'resources/images/icons/device/small/insulator.png',
            scale: 'large',
            tooltip: 'Insulator'
        }, {
            xtype: 'tbseparator',
            height: 40
        }, {
            xtype: 'button',
            cls: 'operator_Btn',
            data: { iconKey : 'OPERATOR' },
            icon: 'resources/images/icons/device/small/operator.png',
            scale: 'large',
            tooltip: 'Operator'
        }, {
            xtype: 'tbseparator',
            height: 40
        }, {
            xtype: 'button',
            cls: 'ribonuclease_site_Btn',
            data: { iconKey : 'RIBONUCLEASE-SITE' },
            icon: 'resources/images/icons/device/small/ribonuclease-site.png',
            scale: 'large',
            tooltip: 'Ribonuclease Site'
        }, {
            xtype: 'tbseparator',
            height: 40
        }, {
            xtype: 'button',
            cls: 'rna_stability_element_Btn',
            data: { iconKey : 'RNA-STABILITY-ELEMENT' },
            icon: 'resources/images/icons/device/small/rna-stability-element.png',
            scale: 'large',
            tooltip: 'RNA Stability Element'
        }, {
            xtype: 'tbseparator',
            height: 40
        }, {
            xtype: 'button',
            cls: 'terminator_Btn',
            data: { iconKey : 'TERMINATOR' },
            icon: 'resources/images/icons/device/small/terminator.png',
            scale: 'large',
            tooltip: 'Terminator'
        }, {
            xtype: 'tbseparator',
            height: 40
        }, {
            xtype: 'button',
            cls: 'signature_Btn',
            data: { iconKey : 'SIGNATURE' },
            icon: 'resources/images/icons/device/small/signature.png',
            params: 'Signature',
            scale: 'large',
            tooltip: 'Signature'
        }, {
            xtype: 'tbseparator',
            height: 40
        }, {
            xtype: 'button',
            cls: 'five_prime_utr_Btn',
            data: { iconKey : 'FIVE-PRIME-UTR' },
            icon: 'resources/images/icons/device/small/ribosome-entry-site.png',
            params: 'five_prime_utr',
            scale: 'large',
            tooltip: 'Five Prime UTR'
        }, {
            xtype: 'tbseparator',
            height: 40
        }, {
            xtype: 'button',
            cls: 'generic',
            data: { iconKey : 'USER-DEFINED' },
            icon: 'resources/images/icons/device/small/generic.png',
            params: 'generic',
            scale: 'large',
            tooltip: 'Generic DNA'
        }]
    }]
}

);