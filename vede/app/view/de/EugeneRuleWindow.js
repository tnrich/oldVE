Ext.define('Vede.view.de.EugeneRuleWindow', {
    extend: 'Ext.window.Window',

    title: 'Add Eugene Rule',
    cls: 'addEugeneRuleWindow',
    modal: true,
    draggable: true,
    resizable: false,

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
                            xtype: 'combobox',
                            name: 'compositionalOperator',
                            fieldLabel: 'Operator',
                            store: Teselagen.constants.Constants.COMPOP_LIST
                        },
                        {
                            xtype: 'combobox',
                            cls: 'operand2Field',
                            fieldLabel: 'Operand 2',
                            store: [],
                            queryMode: 'local'
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
