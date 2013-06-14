Ext.define('Vede.view.de.EugeneRuleDialog', {
    extend: 'Ext.window.Window',

    statics: {
        FORM_WIDTH: 285
    },

    title: 'Add Eugene Rule',
    cls: 'addEugeneRuleDialog',
    closable: false,
    draggable: true,
    modal: true,
    resizable: false,
    maxWidth: 400,

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
                            fieldLabel: 'Name',
                            width: this.self.FORM_WIDTH
                        },
                        {
                            xtype: 'displayfield',
                            cls: 'operand1Field',
                            fieldLabel: 'Operand 1',
                            width: this.self.FORM_WIDTH
                        },
                        {
                            xtype: 'checkbox',
                            cls: 'negationOperatorField',
                            fieldLabel: 'NOT?',
                            width: this.self.FORM_WIDTH
                        },
                        {
                            xtype: 'combobox',
                            name: 'compositionalOperator',
                            cls: 'compositionalOperatorCombobox',
                            fieldLabel: 'Operator',
                            store: Teselagen.constants.Constants.COMPOP_LIST,
                            width: this.self.FORM_WIDTH
                        },
                        {
                            xtype: 'combobox',
                            cls: 'operand2PartField',
                            fieldLabel: 'Operand 2',
                            store: [],
                            queryMode: 'local',
                            width: this.self.FORM_WIDTH
                        },
                        {
                            xtype: 'numberfield',
                            cls: 'operand2NumberField',
                            fieldLabel: 'Operand 2',
                            hidden: true,
                            value: 0,
                            step: 1,
                            minValue: 0,
                            allowDecimals: false,
                            width: this.self.FORM_WIDTH
                        }
                    ]
                }
            ],
            buttons: [
                {
                    text: 'Done',
                    cls: 'submitNewEugeneRuleBtn'
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

