Ext.define('Vede.view.de.EugeneRuleDialog', {
    extend: 'Ext.window.Window',

    title: 'Add Eugene Rule',
    cls: 'addEugeneRuleDialog',
    modal: true,
    draggable: true,
    resizable: false,
    closable: false,

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'form',
                    cls: 'newEugeneRuleForm',
                    layout: {
                        type: 'vbox'
                    },
                    items: [
                        {
                            xtype: 'textfield',
                            name: 'name',
                            fieldLabel: 'Name'
                        },
                        {
                            xtype: 'displayfield',
                            cls: 'operand1Field',
                            fieldLabel: 'Operand 1'
                        },
                        {
                            xtype: 'checkbox',
                            cls: 'negationOperatorField',
                            fieldLabel: 'NOT?'
                        },
                        {
                            xtype: 'combobox',
                            name: 'compositionalOperator',
                            cls: 'compositionalOperatorCombobox',
                            fieldLabel: 'Operator',
                            store: Teselagen.constants.Constants.COMPOP_LIST
                        },
                        {
                            xtype: 'combobox',
                            cls: 'operand2PartField',
                            fieldLabel: 'Operand 2',
                            store: [],
                            queryMode: 'local'
                        },
                        {
                            xtype: 'numberfield',
                            cls: 'operand2NumberField',
                            fieldLabel: 'Operand 2',
                            hidden: true,
                            value: 0,
                            step: 1,
                            minValue: 0,
                            allowDecimals: false
                        }
                    ]
                }
            ],
            buttons: [
                {
                    text: 'Done',
                    cls: 'submitNewEugeneRuleBtn',
                },
                {
                    text: 'Cancel',
                    cls: 'cancelNewEugeneRuleBtn'
                }
            ]
        });

        me.callParent(arguments);
        me.center();
    }
});

