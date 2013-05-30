/**
 * Dialog that appears upon pasting into VE. Asks user if they would like to 
 * paste sequence or reverse complement of sequence.
 * @class Vede.view.ve.PasteConfirmationWindow
 */
Ext.define('Vede.view.ve.PasteConfirmationWindow', {
    extend: 'Ext.window.Window',
    title: 'Paste...',
    modal: true,
    items: [{
        xtype: 'container',
        layout: {
            type: 'vbox'
        }
        items: [{
            xtype: 'container',
            layout: {
                type: 'vbox'
            },
            resizable: false,
            items: [{
                xtype: 'container',
                flex: 2,
                layout: {
                    type: 'vbox'
                },
                items: [{
                    xtype: 'radiogroup',
                    columns: 1,
                    hideLabel: true,
                    items: [{
                        boxLabel: 'Sequence (with features if available)',
                        name: 'pasteFormatField',
                        inputValue: 'forward'
                    }, {
                        boxLabel: 'Reverse Complement',
                        name: 'pasteFormatField',
                        inputValue: 'reverse'
                    }]
                }]
            }, {
                xtype: 'container',
                flex: 1,
                layout: {
                    type: 'hbox'
                },
                items: [{
                    xtype: 'button',
                    text: 'Ok',
                    cls: 'pasteConfirmationOkButton'
                }, {
                    xtype: 'button',
                    text: 'Cancel',
                    cls: 'pasteConfirmationCancelButton'
                }]
            }]
        }]
    }]
});
