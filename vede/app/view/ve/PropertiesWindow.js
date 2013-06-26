Ext.define('Vede.view.ve.PropertiesWindow', {
    extend: 'Ext.window.Window',
    requires: ["Teselagen.manager.ProjectManager"],
    title: 'Properties',
    id: 'PropertiesWindow',
    modal: true,
    layout: {
    	type: 'vbox',
    	//align: 'stretch'
    },
    width: 400,
    resizable: false,
    initComponent: function() {
    	var me = this;
    	Ext.applyIf(me, {
    		items: [
                {
                    xtype: 'container',
                    layout: 'vbox',
                    items: [{
                            xtype: 'textfield',
                            fieldLabel: 'Sequence Name',
                            id: 'propertiesWindowSequenceNameField',
                            allowBlank: false,
                        }, {
                            xtype: 'textareafield',
                            fieldLabel: 'Description',
                            id: 'propertiesWindowDescriptionArea',
                            height: 100
                        }, {
                            xtype: 'textfield',
                            fieldLabel: 'Owner',
                            id: 'propertiesWindowOwnerField',
                            disabled: true,
                            disabledCls: 'x-panel',
                        }, {
                            xtype: 'textfield',
                            fieldLabel: 'Created',
                            id: 'propertiesWindowCreatedField',
                            disabled: true,
                            disabledCls: 'x-panel',
                        }, {
                            xtype: 'textfield',
                            fieldLabel: 'Last Modified',
                            id: 'propertiesWindowLastModifiedField',
                            disabled: true,
                            disabledCls: 'x-panel',
                        },
                        /*{
                            xtype: 'gridpanel',
                            forceFit: true,
                            id: 'propertiesWindowPermissionsGrid',
                            
                        },*/
                        {
                            xtype: 'container',
                            layout: "hbox",
                            items: [{
                                    xtype: 'button',
                                    id: 'propertiesWindowOKButton',
                                    margin: 2,
                                    padding: 2,
                                    text: 'Ok',                                    
                                }, {
                                    xtype: 'button',
                                    margin: 2,
                                    padding: 2,
                                    text: 'Cancel',
                                    handler: function() {me.close();}
                                }
                            ]
                        }
                    ]
                },
	        ]
    	});
    	me.callParent(arguments);
    }
});
