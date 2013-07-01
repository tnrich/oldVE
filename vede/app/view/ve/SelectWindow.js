/**
 * Select window
 * @class Vede.view.ve.SelectWindow
 */
Ext.define('Vede.view.ve.SelectWindow', {
    extend: 'Ext.window.Window',

    layout: {
        align: 'stretch',
        type: 'vbox'
    },
    title: 'Select...',
    resizable: false,
    draggable: false,
    modal: true,

    width: 158,

    initComponent: function() {
        var me = this;
        
        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'container',
                    layout: {
                        align: 'stretch',
                        type: 'vbox'
                    },
                    padding: 2,
                    flex: 1,
                    items: [
                        {
                            xtype: 'textfield',
                            id: 'selectWindowFromField',
                            fieldLabel: 'From',
                            labelAlign: 'right',
                            labelWidth: 50
                        },
                        {   xtype: 'textfield',
                            id: 'selectWindowToField',
                            fieldLabel: 'To',
                            labelAlign: 'right',
                            labelWidth: 50
                        }
                    ]
                },
                {
                    xtype: 'container',
                    layout: {
                        pack: 'end',
                        type: 'hbox'
                    },
                    flex: 0.3,
                    items: [
                        {
                            xtype: 'button',
                            height: 23,
                            id: 'selectWindowOKButton',
                            margin: 2,
                            maxHeight: 28,
                            width: 69,
                            text: 'OK'
                        },
                        {
                            xtype: 'button',
                            height: 23,
                            id: 'selectWindowCancelButton',
                            margin: 2,
                            maxHeight: 28,
                            width: 69,
                            text: 'Cancel',
                            handler: function() {
                                this.up('window').close();
                            }
                        }
                    ]
                }
            ]
        });

        me.callParent(arguments);
    }
});
