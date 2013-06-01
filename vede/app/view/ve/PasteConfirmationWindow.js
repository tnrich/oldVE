/**
 * Dialog that appears upon pasting into VE. Asks user if they would like to 
 * paste sequence or reverse complement of sequence.
 * @class Vede.view.ve.PasteConfirmationWindow
 */
Ext.define('Vede.view.ve.PasteConfirmationWindow', {
    extend: 'Ext.window.Window',
    title: 'Paste...',
    modal: true,
    height: 135,
    resizable: false,
    items: [{
        xtype: 'container',
        layout: {
            type: 'vbox'
        },
        height: 135,
        items: [{
            xtype: 'container',
            layout: {
                type: 'vbox'
            },
            height: 135,
            resizable: false,
            items: [{
                xtype: 'container',
                flex: 1.25,
                layout: {
                    type: 'vbox'
                },
                items: [{
                    xtype: 'radiogroup',
                    columns: 1,
                    hideLabel: true,
                    cls: 'pasteFormatRadioGroup',
                    items: [{
                        boxLabel: 'Sequence (with features if available)',
                        name: 'pasteFormatField',
                        inputValue: 'forward',
                        checked: true
                    }, {
                        boxLabel: 'Reverse Complement Sequence',
                        name: 'pasteFormatField',
                        inputValue: 'reverse'
                    }]
                }]
            }, {
                xtype: 'container',
                flex: 1,
                layout: {
                    type: 'hbox',
                    align: 'right'
                },
                items: [{
                    xtype: 'button',
                    text: 'Ok',
                    cls: 'pasteConfirmationOkButton',
                    margin: 2,
                    padding: 2
                }, {
                    xtype: 'button',
                    text: 'Cancel',
                    cls: 'pasteConfirmationCancelButton',
                    margin: 2,
                    padding: 2
                }]
            }]
        }]
    }]
});
