/**
 * j5 parameters view
 * @class Vede.view.de.j5Parameters
 */
Ext.define('Vede.view.de.j5Parameters', {
    extend: 'Ext.window.Window',

    height: 760,
    maxHeight: 830,
    width: 845,
    maxWidth: 845,
    title: 'j5 Parameters',
    cls: 'j5Parameters_Window',
    alias: 'j5ParametersWindow',
    autoScroll: true,
    modal: true,
    maximizable: false,
    resizable: true,

    initComponent: function () {
        var me = this;

        Ext.applyIf(me, {
            items: [
                {
                xtype: 'container',
                cls: 'j5Parameters_Buttons',
                height: '40px',
                layout: {
                    align: 'stretch',
                    type:'hbox'
                },
                items: [
                    {
                        xtype: 'combobox',
                        cls: 'inWindowPresetSelector',
                        fieldLabel: '<b>Parameters Preset:</b>',
                        labelCls: 'assembly-label',
                        editable: false,
                        labelSeparator: ' ',
                        labelWidth: 110,
                        width:550,
                        queryMode: 'local',
                        displayField: 'presetName',
                        valueField: 'presetName',
                        x: 0,
                        y: 5,
                        margin: 5,
                        maxHeight: 23,
                        minHeight: 23,
                        padding: ''
                    }, {
                        xtype: 'button',
                        cls: 'savePresetBtn',
                        x: 360,
                        y: 5,
                        margin: 5,
                        maxHeight: 23,
                        minHeight: 23,
                        padding: '',
                        text: '<b>Save Preset</b>'
                    }, {
                        xtype: 'button',
                        cls: 'deletePresetBtn',
                        x: 440,
                        y: 5,
                        margin: 5,
                        maxHeight: 23,
                        minHeight: 23,
                        padding: '',
                        text: '<b>Delete Preset</b>'
                    }, {
                        xtype: 'button',
                        cls: 'newPresetBtn',
                        x: 530,
                        y: 5,
                        margin: 5,
                        maxHeight: 23,
                        minHeight: 23,
                        padding: '',
                        text: '<b>New Preset</b>'
                    }]
                },
                {
                xtype: 'container',
                layout: {
                    align: 'stretch',
                    type: 'hbox'
                },
                items: [
                    {
                    xtype: 'container',
                    flex: 1,
                    items: [{
                        xtype: 'numberfield',
                        cls: 'masterOligoNumberOfDigitsValue',
                        padding: 3,
                        fieldLabel: 'Master Oligo Num of Digits (5)',
                        labelSeparator: ' ',
                        labelWidth: 270,
                        emptyText: '100',
                        decimalPrecision: 1,
                        minValue: 0
                    }, {
                        xtype: 'numberfield',
                        cls: 'masterPlasmidNumberOfDigitsValue',
                        padding: 3,
                        fieldLabel: 'Master Plasmid Num of Digits (5)',
                        labelSeparator: ' ',
                        labelWidth: 270,
                        emptyText: '100',
                        minValue: 0
                    }, {
                        xtype: 'numberfield',
                        cls: 'gibsonOverlapBPsValue',
                        padding: 3,
                        fieldLabel: 'Gibson Overlap BPs (26)',
                        labelSeparator: ' ',
                        labelWidth: 270,
                        emptyText: '100',
                        minValue: 0
                    }, {
                        xtype: 'numberfield',
                        cls: 'gibsonOverlapMinTmValue',
                        padding: 3,
                        fieldLabel: 'Gibson Overlap Min Tm (60)',
                        labelSeparator: ' ',
                        labelWidth: 270,
                        emptyText: '100',
                        minValue: 0
                    }, {
                        xtype: 'numberfield',
                        cls: 'gibsonOverlapMaxTmValue',
                        padding: 3,
                        fieldLabel: 'Gibson Overlap Max Tm (70)',
                        labelSeparator: ' ',
                        labelWidth: 270,
                        emptyText: '100',
                        minValue: 0
                    }, {
                        xtype: 'numberfield',
                        cls: 'maxOligoLengthBPsValue',
                        padding: 3,
                        fieldLabel: 'Maximum Num of Oligo BPs (110)',
                        labelSeparator: ' ',
                        labelWidth: 270,
                        emptyText: '100',
                        minValue: 0
                    }, {
                        xtype: 'numberfield',
                        cls: 'minFragmentSizeGibsonBPsValue',
                        padding: 3,
                        fieldLabel: 'Minimum Gibson Fragment Size BPs (250)',
                        labelSeparator: ' ',
                        labelWidth: 270,
                        emptyText: '100',
                        minValue: 0
                    }, {
                        xtype: 'numberfield',
                        cls: 'goldenGateOverhangBPsValue',
                        padding: 3,
                        fieldLabel: 'Golden Gate Overhang BPs (4)',
                        labelSeparator: ' ',
                        labelWidth: 270,
                        emptyText: '100',
                        minValue: 0
                    }, {
                        xtype: 'textfield',
                        cls: 'goldenGateRecognitionSeqValue',
                        padding: 3,
                        fieldLabel: 'Golden Gate Recognition Sequence (GGTCTC)',
                        labelSeparator: ' ',
                        labelWidth: 270,
                        emptyText: '100'
                    }, {
                        xtype: 'textfield',
                        cls: 'goldenGateTerminiExtraSeqValue',
                        padding: 3,
                        fieldLabel: 'Golden Gate Term Extra Seq (CACACCAGGTCTCA)',
                        labelSeparator: ' ',
                        labelWidth: 270,
                        emptyText: '100'
                    }, {
                        xtype: 'numberfield',
                        cls: 'maxIdentitiesGoldenGateOverhangsCompatibleValue',
                        padding: 3,
                        fieldLabel: 'Max Identities Golden Gate Overhangs (2)',
                        labelSeparator: ' ',
                        labelWidth: 270,
                        emptyText: '100',
                        minValue: 0
                    }, {
                        xtype: 'numberfield',
                        cls: 'oligoSynthesisCostPerBPUSDValue',
                        padding: 3,
                        fieldLabel: 'Oligo Synthesis Cost Per BP (US) (0.1)',
                        labelSeparator: ' ',
                        labelWidth: 270,
                        emptyText: '100',
                        decimalPrecision: 3,
                        minValue: 0,
                        step: 0.01
                    }, {
                        xtype: 'numberfield',
                        cls: 'oligoPagePurificationCostPerPieceUSDValue',
                        padding: 3,
                        fieldLabel: 'Oligo Purification Cost Per Piece (US) (40)',
                        labelSeparator: ' ',
                        labelWidth: 270,
                        emptyText: '100',
                        decimalPrecision: 3,
                        minValue: 0,
                        step: 0.01
                    }, {
                        xtype: 'numberfield',
                        cls: 'oligoMaxLengthNoPagePurificationRequiredBPsValue',
                        padding: 3,
                        fieldLabel: 'Oligo Max Length No Page Purification (60)',
                        labelSeparator: ' ',
                        labelWidth: 270,
                        emptyText: '100',
                        minValue: 0
                    }, {
                        xtype: 'numberfield',
                        cls: 'minPCRProductBPsValue',
                        padding: 3,
                        fieldLabel: 'Minimum PCR Product BPs (100)',
                        labelSeparator: ' ',
                        labelWidth: 270,
                        emptyText: '100',
                        minValue: 0
                    }, {
                        xtype: 'numberfield',
                        cls: 'directSynthesisCostPerBPUSDValue',
                        padding: 3,
                        fieldLabel: 'Direct Synthesis Cost Per BP (US) (0.39)',
                        labelSeparator: ' ',
                        labelWidth: 270,
                        emptyText: '100',
                        decimalPrecision: 3,
                        minValue: 0,
                        step: 0.01
                    }, {
                        xtype: 'numberfield',
                        cls: 'directSynthesisMinCostPerPieceUSDValue',
                        padding: 3,
                        fieldLabel: 'Direct Synthesis Min. Cost Per Piece (US) (159)',
                        labelSeparator: ' ',
                        labelWidth: 270,
                        emptyText: '100',
                        decimalPrecision: 3,
                        minValue: 0,
                        step: 0.01
                    }, {
                        xtype: 'combobox',
                        cls: 'outputSequenceFormatValue',
                        padding: 3,
                        fieldLabel: 'Output Sequence Format (Genbank)',
                        labelSeparator: ' ',
                        labelWidth: 270,
                        queryMode: 'local',
                        store: ['Genbank', 'FASTA', 'jbei-seq', 'SBOLXML'],
                        value: 'Genbank'
                    }]
                }, {
                    xtype: 'container',
                    flex: 0.8,
                    width: 370,
                    items: [{
                        xtype: 'numberfield',
                        cls: 'primerGCClampValue',
                        padding: 3,
                        fieldLabel: 'Primer GC Clamp (2)',
                        labelSeparator: ' ',
                        labelWidth: 200,
                        emptyText: '100',
                        decimalPrecision: 1,
                        minValue: 0
                    }, {
                        xtype: 'numberfield',
                        cls: 'primerMinSizeValue',
                        padding: 3,
                        fieldLabel: 'Primer Min Size (18)',
                        labelSeparator: ' ',
                        labelWidth: 200,
                        emptyText: '100',
                        minValue: 0
                    }, {
                        xtype: 'numberfield',
                        cls: 'primerMaxSizeValue',
                        padding: 3,
                        fieldLabel: 'Primer Max Size (36)',
                        labelSeparator: ' ',
                        labelWidth: 200,
                        emptyText: '100',
                        minValue: 0
                    }, {
                        xtype: 'numberfield',
                        cls: 'primerMinTmValue',
                        padding: 3,
                        fieldLabel: 'Primer Min Tm (60)',
                        labelSeparator: ' ',
                        labelWidth: 200,
                        emptyText: '100',
                        minValue: 0
                    }, {
                        xtype: 'numberfield',
                        cls: 'primerMaxTmValue',
                        padding: 3,
                        fieldLabel: 'Primer Max Tm (70)',
                        labelSeparator: ' ',
                        labelWidth: 200,
                        emptyText: '100',
                        minValue: 0
                    }, {
                        xtype: 'numberfield',
                        cls: 'primerMaxDiffTmValue',
                        padding: 3,
                        fieldLabel: 'Primer Max Tm Diff (5)',
                        labelSeparator: ' ',
                        labelWidth: 200,
                        emptyText: '100',
                        minValue: 0
                    }, {
                        xtype: 'numberfield',
                        cls: 'primerMaxSelfAnyThValue',
                        padding: 3,
                        fieldLabel: 'Primer Max Self Compl Any TH (47)',
                        labelSeparator: ' ',
                        labelWidth: 200,
                        emptyText: '100',
                        minValue: 0
                    }, {
                        xtype: 'numberfield',
                        cls: 'primerMaxSelfEndThValue',
                        padding: 3,
                        fieldLabel: 'Primer Max Self Compl End TH (47)',
                        labelSeparator: ' ',
                        labelWidth: 200,
                        emptyText: '100',
                        minValue: 0
                    }, {
                        xtype: 'numberfield',
                        cls: 'primerPairMaxComplAnyThValue',
                        padding: 3,
                        fieldLabel: 'Primer Pair Max Compl Any TH (47)',
                        labelSeparator: ' ',
                        labelWidth: 200,
                        emptyText: '100',
                        minValue: 0
                    }, {
                        xtype: 'numberfield',
                        cls: 'primerPairMaxComplEndThValue',
                        padding: 3,
                        fieldLabel: 'Primer Pair Max Compl End TH (47)',
                        labelSeparator: ' ',
                        labelWidth: 200,
                        emptyText: '100',
                        minValue: 0
                    }, {
                        xtype: 'checkboxfield',
                        cls: 'primerTmSantaluciaValue',
                        padding: 3,
                        fieldLabel: 'Primer Tm Santa Lucia (enabled)',
                        labelSeparator: ' ',
                        labelWidth: 200,
                        checked: true
                    }, {
                        xtype: 'checkboxfield',
                        cls: 'primerSaltCorrectionsValue',
                        padding: 3,
                        fieldLabel: 'Primer Salt Corrections (enabled)',
                        labelSeparator: ' ',
                        labelWidth: 200,
                        checked: true
                    }, {
                        xtype: 'numberfield',
                        cls: 'primerDnaConcValue',
                        padding: 3,
                        fieldLabel: 'Primer DNA Conc (250)',
                        labelSeparator: ' ',
                        labelWidth: 200,
                        emptyText: '100',
                        minValue: 0
                    }, {
                        xtype: 'numberfield',
                        cls: 'mispriming3PrimeBoundaryBPToWarnIfHitValue',
                        padding: 3,
                        fieldLabel: 'MisPriming 3\' Boundary (4)',
                        labelSeparator: ' ',
                        labelWidth: 200,
                        emptyText: '100',
                        minValue: 0
                    }, {
                        xtype: 'numberfield',
                        cls: 'misprimingMinTmValue',
                        padding: 3,
                        fieldLabel: 'MisPriming Min Tm (45)',
                        labelSeparator: ' ',
                        labelWidth: 200,
                        emptyText: '100',
                        minValue: 0
                    }, {
                        xtype: 'numberfield',
                        cls: 'misprimingSaltConcValue',
                        padding: 3,
                        fieldLabel: 'MisPriming Salt Conc (0.05)',
                        labelSeparator: ' ',
                        labelWidth: 200,
                        emptyText: '100',
                        minValue: 0,
                        step: 0.01
                    }, {
                        xtype: 'numberfield',
                        cls: 'misprimingOligoConcValue',
                        padding: 3,
                        fieldLabel: 'MisPriming Oligo Conc (2.5e-7)',
                        labelSeparator: ' ',
                        labelWidth: 200,
                        emptyText: '100',
                        decimalPrecision: 8,
                        step: 0.00000001,
                        minValue: 0
                    }, {
                        xtype: 'checkboxfield',
                        cls: 'suppressPurePrimersValue',
                        padding: 3,
                        fieldLabel: 'Suppress Pure Primers (enabled)',
                        labelSeparator: ' ',
                        labelWidth: 200,
                        checked: true
                    }, {
                        xtype: 'checkboxfield',
                        cls: 'suppressPrimerAnnotationsValue',
                        padding: 3,
                        fieldLabel: 'Suppress Primer Annotations (disabled)',
                        labelSeparator: ' ',
                        labelWidth: 200,
                        checked: false
                    }, {
                        xtype: 'numberfield',
                        cls: 'homologyMinLengthBPS',
                        padding: 3,
                        fieldLabel: 'Homology Min Length BPS (26)',
                        labelSeparator: ' ',
                        labelWidth: 200,
                        emptyText: '100',
                        minValue: 0
                    }, {
                        xtype: 'numberfield',
                        cls: 'homologyMaxFractionMisMatches',
                        padding: 3,
                        fieldLabel: 'Homology Max Fraction Mis matches (0.05)',
                        labelSeparator: ' ',
                        labelWidth: 200,
                        emptyText: '100',
                        minValue: 0,
                        step: 0.01
                    }]
                }]
            }, {
                xtype: 'container',
                cls: 'j5Parameters_Buttons',
                height: '40px',
                layout: {
                    type: 'absolute'
                },
                items: [
                {
                    xtype: 'button',
                    cls: 'j5ParamsCancelBtn',
                    x: 640,
                    y: 5,
                    margin: 5,
                    maxHeight: 23,
                    minHeight: 23,
                    padding: '',
                    width: 75,
                    text: '<b>Cancel</b>'
                }, {
                    xtype: 'button',
                    cls: 'j5ParamsOKBtn',
                    x: 730,
                    y: 5,
                    margin: 5,
                    maxHeight: 23,
                    minHeight: 23,
                    padding: '',
                    width: 75,
                    text: '<b>OK</b>'
                }]
            }]
        });

        me.callParent(arguments);
        me.center();

        me.on("maximize", function (me) {
            me.center();
        });

        me.on("restore", function (me) {
            me.center();
        });
    }

});
