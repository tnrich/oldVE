/**
 * j5 automation parameters view
 * @class Vede.view.de.j5AutomationParameters
 */
Ext.define('Vede.view.de.j5AutomationParameters', {
    extend: 'Ext.window.Window',

    height: 490,
    padding: 5,
    width: 490,
    title: 'Downstream Automation Parameters',
    resizable: false,
    draggable: false,
    modal: true,

    initComponent: function () {
        var me = this;

        Ext.applyIf(me, {
            items: [{
                xtype: 'numberfield',
                cls: 'maxDeltaTemperatureAdjacentZonesValue',
                padding: 3,
                fieldLabel: 'Max Delta Temp Adjacent Zones (5)',
                labelSeparator: ' ',
                labelWidth: 310,
                value: 5.0,
                maxValue: 1000,
                minValue: 0,
                step: 0.1
            }, {
                xtype: 'numberfield',
                cls: 'maxDeltaTemperatureReactionOptimumZoneAcceptableValue',
                padding: 3,
                fieldLabel: 'Max Delta Temp Reaction Optimum Zone Acceptable (5)',
                labelSeparator: ' ',
                labelWidth: 310,
                value: 5.0,
                step: 0.1
            }, {
                xtype: 'numberfield',
                cls: 'maxMcStepsPerZoneValue',
                padding: 3,
                fieldLabel: 'Max MC Steps Per Zone (1000)',
                labelSeparator: ' ',
                labelWidth: 310,
                value: 1000,
                decimalPrecision: 1,
                minValue: 0
            }, {
                xtype: 'numberfield',
                cls: 'maxWellVolumeMultiwellPlateValue',
                padding: 3,
                fieldLabel: 'Max Well Volume Multi-well Plate (100)',
                labelSeparator: ' ',
                labelWidth: 310,
                value: 100,
                minValue: 0
            }, {
                xtype: 'numberfield',
                cls: 'mcTemperatureFinalValue',
                padding: 3,
                fieldLabel: 'MC Temp Final (0.0001)',
                labelSeparator: ' ',
                labelWidth: 310,
                value: 0.0001,
                decimalPrecision: 6,
                minValue: 0,
                step: 0.00001
            }, {
                xtype: 'numberfield',
                cls: 'mcTemperatureInitialValue',
                padding: 3,
                fieldLabel: 'MC Temp Initial (0.1)',
                labelSeparator: ' ',
                labelWidth: 310,
                value: 0.1,
                decimalPrecision: 3,
                minValue: 0,
                step: 0.01
            }, {
                xtype: 'numberfield',
                cls: 'minPipettingVolumeValue',
                padding: 3,
                fieldLabel: 'Min Pipetting Volume (5)',
                labelSeparator: ' ',
                labelWidth: 310,
                value: 5,
                decimalPrecision: 2,
                minValue: 0,
                step: 0.1
            }, {
                xtype: 'numberfield',
                cls: 'nColumnsMultiwellPlateValue',
                padding: 3,
                fieldLabel: 'Num Columns in Multi-well Plate (12)',
                labelSeparator: ' ',
                labelWidth: 310,
                value: 12,
                decimalPrecision: 1,
                minValue: 1,
                step: 1
            }, {
                xtype: 'numberfield',
                cls: 'nRowsMultiwellPlateValue',
                padding: 3,
                fieldLabel: 'Num Rows in Multi-well Plate (8)',
                labelSeparator: ' ',
                labelWidth: 310,
                value: 12,
                decimalPrecision: 1,
                minValue: 1,
                step: 1
            }, {
                xtype: 'numberfield',
                cls: 'trialDeltaTemperatureValue',
                padding: 3,
                fieldLabel: 'Trial Delta Temp (0.1)',
                labelSeparator: ' ',
                labelWidth: 310,
                value: 0.1,
                decimalPrecision: 2,
                minValue: 0,
                step: 0.1
            }, {
                xtype: 'numberfield',
                cls: 'wellsPerThermocyclerZoneValue',
                padding: 3,
                fieldLabel: 'Wells Per Thermocycler Zone (16)',
                labelSeparator: ' ',
                labelWidth: 310,
                value: 16,
                decimalPrecision: 1,
                minValue: 0,
                step: 1
            }, {
                xtype: 'numberfield',
                cls: 'zonesPerThermocyclerBlockValue',
                padding: 3,
                fieldLabel: 'Zones Per Thermocycler Block (6)',
                labelSeparator: ' ',
                labelWidth: 310,
                value: 6,
                decimalPrecision: 1,
                minValue: 0,
                step: 1
            }, {
                xtype: 'container',
                height: 80,
                layout: {
                    type: 'absolute'
                },
                items: [{
                    xtype: 'button',
                    cls: 'automationParamsCancelBtn',
                    x: 300,
                    y: 50,
                    margin: 5,
                    maxHeight: 23,
                    minHeight: 23,
                    minWidth: 75,
                    padding: '',
                    text: '<b>Cancel</b>'
                }, {
                    xtype: 'button',
                    cls: 'automationParamsOKBtn',
                    x: 390,
                    y: 50,
                    margin: 5,
                    maxHeight: 23,
                    minHeight: 23,
                    minWidth: 75,
                    padding: '',
                    text: '<b>OK</b>'
                }, {
                    xtype: 'button',
                    cls: 'automationParamsResetBtn',
                    x: 0,
                    y: 50,
                    margin: 5,
                    maxHeight: 23,
                    minHeight: 23,
                    padding: '',
                    text: '<b>Reset To Defaults</b>'
                }]
            }]
        });

        me.callParent(arguments);
    }

});
