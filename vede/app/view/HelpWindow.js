Ext.define('Vede.view.HelpWindow', {
    extend: 'Ext.window.Window',

    height: 360,
    width: 771,
    title: 'Help',
    autodestoy: true,
    items: [{
        xtype: 'form',
        height: 361,
        bodyPadding: 10,
        title: '',
        items: [{
            xtype: 'fieldset',
            height: 115,
            title: 'Send feedback',
            items: [{
                xtype: 'textareafield',
                anchor: '100%',
                name: 'feedback',
                emptyText: 'Enter feedback or comments here.',
                /*
                enableKeyEvents: true,
                listeners: {
                    keyup: function(textField,key){
                        textLength = textField.getValue().length;
                        if(key.button==7) textField.setValue(textField.getValue().substring(0,textLength-1))
                    }
                }
                */
            }, {
                xtype: 'button',
                text: 'Send',
                id: 'reportFeedbackBtn'
            }]
        }, {
            xtype: 'fieldset',
            height: 185,
            title: 'Report Error',
            items: [{
                xtype: 'textareafield',
                anchor: '100%',
                name: 'error',
                emptyText: 'Enter specific error here.',
            }, {
                xtype: 'textareafield',
                anchor: '100%',
                name: 'error_feedback',
                emptyText: 'Enter additional feedback here.',
            }, {
                xtype: 'button',
                text: 'Report Error',
                id: 'reportErrorBtn'
            }]
        }]
    }],
    /*
    listeners: {
        close: function (panel) {
            panel.hide();
            return false;
        }
    }
    */

});