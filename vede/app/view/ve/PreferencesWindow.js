Ext.define('Vede.view.ve.PreferencesWindow', {
    extend: 'Ext.window.Window',
    requires: ["Teselagen.manager.ProjectManager"],
    title: 'Preferences',
    cls: 'PreferencesWindow',
    modal: true,
    layout: {
    	type: 'vbox'
    },
    width: 420,
    resizable: false,
    initComponent: function() {
    	var me = this;
    	Ext.applyIf(me, {
    		items: [
                {
                    xtype: 'tabpanel',
                    width: 420,
                    items: [
                        {
                            xtype: 'panel',
                            cls: 'preferencesGeneral',
                            title: 'General',
                            layout: {
                                align: 'stretch',
                                type: 'vbox'
                            },
                            margins: '10 5 5 10',
                            items: [
                                {
                                    xtype: 'fieldcontainer',
                                    layout: {
                                        type: 'hbox'
                                    },
                                    fieldLabel: 'BP Per Row',
                                    labelWidth: 140,
                                    items: [
                                        {
                                            xtype: 'numberfield',
                                            cls: 'bpPerRowNumberfield',
                                            maxWidth: 60,
                                            disabled: true
                                        },
                                        {
                                            xtype: 'checkbox',
                                            cls: 'floatingSequenceWidthCheckbox',
                                            boxLabel: 'Floating Sequence Width',
                                            margins: '0 0 0 10'
                                        }
                                    ]
                                },
                                {
                                    xtype: 'fieldcontainer',
                                    layout: {
                                        type: 'hbox'
                                    },
                                    fieldLabel: 'Max Cutoffs',
                                    labelWidth: 140,
                                    items: [
                                        {
                                            xtype: 'numberfield',
                                            cls: 'maxCutoffsNumberfield',
                                            maxWidth: 60,
                                            disabled: true
                                        },
                                        {
                                            xtype: 'checkbox',
                                            cls: 'unlimitedCutoffsCheckbox',
                                            boxLabel: 'Unlimited Cutoffs',
                                            margins: '0 0 0 10'
                                        }
                                    ]
                                },
                                {
                                    xtype: 'numberfield',
                                    cls: 'orfMaximumLengthNumberfield',
                                    maxWidth: 205,
                                    fieldLabel: 'ORF Maximum Length',
                                    labelWidth: 140,
                                    padding: '0 0 5 0'
                                },
                                {
                                    xtype: 'menuseparator',
                                    maxWidth: 390,
                                    padding: '0 0 10 0'
                                },
                                {
                                    xtype: 'numberfield',
                                    cls: 'sequenceFontSizeNumberfield',
                                    maxWidth: 205,
                                    fieldLabel: 'Sequence Font Size',
                                    labelWidth: 140
                                },
                                {
                                    xtype: 'numberfield',
                                    cls: 'labelsFontSizeNumberfield',
                                    maxWidth: 205,
                                    fieldLabel: 'Labels Font Size',
                                    labelWidth: 140
                                }
                            ]
                        }
                    ]
                },
                {
                    xtype: 'container',
                    layout: {
                        type: 'hbox'
                    },
                    margins: '0 0 0 320',
                    items: [{
                            xtype: 'button',
                            cls: 'preferencesWindowOKButton',
                            text: 'Ok',
                            align: 'right',
                            margin: '4 2 2 2',
                            padding: 2                          
                        }, {
                            xtype: 'button',
                            text: 'Cancel',
                            margin: '4 2 2 2',
                            padding: 2,
                            handler: function() {
                                me.close();
                            }
                        }
                    ]
                }
            ]
    	});
    	me.callParent(arguments);
    }
});