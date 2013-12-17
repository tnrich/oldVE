/**
 * Dialog that appears upon copying from VE. Allows the user to copy to the system clipboard.
 * @class Vede.view.ve.CopySequenceWindow
 */
Ext.define('Vede.view.ve.CopySequenceWindow', {
    extend: 'Ext.window.Window',
    title: 'Copy Sequence Text',
    modal: true,
    height: 300,
    width: 400,
    resizable: true,
    layout: {
        type: 'vbox'
    },
    items: [{
        xtype: 'displayfield',
        value: 'Please copy the selected text below:'
    }, {
        xtype: 'textarea',
        cls: 'copySequenceTextArea',
        grow: true,
        height: 250,
        width: 392
    }]
});
