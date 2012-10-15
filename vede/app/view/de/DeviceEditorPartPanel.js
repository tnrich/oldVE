Ext.define('Vede.view.de.DeviceEditorPartPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.DeviceEditorPartPanel',


    dock: 'top',
    id: 'DeviceEditorPartPanel',
    collapseDirection: 'top',
    collapsed: true,
    collapsible: true,
    hideCollapseTool: false,
    title: 'Parts',
    titleCollapse: true,
    dockedItems: [{
        xtype: 'toolbar',
        dock: 'top',
        height: 45,
        id: 'DeviceEditorPartsBar',
        enableOverflow: true,
        layout: {
            align: 'middle',
            pack: 'center',
            type: 'hbox'
        },
        items: [{
            xtype: 'button',
            id: 'ori_Btn',
            icon: 'resources/images/symbols/origin-of-replication.png',
            scale: 'large',
            tooltip: 'Origin of Replication'
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            id: 'cds_Btn',
            icon: 'resources/images/symbols/cds.png',
            scale: 'large',
            tooltip: 'CDS'
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            id: 'five_prime_ov_Btn',
            icon: 'resources/images/symbols/five-prime-overhang.png',
            scale: 'large',
            tooltip: '5\' Overhang'
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            id: 'three_prime_ov_Btn',
            icon: 'resources/images/symbols/three-prime-overhang.png',
            scale: 'large',
            tooltip: '3\' Overhang'
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            id: 'translational_start_site_Btn',
            icon: 'resources/images/symbols/translational-start-site.png',
            scale: 'large',
            tooltip: 'Translational Start Site'
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            id: 'promoter_Btn',
            icon: 'resources/images/symbols/promoter.png',
            scale: 'large',
            tooltip: 'Promoter'
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            id: 'primer_binding_site_Btn',
            icon: 'resources/images/symbols/primer-binding-site.png',
            scale: 'large',
            tooltip: 'Primer Binding Site'
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            id: 'restriction_enz_recog_site_Btn',
            icon: 'resources/images/symbols/restriction-enzyme-recognition-site.png',
            scale: 'large',
            tooltip: 'Restriction Enzyme Recognition Site'
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            id: 'restriction_site_w_no_overhang_Btn',
            icon: 'resources/images/symbols/restriction-site-with-no-overhang.png',
            scale: 'large',
            tooltip: 'Restriction Site With No Overhangs'
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            id: 'protease_site_Btn',
            icon: 'resources/images/symbols/protease-site.png',
            scale: 'large',
            tooltip: 'Protease Site'
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            id: 'protein_stability_element_Btn',
            icon: 'resources/images/symbols/protein-stability-element.png',
            scale: 'large',
            tooltip: 'Protein Stability Element'
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            id: 'assembly_junction_Btn',
            icon: 'resources/images/symbols/assembly-junction.png',
            scale: 'large',
            tooltip: 'Assembly Junction'
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            id: 'insulator_Btn',
            icon: 'resources/images/symbols/insulator.png',
            scale: 'large',
            tooltip: 'Insulator'
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            id: 'operator_Btn',
            icon: 'resources/images/symbols/operator.png',
            scale: 'large',
            tooltip: 'Operator'
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            id: 'ribonuclease_site_Btn',
            icon: 'resources/images/symbols/ribonuclease-site.png',
            scale: 'large',
            tooltip: 'Ribonuclease Site'
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            id: 'rna_stability_element_Btn',
            icon: 'resources/images/symbols/rna-stability-element.png',
            scale: 'large',
            tooltip: 'RNA Stability Element'
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            id: 'terminator_Btn',
            icon: 'resources/images/symbols/terminator.png',
            scale: 'large',
            tooltip: 'Terminator'
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            id: 'signature_Btn',
            icon: 'resources/images/symbols/signature.png',
            params: 'Signature',
            scale: 'large',
            tooltip: 'Signature'
        }]
    }]
}

);