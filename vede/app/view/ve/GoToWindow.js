/**
 * 'Go To' dialog. Asks user where they would like to go to in the DNA sequence.
 * @class Vede.view.ve.GoToWindow
 */
Ext.define('Vede.view.ve.GoToWindow', {
    extend: 'Ext.window.Window',
    title: 'Go To...',
    modal: true,
    height: 85,
    resizable: false,
    items: [{
        xtype: 'container',
        layout: {
            type: 'vbox'
        },
        height: 85,
        items: [{
            xtype: 'numberfield',
            fieldLabel: 'Position',
            allowDecimals: false,
            enableKeyEvents: true,
            minValue: 0,
            value: 0
        }, {
            xtype: 'container',
            layout: {
                type: 'hbox'
            },
            items: [{
                xtype: 'button',
                text: 'Ok',
                margin: 2,
                padding: 2,
                handler: function() {
                    this.up("window").goto()
                }
            }, {
                xtype: 'button',
                text: 'Cancel',
                margin: 2,
                padding: 2,
                handler: function() {
                    this.up("window").close();
                }
            }]
        }]
    }],
    goto: function() {
        Vede.application.fireEvent(
                        this.CaretEvent.CARET_POSITION_CHANGED, 
                        this,
                        this.down('numberfield').getValue());

        this.close();
    }
});

//@ sourceURL=app/view/ve/GoToWindow.js
