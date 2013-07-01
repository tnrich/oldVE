/**
 * 'Go To' dialog. Asks user where they would like to go to in the DNA sequence.
 * @class Vede.view.ve.GoToWindow
 */
Ext.define('Vede.view.ve.GoToWindow', {
    extend: 'Ext.window.Window',
    title: 'Go To...',
    modal: true,
    height: 110,
    resizable: false,
    items: [{
        xtype: 'container',
        layout: {
            type: 'vbox'
        },
        height: 110,
        items: [{
            xtype: 'numberfield',
            fieldLabel: 'Position',
            allowDecimals: false,
            enableKeyEvents: true,
            minText: 'Position must be at least 1.',
            minValue: 1,
            msgTarget: 'under',
            value: 1
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
                    this.up('window').moveto()
                }
            }, {
                xtype: 'button',
                text: 'Cancel',
                margin: 2,
                padding: 2,
                handler: function() {
                    this.up('window').close();
                }
            }]
        }]
    }],
    moveto: function() {
        var field = this.down('numberfield');
        var index = field.getValue();

        if(index > field.maxValue) {
            index = field.maxValue;
        } else if(index < field.minValue) {
            index = field.minValue - 1;
        }

        Vede.application.fireEvent(
                        this.CaretEvent.CARET_POSITION_CHANGED, 
                        this, index - 1);

        this.close();
    }
});

//@ sourceURL=app/view/ve/GoToWindow.js
