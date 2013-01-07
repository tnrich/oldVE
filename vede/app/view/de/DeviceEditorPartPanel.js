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
            data: { iconKey : 'ORIGIN_OF_REPLICATION' },
            icon: 'resources/images/symbols/origin-of-replication.png',
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
            icon: 'resources/images/symbols/cds.png',
            scale: 'large',
            tooltip: 'CDS'
        }, {
            xtype: 'tbseparator',
            height: 40
        }, {
            xtype: 'button',
            cls: 'five_prime_ov_Btn',
            data: { iconKey : 'FIVE_PRIME_OVERHANG' },
            icon: 'resources/images/symbols/five-prime-overhang.png',
            scale: 'large',
            tooltip: '5\' Overhang'
        }, {
            xtype: 'tbseparator',
            height: 40
        }, {
            xtype: 'button',
            cls: 'three_prime_ov_Btn',
            data: { iconKey : 'THREE_PRIME_OVERHANG' },
            icon: 'resources/images/symbols/three-prime-overhang.png',
            scale: 'large',
            tooltip: '3\' Overhang'
        }, {
            xtype: 'tbseparator',
            height: 40
        }, {
            xtype: 'button',
            cls: 'promoter_Btn',
            data: { iconKey : 'PROMOTER' },
            icon: 'resources/images/symbols/promoter.png',
            scale: 'large',
            tooltip: 'Promoter'
        }, {
            xtype: 'tbseparator',
            height: 40
        }, {
            xtype: 'button',
            cls: 'primer_binding_site_Btn',
            data: { iconKey : 'PRIMER_BINDING_SITE' },
            icon: 'resources/images/symbols/primer-binding-site.png',
            scale: 'large',
            tooltip: 'Primer Binding Site'
        }, {
            xtype: 'tbseparator',
            height: 40
        }, {
            xtype: 'button',
            cls: 'restriction_enz_recog_site_Btn',
            data: { iconKey : 'RESTRICTION_ENZYME_RECOGNITION_SITE' },
            icon: 'resources/images/symbols/restriction-enzyme-recognition-site.png',
            scale: 'large',
            tooltip: 'Restriction Enzyme Recognition Site'
        }, {
            xtype: 'tbseparator',
            height: 40
        }, {
            xtype: 'button',
            cls: 'restriction_site_w_no_overhang_Btn',
            data: { iconKey : 'RESTRICTION_SITE_NO_OVERHANG' },
            icon: 'resources/images/symbols/restriction-site-with-no-overhang.png',
            scale: 'large',
            tooltip: 'Restriction Site With No Overhangs'
        }, {
            xtype: 'tbseparator',
            height: 40
        }, {
            xtype: 'button',
            cls: 'protease_site_Btn',
            data: { iconKey : 'PROTEASE_SITE' },
            icon: 'resources/images/symbols/protease-site.png',
            scale: 'large',
            tooltip: 'Protease Site'
        }, {
            xtype: 'tbseparator',
            height: 40
        }, {
            xtype: 'button',
            cls: 'protein_stability_element_Btn',
            data: { iconKey : 'PROTEIN_STABILITY_ELEMENT' },
            icon: 'resources/images/symbols/protein-stability-element.png',
            scale: 'large',
            tooltip: 'Protein Stability Element'
        }, {
            xtype: 'tbseparator',
            height: 40
        }, {
            xtype: 'button',
            cls: 'assembly_junction_Btn',
            data: { iconKey : 'ASSEMBLY_JUNCTION' },
            icon: 'resources/images/symbols/assembly-junction.png',
            scale: 'large',
            tooltip: 'Assembly Junction'
        }, {
            xtype: 'tbseparator',
            height: 40
        }, {
            xtype: 'button',
            cls: 'insulator_Btn',
            data: { iconKey : 'INSULATOR' },
            icon: 'resources/images/symbols/insulator.png',
            scale: 'large',
            tooltip: 'Insulator'
        }, {
            xtype: 'tbseparator',
            height: 40
        }, {
            xtype: 'button',
            cls: 'operator_Btn',
            data: { iconKey : 'OPERATOR_SITE' },
            icon: 'resources/images/symbols/operator.png',
            scale: 'large',
            tooltip: 'Operator'
        }, {
            xtype: 'tbseparator',
            height: 40
        }, {
            xtype: 'button',
            cls: 'ribonuclease_site_Btn',
            data: { iconKey : 'RIBONUCLEASE_SITE' },
            icon: 'resources/images/symbols/ribonuclease-site.png',
            scale: 'large',
            tooltip: 'Ribonuclease Site'
        }, {
            xtype: 'tbseparator',
            height: 40
        }, {
            xtype: 'button',
            cls: 'rna_stability_element_Btn',
            data: { iconKey : 'RNA_STABILITY_ELEMENT' },
            icon: 'resources/images/symbols/rna-stability-element.png',
            scale: 'large',
            tooltip: 'RNA Stability Element'
        }, {
            xtype: 'tbseparator',
            height: 40
        }, {
            xtype: 'button',
            cls: 'terminator_Btn',
            data: { iconKey : 'TERMINATOR' },
            icon: 'resources/images/symbols/terminator.png',
            scale: 'large',
            tooltip: 'Terminator'
        }, {
            xtype: 'tbseparator',
            height: 40
        }, {
            xtype: 'button',
            cls: 'signature_Btn',
            data: { iconKey : 'SIGNATURE' },
            icon: 'resources/images/symbols/signature.png',
            params: 'Signature',
            scale: 'large',
            tooltip: 'Signature'
        }, {
            xtype: 'tbseparator',
            height: 40
        }, {
            xtype: 'button',
            cls: 'five_prime_utr_Btn',
            data: { iconKey : 'FIVE_PRIME_UTR' },
            icon: 'resources/images/symbols/five_prime_utr.png',
            params: 'five_prime_utr',
            scale: 'large',
            tooltip: 'Five Prime UTR'
        }, {
            xtype: 'tbseparator',
            height: 40
        }, {
            xtype: 'button',
            cls: 'generic',
            data: { iconKey : 'GENERIC' },
            icon: 'resources/images/symbols/generic.png',
            params: 'generic',
            scale: 'large',
            tooltip: 'Generic DNA'
        }]
    }]
}

);